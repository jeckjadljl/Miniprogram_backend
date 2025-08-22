/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-11-04 11:27:25
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-08-18 16:56:52
 * @FilePath: \Mini_program_backend\app\model\member_cart.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

module.exports = app => {
  const { model } = app;
  const MemberCartSchema = require("../../app/schema/member_cart")(app);

  const MemberCart = model.define("member_cart", MemberCartSchema, {
    tableName: "member_cart", // 对应数据库中的 'cart' 表
  });

  MemberCart.associate = function () {
    const { User, Goods, MemberGoods } = model;
    MemberCart.belongsTo(User, { foreignKey: "user_id" });
    MemberCart.belongsTo(Goods, { foreignKey: "goods_id", as: "goods" });
    MemberCart.belongsTo(MemberGoods, {
      foreignKey: "member_goods_id",
      as: "membergoods",
    });
  };

  // 添加商品到购物车
  MemberCart.addGoods = async (
    userId,
    goodsId,
    spec,
    quantity,
    memberGoodsId
  ) => {
    await MemberCart.create({
      user_id: userId,
      goods_id: goodsId,
      quantity,
      spec,
      member_goods_id: memberGoodsId,
    });
    return userId;
  };

  // 查找购物车商品项
  MemberCart.findGoodsInCart = async (userId, goodsId, spec, memberGoodsId) => {
    return await MemberCart.findOne({
      where: {
        user_id: userId,
        goods_id: goodsId,
        spec,
        member_goods_id: memberGoodsId,
      },
    });
  };

  // 更新购物车商品数量
  MemberCart.updateGoodsQuantity = async (
    userId,
    goodsId,
    spec,
    quantity,
    memberGoodsId
  ) => {
    const cartItem = await MemberCart.findGoodsInCart(
      userId,
      goodsId,
      spec,
      memberGoodsId
    );
    if (cartItem) {
      cartItem.quantity = quantity;
      return await cartItem.save();
    }
    return userId;
  };

  MemberCart.updateGoodsSpec = async (
    userId,
    goodsId,
    oldSpec,
    newSpec,
    quantity,
    memberGoodsId
  ) => {
    await MemberCart.update(
      { spec: newSpec, quantity },
      {
        where: {
          user_id: userId,
          goods_id: goodsId,
          spec: oldSpec,
          member_goods_id: memberGoodsId,
        },
      }
    );

    return userId;
  };

  // 删除购物车中的商品
  MemberCart.removeGoods = async (userId, goodsId, spec, memberGoodsId) => {
    return await MemberCart.destroy({
      where: {
        user_id: userId,
        goods_id: goodsId,
        spec,
        member_goods_id: memberGoodsId,
      },
    });
  };

  // 获取用户购物车列表
  MemberCart.getCartItems = async ({
    userId,
    attributes,
    goodsSpecAttributes,
    goodsSpecColorAttributes,
    memberGoodsAttributes,
  }) => {
    return await MemberCart.findAll({
      where: { user_id: userId },
      include: [
        {
          model: model.Goods,
          as: "goods",
          attributes,
          include: [
            {
              model: model.GoodsSpecifications,
              as: "spec",
              attributes: goodsSpecAttributes,
            },
            {
              model: model.GoodsSpecColor,
              as: "specColor",
              attributes: goodsSpecColorAttributes,
            },
            {
              model: model.MemberGoods,
              as: "membergoods",
              attributes: memberGoodsAttributes,
            },
          ],
        },
      ],
    });
  };

  MemberCart.getCartItemCount = async userId => {
    return await MemberCart.count({
      where: { user_id: userId },
    });
  };

  return MemberCart;
};
