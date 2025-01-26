/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-01-15 12:21:43
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-01-15 12:23:36
 * @FilePath: \Mini_program_backend\database\migrations\20250115042143-add-spec-to-cart.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("cart", "spec", {
      type: Sequelize.STRING(255),
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("cart", "spec");
  },
};
