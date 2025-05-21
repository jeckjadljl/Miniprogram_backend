/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-04-09 15:57:44
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-05-18 23:34:29
 * @FilePath: \Mini_program_backend\app\schema\group_buyer.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
module.exports = app => {
  const { STRING, UUIDV4, DATE, DECIMAL, BIGINT, ENUM, INTEGER } =
    app.Sequelize;

  return {
    gb_id: {
      type: STRING(38),
      defaultValue: UUIDV4,
      primaryKey: true,
    },
    buyer_id: {
      type: STRING(38),
      allowNull: false,
    },
    group_id: {
      type: STRING(38),
      allowNull: true,
    },
    item_id: {
      type: STRING(38),
      allowNull: true,
    },
    order_id: {
      type: STRING(38),
      allowNull: true,
    },
    gb_price: DECIMAL(10, 2),
    gb_status: ENUM("1", "-1"),
    gb_time: DATE,
    createdTime: {
      type: DATE,
      allowNull: false,
      comment: "创建时间",
    },
    creatorName: {
      type: STRING(76),
      allowNull: false,
    },
    creatorId: {
      type: STRING(38),
      allowNull: false,
    },
    lastModifiedTime: {
      type: DATE,
      allowNull: false,
      comment: "最后修改时间",
    },
    lastModifierName: {
      type: STRING(76),
      allowNull: false,
    },
    lastModifierId: {
      type: STRING(38),
      allowNull: false,
    },
    version: {
      type: BIGINT,
      defaultValue: 0,
    },
  };
};
