/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-04-11 17:02:19
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-05-13 23:45:40
 * @FilePath: \Mini_program_backend\app\controller\goods_specifications.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

const Controller = require("../core/base_controller");

class GoodsSpecificationsController extends Controller {
  async saveNew() {
    const { ctx } = this;
    const result = await ctx.service.goodsSpecifications.saveNew(
      ctx.request.body
    );
    this.success(result);
  }

  async saveModify() {
    const { ctx } = this;
    const result = await ctx.service.goodsSpecifications.saveModify(
      ctx.request.body
    );
    this.success(result);
  }

  async saveNewColor() {
    const { ctx } = this;
    const result = await ctx.service.goodsSpecifications.saveNewColor(
      ctx.request.body
    );
    this.success(result);
  }
  async saveModifyColor() {
    const { ctx } = this;
    const result = await ctx.service.goodsSpecifications.saveModifyColor(
      ctx.request.body
    );
    this.success(result);
  }
  async getByGoodsId() {
    const { ctx } = this;
    const result = await ctx.service.goodsSpecifications.getByGoodsId(
      ctx.request.query
    );
    this.success(result);
  }
}

module.exports = GoodsSpecificationsController;
