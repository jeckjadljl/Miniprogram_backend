/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-05-09 10:03:09
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-05-09 10:07:51
 * @FilePath: \Mini_program_backend\database\migrations\20250509020309-update-goods-spec-table.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("goods_specifications", "point_spend", {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
    });

    await queryInterface.addColumn("goods_specifications", "cash_amount", {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("goods_specifications", "point_spend");
    await queryInterface.removeColumn("goods_specifications", "cash_amount");
  },
};
