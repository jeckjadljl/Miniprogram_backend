/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-03-11 15:40:48
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-03-11 15:44:17
 * @FilePath: \Mini_program_backend\app\controller\permissions.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

const Controller = require("../core/base_controller");

class PermissionsController extends Controller {
  async saveNew() {
    const { ctx } = this;
    const result = await ctx.service.permissions.saveNew(ctx.request.body);
    this.success(result);
  }
}

module.exports = PermissionsController;
