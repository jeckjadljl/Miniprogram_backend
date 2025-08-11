/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-11-24 16:34:32
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-08-09 12:10:11
 * @FilePath: \Mini_program_backend\app\model\promotion.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
module.exports = app => {
  const { model, checkUpdate } = app;
  const PointsSchema = require("../../app/schema/promotion")(app);

  const Promotion = model.define("promotion", PointsSchema, {
    tableName: "promotion",
  });

  Promotion.associate = function () {
    const { MemberGoods, GoodsPromotion } = model;
    Promotion.belongsToMany(MemberGoods, {
      through: GoodsPromotion,
      foreignKey: "promotion_id",
      otherKey: "member_goods_id",
      as: "member_goods",
    });
  };

  Promotion.saveNew = async params => {
    return await Promotion.create(params);
  };

  Promotion.saveModify = async params => {
    const { uuid } = params;
    const result = await Promotion.update(params, { where: { uuid } });

    checkUpdate(result);

    return uuid;
  };

  Promotion.getAll = async ({ attributes }) => {
    return await Promotion.findAll({
      attributes,
      where: { activity_type: null },
    });
  };

  Promotion.getByActivityType = async ({
    type,
    attributes,
    memberGoodsAttributes,
  }) => {
    return await Promotion.findOne({
      attributes,
      where: { activity_type: type },
      include: [
        {
          model: model.MemberGoods,
          attributes: memberGoodsAttributes,
          as: "member_goods",
        },
      ],
    });
  };

  return Promotion;
};
