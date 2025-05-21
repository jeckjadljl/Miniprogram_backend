/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-05-10 16:20:59
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-05-10 16:25:53
 * @FilePath: \Mini_program_backend\database\migrations\20250510082059-create-member-cart-table.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("member_cart", {
      user_id: {
        type: Sequelize.STRING(38),
        primaryKey: true,
        allowNull: false,
      },
      goods_id: {
        type: Sequelize.STRING(38),
        primaryKey: true,
        allowNull: false,
      },
      spec: {
        type: Sequelize.STRING(255),
        primaryKey: true,
        allowNull: false,
      },
      member_goods_id: {
        type: Sequelize.STRING(38),
        primaryKey: true,
        allowNull: false,
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      createdTime: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      lastModifiedTime: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("member_cart");
  },
};
