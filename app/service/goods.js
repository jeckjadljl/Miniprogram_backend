/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-11-14 12:02:28
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-04-27 20:23:39
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
      const md5 = await ctx.service.cos.getBufferMD5(thumbnailBuffer); // 获取MD5
      const thumbnailKey = `thumbnail/${md5}_${path.basename(goods.thumbnail)}`; // 存储路径
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
      for (const [index, carouselItem] of goods.carousel.entries()) {
        if (fs.existsSync(carouselItem)) {
          const carouselBuffer = fs.readFileSync(carouselItem); // 读取本地文件
          const md5 = await ctx.service.cos.getBufferMD5(carouselBuffer); // 获取MD5
          const carouselKey = `carousel/${md5}_${path.basename(carouselItem)}`; // 存储路径
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
      }
    } else if (goods.carousel && fs.existsSync(goods.carousel)) {
      // 如果 goods.carousel 是单个字符串，也处理为单张图片
      const carouselBuffer = fs.readFileSync(goods.carousel); // 读取本地文件
      const md5 = await ctx.service.cos.getBufferMD5(carouselBuffer); // 获取MD5
      const carouselKey = `carousel/${md5}_${path.basename(goods.carousel)}`; // 存储路径
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
      const md5 = await ctx.service.cos.getBufferMD5(imagesJsonStrBuffer); // 获取MD5
      const imagesJsonStrKey = `posters/${md5}_${path.basename(
        goods.imagesJsonStr
      )}`;
      uploadPromises.push(
        ctx.service.cos
          .uploadFile(imagesJsonStrBuffer, imagesJsonStrKey, "", "")
          .then(url => {
            console.log("COS返回的URL:", url); // 添加日志
            goods.imagesJsonStr = url; // 将其转换为数组
          })
      );
    }

    // 处理规格图片
    if (goods.spec && Array.isArray(goods.spec)) {
      for (const spec of goods.spec) {
        if (spec.specThumbnail && fs.existsSync(spec.specThumbnail)) {
          const thumbnailBuffer = fs.readFileSync(spec.specThumbnail); // 读取本地文件
          const md5 = await ctx.service.cos.getBufferMD5(thumbnailBuffer); // 获取MD5
          const thumbnailKey = `thumbnail/${md5}_${path.basename(
            spec.specThumbnail
          )}`; // 存储路径
          uploadPromises.push(
            ctx.service.cos
              .uploadFile(thumbnailBuffer, thumbnailKey, "", "")
              .then(url => {
                console.log("COS返回的URL:", url); // 添加日志
                spec.specThumbnail = url;
              })
          );
        }

        if (spec.specImages && Array.isArray(spec.specImages)) {
          for (const [index, image] of spec.specImages.entries()) {
            if (fs.existsSync(image)) {
              const imageBuffer = fs.readFileSync(image); // 读取本地文件
              const md5 = await ctx.service.cos.getBufferMD5(imageBuffer); // 获取MD5
              const imageKey = `carousel/${md5}_${path.basename(image)}`; // 存储路径
              uploadPromises.push(
                ctx.service.cos
                  .uploadFile(imageBuffer, imageKey, "", "")
                  .then(url => {
                    console.log("COS返回的URL:", url); // 添加日志
                    spec.specImages[index] = url;
                  })
              );
            }
          }
        } else if (spec.specImages && fs.existsSync(spec.specImages)) {
          // 如果 spec.specImages 是单个字符串，也处理为单张图片
          const imageBuffer = fs.readFileSync(spec.specImages); // 读取本地文件
          const md5 = await ctx.service.cos.getBufferMD5(imageBuffer); // 获取MD5
          const imageKey = `carousel/${md5}_${path.basename(spec.specImages)}`; // 存储路径
          uploadPromises.push(
            ctx.service.cos
              .uploadFile(imageBuffer, imageKey, "", "")
              .then(url => {
                console.log("COS返回的URL:", url); // 添加日志
                spec.specImages = url; // 将其转换为数组
              })
          );
        }

        // 处理规格海报（新增逻辑）
        if (spec.specPosters && Array.isArray(spec.specPosters)) {
          for (const [index, poster] of spec.specPosters.entries()) {
            if (fs.existsSync(poster)) {
              const posterBuffer = fs.readFileSync(poster); // 读取本地文件
              const md5 = await ctx.service.cos.getBufferMD5(posterBuffer); // 获取MD5
              const posterKey = `posters/${md5}_${path.basename(poster)}`; // 存储路径
              uploadPromises.push(
                ctx.service.cos
                  .uploadFile(posterBuffer, posterKey, "", "")
                  .then(url => {
                    console.log("COS返回的URL:", url); // 添加日志
                    spec.specPosters[index] = url;
                  })
              );
            }
          }
        } else if (spec.specPosters && fs.existsSync(spec.specPosters)) {
          // 如果 spec.specPosters 是单个字符串，也处理为单张图片
          const posterBuffer = fs.readFileSync(spec.specPosters); // 读取本地文件
          const md5 = await ctx.service.cos.getBufferMD5(posterBuffer); // 获取MD5
          const posterKey = `posters/${md5}_${path.basename(spec.specPosters)}`; // 存储路径
          uploadPromises.push(
            ctx.service.cos
              .uploadFile(posterBuffer, posterKey, "", "")
              .then(url => {
                console.log("COS返回的URL:", url); // 添加日志
                spec.specPosters = url; // 将其转换为数组
              })
          );
        }
      }
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
      const md5 = await ctx.service.cos.getBufferMD5(thumbnailBuffer); // 获取MD5
      const thumbnailKey = `thumbnail/${md5}_${path.basename(goods.thumbnail)}`; // 存储路径
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
      for (const [index, carouselItem] of goods.carousel.entries()) {
        if (fs.existsSync(carouselItem)) {
          const carouselBuffer = fs.readFileSync(carouselItem); // 读取本地文件
          const md5 = await ctx.service.cos.getBufferMD5(carouselBuffer); // 获取MD5
          const carouselKey = `carousel/${md5}_${path.basename(carouselItem)}`; // 存储路径
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
      }
    } else if (goods.carousel && fs.existsSync(goods.carousel)) {
      // 如果 goods.carousel 是单个字符串，也处理为单张图片
      const carouselBuffer = fs.readFileSync(goods.carousel); // 读取本地文件
      const md5 = await ctx.service.cos.getBufferMD5(carouselBuffer); // 获取MD5
      const carouselKey = `carousel/${md5}_${path.basename(goods.carousel)}`; // 存储路径
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
      const md5 = await ctx.service.cos.getBufferMD5(imagesJsonStrBuffer); // 获取MD5
      const imagesJsonStrKey = `posters/${md5}_${path.basename(
        goods.imagesJsonStr
      )}`;
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
  async getGoodsWithCategory(uuid) {
    const { app } = this;
    const goodsList = [];
    const resultList = await app.model.Goods.getGoodsWithCategory({
      uuid,
      categoryAttributes: ["uuid", "name"],
      goodsAttributes: [
        "goods_id",
        "name",
        "category_id",
        "thumbnail",
        "salePrice",
        "orgUuid",
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
        "goodsInfo",
        "salePrice",
        "thumbnail",
        "carousel",
        "category_id",
      ],
    });

    if (goodsData.count > 0) {
      for (const row of goodsData.rows) {
        const { category_id: uuid } = row || {};
        const { orgUuid } = params;

        if (uuid) {
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
    }

    return goodsData;
  }

  /**
   * 获取商品
   * @param {object} params - 条件
   * @return {object|null} - 查找结果
   */
  async get(params = {}) {
    const { app, ctx } = this;
    const goodsData = await app.model.Goods.get(params);

    const goodsInfo = goodsData?.goodsInfo || {};
    const { category_id, orgUuid } = goodsData.goodsInfo;

    // 当分类存在时获取分类名称
    if (category_id) {
      const goodsCategory = await app.model.GoodsCategory.get({
        uuid: category_id,
        orgUuid,
        attributes: ["name"],
      });

      // 安全设置分类名称
      if (goodsCategory && !app._.isEmpty(goodsCategory)) {
        goodsInfo.dataValues = goodsInfo.dataValues || {};
        goodsInfo.dataValues.categoryName = goodsCategory.name;
      }
    }

    return goodsData;
  }

  // 删除商品
  async removeGoods(goodsId) {
    const { Goods } = this.ctx.model;
    return await Goods.removeGoods(goodsId);
  }

  // 获取所有商品列表
  async getAllGoods(params = {}) {
    const { Goods, MemberGoods } = this.ctx.model;

    // 获取所有已存在的会员商品ID
    const existingMemberGoods = await MemberGoods.findAll({
      attributes: ["goods_id"],
      where: {
        goods_id: {
          [this.app.Sequelize.Op.ne]: null, // 排除 NULL 值
        },
      },
      raw: true,
    });
    console.log("existingMemberGoods:", existingMemberGoods);

    const excludeMemberIds = existingMemberGoods
      .map(item => item.goods_id)
      .filter(id => id !== null && id !== undefined); // 新增过滤逻辑;
    console.log("excludeIds:", excludeMemberIds);

    return await Goods.getAllGoods({
      ...params,
      excludeMemberIds,
      attributes: [
        "goods_id",
        "version",
        "name",
        "orgUuid",
        "status",
        "unitName",
        "goodsInfo",
        "salePrice",
        "thumbnail",
        "category_id",
      ],
    });
  }
}

module.exports = GoodsService;
