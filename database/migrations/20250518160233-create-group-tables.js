/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-05-19 00:02:34
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-05-19 00:05:43
 * @FilePath: \Mini_program_backend\database\migrations\20250518160233-create-group-tables.js
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
      groups: require(path.join(schemaPath, "groups"))({
        Sequelize,
      }),
      group_item: require(path.join(schemaPath, "group_item"))({
        Sequelize,
      }),
      group_buyer: require(path.join(schemaPath, "group_buyer"))({
        Sequelize,
      }),
    };

    for (const [tableName, schema] of Object.entries(schemas)) {
      await queryInterface.createTable(tableName, schema);
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tables = ["groups", "group_item", "group_buyer"];
    for (const tableName of tables) {
      await queryInterface.dropTable(tableName);
    }
  },
};
