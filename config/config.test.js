/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-10-16 17:44:22
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2024-12-31 16:29:17
 * @FilePath: \Mini_program_backend\config\config.test.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
/* eslint valid-jsdoc: "off" */
require("dotenv").config({
  path: `.env.${process.env.NODE_ENV || "test"}`,
});
const fecha = require("fecha");
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
    MYSQL_DATABASE_UNITEST,
    MYSQL_HOST,
    MYSQL_PORT,
    MYSQL_USERNAME,
    MYSQL_PASSWORD,
    JWT_SECRET,
    REDIS_PORT,
    REDIS_HOST,
    NODEJS_PORT,
  } = process.env;

  config.cluster = {
    listen: {
      path: "",
      port: parseInt(NODEJS_PORT),
      hostname: "0.0.0.0",
    },
  };

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + "_1729071823602_1200";

  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  config.security = {
    csrf: {
      enable: false,
    },
  };

  config.middleware = ["auth"];

  config.mysql = {
    // database configuration
    client: {
      // host
      host: MYSQL_HOST,
      // port
      port: MYSQL_PORT,
      // username
      user: MYSQL_USERNAME,
      // password
      password: MYSQL_PASSWORD,
      // database
      database: MYSQL_DATABASE_UNITEST,
    },
    // load into app, default is open
    app: true,
    // load into agent, default is close
    agent: false,
  };

  config.sequelize = {
    dialect: "mysql", // support: mysql, mariadb, postgres, mssql
    database: MYSQL_DATABASE_UNITEST,
    host: MYSQL_HOST,
    port: MYSQL_PORT,
    username: MYSQL_USERNAME,
    password: MYSQL_PASSWORD,
    timezone: "+08:00",
    define: {
      createdAt: "createdTime",
      updatedAt: "lastModifiedTime",
      freezeTableName: true, // 禁止 Sequelize 自动将表名变为复数
      getterMethods: {
        createdTime() {
          const createdTime = this.getDataValue("createdTime");
          if (createdTime) {
            return createdTime
              ? fecha.format(createdTime, "YYYY-MM-DD HH:mm:ss")
              : null;
          }
        },
        lastModifiedTime() {
          const lastModifiedTime = this.getDataValue("lastModifiedTime");
          if (lastModifiedTime) {
            return lastModifiedTime
              ? fecha.format(lastModifiedTime, "YYYY-MM-DD HH:mm:ss")
              : null;
          }
        },
      },
      setterMethods: {
        version(value) {
          if (typeof value === "number" && !isNaN(value)) {
            this.setDataValue("version", value + 1);
          }
        },
      },
    },
  };

  config.redis = {
    clients: {
      default: {
        // 默认数据库，用于通用缓存
        host: REDIS_HOST, // Redis host
        port: REDIS_PORT, // Redis port
        password: "",
        db: 0,
      },
      token: {
        // 登录 token 数据库
        host: REDIS_HOST, // Redis host
        port: REDIS_PORT, // Redis port
        password: "",
        db: 1,
      },
      order: {
        // 订单单号数据库
        host: REDIS_HOST, // Redis host
        port: REDIS_PORT, // Redis port
        password: "",
        db: 2,
      },
      subscribe: {
        host: REDIS_HOST,
        port: REDIS_PORT,
        password: "",
        db: 3,
      },
    },
  };

  config.jwt = {
    expire: 7200, // 2小时
    refresh_expire: 259200, // 3天
    secret: JWT_SECRET,
    // ignore: ["/api/registered", "/api/login"], // 哪些请求不需要认证
    // expiresIn: '24h',
  };

  config.io = {
    init: {}, // Socket.IO 初始化配置
    namespace: {
      "/": {
        connectionMiddleware: [], // 中间件（可选）
        packetMiddleware: [], // 数据包中间件（可选）
      },
    },
  };

  return {
    ...config,
    ...userConfig,
  };
};
