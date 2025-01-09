/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-12-23 15:31:16
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2024-12-23 15:32:22
 * @FilePath: \Mini_program_backend\app\schema\deliverytimetype.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

module.exports = app => {
  const { STRING, BIGINT, DATE, DECIMAL, UUIDV4 } = app.Sequelize;

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
    remark: STRING(255),
    surcharge: DECIMAL,
    orgUuid: STRING(38),
    version: {
      type: BIGINT,
      defaultValue: 0,
    },
  };
};
