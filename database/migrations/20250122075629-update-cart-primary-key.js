/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-01-22 15:56:29
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-01-22 15:58:51
 * @FilePath: \Mini_program_backend\database\migrations\20250122075629-update-cart-primary-key.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 修改表结构
    await queryInterface.changeColumn("cart", "spec", {
      type: Sequelize.STRING(255),
      allowNull: false,
    });

    // 删除已有的主键
    await queryInterface.removeConstraint("cart", "PRIMARY");

    // 设置新的联合主键
    await queryInterface.addConstraint("cart", {
      fields: ["user_id", "goods_id", "spec"],
      type: "primary key",
      name: "cart_primary_key",
    });
  },

  down: async (queryInterface, Sequelize) => {
    // 回滚：删除新的主键
    await queryInterface.removeConstraint("cart", "cart_primary_key");

    // 恢复之前的主键（仅 user_id 和 goods_id）
    await queryInterface.addConstraint("cart", {
      fields: ["user_id", "goods_id"],
      type: "primary key",
      name: "cart_primary_key",
    });

    // 回滚 spec 字段更改
    await queryInterface.changeColumn("cart", "spec", {
      type: Sequelize.STRING(255),
      allowNull: true,
    });
  },
};
