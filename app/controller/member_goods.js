/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-03-12 09:25:06
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-07-24 21:58:45
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

  async getByGoodsId() {
    const { ctx } = this;
    const result = await ctx.service.memberGoods.getByGoodsId(ctx.request.body);
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

  /**
   * 会员商品组合策略
   */

  async validateComboSelection() {
    const { ctx } = this;

    try {
      const { selectedItems, combinationRules } = ctx.request.body;

      // Add parameter validation
      if (!selectedItems || !combinationRules) {
        this.fail(ctx.PARAM_ERROR_CODE, "缺少必要参数");
        return;
      }

      const result = await ctx.service.memberGoods.validateComboSelection(
        selectedItems,
        combinationRules
      );
      this.success(result);
    } catch (err) {
      const { fields = {}, name, message } = err;
      if (name === "INVALID_ITEMS_FORMAT") {
        this.fail(ctx.PARAM_ERROR_CODE, err.message);
      } else if (name === "E_NOT_ENOUGH_ITEMS") {
        this.fail(ctx.CONFLICT_CODE, message);
      } else if (name === "MAX_EXCEEDED") {
        this.fail(ctx.CONFLICT_CODE, message); // 自定义返回码
      } else if (name === "MIN_TOTAL_MISMATCH") {
        this.fail(ctx.CONFLICT_CODE, message); // 自定义返回码
      } else if (name === "MAX_TOTAL_MISMATCH") {
        this.fail(ctx.CONFLICT_CODE, message); // 自定义返回码
      } else {
        // 未捕获的错误抛出
        ctx.logger.error(err); // 记录日志以便排查
        this.fail(ctx.INTERNAL_ERROR_CODE, "服务器内部错误");
      }
    }
  }

  async saveNewMemberGoodsGroup() {
    const { ctx } = this;
    try {
      const rule = {
        member_card_id: "string",
        group_name: "string",
        combination_rules: "object",
      };
      ctx.validate(rule);

      const result = await ctx.service.memberGoods.saveNewMemberGoodsGroup(
        ctx.request.body
      );
      this.success(result);
    } catch (err) {
      ctx.logger.error("[saveNewMemberGoodsGroup error]", err);
      this.fail(ctx.INTERNAL_ERROR_CODE, err.message);
    }
  }

  async getAllGroupByCardId() {
    const { ctx } = this;
    try {
      const { member_card_id } = ctx.request.body;
      if (!member_card_id) {
        this.fail(ctx.PARAM_ERROR_CODE, "缺少会员卡ID参数");
        return;
      }

      const result = await ctx.service.memberGoods.getAllGroupByCardId({
        member_card_id,
      });
      this.success(result);
    } catch (err) {
      ctx.logger.error("[getAllGroupByCardId error]", err);
      this.fail(ctx.INTERNAL_ERROR_CODE, "获取组合策略失败");
    }
  }
}

module.exports = Member_goodsController;
