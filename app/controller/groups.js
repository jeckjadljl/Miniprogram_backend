/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-05-18 12:12:39
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-06-28 22:53:59
 * @FilePath: \Mini_program_backend\app\controller\groups.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
const Controller = require("../core/base_controller");

class GroupController extends Controller {
  async createGroup() {
    const { ctx } = this;

    try {
      const result = await ctx.service.groups.createGroup(ctx.request.body);
      this.success(result);
    } catch (err) {
      const { fields = {}, name, message } = err;
      if (name === "GroupLimitExceeded") {
        this.fail(ctx.CONFLICT_CODE, message);
      } else {
        // 未捕获的错误抛出
        ctx.logger.error(err); // 记录日志以便排查
        this.fail(ctx.INTERNAL_ERROR_CODE, "服务器内部错误");
      }
    }
  }

  async getGroupStatus() {
    const { ctx } = this;
    const result = await ctx.service.groups.getGroupStatus(ctx.request.body);
    this.success(result);
  }

  async joinGroup() {
    const { ctx } = this;

    try {
      const result = await ctx.service.groupBuyer.joinGroup(ctx.request.body);
      this.success(result);
    } catch (err) {
      const { fields = {}, name, message } = err;
      if (name === "joinGroupError") {
        this.fail(ctx.CONFLICT_CODE, message);
      } else if (name === "GroupJoinConditionError") {
        this.fail(ctx.CONFLICT_CODE, message); // 自定义返回码
      } else if (name === "GroupFullError") {
        this.fail(ctx.CONFLICT_CODE, message); // 自定义返回码
      } else {
        // 未捕获的错误抛出
        ctx.logger.error(err); // 记录日志以便排查
        this.fail(ctx.INTERNAL_ERROR_CODE, "服务器内部错误");
      }
    }
  }

  async getGroupById() {
    const { ctx } = this;
    const result = await ctx.service.groups.getGroupById(ctx.request.body);
    this.success(result);
  }

  async getGroupByOrderId() {
    const { ctx } = this;
    const result = await ctx.service.groups.getGroupByOrderId(ctx.request.body);
    this.success(result);
  }
}

module.exports = GroupController;
