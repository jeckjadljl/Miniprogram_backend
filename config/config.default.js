/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-10-16 17:44:22
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-05-19 09:48:58
 * @FilePath: \Mini_program_backend\config\config.default.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
/* eslint valid-jsdoc: "off" */
require("dotenv").config();
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
    MYSQL_DATABASE,
    MYSQL_HOST,
    MYSQL_PORT,
    MYSQL_USERNAME,
    MYSQL_PASSWORD,
    JWT_SECRET,
    REDIS_PORT,
    REDIS_HOST,
    NODEJS_PORT,
    TENCENT_SECRET_ID,
    TENCENT_SECRET_KEY,
    TENCENT_BUCKET,
    TENCENT_REGION,
    WX_APPID,
    WX_PAYMENTS_PRIVATEKEY_PATH,
    WX_PAYMENTS_MCH_ID,
    WX_PAYMENTS_SERIAL_NO,
    WX_PAYMENTS_APIV3_KEY,
    WX_NOTIFY_URL,
    KDNIAO_API_KEY,
    KDNIAO_REQUEST_URL,
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
  config.middleware = ["auth"];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  config.security = {
    csrf: {
      enable: false,
    },
  };

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
      database: MYSQL_DATABASE,
    },
    // load into app, default is open
    app: true,
    // load into agent, default is close
    agent: false,
  };

  config.sequelize = {
    dialect: "mysql", // support: mysql, mariadb, postgres, mssql
    database: MYSQL_DATABASE,
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
      group: {
        host: REDIS_HOST,
        port: REDIS_PORT,
        password: "",
        db: 4,
      },
    },
  };

  config.jwt = {
    expire: 7200, // 2小时
    refresh_expire: 86400,
    secret: JWT_SECRET,
    // ignore: ["/api/registered", "/api/login"], // 哪些请求不需要认证
    // expiresIn: '24h',
  };

  config.cors = {
    origin: "*", // 改为你的前端地址
    allowMethods: "GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS", // 被允许的请求方式
    credentials: true, // 如果需要跨域传递 Cookie 或 Authorization
    allowHeaders: "Content-Type,Authorization,X-Token", // 明确允许的请求头
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

  config.cos = {
    SecretId: TENCENT_SECRET_ID, // 腾讯云 SecretId
    SecretKey: TENCENT_SECRET_KEY, // 腾讯云 SecretKey
    Bucket: TENCENT_BUCKET, // 存储桶名称
    Region: TENCENT_REGION, // 存储区域
  };

  config.multipart = {
    mode: "file",
    fileExtensions: [".jpg", ".jpeg", ".png"], // 允许的上传文件类型
  };

  config.kdniao = {
    apiKey: KDNIAO_API_KEY,
    requestUrl: KDNIAO_REQUEST_URL,
  };

  // config/config.default.js
  config.wechatPay = {
    mchId: WX_PAYMENTS_MCH_ID, // 商户号
    privateKeyPath: WX_PAYMENTS_PRIVATEKEY_PATH, // API 私钥文件路径
    serialNo: WX_PAYMENTS_SERIAL_NO, // 证书序列号
    appId: WX_APPID, // 小程序AppID
    apiV3Key: WX_PAYMENTS_APIV3_KEY, // API v3密钥
    notify_url: WX_NOTIFY_URL,
  };

  return {
    ...config,
    ...userConfig,
  };
};
