/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-12-08 17:12:36
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-05-26 17:30:08
 * @FilePath: \Mini_program_backend\app\schema\goods_category.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

module.exports = app => {
  const { STRING, DATE, UUIDV4, BIGINT } = app.Sequelize;

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
      unique: true,
    },
    elements_id: {
      type: STRING(38),
      allowNull: true,
    },
    orgUuid: {
      type: STRING(38),
      allowNull: false,
    },
    sort_order: {
      type: BIGINT,
      allowNull: false,
      defaultValue: 0,
    },
    version: {
      type: BIGINT,
      defaultValue: 0,
    },
  };
};
