/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-03-13 22:17:52
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-03-13 22:49:33
 * @FilePath: \Mini_program_backend\app\controller\voucher_rules.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

const Controller = require("../core/base_controller");

class Voucher_rulesController extends Controller {
  async saveNew() {
    const { ctx } = this;
    const result = ctx.service.voucherRules.saveNew(ctx.request.body);
    this.success(result);
  }
}

module.exports = Voucher_rulesController;
