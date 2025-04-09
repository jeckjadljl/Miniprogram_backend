/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-03-14 23:34:05
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-03-17 11:14:56
 * @FilePath: \Mini_program_backend\app\controller\vouchers.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

const Controller = require("../core/base_controller");

class VouchersController extends Controller {
  async saveNew() {
    const { ctx } = this;
    const result = ctx.service.vouchers.saveNew(ctx.request.body);
    this.success(result);
  }
}

module.exports = VouchersController;
