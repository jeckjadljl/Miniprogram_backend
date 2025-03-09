/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-02-10 17:02:27
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-03-02 15:25:34
 * @FilePath: \Mini_program_backend\app\controller\auth.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

const Controller = require("../core/base_controller");

class AuthController extends Controller {
  async refreshAccessToken() {
    const { ctx } = this;
    const { userId } = ctx.request.body;
    const authHeader = ctx.request.header.authorization;
    const refresh_token = authHeader.replace(/^Bearer\s+/i, "");

    // 验证用户ID是否存在
    if (!userId) {
      this.fail(400, "User ID is required.");
      return;
    }

    // 验证刷新令牌是否存在
    if (!refresh_token) {
      this.fail(401, "Session expired, please log in again.");
      return;
    }

    try {
      // 调用服务层方法刷新访问令牌
      const result = await ctx.service.jwt.refreshAccessToken(userId, "token");
      this.success(result);
    } catch (error) {
      // 处理可能的错误
      console.error("Error refreshing access token:", error);
      this.fail(401, "Session expired, please log in again.");
    }
  }

  async getposter() {
    const { ctx } = this;
    const result = await ctx.service.cos.getFileContent();
    this.success(result);
  }

  /**
   * 管理端
   */
  async refreshAdminToken() {
    const { ctx } = this;
    const { userId } = ctx.request.body;
    const authHeader = ctx.request.header.authorization;
    const refresh_token = authHeader.replace(/^Bearer\s+/i, "");

    // 验证用户ID是否存在
    if (!userId) {
      this.fail(400, "User ID is required.");
      return;
    }

    // 验证刷新令牌是否存在
    if (!refresh_token) {
      this.fail(401, "Session expired, please log in again.");
      return;
    }

    try {
      const result = await ctx.service.jwt.refreshAdminToken(userId, "token");
      this.success(result);
    } catch (error) {
      // 处理可能的错误
      console.error("Error refreshing access token:", error);
      this.fail(401, "Session expired, please log in again.");
    }
  }
}

module.exports = AuthController;
