/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-02-21 11:55:52
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-05-26 16:32:32
 * @FilePath: \Mini_program_backend\app\service\elements.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

const Service = require("egg").Service;

const fs = require("fs");
const path = require("path");

class ElementsService extends Service {
  async saveNew(params = {}) {
    const { app, ctx } = this;
    const { Elements, user_id, userName, orgUuid } = params;
    const crateInfo = app.getCrateInfo(user_id, userName);

    // 上传图片并更新 Elements 数据
    const uploadPromises = [];

    // 上传缩略图
    if (Elements.thumbnail && fs.existsSync(Elements.thumbnail)) {
      const thumbnailBuffer = fs.readFileSync(Elements.thumbnail); // 读取本地文件
      const thumbnailKey = `thumbnail/${path.basename(Elements.thumbnail)}`; // 存储路径
      uploadPromises.push(
        ctx.service.cos
          .uploadFile(thumbnailBuffer, thumbnailKey, "", "")
          .then(url => {
            console.log("COS返回的URL:", url); // 添加日志
            Elements.thumbnail = url;
          })
      );
    }

    try {
      // 等待所有上传完成
      await Promise.all(uploadPromises);

      const ElementsData = {
        ...Elements,
        ...crateInfo,
        orgUuid,
      };

      return await app.model.Elements.saveNew(ElementsData);
    } catch (error) {
      ctx.logger.error("Error uploading images:", error);
      throw error;
    }
  }

  async getAll() {
    const { app } = this;
    return await app.model.Elements.getAll({
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

  /**
   * 根据uuid获取类别
   * @param {object} params 条件
   * @return {object|null} 查找结果
   */
  async get(params = {}) {
    const { app } = this;
    const { uuid, orgUuid } = params;
    return await app.model.Elements.get({
      uuid,
      orgUuid,
      elementsAttributes: [
        "uuid",
        "version",
        "thumbnail",
        "name",
        "orgUuid",
        "createdTime",
        "lastModifiedTime",
      ],
      categoriesAttributes: [
        "uuid",
        "version",
        "elements_id",
        "name",
        "sort_order",
        "createdTime",
        "lastModifiedTime",
      ],
      postersAttributes: [
        "uuid",
        "version",
        "elements_id",
        "imageUrl",
        "orgUuid",
        "purpose",
        "purposeType",
        "link",
        "createdTime",
        "lastModifiedTime",
      ],
    });
  }
}

module.exports = ElementsService;
