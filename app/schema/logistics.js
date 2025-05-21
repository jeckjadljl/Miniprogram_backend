/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-11-12 18:07:17
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-05-05 10:16:07
 * @FilePath: \Mini_program_backend\app\schema\logistics.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */

// schema/orders.js
module.exports = app => {
  const { STRING, UUIDV4, DATE, DECIMAL, ENUM, BIGINT, TEXT } = app.Sequelize;

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
    orderitem_id: {
      type: STRING(38),
      allowNull: false,
    },
    order_id: {
      type: STRING(38),
      allowNull: false,
    },
    waybill_id: {
      type: STRING(50),
      allowNull: false,
    }, // 运单号
    waybill_token: STRING(255),
    receiver_phone: {
      type: STRING(50),
      allowNull: false,
    },
    delivery_id: {
      type: STRING(50),
      allowNull: true,
    },
    logistics_status: STRING(50),
    logistics_info: TEXT,
    version: {
      type: BIGINT,
      defaultValue: 0,
    },
  };
};
