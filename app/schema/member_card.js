/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-03-10 15:27:33
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-06-10 11:04:17
 * @FilePath: \Mini_program_backend\app\schema\member_card.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
module.exports = app => {
  const { STRING, UUIDV4, DATE, ENUM, BIGINT, DECIMAL } = app.Sequelize;

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
    userName: {
      type: STRING(20),
      allowNull: false,
    },
    card_type: {
      type: ENUM("green", "pink", "orange", "black"),
      allowNull: false,
    },
    orgUuid: {
      type: STRING(38),
      allowNull: false,
    },
    card_name: {
      type: STRING(50),
      allowNull: false,
    },
    card_images: {
      type: STRING(255),
      allowNull: false,
    },
    salePrice: {
      type: DECIMAL(10, 2),
      allowNull: false,
    },
    points_amount: DECIMAL(10, 2),
    membership_level: {
      type: ENUM("general", "junior", "premium"),
      allowNull: false,
    },
    tag: {
      type: STRING(10),
      allowNull: true,
    },
    description: {
      type: STRING,
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
