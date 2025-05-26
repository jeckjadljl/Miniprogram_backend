/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-01-03 10:40:52
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-05-26 11:57:15
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

    try {
      const result = await ctx.service.referral.saveNew(
        referrerId,
        referredUserId
      );
      this.success(result);
    } catch (err) {
      const { fields = {}, name, message } = err;
      if (name === "DuplicateReferralError") {
        this.fail(ctx.CONFLICT_CODE, message);
      } else {
        // 未捕获的错误抛出
        ctx.logger.error(err); // 记录日志以便排查
        this.fail(ctx.INTERNAL_ERROR_CODE, "服务器内部错误");
      }
    }
  }

  async getRefererCount() {
    const { ctx } = this;
    const { referrerId } = ctx.request.body;
    const result = await ctx.service.referral.getRefererCount(referrerId);
    this.success(result);
  }

  async getReferrer() {
    const { ctx } = this;
    const { promotionCodeId, referrer_id } = ctx.request.body;
    const result = await ctx.service.referral.getReferrer(
      promotionCodeId,
      referrer_id
    );
    this.success(result);
  }

  async getReferred() {
    const { ctx } = this;
    const { referrerId } = ctx.request.body;
    const result = await ctx.service.referral.getReferred(referrerId);
    this.success(result);
  }

  async getCode() {
    const { ctx } = this;
    const { referrerId } = ctx.request.body;

    if (!referrerId) {
      ctx.throw(400, "缺少必要参数");
      return;
    }

    try {
      const record = await ctx.service.referral.generateMiniProgramCode(
        referrerId
      );
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
