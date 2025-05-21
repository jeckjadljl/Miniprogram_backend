/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-04-09 16:27:17
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-05-20 21:02:32
 * @FilePath: \Mini_program_backend\app\controller\promotion.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
const Controller = require("../core/base_controller");

class PromotionController extends Controller {
  async saveNew() {
    const { ctx } = this;
    const promotion = await ctx.service.promotion.saveNew(ctx.request.body);
    this.success(promotion);
  }

  async saveModify() {
    const { ctx } = this;
    const promotion = await ctx.service.promotion.saveModify(ctx.request.body);
    this.success(promotion);
  }

  async getAll() {
    const { ctx } = this;
    const promotion = await ctx.service.promotion.getAll();
    this.success(promotion);
  }

  async getByActivityType() {
    const { ctx } = this;
    const promotion = await ctx.service.promotion.getByActivityType(
      ctx.request.body
    );
    this.success(promotion);
  }
}

module.exports = PromotionController;
