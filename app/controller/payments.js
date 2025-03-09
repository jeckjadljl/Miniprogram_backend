/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-02-26 16:27:12
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-03-07 21:56:45
 * @FilePath: \Mini_program_backend\app\controller\payments.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

const Controller = require("../core/base_controller");

class PaymentsController extends Controller {
  async createPayment() {
    const { ctx } = this;
    // 调用服务层的下单方法
    const wechatPayService = ctx.service.payments;
    const result = await wechatPayService.createPayment(ctx.request.body);

    this.success(result);
  }
}

module.exports = PaymentsController;
