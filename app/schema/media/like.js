/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-10-21 15:39:20
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-08-09 16:15:07
 * @FilePath: \Mini_program_backend\app\schema\media\like.js
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
    post_id: {
      type: STRING(38),
      allowNull: false,
    },
    user_id: {
      type: STRING(255),
      allowNull: false,
    },
    user_name: {
      type: STRING(255),
      allowNull: false,
    },
    avatar: {
      type: STRING(255),
      allowNull: false,
    },
    // liked_title: {
    //   type: STRING(100),
    //   allowNull: false,
    // },
    // liked_content: {
    //   type: STRING(500),
    //   allowNull: false,
    //   // 帖子内容，可能是文本或描述
    // },
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
