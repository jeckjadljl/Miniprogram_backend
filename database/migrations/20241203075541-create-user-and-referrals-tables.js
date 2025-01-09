/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-12-03 15:55:41
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2024-12-03 16:45:53
 * @FilePath: \Mini_program_backend\database\migrations\20241203075541-create-user-and-referrals-tables.js
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
      user: require(path.join(schemaPath, "user"))({ Sequelize }),
      permissions: require(path.join(schemaPath, "permissions"))({ Sequelize }),
      user_roles: require(path.join(schemaPath, "user_roles"))({ Sequelize }),
      role_permissions: require(path.join(schemaPath, "role_permissions"))({
        Sequelize,
      }),
      referrals: require(path.join(schemaPath, "referrals"))({ Sequelize }),
    };

    for (const [tableName, schema] of Object.entries(schemas)) {
      await queryInterface.createTable(tableName, schema);
    }
  },

  down: async (queryInterface, Sequelize) => {
    // 顺序：先删除有外键依赖的表，再删除被依赖的表
    const tables = [
      "user_roles",
      "role_permissions",
      "permissions",
      "referrals",
      "user",
    ];

    // 移除所有外键约束
    for (const tableName of tables) {
      const query = `
        SELECT CONSTRAINT_NAME
        FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
        WHERE TABLE_NAME = '${tableName}'
        AND TABLE_SCHEMA = DATABASE();
      `;

      const results = await queryInterface.sequelize.query(query, {
        type: Sequelize.QueryTypes.SELECT,
      });

      for (const row of results) {
        await queryInterface.removeConstraint(tableName, row.CONSTRAINT_NAME);
      }
    }

    // 删除所有表
    for (const tableName of tables) {
      await queryInterface.dropTable(tableName);
    }
  },
};
