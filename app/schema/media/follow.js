/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-10-21 15:39:20
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-08-09 16:36:53
 * @FilePath: \Mini_program_backend\app\schema\media\follow.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
// app/model/user.js
"use strict";

module.exports = app => {
  const { STRING, DECIMAL, DATE, UUIDV4, BIGINT, TEXT, ENUM, BOOLEAN } =
    app.Sequelize;

  return {
    uuid: {
      type: STRING(38),
      primaryKey: true,
      allowNull: false,
      defaultValue: UUIDV4,
    },
    follower_id: {
      type: STRING(38),
      allowNull: false,
    },
    following_id: {
      type: STRING(38),
      allowNull: false,
    },
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
