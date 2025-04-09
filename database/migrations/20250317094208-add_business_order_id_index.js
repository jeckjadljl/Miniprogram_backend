/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-03-17 17:42:08
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-03-17 18:13:20
 * @FilePath: \Mini_program_backend\database\migrations\20250317094208-add_business_order_id_index.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 添加生成列存储所有订单ID
    await queryInterface.addColumn("payments", "all_order_ids", {
      type: Sequelize.TEXT,
      allowNull: true,
      generated: {
        type: "VIRTUAL",
        as: "GENERATED ALWAYS AS (REPLACE(JSON_EXTRACT(business_order_id, '$[*]'), '\"', ''))",
      },
    });

    // 创建全文索引
    await queryInterface.addIndex("payments", {
      name: "idx_all_order_ids",
      fields: [Sequelize.literal("all_order_ids")],
      type: "FULLTEXT",
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex("payments", "idx_all_order_ids");
    await queryInterface.removeColumn("payments", "all_order_ids");
  },
};
