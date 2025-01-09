/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-11-22 17:03:53
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2024-12-17 16:20:02
 * @FilePath: \Mini_program_backend\app\model\referrals.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
module.exports = app => {
  const { model } = app;
  const ReferralsSchema = require("../../app/schema/referrals")(app);

  const Referrals = model.define("referral", ReferralsSchema, {
    tableName: "referrals",
    timestamps: false,
  });

  Referrals.associate = function () {
    const { User } = model;
    // 推荐人关联到 User
    Referrals.belongsTo(User, {
      foreignKey: "referrer_id",
      as: "referrer", // 关联推荐人
    });

    // 被推荐人关联到 User
    Referrals.belongsTo(User, {
      foreignKey: "referred_user_id",
      as: "referredUser", // 关联被推荐人
    });
  };

  Referrals.findReferred = async referredUserId => {
    return await Referrals.findOne({
      where: { referred_user_id: referredUserId },
      include: [{ model: model.User, as: "referrer" }],
    });
  };

  Referrals.countReferrals = async userId => {
    return await Referrals.count({
      where: { referrer_id: userId, membership_level: "junior" },
    });
  };

  return Referrals;
};
