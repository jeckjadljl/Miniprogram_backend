/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-12-22 15:25:36
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-04-05 16:17:06
 * @FilePath: \Mini_program_backend\app\controller\notice.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

const Controller = require("../core/base_controller");
const crypto = require("crypto");

/**
 * Controller - 消息通知
 * @class
 * @author ruiyong-lee
 */
class NoticeController extends Controller {
  /**
   * 全部标记为已读
   */
  async readAll() {
    const { ctx } = this;
    await ctx.service.notice.readAll(ctx.request.body);
    this.success();
  }

  /**
   * 获取消息概况（最多5条）
   */
  async overview() {
    const { ctx } = this;
    const noticeData = await ctx.service.notice.overview(ctx.request.body);
    this.success(noticeData);
  }

  /**
   * 获取消息分页列表
   */
  async query() {
    const { ctx } = this;
    const noticeData = await ctx.service.notice.query(ctx.request.body);
    this.success(noticeData);
  }

  /**
   * 微信小程序
   */
  async wechatPayCallback() {
    const { ctx } = this;
    console.log(ctx.request.body);
    try {
      const result = await ctx.service.notice.wechatPayCallback(
        ctx.request.body
      );
      this.success(result);
    } catch (error) {
      console.error("微信支付回调处理失败:", error);
      ctx.body = { error: "处理失败" };
      ctx.status = 500;
    }
  }

  async saveNewForWeapp() {
    const { ctx } = this;
    const noticeData = await ctx.service.notice.saveNewForWeapp(
      ctx.request.body
    );
    this.success(noticeData);
  }

  async getNotice() {
    const { ctx } = this;
    const noticeData = await ctx.service.notice.getNotice(ctx.request.body);
    this.success(noticeData);
  }

  async getNoticeByElementsId() {
    const { ctx } = this;
    const noticeData = await ctx.service.notice.getNoticeByElementsId(
      ctx.request.body
    );
    this.success(noticeData);
  }
}

module.exports = NoticeController;
