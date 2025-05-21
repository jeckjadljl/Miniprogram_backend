/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-04-13 22:48:32
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-04-13 22:50:01
 * @FilePath: \Mini_program_backend\app\model\goods_promotion.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
module.exports = app => {
  const { model } = app;
  const GoodsPromotionSchema = require("../../app/schema/goods_promotion")(app);

  const GoodsPromotion = model.define("goods_promotion", GoodsPromotionSchema, {
    tableName: "goods_promotion",
  });

  GoodsPromotion.saveNew = async params => {
    return await GoodsPromotion.create(params);
  };

  return GoodsPromotion;
};
