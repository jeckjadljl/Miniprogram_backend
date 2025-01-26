/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-11-07 16:07:57
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-01-12 12:18:15
 * @FilePath: \Mini_program_backend\app\schema\permissions.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

module.exports = app => {
  const { STRING, TEXT, UUIDV4, DATE, BIGINT } = app.Sequelize;

  return {
    id: {
      type: STRING(38),
      primaryKey: true,
      defaultValue: UUIDV4,
    },
    name: {
      type: STRING(255),
      allowNull: false,
      unique: true,
    },
    description: TEXT, // 逗号分隔的权限
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
