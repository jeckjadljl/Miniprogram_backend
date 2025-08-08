/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-07-17 16:26:01
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-07-19 11:10:10
 * @FilePath: \Mini_program_backend\app\model\rewards_pool.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

module.exports = app => {
  const { model } = app;
  const rewardsPoolSchema = require("../../app/schema/rewards_pool")(app);

  const RewardsPool = model.define("rewards_pool", rewardsPoolSchema, {
    tableName: "rewards_pool", // 对应数据库中的 'user_roles' 表
  });

  RewardsPool.associate = function () {
    const { User } = model;
    RewardsPool.belongsTo(User, {
      foreignKey: "user_id", // 外键字段
    });
  };

  RewardsPool.saveNew = async ({ user_id, balance, total_in, total_out }) => {
    return await RewardsPool.create({
      user_id,
      balance,
      total_in,
      total_out,
    });
  };

  return RewardsPool;
};
