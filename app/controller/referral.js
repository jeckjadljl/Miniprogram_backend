/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-01-03 10:40:52
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-01-03 10:53:06
 * @FilePath: \Mini_program_backend\app\controller\referral.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

const Controller = require("../core/base_controller");

class ReferralController extends Controller {
  async getCode() {
    const { ctx } = this;
    const { scene, page } = ctx.request.body;

    if (!scene || !page) {
      ctx.body = { success: false, message: "缺少必要参数" };
      return;
    }

    try {
      const filePath = await ctx.service.referral.generateMiniProgramCode(
        scene,
        page
      );
      this.success(filePath);
    } catch (error) {
      this.fail(ctx.INTERNAL_ERROR_CODE, error);
    }
  }
}

module.exports = ReferralController;
