/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-10-21 10:46:44
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-06-08 10:29:51
 * @FilePath: \Mini_program_backend\app\service\membership.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

const Service = require("egg").Service;

const TestMemberCard = require("../utils/testMemberCard");

class MembershipService extends Service {
  async checkAndUpgradeMembership(userId, total_amount) {
    try {
      const { User, Order, Referrals, Role, UserRoles } = this.ctx.model;
      const user = await User.findByPk(userId, {
        include: [{ model: Role, as: "roles" }],
      });

      if (!user) {
        this.ctx.throw(404, "用户不存在");
      }

      // 查询用户总消费金额
      const totalSpent = await Order.sum("payment_amount", {
        where: {
          user_id: userId,
          order_status: "completed", // 只统计已完成订单
        },
      });

      console.log(`用户 ${userId} 的总消费金额为：${totalSpent}`);

      // 定义会员等级的映射规则
      const membershipLevels = [
        // { level: "general", condition: totalSpent >= 168 },
        // {
        //   level: "junior",
        //   condition:
        //     totalSpent >= 298 || (await Referrals.countReferrals(userId)) >= 3,
        // },
        {
          level: "premium",
          condition: async () =>
            totalSpent >= 3000 ||
            total_amount === 3990 ||
            (await Referrals.countReferrals(userId)) >= 30,
        },
      ];

      // 检查用户需要升级到的会员等级
      for (const { level, condition } of membershipLevels) {
        const shouldUpgrade =
          typeof condition === "function" ? await condition() : condition;
        if (shouldUpgrade && !user.roles.some(role => role.name === level)) {
          await UserRoles.addMembershipRole(user.uuid, level);
          // await this.ctx.service.referral.distributeReferralReward(
          //   userId,
          //   level
          // );
        }
      }

      // 获取更新后的最高会员等级
      const updatedLevel = await UserRoles.getUserHighestRole(userId);

      return {
        user,
        totalSpent,
        memberLevel: updatedLevel, // 直接使用获取到
      };
    } catch (error) {
      this.ctx.logger.error(`升级会员等级时发生错误: ${error.message}`);
      throw new Error("会员等级升级失败，请稍后重试");
    }
  }

  async saveNew(params = {}) {
    const { ctx } = this;
    const testMemberCard = new TestMemberCard(ctx);
    const result = await testMemberCard.createMembershipCard(params);
    return result;
  }

  async getMembershipLevel(userId) {
    const { app } = this;
    const { UserRoles } = app.model;
    const level = UserRoles.getUserHighestRole(userId);
    if (!level) {
      throw new Error("用户未设置会员等级");
    }
    return level;
  }
}

module.exports = MembershipService;
