/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-04-22 22:58:28
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-04-23 10:45:05
 * @FilePath: \Mini_program_backend\app\schema\video.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
module.exports = app => {
  const { STRING, INTEGER, DECIMAL, UUIDV4, DATE, ENUM, BIGINT } =
    app.Sequelize;

  return {
    uuid: {
      type: STRING(38),
      allowNull: false,
      primaryKey: true,
      defaultValue: UUIDV4,
    },
    thumbnail: {
      type: STRING(255),
      allowNull: false,
    }, // 商品缩略图的 URL
    videoTitle: {
      type: STRING(255),
      allowNull: false,
    },
    videoUrl: {
      type: STRING(255),
      allowNull: false,
    },
    status: {
      type: ENUM("active", "inactive", "deleted"),
      allowNull: false,
    },
    description: {
      // 视频描述
      type: STRING(500),
      allowNull: true,
    },
    duration: INTEGER,
    likes: {
      type: INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    views: {
      type: INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    tags: {
      type: STRING(255),
      allowNull: true,
    },
    elements_id: {
      type: STRING(38),
      allowNull: false,
    },
    orgUuid: {
      type: STRING(38),
      allowNull: false,
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
    version: {
      type: BIGINT,
      defaultValue: 0,
    },
  };
};
