/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-11-13 16:09:31
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2024-12-18 18:16:14
 * @FilePath: \Mini_program_backend\app\service\cart.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
// app/service/cart.js
// app/service/cart.js
"use strict";

const Service = require("egg").Service;

class CartService extends Service {
  // 添加商品到购物车
  async addGoodsToCart(userId, goodsId, quantity) {
    const { Cart, Goods } = this.ctx.model;

    // 检查商品是否存在
    const goods = await Goods.findByPk(goodsId);
    if (!goods) {
      throw new Error("Goods not found");
    }

    // 检查购物车中是否已存在该商品
    const cart = await Cart.findGoodsInCart(userId, goodsId);

    if (cart) {
      // 更新数量
      cart.quantity += quantity;
      const result = await Cart.updateGoodsQuantity(
        userId,
        goodsId,
        cart.quantity
      );
      return result;
    }
    // 添加新商品到购物车
    const result = await Cart.addGoods(userId, goodsId, quantity);
    return result;
  }

  // 删除购物车中的商品
  async removeGoodsFromCart(userId, goodsId) {
    const { Cart } = this.ctx.model;
    // 添加新商品到购物车
    const result = await Cart.removeGoods(userId, goodsId);
    return result;
  }

  // 更新购物车商品数量
  async decrementGoodsQuantity(userId, goodsId, decrement) {
    const { Cart } = this.ctx.model;

    // 检查购物车中是否已存在该商品
    const cart = await Cart.findGoodsInCart(userId, goodsId);

    if (!cart) {
      // 商品不存在于购物车
      this.ctx.throw(404, "商品不在购物车中");
    }

    if (cart.quantity > decrement) {
      // 更新数量
      cart.quantity -= decrement;
      await Cart.updateGoodsQuantity(userId, goodsId, cart.quantity);
      return cart.user_id;
    }

    return cart.user_id;
  }

  // 获取用户购物车列表
  async getCartItems(userId) {
    const { Cart } = this.ctx.model;
    return await Cart.getCartItems(userId);
  }

  // 清空购物车
  async clearCart(userId) {
    const { Cart } = this.ctx.model;
    await Cart.clearCart(userId);
  }
}

module.exports = CartService;
