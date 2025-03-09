/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-12-13 12:25:16
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-03-04 17:45:03
 * @FilePath: \Mini_program_backend\app\controller\common.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

const Controller = require("../core/base_controller");

/**
 * Controller - user common
 * @class
 * @author ruiyong-lee
 */
class UserCommonController extends Controller {
  /**
   * 登录
   * @return {function|null} 登录结果
   */
  async login() {
    const { ctx, app, service } = this;
    const { userName, password, loginType } = ctx.request.body;
    let user;

    if (loginType === "admin") {
      // 根据userName获取管理员
      user = await ctx.service.admin.getAdminByLogin(userName, password);
    } else {
      // 根据userName获取商家
      user = await ctx.service.merchant.getMerchantByLogin(userName, password);
    }

    console.log(`${loginType}${userName}登录`);
    console.log("登录信息:", user);

    if (app._.isEmpty(user)) {
      return this.fail(ctx.ERROR_CODE, "账号或密码错误");
    }

    const { uuid } = user;
    // 使用 JwtService 生成 Token
    const result = await service.jwt.generateAccessToken(uuid);
    await ctx.service.redis.set(uuid, result.refresh_token, 86400, "token");
    console.log(`${loginType}${uuid}登录成功`);
    const UserData = {
      token: result.token,
      refresh_token: result.refresh_token,
      user,
    };
    this.success(UserData);
  }

  async merchantRegister() {
    const { ctx, service } = this;

    // 从请求体中获取商家注册信息
    const { merchant } = ctx.request.body;
    const { name, password, userName, linkMan, linkPhone } = merchant;

    // 校验必填字段
    if (!name || !password || !linkPhone || !linkMan || !userName) {
      return this.fail(ctx.ERROR_CODE, "缺少必要的注册信息");
    }

    try {
      // 调用 service 保存商家信息
      const newMerchant = await service.merchant.registerNewMerchant(merchant);
      console.log("New Merchant:", newMerchant); // 查看返回值

      if (!newMerchant) {
        return this.fail(ctx.ERROR_CODE, "注册失败，请稍后重试");
      }

      // 使用 JwtService 生成 Token
      const tokenData = await service.jwt.generateToken(newMerchant.uuid);
      await service.redis.set(
        newMerchant,
        tokenData.token,
        3 * 24 * 60 * 60,
        "token"
      );

      const data = {
        message: "注册成功",
        token: tokenData.token, // 返回给前端的 Token
        merchant: newMerchant,
      };

      // 返回注册成功的结果，包括生成的 Token
      this.success(data);
    } catch (error) {
      const { fields = {}, name, message } = error;

      if (name === "NotRegisteredError") {
        return this.fail(ctx.ERROR_CODE, message);
      } else if (error.message.includes("Validation error")) {
        return this.fail(ctx.ERROR_CODE, "该用户已注册过商家");
      } else if (name === "MerchantNameExistsError") {
        this.fail(ctx.CONFLICT_CODE, message); // 自定义返回码
      } else if (name === "userNameExistsError") {
        this.fail(ctx.CONFLICT_CODE, message); // 自定义返回码
      } else {
        // 捕获错误并返回失败信息
        ctx.logger.error(error); // 记录日志以便排查
        this.fail(ctx.ERROR_CODE, error.message || "商家注册失败");
      }
    }
  }

  /**
   * 注销
   */
  async logout() {
    const { ctx, service } = this;
    const { user_id } = ctx.request.body;
    try {
      console.log(`${user_id}注销`);
      await service.redis.del(user_id, "token");
      this.success(user_id);
    } catch (error) {
      this.fail(ctx.ERROR_CODE, "注销失败");
    }
  }

  /**
   * 修改密码
   * @return {function|null} 注销结果
   */
  async savePasswordModify() {
    const { ctx } = this;
    const { userType } = ctx.request.body;
    const rule = {
      userUuid: "string",
      oldPassword: "string",
      newPassword: "string",
    };

    ctx.validate(rule);

    if (userType === "admin") {
      // 根据userName获取管理员
      await ctx.service.user.admin.savePasswordModify(ctx.request.body);
    } else {
      // 根据userName获取商家
      await ctx.service.merchant.savePasswordModify(ctx.request.body);
    }

    this.logout();
  }
}

module.exports = UserCommonController;
