/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-12-13 18:18:25
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2024-12-13 18:19:41
 * @FilePath: \Mini_program_backend\database\migrations\20241213101825-rename-creator-fields.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  /**
   * 创建 `categories` 表并在 `goods` 表中新增字段和外键关联
   * @param {import('sequelize').QueryInterface} queryInterface - QueryInterface实例
   * @param {import('sequelize').Sequelize} Sequelize - Sequelize实例
   */
  up: async (queryInterface, Sequelize) => {
    // 重命名字段
    await queryInterface.renameColumn(
      "goods_category",
      "creator_name",
      "creatorName"
    );
    await queryInterface.renameColumn(
      "goods_category",
      "creator_id",
      "creatorId"
    );
  },

  down: async (queryInterface, Sequelize) => {
    // 还原字段
    await queryInterface.renameColumn(
      "goods_category",
      "creatorName",
      "creator_name"
    );
    await queryInterface.renameColumn(
      "goods_category",
      "creatorId",
      "creator_id"
    );
  },
};
