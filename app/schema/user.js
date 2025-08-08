/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-10-21 15:39:20
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-07-27 15:41:18
 * @FilePath: \Mini_program_backend\app\schema\user.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
// app/model/user.js
"use strict";

module.exports = app => {
  const { STRING, DECIMAL, DATE, UUIDV4 } = app.Sequelize;

  return {
    uuid: {
      type: STRING(38),
      primaryKey: true,
      allowNull: false,
      defaultValue: UUIDV4,
    },
    openid: {
      type: STRING(255),
      allowNull: false,
      unique: true,
    },
    user_name: {
      type: STRING(255),
      allowNull: false,
      unique: true,
    },
    avatar: {
      type: STRING(255),
      allowNull: false,
    },
    phoneNumber: {
      type: STRING(255),
      allowNull: false,
      unique: true,
    },
    password: STRING(100),
    // membership_level: ENUM("general", "junior", "premium", "city partner"),
    cumulative_spent: DECIMAL(10, 2), // 总购买金额（购买商城产品的总消费金额）
    consumption_points: DECIMAL(10, 2), // 消费积分
    balance: DECIMAL(10, 2), // 账户余额（会员积分）
    real_name: STRING(10),
    birthday: {
      type: STRING(12),
      allowNull: true,
    },
    desc: STRING(20),
    lastLoginAt: DATE,
    createdTime: {
      type: DATE,
      allowNull: false,
    },
    lastModifiedTime: {
      type: DATE,
      allowNull: false,
    },
  };
};
