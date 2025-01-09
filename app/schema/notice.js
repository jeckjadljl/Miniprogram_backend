/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-12-23 10:34:44
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2024-12-23 10:35:20
 * @FilePath: \Mini_program_backend\app\schema\notice.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

module.exports = app => {
  const { STRING, DATE, BOOLEAN, UUIDV4 } = app.Sequelize;

  return {
    uuid: {
      type: STRING(38),
      allowNull: false,
      primaryKey: true,
      defaultValue: UUIDV4,
    },
    orgUuid: {
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
    title: STRING(255),
    content: STRING(2000),
    isRead: {
      type: BOOLEAN,
      defaultValue: false,
    },
  };
};
