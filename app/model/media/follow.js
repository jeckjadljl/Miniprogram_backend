/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-08-09 16:54:28
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-08-10 16:58:39
 * @FilePath: \Mini_program_backend\app\model\media\follow.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

module.exports = app => {
  const { model, checkUpdate } = app;
  const FollowSchema = require("../../schema/media/follow")(app);
  const Follow = model.define("media/follow", FollowSchema, {
    tableName: "follow", // 对应数据库中的 'follow' 表
  });

  Follow.associate = function () {
    const { User } = model;
    Follow.belongsTo(User, { foreignKey: "follower_id" });
    Follow.belongsTo(User, { foreignKey: "following_id" });
  };

  return Follow;
};
