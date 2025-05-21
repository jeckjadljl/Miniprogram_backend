/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-05-06 16:42:03
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-05-06 17:34:40
 * @FilePath: \Mini_program_backend\app\service\rewards.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

const Service = require("egg").Service;

class RewardsService extends Service {
  async processCompletedOrder({ order, userId, totalAmount }) {
    const { ctx } = this;

    return await ctx.model.transaction(async transaction => {
      // 获取会员等级
      const membership = await ctx.service.membership.checkAndUpgradeMembership(
        userId,
        totalAmount
      );

      // 获取订单商品明细
      const orderData = ctx.service.order.getOrderFromPayments({
        uuid: order.uuid,
      });

      const allItems = [];
      let pointAmount = 0;
      for (const item of orderData.orderitems) {
        // 获取商品类别信息
        const goods = await ctx.service.goods.get({
          goods_id: item.goods_id,
          orgUuid: orderData.orgUuid,
        });

        // 添加空值检查
        if (!goods) {
          ctx.logger.warn(`未找到商品ID为 ${item.goods_id} 的商品信息`);
          continue;
        }

        // ▼▼▼ 新增健康币扣减逻辑 ▼▼▼
        if (item.points_amount && item.points_amount > 0) {
          pointAmount += item.points_amount;
        }

        allItems.push({
          item,
          orderData,
          goods,
        });
      }

      // 执行分佣逻辑
      await ctx.service.referral.distributeReferralReward(
        {
          user_id: userId,
          items: allItems,
          totalSpent: totalAmount,
          membershipLevel: membership.memberLevel,
        },
        { transaction }
      );

      await ctx.service.points.subtract({
        user_id: order.user_id,
        points: pointAmount, // 使用负数进行扣减
        source: "order_deduction",
        description: `订单 ${order.uuid} 健康币抵扣`,
      });
      this.ctx.logger.info(
        `用户${order.user_id}扣减${pointAmount}健康币，订单ID: ${order.uuid}`
      );

      // 标记订单奖励状态
      // await ctx.model.Order.update(
      //   { reward_status: 'processed' },
      //   { where: { uuid: order.uuid }, transaction }
      // );
    });
  }
}

module.exports = RewardsService;
