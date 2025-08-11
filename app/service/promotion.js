/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-04-09 16:26:12
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-08-09 12:10:58
 * @FilePath: \Mini_program_backend\app\service\promotion.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

const Service = require("egg").Service;

const fs = require("fs");
const path = require("path");

class PromotionService extends Service {
  async saveNew(params = {}) {
    const { app, ctx } = this;
    const { promotion, user_id, userName, orgUuid } = params;
    const crateInfo = app.getCrateInfo(user_id, userName);

    const uploadPromises = [];

    if (promotion.thumbnail && fs.existsSync(promotion.thumbnail)) {
      const thumbnailBuffer = fs.readFileSync(promotion.thumbnail); // 读取本地文件
      const md5 = await ctx.service.cos.getBufferMD5(thumbnailBuffer); // 获取MD5
      const thumbnailKey = `thumbnail/${md5}_${path.basename(
        promotion.thumbnail
      )}`; // 存储路径
      uploadPromises.push(
        ctx.service.cos
          .uploadFile(thumbnailBuffer, thumbnailKey, "", "")
          .then(url => {
            console.log("COS返回的URL:", url); // 添加日志
            promotion.thumbnail = url;
          })
      );
    }

    try {
      // 等待所有上传完成
      await Promise.all(uploadPromises);

      const promotionData = {
        ...promotion,
        ...crateInfo,
        orgUuid,
      };
      return await app.model.Promotion.saveNew(promotionData);
    } catch (error) {
      ctx.logger.error("Error uploading images:", error);
      throw error;
    }
  }

  async saveModify(params = {}) {
    const { app, ctx } = this;
    const { promotion, user_id, userName, orgUuid } = params;
    const modifyInfo = app.getModifyInfo(user_id, userName);

    const uploadPromises = [];

    if (promotion.thumbnail && fs.existsSync(promotion.thumbnail)) {
      const thumbnailBuffer = fs.readFileSync(promotion.thumbnail); // 读取本地文件
      const md5 = await ctx.service.cos.getBufferMD5(thumbnailBuffer); // 获取MD5
      const thumbnailKey = `thumbnail/${md5}_${path.basename(
        promotion.thumbnail
      )}`; // 存储路径
      uploadPromises.push(
        ctx.service.cos
          .uploadFile(thumbnailBuffer, thumbnailKey, "", "")
          .then(url => {
            console.log("COS返回的URL:", url); // 添加日志
            promotion.thumbnail = url;
          })
      );
    }

    try {
      // 等待所有上传完成
      await Promise.all(uploadPromises);

      const promotionData = {
        ...promotion,
        ...modifyInfo,
        orgUuid,
      };
      return await app.model.Promotion.saveModify(promotionData);
    } catch (error) {
      ctx.logger.error("Error uploading images:", error);
      throw error;
    }
  }

  async getAll() {
    const { app } = this;
    return await app.model.Promotion.getAll({
      attributes: [
        "uuid",
        "version",
        "thumbnail",
        "name",
        "orgUuid",
        "createdTime",
        "lastModifiedTime",
      ],
    });
  }

  async getByActivityType(params = {}) {
    const { app } = this;
    return await app.model.Promotion.getByActivityType({
      ...params,
      attributes: [
        "uuid",
        "version",
        "name",
        "activity_type",
        "status",
        "start_time",
        "end_time",
        "orgUuid",
        "createdTime",
        "lastModifiedTime",
      ],
      memberGoodsAttributes: [
        "id",
        "goods_id",
        "name",
        "thumbnail",
        "unitName",
        "salePrice",
        "spec",
        "quantity",
        "discount_amount",
        "discount_type",
        "discount_tag",
        "points_deduction",
        "points_rate",
        "point_spend",
        "cash_amount",
        "member_goods_status",
        "orgUuid",
      ],
    });
  }
}

module.exports = PromotionService;
