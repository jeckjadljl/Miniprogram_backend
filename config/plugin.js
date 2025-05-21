/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-10-16 17:44:22
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-05-04 22:42:18
 * @FilePath: \Mini_program_backend\config\plugin.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
/** @type Egg.EggPlugin */
module.exports = {
  // had enabled by egg
  // static: {
  //   enable: true,
  // }
  sequelize: {
    enable: true,
    package: "egg-sequelize",
  },

  mysql: {
    enable: true,
    package: "egg-mysql",
  },

  jwt: {
    enable: true,
    package: "egg-jwt",
  },

  redis: {
    enable: true,
    package: "egg-redis",
  },

  validate: {
    enable: true,
    package: "egg-validate",
  },

  cors: {
    enable: true,
    package: "egg-cors",
  },

  io: {
    enable: true,
    package: "egg-socket.io",
  },

  schedule: {
    enable: true,
    package: "egg-schedule",
  },
};
