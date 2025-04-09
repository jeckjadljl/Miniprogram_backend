/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-03-27 16:55:02
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-03-27 16:57:34
 * @FilePath: \Mini_program_backend\database\migrations\20250327085502-update-member-card-tables.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 删除 member_card 表中的 status 字段
    await queryInterface.removeColumn("member_card", "status");

    // 在 member_card_record 表中添加 card_type 字段
    await queryInterface.addColumn("member_card_record", "card_type", {
      type: Sequelize.ENUM("green", "orange", "black"),
      allowNull: false,
      defaultValue: "green", // 可选，默认值
    });

    // 在 member_card_record 表中添加 status 字段
    await queryInterface.addColumn("member_card_record", "status", {
      type: Sequelize.ENUM("active", "inactive", "expired"),
      allowNull: false,
      defaultValue: "inactive", // 可选，默认值
    });

    // 在 member_card_record 表中添加 salePrice 字段
    await queryInterface.addColumn("member_card_record", "salePrice", {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    });

    // 在 member_card_record 表中添加 tag 字段
    await queryInterface.addColumn("member_card_record", "tag", {
      type: Sequelize.STRING(10),
      allowNull: true,
    });

    // 在 member_card_record 表中添加 membership_level 字段
    await queryInterface.addColumn("member_card_record", "membership_level", {
      type: Sequelize.ENUM("general", "junior", "premium"),
      allowNull: false,
      defaultValue: "general", // 可选，默认值
    });
  },

  down: async (queryInterface, Sequelize) => {
    // 回滚操作：重新添加 member_card 表中的 status 字段
    await queryInterface.addColumn("member_card", "status", {
      type: Sequelize.ENUM("active", "inactive", "expired"),
      allowNull: false,
    });

    // 回滚操作：删除 member_card_record 表中的 card_type、status、salePrice、tag 和 membership_level 字段
    await queryInterface.removeColumn("member_card_record", "card_type");
    await queryInterface.removeColumn("member_card_record", "status");
    await queryInterface.removeColumn("member_card_record", "salePrice");
    await queryInterface.removeColumn("member_card_record", "tag");
    await queryInterface.removeColumn("member_card_record", "membership_level");
  },
};
