/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-02-21 11:59:50
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-02-21 15:43:45
 * @FilePath: \Mini_program_backend\app\controller\elements.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

const Controller = require("../core/base_controller");

class ElementsController extends Controller {
  async saveNew() {
    const { ctx } = this;
    const rule = {
      Elements: "object",
    };
    ctx.validate(rule);
    const result = await ctx.service.elements.saveNew(ctx.request.body);
    this.success(result);
  }

  async getAll() {
    const { ctx } = this;
    const elements = await ctx.service.elements.getAll();
    this.success(elements);
  }

  async get() {
    const { ctx } = this;
    const result = await ctx.service.elements.get(ctx.request.body);
    this.success(result);
  }
}

module.exports = ElementsController;
