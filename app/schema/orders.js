/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-11-12 18:07:17
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-04-08 17:03:04
 * @FilePath: \Mini_program_backend\app\schema\orders.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */

const points = require("./points");

// schema/orders.js
module.exports = app => {
  const { STRING, UUIDV4, DATE, DECIMAL, ENUM, BIGINT } = app.Sequelize;

  return {
    uuid: {
      type: STRING(38),
      defaultValue: UUIDV4,
      primaryKey: true,
    },
    lastModifiedTime: {
      type: DATE,
      allowNull: false,
    },
    lastModifierName: {
      type: STRING(76),
      allowNull: false,
    },
    lastModifierId: {
      type: STRING(38),
      allowNull: false,
    },
    createdTime: {
      type: DATE,
      allowNull: false,
    },
    creatorName: {
      type: STRING(76),
      allowNull: false,
    },
    creatorId: {
      type: STRING(38),
      allowNull: false,
    },
    userName: {
      type: STRING(76),
      allowNull: false,
    },
    user_id: {
      type: STRING(38),
      allowNull: false,
    },
    orgUuid: {
      type: STRING(38),
      allowNull: false,
    },
    total_amount: {
      type: DECIMAL(10, 2),
      allowNull: false,
    },
    freight_amount: {
      type: DECIMAL(10, 2),
      defaultValue: 0.0,
    },
    payment_amount: {
      type: DECIMAL(10, 2),
      allowNull: false,
    },
    discount_amount: DECIMAL(10, 2),
    points_amount: DECIMAL(10, 2),
    // initial: '待处理', paid: '待发货'(已支付), shipped: '已发货', completed: '已完成'（待评价）, canceled: '已取消'
    order_status: ENUM("initial", "paid", "shipped", "completed", "canceled"),
    billNumber: {
      type: STRING(38),
      allowNull: false,
    },
    remark: STRING(255),
    deliveryTimeTypeName: {
      type: STRING(76),
      allowNull: true,
    },
    deliveryTimeType_id: {
      type: STRING(38),
      allowNull: true,
    },
    deliveryTimeTypeRemark: STRING(255),
    address_id: {
      type: STRING,
      allowNull: false,
    },
    version: {
      type: BIGINT,
      defaultValue: 0,
    },
  };
};
