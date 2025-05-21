/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-04-01 23:37:50
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-05-15 23:51:39
 * @FilePath: \Mini_program_backend\app\model\goods_spec_color.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
module.exports = app => {
  const { Sequelize, model, checkUpdate } = app;
  const { Op } = Sequelize;
  const GoodsSpecColorSchema = require("../../app/schema/goods_spec_color")(
    app
  );

  const GoodsSpecColor = model.define(
    "goods_spec_color",
    GoodsSpecColorSchema,
    {
      tableName: "goods_spec_color", // 对应数据库中的 'goods' 表
    }
  );

  GoodsSpecColor.associate = function () {
    const { Goods, GoodsSpecifications, GoodsPricing } = model;
    GoodsSpecColor.belongsTo(Goods, {
      foreignKey: "goods_id",
      as: "goods",
    });
    GoodsSpecColor.belongsTo(GoodsSpecifications, {
      foreignKey: "spec_id",
      as: "spec",
    });
    GoodsSpecColor.hasMany(GoodsPricing, {
      foreignKey: "spec_color_id",
    });
  };

  GoodsSpecColor.saveNew = async goodsSpecColorData => {
    return await GoodsSpecColor.create(goodsSpecColorData);
  };

  GoodsSpecColor.saveModify = async goodsSpecColorData => {
    const { goods_id, uuid } = goodsSpecColorData;
    console.log(goodsSpecColorData);

    if (!goods_id || !uuid) {
      throw new Error("缺少必要参数: goods_id 或 uuid");
    }

    const result = await GoodsSpecColor.update(goodsSpecColorData, {
      where: {
        uuid,
        goods_id,
      },
    });

    checkUpdate(result);

    return goods_id;
  };

  GoodsSpecColor.getByGoodsId = async params => {
    const { goods_id } = params;

    if (!goods_id) {
      throw new Error("缺少必要参数: goods_id");
    }

    const result = await GoodsSpecColor.findAll({
      where: {
        goods_id,
      },
    });

    return result;
  };

  return GoodsSpecColor;
};
