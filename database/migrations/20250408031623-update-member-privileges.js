/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-04-08 11:16:23
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-04-08 11:55:15
 * @FilePath: \Mini_program_backend\database\migrations\20250408031623-update-member-privileges.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 重命名 member_goods_id 为 member_card_id
    await queryInterface.addColumn("member_privileges", "member_goods_id", {
      type: Sequelize.STRING(38),
      allowNull: true,
    });

    await queryInterface.changeColumn("member_privileges", "member_card_id", {
      type: Sequelize.STRING(38),
      allowNull: true,
    });

    await queryInterface.changeColumn("member_privileges", "card_type", {
      type: Sequelize.ENUM("green", "orange", "black"),
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("member_privileges", "member_goods_id");
    await queryInterface.changeColumn("member_privileges", "member_card_id", {
      type: Sequelize.STRING(38),
      allowNull: false,
    });
    await queryInterface.changeColumn("member_privileges", "card_type", {
      type: Sequelize.ENUM("green", "orange", "black"),
      allowNull: false,
    });
  },
};
