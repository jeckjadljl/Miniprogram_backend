"use strict";

const Controller = require("../core/base_controller");

/**
 * Controller - 订货单
 * @class
 * @author ruiyong-lee
 */
class OrderController extends Controller {
  /**
   * 获取订单分页列表
   */
  async query() {
    const { ctx } = this;
    const goodsOrderData = await ctx.service.order.query(ctx.request.body);

    this.success(goodsOrderData);
  }

  /**
   * 获取订单详情
   */
  async get() {
    const { ctx } = this;
    const goodsOrder = await ctx.service.order.get(ctx.request.body);

    this.success(goodsOrder);
  }

  /**
   * 配送订单
   */
  async dispatch() {
    const { ctx } = this;
    const rule = {
      uuid: "string",
      version: "number",
    };
    ctx.validate(rule);
    const uuid = await ctx.service.order.dispatch(ctx.request.body);

    this.success(uuid);
  }

  /**
   * 完成订单
   */
  async complete() {
    const { ctx } = this;
    const rule = {
      uuid: "string",
      version: "number",
    };
    ctx.validate(rule);
    const uuid = await ctx.service.order.complete(ctx.request.body);

    this.success(uuid);
  }

  /**
   * 小程序订单
   */

  /**
   * 获取订单分页列表
   */
  async queryOrderBill() {
    const { ctx } = this;
    const goodsOrderData = await ctx.service.order.queryForWeapp(
      ctx.request.body
    );

    this.success(goodsOrderData);
  }

  /**
   * 获取订单详情
   */
  async getOrderBill() {
    const { ctx } = this;
    const goodsOrder = await ctx.service.order.get(ctx.request.body);

    this.success(goodsOrder);
  }
  /**
   * 创建订单
   */
  async createBill() {
    const { ctx } = this;
    const rule = {
      goodsOrder: "object",
    };
    ctx.validate(rule);
    const { orgUuid, goodsOrder, user_id, userName } = ctx.request.body;

    const result = await ctx.service.order.saveNew(
      orgUuid,
      goodsOrder,
      user_id,
      userName
    );
    this.success(result);
  }

  /**
   * 取消订单
   */
  async cancelBill() {
    const { ctx } = this;
    const rule = {
      uuid: "string",
    };
    ctx.validate(rule);
    const uuid = await ctx.service.order.cancel(ctx.request.body);

    this.success(uuid);
  }

  /**
   * 线下支付订单（相当于审核订单）
   */
  async auditBill() {
    const { ctx } = this;
    const rule = {
      uuid: "string",
      version: "number",
    };
    ctx.validate(rule);
    const uuid = await ctx.service.order.audit(ctx.request.body);

    this.success(uuid);
  }

  /**
   * 完成订单
   */
  async completeBill() {
    const { ctx } = this;
    const rule = {
      uuid: "string",
      version: "number",
    };
    ctx.validate(rule);
    const uuid = await ctx.service.order.complete(ctx.request.body);

    this.success(uuid);
  }

  async getUserOrders() {
    const { ctx } = this;
    const userId = ctx.request.body;
    const result = await ctx.service.order.getUserOrders(userId);
    this.success(result);
  }

  async getOrderDetails() {
    const { ctx } = this;
    const orderId = ctx.request.body;
    const result = await ctx.service.order.getOrderDetails(orderId);
    this.success(result);
  }
}

module.exports = OrderController;
