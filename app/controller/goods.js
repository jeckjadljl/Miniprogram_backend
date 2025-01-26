/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-11-15 15:31:58
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-01-14 11:12:36
 * @FilePath: \Mini_program_backend\app\controller\goods.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

const Controller = require("../core/base_controller");

class GoodsController extends Controller {
  /**
   * 微信小程序获取商品数据
   */

  /**
   * 获取key为类别的商品数据
   */
  async getGoodsWithCategory() {
    const { ctx } = this;
    const { orgUuid } = ctx.request.body;
    const goods = await ctx.service.goods.getGoodsWithCategory(orgUuid);

    this.success(goods);
  }

  async getGoodsList() {
    const { ctx } = this;
    const result = await ctx.service.goods.getAllGoods();
    this.success(result);
  }

  async getGoodsById() {
    const { ctx } = this;
    const { goods_id } = ctx.request.body;
    const result = await ctx.service.goods.getGoodsById(goods_id);
    this.success(result);
  }

  /**
   * 管理端获取商品数据
   */

  async saveNew() {
    const { ctx } = this;
    const result = await ctx.service.goods.saveNew(ctx.request.body);
    this.success(result);
  }

  /**
   * 修改商品
   */
  async saveModify() {
    const { ctx } = this;
    const rule = {
      goods: "object",
    };
    ctx.validate(rule);
    const uuid = await ctx.service.goods.saveModify(ctx.request.body);
    this.success(uuid);
  }

  /**
   * 上架商品
   */
  async up() {
    const { ctx } = this;
    const uuid = await ctx.service.goods.up(ctx.request.body);
    this.success(uuid);
  }

  /**
   * 下架商品
   */
  async down() {
    const { ctx } = this;
    const uuid = await ctx.service.goods.down(ctx.request.body);
    this.success(uuid);
  }

  /**
   * 获取商品分页列表
   */
  async query() {
    const { ctx } = this;
    const goodsData = await ctx.service.goods.query(ctx.request.body);
    this.success(goodsData);
  }

  /**
   * 根据uuid获取商品
   */
  async get() {
    const { ctx } = this;
    const goods = await ctx.service.goods.get(ctx.request.body);
    this.success(goods);
  }
}

module.exports = GoodsController;
