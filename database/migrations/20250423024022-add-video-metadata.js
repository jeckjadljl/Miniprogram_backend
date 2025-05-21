/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-04-23 10:40:22
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-04-23 10:50:13
 * @FilePath: \Mini_program_backend\database\migrations\20250423024022-add-video-metadata.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("video", {
      uuid: {
        type: Sequelize.STRING(38),
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      thumbnail: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      videoTitle: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      videoUrl: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM("active", "inactive", "deleted"),
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      duration: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      likes: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      views: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      tags: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      elements_id: {
        type: Sequelize.STRING(38),
        allowNull: false,
      },
      orgUuid: {
        type: Sequelize.STRING(38),
        allowNull: false,
      },
      lastModifiedTime: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      lastModifierName: {
        type: Sequelize.STRING(76),
        allowNull: false,
      },
      lastModifierId: {
        type: Sequelize.STRING(38),
        allowNull: false,
      },
      createdTime: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      creatorName: {
        type: Sequelize.STRING(76),
        allowNull: false,
      },
      creatorId: {
        type: Sequelize.STRING(38),
        allowNull: false,
      },
      version: {
        type: Sequelize.BIGINT,
        defaultValue: 0,
      },
    });
  },

  down: async queryInterface => {
    await queryInterface.dropTable("video");
  },
};
