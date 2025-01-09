/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-11-14 17:11:45
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2024-12-05 16:54:00
 * @FilePath: \Mini_program_backend\app\controller\cart.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

const Controller = require("../core/base_controller");

class CartController extends Controller {
  async addGoodsToCart() {
    const { ctx } = this;
    const { userId, goodsId, quantity = 1 } = ctx.request.body;
    const goods = await ctx.service.cart.addGoodsToCart(
      userId,
      goodsId,
      quantity
    );
    this.success(goods);
  }

  async removeGoodsFromCart() {
    const { ctx } = this;
    const { userId, goodsId } = ctx.request.body;
    const result = await ctx.service.cart.removeGoodsFromCart(userId, goodsId);
    this.success(result);
  }

  async decrementGoodsQuantity() {
    const { ctx } = this;
    const { userId, goodsId, decrement = 1 } = ctx.request.body;
    const goods = await ctx.service.cart.decrementGoodsQuantity(
      userId,
      goodsId,
      decrement
    );
    this.success(goods);
  }

  async getCartList() {
    const { ctx } = this;
    const { userId } = ctx.request.body;
    const goodslist = await ctx.service.cart.getCartItems(userId);
    this.success(goodslist);
  }

  async clearCart() {
    const { ctx } = this;
    const { userId } = ctx.request.body;
    const goodslist = await ctx.service.cart.clearCart(userId);
    this.success(goodslist);
  }
}

module.exports = CartController;
