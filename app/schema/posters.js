/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-02-20 16:55:29
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-03-23 18:17:42
 * @FilePath: \Mini_program_backend\app\schema\posters.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

module.exports = app => {
  const { STRING, DATE, BIGINT, UUIDV4, ENUM, TEXT } = app.Sequelize;

  return {
    uuid: {
      type: STRING(38),
      primaryKey: true,
      allowNull: false,
      defaultValue: UUIDV4,
    },
    elements_id: {
      type: STRING(38),
      allowNull: true,
    },
    goods_id: {
      type: STRING(38),
      allowNull: true,
    },
    imageUrl: {
      type: TEXT,
      allowNull: false,
      get() {
        // 将存储的逗号分隔的字符串转换为数组
        const rawValue = this.getDataValue("imageUrl");
        return rawValue ? rawValue.split(",") : [];
      },
      set(value) {
        // 保存时将数组转换为逗号分隔的字符串
        this.setDataValue(
          "imageUrl",
          Array.isArray(value) ? value.join(",") : value
        );
      },
    },
    purpose: {
      type: ENUM("home", "elements", "goods", "user"),
      allowNull: false,
    },
    purposeType: {
      type: ENUM("carousel", "posters"),
      allowNull: false,
    },
    title: STRING(20),
    link: STRING(255),
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
