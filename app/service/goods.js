/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-11-14 12:02:28
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2024-12-28 11:26:49
 * @FilePath: \Mini_program_backend\app\service\goods.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
// app/service/goods.js
"use strict";

const Service = require("egg").Service;

class GoodsService extends Service {
  // 添加商品
  async saveNew(params = {}) {
    const { goods, user_id, userName, orgUuid } = params;
    const { app } = this;
    const crateInfo = app.getCrateInfo(user_id, userName);

    const goodsData = {
      ...goods,
      ...crateInfo,
      orgUuid,
    };
    return await app.model.Goods.saveNew(goodsData);
  }

  // 根据 ID 获取商品信息
  async getGoodsById(goodsId) {
    const { Goods } = this.ctx.model;
    const goods = await Goods.get(goodsId);
    if (!goods) {
      throw new Error("Goods not found");
    }
    return goods;
  }

  /**
   * 修改商品
   * @param {object} params - 条件
   * @return {string|null} - 商品uuid
   */
  async saveModify(params = {}) {
    const { app } = this;
    const { goods, user_id, userName, orgUuid } = params;
    const modifyInfo = app.getModifyInfo(user_id, userName);

    const goodsData = { ...goods, ...modifyInfo, orgUuid };

    return await app.model.Goods.saveModify(goodsData);
  }

  /**
   * 上架商品
   * @param {object} params - 条件
   * @return {string|null} - 商品uuid
   */
  async up(params) {
    const { app } = this;
    const { goods_id, userUuid, userName, orgUuid } = params;
    const modifyInfo = app.getModifyInfo(userUuid, userName);
    const goods = { goods_id, orgUuid, status: "up", ...modifyInfo };

    await app.model.Goods.saveModify(goods);

    return goods_id;
  }

  /**
   * 下架商品
   * @param {object} params - 条件
   * @return {string|null} - 商品uuid
   */
  async down(params) {
    const { app } = this;
    const { goods_id, userUuid, userName, orgUuid } = params;
    const modifyInfo = app.getModifyInfo(userUuid, userName);
    const goods = { goods_id, orgUuid, status: "down", ...modifyInfo };

    await app.model.Goods.saveModify(goods);

    return goods_id;
  }

  /**
   * 获取key为类别的商品数据
   * @param {string} orgUuid - 商家uuid
   * @return {object|null} - 查找结果
   */
  async getGoodsWithCategory(orgUuid) {
    const { app } = this;
    const goodsList = [];
    const resultList = await app.model.Goods.getGoodsWithCategory({
      orgUuid,
      categoryAttributes: ["uuid", "name"],
      goodsAttributes: [
        "goods_id",
        "name",
        "category_id",
        "spec",
        "thumbnail",
        "salePrice",
        "unitName",
      ],
    });

    for (const resultItem of resultList) {
      const { goods_id, name: label, goods: lines } = resultItem || {};

      lines.forEach(item => {
        item.dataValues.categoryName = label;
      });
      goodsList.push({ goods_id, label, lines });
    }

    return goodsList;
  }

  /**
   * 获取某类别的商品数量
   * @param {string} categoryUuid - 类别uuid
   * @return {number} - 商品数量
   */
  async countGoodsByCategory(categoryUuid) {
    return await this.app.model.Goods.countGoodsByCategory(categoryUuid);
  }

  /**
   * 获取商品分页列表
   * @param {object} params - 条件
   * @return {object|null} - 查找结果
   */
  async query(params = {}) {
    const { app } = this;
    const goodsData = await app.model.Goods.query({
      ...params,
      attributes: [
        "goods_id",
        "version",
        "name",
        "status",
        "unitName",
        "spec",
        "goodsInfo",
        "salePrice",
        "thumbnail",
        "category_id",
      ],
    });

    if (goodsData.count > 0) {
      for (const row of goodsData.rows) {
        const { category_id: uuid } = row || {};
        const { orgUuid } = params;
        const goodsCategory = await app.model.GoodsCategory.get({
          uuid,
          orgUuid,
          attributes: ["name"],
        });

        if (goodsCategory && !app._.isEmpty(goodsCategory)) {
          row.dataValues.categoryName = goodsCategory.name;
        }
      }
    }

    return goodsData;
  }

  /**
   * 获取商品
   * @param {object} params - 条件
   * @return {object|null} - 查找结果
   */
  async get(params) {
    const { app, ctx } = this;
    const goodsData = (await app.model.Goods.get(params)) || {};
    const { category_id: uuid, orgUuid } = goodsData;
    const goodsCategory =
      (await app.model.GoodsCategory.get({
        uuid,
        orgUuid,
        attributes: ["name"],
      })) || {};

    if (!app._.isEmpty(goodsData)) {
      goodsData.dataValues.categoryName = goodsCategory.name;
    } else {
      ctx.throw(200, "查询不到指定的商品");
    }

    return goodsData;
  }

  // 删除商品
  async removeGoods(goodsId) {
    const { Goods } = this.ctx.model;
    return await Goods.removeGoods(goodsId);
  }

  // 获取所有商品列表
  async getAllGoods() {
    const { Goods } = this.ctx.model;
    return await Goods.getAllGoods();
  }
}

module.exports = GoodsService;
