/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-07-16 22:54:08
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-07-21 21:47:46
 * @FilePath: \Mini_program_backend\app\schema\wallet_transaction.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
module.exports = app => {
  const { STRING, UUIDV4, DATE, DECIMAL, BIGINT, ENUM } = app.Sequelize;

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
    txn_type: {
      type: ENUM("RETURN", "CONSUME", "FROZEN", "REFUND", "ADJUST"),
      allowNull: false,
    },
    txn_no: {
      type: STRING(64),
      allowNull: false,
    },
    order_id: {
      type: STRING(38),
      allowNull: true,
    },
    amount: {
      type: DECIMAL(12, 2),
      allowNull: false,
    },
    balance_after: {
      type: DECIMAL(12, 2),
      allowNull: false,
    },
    remark: {
      type: STRING(255),
      allowNull: false,
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
