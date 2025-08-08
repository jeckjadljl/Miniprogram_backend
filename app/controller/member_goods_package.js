/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-08-06 12:25:42
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-08-06 16:33:11
 * @FilePath: \Mini_program_backend\app\controller\member_goods_package.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

const Controller = require("../core/base_controller");

class Member_goods_packageController extends Controller {
  async saveNew() {
    const { ctx } = this;
    const result = await ctx.service.memberGoodsPackage.saveNew(
      ctx.request.body
    );
    this.success(result);
  }

  async getPackageByCardId() {
    const { ctx } = this;
    const result = await ctx.service.memberGoodsPackage.getPackageByCardId(
      ctx.request.body
    );
    this.success(result);
  }
}

module.exports = Member_goods_packageController;
