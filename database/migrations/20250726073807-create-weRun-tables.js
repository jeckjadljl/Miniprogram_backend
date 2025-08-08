/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-07-26 15:38:07
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-07-26 15:54:26
 * @FilePath: \Mini_program_backend\database\migrations\20250726073807-create-weRun-tables.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

const path = require("path");
const schemaPath = path.join(__dirname, "../../app/schema/weRun");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const schemas = {
      run_record: require(path.join(schemaPath, "run_record"))({
        Sequelize,
      }),
      team_members: require(path.join(schemaPath, "team_members"))({
        Sequelize,
      }),
      team_activity: require(path.join(schemaPath, "team_activity"))({
        Sequelize,
      }),
      team: require(path.join(schemaPath, "team"))({
        Sequelize,
      }),
      team_members_activity: require(path.join(
        schemaPath,
        "team_members_activity"
      ))({
        Sequelize,
      }),
    };

    for (const [tableName, schema] of Object.entries(schemas)) {
      await queryInterface.createTable(tableName, schema);
    }
  },

  async down(queryInterface, Sequelize) {
    const tables = [
      "run_record",
      "team_members",
      "team_activity",
      "team",
      "team_members_activity",
    ];
    for (const tableName of tables) {
      await queryInterface.dropTable(tableName);
    }
  },
};
