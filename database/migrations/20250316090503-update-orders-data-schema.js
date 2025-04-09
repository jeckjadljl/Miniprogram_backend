/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-03-15 09:46:49
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-03-16 18:25:45
 * @FilePath: \Mini_program_backend\database\migrations\20250316090503-update-orders-data-schema.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 获取表结构信息
    const getTableStructure = async table => {
      try {
        return await queryInterface.describeTable(table);
      } catch (error) {
        // 如果表不存在，返回空对象
        return {};
      }
    };

    // order_items 表改动
    const orderItemsStructure = await getTableStructure("order_items");

    // 添加 member_goods_id 列（如果不存在）
    if (!orderItemsStructure.member_goods_id) {
      await queryInterface.addColumn("order_items", "member_goods_id", {
        type: Sequelize.STRING(38),
        allowNull: true,
      });
    }

    // 添加 member_packs_name 列（如果不存在）
    if (!orderItemsStructure.member_packs_name) {
      await queryInterface.addColumn("order_items", "member_packs_name", {
        type: Sequelize.STRING(50),
        allowNull: true,
      });
    }

    // 抵用券相关列
    if (!orderItemsStructure.voucher_id) {
      await queryInterface.addColumn("order_items", "voucher_id", {
        type: Sequelize.STRING(38),
        allowNull: true,
      });
    }
    if (!orderItemsStructure.voucher_name) {
      await queryInterface.addColumn("order_items", "voucher_name", {
        type: Sequelize.STRING(50),
        allowNull: true,
      });
    }
    if (!orderItemsStructure.voucher_image) {
      await queryInterface.addColumn("order_items", "voucher_image", {
        type: Sequelize.STRING(255),
        allowNull: true,
      });
    }
    if (!orderItemsStructure.voucher_type) {
      await queryInterface.addColumn("order_items", "voucher_type", {
        type: Sequelize.STRING(255),
        allowNull: true,
      });
    }
    if (!orderItemsStructure.voucher_quantity) {
      await queryInterface.addColumn("order_items", "voucher_quantity", {
        type: Sequelize.STRING(255),
        allowNull: true,
      });
    }

    // 健康币相关列
    if (!orderItemsStructure.points) {
      await queryInterface.addColumn("order_items", "points", {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      });
    }
    if (!orderItemsStructure.points_image) {
      await queryInterface.addColumn("order_items", "points_image", {
        type: Sequelize.STRING(255),
        allowNull: true,
      });
    }

    // 修改列类型或属性（如果需要）
    if (
      orderItemsStructure.goods_id &&
      orderItemsStructure.goods_id.type !== "STRING(38)"
    ) {
      await queryInterface.changeColumn("order_items", "goods_id", {
        type: Sequelize.STRING(38),
        allowNull: true,
      });
    }
    if (
      orderItemsStructure.name &&
      orderItemsStructure.name.type !== "STRING(255)"
    ) {
      await queryInterface.changeColumn("order_items", "name", {
        type: Sequelize.STRING(255),
        allowNull: true,
      });
    }
    if (
      orderItemsStructure.unitName &&
      orderItemsStructure.unitName.type !== "STRING(20)"
    ) {
      await queryInterface.changeColumn("order_items", "unitName", {
        type: Sequelize.STRING(20),
        allowNull: true,
      });
    }
    if (
      orderItemsStructure.salePrice &&
      orderItemsStructure.salePrice.type !== "DECIMAL(10,2)"
    ) {
      await queryInterface.changeColumn("order_items", "salePrice", {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      });
    }
    if (
      orderItemsStructure.quantity &&
      orderItemsStructure.quantity.type !== "INTEGER"
    ) {
      await queryInterface.changeColumn("order_items", "quantity", {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 1,
      });
    }

    // 时间信息列
    if (!orderItemsStructure.lastModifiedTime) {
      await queryInterface.addColumn("order_items", "lastModifiedTime", {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      });
    }
    if (!orderItemsStructure.createdTime) {
      await queryInterface.addColumn("order_items", "createdTime", {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      });
    }

    // points 表改动
    const pointsStructure = await getTableStructure("points");
    if (!pointsStructure.points_image) {
      await queryInterface.addColumn("points", "points_image", {
        type: Sequelize.STRING(255),
        allowNull: true,
      });
    }

    // member_goods 表改动
    const memberGoodsStructure = await getTableStructure("member_goods");
    if (!memberGoodsStructure.points_image) {
      await queryInterface.addColumn("member_goods", "points_image", {
        type: Sequelize.STRING(255),
        allowNull: true,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    // 获取表结构信息
    const getTableStructure = async table => {
      try {
        return await queryInterface.describeTable(table);
      } catch (error) {
        // 如果表不存在，返回空对象
        return {};
      }
    };

    // order_items 表改动
    const orderItemsStructure = await getTableStructure("order_items");

    // 删除添加的列（如果存在）
    if (orderItemsStructure.member_goods_id) {
      await queryInterface.removeColumn("order_items", "member_goods_id");
    }
    if (orderItemsStructure.member_packs_name) {
      await queryInterface.removeColumn("order_items", "member_packs_name");
    }
    if (orderItemsStructure.voucher_id) {
      await queryInterface.removeColumn("order_items", "voucher_id");
    }
    if (orderItemsStructure.voucher_name) {
      await queryInterface.removeColumn("order_items", "voucher_name");
    }
    if (orderItemsStructure.voucher_image) {
      await queryInterface.removeColumn("order_items", "voucher_image");
    }
    if (orderItemsStructure.voucher_type) {
      await queryInterface.removeColumn("order_items", "voucher_type");
    }
    if (orderItemsStructure.voucher_quantity) {
      await queryInterface.removeColumn("order_items", "voucher_quantity");
    }
    if (orderItemsStructure.points) {
      await queryInterface.removeColumn("order_items", "points");
    }
    if (orderItemsStructure.points_image) {
      await queryInterface.removeColumn("order_items", "points_image");
    }
    if (orderItemsStructure.lastModifiedTime) {
      await queryInterface.removeColumn("order_items", "lastModifiedTime");
    }
    if (orderItemsStructure.createdTime) {
      await queryInterface.removeColumn("order_items", "createdTime");
    }

    // 恢复修改的列到原始状态（如果需要）
    if (
      orderItemsStructure.goods_id &&
      orderItemsStructure.goods_id.type === "STRING(38)"
    ) {
      await queryInterface.changeColumn("order_items", "goods_id", {
        type: Sequelize.STRING(38),
        allowNull: false,
      });
    }
    if (
      orderItemsStructure.name &&
      orderItemsStructure.name.type === "STRING(255)"
    ) {
      await queryInterface.changeColumn("order_items", "name", {
        type: Sequelize.STRING(255),
        allowNull: false,
      });
    }
    if (
      orderItemsStructure.unitName &&
      orderItemsStructure.unitName.type === "STRING(20)"
    ) {
      await queryInterface.changeColumn("order_items", "unitName", {
        type: Sequelize.STRING(20),
        allowNull: false,
      });
    }
    if (
      orderItemsStructure.salePrice &&
      orderItemsStructure.salePrice.type === "DECIMAL(10,2)"
    ) {
      await queryInterface.changeColumn("order_items", "salePrice", {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      });
    }
    if (
      orderItemsStructure.quantity &&
      orderItemsStructure.quantity.type === "INTEGER"
    ) {
      await queryInterface.changeColumn("order_items", "quantity", {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      });
    }

    // points 表改动
    const pointsStructure = await getTableStructure("points");
    if (pointsStructure.points_image) {
      await queryInterface.removeColumn("points", "points_image");
    }

    // member_goods 表改动
    const memberGoodsStructure = await getTableStructure("member_goods");
    if (memberGoodsStructure.points_image) {
      await queryInterface.removeColumn("member_goods", "points_image");
    }
  },
};
