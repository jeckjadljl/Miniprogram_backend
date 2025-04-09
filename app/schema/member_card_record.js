/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-03-10 21:11:33
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-03-27 16:51:41
 * @FilePath: \Mini_program_backend\app\schema\member_card_record.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
module.exports = app => {
  const { STRING, UUIDV4, DATE, BIGINT, DECIMAL, ENUM } = app.Sequelize;

  return {
    uuid: {
      type: STRING(38),
      defaultValue: UUIDV4,
      primaryKey: true,
    },
    member_card_id: {
      type: STRING(38),
      allowNull: false,
    },
    user_id: {
      type: STRING(38),
      allowNull: false,
    },
    card_type: {
      type: ENUM("green", "orange", "black"),
      allowNull: false,
    },
    status: {
      type: ENUM("active", "inactive", "expired"),
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
    start_date: {
      type: DATE,
      allowNull: false,
    },
    end_date: {
      type: DATE,
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
    version: {
      type: BIGINT,
      defaultValue: 0,
    },
  };
};
