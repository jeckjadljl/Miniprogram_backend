/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-05-04 16:46:08
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-05-05 12:09:29
 * @FilePath: \Mini_program_backend\app\controller\logistics.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

const Controller = require("../core/base_controller");

class LogisticsController extends Controller {
  async saveNew() {
    const { ctx } = this;
    const result = await ctx.service.logistics.saveNew(ctx.request.body);
    this.success(result);
  }

  async updateWaybillToken() {
    const { ctx } = this;
    const { logisticsId, orderId } = ctx.request.body;
    const result = await ctx.service.logistics.updateWaybillToken(
      logisticsId,
      orderId
    );
    this.success(result);
  }
}

module.exports = LogisticsController;
