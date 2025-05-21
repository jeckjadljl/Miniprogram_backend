/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-04-14 15:40:48
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-05-11 17:26:32
 * @FilePath: \Mini_program_backend\app\model\goods_sales.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
module.exports = app => {
  const { model } = app;
  const GoodsSalesSchema = require("../../app/schema/goods_sales")(app);

  const GoodsSales = model.define("goods_sales", GoodsSalesSchema, {
    tableName: "goods_sales",
  });

  GoodsSales.associate = () => {
    const { Goods } = model;
    // 关联商品表，外键为 goods_id，关联字段为 goods_id
    GoodsSales.belongsTo(Goods, { foreignKey: "goods_id", as: "goods" });
  };

  // 记录商品销量
  GoodsSales.recordSales = async (goodsId, spec, quantity) => {
    const [record, created] = await GoodsSales.findOrCreate({
      where: { goods_id: goodsId, spec },
      defaults: { quantity },
    });

    if (!created) {
      record.quantity += quantity;
      await record.save();
    }

    return record;
  };

  return GoodsSales;
};
