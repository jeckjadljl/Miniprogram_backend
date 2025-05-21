/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-04-22 23:26:46
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-04-25 18:21:49
 * @FilePath: \Mini_program_backend\app\controller\video.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

const Controller = require("../core/base_controller");

class VideoController extends Controller {
  async saveNew() {
    const { ctx } = this;
    const result = await ctx.service.video.saveNew(ctx.request.body);
    this.success(result);
  }

  async getVideoList() {
    const { ctx } = this;
    const result = await ctx.service.video.getVideoList(ctx.request.body);
    this.success(result);
  }

  async saveLikes() {
    const { ctx } = this;
    const result = await ctx.service.video.saveLikes(ctx.request.body);
    this.success(result);
  }
}

module.exports = VideoController;
