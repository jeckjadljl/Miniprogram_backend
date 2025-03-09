/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-03-01 22:19:42
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-03-01 22:20:35
 * @FilePath: \Mini_program_backend\app\schema\admin.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

module.exports = app => {
  const { STRING, BIGINT, DATE, UUIDV4, ENUM } = app.Sequelize;

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
    // enabled: '启用', disabled: '禁用'
    enableStatus: {
      type: ENUM("enabled", "disabled"),
      allowNull: false,
    },
    userType: {
      type: ENUM("admin"),
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
    version: {
      type: BIGINT,
      defaultValue: 0,
    },
  };
};
