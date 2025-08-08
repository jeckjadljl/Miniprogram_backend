/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-05-18 12:12:00
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-07-19 16:21:47
 * @FilePath: \Mini_program_backend\app\service\groups.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

const Service = require("egg").Service;

class GroupService extends Service {
  /**
   * 创建团购记录
   * @param {Object} params - 创建参数
   * @param {Object} userInfo - 用户信息
   * @returns {Promise<Model>} 创建的团购实例
   */
  async createGroup(params = {}) {
    const { ctx, app } = this;
    const { group } = params;
    const { goodsOrder } = group;
    const { user_id, userName } = goodsOrder;
    const { min_points_amt, buyer_points_amt } = group;
    const crateInfo = app.getCrateInfo(user_id, userName);

    return await app.transaction(async transaction => {
      try {
        // 校验用户当前进行中的团购数量
        const ongoingGroups = await app.model.Groups.count({
          where: {
            creatorId: user_id,
            group_status: 1, // 1表示进行中的团购
          },
        });

        if (ongoingGroups >= 2) {
          const error = new Error(
            "同时最多只能参与两个拼团，请等待已有拼团结束"
          );
          error.name = "GroupLimitExceeded";
          throw error;
        }

        const order = await ctx.service.order.saveNew(goodsOrder, {
          transaction,
        });

        if (order) {
          const result = await app.model.Groups.saveNew(
            {
              ...group,
              ...crateInfo,
              // 系统生成字段
              order_id: order.orderUuids[0],
              group_no: app.generateGroupNo(user_id), // 生成团号
              current_members: 1,
              begin_time: new Date(),
              end_time: new Date(Date.now() + 259200000),
            },
            { transaction }
          );

          if (result) {
            // 获取真正的团购实例
            const groupInstance = result.groups; // 根据模型层返回结构调整
            const endTime = groupInstance.end_time; // 从实例获取时间

            // 设置Redis缓存
            const redis = ctx.service.redis;
            const groupKey = `group:${groupInstance.group_id}`;

            // 统一时间计算逻辑
            const endTimestamp = endTime.getTime();
            const currentTimestamp = Date.now();
            const ttl = Math.max(
              Math.floor((endTimestamp - currentTimestamp) / 1000),
              1
            );

            // 原子化Redis操作
            await Promise.all([
              redis.set(`${groupKey}:current_members`, 1, ttl, "group"),
              redis.set(`${groupKey}:end_time`, endTimestamp, ttl, "group"),
            ]);

            // 新增延时任务（在团购结束时触发）
            // await ctx.service.bullmq.addDelayJob(
            //   "taskQueue",
            //   "cancelExpiredGroup",
            //   {
            //     groupId: result.group_id,
            //   },
            //   Math.max(endTimestamp - currentTimestamp, 0)
            // );

            await ctx.service.points.subtract({
              user_id: order.user_id,
              points: min_points_amt,
              source: "group_buy",
              description: `团购 ${groupInstance.group_no} 健康币预支付`,
            });
            this.ctx.logger.info(
              `用户${order.user_id}预支付${min_points_amt}健康币发起团购`
            );
          }

          return result;
        }
      } catch (e) {
        ctx.logger.error("创建团购失败:", e);
        throw e;
      }
    });
  }

  async getGroupStatus(params = {}) {
    const { ctx, app } = this;
    const { group_id } = params;
    const redis = ctx.service.redis;

    const [members, endTime] = await Promise.all([
      redis.get(`group:${group_id}:current_members`, "group"),
      redis.get(`group:${group_id}:end_time`, "group"),
    ]);

    // 新增数据库回查逻辑
    let finalEndTime = endTime ? Number(endTime) : null;
    let currentMember = members ? parseInt(members, 10) : null;
    let groupStatus = null; // 新增状态字段

    // 缓存不完整时查询数据库（新增独立校验逻辑）
    if (!finalEndTime || currentMember === null) {
      const group = await app.model.Groups.getGroupById(group_id);
      if (group) {
        // 仅补充缺失数据，不覆盖已有缓存值
        finalEndTime = finalEndTime || group.end_time?.getTime() || 0;
        currentMember = currentMember ?? (group.current_members || 0);
        groupStatus = group.group_status; // 获取团状态
      }
    }

    // 新增状态判断逻辑 ▼▼▼
    let remaining = 0;
    if (groupStatus === "2") {
      // 2表示已成团状态
      // 从延时任务获取剩余时间
      const delayJob = await ctx.service.bullmq.getDelayedJob(
        "taskQueue",
        "cancelExpiredGroup",
        { groupId: group_id }
      );

      remaining = delayJob
        ? delayJob.delay // 直接获取任务延迟时间（毫秒）
        : 86400 * 1000; // 默认返回24小时（兼容任务已执行的情况）
    } else {
      const currentTime = Date.now();
      remaining = Math.max(finalEndTime - currentTime, 0);
    }
    // 新增状态判断逻辑 ▲▲▲

    return {
      members: currentMember || 0,
      remainingTime: Math.round(remaining / 1000), // 返回剩余秒数
      groupStatus: groupStatus || "1", // 返回当前状态给前端
    };
  }

  async getGroupById(params = {}) {
    const { ctx, app } = this;
    const { group_id } = params;

    const result = await app.model.Groups.getGroupById(group_id);
    return result;
  }

  async getGroupByOrderId(params = {}) {
    const { ctx, app } = this;
    const { order_id } = params;

    const result = await app.model.GroupItem.getGroupByItemId(order_id);
    return result;
  }

  // 添加定时任务处理过期团购
  async handleExpiredGroups() {
    const { app, ctx } = this;
    const now = new Date();

    // 1. 查找已过期未处理的团购
    const expiredGroups = await app.model.Groups.findAll({
      where: {
        end_time: { [app.Sequelize.Op.lt]: now },
        group_status: "1", // 只处理进行中的团购
      },
      include: [
        {
          model: app.model.GroupBuyer,
          attributes: ["buyer_id", "order_id"],
        },
      ],
    });

    for (const group of expiredGroups) {
      await app.transaction(async transaction => {
        // 2. 取消关联订单
        const orderService = ctx.service.order;
        const pointsService = ctx.service.points;

        for (const buyer of group.GroupBuyers) {
          // 3. 退还健康币
          if (group.min_points_amt > 0) {
            await pointsService.add({
              user_id: buyer.buyer_id,
              points: group.min_points_amt,
              source: "group_refund",
              description: `团购 ${group.group_no} 超时退款`,
              transaction,
            });
          }

          // 4. 取消订单
          if (buyer.order_id) {
            const goodsOrder = await ctx.service.order.getByUuid(
              buyer.order_id
            );
            await orderService.cancel(goodsOrder.dataValues, { transaction });
          }
        }

        // 5. 更新团购状态
        await group.update(
          {
            group_status: "3",
            current_members: 0,
          },
          { transaction }
        );
      });
    }
  }
}

module.exports = GroupService;
