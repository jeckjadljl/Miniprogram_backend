/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-07-16 22:33:45
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-07-17 22:23:29
 * @FilePath: \Mini_program_backend\app\schema\user_wallet.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
module.exports = app => {
  const { STRING, UUIDV4, DATE, DECIMAL, BIGINT } = app.Sequelize;

  return {
    id: {
      type: STRING(38),
      defaultValue: UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: STRING(38),
      allowNull: false,
    },
    balance: {
      type: DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    total_in: {
      type: DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    total_out: {
      type: DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    frozen: {
      type: DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    lastModifiedTime: {
      type: DATE,
      allowNull: false,
    },
    createdTime: {
      type: DATE,
      allowNull: false,
    },
    version: {
      type: BIGINT,
      defaultValue: 0,
    },
  };
};
