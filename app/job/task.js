/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-06-02 22:39:57
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-06-08 16:11:32
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

  // 其他任务处理器...
});
