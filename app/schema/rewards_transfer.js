/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-11-21 17:04:41
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-07-18 15:26:01
 * @FilePath: \Mini_program_backend\app\schema\rewards_transfer.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
module.exports = app => {
  const { STRING, UUIDV4, DATE, DECIMAL, BIGINT } = app.Sequelize;

  return {
    uuid: {
      type: STRING(38),
      defaultValue: UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: STRING(38),
      allowNull: false,
    },
    out_bill_no: {
      type: STRING(32),
      allowNull: false,
    },
    transfer_bill_no: {
      type: STRING,
      allowNull: false,
    },
    transfer_scene_id: {
      type: STRING(36),
      allowNull: false,
    },
    order_id: {
      type: STRING(38),
      allowNull: false,
    },
    transfer_amount: {
      type: BIGINT,
      allowNull: false,
    },
    balance_after: {
      type: DECIMAL(12, 2),
      allowNull: false,
    },
    status: {
      type: STRING,
      allowNull: false,
    },
    appId: {
      type: STRING(32),
      allowNull: false,
    },
    openId: {
      type: STRING(32),
      allowNull: false,
    },
    transfer_remark: {
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
