/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-02-25 12:11:22
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-02-27 15:31:07
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

  Payments.saveNew = async paymentData => {
    return await Payments.create(paymentData);
  };

  return Payments;
};
