/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-12-09 21:48:53
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2024-12-25 10:54:26
 * @FilePath: \Mini_program_backend\app\schema\payments.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

module.exports = app => {
  const { STRING, DATE, UUIDV4, NOW, ENUM, BIGINT } = app.Sequelize;

  return {
    uuid: {
      type: STRING(38),
      allowNull: false,
      primaryKey: true,
      defaultValue: UUIDV4,
    },
    user_id: {
      type: STRING(38),
      allowNull: false,
    },
    transaction_id: STRING(38),
    order_id: {
      type: STRING(38),
      allowNull: false,
    },
    orderBillNumber: STRING(38),
    // "unpaid": 未支付, "paid": 已支付, "refunded": 已退款
    payment_status: ENUM("unpaid", "paid", "refunded"),
    payment_method: {
      type: STRING(32),
      allowNull: false,
    },
    appId: STRING(38),
    mchId: STRING(38),
    openId: STRING(38),
    payTime: DATE,
    version: {
      type: BIGINT,
      defaultValue: 0,
    },
  };
};
