/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-07-05 17:06:55
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-07-08 16:01:17
 * @FilePath: \Mini_program_backend\app\controller\user_profile.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

const Controller = require("../core/base_controller");

class User_profileController extends Controller {
  async getOrCreateProfile() {
    const { ctx } = this;
    const params = ctx.request.body;
    const result = await ctx.service.userProfile.getOrCreateProfile(params);
    this.success(result);
  }
}

module.exports = User_profileController;
