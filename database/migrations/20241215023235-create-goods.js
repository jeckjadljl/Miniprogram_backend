"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  /**
   * 创建 `categories` 表并在 `goods` 表中新增字段和外键关联
   * @param {import('sequelize').QueryInterface} queryInterface - QueryInterface实例
   * @param {import('sequelize').Sequelize} Sequelize - Sequelize实例
   */
  up: async (queryInterface, Sequelize) => {
    const { DATE } = Sequelize;

    // 获取 `goods` 表结构
    const goodsTable = await queryInterface.describeTable("goods");

    // 修改字段名（如果不存在 `name` 字段）
    if (!goodsTable.name) {
      await queryInterface.renameColumn("goods", "goods_name", "name");
    }
    if (!goodsTable.goodsInfo) {
      await queryInterface.renameColumn("goods", "goods_desc", "goodsInfo");
    }
    if (!goodsTable.spec) {
      await queryInterface.renameColumn("goods", "goods_spec", "spec");
    }

    // 添加 `created_at` 字段
    if (!goodsTable.created_at) {
      await queryInterface.addColumn("goods", "created_at", {
        type: DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      });
    }

    // 添加 `updated_at` 字段
    if (!goodsTable.updated_at) {
      await queryInterface.addColumn("goods", "updated_at", {
        type: DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      });
    }
  },

  /**
   * 回滚操作
   */
  down: async (queryInterface, Sequelize) => {
    // 回滚字段名
    await queryInterface.renameColumn("goods", "name", "goods_name");
    await queryInterface.renameColumn("goods", "goodsInfo", "goods_desc");
    await queryInterface.renameColumn("goods", "spec", "goods_spec");

    // 删除新添加的字段
    await queryInterface.removeColumn("goods", "created_at");
    await queryInterface.removeColumn("goods", "updated_at");
  },
};
