/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-03-12 16:35:40
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-03-12 16:54:00
 * @FilePath: \Mini_program_backend\database\migrations\20250312083540-update-voucher-tables.js
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
      voucher_rules: require(path.join(schemaPath, "voucher_rules"))({
        Sequelize,
      }),
      vouchers: require(path.join(schemaPath, "vouchers"))({
        Sequelize,
      }),
    };

    for (const [tableName, schema] of Object.entries(schemas)) {
      await queryInterface.createTable(tableName, schema);
    }

    await queryInterface.addColumn("member_goods", "member_packs_name", {
      type: Sequelize.STRING(50),
      alloewNull: false,
    });

    await queryInterface.addColumn("member_goods", "voucher_id", {
      type: Sequelize.STRING(38),
      alloewNull: true,
    });

    await queryInterface.addColumn("member_goods", "points", {
      type: Sequelize.DECIMAL(10, 2),
      alloewNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    // 回滚新建的两个表（按创建顺序的逆序删除）
    await queryInterface.dropTable("voucher_rules");
    await queryInterface.dropTable("vouchers");

    // 回滚新增的三个字段
    await queryInterface.removeColumn("member_goods", "member_packs_name");
    await queryInterface.removeColumn("member_goods", "voucher_id");
    await queryInterface.removeColumn("member_goods", "points");
  },
};
