/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-12-09 21:24:02
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-02-16 10:51:33
 * @FilePath: \Mini_program_backend\app\schema\merchant.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

module.exports = app => {
  const { STRING, DATE, ENUM, UUIDV4, BOOLEAN, BIGINT } = app.Sequelize;

  return {
    uuid: {
      type: STRING(38),
      allowNull: false,
      primaryKey: true,
      defaultValue: UUIDV4,
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
    name: {
      type: STRING(76),
      allowNull: false,
    },
    userType: {
      type: ENUM("admin", "merchant", "employee"),
      allowNull: false,
    },
    userName: {
      type: STRING(12),
      allowNull: false,
      unique: true,
    },
    password: {
      type: STRING(100),
      allowNull: false,
    },
    linkMan: {
      type: STRING(50), // 联系人
      allowNull: false,
    },
    linkPhone: {
      type: STRING(20), // 联系人电话
      allowNull: false,
    },
    enableStatus: {
      type: BOOLEAN, // 启用状态
      defaultValue: true,
    },
    orgName: {
      type: STRING(76), // 组织名称
    },
    orgUuid: {
      type: STRING(38), // 组织唯一标识
      allowNull: false,
      defaultValue: UUIDV4,
    },
    remark: STRING(255),
    address: STRING(255),
    servicePhone: STRING(12),
    appId: STRING(38),
    mchKey: STRING(38),
    mchId: STRING(38),
    appSecret: STRING(38),
    version: {
      type: BIGINT,
      defaultValue: 0,
    },
  };
};
