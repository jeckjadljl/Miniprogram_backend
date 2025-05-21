/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-04-13 22:59:57
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-04-13 23:04:57
 * @FilePath: \Mini_program_backend\database\migrations\20250413145957-create-tables-goods_promotion-promotion.js
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
      promotion: require(path.join(schemaPath, "promotion"))({
        Sequelize,
      }),
      goods_promotion: require(path.join(schemaPath, "goods_promotion"))({
        Sequelize,
      }),
    };

    for (const [tableName, schema] of Object.entries(schemas)) {
      await queryInterface.createTable(tableName, schema);
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("promotion");
    await queryInterface.dropTable("goods_promotion");
  },
};
