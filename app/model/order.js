/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-10-22 18:07:06
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-03-21 17:31:21
 * @FilePath: \Mini_program_backend\app\model\order.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
module.exports = app => {
  const { _, Sequelize, model, checkDelete, checkUpdate, getSortInfo } = app;
  const { Op } = Sequelize;
  const OrderSchema = require("../../app/schema/orders")(app);

  const Order = model.define("order", OrderSchema, {
    tableName: "orders", // 对应数据库中的 'order' 表
  });

  Order.associate = function () {
    const { User, OrderItem, Address, Merchant, Payments } = model;
    Order.belongsTo(User, { foreignKey: "user_id" });
    Order.hasMany(OrderItem, { foreignKey: "order_id" });
    Order.belongsTo(Address, { foreignKey: "address_id" });
    Order.belongsTo(Merchant, { foreignKey: "orgUuid" });
    Order.belongsTo(Payments, {
      foreignKey: "business_order_id",
    });
  };

  /**
   * 查询订单分页列表
   * @param {object} { attributes, pagination, filter, sort, orgUuid, openId } - 条件
   * @return {object|null} - 查找结果
   */
  Order.query = async ({
    attributes,
    pagination = {},
    filter = {},
    sort = [],
    orgUuid,
    user_id,
  }) => {
    const { page, pageSize: limit } = pagination;
    const { keywordsLike, daterange, status } = filter;
    const order = getSortInfo(sort);
    const condition = {
      offset: (page - 1) * limit,
      limit,
      order,
      attributes,
      where: { orgUuid },
    };

    if (user_id) {
      condition.where.user_id = user_id;
    }

    if (status) {
      condition.where.order_status = status;
    }

    if (keywordsLike) {
      condition.where[Op.or] = [
        { billNumber: { [Op.like]: `%%${keywordsLike}%%` } },
        { userName: { [Op.like]: `%%${keywordsLike}%%` } },
      ];
    }

    if (!_.isEmpty(daterange)) {
      const startDate = new Date(daterange[0]);
      const endDate = new Date(daterange[1]);

      if (_.isDate(startDate) && _.isDate(endDate)) {
        condition.where.createdTime = {
          [Op.gt]: startDate,
          [Op.lt]: endDate,
        };
      }
    }

    const { count, rows } = await Order.findAndCountAll(condition);

    return { page, count, rows };
  };

  /**
   * 查询订单列表
   * @param {object} { attributes, filter, orgUuid, openId } - 条件
   * @return {object|null} - 查找结果
   */
  Order.getList = async ({ attributes, filter = {}, orgUuid, user_id }) => {
    const { keywordsLike, daterange, status } = filter;
    const condition = {
      attributes,
      where: { orgUuid },
    };

    if (user_id) {
      condition.where.user_id = user_id;
    }

    if (status) {
      condition.where.order_status = status;
    }

    if (keywordsLike) {
      condition.where[Op.or] = [
        { billNumber: { [Op.like]: `%%${keywordsLike}%%` } },
        { userName: { [Op.like]: `%%${keywordsLike}%%` } },
      ];
    }

    if (!_.isEmpty(daterange)) {
      const startDate = new Date(daterange[0]);
      const endDate = new Date(daterange[1]);

      if (_.isDate(startDate) && _.isDate(endDate)) {
        condition.where.createdTime = {
          [Op.gt]: startDate,
          [Op.lt]: endDate,
        };
      }
    }

    return await Order.findAll(condition);
  };

  /**
   * 查询订单
   * @param {object} { orderAttributes, orderLineAttributes, uuid, orgUuid } - 条件
   * @return {object|null} - 查找结果
   */
  Order.get = async ({
    orderAttributes,
    orderLineAttributes,
    uuid,
    orgUuid,
  }) => {
    return await Order.findOne({
      attributes: orderAttributes,
      include: [
        {
          model: model.OrderItem,
          as: "orderitems",
          attributes: orderLineAttributes,
        },
      ],
      where: { uuid, orgUuid },
    });
  };

  /**
   * 查询支付订单
   * @param {object} { orderAttributes, orderLineAttributes, uuid, orgUuid } - 条件
   * @return {object|null} - 查找结果
   */
  Order.getOrderFromPayments = async ({
    orderAttributes,
    orderLineAttributes,
    uuid,
  }) => {
    return await Order.findOne({
      attributes: orderAttributes,
      include: [
        {
          model: model.OrderItem,
          as: "orderitems",
          attributes: orderLineAttributes,
        },
      ],
      where: { uuid },
    });
  };

  /**
   * 根据uuid查询订单
   * @param {object} uuid - 订单uuid
   * @return {object|null} - 查找结果
   */
  Order.getByUuid = async uuid => await Order.findByPk(uuid);

  /**
   * 创建订单
   * @param {Object} goodsOrder - 包含用户ID、商品列表、地址ID、总金额
   * @return {Object} 创建的订单实例
   */
  Order.saveNew = async function (goodsOrder = {}) {
    return await app.transaction(async transaction => {
      // 创建订单
      const order = await Order.create(goodsOrder, { transaction });

      // 创建订单项
      const orderItems = goodsOrder.lines.map(item => ({
        order_id: order.uuid,
        member_card_id: item.member_card_id || null,
        member_card_name: item.member_card_name || null,
        member_card_images: item.member_card_images || null,
        member_card_salePrice: item.member_card_salePrice || null,
        member_goods_id: item.member_goods_id || null,
        member_packs_name: item.member_packs_name || null,
        voucher_id: item.voucher_id || null,
        voucher_name: item.voucher_name || null,
        voucher_image: item.voucher_image || null,
        voucher_type: item.voucher_type || null,
        voucher_quantity: item.voucher_quantity || null,
        points: item.points || null,
        points_image: item.points_image || null,
        goods_id: item.goods_id || null,
        name: item.name || null,
        thumbnail: item.thumbnail || null,
        unitName: item.unitName || "件",
        salePrice: item.salePrice || null,
        spec: item.spec || null,
        quantity: item.quantity || null,
      }));
      await model.OrderItem.bulkCreate(orderItems, { transaction });

      return order.uuid;
    });
  };

  /**
   * 修改订单
   * @param {object} params - 条件
   * @return {string} - 订单uuid
   */
  Order.saveModify = async params => {
    const { uuid, orgUuid, lastModifierId, lastModifierName } = params;
    const result = await Order.update(
      { order_status: "canceled", lastModifierId, lastModifierName },
      {
        where: { uuid, orgUuid, order_status: "initial" },
      }
    );
    checkUpdate(result);

    return uuid;
  };

  /**
   * 取消订单
   * @param {object} params - 条件
   * @return {string} - 订单uuid
   */
  Order.cancel = async params => {
    const { uuid, orgUuid, lastModifierId, lastModifierName } = params;
    const result = await Order.update(
      { order_status: "canceled", lastModifierId, lastModifierName },
      {
        where: {
          uuid,
          orgUuid,
          order_status: { [Op.or]: ["initial", "paid"] },
        },
      }
    );
    checkUpdate(result);

    return uuid;
  };

  /**
   * 审核订单
   * @param {object} params - 条件
   * @return {string} - 订单uuid
   */
  Order.audit = async params => {
    const { uuid, orgUuid, lastModifierId, lastModifierName } = params;
    const result = await Order.update(
      { order_status: "paid", lastModifierId, lastModifierName },
      {
        where: { uuid, orgUuid, order_status: "initial" },
      }
    );
    checkUpdate(result);

    return uuid;
  };

  /**
   * 配送订单
   * @param {object} params - 条件
   * @return {string} - 订单uuid
   */
  Order.dispatch = async params => {
    const { uuid, orgUuid, lastModifierId, lastModifierName } = params;
    const result = await Order.update(
      { order_status: "shipped", lastModifierId, lastModifierName },
      {
        where: { uuid, orgUuid, order_status: "paid" },
      }
    );
    checkUpdate(result);

    return uuid;
  };

  /**
   * 完成订单
   * @param {object} params - 条件
   * @return {string} - 订单uuid
   */
  Order.complete = async params => {
    const { uuid, orgUuid, lastModifierId, lastModifierName } = params;
    const result = await Order.update(
      { order_status: "completed", lastModifierId, lastModifierName },
      {
        where: { uuid, orgUuid, order_status: "shipped" },
      }
    );
    checkUpdate(result);

    return uuid;
  };

  /**
   * 查询用户订单列表
   * @param {String} userId - 用户ID
   * @return {Array} 用户订单列表
   */
  Order.getUserOrders = async ({
    orderAttributes,
    orderLineAttributes,
    pagination = {},
    filter = {},
    sort = [],
    user_id,
  }) => {
    const { page = 1, pageSize: limit = 10 } = pagination;
    const { keywordsLike, daterange, status } = filter;
    const order = getSortInfo(sort);
    const condition = {
      offset: (page - 1) * limit,
      limit,
      order,
      attributes: orderAttributes,
      include: [
        {
          model: model.OrderItem,
          as: "orderitems",
          attributes: orderLineAttributes,
          separate: true, // 关键配置
          order,
          limit, // 控制关联项数量
        },
      ],
      where: { user_id },
    };

    if (status) {
      condition.where.order_status = status;
    }

    // 日期范围过滤
    if (!_.isEmpty(daterange)) {
      const [startDate, endDate] = daterange.map(date => new Date(date));
      condition.where.createdTime = {
        [Op.between]: [startDate, endDate],
      };
    }

    // 关键词搜索
    if (keywordsLike) {
      condition.where[Op.or] = [
        { billNumber: { [Op.like]: `%${keywordsLike}%` } },
        { userName: { [Op.like]: `%${keywordsLike}%` } },
      ];
    }

    const result = await Order.findAll(condition);

    // 需要手动处理分页总数
    const total = await Order.count({
      where: condition.where,
    });

    return {
      page,
      total,
      totalPages: Math.ceil(total / limit),
      pageSize: limit,
      data: result,
    };
  };

  /**
   * 根据订单ID查询订单详情
   * @param {String} orderId - 订单ID
   * @return {Object} 订单详情
   */
  Order.getOrderDetails = async function (orderId) {
    const order = await this.findOne({
      where: { order_id: orderId },
      include: [
        {
          model: model.OrderItem,
          as: "order_items",
          include: [
            {
              model: model.Goods,
              attributes: [
                "goods_id",
                "goods_name",
                "goods_images",
                "goods_price",
              ],
            },
          ],
        },
      ],
    });

    checkUpdate(order);

    return order;
  };

  /**
   * 删除订单
   * @param {String} orderId - 订单ID
   * @return {Boolean} 是否成功删除
   */
  Order.deleteOrder = async function (orderId) {
    const result = await this.destroy({
      where: { order_id: orderId },
    });

    checkDelete(result);
  };

  return Order;
};
