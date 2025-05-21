/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-05-15 23:57:59
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-05-16 00:56:16
 * @FilePath: \Mini_program_backend\app\controller\goods_pricing.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

const Controller = require("../core/base_controller");

class Goods_pricingController extends Controller {
  async saveNew() {
    const { ctx } = this;
    const result = await ctx.service.goodsPricing.saveNew(ctx.request.body);
    this.success(result);
  }

  async getGoodsPricingById() {
    const { ctx } = this;
    const result = await ctx.service.goodsPricing.getGoodsPricingById(
      ctx.request.body
    );
    this.success(result);
  }
}

module.exports = Goods_pricingController;
