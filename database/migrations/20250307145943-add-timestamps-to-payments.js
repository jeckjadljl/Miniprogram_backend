/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-03-07 22:59:43
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-03-07 23:08:54
 * @FilePath: \Mini_program_backend\database\migrations\20250307145943-add-timestamps-to-payments.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("payments", "lastModifiedTime", {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    });
    await queryInterface.addColumn("payments", "createdTime", {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("payments", "lastModifiedTime");
    await queryInterface.removeColumn("payments", "createdTime");
  },
};
