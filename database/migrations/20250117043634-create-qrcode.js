/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-01-17 12:36:34
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-01-17 16:03:10
 * @FilePath: \Mini_program_backend\database\migrations\20250117043634-create-qrcode.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const { STRING, UUIDV4, DATE } = Sequelize;

    await queryInterface.createTable("qrcode", {
      id: {
        type: STRING(38),
        defaultValue: UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      referrer_id: {
        type: STRING(38),
        allowNull: false,
      },
      promotion_code: {
        type: STRING(32), // 存储推广码 ID
        allowNull: false,
      },
      qrcode: {
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
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("qrcode");
  },
};
