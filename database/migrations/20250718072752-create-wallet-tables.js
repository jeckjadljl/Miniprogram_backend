/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-07-18 15:27:52
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-07-18 15:46:57
 * @FilePath: \Mini_program_backend\database\migrations\20250718072752-create-wallet-tables.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

const path = require("path");
const schemaPath = path.join(__dirname, "../../app/schema");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const schemas = {
      user_wallet: require(path.join(schemaPath, "user_wallet"))({
        Sequelize,
      }),
      wallet_transaction: require(path.join(schemaPath, "wallet_transaction"))({
        Sequelize,
      }),
      rewards_pool: require(path.join(schemaPath, "rewards_pool"))({
        Sequelize,
      }),
      rewards_transfer: require(path.join(schemaPath, "rewards_transfer"))({
        Sequelize,
      }),
    };

    for (const [tableName, schema] of Object.entries(schemas)) {
      await queryInterface.createTable(tableName, schema);
    }

    await queryInterface.addColumn("rewards", "txn_type", {
      type: Sequelize.ENUM(
        "ORDER_REBATE",
        "CONSUME",
        "FROZEN",
        "REFUND",
        "ADJUST"
      ),
      allowNull: false,
    });

    await queryInterface.addColumn("rewards", "txn_no", {
      type: Sequelize.STRING(64),
      allowNull: false,
    });

    await queryInterface.addColumn("rewards", "order_id", {
      type: Sequelize.STRING(38),
      allowNull: false,
    });

    await queryInterface.addColumn("rewards", "balance_after", {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: false,
    });

    await queryInterface.addColumn("rewards", "remark", {
      type: Sequelize.STRING(255),
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    const tables = [
      "user_wallet",
      "wallet_transaction",
      "rewards_pool",
      "rewards_transfer",
    ];
    for (const tableName of tables) {
      await queryInterface.dropTable(tableName);
    }

    const columns = [
      "txn_type",
      "txn_no",
      "order_id",
      "balance_after",
      "remark",
    ];
    for (const columnName of columns) {
      await queryInterface.removeColumn("rewards", columnName);
    }
  },
};
