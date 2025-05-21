/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-05-11 21:07:46
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-05-11 21:12:26
 * @FilePath: \Mini_program_backend\app\service\goods_promotion.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

const Service = require("egg").Service;

class Goods_promotionService extends Service {
  async saveNew(params = {}) {
    const { app } = this;
    const result = await app.model.GoodsPromotion.saveNew(params);
    return result;
  }
}

module.exports = Goods_promotionService;
