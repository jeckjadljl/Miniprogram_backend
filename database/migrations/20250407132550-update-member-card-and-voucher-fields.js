/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-04-07 21:25:50
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-04-07 21:28:41
 * @FilePath: \Mini_program_backend\database\migrations\20250407132550-update-member-card-and-voucher-fields.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 修改会员卡相关字段为可空
    await queryInterface.changeColumn("member_goods", "member_card_id", {
      type: Sequelize.STRING(38),
      allowNull: true,
    });

    await queryInterface.changeColumn("member_goods", "member_card_name", {
      type: Sequelize.STRING(50),
      allowNull: true,
    });

    await queryInterface.changeColumn("member_goods", "member_card_images", {
      type: Sequelize.STRING(255),
      allowNull: true,
    });

    await queryInterface.changeColumn("member_goods", "member_card_salePrice", {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
    });

    await queryInterface.changeColumn("member_goods", "voucher_name", {
      type: Sequelize.STRING(50),
      allowNull: true,
    });

    await queryInterface.changeColumn("member_goods", "voucher_image", {
      type: Sequelize.STRING(255),
      allowNull: true,
    });

    await queryInterface.changeColumn("member_goods", "voucher_type", {
      type: Sequelize.STRING(30),
      allowNull: true,
    });

    await queryInterface.changeColumn("member_goods", "voucher_quantity", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // 回滚修改，将会员卡相关字段设置为不可空
    await queryInterface.changeColumn("member_goods", "member_card_id", {
      type: Sequelize.STRING(38),
      allowNull: false,
    });

    await queryInterface.changeColumn("member_goods", "member_card_name", {
      type: Sequelize.STRING(50),
      allowNull: false,
    });

    await queryInterface.changeColumn("member_goods", "member_card_images", {
      type: Sequelize.STRING(255),
      allowNull: false,
    });

    await queryInterface.changeColumn("member_goods", "member_card_salePrice", {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    });

    await queryInterface.changeColumn("member_goods", "voucher_name", {
      type: Sequelize.STRING(50),
      allowNull: false,
    });

    await queryInterface.changeColumn("member_goods", "voucher_image", {
      type: Sequelize.STRING(255),
      allowNull: false,
    });

    await queryInterface.changeColumn("member_goods", "voucher_type", {
      type: Sequelize.STRING(30),
      allowNull: false,
    });

    await queryInterface.changeColumn("member_goods", "voucher_quantity", {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
  },
};
