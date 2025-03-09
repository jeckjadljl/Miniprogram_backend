/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-10-21 15:22:17
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-02-02 19:50:55
 * @FilePath: \Mini_program_backend\app\service\user.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
"use strict";
// app/service/user.js

const Service = require("egg").Service;

class UserService extends Service {
  async addUser(userData) {
    const user = await this.ctx.model.User.create(userData);
    return user;
  }

  async getUserByOpenid(openid) {
    const user = await this.ctx.model.User.findOne({ where: { openid } });
    return user;
  }

  async getUserByUid(uuid) {
    const user = await this.ctx.model.User.findOne({ where: { uuid } });
    return user;
  }

  async getUserByName(userName) {
    const user = await this.ctx.model.User.findOne({
      where: { user_name: userName },
    });
    return user;
  }

  async updateUser(uuid, userData) {
    const user = await this.ctx.model.User.update(userData, {
      where: { uuid },
    });
    return user.uuid;
  }

  async deleteUser(openid) {
    const result = await this.ctx.model.User.destroy({
      where: { openid },
    });
    return result;
  }

  async findUserByUuid(uuid) {
    const user = await this.ctx.model.User.findOne({
      where: { uuid },
    });
    return user;
  }

  async findRole(roleName) {
    const { ctx } = this;
    const roles = await ctx.model.Role.findOne({ where: { roleName } });
    return roles;
  }
}

module.exports = UserService;
