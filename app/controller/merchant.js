"use strict";

const Controller = require("../core/base_controller");

/**
 * Controller - user merchant
 * @class
 * @author ruiyong-lee
 */
class UserMerchantController extends Controller {
  /**
   * 新增商家
   */
  async saveNew() {
    const { ctx } = this;

    try {
      const rule = {
        merchant: "object",
      };
      ctx.validate(rule);
      const uuid = await ctx.service.merchant.saveNew(ctx.request.body);
      this.success(uuid);
    } catch (err) {
      const { fields = {}, name, message } = err;

      if (name === "SequelizeUniqueConstraintError") {
        this.fail(ctx.UNIQUE_CODE, `账号：${fields.userName} 的商家已存在`);
      } else if (name === "MerchantNameExistsError") {
        this.fail(ctx.CONFLICT_CODE, message); // 自定义返回码
      } else if (name === "userNameExistsError") {
        this.fail(ctx.CONFLICT_CODE, message); // 自定义返回码
      } else {
        // 未捕获的错误抛出
        ctx.logger.error(err); // 记录日志以便排查
        this.fail(ctx.INTERNAL_ERROR_CODE, "服务器内部错误");
      }
    }
  }

  /**
   * 修改商家
   */
  async saveModify() {
    const { ctx } = this;
    const rule = {
      merchant: "object",
    };
    ctx.validate(rule);
    const uuid = await ctx.service.merchant.saveModify(ctx.request.body);
    this.success(uuid);
  }

  /**
   * 获取商家分页列表
   */
  async query() {
    const { ctx } = this;
    const merchantData = await ctx.service.merchant.query(ctx.request.body);
    this.success(merchantData);
  }

  /**
   * 根据uuid获取商家
   */
  async get() {
    const { ctx } = this;
    const { uuid } = ctx.query;
    const merchant = await ctx.service.merchant.get(uuid);
    this.success(merchant);
  }
}

module.exports = UserMerchantController;
