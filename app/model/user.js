/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-10-21 15:39:20
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-07-09 21:14:37
 * @FilePath: \Mini_program_backend\app\model\user.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
// app/model/user.js
"use strict";

module.exports = app => {
  const { model } = app;
  const userSchema = require("../../app/schema/user")(app);

  const User = model.define("user", userSchema, {
    tableName: "user", // 对应数据库中的 'user_data' 表
  });

  // 在这里定义 belongsToMany 关联
  User.associate = function () {
    const {
      Role,
      Goods,
      Order,
      Address,
      Referrals,
      Rewards,
      Points,
      Vouchers,
      UserRoles,
      Qrcode,
      MemberCard,
      MemberCardRecord,
      VoucherRules,
      Payments,
      GroupBuyer,
      UserProfile,
      Posts,
      Interactions,
    } = model;
    User.belongsToMany(Role, {
      through: UserRoles,
      foreignKey: "user_id",
      otherKey: "role_id",
    });
    User.belongsToMany(Goods, {
      through: "Cart",
      foreignKey: "user_id",
      otherKey: "goods_id",
    });
    User.hasOne(Qrcode, { foreignKey: "referrer_id", as: "referrerInfo" });
    User.hasMany(Order, { foreignKey: "user_id" });
    User.hasMany(Address, { foreignKey: "user_id" });
    // 用户作为推荐人（多对多）
    User.hasMany(Referrals, {
      foreignKey: "referrer_id",
      as: "referralsUsers",
    });
    // 用户作为被推荐人（一对一）
    User.hasOne(Referrals, {
      foreignKey: "referred_user_id",
      as: "referrer",
    });
    User.hasMany(Rewards, { foreignKey: "user_id" });
    User.hasMany(Points, { foreignKey: "user_id" });
    User.belongsToMany(VoucherRules, {
      through: Vouchers,
      foreignKey: "user_id",
      otherKey: "voucher_id",
    });
    User.belongsToMany(MemberCard, {
      through: MemberCardRecord,
      foreignKey: "user_id",
      otherKey: "member_card_id",
    });
    User.hasMany(Payments, { foreignKey: "user_id" });
    User.hasMany(GroupBuyer, { foreignKey: "buyer_id" });
    User.hasOne(UserProfile, { foreignKey: "user_id", as: "profile" });
    User.hasMany(Posts, { foreignKey: "user_id", as: "posts" });
    User.hasMany(Interactions, {
      foreignKey: "reply_user_id",
      as: "interactions",
    });
  };

  User.saveModify = async user => {
    const { uuid } = user;
    await User.update(user, { where: { uuid } });
    await model.UserProfile.saveModify({ user_id: uuid, ...user });
    return uuid;
  };

  User.getRole = async (userId, roleName) => {
    const user = await User.findOne({
      where: { uuid: userId },
      include: [
        {
          model: model.Role,
          as: "roles",
          where: { name: roleName }, // 筛选指定角色
        },
      ],
    });

    return !!user;
  };

  User.cumulativeSpent = async (userId, amount) => {
    const user = await User.findByPk(userId); // 查询用户实例

    if (!user) {
      throw new Error("用户不存在");
    }

    // 加上累计消费金额
    const totalSpent =
      (parseFloat(user.cumulative_spent) || 0) + (parseFloat(amount) || 0);

    user.cumulative_spent = totalSpent;
    await user.save();

    return totalSpent;
  };

  // 增加积分
  User.addPoints = async (userId, point) => {
    const user = await User.findByPk(userId); // 静态方法内部查询用户

    if (!user) {
      throw new Error("用户不存在");
    }

    const currentPoints = parseFloat(user.consumption_points || 0);
    const newBalance = currentPoints + parseFloat(point);

    // 更新用户积分余额
    user.consumption_points = newBalance;
    await user.save();

    return newBalance;
  };

  // 减少积分
  User.subtractPoints = async (userId, point) => {
    const user = await User.findByPk(userId); // 静态方法内部查询用户

    if (!user) {
      throw new Error("用户不存在");
    }

    const currentPoints = parseFloat(user.consumption_points || 0);
    const newBalance = Math.max(0, currentPoints - parseFloat(point)); // 积分不允许为负

    // 更新用户积分余额
    user.consumption_points = newBalance;
    await user.save();

    return newBalance;
  };

  User.record = async ({ userId }) => {
    const { Points } = model;
    const user = await User.findByPk(userId, {
      include: [{ model: Points, as: "points" }],
    });

    if (!user) {
      this.ctx.throw(404, "用户不存在");
    }

    return user.points; // 返回用户的积分历史记录
  };

  User.getPoint = async ({ userId }) => {
    const user = await User.findByPk(userId, {
      attributes: ["consumption_points"], // 仅查询消费积分字段
    });

    if (!user) {
      this.ctx.throw(404, "用户不存在");
    }

    return { consumptionPoints: user.consumption_points }; // 返回积分数额
  };

  User.addBalance = async (userId, amount) => {
    const user = await User.findByPk(userId); // 静态方法内部查询用户

    if (!user) {
      throw new Error("用户不存在");
    }

    const currentBalance = parseFloat(user.balance || 0);
    const newBalance = currentBalance + parseFloat(amount);

    // 更新用户积分余额
    user.balance = newBalance;
    await user.save();

    return newBalance;
  };

  User.subtractBalance = async (userId, amount) => {
    const user = await User.findByPk(userId); // 静态方法内部查询用户

    if (!user) {
      throw new Error("用户不存在");
    }

    const currentBalance = parseFloat(user.balance || 0);
    const newBalance = Math.max(0, currentBalance - parseFloat(amount)); // 积分不允许为负

    // 更新用户积分余额
    user.balance = newBalance;
    await user.save();

    return newBalance;
  };

  return User;
};
