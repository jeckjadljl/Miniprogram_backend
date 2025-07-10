/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-07-05 11:18:15
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-07-05 11:21:30
 * @FilePath: \Mini_program_backend\database\migrations\20250705031815-create-profile-tables.js
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
      user_profile: require(path.join(schemaPath, "user_profile"))({
        Sequelize,
      }),
      posts: require(path.join(schemaPath, "posts"))({
        Sequelize,
      }),
      interactions: require(path.join(schemaPath, "interactions"))({
        Sequelize,
      }),
    };

    for (const [tableName, schema] of Object.entries(schemas)) {
      await queryInterface.createTable(tableName, schema);
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tables = ["user_profile", "posts", "interactions"];
    for (const tableName of tables) {
      await queryInterface.dropTable(tableName);
    }
  },
};
