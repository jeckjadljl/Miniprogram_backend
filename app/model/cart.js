/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-11-04 11:27:25
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2024-12-18 18:08:54
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
    timestamps: false, // 如果表中没有 createdAt 和 updatedAt 字段
  });

  Cart.associate = function () {
    Cart.belongsTo(model.User, { foreignKey: "user_id" });
    Cart.belongsTo(model.Goods, { foreignKey: "goods_id" });
  };

  // 添加商品到购物车
  Cart.addGoods = async (userId, goodsId, quantity) => {
    await Cart.create({
      user_id: userId,
      goods_id: goodsId,
      quantity,
      add_date: new Date(),
    });
    return userId;
  };

  // 查找购物车商品项
  Cart.findGoodsInCart = async (userId, goodsId) => {
    return await Cart.findOne({
      where: { user_id: userId, goods_id: goodsId },
    });
  };

  // 更新购物车商品数量
  Cart.updateGoodsQuantity = async (userId, goodsId, quantity) => {
    const cartItem = await Cart.findGoodsInCart(userId, goodsId);
    if (cartItem) {
      cartItem.quantity = quantity;
      return await cartItem.save();
    }
    return null;
  };

  // 删除购物车中的商品
  Cart.removeGoods = async (userId, goodsId) => {
    return await Cart.destroy({
      where: { user_id: userId, goods_id: goodsId },
    });
  };

  // 获取用户购物车列表
  Cart.getCartItems = async userId => {
    return await Cart.findAll({
      where: { user_id: userId },
      include: [
        {
          model: model.Goods,
          as: "good",
          attributes: [
            "goods_id",
            "name",
            "salePrice",
            "unitName",
            "thumbnail",
            "goodsInfo",
            "spec",
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
