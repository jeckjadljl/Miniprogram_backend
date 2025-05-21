/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-04-01 23:37:50
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-05-15 23:51:46
 * @FilePath: \Mini_program_backend\app\model\goods_specifications.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
module.exports = app => {
  const { Sequelize, model, checkUpdate } = app;
  const { Op } = Sequelize;
  const GoodsSpecificationsSchema =
    require("../../app/schema/goods_specifications")(app);

  const GoodsSpecifications = model.define(
    "goods_specifications",
    GoodsSpecificationsSchema,
    {
      tableName: "goods_specifications", // 对应数据库中的 'goods' 表
    }
  );

  GoodsSpecifications.associate = function () {
    const { Goods, GoodsSpecColor, GoodsPricing } = model;
    GoodsSpecifications.belongsTo(Goods, {
      foreignKey: "goods_id",
      as: "goods",
    });
    GoodsSpecifications.hasOne(GoodsSpecColor, {
      foreignKey: "spec_id",
    });
    GoodsSpecifications.hasMany(GoodsPricing, {
      foreignKey: "spec_id",
    });
  };

  GoodsSpecifications.saveNew = async goodsSpecData => {
    return await GoodsSpecifications.create(goodsSpecData);
  };

  GoodsSpecifications.saveModify = async goodsSpecData => {
    const { spec_id, goods_id } = goodsSpecData;
    console.log(goodsSpecData);

    if (!spec_id || !goods_id) {
      throw new Error("缺少必要参数: spec_id 或 goods_id");
    }

    const result = await GoodsSpecifications.update(goodsSpecData, {
      where: {
        spec_id,
        goods_id,
      },
    });

    checkUpdate(result);

    return goods_id;
  };

  return GoodsSpecifications;
};
