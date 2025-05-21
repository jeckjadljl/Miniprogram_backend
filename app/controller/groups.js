/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-05-18 12:12:39
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-05-19 12:25:12
 * @FilePath: \Mini_program_backend\app\controller\groups.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
const Controller = require("../core/base_controller");

class GroupController extends Controller {
  async createGroup() {
    const { ctx } = this;
    const result = await ctx.service.groups.createGroup(ctx.request.body);
    this.success(result);
  }

  async getGroupStatus() {
    const { ctx } = this;
    const result = await ctx.service.groups.getGroupStatus(ctx.request.body.id);
    this.success(result);
  }

  async joinGroup() {
    const { ctx } = this;
    const result = await ctx.service.groupBuyer.joinGroup(ctx.request.body);
    this.success(result);
  }
}

module.exports = GroupController;
