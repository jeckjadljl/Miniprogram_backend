/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-05-06 16:42:03
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-07-19 16:39:24
 * @FilePath: \Mini_program_backend\app\service\rewards.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

const Service = require("egg").Service;

class RewardsService extends Service {
  async processCompletedOrder(order, jobData) {
    const { ctx } = this;

    return await ctx.model.transaction(async transaction => {
      // 获取会员等级
      const membership = await ctx.service.membership.checkAndUpgradeMembership(
        order.user_id,
        order.payment_amount
      );

      // 获取订单商品明细
      const orderData = await ctx.service.order.getOrderFromPayments({
        uuid: order.uuid,
      });

      // ▼▼▼ 添加空值检查 ▼▼▼
      if (!orderData || !Array.isArray(orderData.orderitems)) {
        ctx.logger.error(`订单数据异常，uuid: ${order.uuid}`);
        throw new Error(`无效的订单数据: ${order.uuid}`);
      }

      const allItems = [];
      let pointAmount = 0;
      for (const item of orderData.orderitems) {
        // ▼▼▼ 添加商品项过滤 ▼▼▼
        if (jobData.goods_id && !jobData.goods_id === item.goods_id) {
          continue;
        }

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

        // 新增评价奖励计算 ▼▼▼
        if (jobData?.reviewData && item.goods_id === jobData.goods_id) {
          const { imageCount, rating, reviewText } = jobData.reviewData;

          // 计算有效字数
          const cleanReview = reviewText.replace(
            /[^\u4e00-\u9fa5a-zA-Z0-9]/g,
            ""
          ).length;

          // 优先使用支付金额
          const itemPrice =
            item.payment_amount > 0
              ? item.payment_amount * item.quantity
              : item.salePrice * item.quantity;
          console.log("itemPrice:", itemPrice);

          // ▼▼▼ 新增商品价格10%奖励 ▼▼▼
          const baseReward = itemPrice * 0.1;
          const baseRewardFinal = Number(
            (Math.ceil(baseReward * 10) / 10).toFixed(2)
          );
          await this.addReviewReward(
            order.user_id,
            baseRewardFinal,
            order.uuid,
            "订单结算10%奖励"
          );
          this.ctx.logger.info(
            `用户${order.user_id}获得商品价格10%奖励健康币${baseRewardFinal}`
          );

          // 进阶奖励（示例）
          if (rating === 5 && imageCount >= 2 && cleanReview >= 20) {
            const amount = itemPrice * 0.05;
            const reward = Number((Math.ceil(amount * 10) / 10).toFixed(2));
            await this.addReviewReward(order.user_id, reward, order.uuid);
          } else if (imageCount >= 1 && rating >= 4 && cleanReview >= 10) {
            // 基础奖励
            // 自定义舍入规则：分位≥5进1，否则舍去
            const amount = itemPrice * 0.03;
            const reward = Number((Math.ceil(amount * 10) / 10).toFixed(2));
            await this.addReviewReward(order.user_id, reward, order.uuid);
          }
        }

        // ▼▼▼ 新增健康币扣减逻辑 ▼▼▼
        if (item.points_amount && item.points_amount > 0) {
          pointAmount += item.points_amount;
        }

        allItems.push({
          item,
          goods,
        });
      }

      console.log("结算商品项:", allItems);
      // 执行分佣逻辑
      await ctx.service.referral.distributeReferralReward(
        order.user_id,
        allItems,
        order.payment_amount,
        membership.memberLevel,
        { transaction }
      );

      await ctx.service.points.subtract({
        user_id: order.user_id,
        points: pointAmount, // 使用负数进行扣减
        source: "order_deduction",
        description: "订单健康币抵扣",
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

  // 新增奖励发放方法 ▼▼▼
  async addReviewReward(user_id, points, orderId, description) {
    await this.ctx.service.points.saveNew({
      user_id,
      points,
      source: "review_reward",
      description: description || "订单评价奖励",
    });
    this.ctx.logger.info(
      `用户${user_id}通过订单${orderId}获得评价奖励健康币${points}`
    );
  }

  async getAllRewardsRecord(params = {}) {
    const { app } = this;

    return await app.model.Rewards.getAllRewardsRecords({
      ...params,
      RewardsAttributes: [
        "id",
        "user_id",
        "txn_type",
        "txn_no",
        "order_id",
        "amount",
        "balance_after",
        "remark",
        "lastModifiedTime",
        "createdTime",
      ],
    });
  }
}

module.exports = RewardsService;
