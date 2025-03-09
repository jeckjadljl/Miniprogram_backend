/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-02-02 21:16:54
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-02-02 21:21:52
 * @FilePath: \Mini_program_backend\database\migrations\20250202131654-create_avatar_table.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { STRING, INTEGER, DATE } = Sequelize;
    await queryInterface.createTable("avatar", {
      id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      md5: {
        type: STRING,
        allowNull: false,
        unique: true, // MD5 值唯一
      },
      avatarUrl: {
        type: STRING,
        allowNull: false, // 不能为空
      },
      lastModifiedTime: {
        type: DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      createdTime: {
        type: DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("avatar");
  },
};
