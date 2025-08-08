/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-08-06 11:29:47
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-08-06 12:10:13
 * @FilePath: \Mini_program_backend\database\migrations\20250806032947-create-member-package-tables.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

const path = require("path");
const schemaPath = path.join(__dirname, "../../app/schema");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const schemas = {
      member_goods_package: require(path.join(
        schemaPath,
        "member_goods_package"
      ))({
        Sequelize,
      }),

      member_goods_package_item: require(path.join(
        schemaPath,
        "member_goods_package_item"
      ))({
        Sequelize,
      }),
    };

    for (const [tableName, schema] of Object.entries(schemas)) {
      const existingTables = await queryInterface.showAllTables();
      if (!existingTables.includes(tableName)) {
        await queryInterface.createTable(tableName, schema);
      }
    }

    await queryInterface.renameColumn(
      "member_goods_group",
      "member_card_id",
      "member_package_id"
    );
  },

  async down(queryInterface, Sequelize) {
    const tables = ["member_goods_package", "member_goods_package_item"];
    for (const table of tables) {
      await queryInterface.dropTable(table);
    }

    await queryInterface.renameColumn(
      "member_goods_group",
      "member_package_id",
      "member_card_id"
    );
  },
};
