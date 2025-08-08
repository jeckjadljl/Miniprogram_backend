/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-06-04 14:24:24
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-08-04 15:28:52
 * @FilePath: \Mini_program_backend\app\utils\uploadImage.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
const fs = require("fs");
const path = require("path");

class UpLoadImage {
  constructor(ctx) {
    this.ctx = ctx;
  }

  // async uploadImage(params = {}) {
  //   const { ctx } = this;
  //   const { BucketType, image = [] } = params;

  //   // 1. 确保 images 是数组
  //   const imageList = Array.isArray(image) ? image : [image];

  //   const uploadPromises = imageList.map(async imageItem => {
  //     // 2. 检查是否是 base64 格式
  //     if (typeof imageItem === "object" && imageItem.data) {
  //       const base64Data = imageItem.data.replace(
  //         /^data:image\/\w+;base64,/,
  //         ""
  //       );
  //       const imageBuffer = Buffer.from(base64Data, "base64");

  //       // 3. 计算 MD5 和文件名
  //       const md5 = await ctx.service.cos.getBufferMD5(imageBuffer);
  //       const imageKey = `${BucketType}/${md5}_${path.basename(imageItem)}`;

  //       // 4. 上传到 COS
  //       return ctx.service.cos
  //         .uploadFile(imageBuffer, imageKey, "", "")
  //         .then(url => {
  //           console.log("COS返回的URL:", url);
  //           return url;
  //         });
  //     }

  //     // 5. 保留原有本地文件处理逻辑
  //     if (fs.existsSync(imageItem)) {
  //       const imageBuffer = fs.readFileSync(imageItem);
  //       const md5 = await ctx.service.cos.getBufferMD5(imageBuffer);
  //       const imageKey = `${BucketType}/${md5}_${path.basename(imageItem)}`;

  //       return ctx.service.cos
  //         .uploadFile(imageBuffer, imageKey, "", "")
  //         .then(url => {
  //           console.log("COS返回的URL:", url);
  //           return url;
  //         });
  //     }

  //     throw new Error(`无效的图片数据: ${imageItem}`);
  //   });

  //   return Promise.all(uploadPromises);
  // }

  async uploadImage(params = {}) {
    const { ctx } = this;
    const { BucketType } = params;
    const uploadPromises = [];

    if (params.image && Array.isArray(params.image)) {
      for (const [index, imageItem] of params.image.entries()) {
        if (fs.existsSync(imageItem)) {
          const imageBuffer = fs.readFileSync(imageItem); // 读取本地文件
          const md5 = await ctx.service.cos.getBufferMD5(imageBuffer); // 获取MD5
          const imageKey = `${BucketType}/${md5}_${path.basename(imageItem)}`; // 存储路径

          // 添加30秒超时控制
          const uploadPromise = ctx.service.cos.uploadFile(
            imageBuffer,
            imageKey,
            "",
            ""
          );
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error("图片上传超时")), 30000);
          });

          uploadPromises.push(
            Promise.race([uploadPromise, timeoutPromise]).then(url => {
              console.log("COS返回的URL:", url); // 添加日志
              params.image[index] = url;
            })
          );
        }
      }
    } else if (params.image && fs.existsSync(params.image)) {
      const ImageBuffer = fs.readFileSync(params.image); // 读取本地文件
      const md5 = await ctx.service.cos.getBufferMD5(ImageBuffer); // 获取MD5
      const ImageKey = `${BucketType}/${md5}_${path.basename(params.image)}`; // 存储路径

      // 添加30秒超时控制
      const uploadPromise = ctx.service.cos.uploadFile(
        ImageBuffer,
        ImageKey,
        "",
        ""
      );
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("图片上传超时")), 30000);
      });

      uploadPromises.push(
        Promise.race([uploadPromise, timeoutPromise]).then(url => {
          console.log("COS返回的URL:", url); // 添加日志
          return url;
          // params.image = url;
        })
      );
    }
    return Promise.all(uploadPromises);
  }

  /**
   * 上传小程序端下载的图片
   * @param {*} params
   */
  async uploadWeImages(params = {}) {
    const { ctx, app } = this;
    const { BucketType, image } = params;

    const upload = await this.uploadImage({
      image,
      BucketType,
    });

    return upload[0];
  }
}
module.exports = UpLoadImage;
