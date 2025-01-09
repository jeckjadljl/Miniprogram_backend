/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-11-28 11:56:18
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2024-12-25 11:17:20
 * @FilePath: \Mini_program_backend\app\schema\vouchers.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

module.exports = app => {
  const { STRING, UUIDV4, DATE, DECIMAL, ENUM } = app.Sequelize;

  return {
    id: {
      type: STRING(38),
      primaryKey: true,
      allowNull: false,
      defaultValue: UUIDV4,
    },
    user_id: {
      type: STRING(38),
      allowNull: false,
    },
    total_amount: DECIMAL(10, 2),
    current_balance: DECIMAL(10, 2),
    status: ENUM("active", "used_up"),
    createdTime: {
      type: DATE,
      allowNull: false,
    },
  };
};
