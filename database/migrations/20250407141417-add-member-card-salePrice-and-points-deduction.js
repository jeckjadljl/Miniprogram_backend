/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-04-07 22:14:17
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-04-07 22:27:48
 * @FilePath: \Mini_program_backend\database\migrations\20250407141417-add-member-card-salePrice-and-points-deduction.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 为 member_goods 表添加字段
    await queryInterface.addColumn("member_goods", "member_packs_salePrice", {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
    });

    await queryInterface.addColumn("member_goods", "points_deduction", {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
    });

    await queryInterface.addColumn("member_goods", "member_goods_status", {
      type: Sequelize.ENUM("up", "down"),
      allowNull: false,
      defaultValue: "up", // 设置默认值以避免现有记录违反 NOT NULL 约束
    });

    // 为 order_items 表添加字段
    await queryInterface.addColumn("order_items", "member_packs_salePrice", {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
    });

    await queryInterface.addColumn("order_items", "points_deduction", {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // 回滚迁移，删除 member_goods 表的字段
    await queryInterface.removeColumn("member_goods", "member_packs_salePrice");
    await queryInterface.removeColumn("member_goods", "points_deduction");
    await queryInterface.removeColumn("member_goods", "member_goods_status");

    // 回滚迁移，删除 order_items 表的字段
    await queryInterface.removeColumn("order_items", "member_packs_salePrice");
    await queryInterface.removeColumn("order_items", "points_deduction");
  },
};
