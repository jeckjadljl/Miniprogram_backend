/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-07-05 10:42:16
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-07-09 21:09:29
 * @FilePath: \Mini_program_backend\app\service\user_profile.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

const Service = require("egg").Service;

class User_profileService extends Service {
  async saveNew(params = {}) {
    const { ctx, app } = this;
    const result = await app.model.UserProfile.saveNew(params);
    return result;
  }

  // 新增获取或创建方法（用于用户访问时调用）
  async getOrCreateProfile(params = {}) {
    const { app } = this;
    const { user_id } = params;
    let profile = await app.model.UserProfile.findOne({
      where: { user_id },
    });

    if (!profile) {
      const user = await this.ctx.service.user.getUserByUuid(user_id);
      if (!user) {
        throw new Error("User not found");
      }
      profile = await this.saveNew({
        user_id,
        user_name: user.user_name,
        avatar: user.avatar,
      });
    }
    return profile;
  }

  async saveModify(params = {}) {
    const { ctx } = this;
    const result = await ctx.model.UserProfile.saveModify(params);
    return result;
  }
}

module.exports = User_profileService;
