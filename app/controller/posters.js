/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-02-23 16:10:59
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-02-23 16:12:24
 * @FilePath: \Mini_program_backend\app\controller\posters.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

const Controller = require("../core/base_controller");

class PostersController extends Controller {
  async saveNew() {
    const { ctx } = this;
    const rule = {
      Posters: "object",
    };
    ctx.validate(rule);
    const result = await ctx.service.posters.saveNew(ctx.request.body);
    this.success(result);
  }
}

module.exports = PostersController;
