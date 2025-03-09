/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-11-04 11:27:25
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-02-03 11:23:56
 * @FilePath: \Mini_program_backend\app\model\avatar.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

module.exports = app => {
  const { model } = app;
  const AvatarSchema = require("../../app/schema/avatar")(app);

  const Avatar = model.define("avatar", AvatarSchema, {
    tableName: "avatar", // 对应数据库中的 'cart' 表
  });

  Avatar.saveNew = async ({ md5, avatarUrl }) => {
    return await Avatar.create({
      md5,
      avatarUrl,
    });
  };

  Avatar.getAvatarByMD5 = async ({ md5 }) => {
    return await Avatar.findOne({ where: { md5 } });
  };

  return Avatar;
};
