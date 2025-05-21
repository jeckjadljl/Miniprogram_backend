/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-05-13 23:48:49
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-05-13 23:50:35
 * @FilePath: \Mini_program_backend\database\migrations\20250513154849-create-goods-spec-color.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("goods_spec_color", {
      uuid: {
        type: Sequelize.STRING(38),
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
      },
      spec_id: {
        type: Sequelize.STRING(38),
        allowNull: true,
      },
      goods_id: {
        type: Sequelize.STRING(38),
        allowNull: false,
      },
      specName: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      specValue: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      specPrice: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      specColorThumbnail: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      specColorImages: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      createdTime: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      lastModifiedTime: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("goods_spec_color");
  },
};
