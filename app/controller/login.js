/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-10-21 16:56:10
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-06-15 11:57:14
 * @FilePath: \Mini_program_backend\app\controller\login.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

const Controller = require("../core/base_controller");

class LoginController extends Controller {
  async login() {
    const { ctx } = this;

    try {
      // 解构获取前端传递的字段
      const { code, sessionKey, userInfo } = ctx.request.body;

      // 校验必要参数是否存在
      if (!code || !sessionKey) {
        ctx.throw(400, "缺少必要参数");
      }

      // 调用登录服务，传递解析后的字段
      const result = await ctx.service.login.login({
        code,
        sessionKey,
        userInfo,
      });

      this.success(result);
    } catch (error) {
      ctx.logger.error("登录接口错误:", error);
      this.fail(ctx.ERROR_CODE, error);
    }
  }

  async testlogin() {
    const { ctx } = this;
    const { code, userInfo } = ctx.request.body;

    // 校验必要参数是否存在
    if (!userInfo || !code) {
      ctx.throw(400, "缺少必要参数");
    }

    // 调用登录服务，传递解析后的字段
    const result = await ctx.service.login.testlogin({
      code,
      userInfo,
    });

    this.success(result);
  }

  async getOpenId() {
    const { ctx } = this;
    const { code } = ctx.request.body;
    const result = await ctx.service.login.Login(code);
    this.success(result);
  }

  async refreshLoginStatue() {
    const { ctx } = this;
    const { code, userInfo } = ctx.request.body;
    if (!code || !userInfo) {
      ctx.throw(400, "缺少必要参数");
    }

    // 调用登录服务，传递解析后的字段
    const result = await ctx.service.login.refreshLoginStatue(ctx.request.body);
    this.success(result);
  }
}

module.exports = LoginController;
