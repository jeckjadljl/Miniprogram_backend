/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-10-22 18:42:35
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-03-31 10:25:45
 * @FilePath: \Mini_program_backend\app\controller\membership.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

const Controller = require("../core/base_controller");

class MembershipController extends Controller {
  // 获取当前会员等级
  async getMembershipInfo(ctx) {
    const user = await ctx.model.User.findByPk(ctx.params.userId);
    ctx.body = { membership_level: user.membership_level };
  }

  // 完成购买后更新会员等级
  async completePurchase(ctx) {
    const { userId, purchaseAmount } = ctx.request.body;
    await ctx.service.membership.updatePurchase(userId, purchaseAmount);
    ctx.body = { success: true };
  }

  async upgradeMembershipLevel() {
    const { ctx } = this;
    const { userId, total_amount } = ctx.request.body;
    const result = await ctx.service.membership.checkAndUpgradeMembership(
      userId,
      total_amount
    );
    this.success(result);
  }

  // async saveNew() {
  //   const { ctx } = this;
  //   const result = await ctx.service.membership.saveNew(ctx.request.body);
  //   this.success(result);
  // }

  /**
   * 会员卡接口(管理端)
   */
  async memberCard() {
    const { ctx } = this;
    const result = await ctx.service.memberCard.saveNew(ctx.request.body);
    this.success(result);
  }

  async getAll() {
    const { ctx } = this;
    const result = await ctx.service.memberCard.getAll();
    this.success(result);
  }

  /**
   * 会员卡获取记录
   */
  async saveMemberCardRecord() {
    const { ctx } = this;
    const result = await ctx.service.memberCardRecord.saveNew(ctx.request.body);
    this.success(result);
  }

  /**
   * 获取用户会员卡
   */
  async getAllMemberCard() {
    const { ctx } = this;
    const user_id = ctx.request.body;
    const result = await ctx.service.memberCardRecord.getAll(user_id);
    this.success(result);
  }

  /**
   * 获取用户会员等级
   */
  async getMembershipLevel() {
    const { ctx } = this;
    const userId = ctx.request.body;
    const result = ctx.service.membership.getMembershipLevel(userId);
    this.success(result);
  }
}

module.exports = MembershipController;
