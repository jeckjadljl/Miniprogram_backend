/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-02-21 10:41:53
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-02-22 21:59:23
 * @FilePath: \Mini_program_backend\app\schema\elements.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

module.exports = app => {
  const { STRING, DATE, BIGINT, UUIDV4, JSON } = app.Sequelize;

  return {
    uuid: {
      type: STRING(38),
      primaryKey: true,
      allowNull: false,
      defaultValue: UUIDV4,
    },
    thumbnail: {
      type: STRING(255),
      allowNull: false,
    },
    carousel: {
      type: JSON,
      defaultValue: [],
      // get() {
      //   // 将存储的逗号分隔的字符串转换为数组
      //   const rawValue = this.getDataValue("carousel");
      //   return rawValue ? rawValue.split(",") : [];
      // },
      // set(value) {
      //   // 保存时将数组转换为逗号分隔的字符串
      //   this.setDataValue(
      //     "carousel",
      //     Array.isArray(value) ? value.join(",") : value
      //   );
      // },
    },
    posters: {
      type: JSON, // 存储关联的 Posters uuid 列表
      defaultValue: [],
      // get() {
      //   // 将存储的逗号分隔的字符串转换为数组
      //   const rawValue = this.getDataValue("posters");
      //   return rawValue ? rawValue.split(",") : [];
      // },
      // set(value) {
      //   // 保存时将数组转换为逗号分隔的字符串
      //   this.setDataValue(
      //     "posters",
      //     Array.isArray(value) ? value.join(",") : value
      //   );
      // },
    },
    name: {
      type: STRING(20),
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
