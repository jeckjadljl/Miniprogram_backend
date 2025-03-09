/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-03-01 22:32:47
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-03-01 22:36:56
 * @FilePath: \Mini_program_backend\database\migrations\20250301143247-add-admin-model.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

/** @type {import('sequelize-cli').Migration} */
const { Sequelize, DataTypes } = require("sequelize");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("admin", {
      uuid: {
        type: DataTypes.STRING(38),
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      lastModifiedTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      lastModifierName: {
        type: DataTypes.STRING(76),
        allowNull: false,
      },
      lastModifierId: {
        type: DataTypes.STRING(38),
        allowNull: false,
      },
      createdTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      creatorName: {
        type: DataTypes.STRING(76),
        allowNull: false,
      },
      creatorId: {
        type: DataTypes.STRING(38),
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(76),
        allowNull: false,
      },
      enableStatus: {
        type: DataTypes.ENUM("enabled", "disabled"),
        allowNull: false,
      },
      userType: {
        type: DataTypes.ENUM("admin"),
        allowNull: false,
      },
      userName: {
        type: DataTypes.STRING(12),
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      version: {
        type: DataTypes.BIGINT,
        defaultValue: 0,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("admins");
  },
};
