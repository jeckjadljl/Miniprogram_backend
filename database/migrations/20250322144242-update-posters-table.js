/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-03-22 22:42:42
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-03-22 22:43:31
 * @FilePath: \Mini_program_backend\database\migrations\20250322144242-update-posters-table.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 添加 goods_id 字段
    await queryInterface.addColumn("posters", "goods_id", {
      type: Sequelize.STRING(38),
      allowNull: true,
    });

    // 修改 purpose 字段
    await queryInterface.changeColumn("posters", "purpose", {
      type: Sequelize.ENUM("home", "elements", "goods", "user"),
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // 如果需要回滚迁移，删除 goods_id 字段
    await queryInterface.removeColumn("posters", "goods_id");

    // 如果需要回滚迁移，将 purpose 字段恢复为原始定义
    await queryInterface.changeColumn("posters", "purpose", {
      type: Sequelize.ENUM("home", "elements", "user"),
      allowNull: false,
    });
  },
};
