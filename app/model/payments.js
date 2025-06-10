/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-02-25 12:11:22
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-06-09 12:47:32
 * @FilePath: \Mini_program_backend\app\model\payments.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
module.exports = app => {
  const { Sequelize, model } = app;
  const { Op } = Sequelize;
  const PaymentsSchema = require("../../app/schema/payments")(app);

  const Payments = model.define("payments", PaymentsSchema, {
    tableName: "payments", // 对应数据库中的 'goods' 表
  });

  Payments.associate = function () {
    const { User, Order } = model;
    Payments.belongsTo(User, { foreignKey: "user_id" });
    Payments.belongsTo(Order, { foreignKey: "business_order_id" });
  };

  Payments.saveNew = async paymentData => {
    return await Payments.create(paymentData);
  };

  Payments.saveModify = async updateData => {
    const { outTradeNo } = updateData;
    return await Payments.update(updateData, {
      where: { outTradeNo },
    });
  };

  Payments.getByOutTradeNo = async params => {
    const { outTradeNo } = params;
    return await Payments.findOne({
      where: { out_trade_no: outTradeNo },
    });
  };

  Payments.getByOrderIds = async params => {
    const { orderIds } = params;
    const whereClause = {
      [Sequelize.Op.and]: Sequelize.where(
        Sequelize.fn(
          "JSON_CONTAINS",
          Sequelize.col("business_order_id"),
          Sequelize.literal(`'${JSON.stringify(orderIds)}'`)
        ),
        "=",
        1
      ),
    };

    const order = await Payments.findOne({
      where: whereClause,
    });
    return order;
  };

  Payments.getByUuid = async uuid => {
    return await Payments.findOne({
      where: { uuid },
    });
  };

  Payments.getUnpaid = async params => {
    const { user_id } = params;
    return await Payments.findAll({
      where: { user_id, payment_status: "unpaid" },
    });
  };

  return Payments;
};
