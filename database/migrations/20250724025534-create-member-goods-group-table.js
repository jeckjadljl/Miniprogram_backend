/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-07-24 10:55:34
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-07-24 11:03:45
 * @FilePath: \Mini_program_backend\database\migrations\20250724025534-create-member-goods-group-table.js
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
      member_goods_group: require(path.join(schemaPath, "member_goods_group"))({
        Sequelize,
      }),
    };

    for (const [tableName, schema] of Object.entries(schemas)) {
      await queryInterface.createTable(tableName, schema);
    }

    // 关联 member_goods 和 member_goods_group
    await queryInterface.addColumn("member_goods", "member_goods_group_id", {
      type: Sequelize.STRING(38),
      allowNull: true,
    });

    await queryInterface.addColumn("member_goods", "group_type", {
      type: Sequelize.ENUM("single", "combo-item", "combo-group"),
      allowNull: false,
    });

    await queryInterface.addColumn("member_goods", "min_select", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.addColumn("member_goods", "max_select", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    const tables = ["member_goods_group"];
    for (const tableName of tables) {
      await queryInterface.dropTable(tableName);
    }

    await queryInterface.removeColumn("member_goods", "member_goods_group_id");
    await queryInterface.removeColumn("member_goods", "group_type");
    await queryInterface.removeColumn("member_goods", "min_select");
    await queryInterface.removeColumn("member_goods", "max_select");
  },
};
