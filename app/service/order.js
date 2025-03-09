/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-11-15 17:23:38
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-03-08 22:56:55
 * @FilePath: \Mini_program_backend\app\service\order.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

const Service = require("egg").Service;

class OrderService extends Service {
  /**
   * 获取订单分页列表
   * @param {object} params - 条件
   * @return {object|null} - 查找结果
   */
  async query(params = {}) {
    const { app } = this;
    const { Sequelize } = app;
    return await app.model.Order.query({
      ...params,
      attributes: [
        "uuid",
        "version",
        "order_status",
        "billNumber",
        "userName",
        "deliveryTimeTypeName",
        "remark",
        "createdTime",
        [
          Sequelize.fn("ROUND", Sequelize.col("payment_amount"), 2),
          "payment_amount",
        ],
      ],
    });
  }

  /**
   * 获取订单分页列表（小程序使用）
   * @param {object} params - 条件
   * @return {object|null} - 查找结果
   */
  async queryForWeapp(params = {}) {
    const { app } = this;
    const { Sequelize } = app;
    return await app.model.Order.query({
      ...params,
      attributes: [
        "uuid",
        "version",
        "order_status",
        "billNumber",
        [
          Sequelize.fn("ROUND", Sequelize.col("payment_amount"), 2),
          "payment_amount",
        ],
      ],
    });
  }

  /**
   * 获取订单
   * @param {object} params - 条件
   * @return {object|null} - 查找结果
   */
  async get(params = {}) {
    const { app, ctx } = this;
    const { Sequelize } = app;
    const orderData = await app.model.Order.get({
      ...params,
      orderAttributes: [
        "uuid",
        "version",
        "order_status",
        "billNumber",
        "address_id",
        "deliveryTimeType_id",
        "deliveryTimeTypeName",
        "deliveryTimeTypeRemark",
        "remark",
        "createdTime",
        "userName",
        [
          Sequelize.fn("ROUND", Sequelize.col("total_amount"), 2),
          "total_amount",
        ],
        [
          Sequelize.fn("ROUND", Sequelize.col("freight_amount"), 2),
          "freight_amount",
        ],
        [
          Sequelize.fn("ROUND", Sequelize.col("payment_amount"), 2),
          "payment_amount",
        ],
      ],
      orderLineAttributes: [
        "uuid",
        "thumbnail",
        "unitName",
        "name",
        "goods_id",
        "spec",
        [Sequelize.fn("ROUND", Sequelize.col("salePrice"), 2), "salePrice"],
        [
          Sequelize.fn("0+CAST", Sequelize.literal("quantity AS CHAR")),
          "quantity",
        ],
      ],
    });

    if (app._.isEmpty(orderData)) {
      ctx.throw(200, "查询不到指定的订单");
    }

    return orderData;
  }

  /**
   * 根据uuid获取订单，不验证组织
   * @param {string} uuid - 条件
   * @return {object|null} - 查找结果
   */
  async getByUuid(uuid) {
    const { app } = this;
    return await app.model.Order.getByUuid(uuid);
  }

  /**
   * 创建订单
   * @param orgUuid
   * @param {Object} goodsOrder - 包含用户ID、商品列表、地址ID、总金额等信息
   * @param user_id
   * @param userName
   * @return {Object} 创建的订单实例
   */
  async saveNew(orgUuid, goodsOrder = {}, user_id, userName) {
    const { service, app } = this;
    const { Order, Points, User } = app.model;
    const { total_amount } = goodsOrder;
    const user = await User.findByPk(user_id);
    if (!user) {
      this.ctx.throw(404, `用户不存在，ID: ${user_id}`);
    }

    // 获取创建信息和账单号
    const crateInfo = app.getCrateInfo(user_id, userName);
    const billNumber = await app.getBillNumber("DG");

    const params = {
      ...goodsOrder,
      ...crateInfo,
      billNumber,
      orgUuid,
      user_id,
      userName,
      order_status: "initial",
    };

    const orderUuid = await Order.saveNew(params);

    if (orderUuid) {
      // const current_balance = await User.addPoints(user_id, total_amount);
      // const point = await Points.add({
      //   user_id,
      //   total_amount,
      //   source: "order",
      //   current_balance,
      //   description: `增加积分 ${total_amount}`,
      // });

      // if (!point) {
      //   throw new Error("Failed to redeem points");
      // }

      // // 更新user表中的积分余额
      // await User.cumulativeSpent(user_id, total_amount);

      // await service.membership.checkAndUpgradeMembership(user_id);

      // 超过30分钟自动取消订单
      app.addDelayTask("cancelOrder", orderUuid, {}, 1800);

      // 推送新订单消息
      // await service.notice.send("new_order", {
      //   title: "新订单",
      //   content: billNumber,
      //   orgUuid,
      // });
    }

    return orderUuid;
  }

  /**
   * 查询用户订单列表
   * @param {String} userId - 用户ID
   * @return {Array} 用户订单列表
   */
  async getUserOrders(userId) {
    const { app, ctx } = this;
    const { Sequelize } = app;
    const orderData = await app.model.Order.getUserOrders({
      userId,
      orderAttributes: [
        "uuid",
        "order_status",
        [
          Sequelize.fn("ROUND", Sequelize.col("total_amount"), 2),
          "total_amount",
        ],
        [
          Sequelize.fn("ROUND", Sequelize.col("freight_amount"), 2),
          "freight_amount",
        ],
        [
          Sequelize.fn("ROUND", Sequelize.col("payment_amount"), 2),
          "payment_amount",
        ],
      ],
      orderLineAttributes: [
        "uuid",
        "thumbnail",
        "unitName",
        "name",
        "goods_id",
        "spec",
        [Sequelize.fn("ROUND", Sequelize.col("salePrice"), 2), "salePrice"],
        [
          Sequelize.fn("0+CAST", Sequelize.literal("quantity AS CHAR")),
          "quantity",
        ],
      ],
    });

    if (app._.isEmpty(orderData)) {
      ctx.throw(200, "查询不到订单订单列表");
    }

    return orderData;
  }

  /**
   * 根据订单ID查询订单详情
   * @param {String} orderId - 订单ID
   * @return {Object} 订单详情
   */
  async getOrderDetails(orderId) {
    return await this.app.model.Order.getOrderDetails(orderId);
  }

  /**
   * 删除订单
   * @param {String} orderId - 订单ID
   * @return {Boolean} 是否成功删除
   */
  async deleteOrder(orderId) {
    return await this.app.model.Order.deleteOrder(orderId);
  }

  /**
   * 取消订单
   * @param {object} params - 条件
   * @return {string} - 订单uuid
   */
  async cancel(params = {}) {
    const { app } = this;
    const { user_id, userName, orgUuid } = params;
    const modifyInfo = app.getModifyInfo(user_id, userName);
    return await app.model.Order.cancel({
      ...params,
      ...modifyInfo,
      orgUuid,
    });
  }

  /**
   * 审核订单
   * @param {object} params - 条件
   * @return {string} - 订单uuid
   */
  async audit(params = {}) {
    const { app } = this;
    const { user_id, userName, orgUuid } = params;
    const modifyInfo = app.getModifyInfo(user_id, userName);
    return await app.model.Order.audit({
      ...params,
      ...modifyInfo,
      orgUuid,
    });
  }

  /**
   * 配送订单
   * @param {object} params - 条件
   * @return {string} - 订单uuid
   */
  async dispatch(params = {}) {
    const { app } = this;
    const { uuid, userName, orgUuid } = params;
    const modifyInfo = app.getModifyInfo(uuid, userName);
    return await app.model.Order.dispatch({
      ...params,
      ...modifyInfo,
      orgUuid,
    });
  }

  /**
   * 完成订单
   * @param {object} params - 条件
   * @return {string} - 订单uuid
   */
  async complete(params = {}) {
    const { app } = this;
    const { user_id, userName, orgUuid } = params;
    const modifyInfo = app.getModifyInfo(user_id, userName);
    return await app.model.Order.complete({
      ...params,
      ...modifyInfo,
      orgUuid,
    });
  }
}

module.exports = OrderService;
