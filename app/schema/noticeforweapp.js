/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-12-23 10:34:44
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-04-05 16:12:41
 * @FilePath: \Mini_program_backend\app\schema\noticeforweapp.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

module.exports = app => {
  const { STRING, DATE, BOOLEAN, UUIDV4, ENUM } = app.Sequelize;

  return {
    uuid: {
      type: STRING(38),
      allowNull: false,
      primaryKey: true,
      defaultValue: UUIDV4,
    },
    goods_id: {
      type: STRING(38),
      allowNull: true,
    },
    elements_id: {
      type: STRING(38),
      allowNull: true,
    },
    orgUuid: {
      type: STRING(38),
      allowNull: false,
    },
    purpose: {
      type: ENUM("home", "elements", "goods", "user"),
      allowNull: false,
    },
    noticeType: {
      type: ENUM("notice", "message"), // 消息类型，如：new_order, order_status_change, etc.
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
    title: STRING(255),
    content: STRING(2000),
  };
};
