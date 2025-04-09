const Controller = require("../core/base_controller");

class PromotionController extends Controller {
  async saveNew() {
    const { ctx } = this;
    const rule = {
      name: { type: "string" },
      start_time: { type: "date" },
      end_time: { type: "date" },
      // 其他字段验证规则
    };
    ctx.validate(rule);
    const promotion = await ctx.service.promotion.saveNew(ctx.request.body);
    this.success(promotion);
  }
}

module.exports = PromotionController;
