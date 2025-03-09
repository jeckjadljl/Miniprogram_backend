/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-03-06 21:00:36
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-03-06 21:02:07
 * @FilePath: \Mini_program_backend\database\migrations\20250306130036-modify-business-order-id.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 修改字段类型为 JSON
    await queryInterface.changeColumn("payments", "business_order_id", {
      type: Sequelize.JSON,
      defaultValue: [],
      allowNull: false,
    });

    // 如果已有数据，需要将现有字符串值转换为 JSON 数组
    await queryInterface.sequelize.query(
      "UPDATE payments SET business_order_id = JSON_ARRAY(business_order_id)"
    );
  },

  down: async (queryInterface, Sequelize) => {
    // 如果需要回滚，可以将字段类型改回 STRING
    await queryInterface.changeColumn("payments", "business_order_id", {
      type: Sequelize.STRING(32),
      allowNull: false,
    });
  },
};
