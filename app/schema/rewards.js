/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-11-21 17:04:41
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-07-21 21:47:28
 * @FilePath: \Mini_program_backend\app\schema\rewards.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
module.exports = app => {
  const { STRING, UUIDV4, DATE, DECIMAL, ENUM } = app.Sequelize;

  return {
    id: {
      type: STRING,
      defaultValue: UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: STRING,
      allowNull: false,
    },
    txn_type: {
      type: ENUM("ORDER_REBATE", "CONSUME", "FROZEN", "REFUND", "ADJUST"),
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
      type: DECIMAL(10, 2),
      allowNull: false,
    },
    balance_after: {
      type: DECIMAL(12, 2),
      allowNull: false,
    },
    // status: {
    //   type: ENUM("PENDING", "SUCCESS", "FAIL"),
    //   allowNull: false,
    // },
    remark: {
      type: STRING(255),
      allowNull: false,
    },
    description: {
      type: STRING,
    },
    lastModifiedTime: {
      type: DATE,
      allowNull: false,
    },
    createdTime: {
      type: DATE,
      allowNull: false,
    },
  };
};
