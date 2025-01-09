"use strict";

const Controller = require("egg").Controller;

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
}

module.exports = MembershipController;
