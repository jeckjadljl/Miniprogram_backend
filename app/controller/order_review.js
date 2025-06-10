/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-06-04 11:28:33
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-06-04 11:30:34
 * @FilePath: \Mini_program_backend\app\controller\order_review.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

const Controller = require("../core/base_controller");

class Order_reviewController extends Controller {
  async saveNew() {
    const { ctx } = this;
    const result = await ctx.service.orderReview.saveNew(ctx.request.body);
    this.success(result);
  }

  async saveLikes() {
    const { ctx } = this;
    const result = await ctx.service.orderReview.saveLikes(ctx.request.body);
    this.success(result);
  }
}

module.exports = Order_reviewController;
