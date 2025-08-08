/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-07-29 17:10:22
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-07-29 17:16:34
 * @FilePath: \Mini_program_backend\database\migrations\20250729091022-create-review-record-table.js
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
      review_record: require(path.join(schemaPath, "review_record"))({
        Sequelize,
      }),
    };

    for (const [tableName, schema] of Object.entries(schemas)) {
      await queryInterface.createTable(tableName, schema);
    }

    await queryInterface.changeColumn("run_record", "status", {
      type: Sequelize.ENUM(
        "pending",
        "reviewing",
        "approved",
        "rejected",
        "cancelled"
      ),
      allowNull: true,
      defaultValue: "pending",
    });
  },

  async down(queryInterface, Sequelize) {
    const tables = ["review_record"];
    for (const tableName of tables) {
      await queryInterface.dropTable(tableName);
    }

    await queryInterface.changeColumn("run_record", "status", {
      type: Sequelize.ENUM("pending", "reviewing", "approved", "rejected"),
      defaultValue: "pending",
    });
  },
};
