/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-11-07 16:13:24
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2024-12-25 11:07:18
 * @FilePath: \Mini_program_backend\app\schema\role_permissions.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

module.exports = app => {
  const { STRING, UUIDV4, DATE } = app.Sequelize;

  return {
    id: {
      type: STRING(38),
      primaryKey: true,
      allowNull: false,
      defaultValue: UUIDV4,
    },
    permission_id: {
      type: STRING(38),
      allowNull: false,
    },
    role_id: {
      type: STRING(38),
      allowNull: false,
    },
    createdTime: {
      type: DATE,
      allowNull: false,
    },
  };
};
