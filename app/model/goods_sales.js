/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-04-14 15:40:48
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-06-04 22:26:04
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

  GoodsSales.reverseSales = async (goodsId, spec, quantity) => {
    const record = await GoodsSales.findOne({
      where: { goods_id: goodsId, spec },
    });

    if (!record) {
      throw new Error(`未找到商品ID ${goodsId} 规格 ${spec} 的销售记录`);
    }

    if (record.quantity < quantity) {
      this.ctx.logger.warn(
        `商品销量恢复异常：当前销量 ${record.quantity} 小于恢复数量 ${quantity}`
      );
      quantity = record.quantity; // 只能恢复现有销量
    }

    return await record.decrement("quantity", { by: quantity });
  };

  return GoodsSales;
};
