/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-07-31 11:05:58
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-08-04 15:30:06
 * @FilePath: \Mini_program_backend\app\controller\upload.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

const Controller = require("../core/base_controller");

class UploadController extends Controller {
  async upload() {
    const { ctx } = this;
    const stream = await ctx.getFileStream();
    const bucketType = stream.fields.bucketType || "default";

    try {
      const url = await ctx.service.upload.uploadImage({
        files: [stream],
        bucketType,
      });
      this.success(url[0]);
    } catch (e) {
      ctx.logger.error("上传失败", e);
      this.fail(500, "上传失败", e);
    }
  }

  // 上传小程序下载的图片
  async uploadWeImages() {
    const { ctx } = this;
    const { bucketType } = ctx.request.body;
    const file = ctx.request.files?.[0];

    try {
      const filePath = String(file.filepath);
      const upload = await ctx.service.upload.uploadWeImages({
        file: filePath,
        BucketType: bucketType,
      });
      this.success(upload);
    } catch (e) {
      ctx.logger.error("上传失败", e);
      this.fail(500, "上传失败", e);
    }
  }
}

module.exports = UploadController;
