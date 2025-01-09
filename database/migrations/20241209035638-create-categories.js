/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-12-09 11:56:38
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2024-12-11 17:05:20
 * @FilePath: \Mini_program_backend\database\migrations\20241209035638-create-categories.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

const path = require("path");
const schemaPath = path.join(__dirname, "../../app/schema");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  /**
   * 创建 `categories` 表并在 `goods` 表中新增字段和外键关联
   * @param {import('sequelize').QueryInterface} queryInterface - QueryInterface实例
   * @param {import('sequelize').Sequelize} Sequelize - Sequelize实例
   */
  up: async (queryInterface, Sequelize) => {
    const { STRING, DATE, NOW, ENUM } = Sequelize;

    const schemas = {
      goods_category: require(path.join(schemaPath, "goods_category"))({
        Sequelize,
      }),
      merchant: require(path.join(schemaPath, "merchant"))({
        Sequelize,
      }),
      payments: require(path.join(schemaPath, "payments"))({
        Sequelize,
      }),
    };

    for (const [tableName, schema] of Object.entries(schemas)) {
      await queryInterface.createTable(tableName, schema);
    }

    // 检查表描述以确认字段是否存在
    const goodsTable = await queryInterface.describeTable("goods");
    const ordersTable = await queryInterface.describeTable("orders");
    const orderItemsTable = await queryInterface.describeTable("order_items");
    const addressesTable = await queryInterface.describeTable("addresses");
    // 在 `goods` 表中新增 `categoryUuid` 字段
    if (!goodsTable.category_id) {
      await queryInterface.addColumn("goods", "category_id", {
        type: STRING(38),
        allowNull: true, // 如果字段必须有值，可以改为 false
      });
    }
    if (!goodsTable.orgUuid) {
      await queryInterface.addColumn("goods", "orgUuid", {
        type: STRING(38),
      });
    }

    if (!goodsTable.lastModifiedTime) {
      await queryInterface.addColumn("goods", "lastModifiedTime", {
        type: DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      });
    }

    if (!goodsTable.lastModifierName) {
      await queryInterface.addColumn("goods", "lastModifierName", {
        type: STRING(76),
        allowNull: false,
      });
    }

    if (!goodsTable.lastModifierId) {
      await queryInterface.addColumn("goods", "lastModifierId", {
        type: STRING(38),
        allowNull: false,
      });
    }

    if (!goodsTable.creatorName) {
      await queryInterface.addColumn("goods", "creatorName", {
        type: STRING(76),
        allowNull: false,
      });
    }

    if (!goodsTable.creatorId) {
      await queryInterface.addColumn("goods", "creatorId", {
        type: STRING(38),
        allowNull: false,
      });
    }

    if (!goodsTable.status) {
      await queryInterface.addColumn("goods", "status", {
        type: ENUM("up", "down"),
        allowNull: false,
      });
    }

    // 在 `orders` 表中新增字段
    if (!ordersTable.orgUuid) {
      await queryInterface.addColumn("orders", "orgUuid", {
        type: STRING(38),
        allowNull: false,
      });
    }

    if (!ordersTable.lastModifiedTime) {
      await queryInterface.addColumn("orders", "lastModifiedTime", {
        type: DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      });
    }

    if (!ordersTable.lastModifierName) {
      await queryInterface.addColumn("orders", "lastModifierName", {
        type: STRING(76),
        allowNull: false,
      });
    }

    if (!ordersTable.lastModifierId) {
      await queryInterface.addColumn("orders", "lastModifierId", {
        type: STRING(38),
        allowNull: false,
      });
    }

    if (!ordersTable.creatorName) {
      await queryInterface.addColumn("orders", "creatorName", {
        type: STRING(76),
        allowNull: false,
      });
    }

    if (!ordersTable.creatorId) {
      await queryInterface.addColumn("orders", "creatorId", {
        type: STRING(38),
        allowNull: false,
      });
    }

    if (!ordersTable.userName) {
      await queryInterface.addColumn("orders", "userName", {
        type: STRING(76),
        allowNull: false,
      });
    }

    // 修改 `orders` 表中的 `user_id` 字段类型
    if (ordersTable.user_id && ordersTable.user_id.type !== "STRING(38)") {
      await queryInterface.changeColumn("orders", "user_id", {
        type: STRING(38),
        allowNull: false,
      });
    }

    // 在 `order_items` 表中新增字段
    if (!orderItemsTable.created_at) {
      await queryInterface.addColumn("order_items", "created_at", {
        type: DATE,
        allowNull: false,
      });
    }

    if (!orderItemsTable.updated_at) {
      await queryInterface.addColumn("order_items", "updated_at", {
        type: DATE,
        allowNull: false,
        defaultValue: NOW,
      });
    }

    // 在 `addresses` 表中新增字段
    if (!addressesTable.lastModifiedTime) {
      await queryInterface.addColumn("addresses", "lastModifiedTime", {
        type: DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      });
    }

    if (!addressesTable.lastModifierName) {
      await queryInterface.addColumn("addresses", "lastModifierName", {
        type: STRING(76),
        allowNull: false,
      });
    }

    if (!addressesTable.lastModifierId) {
      await queryInterface.addColumn("addresses", "lastModifierId", {
        type: STRING(38),
        allowNull: false,
      });
    }

    if (!addressesTable.creatorId) {
      await queryInterface.addColumn("addresses", "creatorId", {
        type: STRING(38),
        allowNull: false,
      });
    }

    if (!addressesTable.linkMan) {
      await queryInterface.addColumn("addresses", "linkMan", {
        type: STRING(76),
        allowNull: false,
      });
    }

    if (addressesTable.phone && !addressesTable.linkPhone) {
      await queryInterface.renameColumn("addresses", "phone", "linkPhone");
    }
  },

  /**
   * 回滚迁移：删除 `goods` 表的字段和约束，删除 `categories` 表
   * @param {import('sequelize').QueryInterface} queryInterface - QueryInterface实例
   * @param {import('sequelize').Sequelize} Sequelize - Sequelize实例
   */
  down: async (queryInterface, Sequelize) => {
    const { STRING } = Sequelize;

    // 删除 `goods` 表中的 `categoryUuid` 字段
    await queryInterface.removeColumn("goods", "category_id");
    await queryInterface.removeColumn("goods", "orgUuid");
    await queryInterface.removeColumn("goods", "lastModifiedTime");
    await queryInterface.removeColumn("goods", "lastModifierName");
    await queryInterface.removeColumn("goods", "lastModifierId");
    await queryInterface.removeColumn("goods", "creatorName");
    await queryInterface.removeColumn("goods", "creatorId");
    await queryInterface.removeColumn("goods", "status");

    await queryInterface.removeColumn("orders", "orgUuid");
    await queryInterface.removeColumn("orders", "lastModifiedTime");
    await queryInterface.removeColumn("orders", "lastModifierName");
    await queryInterface.removeColumn("orders", "lastModifierId");
    await queryInterface.removeColumn("orders", "creatorName");
    await queryInterface.removeColumn("orders", "creatorId");
    await queryInterface.removeColumn("orders", "userName");

    await queryInterface.removeColumn("addresses", "lastModifiedTime");
    await queryInterface.removeColumn("addresses", "lastModifierName");
    await queryInterface.removeColumn("addresses", "lastModifierId");
    await queryInterface.removeColumn("addresses", "creatorId");
    await queryInterface.removeColumn("addresses", "linkMan");

    // 修改 `order` 表的 `user_id` 字段类型回退
    await queryInterface.changeColumn("orders", "user_id", {
      type: STRING,
      allowNull: false,
    });

    // 修改 `addresses` 表中的 `linkPhone` 字段为 `phone`
    await queryInterface.renameColumn("addresses", "linkPhone", "phone");

    await queryInterface.removeColumn("order_items", "created_at");
    await queryInterface.removeColumn("order_items", "updated_at");

    // 删除表
    const tables = ["goods_category", "merchant", "payment_record"];
    for (const tableName of tables) {
      await queryInterface.dropTable(tableName);
    }
  },
};
