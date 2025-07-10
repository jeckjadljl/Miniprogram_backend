/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-10-21 15:39:20
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-07-05 10:20:17
 * @FilePath: \Mini_program_backend\app\schema\user_profile.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
// app/model/user.js
"use strict";

module.exports = app => {
  const { STRING, DECIMAL, DATE, UUIDV4, BIGINT } = app.Sequelize;

  return {
    uuid: {
      type: STRING(38),
      primaryKey: true,
      allowNull: false,
      defaultValue: UUIDV4,
    },
    user_id: {
      type: STRING(255),
      allowNull: false,
    },
    user_name: {
      type: STRING(255),
      allowNull: false,
      unique: true,
    },
    avatar: {
      type: STRING(455),
      allowNull: false,
    },
    desc: {
      type: STRING(150),
      allowNull: true,
    },
    postCount: {
      type: BIGINT,
      defaultValue: 0,
    },
    totalLikes: {
      type: BIGINT,
      defaultValue: 0,
    },
    followers: {
      type: BIGINT,
      defaultValue: 0,
    },
    following: {
      type: BIGINT,
      defaultValue: 0,
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
