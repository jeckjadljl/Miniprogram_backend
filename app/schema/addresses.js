/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-11-12 16:54:14
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-03-25 11:26:04
 * @FilePath: \Mini_program_backend\app\schema\addresses.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

module.exports = app => {
  const { STRING, UUIDV4, BOOLEAN, DATE, BIGINT } = app.Sequelize;

  return {
    address_id: {
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
    user_id: {
      type: STRING,
      allowNull: false,
    },
    createdTime: {
      type: DATE,
      allowNull: false,
    },
    creatorName: {
      type: STRING,
      allowNull: false,
    },
    creatorId: {
      type: STRING(38),
      allowNull: false,
    },
    linkPhone: {
      type: STRING(20),
      allowNull: false,
    },
    linkMan: {
      type: STRING(76),
      allowNull: false,
    },
    province: {
      type: STRING(50), // 省份
      allowNull: false,
    },
    city: {
      type: STRING(50), // 城市
      allowNull: false,
    },
    district: {
      type: STRING(50), // 区县
      allowNull: false,
    },
    detail: {
      type: STRING(255), // 详细地址（街道、楼号等）
      allowNull: false,
    },
    address_tag: {
      type: STRING(10),
      allowNull: true,
    },
    is_default: {
      type: BOOLEAN,
      defaultValue: false,
    },
    version: {
      type: BIGINT,
      defaultValue: 0,
    },
  };
};
