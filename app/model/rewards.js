/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-11-22 16:29:35
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2024-11-27 12:03:27
 * @FilePath: \Mini_program_backend\app\model\rewards.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
module.exports = app => {
  const { model } = app;
  const RewardsSchema = require("../../app/schema/rewards")(app);

  const Rewards = model.define("reward", RewardsSchema, {
    tableName: "rewards",
  });

  Rewards.associate = function () {
    const { User } = model;
    Rewards.belongsTo(User, { foreignKey: "user_id" });
  };

  Rewards.findBalanceAmount = async ({ userId }) => {
    return await Rewards.findOne({
      where: { user_id: userId },
    });
  };

  // 创建奖励记录
  Rewards.createReward = async ({ userId, amount, description }) => {
    await this.ctx.model.Reward.create({
      user_id: userId,
      amount,
      description,
      created_at: new Date(),
    });
  };

  return Rewards;
};
