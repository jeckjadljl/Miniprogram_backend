/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-08-09 16:42:14
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-08-10 16:57:57
 * @FilePath: \Mini_program_backend\app\model\media\like.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

module.exports = app => {
  const { model, checkUpdate } = app;
  const likeSchema = require("../../schema/media/like")(app);
  const Like = model.define("media/like", likeSchema, {
    tableName: "like", // 对应数据库中的 'like' 表
  });

  Like.associate = function () {
    const { Posts, User } = model;
    Like.belongsTo(User, { foreignKey: "user_id" });
    Like.belongsTo(Posts, { foreignKey: "post_id", as: "post" });
  };

  return Like;
};
