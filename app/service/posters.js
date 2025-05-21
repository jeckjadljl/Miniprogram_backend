/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-02-22 22:02:52
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-05-12 00:23:53
 * @FilePath: \Mini_program_backend\app\service\posters.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

const Service = require("egg").Service;

const fs = require("fs");
const path = require("path");

class PostersService extends Service {
  async saveNew(params = {}) {
    const { app, ctx } = this;
    const { Posters, user_id, userName, orgUuid } = params;
    const { elements_id, purpose, purposeType } = Posters;
    const crateInfo = app.getCrateInfo(user_id, userName);

    const uploadPromises = [];

    try {
      if (purpose === "elements") {
        const getElements = await app.model.Elements.getByUuid({
          uuid: elements_id,
          orgUuid,
        });
        if (!getElements) {
          throw new Error("elements is not fund");
        }
      }
      if (Posters.imageUrl && Array.isArray(Posters.imageUrl)) {
        for (const [index, imageUrlItem] of Posters.imageUrl.entries()) {
          if (fs.existsSync(imageUrlItem)) {
            const imageUrlBuffer = fs.readFileSync(imageUrlItem);
            const md5 = await ctx.service.cos.getBufferMD5(imageUrlBuffer);
            const imageUrlKey = `${purposeType}/${md5}_${path.basename(
              imageUrlItem
            )}`; // 存储路径
            uploadPromises.push(
              ctx.service.cos
                .uploadFile(imageUrlBuffer, imageUrlKey, "", "")
                .then(url => {
                  console.log("COS返回的URL:", url); // 添加日志
                  Posters.imageUrl[index] = url;
                })
            );
          }
        }
      } else if (Posters.imageUrl && fs.existsSync(Posters.imageUrl)) {
        const imageUrlBuffer = fs.readFileSync(Posters.imageUrl);
        const md5 = await ctx.service.cos.getBufferMD5(imageUrlBuffer);
        const imageUrlKey = `${purposeType}/${md5}_${path.basename(
          Posters.imageUrl
        )}`; // 存储路径

        uploadPromises.push(
          ctx.service.cos
            .uploadFile(imageUrlBuffer, imageUrlKey, "", "")
            .then(url => {
              console.log("COS返回的URL:", url); // 添加日志
              Posters.imageUrl = url;
            })
        );
      }

      // 等待所有上传完成
      await Promise.all(uploadPromises);

      const PostersData = {
        ...Posters,
        ...crateInfo,
        orgUuid,
      };

      return await app.model.Posters.saveNew(PostersData);
    } catch (error) {
      ctx.logger.error("Error uploading images:", error);
      throw error;
    }
  }

  async saveModify(params = {}) {
    const { app, ctx } = this;
    const { Posters, user_id, userName, orgUuid } = params;
    const { elements_id, purpose, purposeType } = Posters;
    const modifyInfo = app.getModifyInfo(user_id, userName);

    const uploadPromises = [];

    try {
      if (purpose === "elements") {
        const getElements = await app.model.Elements.getByUuid({
          uuid: elements_id,
          orgUuid,
        });
        if (!getElements) {
          throw new Error("elements is not fund");
        }
      }
      if (Posters.imageUrl && Array.isArray(Posters.imageUrl)) {
        for (const [index, imageUrlItem] of Posters.imageUrl.entries()) {
          if (fs.existsSync(imageUrlItem)) {
            const imageUrlBuffer = fs.readFileSync(imageUrlItem);
            const md5 = await ctx.service.cos.getBufferMD5(imageUrlBuffer);
            const imageUrlKey = `${purposeType}/${md5}_${path.basename(
              imageUrlItem
            )}`; // 存储路径
            uploadPromises.push(
              ctx.service.cos
                .uploadFile(imageUrlBuffer, imageUrlKey, "", "")
                .then(url => {
                  console.log("COS返回的URL:", url); // 添加日志
                  Posters.imageUrl[index] = url;
                })
            );
          }
        }
      } else if (Posters.imageUrl && fs.existsSync(Posters.imageUrl)) {
        const imageUrlBuffer = fs.readFileSync(Posters.imageUrl);
        const md5 = await ctx.service.cos.getBufferMD5(imageUrlBuffer);
        const imageUrlKey = `${purposeType}/${md5}_${path.basename(
          Posters.imageUrl
        )}`; // 存储路径

        uploadPromises.push(
          ctx.service.cos
            .uploadFile(imageUrlBuffer, imageUrlKey, "", "")
            .then(url => {
              console.log("COS返回的URL:", url); // 添加日志
              Posters.imageUrl = url;
            })
        );
      }

      // 等待所有上传完成
      await Promise.all(uploadPromises);

      const PostersData = {
        ...Posters,
        ...modifyInfo,
        orgUuid,
      };

      return await app.model.Posters.saveModify(PostersData);
    } catch (error) {
      ctx.logger.error("Error uploading images:", error);
      throw error;
    }
  }

  async get(uuid, orgUuid) {
    const { app } = this;
    const result = await app.model.Posters.get({
      uuid,
      orgUuid,
    });
    return result;
  }

  async getHomeCarousel() {
    const { app } = this;
    const result = await app.model.Posters.getHomeCarousel();
    return result;
  }
}

module.exports = PostersService;
