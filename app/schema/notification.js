/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-08-09 17:08:19
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-08-09 17:15:58
 * @FilePath: \Mini_program_backend\app\schema\notification.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
module.exports = app => {
  const { STRING, TEXT, BOOLEAN, DATE, UUIDV4, ENUM, BIGINT } = app.Sequelize;

  return {
    uuid: {
      type: STRING(38),
      primaryKey: true,
      allowNull: false,
      defaultValue: UUIDV4,
    },
    user_id: {
      type: STRING(38),
      allowNull: false,
    },
    user_name: {
      type: STRING(255),
      allowNull: false,
    },
    avatar: {
      type: STRING(255),
      allowNull: true,
      comment: "相关用户头像",
    },
    notification_type: {
      type: ENUM("follow", "like", "comment", "system"),
      defaultValue: "system",
      allowNull: false,
    },
    title: {
      type: STRING(100),
      allowNull: true,
      comment: "通知标题",
    },
    content: {
      type: TEXT,
      allowNull: false,
      comment: "通知内容",
    },
    post_id: {
      type: STRING(38),
      allowNull: true,
      comment: "相关资源ID(如帖子ID、评论ID等)",
    },
    post_type: {
      type: ENUM("post", "comment", "user"),
      allowNull: true,
      comment: "相关资源类型: post, comment, user",
    },
    is_read: {
      type: BOOLEAN,
      defaultValue: false,
      comment: "是否已读",
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
