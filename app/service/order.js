/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-11-15 17:23:38
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-06-09 23:46:03
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
        [
          Sequelize.fn("ROUND", Sequelize.col("points_amount"), 2),
          "points_amount",
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
    console.log("查询订单参数:", params);
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
        "lastModifiedTime",
        "userName",
        [
          Sequelize.fn("ROUND", Sequelize.col("order.total_amount"), 2),
          "total_amount",
        ],
        [
          Sequelize.fn("ROUND", Sequelize.col("order.freight_amount"), 2),
          "freight_amount",
        ],
        [
          Sequelize.fn("ROUND", Sequelize.col("order.payment_amount"), 2),
          "payment_amount",
        ],
        [
          Sequelize.fn("ROUND", Sequelize.col("order.points_amount"), 2),
          "points_amount",
        ],
        [
          Sequelize.fn("ROUND", Sequelize.col("order.discount_amount"), 2),
          "discount_amount",
        ],
      ],
      orderLineAttributes: [
        "uuid",
        "thumbnail",
        "unitName",
        "name",
        "goods_id",
        "spec",
        "status",
        [
          Sequelize.fn("ROUND", Sequelize.col("orderitems.salePrice"), 2),
          "salePrice",
        ],
        [
          Sequelize.fn("ROUND", Sequelize.col("orderitems.payment_amount"), 2),
          "payment_amount",
        ],
        [
          Sequelize.fn("ROUND", Sequelize.col("orderitems.points_amount"), 2),
          "points_amount",
        ],
        [
          Sequelize.fn("ROUND", Sequelize.col("orderitems.discount_amount"), 2),
          "discount_amount",
        ],
        [
          Sequelize.fn(
            "0+CAST",
            Sequelize.literal("orderitems.quantity AS CHAR")
          ),
          "quantity",
        ],
      ],
      orderAddressAttributes: [
        "address_id",
        "linkMan",
        "linkPhone",
        "province",
        "city",
        "district",
        "detail",
        "is_default",
      ],
      logisticsAttributes: [
        "uuid",
        "userName",
        "user_id",
        "orgUuid",
        "orderitem_id",
        "order_id",
        "waybill_id",
        "receiver_phone",
        "delivery_id",
        "logistics_status",
      ],
    });

    if (app._.isEmpty(orderData)) {
      ctx.throw(200, "查询不到指定的订单");
    }

    // const address = await ctx.service.address.get({
    //   uuid: orderData.address_id,
    //   address_id: orderData.address_id,
    // });

    // if (address && !app._.isEmpty(address)) {
    //   orderData.dataValues.address = address;
    // }

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
  async saveNew(goodsOrder = {}) {
    const { app, ctx } = this;
    const { Order, User } = app.model;
    const { address_id, user_id, userName, ordersList = [] } = goodsOrder;
    console.log("订单数据:", goodsOrder);
    console.log("用户的uuid:", user_id);
    const user = await ctx.service.user.getUserByUuid(user_id);
    if (!user) {
      this.ctx.throw(404, `用户不存在，ID: ${user_id}`);
    }

    // 获取创建信息
    const crateInfo = app.getCrateInfo(user_id, userName);

    // 计算所有订单的总金额
    function calculateTotalAmount(ordersList) {
      return ordersList.reduce((sum, order) => sum + order.payment_amount, 0);
    }

    const totalAmount = calculateTotalAmount(ordersList);
    console.log(`所有订单的总金额: ${totalAmount}`);

    // await User.cumulativeSpent(user_id, totalAmount);
    const autoCancelSeconds = 1800; // 保持与定时任务一致

    // 处理每个订单
    const orderUuids = [];
    for (const order of ordersList) {
      const billNumber = await app.getBillNumber("DG");

      // 构建订单数据
      const processedOrder = {
        ...order,
        billNumber,
        ...crateInfo,
        address_id,
        user_id,
        userName,
        order_status: "initial",
      };

      const orderUuid = await Order.saveNew(processedOrder);
      if (orderUuid) {
        orderUuids.push(orderUuid);
        this.ctx.logger.info(`订单创建成功: ${orderUuid}`);
        // 添加30分钟后取消订单的延迟任务
        // await ctx.service.bullmq.addDelayJob(
        //   "taskQueue",
        //   "orderCancel",
        //   {
        //     id: orderUuid,
        //     userId: user_id,
        //   },
        //   30 * 60 // 5分钟（测试，单位：秒）
        // );
        // this.ctx.logger.info(
        //   `订单创建成功，已设置30分钟后自动取消: ${orderUuid}`
        // );
        // 超过30分钟自动取消订单
        // app.addDelayTask("cancelOrder", orderUuid, {}, 1800);
        // 推送新订单消息
        // await service.notice.send("new_order", {
        //   title: "新订单",
        //   content: billNumber,
        //   orgUuid,
        // });
      }
    }

    return {
      user_id,
      openid: user.openid,
      totalAmount,
      orderUuids,
      autoCancelTime: autoCancelSeconds,
    };
  }

  /**
   * 查询用户订单列表
   * @param {String} params - 请求参数
   * @return {Array} 用户订单列表
   */
  async getUserOrders(params = {}) {
    const { app, ctx } = this;
    const { Sequelize } = app;
    const orderData = await app.model.Order.getUserOrders({
      ...params,
      orderAttributes: [
        "uuid",
        "order_status",
        "orgUuid",
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
        [
          Sequelize.fn("ROUND", Sequelize.col("discount_amount"), 2),
          "discount_amount",
        ],
        "address_id",
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
        [
          Sequelize.fn("ROUND", Sequelize.col("points_amount"), 2),
          "points_amount",
        ],
        [
          Sequelize.fn("ROUND", Sequelize.col("payment_amount"), 2),
          "payment_amount",
        ],
        [
          Sequelize.fn("ROUND", Sequelize.col("discount_amount"), 2),
          "discount_amount",
        ],
        "member_card_name",
        "member_card_images",
        "member_packs_name",
        "voucher_name",
        "voucher_quantity",
        "points",
        "status",
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
   * 确认订单
   * @param {object} params - 条件
   * @return {string} - 订单uuid
   */
  async confirm(params = {}) {
    const { app } = this;
    const { user_id, userName } = params;
    const modifyInfo = app.getModifyInfo(user_id, userName);
    return await app.model.Order.confirm({
      ...params,
      ...modifyInfo,
    });
  }

  /**
   * 完成订单
   * @param {object} params - 条件
   * @return {string} - 订单uuid
   */
  async complete(params = {}) {
    const { app } = this;
    const { user_id, userName } = params;
    const modifyInfo = app.getModifyInfo(user_id, userName);
    return await app.model.Order.complete({
      ...params,
      ...modifyInfo,
    });
  }

  /**
   * 评论订单
   * @param {object} params - 条件
   * @return {string} - 订单uuid
   */
  async remark(params = {}) {
    const { app } = this;
    const { user_id, userName, orgUuid } = params;
    const modifyInfo = app.getModifyInfo(user_id, userName);
    return await app.model.Order.complete({
      ...params,
      ...modifyInfo,
      orgUuid,
    });
  }

  async getOrderFromPayments(params = {}) {
    const { app, ctx } = this;
    const { Sequelize } = app;
    const orderData = await app.model.Order.getOrderFromPayments({
      ...params,
      orderAttributes: [
        "uuid",
        "order_status",
        [
          Sequelize.fn("ROUND", Sequelize.col("order.total_amount"), 2),
          "total_amount",
        ],
        [
          Sequelize.fn("ROUND", Sequelize.col("order.payment_amount"), 2),
          "payment_amount",
        ],
        [
          Sequelize.fn("ROUND", Sequelize.col("order.points_amount"), 2),
          "points_amount",
        ],
        [
          Sequelize.fn("ROUND", Sequelize.col("order.discount_amount"), 2),
          "discount_amount",
        ],
        "orgUuid",
        "lastModifiedTime",
        "createdTime",
      ],
      orderLineAttributes: [
        "uuid",
        "voucher_id",
        "voucher_name",
        "voucher_image",
        "voucher_type",
        "voucher_quantity",
        "points",
        "goods_id",
        "name",
        "spec",
        [Sequelize.fn("ROUND", Sequelize.col("salePrice"), 2), "salePrice"],
        [
          Sequelize.fn("ROUND", Sequelize.col("orderitems.points_amount"), 2),
          "points_amount",
        ],
        [
          Sequelize.fn("ROUND", Sequelize.col("orderitems.payment_amount"), 2),
          "payment_amount",
        ],
        [
          Sequelize.fn("ROUND", Sequelize.col("orderitems.discount_amount"), 2),
          "discount_amount",
        ],
        "quantity",
      ],
    });

    if (app._.isEmpty(orderData)) {
      ctx.throw(200, "查询不到订单订单列表");
    }

    return orderData;
  }
}

module.exports = OrderService;
