/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-05-06 20:36:30
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-05-06 20:44:31
 * @FilePath: \Mini_program_backend\database\migrations\20250506123630-update-member-goods-exchange-field.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("member_goods", "point_spend", {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
    });

    await queryInterface.addColumn("goods_specifications", "member_goods_id", {
      type: Sequelize.STRING(38),
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("member_goods", "point_spend");
    await queryInterface.removeColumn(
      "goods_specifications",
      "member_goods_id"
    );
  },
};
