/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-08-06 15:32:36
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-08-06 15:35:04
 * @FilePath: \Mini_program_backend\app\controller\member_goods_package_item.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

const Controller = require("../core/base_controller");

class Member_goods_package_itemController extends Controller {
  async saveNew() {
    const { ctx } = this;
    const result = await ctx.service.memberGoodsPackageItem.saveNew(
      ctx.request.body
    );
    this.success(result);
  }
}

module.exports = Member_goods_package_itemController;
