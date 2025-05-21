/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-11-14 17:11:45
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-05-10 16:41:56
 * @FilePath: \Mini_program_backend\app\controller\member_cart.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

const Controller = require("../core/base_controller");

class CartController extends Controller {
  async addGoodsToCart() {
    const { ctx } = this;
    const {
      userId,
      goodsId,
      spec,
      quantity = 1,
      memberGoodsId,
    } = ctx.request.body;
    const goods = await ctx.service.memberCart.addGoodsToCart(
      userId,
      goodsId,
      spec,
      quantity,
      memberGoodsId
    );
    this.success(goods);
  }

  async updateSpec() {
    const { ctx } = this;
    const {
      userId,
      goodsId,
      oldSpec,
      spec,
      quantity = 1,
      memberGoodsId,
    } = ctx.request.body;
    const goods = await ctx.service.memberCart.updateSpec(
      userId,
      goodsId,
      oldSpec,
      spec,
      quantity,
      memberGoodsId
    );
    this.success(goods);
  }

  async removeGoodsFromCart() {
    const { ctx } = this;
    const { userId, goodsId, spec, memberGoodsId } = ctx.request.body;
    const result = await ctx.service.memberCart.removeGoodsFromCart(
      userId,
      goodsId,
      spec,
      memberGoodsId
    );
    this.success(result);
  }

  async getCartList() {
    const { ctx } = this;
    const { userId } = ctx.request.body;
    const goodslist = await ctx.service.memberCart.getCartItems(userId);
    this.success(goodslist);
  }
}

module.exports = CartController;
