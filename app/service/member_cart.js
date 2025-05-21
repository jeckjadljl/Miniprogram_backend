/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-11-13 16:09:31
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-05-10 16:48:57
 * @FilePath: \Mini_program_backend\app\service\member_cart.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

const Service = require("egg").Service;

class CartService extends Service {
  // 添加商品到购物车
  async addGoodsToCart(userId, goodsId, spec, quantity, memberGoodsId) {
    const { MemberCart, Goods } = this.ctx.model;

    // 检查商品是否存在
    const goods = await Goods.findByPk(goodsId);
    if (!goods) {
      throw new Error("Goods not found");
    }

    // 检查购物车中是否已存在该商品
    const membercart = await MemberCart.findGoodsInCart(
      userId,
      goodsId,
      spec,
      memberGoodsId
    );

    if (membercart) {
      // 更新数量
      membercart.quantity += quantity;
      const result = await MemberCart.updateGoodsQuantity(
        userId,
        goodsId,
        spec,
        membercart.quantity,
        membercart.member_goods_id
      );
      return result;
    }
    // 添加新商品到购物车
    const result = await MemberCart.addGoods(
      userId,
      goodsId,
      spec,
      quantity,
      memberGoodsId
    );
    return result;
  }

  async updateSpec(userId, goodsId, oldSpec, spec, quantity, memberGoodsId) {
    const { MemberCart, Goods } = this.ctx.model;

    const goods = await Goods.findByPk(goodsId);
    if (!goods) {
      throw new Error("Goods not found");
    }

    const membercart = await MemberCart.findGoodsInCart(
      userId,
      goodsId,
      spec,
      memberGoodsId
    );

    if (membercart) {
      // 更新数量
      membercart.quantity = quantity;
      const result = await MemberCart.updateGoodsQuantity(
        userId,
        goodsId,
        spec,
        membercart.quantity,
        membercart.member_goods_id
      );
      return result;
    }

    // 修改购物车中商品的规格
    const result = await MemberCart.updateGoodsSpec(
      userId,
      goodsId,
      oldSpec,
      spec,
      quantity,
      memberGoodsId
    );
    return result;
  }

  // 删除购物车中的商品
  async removeGoodsFromCart(userId, goodsId, spec, memberGoodsId) {
    const { MemberCart } = this.ctx.model;
    // 添加新商品到购物车
    const result = await MemberCart.removeGoods(
      userId,
      goodsId,
      spec,
      memberGoodsId
    );
    return result;
  }

  // 获取用户购物车列表
  async getCartItems(userId) {
    const { MemberCart } = this.ctx.model;
    return await MemberCart.getCartItems(userId);
  }
}

module.exports = CartService;
