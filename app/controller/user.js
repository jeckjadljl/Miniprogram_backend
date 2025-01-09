"use strict";

const Controller = require("egg").Controller;

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
    const openid = ctx.params.openid;
    const result = await ctx.service.user.updateUser(openid, ctx.request.body);
    ctx.body = result;
  }

  async deleteUser() {
    const { ctx } = this;
    const openid = ctx.params.openid;
    const result = await ctx.service.user.deleteUser(openid);
    ctx.body = result;
  }
}

module.exports = UserController;
