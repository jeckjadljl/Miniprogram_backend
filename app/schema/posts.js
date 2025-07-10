/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-10-21 15:39:20
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-07-09 21:19:45
 * @FilePath: \Mini_program_backend\app\schema\posts.js
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
    posts_title: {
      type: STRING(100),
      allowNull: false,
    },
    post_content: {
      type: STRING(500),
      allowNull: false,
      // 帖子内容，可能是文本或描述
    },
    cover: {
      type: STRING(355),
      allowNull: false,
    },
    media: {
      type: TEXT,
      get() {
        // 将存储的逗号分隔的字符串转换为数组
        const rawValue = this.getDataValue("media");
        return rawValue ? rawValue.split(",") : [];
      },
      set(value) {
        // 保存时将数组转换为逗号分隔的字符串
        this.setDataValue(
          "media",
          Array.isArray(value) ? value.join(",") : value
        );
      },
    },
    likes: {
      type: BIGINT,
      defaultValue: 0,
    },
    comments: {
      type: BIGINT,
      defaultValue: 0,
    },
    shares: {
      type: BIGINT,
      defaultValue: 0,
    },
    post_type: {
      type: ENUM("image", "video", "mixed"),
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
