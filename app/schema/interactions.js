/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-10-21 15:39:20
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-07-05 10:18:20
 * @FilePath: \Mini_program_backend\app\schema\interactions.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
// app/model/user.js
"use strict";

module.exports = app => {
  const { STRING, DECIMAL, DATE, UUIDV4, BIGINT, TEXT, ENUM } = app.Sequelize;

  return {
    uuid: {
      type: STRING(38),
      primaryKey: true,
      allowNull: false,
      defaultValue: UUIDV4,
    },
    user_profile_id: {
      type: STRING(38),
      allowNull: false,
    },
    reply_user_id: {
      type: STRING(255),
      allowNull: false,
      // 互动的用户ID
    },
    post_id: {
      type: STRING(255),
      allowNull: true,
    },
    review_content: {
      type: STRING(500),
      allowNull: true,
    },
    reply_type: {
      type: ENUM("like", "comment", "follow", "share"),
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
