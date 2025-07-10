/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-06-02 22:39:57
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-06-20 10:34:43
 * @FilePath: \Mini_program_backend\app\job\task.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
// app/job/task.js
module.exports = app => ({
  // 订单取消任务处理器
  async closePaymentAndOrders(job) {
    const { paymentId, orderIds, outTradeNo } = job.data;
    const { ctx } = this;

    try {
      app.logger.info(`[Job] 开始批量取消订单任务，支付记录ID: ${paymentId}`);

      // 循环处理每个订单 ▼▼▼
      for (const orderId of orderIds) {
        const goodsOrder = await ctx.service.order.getByUuid(orderId);
        if (goodsOrder && goodsOrder.order_status === "initial") {
          await ctx.service.order.cancel(goodsOrder.dataValues);
          app.logger.info(`[Job] 订单取消成功: ${orderId}`);
        }
      }

      // 关闭支付订单 ▼▼▼
      const payment = await ctx.service.payments.getByUuid(paymentId);
      if (payment) {
        await ctx.service.payments.closeOrder(outTradeNo);
      }

      app.logger.info(`[Job] 支付记录${paymentId}关联订单全部处理完成`);
    } catch (error) {
      app.logger.error(`[Job] 批量取消订单失败: ${paymentId}`, error);
      throw error;
    }
  },

  async closePayment(job) {
    const { outTradeNo } = job.data;
    const { ctx } = this;

    try {
      app.logger.info(`[Job] 关闭支付订单任务开始处理: ${outTradeNo}`);
      const result = await ctx.service.payments.closeOrder(outTradeNo);
      if (result.success === true) {
        app.logger.info(`[Job] 支付订单关闭成功: ${outTradeNo}`);
      } else {
        app.logger.error(`[Job] 支付订单关闭失败: ${outTradeNo}`);
      }
    } catch (error) {
      app.logger.error(`[Job] 订单取消失败: ${outTradeNo}`, error);
      throw error; // 确保失败任务会被重试
    }
  },

  async distributeReward(job) {
    const { ctx } = this;
    const { uuid } = job.data;
    try {
      const order = await ctx.service.order.getByUuid(uuid);
      if (
        (order && order.order_status === "review") ||
        order.order_status === "completed"
      ) {
        await ctx.service.rewards.processCompletedOrder(order, job.data);
        console.log(`订单奖励发放成功: ${uuid}`);
      }
    } catch (error) {
      app.logger.error(`[Job] 订单奖励发放失败: ${uuid}`, error);
      throw error; // 确保失败任务会被重试
    }
  },

  // 新增团购过期任务处理器
  async cancelExpiredGroup(job) {
    const { app } = this;
    const { groupId } = job.data;

    try {
      const group = await app.model.Groups.findByPk(groupId, {
        include: [
          {
            model: app.model.GroupBuyer,
            attributes: ["buyer_id", "order_id"],
          },
        ],
      });

      if (!group) {
        app.logger.error(`[Job] 团购不存在: ${groupId}`);
        return;
      }

      await app.transaction(async transaction => {
        const orderService = this.ctx.service.order;
        const pointsService = this.ctx.service.points;

        for (const buyer of group.GroupBuyers) {
          // 退还健康币
          if (group.min_points_amt > 0) {
            await pointsService.add({
              user_id: buyer.buyer_id,
              points: group.min_points_amt,
              source: "group_refund",
              description: `团购 ${group.group_no} 超时退款`,
              transaction,
            });
          }

          // 取消关联订单
          if (buyer.order_id) {
            const goodsOrder = await this.ctx.service.order.getByUuid(
              buyer.order_id
            );
            await orderService.cancel(goodsOrder.dataValues, { transaction });
          }
        }

        // 更新团购状态
        await group.update(
          {
            group_status: "3",
            current_members: 0,
          },
          { transaction }
        );
      });

      app.logger.info(`[Job] 团购处理完成: ${groupId}`);
    } catch (error) {
      app.logger.error(`[Job] 团购处理失败: ${groupId}`, error);
      throw error;
    }
  },
});
