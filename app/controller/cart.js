/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-11-14 17:11:45
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-08-18 16:58:26
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
    const { userId, goodsId, spec, quantity = 1 } = ctx.request.body;
    const goods = await ctx.service.cart.addGoodsToCart(
      userId,
      goodsId,
      spec,
      quantity
    );
    this.success(goods);
  }

  async updateSpec() {
    const { ctx } = this;
    const { userId, goodsId, oldSpec, spec, quantity = 1 } = ctx.request.body;
    const goods = await ctx.service.cart.updateSpec(
      userId,
      goodsId,
      oldSpec,
      spec,
      quantity
    );
    this.success(goods);
  }

  async removeGoodsFromCart() {
    const { ctx } = this;
    const { userId, goodsId, spec } = ctx.request.body;
    const result = await ctx.service.cart.removeGoodsFromCart(
      userId,
      goodsId,
      spec
    );
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

  async getCombinedCartList() {
    const { ctx } = this;
    const { userId } = ctx.request.body;
    const combinedList = await ctx.service.cart.getCombinedCartItems(userId);
    this.success(combinedList);
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

  async getTotalCartItemCount() {
    const { ctx } = this;
    const { userId } = ctx.request.body;
    const totalCount = await ctx.service.cart.getTotalCartItemCount(userId);
    this.success(totalCount);
  }
}

module.exports = CartController;
