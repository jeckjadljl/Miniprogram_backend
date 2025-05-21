/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-05-16 00:04:32
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-05-16 00:06:44
 * @FilePath: \Mini_program_backend\database\migrations\20250515160432-create-goods-pricing.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("goods_pricing", {
      uuid: {
        type: Sequelize.STRING(38),
        primaryKey: true,
        allowNull: false,
      },
      goods_id: {
        type: Sequelize.STRING(38),
        allowNull: false,
      },
      spec_id: {
        type: Sequelize.STRING(38),
        allowNull: true,
      },
      spec_color_id: {
        type: Sequelize.STRING(38),
        allowNull: true,
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      salePrice: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      lastModifiedTime: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      createdTime: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("goods_pricing");
  },
};
