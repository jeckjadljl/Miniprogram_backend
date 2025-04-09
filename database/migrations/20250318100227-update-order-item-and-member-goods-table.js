/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-03-18 18:02:27
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-03-18 18:04:30
 * @FilePath: \Mini_program_backend\database\migrations\20250318100227-update-order-item-and-member-goods-table.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("order_items", "member_card_id", {
      type: Sequelize.STRING(50),
      allowNull: true,
    });

    await queryInterface.addColumn("order_items", "member_card_name", {
      type: Sequelize.STRING(50),
      allowNull: true,
    });

    await queryInterface.addColumn("order_items", "member_card_images", {
      type: Sequelize.STRING(255),
      allowNull: true,
    });

    await queryInterface.addColumn("order_items", "member_card_salePrice", {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
    });

    await queryInterface.addColumn("member_goods", "member_card_name", {
      type: Sequelize.STRING(50),
      allowNull: false,
    });

    await queryInterface.addColumn("member_goods", "member_card_images", {
      type: Sequelize.STRING(255),
      allowNull: false,
    });

    await queryInterface.addColumn("member_goods", "member_card_salePrice", {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("order_items", "member_card_id");
    await queryInterface.removeColumn("order_items", "member_card_name");
    await queryInterface.removeColumn("order_items", "member_card_images");
    await queryInterface.removeColumn("order_items", "member_card_salePrice");

    await queryInterface.removeColumn("member_goods", "member_card_name");
    await queryInterface.removeColumn("member_goods", "member_card_images");
    await queryInterface.removeColumn("member_goods", "member_card_salePrice");
  },
};
