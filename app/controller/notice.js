/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-12-22 15:25:36
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-02-27 11:50:23
 * @FilePath: \Mini_program_backend\app\controller\notice.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

const Controller = require("../core/base_controller");

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

  async wechatPayCallback() {
    const { ctx } = this;
    // 获取微信支付回调的原始数据
    const xmlData = ctx.request.body;
    const result = await ctx.service.notice.wechatPayCallback(xmlData);

    this.success(result);
  }
}

module.exports = NoticeController;
