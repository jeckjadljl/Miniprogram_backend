/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-07-25 18:02:40
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-07-26 11:14:16
 * @FilePath: \Mini_program_backend\app\schema\weRun\team_members.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

module.exports = app => {
  const { STRING, DATE, INTEGER, UUIDV4, BIGINT, JSON } = app.Sequelize;

  return {
    uuid: {
      type: STRING(38),
      primaryKey: true,
      allowNull: false,
      defaultValue: UUIDV4,
    }, // 关联用户表
    user_id: {
      type: STRING(38),
      allowNull: false,
    },
    team_id: {
      type: STRING(38),
      allowNull: false,
    },
    lastModifiedTime: {
      type: DATE,
      allowNull: false,
    },
    createdTime: {
      type: DATE,
      allowNull: false,
    },
    version: {
      type: BIGINT,
      defaultValue: 0,
    },
  };
};
