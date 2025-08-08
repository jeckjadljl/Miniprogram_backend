/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-07-31 11:07:07
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-08-03 16:41:22
 * @FilePath: \Mini_program_backend\app\service\upload.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

const Service = require("egg").Service;
const path = require("path");
// const fs = require("fs");
// const pump = require("mz-modules/pump");
const UpLoadImage = require("../utils/uploadImage");

class UploadService extends Service {
  async uploadToCos(fileStream, bucketType) {
    const { ctx } = this;

    // 1. 读取文件流
    const chunks = [];
    let size = 0;

    fileStream.on("data", chunk => {
      chunks.push(chunk);
      size += chunk.length;
    });

    const buffer = await new Promise(resolve => {
      fileStream.on("end", () => resolve(Buffer.concat(chunks, size)));
    });

    // 2. 计算MD5并上传
    const md5 = await ctx.service.cos.getBufferMD5(buffer);
    const ext = path.extname(fileStream.filename).toLowerCase();
    const fileName = `${md5}${ext}`;
    const key = `${bucketType}/${fileName}`;

    return ctx.service.cos.uploadFile(buffer, key, "", "");
  }

  // 新的通用上传方法
  async uploadImage(params) {
    const { files = [], bucketType } = params;
    const results = [];

    for (const file of files) {
      if (!file || !file.filename) continue;

      // 处理单文件
      const url = await this.uploadToCos(file, bucketType);
      results.push(url);
    }

    return results;
  }

  async uploadWeImages(params = {}) {
    const { file, BucketType } = params;
    const { ctx } = this;

    const image = new UpLoadImage(ctx);
    const upload = await image.uploadImage({
      image: file,
      BucketType,
    });

    return upload[0];
  }
}

module.exports = UploadService;
