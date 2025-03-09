/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-11-22 17:03:53
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-03-05 17:37:55
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

  Referrals.findReferred = async ({ referredUserId, attributes }) => {
    return await Referrals.findOne({
      where: { referred_user_id: referredUserId },
      include: [
        {
          model: model.User,
          attributes,
          as: "referrer",
        },
      ],
    });
  };

  Referrals.getReferred = async ({ referrerId, attributes }) => {
    return await Referrals.findAll({
      where: { referrer_id: referrerId },
      include: [
        {
          model: model.User,
          attributes,
          as: "referredUser",
        },
      ],
    });
  };

  Referrals.countReferrals = async referrerId => {
    return await Referrals.count({
      where: { referrer_id: referrerId },
    });
  };

  Referrals.saveNew = async ({ referrerId, referredUserId, referralLevel }) => {
    try {
      const newReferral = await Referrals.create({
        referrer_id: referrerId,
        referred_user_id: referredUserId,
        level: referralLevel,
      });

      // 查询推荐人信息，并限制返回字段
      const referrerInfo = await model.User.findOne({
        where: { uuid: referrerId },
        attributes: ["uuid", "avatar", "user_name", "phoneNumber"],
      });

      // 返回推荐记录和推荐人信息
      return {
        newReferral,
        referrer: referrerInfo,
      };
    } catch (error) {
      app.logger.error("保存推荐关系失败", error);
      throw error;
    }
  };

  return Referrals;
};
