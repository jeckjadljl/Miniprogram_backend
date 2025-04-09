const Service = require("egg").Service;

class PromotionService extends Service {
  async saveNew(params) {
    const { app } = this;
    return await app.model.Promotion.saveNew(params);
  }
}

module.exports = PromotionService;
