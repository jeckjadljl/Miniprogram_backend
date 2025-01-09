/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-11-07 15:37:49
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2024-11-07 17:40:22
 * @FilePath: \Mini_program_backend\database\migrations\20241107073749-init-all-tables.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

const fs = require("fs");
const path = require("path");
const folderPath = path.join(__dirname, "../../app/schema");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const files = fs.readdirSync(folderPath);

    // 初始化数据库
    for (const fileName of files) {
      const filePath = path.join(folderPath, fileName);
      delete require.cache[require.resolve(filePath)]; // 清除缓存以确保更新
      const schema = require(filePath)({ Sequelize });
      const tableName = fileName.replace(".js", ""); // 表名从文件名中提取
      await queryInterface.createTable(tableName, schema);
    }
  },

  down: async queryInterface => {
    // 删除所有表
    await queryInterface.dropAllTables();
  },
};
