/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-11-28 11:56:18
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-03-15 09:54:58
 * @FilePath: \Mini_program_backend\app\schema\vouchers.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

module.exports = app => {
  const { STRING, UUIDV4, DATE, DECIMAL, INTEGER, ENUM, BIGINT } =
    app.Sequelize;

  return {
    id: {
      type: STRING(38),
      primaryKey: true,
      allowNull: false,
      defaultValue: UUIDV4,
    },
    user_id: {
      type: STRING(38),
      allowNull: false,
    },
    member_card_id: {
      type: STRING(38),
      allowNull: true,
    },
    voucher_id: {
      type: STRING(38),
      allowNull: false,
    },
    voucher_name: {
      type: STRING(50),
      allowNull: false,
    },
    voucher_image: {
      type: STRING(255),
      allowNull: false,
    },
    voucher_type: {
      type: STRING(30),
      allowNull: false,
    },
    status: ENUM("active", "used_up"),
    voucher_quantity: {
      type: INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    start_date: {
      type: DATE,
      allowNull: false,
    },
    end_date: {
      type: DATE,
      allowNull: false,
    },
    createdTime: {
      type: DATE,
      allowNull: false,
    },
    lastModifiedTime: {
      type: DATE,
      allowNull: false,
    },
    version: {
      type: BIGINT,
      defaultValue: 0,
    },
  };
};
