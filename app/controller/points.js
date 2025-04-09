/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-03-15 10:45:30
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-03-15 10:46:49
 * @FilePath: \Mini_program_backend\app\controller\points.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

const Controller = require("../core/base_controller");

class PointsController extends Controller {
  async saveNew() {
    const { ctx } = this;
    const result = await ctx.service.points.saveNew(ctx.request.body);
    this.success(result);
  }
}

module.exports = PointsController;
