/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-03-12 09:25:06
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-04-07 23:13:47
 * @FilePath: \Mini_program_backend\app\controller\member_goods.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

const Controller = require("../core/base_controller");

class Member_goodsController extends Controller {
  async saveNew() {
    const { ctx } = this;
    const result = await ctx.service.memberGoods.saveNew(ctx.request.body);
    this.success(result);
  }

  async getGoodsByCardId() {
    const { ctx } = this;
    const result = await ctx.service.memberGoods.getGoodsByCardId(
      ctx.request.body
    );
    this.success(result);
  }

  async getMemberGoodsList() {
    const { ctx } = this;
    const result = await ctx.service.memberGoods.getMemberGoodsList(
      ctx.request.body
    );
    this.success(result);
  }
}

module.exports = Member_goodsController;
