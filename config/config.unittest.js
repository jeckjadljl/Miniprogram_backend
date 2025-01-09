/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-10-16 17:44:22
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2024-10-21 18:10:58
 * @FilePath: \Mini_program_backend\config\config.default.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
/* eslint valid-jsdoc: "off" */
require("dotenv").config();
/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {});

  const {
    MYSQP_DATABASE_UNITEST,
    MYSQL_HOST,
    MYSQL_PORT,
    MYSQL_USERNAME,
    MYSQL_PASSWORD,
  } = process.env;

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + "_1729071823602_1200";

  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  config.sequelize = {
    dialect: "mysql", // support: mysql, mariadb, postgres, mssql
    database: MYSQP_DATABASE_UNITEST,
    host: MYSQL_HOST,
    port: MYSQL_PORT,
    username: MYSQL_USERNAME,
    password: MYSQL_PASSWORD,
    define: {
      timestamps: false, // 全局禁用自动添加 `createdAt` 和 `updatedAt` 字段
    },
  };

  return {
    ...config,
    ...userConfig,
  };
};
