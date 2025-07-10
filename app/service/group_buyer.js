/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-05-18 23:14:34
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-07-01 10:48:42
 * @FilePath: \Mini_program_backend\app\service\group_buyer.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

const Service = require("egg").Service;

class Group_buyerService extends Service {
  async joinGroup(params = {}) {
    const { app, ctx } = this;
    const { group } = params;
    const { goodsOrder } = group;
    const { group_id, buyer_id } = group;
    const { user_id, userName } = goodsOrder || {};

    return await app.transaction(async transaction => {
      const crateInfo = app.getCrateInfo(user_id, userName);
      // 检查是否已参团
      const exists = await app.model.GroupBuyer.findByGroupId({
        group_id,
        buyer_id,
      });
      if (exists) {
        const error = new Error("您已参加过该团购");
        error.name = "joinGroupError";
        throw error;
      }

      // 获取完整的团购信息（新增min_points_amt字段）
      const groupInfo = await app.model.Groups.findByPk(group_id, {
        attributes: [
          "group_status",
          "current_members",
          "end_time",
          "min_points_amt",
          "group_no",
          "min_members",
        ],
        transaction,
      });

      // 新增验证逻辑 ▼▼▼
      // 验证健康币是否足够
      const userPoints = await ctx.service.points.checkUserPoints(
        user_id,
        groupInfo.min_points_amt
      );
      // 验证消费金额是否达标
      const consumptionValid = await ctx.service.points.CheckForAvailable({
        user_id,
      });

      console.log("userPoints", userPoints);
      console.log("consumptionValid", consumptionValid);

      // 当两者都不满足时
      if (!userPoints && !consumptionValid) {
        // 检查历史团购订单
        const historicalGroups = await app.model.Groups.count({
          where: { creatorId: user_id },
          transaction,
        });

        if (historicalGroups >= 2) {
          const error = new Error("健康币不足且消费未达标，无法参与新拼团");
          error.name = "GroupJoinConditionError";
          throw error;
        }
      } else if (!userPoints) {
        const error = new Error("健康币不足");
        error.name = "GroupJoinConditionError";
        throw error;
      } else if (!consumptionValid) {
        const error = new Error("消费未达标");
        error.name = "GroupJoinConditionError";
        throw error;
      }
      // 新增验证逻辑 ▲▲▲

      const order = await ctx.service.order.saveNew(goodsOrder, {
        transaction,
      });
      if (!order) {
        const error = new Error("创建订单失败");
        error.name = "joinGroupError";
        throw error;
      }

      // 新增团购商品项创建 ▼▼▼
      // 获取团购原始商品项
      const originalGroup = await app.model.Groups.findByPk(group_id, {
        include: [
          {
            model: app.model.GroupItem,
            as: "groupItem",
          },
        ],
        transaction,
      });

      // 创建参团者的商品项
      const groupItems = originalGroup.groupItem.map(item => ({
        group_id,
        goods_id: item.goods_id,
        spec_id: item.spec_id,
        order_id: order.orderUuids[0], // 关联新建的订单
        group_price: item.group_price || order.totalAmount,
        item_status: 1, // 默认有效状态
        gb_time: new Date(),
        ...crateInfo,
      }));

      // const groupBuyer = originalGroup.groupItem.map(item => ({
      //   group_id,
      //   buyer_id,
      //   item_id: item.item_id,
      //   order_id: order.uuid,
      //   gb_price: group.gb_price || item.gb_price,
      //   gb_status: 1,
      //   gb_time: new Date(),
      //   ...item,
      //   ...crateInfo,
      // }));

      const groupItem = await app.model.GroupItem.bulkCreate(groupItems, {
        transaction,
      });
      // await app.model.GroupBuyer.bulkCreate(groupBuyer, { transaction });
      // 新增团购商品项创建 ▲▲▲

      // 新增健康币扣减 ▼▼▼
      if (groupInfo.min_points_amt > 0) {
        await ctx.service.points.subtract({
          user_id,
          points: groupInfo.min_points_amt,
          source: "group_join",
          description: `参加拼团 ${groupInfo.group_no}`,
          transaction,
        });
      }

      // 创建参团记录
      const buyer = await app.model.GroupBuyer.saveNew(
        {
          ...group,
          ...crateInfo,
          order_id: order.orderUuids[0],
          item_id: groupItem[0].item_id,
          gb_time: new Date(), // 确保有时间戳
          gb_status: 1, // 默认参团状态
        },
        { transaction }
      );

      // Redis Lua脚本原子操作
      const luaScript = `
        local key = KEYS[1]
        local minMembers = tonumber(ARGV[1])
        local current = redis.call('GET', key) or 0
        current = tonumber(current)

        -- 添加并发控制：如果已满直接返回错误
        if current >= minMembers then
          return {-1, 0} -- 第一个参数-1表示已满
        end

        redis.call('SET', key, current + 1) -- 确保更新人数
        
        if current + 1 >= minMembers then
          return {current + 1, 1}
        else
          return {current + 1, 0}
        end
      `;

      try {
        ctx.logger.info(`[拼团] 执行原子操作参数: 
          KEYS[1]=group:${group_id}:current_members, 
          ARGV[1]=${groupInfo.min_members}`);

        // 执行原子操作
        const [newCount, isSuccess] = await ctx.service.redis
          .getClient("group")
          .eval(
            luaScript,
            1,
            `group:${group_id}:current_members`,
            groupInfo.min_members
          );

        ctx.logger.info(
          `[拼团] Redis返回: newCount=${newCount}, isSuccess=${isSuccess}`
        );

        // 新增人数已满检查
        if (newCount === -1) {
          const error = new Error("当前拼团人数已满");
          error.name = "GroupFullError";
          throw error;
        }

        // 更新团状态（如果成团）
        if (isSuccess === 1 && groupInfo.group_status !== "2") {
          await app.model.Groups.update(
            {
              group_status: "2",
              current_members: newCount,
            },
            {
              where: { group_id },
              transaction,
            }
          );

          // 删除Redis缓存 ▼▼▼
          const redis = ctx.service.redis;
          await redis.del(`group:${group_id}:current_members`, "group");
          await redis.del(`group:${group_id}:end_time`, "group");

          // 设置新的延迟任务（1天后执行）▼▼▼
          await ctx.service.bullmq.addDelayJob(
            "taskQueue",
            "cancelExpiredGroup", // 新任务类型
            { groupId: group_id },
            86400, // 1天 = 86400秒
            { transaction }
          );

          // 获取所有参团成员 ▼▼▼
          const groupWithBuyers = await app.model.Groups.getGroupById(group_id);
          const buyers =
            groupWithBuyers?.groupBuyer?.map(b => b.user?.openid) || [];

          // 给所有参团成员发送消息
          for (const openid of buyers) {
            try {
              await ctx.service.notice.sendSubscribeMessage({
                openid,
                page: `subpackageOrder/pages/order/index?currentTab=${1}`,
                data: {
                  thing1: "拼团已成团",
                  character_string2: groupInfo.group_no,
                  amount10: (groupInfo.min_amt || 0).toFixed(2),
                  number6: 1,
                  thing5: "",
                },
              });
            } catch (e) {
              ctx.logger.error(`用户 ${openid} 消息发送失败:`, e);
            }
          }
          // 新增批量发送 ▲▲▲
        } else {
          // ▼▼▼ 新增非成团状态的人数同步 ▼▼▼
          await app.model.Groups.update(
            {
              current_members: newCount,
            },
            { where: { group_id }, transaction }
          );
        }

        return {
          buyer,
          current_members: newCount,
          group_status: isSuccess === 1 ? "2" : groupInfo.group_status,
          message: isSuccess === 1 ? "成团成功" : "拼团成功",
          orderInfo: {
            orderId: order.orderUuids[0],
            orgUuid: order.orgUuid, // 从订单对象中获取组织ID
          },
        };
      } catch (e) {
        // 异常处理移到外部
        // 当Redis数据不存在且未超时的情况处理
        console.log("Redis数据不存在且未超时：", e);
        if (e.message.includes("nil value")) {
          const now = new Date();
          if (now < groupInfo.end_time) {
            // 从数据库获取当前人数
            const currentMembers = await app.model.GroupBuyer.count({
              where: { group_id },
              transaction,
            });

            if (currentMembers > groupInfo.min_members) {
              const error = new Error("当前拼团人数已满");
              error.name = "GroupFullError";
              throw error;
            } else if (currentMembers === groupInfo.min_members) {
              // 更新团状态为已成团
              await app.model.Groups.update(
                { group_status: "2" },
                { where: { group_id }, transaction }
              );

              // 设置新的延迟任务（与正常流程保持一致）
              await ctx.service.bullmq.addDelayJob(
                "taskQueue",
                "cancelExpiredGroup",
                { groupId: group_id },
                86400,
                { transaction }
              );

              // 获取所有参团成员并发送消息
              const groupWithBuyers = await app.model.Groups.getGroupById(
                group_id
              );
              const buyers =
                groupWithBuyers?.groupBuyer?.map(b => b.user?.openid) || [];
              for (const openid of buyers) {
                await ctx.service.notice.sendSubscribeMessage({
                  openid,
                  page: `subpackageOrder/pages/order/index?currentTab=${1}`,
                  data: {
                    thing1: "拼团已成团",
                    character_string2: groupInfo.group_no,
                    amount10: (groupInfo.min_amt || 0).toFixed(2),
                    number6: 1,
                    thing5: "",
                  },
                });
              }

              return {
                buyer,
                current_members: currentMembers,
                group_status: groupInfo.group_status,
                message: "成团成功",
                orderInfo: {
                  orderId: order.uuid,
                  orgUuid: order.orgUuid, // 从订单对象中获取组织ID
                },
              };
            }

            // 更新数据库和Redis
            await app.model.Groups.update(
              { current_members: currentMembers },
              { where: { group_id }, transaction }
            );

            await ctx.service.redis.set(
              `group:${group_id}:current_members`,
              currentMembers,
              Math.floor((groupInfo.end_time - now) / 1000),
              "group"
            );

            await app.service.redis.set(
              `group:${group_id}:end_time`,
              groupInfo.end_time - now,
              Math.floor((groupInfo.end_time - now) / 1000),
              "group"
            );

            return {
              buyer,
              current_members: currentMembers,
              group_status: groupInfo.group_status,
              message: "拼团成功",
              orderInfo: {
                orderId: order.uuid,
                orgUuid: order.orgUuid, // 从订单对象中获取组织ID
              },
            };
          }
        }
        throw e;
      }
    });
  }
}

module.exports = Group_buyerService;
