/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-11-04 11:27:25
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-05-16 00:10:49
 * @FilePath: \Mini_program_backend\app\model\goods_pricing.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

module.exports = app => {
  const { model } = app;
  const GoodsPricingSchema = require("../../app/schema/goods_pricing")(app);

  const GoodsPricing = model.define("goods_pricing", GoodsPricingSchema, {
    tableName: "goods_pricing", // 对应数据库中的 'cart' 表
  });

  GoodsPricing.associate = function () {
    const { Goods, GoodsSpecifications, GoodsSpecColor } = model;
    GoodsPricing.belongsTo(Goods, { foreignKey: "goods_id" });
    GoodsPricing.belongsTo(GoodsSpecifications, { foreignKey: "spec_id" });
    GoodsPricing.belongsTo(GoodsSpecColor, { foreignKey: "spec_color_id" });
  };

  GoodsPricing.saveNew = async params => {
    return await GoodsPricing.create(params);
  };

  GoodsPricing.getGoodsPricingById = async params => {
    const { goods_id, spec_id, spec_color_id, quantity } = params;
    if (spec_id) {
      return await GoodsPricing.findOne({
        where: { goods_id, spec_id, quantity },
      });
    } else if (spec_color_id) {
      return await GoodsPricing.findOne({
        where: { goods_id, spec_color_id, quantity },
      });
    }
  };

  return GoodsPricing;
};
