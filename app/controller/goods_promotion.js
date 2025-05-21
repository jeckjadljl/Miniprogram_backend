/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-05-11 21:10:20
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-05-11 21:12:37
 * @FilePath: \Mini_program_backend\app\controller\goods_promotion.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

const Controller = require("../core/base_controller");

class Goods_promotionController extends Controller {
  async saveNew() {
    const { ctx } = this;
    const goods_promotion = await ctx.service.goodsPromotion.saveNew(
      ctx.request.body
    );
    this.success(goods_promotion);
  }
}

module.exports = Goods_promotionController;
