/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-05-15 23:55:38
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-05-16 00:47:25
 * @FilePath: \Mini_program_backend\app\service\goods_pricing.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

const Service = require("egg").Service;

class Goods_pricingService extends Service {
  async saveNew(params = {}) {
    const { app } = this;
    const { pricing = [] } = params;

    const results = await Promise.all(
      pricing.map(async item => {
        const result = await app.model.GoodsPricing.create(item);
        return result;
      })
    );
    return results;
  }

  async getGoodsPricingById(params = {}) {
    const { app } = this;
    const result = app.model.GoodsPricing.getGoodsPricingById(params);
    return result;
  }
}

module.exports = Goods_pricingService;
