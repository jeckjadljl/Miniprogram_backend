/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-04-11 17:00:44
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-05-26 00:36:38
 * @FilePath: \Mini_program_backend\app\service\goods_specifications.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

const Service = require("egg").Service;
const fs = require("fs");
const path = require("path");

class GoodsSpecificationsService extends Service {
  async saveNew(params = {}) {
    const { ctx } = this;
    const { spec = [] } = params;

    // 处理每个规格项
    const results = await Promise.all(
      spec.map(async item => {
        const uploadPromises = [];

        if (item.specThumbnail && fs.existsSync(item.specThumbnail)) {
          const thumbnailBuffer = fs.readFileSync(item.specThumbnail); // 读取本地文件
          const md5 = await ctx.service.cos.getBufferMD5(thumbnailBuffer); // 获取MD5
          const thumbnailKey = `thumbnail/${md5}_${path.basename(
            item.specThumbnail
          )}`; // 存储路径
          uploadPromises.push(
            ctx.service.cos
              .uploadFile(thumbnailBuffer, thumbnailKey, "", "")
              .then(url => {
                console.log("COS返回的URL:", url); // 添加日志
                item.specThumbnail = url;
              })
          );
        }

        if (item.specImages) {
          if (Array.isArray(item.specImages)) {
            for (const [index, image] of item.specImages.entries()) {
              if (fs.existsSync(image)) {
                const imageBuffer = fs.readFileSync(image);
                const md5 = await ctx.service.cos.getBufferMD5(imageBuffer);
                const imageKey = `carousel/${md5}_${path.basename(image)}`;
                uploadPromises.push(
                  ctx.service.cos
                    .uploadFile(imageBuffer, imageKey, "", "")
                    .then(url => {
                      item.specImages[index] = url;
                    })
                );
              }
            }
          } else if (fs.existsSync(item.specImages)) {
            const imageBuffer = fs.readFileSync(item.specImages);
            const md5 = await ctx.service.cos.getBufferMD5(imageBuffer);
            const imageKey = `carousel/${md5}_${path.basename(
              item.specImages
            )}`;
            uploadPromises.push(
              ctx.service.cos
                .uploadFile(imageBuffer, imageKey, "", "")
                .then(url => {
                  item.specImages = [url]; // 转换为数组格式
                })
            );
          }
        }

        // 等待所有上传完成
        await Promise.all(uploadPromises);

        const specData = {
          goods_id: item.goods_id,
          specName: item.specName,
          specValue: item.specValue,
          specPrice: parseFloat(item.specPrice) || 0,
          stock: item.stock ? parseInt(item.stock) : null,
          specThumbnail: item.specThumbnail || null,
          specImages: item.specImages || null,
          specPosters: item.specPosters || null,
          isDefault: item.isDefault || false,
        };

        return await ctx.model.GoodsSpecifications.saveNew(specData);
      })
    );
    return results;
  }

  async saveModify(params = {}) {
    const { ctx } = this;
    const { spec = [] } = params;

    // 处理每个规格项
    const results = await Promise.all(
      spec.map(async item => {
        const uploadPromises = [];

        if (item.specThumbnail && fs.existsSync(item.specThumbnail)) {
          const thumbnailBuffer = fs.readFileSync(item.specThumbnail); // 读取本地文件
          const md5 = await ctx.service.cos.getBufferMD5(thumbnailBuffer); // 获取MD5
          const thumbnailKey = `thumbnail/${md5}_${path.basename(
            item.specThumbnail
          )}`; // 存储路径
          uploadPromises.push(
            ctx.service.cos
              .uploadFile(thumbnailBuffer, thumbnailKey, "", "")
              .then(url => {
                console.log("COS返回的URL:", url); // 添加日志
                item.specThumbnail = url;
              })
          );
        }

        // 新增specImages处理
        if (item.specImages) {
          if (Array.isArray(item.specImages)) {
            for (const [index, image] of item.specImages.entries()) {
              if (fs.existsSync(image)) {
                const imageBuffer = fs.readFileSync(image);
                const md5 = await ctx.service.cos.getBufferMD5(imageBuffer);
                const imageKey = `carousel/${md5}_${path.basename(image)}`;
                uploadPromises.push(
                  ctx.service.cos
                    .uploadFile(imageBuffer, imageKey, "", "")
                    .then(url => {
                      item.specImages[index] = url;
                    })
                );
              }
            }
          } else if (fs.existsSync(item.specImages)) {
            const imageBuffer = fs.readFileSync(item.specImages);
            const md5 = await ctx.service.cos.getBufferMD5(imageBuffer);
            const imageKey = `carousel/${md5}_${path.basename(
              item.specImages
            )}`;
            uploadPromises.push(
              ctx.service.cos
                .uploadFile(imageBuffer, imageKey, "", "")
                .then(url => {
                  item.specImages = [url]; // 转换为数组格式
                })
            );
          }
        }

        // 新增specPosters处理
        if (item.specPosters) {
          if (Array.isArray(item.specPosters)) {
            for (const [index, poster] of item.specPosters.entries()) {
              if (fs.existsSync(poster)) {
                const posterBuffer = fs.readFileSync(poster);
                const md5 = await ctx.service.cos.getBufferMD5(posterBuffer);
                const posterKey = `posters/${md5}_${path.basename(poster)}`;
                uploadPromises.push(
                  ctx.service.cos
                    .uploadFile(posterBuffer, posterKey, "", "")
                    .then(url => {
                      item.specPosters[index] = url;
                    })
                );
              }
            }
          } else if (fs.existsSync(item.specPosters)) {
            const posterBuffer = fs.readFileSync(item.specPosters);
            const md5 = await ctx.service.cos.getBufferMD5(posterBuffer);
            const posterKey = `posters/${md5}_${path.basename(
              item.specPosters
            )}`;
            uploadPromises.push(
              ctx.service.cos
                .uploadFile(posterBuffer, posterKey, "", "")
                .then(url => {
                  item.specPosters = [url]; // 转换为数组格式
                })
            );
          }
        }

        // 等待所有上传完成
        await Promise.all(uploadPromises);
        const specData = {
          ...item,
        };
        return await ctx.model.GoodsSpecifications.saveModify(specData);
      })
    );
    return results;
  }

  // 在现有方法后添加
  async getByGoodsId(params = {}) {
    const { ctx } = this;
    const { goods_id } = params;

    return await ctx.model.GoodsSpecifications.findAll({
      where: { goods_id },
      attributes: ["spec_id", "specName", "specValue", "specPrice"],
    });
  }

  async saveNewColor(params = {}) {
    const { ctx } = this;
    const { specColor = [] } = params;
    // 处理每个规格项
    const results = await Promise.all(
      specColor.map(async item => {
        const uploadPromises = [];

        if (item.specColorThumbnail && fs.existsSync(item.specColorThumbnail)) {
          const thumbnailBuffer = fs.readFileSync(item.specColorThumbnail); // 读取本地文件
          const md5 = await ctx.service.cos.getBufferMD5(thumbnailBuffer); // 获取MD5
          const thumbnailKey = `thumbnail/${md5}_${path.basename(
            item.specColorThumbnail
          )}`; // 存储路径
          uploadPromises.push(
            ctx.service.cos
              .uploadFile(thumbnailBuffer, thumbnailKey, "", "")
              .then(url => {
                console.log("COS返回的URL:", url); // 添加日志
                item.specColorThumbnail = url;
              })
          );
        }

        if (item.specColorImages) {
          if (Array.isArray(item.specColorImages)) {
            for (const [index, image] of item.specColorImages.entries()) {
              if (fs.existsSync(image)) {
                const imageBuffer = fs.readFileSync(image);
                const md5 = await ctx.service.cos.getBufferMD5(imageBuffer);
                const imageKey = `carousel/${md5}_${path.basename(image)}`;
                uploadPromises.push(
                  ctx.service.cos
                    .uploadFile(imageBuffer, imageKey, "", "")
                    .then(url => {
                      item.specColorImages[index] = url;
                    })
                );
              }
            }
          } else if (fs.existsSync(item.specColorImages)) {
            const imageBuffer = fs.readFileSync(item.specColorImages);
            const md5 = await ctx.service.cos.getBufferMD5(imageBuffer);
            const imageKey = `carousel/${md5}_${path.basename(
              item.specColorImages
            )}`;
            uploadPromises.push(
              ctx.service.cos
                .uploadFile(imageBuffer, imageKey, "", "")
                .then(url => {
                  item.specColorImages = [url]; // 转换为数组格式
                })
            );
          }
        }
        // 等待所有上传完成
        await Promise.all(uploadPromises);

        const specColorData = {
          goods_id: item.goods_id,
          spec_id: item.spec_id,
          specName: item.specName,
          specValue: item.specValue,
          specPrice: parseFloat(item.specPrice) || 0,
          specColorImages: item.specColorImages || null,
          specColorThumbnail: item.specColorThumbnail || null,
        };

        return await ctx.model.GoodsSpecColor.saveNew(specColorData);
      })
    );
    return results;
  }

  async saveModifyColor(params = {}) {
    const { ctx } = this;
    const { specColor } = params;

    const results = await Promise.all(
      specColor.map(async item => {
        const uploadPromises = [];

        if (item.specColorThumbnail && fs.existsSync(item.specColorThumbnail)) {
          const thumbnailBuffer = fs.readFileSync(item.specColorThumbnail); // 读取本地文件
          const md5 = await ctx.service.cos.getBufferMD5(thumbnailBuffer); // 获取MD5
          const thumbnailKey = `thumbnail/${md5}_${path.basename(
            item.specColorThumbnail
          )}`; // 存储路径
          uploadPromises.push(
            ctx.service.cos
              .uploadFile(thumbnailBuffer, thumbnailKey, "", "")
              .then(url => {
                console.log("COS返回的URL:", url); // 添加日志
                item.specColorThumbnail = url;
              })
          );
        }

        // 新增specColorImages处理
        if (item.specColorImages) {
          if (Array.isArray(item.specColorImages)) {
            for (const [index, image] of item.specColorImages.entries()) {
              if (fs.existsSync(image)) {
                const imageBuffer = fs.readFileSync(image);
                const md5 = await ctx.service.cos.getBufferMD5(imageBuffer);
                const imageKey = `carousel/${md5}_${path.basename(image)}`;
                uploadPromises.push(
                  ctx.service.cos
                    .uploadFile(imageBuffer, imageKey, "", "")
                    .then(url => {
                      item.specColorImages[index] = url;
                    })
                );
              }
            }
          } else if (fs.existsSync(item.specColorImages)) {
            const imageBuffer = fs.readFileSync(item.specColorImages);
            const md5 = await ctx.service.cos.getBufferMD5(imageBuffer);
            const imageKey = `carousel/${md5}_${path.basename(
              item.specColorImages
            )}`;
            uploadPromises.push(
              ctx.service.cos
                .uploadFile(imageBuffer, imageKey, "", "")
                .then(url => {
                  item.specColorImages = [url]; // 转换为数组格式
                })
            );
          }
        }

        // 等待所有上传完成
        await Promise.all(uploadPromises);

        const specColorData = {
          ...item,
        };

        return await ctx.model.GoodsSpecColor.saveModify(specColorData);
      })
    );
    return results;
  }

  async getSpecColorByGoodsId(params = {}) {
    const { ctx } = this;
    return await ctx.model.GoodsSpecColor.getByGoodsId(params);
  }
}

module.exports = GoodsSpecificationsService;
