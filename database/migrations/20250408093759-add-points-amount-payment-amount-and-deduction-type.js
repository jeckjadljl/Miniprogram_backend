/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-04-08 17:37:59
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-04-08 17:38:29
 * @FilePath: \Mini_program_backend\database\migrations\20250408093759-add-points-amount-payment-amount-and-deduction-type.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 为 orders 表添加 points_amount 字段
    await queryInterface.addColumn("orders", "points_amount", {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
    });

    // 为 order_items 表添加 points_amount 和 payment_amount 字段
    await queryInterface.addColumn("order_items", "points_amount", {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
    });

    await queryInterface.addColumn("order_items", "payment_amount", {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0, // 设置默认值以避免 NOT NULL 约束问题
    });

    // 为 member_goods 表添加 deduction_type 字段
    await queryInterface.addColumn("member_goods", "deduction_type", {
      type: Sequelize.ENUM("points", "mixed"),
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // 回滚迁移，删除 orders 表的 points_amount 字段
    await queryInterface.removeColumn("orders", "points_amount");

    // 回滚迁移，删除 order_items 表的 points_amount 和 payment_amount 字段
    await queryInterface.removeColumn("order_items", "points_amount");
    await queryInterface.removeColumn("order_items", "payment_amount");

    // 回滚迁移，删除 member_goods 表的 deduction_type 字段
    await queryInterface.removeColumn("member_goods", "deduction_type");
  },
};
