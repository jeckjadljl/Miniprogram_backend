/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-08-10 16:09:47
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-08-10 16:15:25
 * @FilePath: \Mini_program_backend\database\migrations\20250810080947-create-media-interaction-tables.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

const path = require("path");
const schemaPath = path.join(__dirname, "../../app/schema");
const mediaSchemaPath = path.join(schemaPath, "../../app/schema/media");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const schemas = {
      like: require(path.join(mediaSchemaPath, "like"))({
        Sequelize,
      }),

      comment: require(path.join(mediaSchemaPath, "comment"))({
        Sequelize,
      }),

      follow: require(path.join(mediaSchemaPath, "follow"))({
        Sequelize,
      }),

      notification: require(path.join(schemaPath, "notification"))({
        Sequelize,
      }),
    };

    for (const [tableName, schema] of Object.entries(schemas)) {
      const existingTables = await queryInterface.showAllTables();
      if (!existingTables.includes(tableName)) {
        await queryInterface.createTable(tableName, schema);
      }
    }
  },

  async down(queryInterface, Sequelize) {
    const tables = ["like", "comment", "follow", "notification"];
    for (const table of tables) {
      await queryInterface.dropTable(table);
    }
  },
};
