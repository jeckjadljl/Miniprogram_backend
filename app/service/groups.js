/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-05-18 12:12:00
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-05-19 21:15:13
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

    try {
      const result = await app.model.Groups.saveNew({
        ...group,
        ...crateInfo,
        // 系统生成字段
        group_no: app.generateGroupNo(user_id), // 生成团号
        begin_time: new Date(),
        end_time: new Date(Date.now() + 86400000),
      });

      if (result) {
        const order = await ctx.service.order.saveNew(goodsOrder);

        if (order) {
          // 设置Redis缓存
          const redis = ctx.service.redis;
          const groupKey = `group:${result.group_id}`;

          // 存储初始参团人数（假设创建时已有发起人）
          // await redis.set(`${groupKey}:members`, 1, 86400, "group");
          // 添加current_members设置
          await redis.set(
            `${groupKey}:current_members`,
            1, // 初始值为发起人自己
            Math.floor((result.end_time - Date.now()) / 1000),
            "group"
          );

          // 存储结束时间戳
          await redis.set(
            `${groupKey}:end_time`,
            result.end_time.getTime(),
            86400,
            "group"
          );

          await ctx.service.points.subtract({
            user_id: order.user_id,
            points: min_points_amt,
            source: "group_buy",
            description: `团购 ${group.group_no} 健康币预支付`,
          });
          this.ctx.logger.info(
            `用户${order.user_id}预支付${min_points_amt}健康币发起团购`
          );
        }
      }

      return result;
    } catch (e) {
      ctx.logger.error("创建团购失败:", e);
      throw this.ctx.helper.createError({
        code: 1001,
        message: "团购创建失败: " + e.message,
      });
    }
  }

  async getGroupStatus(groupId) {
    const { ctx } = this;
    const redis = ctx.service.redis;

    const [members, endTime] = await Promise.all([
      redis.get(`group:${groupId}:current_members`, "group"),
      redis.get(`group:${groupId}:end_time`, "group"),
    ]);

    const currentTime = Date.now();
    const remaining = endTime ? Math.max(endTime - currentTime, 0) : 0;

    return {
      members: parseInt(members) || 0,
      remainingTime: Math.round(remaining / 1000), // 返回剩余秒数
    };
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
