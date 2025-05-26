/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-03-12 09:25:06
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-05-24 21:11:58
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

  async saveModify() {
    const { ctx } = this;
    const rule = {
      memberGoods: "object",
    };
    ctx.validate(rule);
    const result = await ctx.service.memberGoods.saveModify(ctx.request.body);
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

  async getByPromotionName() {
    const { ctx } = this;
    const result = await ctx.service.memberGoods.getByPromotionName(
      ctx.request.body
    );
    this.success(result);
  }

  async validateExchange() {
    const { ctx } = this;

    try {
      const result = await ctx.service.memberGoods.validateExchange(
        ctx.request.body
      );
      this.success(result);
    } catch (err) {
      const { fields = {}, name, message } = err;
      if (name === "Permission_Limit") {
        this.fail(ctx.CONFLICT_CODE, message);
      } else if (name === "Exchange_Time_Limit") {
        this.fail(ctx.CONFLICT_CODE, message); // 自定义返回码
      } else {
        // 未捕获的错误抛出
        ctx.logger.error(err); // 记录日志以便排查
        this.fail(ctx.INTERNAL_ERROR_CODE, "服务器内部错误");
      }
    }
  }
}

module.exports = Member_goodsController;
