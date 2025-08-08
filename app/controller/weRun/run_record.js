/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-07-25 18:20:08
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-08-01 12:31:03
 * @FilePath: \Mini_program_backend\app\controller\weRun\run_record.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

const Controller = require("../../core/base_controller");

class Run_recordController extends Controller {
  async submit() {
    const { ctx } = this;

    try {
      const result = await ctx.service.weRun.runRecord.submitRunRecord(
        ctx.request.body
      );
      this.success(result);
    } catch (error) {
      this.fail(error.message || "提交失败");
    }
  }

  async modify() {
    const { ctx } = this;

    try {
      const result = await ctx.service.weRun.runRecord.modifyRecords(
        ctx.request.body
      );
      this.success(result);
    } catch (error) {
      this.fail(error.message || "修改失败");
    }
  }

  async history() {
    const { ctx } = this;
    const { page = 1, pageSize = 10 } = ctx.query;

    const data = await ctx.service.weRun.runRecord.getHistory(
      ctx.session.userId,
      parseInt(page),
      parseInt(pageSize)
    );
    this.success(data);
  }

  async calendar() {
    const { ctx } = this;
    const { month } = ctx.query;

    if (!/^\d{4}-\d{2}$/.test(month)) {
      ctx.body = { success: false, message: "月份格式不正确" };
      return;
    }

    const data = await ctx.service.weRun.runRecord.getCalendar(
      ctx.session.userId,
      `${month}-01`
    );
    this.success(data);
  }

  async getUserTeamData() {
    const { ctx } = this;
    const result = await ctx.service.weRun.runRecord.getUserTeamData(
      ctx.request.body
    );
    this.success(result);
  }

  // 新增审核相关方法
  async pendingRecords() {
    const { ctx } = this;
    const data = await ctx.service.weRun.runRecord.getPendingRecords(
      ctx.request.body
    );
    this.success(data);
  }

  async review() {
    const { ctx } = this;
    try {
      const result = await ctx.service.weRun.runRecord.reviewRecord(
        ctx.request.body
      );
      this.success(result);
    } catch (error) {
      this.fail(error.message);
    }
  }

  async submitReview() {
    const { ctx } = this;
    try {
      const result = await ctx.service.weRun.runRecord.submitReview(
        ctx.request.body
      );
      this.success(result);
    } catch (error) {
      this.fail(error.message);
    }
  }

  async stats() {
    const { ctx } = this;
    const data = await ctx.service.weRun.runRecord.getUserRunStats(
      ctx.request.body
    );
    this.success(data);
  }

  async getReviewedRecords() {
    const { ctx } = this;
    const data = await ctx.service.weRun.runRecord.getReviewedRecords(
      ctx.request.body
    );
    this.success(data);
  }

  async getRecordDetail() {
    const { ctx } = this;
    const data = await ctx.service.weRun.runRecord.getRecordDetail(
      ctx.request.body
    );
    this.success(data);
  }

  async getReviewedCount() {
    const { ctx } = this;
    const data = await ctx.service.weRun.runRecord.getReviewedCount(
      ctx.request.body
    );
    this.success(data);
  }
}

module.exports = Run_recordController;
