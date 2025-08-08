/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-08-06 10:20:23
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-08-06 11:16:42
 * @FilePath: \Mini_program_backend\app\schema\member_goods_package.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
module.exports = app => {
  const { STRING, UUIDV4, ENUM, DATE, BIGINT } = app.Sequelize;

  return {
    uuid: {
      type: STRING(38),
      primaryKey: true,
      defaultValue: UUIDV4,
    },
    member_card_id: {
      type: STRING(38),
      allowNull: false,
    },
    card_type: {
      type: ENUM("green", "pink", "orange", "black"),
      allowNull: false,
    },
    package_name: {
      type: STRING(50),
      allowNull: false,
    },
    selection_type: {
      type: ENUM("SINGLE_CHOICE", "FIXED_COMBO"),
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
    version: {
      type: BIGINT,
      defaultValue: 0,
    },
  };
};
