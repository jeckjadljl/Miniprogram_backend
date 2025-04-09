/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-03-10 18:17:03
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-03-10 22:03:48
 * @FilePath: \Mini_program_backend\database\migrations\20250310101703-create-member-tables.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

const path = require("path");
const schemaPath = path.join(__dirname, "../../app/schema");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const schemas = {
      member_card: require(path.join(schemaPath, "member_card"))({
        Sequelize,
      }),
      member_privileges: require(path.join(schemaPath, "member_privileges"))({
        Sequelize,
      }),
      member_goods: require(path.join(schemaPath, "member_goods"))({
        Sequelize,
      }),
      member_card_record: require(path.join(schemaPath, "member_card_record"))({
        Sequelize,
      }),
    };

    for (const [tableName, schema] of Object.entries(schemas)) {
      await queryInterface.createTable(tableName, schema);
    }

    // Check if column 'lastModifiedTime' exists in 'points' table
    const hasLastModifiedTimePoints = await queryInterface
      .describeTable("points")
      .then(table => table.hasOwnProperty("lastModifiedTime"));
    if (!hasLastModifiedTimePoints) {
      await queryInterface.addColumn("points", "lastModifiedTime", {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      });
    }

    // Check if column 'lastModifiedTime' exists in 'rewards' table
    const hasLastModifiedTimeRewards = await queryInterface
      .describeTable("rewards")
      .then(table => table.hasOwnProperty("lastModifiedTime"));
    if (!hasLastModifiedTimeRewards) {
      await queryInterface.addColumn("rewards", "lastModifiedTime", {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tables = [
      "member_card",
      "member_privileges",
      "member_goods",
      "member_card_record",
    ];
    for (const tableName of tables) {
      await queryInterface.dropTable(tableName);
    }

    // Check if column 'lastModifiedTime' exists in 'points' table
    const hasLastModifiedTimePoints = await queryInterface
      .describeTable("points")
      .then(table => table.hasOwnProperty("lastModifiedTime"));
    if (hasLastModifiedTimePoints) {
      await queryInterface.removeColumn("points", "lastModifiedTime");
    }

    // Check if column 'lastModifiedTime' exists in 'rewards' table
    const hasLastModifiedTimeRewards = await queryInterface
      .describeTable("rewards")
      .then(table => table.hasOwnProperty("lastModifiedTime"));
    if (hasLastModifiedTimeRewards) {
      await queryInterface.removeColumn("rewards", "lastModifiedTime");
    }
  },
};
