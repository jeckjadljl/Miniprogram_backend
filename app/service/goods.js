/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-11-14 12:02:28
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-03-05 15:24:27
 * @FilePath: \Mini_program_backend\app\service\goods.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
// app/service/goods.js
"use strict";

const Service = require("egg").Service;

const fs = require("fs");
const path = require("path");

class GoodsService extends Service {
  // 添加商品
  async saveNew(params = {}) {
    const { goods, user_id, userName, orgUuid } = params;
    const { app, ctx } = this;
    const crateInfo = app.getCrateInfo(user_id, userName);

    const uploadPromises = [];

    if (goods.thumbnail && fs.existsSync(goods.thumbnail)) {
      const thumbnailBuffer = fs.readFileSync(goods.thumbnail); // 读取本地文件
      const thumbnailKey = `thumbnail/${path.basename(goods.thumbnail)}`; // 存储路径
      uploadPromises.push(
        ctx.service.cos
          .uploadFile(thumbnailBuffer, thumbnailKey, "", "")
          .then(url => {
            console.log("COS返回的URL:", url); // 添加日志
            goods.thumbnail = url;
          })
      );
    }

    // 处理 carousel 中的多张图片
    if (goods.carousel && Array.isArray(goods.carousel)) {
      goods.carousel.forEach((carouselItem, index) => {
        if (fs.existsSync(carouselItem)) {
          const carouselBuffer = fs.readFileSync(carouselItem); // 读取本地文件
          const carouselKey = `carousel/${path.basename(carouselItem)}`; // 存储路径
          uploadPromises.push(
            ctx.service.cos
              .uploadFile(carouselBuffer, carouselKey, "", "")
              .then(url => {
                console.log("COS返回的URL:", url); // 添加日志
                // 更新 goods.carousel 中的对应项为上传后的 URL
                goods.carousel[index] = url;
              })
          );
        }
      });
    } else if (goods.carousel && fs.existsSync(goods.carousel)) {
      // 如果 goods.carousel 是单个字符串，也处理为单张图片
      const carouselBuffer = fs.readFileSync(goods.carousel); // 读取本地文件
      const carouselKey = `carousel/${path.basename(goods.carousel)}`; // 存储路径
      uploadPromises.push(
        ctx.service.cos
          .uploadFile(carouselBuffer, carouselKey, "", "")
          .then(url => {
            console.log("COS返回的URL:", url); // 添加日志
            goods.carousel = url; // 将其转换为数组
          })
      );
    }

    if (goods.imagesJsonStr && fs.existsSync(goods.imagesJsonStr)) {
      const imagesJsonStrBuffer = fs.readFileSync(goods.imagesJsonStr);
      const imagesJsonStrKey = `posters/${path.basename(goods.imagesJsonStr)}`;
      uploadPromises.push(
        ctx.service.cos
          .uploadFile(imagesJsonStrBuffer, imagesJsonStrKey, "", "")
          .then(url => {
            console.log("COS返回的URL:", url); // 添加日志
            goods.imagesJsonStr = url; // 将其转换为数组
          })
      );
    }

    try {
      // 等待所有上传完成
      await Promise.all(uploadPromises);

      const goodsData = {
        ...goods,
        ...crateInfo,
        orgUuid,
      };
      return await app.model.Goods.saveNew(goodsData);
    } catch (error) {
      ctx.logger.error("Error uploading images:", error);
      throw error;
    }
  }

  // 根据 ID 获取商品信息
  async getGoodsById(goods_id, orgUuid) {
    const { Goods } = this.ctx.model;
    const goods = await Goods.get({ goods_id, orgUuid });
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
    const { app, ctx } = this;
    const { goods, user_id, userName, orgUuid } = params;
    const modifyInfo = app.getModifyInfo(user_id, userName);

    const uploadPromises = [];

    if (goods.thumbnail && fs.existsSync(goods.thumbnail)) {
      const thumbnailBuffer = fs.readFileSync(goods.thumbnail); // 读取本地文件
      const thumbnailKey = `thumbnail/${path.basename(goods.thumbnail)}`; // 存储路径
      uploadPromises.push(
        ctx.service.cos
          .uploadFile(thumbnailBuffer, thumbnailKey, "", "")
          .then(url => {
            console.log("COS返回的URL:", url); // 添加日志
            goods.thumbnail = url;
          })
      );
    }

    // 处理 carousel 中的多张图片
    if (goods.carousel && Array.isArray(goods.carousel)) {
      goods.carousel.forEach((carouselItem, index) => {
        if (fs.existsSync(carouselItem)) {
          const carouselBuffer = fs.readFileSync(carouselItem); // 读取本地文件
          const carouselKey = `carousel/${path.basename(carouselItem)}`; // 存储路径
          uploadPromises.push(
            ctx.service.cos
              .uploadFile(carouselBuffer, carouselKey, "", "")
              .then(url => {
                console.log("COS返回的URL:", url); // 添加日志
                // 更新 goods.carousel 中的对应项为上传后的 URL
                goods.carousel[index] = url;
              })
          );
        }
      });
    } else if (goods.carousel && fs.existsSync(goods.carousel)) {
      // 如果 goods.carousel 是单个字符串，也处理为单张图片
      const carouselBuffer = fs.readFileSync(goods.carousel); // 读取本地文件
      const carouselKey = `carousel/${path.basename(goods.carousel)}`; // 存储路径
      uploadPromises.push(
        ctx.service.cos
          .uploadFile(carouselBuffer, carouselKey, "", "")
          .then(url => {
            console.log("COS返回的URL:", url); // 添加日志
            goods.carousel = url; // 将其转换为数组
          })
      );
    }

    if (goods.imagesJsonStr && fs.existsSync(goods.imagesJsonStr)) {
      const imagesJsonStrBuffer = fs.readFileSync(goods.imagesJsonStr);
      const imagesJsonStrKey = `posters/${path.basename(goods.imagesJsonStr)}`;
      uploadPromises.push(
        ctx.service.cos
          .uploadFile(imagesJsonStrBuffer, imagesJsonStrKey, "", "")
          .then(url => {
            console.log("COS返回的URL:", url); // 添加日志
            goods.imagesJsonStr = url; // 将其转换为数组
          })
      );
    }

    try {
      // 等待所有上传完成
      await Promise.all(uploadPromises);

      const goodsData = { ...goods, ...modifyInfo, orgUuid };
      return await app.model.Goods.saveModify(goodsData);
    } catch (error) {
      ctx.logger.error("Error uploading images:", error);
      throw error;
    }
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
    return await Goods.getAllGoods({
      attributes: [
        "goods_id",
        "version",
        "name",
        "orgUuid",
        "status",
        "unitName",
        "spec",
        "goodsInfo",
        "salePrice",
        "thumbnail",
        "category_id",
      ],
    });
  }
}

module.exports = GoodsService;
