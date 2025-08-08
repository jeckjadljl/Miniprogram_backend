/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-11-06 16:32:21
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-07-19 11:08:13
 * @FilePath: \Mini_program_backend\app\model\user_wallet.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

module.exports = app => {
  const { model } = app;
  const userWalletSchema = require("../../app/schema/user_wallet")(app);

  const UserWallet = model.define("user_wallet", userWalletSchema, {
    tableName: "user_wallet", // 对应数据库中的 'user_roles' 表
  });

  UserWallet.associate = function () {
    const { User, WalletTransaction } = model;
    UserWallet.belongsTo(User, {
      foreignKey: "user_id", // 外键字段
    });
    UserWallet.hasMany(WalletTransaction, {
      foreignKey: "user_id",
      sourceKey: "user_id",
    });
  };

  UserWallet.saveNew = async ({ user_id, balance, total_in, total_out }) => {
    return await UserWallet.create({
      user_id,
      balance,
      total_in,
      total_out,
    });
  };

  return UserWallet;
};
