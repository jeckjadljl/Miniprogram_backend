/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-06-04 14:24:24
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-06-04 14:49:06
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
          uploadPromises.push(
            ctx.service.cos
              .uploadFile(imageBuffer, imageKey, "", "")
              .then(url => {
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
      uploadPromises.push(
        ctx.service.cos.uploadFile(ImageBuffer, ImageKey, "", "").then(url => {
          console.log("COS返回的URL:", url); // 添加日志
          params.image = url;
        })
      );
    }
    return Promise.all(uploadPromises);
  }
}
module.exports = UpLoadImage;
