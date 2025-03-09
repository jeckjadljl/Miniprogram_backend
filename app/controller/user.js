/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-10-21 15:35:19
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-02-03 20:55:38
 * @FilePath: \Mini_program_backend\app\controller\user.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

const Controller = require("../core/base_controller");

// app/controller/user.js
class UserController extends Controller {
  async createUser() {
    const { ctx } = this;
    const result = await ctx.service.user.addUser(ctx.request.body);
    ctx.body = result;
  }

  async getUser() {
    const { ctx } = this;
    const openid = ctx.params.openid;
    const user = await ctx.service.user.getUserByOpenid(openid);
    ctx.body = user;
  }

  async updateUser() {
    const { ctx } = this;
    const { uuid, userData } = ctx.request.body;
    const result = await ctx.service.user.updateUser(uuid, userData);
    this.success(result);
  }

  // 上传用户头像
  async uploadAvatar() {
    const { ctx, service } = this;
    const { avatarMD5 } = ctx.request.body;
    const file = ctx.request.files?.[0];

    if (!file) {
      ctx.body = { code: 400, message: "请上传头像" };
      return;
    }

    if (!avatarMD5) {
      ctx.body = { code: 400, message: "缺少 MD5 值" };
      return;
    }

    try {
      // 获取文件的临时路径
      const filePath = String(file.filepath); // 确保 filePath 是字符串
      console.log("上传的 filePath:", filePath);

      // 调用 COS 上传服务
      const avatarUrl = await service.cos.uploadAvatar(avatarMD5, filePath);
      console.log(avatarUrl);

      this.success(avatarUrl);
    } catch (error) {
      const { message } = error;
      console.error("上传头像出错:", message);
      this.fail(message);
    }
  }

  async deleteUser() {
    const { ctx } = this;
    const openid = ctx.params.openid;
    const result = await ctx.service.user.deleteUser(openid);
    ctx.body = result;
  }
}

module.exports = UserController;
