/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-04-05 15:51:04
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-04-05 15:54:22
 * @FilePath: \Mini_program_backend\database\migrations\20250405075104-CreateNoticeTable.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("noticeforweapp", {
      uuid: {
        type: Sequelize.STRING(38),
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      orgUuid: {
        type: Sequelize.STRING(38),
        allowNull: false,
      },
      purpose: {
        type: Sequelize.ENUM("home", "elements", "goods", "user"),
        allowNull: false,
      },
      noticeType: {
        type: Sequelize.ENUM("notice", "message"),
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      content: {
        type: Sequelize.STRING(2000),
        allowNull: true,
      },
      createdTime: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      lastModifiedTime: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("noticeforweapp");
  },
};
