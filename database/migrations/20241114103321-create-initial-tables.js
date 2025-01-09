/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-11-14 18:33:21
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2024-11-14 21:35:24
 * @FilePath: \Mini_program_backend\database\migrations\20241114103321-create-initial-tables.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

const path = require("path");
const schemaPath = path.join(__dirname, "../../app/schema");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const schemas = {
      orders: require(path.join(schemaPath, "orders"))({ Sequelize }),
      order_items: require(path.join(schemaPath, "order_items"))({ Sequelize }),
      goods: require(path.join(schemaPath, "goods"))({ Sequelize }),
      cart: require(path.join(schemaPath, "cart"))({ Sequelize }),
      addresses: require(path.join(schemaPath, "addresses"))({ Sequelize }),
    };

    for (const [tableName, schema] of Object.entries(schemas)) {
      await queryInterface.createTable(tableName, schema);
    }
  },

  down: async queryInterface => {
    await queryInterface.dropTable("addresses");
    await queryInterface.dropTable("cart");
    await queryInterface.dropTable("goods");
    await queryInterface.dropTable("order_items");
    await queryInterface.dropTable("orders");
  },
};
