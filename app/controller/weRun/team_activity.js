/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-07-26 15:03:05
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-08-04 11:16:20
 * @FilePath: \Mini_program_backend\app\controller\weRun\team_activity.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

const Controller = require("../../core/base_controller");

class Team_activityController extends Controller {
  async create() {
    const { ctx } = this;
    try {
      const result = await ctx.service.weRun.teamActivity.createActivity(
        ctx.request.body
      );
      this.success(result);
    } catch (e) {
      this.fail(e.message);
    }
  }

  async join() {
    const { ctx } = this;
    try {
      const result = await ctx.service.weRun.teamActivity.joinActivity(
        ...ctx.request.body
      );
      this.success(result);
    } catch (e) {
      this.fail(e.message);
    }
  }

  async getActivityList() {
    const { ctx } = this;
    try {
      const result = await ctx.service.weRun.teamActivity.getActivityList(
        ctx.request.body
      );
      this.success(result);
    } catch (e) {
      this.fail(e.message);
    }
  }

  async getActivityDetail() {
    const { ctx } = this;
    try {
      const result = await ctx.service.weRun.teamActivity.getActivityDetail(
        ctx.request.body
      );
      this.success(result);
    } catch (e) {
      this.fail(e.message);
    }
  }
}

module.exports = Team_activityController;
