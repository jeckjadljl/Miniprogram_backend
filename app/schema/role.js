/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-11-07 16:00:18
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-01-12 12:18:28
 * @FilePath: \Mini_program_backend\app\schema\role.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

module.exports = app => {
  const { STRING, UUIDV4, TEXT, DATE, BIGINT } = app.Sequelize;

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
    description: TEXT,
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
