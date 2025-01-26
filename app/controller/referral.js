/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-01-03 10:40:52
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-01-18 18:10:42
 * @FilePath: \Mini_program_backend\app\controller\referral.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

const Controller = require("../core/base_controller");

class ReferralController extends Controller {
  async saveNew() {
    const { ctx } = this;
    const { referrerId, referredUserId } = ctx.request.body;
    const result = await ctx.service.referral.saveNew(
      referrerId,
      referredUserId
    );
    this.success(result);
  }

  async getCode() {
    const { ctx } = this;
    const { scene } = ctx.request.body;

    if (!scene) {
      ctx.throw(400, "缺少必要参数");
      return;
    }

    try {
      const record = await ctx.service.referral.generateMiniProgramCode(scene);
      this.success(record);
    } catch (error) {
      ctx.logger.error("获取小程序码接口错误:", error);
      this.fail(ctx.ERROR_CODE, error);
    }
  }

  async updataQRCode() {
    const { ctx } = this;
    const { path, referrerId, promotionCodeId } = ctx.request.body;

    if (!path || !referrerId || !promotionCodeId) {
      ctx.throw(400, "缺少必要参数");
      return;
    }

    try {
      const record = await ctx.service.referral.updataQRCode(
        path,
        referrerId,
        promotionCodeId
      );
      this.success(record);
    } catch (error) {
      ctx.logger.error("获取小程序码接口错误:", error);
      this.fail(ctx.ERROR_CODE, error);
    }
  }
}

module.exports = ReferralController;
