/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-12-30 16:43:11
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2024-12-30 16:43:32
 * @FilePath: \Mini_program_backend\app\controller\freight_plan.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

const Controller = require("../core/base_controller");

/**
 * Controller - 运费方案
 * @class
 * @author ruiyong-lee
 */
class FreightPlanController extends Controller {
  /**
   * 新增运费方案
   */
  async saveNew() {
    const { ctx } = this;
    const rule = {
      freightPlan: "object",
    };
    ctx.validate(rule);
    const uuid = await ctx.service.freightPlan.saveNew(ctx.request.body);
    this.success(uuid);
  }

  /**
   * 修改运费方案
   */
  async saveModify() {
    const { ctx } = this;
    const rule = {
      freightPlan: "object",
    };
    ctx.validate(rule);
    const uuid = await ctx.service.freightPlan.saveModify(ctx.request.body);
    this.success(uuid);
  }

  /**
   * 删除运费方案
   */
  async remove() {
    const { ctx } = this;
    const uuid = await ctx.service.freightPlan.remove(ctx.request.body);
    this.success(uuid);
  }

  /**
   * 获取运费方案分页列表
   */
  async query() {
    const { ctx } = this;
    const freightPlanData = await ctx.service.freightPlan.query(
      ctx.request.body
    );
    this.success(freightPlanData);
  }

  /**
   * 根据uuid获取运费方案
   */
  async get() {
    const { ctx } = this;
    const freightPlan = await ctx.service.freightPlan.get(ctx.request.body);
    this.success(freightPlan);
  }

  /**
   * 设置默认运费方案
   */
  async setDefault() {
    const { ctx } = this;
    const uuid = await ctx.service.freightPlan.setDefault(ctx.request.body);

    this.success(uuid);
  }
}

module.exports = FreightPlanController;
