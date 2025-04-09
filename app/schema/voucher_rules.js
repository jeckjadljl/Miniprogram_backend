/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-11-28 15:38:06
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-03-17 11:20:22
 * @FilePath: \Mini_program_backend\app\schema\voucher_rules.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

module.exports = app => {
  const { STRING, UUIDV4, DECIMAL, DATE, BIGINT, BOOLEAN } = app.Sequelize;

  return {
    id: {
      type: STRING(38),
      primaryKey: true,
      allowNull: false,
      defaultValue: UUIDV4,
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
    min_spend: DECIMAL(10, 2), // 最低消费金额
    status: {
      type: BOOLEAN,
      allowNull: false,
    },
    // start_date: {
    //   type: DATE,
    //   allowNull: false,
    // },
    // end_date: {
    //   type: DATE,
    //   allowNull: false,
    // },
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
