/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-07-17 22:24:40
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-07-18 22:09:33
 * @FilePath: \Mini_program_backend\app\controller\user_wallet.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

const Controller = require("../core/base_controller");

class User_walletController extends Controller {
  async getOrCreateWallet() {
    const { ctx } = this;
    const result = await ctx.service.userWallet.getOrCreateWallet(
      ctx.request.body
    );
    this.success(result);
  }

  async updateBalance() {
    const { ctx } = this;
    const result = await ctx.service.userWallet.updateBalance(ctx.request.body);
    this.success(result);
  }

  async getAllWalletRecord() {
    const { ctx } = this;
    const result = await ctx.service.userWallet.getAllWalletRecord(
      ctx.request.body
    );
    this.success(result);
  }

  /**
   * 佣金池
   */
  async updateRewardsBalance() {
    const { ctx } = this;
    const result = await ctx.service.rewardsPool.updateBalance(
      ctx.request.body
    );
    this.success(result);
  }

  async getAllRewardsRecord() {
    const { ctx } = this;
    const result = await ctx.service.rewards.getAllRewardsRecord(
      ctx.request.body
    );
    this.success(result);
  }
}

module.exports = User_walletController;
