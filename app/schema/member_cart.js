/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-11-12 16:13:36
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-05-10 15:31:30
 * @FilePath: \Mini_program_backend\app\schema\member_cart.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

module.exports = app => {
  const { STRING, DATE, INTEGER } = app.Sequelize;

  return {
    user_id: {
      type: STRING(38),
      primaryKey: true,
      allowNull: false,
    }, // 关联用户表
    goods_id: {
      type: STRING(38),
      allowNull: false,
      primaryKey: true, // 设置为组合主键的一部分
    }, // 关联产品表
    spec: {
      type: STRING(255),
      allowNull: false,
      primaryKey: true, // 将 spec 也作为组合主键的一部分
    },
    member_goods_id: {
      type: STRING(38),
      primaryKey: true, // 将 spec 也作为组合主键的一部分
      allowNull: false,
    },
    quantity: {
      type: INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    lastModifiedTime: {
      type: DATE,
      allowNull: false,
    },
    createdTime: {
      type: DATE,
      allowNull: false,
    },
  };
};
