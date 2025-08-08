/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-03-11 16:08:06
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-07-15 22:02:26
 * @FilePath: \Mini_program_backend\app\controller\member_privileges.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

const Controller = require("../core/base_controller");

class Member_privilegesController extends Controller {
  async saveNew() {
    const { ctx } = this;
    const result = await ctx.service.memberPrivileges.saveNew(ctx.request.body);
    this.success(result);
  }

  async saveModify() {
    const { ctx } = this;
    const result = await ctx.service.memberPrivileges.saveModify(
      ctx.request.body
    );
    this.success(result);
  }

  async getAll() {
    const { ctx } = this;
    const result = await ctx.service.memberPrivileges.getAll();
    this.success(result);
  }
}

module.exports = Member_privilegesController;
