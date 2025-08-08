/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-07-25 16:21:12
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-08-05 11:00:03
 * @FilePath: \Mini_program_backend\app\controller\weRun\team.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

const Controller = require("../../core/base_controller");

class TeamController extends Controller {
  async create() {
    const { ctx } = this;

    try {
      const result = await ctx.service.weRun.team.createTeam(ctx.request.body);
      this.success(result);
    } catch (e) {
      this.fail(e.message || "创建团队失败");
    }
  }

  async join() {
    const { ctx } = this;

    try {
      const result = await ctx.service.weRun.team.joinTeam(ctx.request.body);
      this.success(result);
    } catch (error) {
      this.fail(error.message || "加入团队失败");
    }
  }

  async ranking() {
    const { ctx } = this;
    const list = await ctx.service.weRun.team.getRanking(ctx.request.body);
    this.success(list);
  }

  async info() {
    const { ctx } = this;
    const { team_id } = ctx.request.body;
    const data = await ctx.service.weRun.team.getTeamInfo(team_id);
    this.success(data);
  }
}

module.exports = TeamController;
