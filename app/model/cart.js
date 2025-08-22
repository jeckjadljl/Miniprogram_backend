/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-11-04 11:27:25
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-08-19 16:32:54
 * @FilePath: \Mini_program_backend\app\model\cart.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

module.exports = app => {
  const { model } = app;
  const CartSchema = require("../../app/schema/cart")(app);

  const Cart = model.define("cart", CartSchema, {
    tableName: "cart", // 对应数据库中的 'cart' 表
  });

  Cart.associate = function () {
    Cart.belongsTo(model.User, { foreignKey: "user_id" });
    Cart.belongsTo(model.Goods, { foreignKey: "goods_id", as: "goods" });
  };

  // 添加商品到购物车
  Cart.addGoods = async (userId, goodsId, spec, quantity) => {
    await Cart.create({
      user_id: userId,
      goods_id: goodsId,
      quantity,
      spec,
    });
    return userId;
  };

  // 查找购物车商品项
  Cart.findGoodsInCart = async (userId, goodsId, spec) => {
    return await Cart.findOne({
      where: { user_id: userId, goods_id: goodsId, spec },
    });
  };

  // 更新购物车商品数量
  Cart.updateGoodsQuantity = async (userId, goodsId, spec, quantity) => {
    const cartItem = await Cart.findGoodsInCart(userId, goodsId, spec);
    if (cartItem) {
      cartItem.quantity = quantity;
      return await cartItem.save();
    }
    return userId;
  };

  Cart.updateGoodsSpec = async (
    userId,
    goodsId,
    oldSpec,
    newSpec,
    quantity
  ) => {
    await Cart.update(
      { spec: newSpec, quantity },
      {
        where: {
          user_id: userId,
          goods_id: goodsId,
          spec: oldSpec,
        },
      }
    );

    return userId;
  };

  // 删除购物车中的商品
  Cart.removeGoods = async (userId, goodsId, spec) => {
    return await Cart.destroy({
      where: { user_id: userId, goods_id: goodsId, spec },
    });
  };

  Cart.getCombinedCartItems = async userId => {
    // 查询普通购物车
    const regularCart = await Cart.getCartItems(userId);

    // 查询会员购物车
    const memberCart = await model.MemberCart.getCartItems({
      userId,
      attributes: [
        "name",
        "salePrice",
        "unitName",
        "thumbnail",
        "goodsInfo",
        "orgUuid",
      ],
      goodsSpecAttributes: [
        "spec_id",
        "goods_id",
        "member_goods_id",
        "specName",
        "specValue",
        "specPrice",
        "point_spend",
        "cash_amount",
        "stock",
        "specThumbnail",
        "specImages",
        "specPosters",
        "isDefault",
        "sort_order",
      ],
      goodsSpecColorAttributes: [
        "uuid",
        "goods_id",
        "spec_id",
        "specName",
        "specValue",
        "specPrice",
        "specColorThumbnail",
        "specColorImages",
        "sort_order",
      ],
      memberGoodsAttributes: [
        "id",
        "member_packs_name",
        "member_packs_salePrice",
        "voucher_id",
        "voucher_name",
        "voucher_image",
        "voucher_type",
        "voucher_quantity",
        "points",
        "points_image",
        "points_deduction",
        "points_rate",
        "point_spend",
        "cash_amount",
        "deduction_type",
        "goods_id",
        "name",
        "thumbnail",
        "unitName",
        "salePrice",
        "spec",
        "quantity",
        "discount_amount",
        "discount_type",
        "discount_tag",
        "member_goods_status",
        "orgUuid",
      ],
      raw: true,
      nest: true,
      order: [["sort_order", "ASC"]],
    });

    // 合并结果并按时间排序
    return [...regularCart, ...memberCart].sort(
      (a, b) => new Date(b.createdTime) - new Date(a.createdTime)
    );
  };

  // 获取用户购物车列表
  Cart.getCartItems = async userId => {
    return await Cart.findAll({
      where: { user_id: userId },
      include: [
        {
          model: model.Goods,
          as: "goods",
          attributes: [
            "name",
            "salePrice",
            "unitName",
            "thumbnail",
            "goodsInfo",
            "orgUuid",
          ],
          include: [
            {
              model: model.GoodsSpecifications,
              as: "spec",
              attributes: [
                "spec_id",
                "goods_id",
                "specName",
                "specValue",
                "specPrice",
                "point_spend",
                "cash_amount",
                "stock",
                "specThumbnail",
                "specImages",
                "specPosters",
                "isDefault",
              ],
            },
            {
              model: model.GoodsSpecColor,
              attributes: [
                "uuid",
                "goods_id",
                "spec_id",
                "specName",
                "specValue",
                "specPrice",
                "specColorThumbnail",
                "specColorImages",
              ],
              as: "specColor",
            },
          ],
        },
      ],
    });
  };

  // 清空购物车
  Cart.clearCart = async userId => {
    return await Cart.destroy({
      where: { user_id: userId },
    });
  };

  // 在Cart模型中添加
  Cart.getCartItemCount = async userId => {
    return await Cart.count({
      where: { user_id: userId },
    });
  };

  return Cart;
};
