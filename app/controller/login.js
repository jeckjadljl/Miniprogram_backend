/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-10-21 16:56:10
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2024-11-08 18:53:49
 * @FilePath: \Mini_program_backend\app\controller\login.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

const Controller = require("egg").Controller;

class LoginController extends Controller {
  async login() {
    const { ctx } = this;
    const { user } = ctx.request.body;
    const { loginCode, getPhoneCode } = ctx.request.body.code;
    const getinfo = await ctx.service.login.login(
      loginCode,
      getPhoneCode,
      user.data
    );
    return getinfo;
  }
}

module.exports = LoginController;
