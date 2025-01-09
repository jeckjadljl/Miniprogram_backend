/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-10-21 10:46:44
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2024-12-17 16:37:03
 * @FilePath: \Mini_program_backend\app\service\membership.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

const Service = require("egg").Service;

class MembershipService extends Service {
  async checkAndUpgradeMembership(userId) {
    try {
      const { User, Order, Referrals, Role, UserRoles } = this.ctx.model;
      const user = await User.findByPk(userId, {
        include: [{ model: Role, as: "roles" }],
      });

      if (!user) {
        this.ctx.throw(404, "用户不存在");
      }

      // 查询用户总消费金额
      const totalSpent = await Order.sum("total_amount", {
        where: { user_id: userId },
      });

      console.log(`用户 ${userId} 的总消费金额为：${totalSpent}`);

      // 查询用户是否已支付 3990 元
      const hasPaid3990 = await Order.findOne({
        where: { user_id: userId, total_amount: 3990 },
      });

      // 定义会员等级的映射规则
      const membershipLevels = [
        { level: "general", condition: totalSpent >= 168 },
        { level: "junior", condition: totalSpent >= 298 },
        {
          level: "premium",
          condition: async () =>
            totalSpent >= 3000 ||
            hasPaid3990 ||
            (await Referrals.countReferrals(userId)) >= 15,
        },
      ];

      // 检查用户需要升级到的会员等级
      for (const { level, condition } of membershipLevels) {
        const shouldUpgrade =
          typeof condition === "function" ? await condition() : condition;
        if (shouldUpgrade && !user.roles.some(role => role.name === level)) {
          await UserRoles.addMembershipRole(user.uuid, level);
          await this.ctx.service.referral.distributeReferralReward(
            userId,
            level
          );
        }
      }

      return user;
    } catch (error) {
      this.ctx.logger.error(`升级会员等级时发生错误: ${error.message}`);
      throw new Error("会员等级升级失败，请稍后重试");
    }
  }
}

module.exports = MembershipService;
