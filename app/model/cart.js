/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-11-04 11:27:25
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-01-22 18:56:07
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

  return Cart;
};
