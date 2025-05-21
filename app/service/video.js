/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-04-22 23:27:45
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-04-25 18:15:05
 * @FilePath: \Mini_program_backend\app\service\video.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

const Service = require("egg").Service;
const fs = require("fs");
const path = require("path");

class VideoService extends Service {
  async saveNew(params = {}) {
    const { app, ctx } = this;
    const { video, user_id, userName, orgUuid } = params;
    try {
      const crateInfo = app.getCrateInfo(user_id, userName);
      const uploadPromises = [];

      // 添加本地文件处理逻辑
      if (video.videoUrl) {
        const fileBuffer = fs.readFileSync(video.videoUrl);
        const { videoUrl } = await this.uploadVideo(
          fileBuffer,
          path.basename(video.videoUrl)
        );
        video.videoUrl = videoUrl; // 替换为 COS 中的存储路径
      }

      if (video.thumbnail && fs.existsSync(video.thumbnail)) {
        const thumbnailBuffer = fs.readFileSync(video.thumbnail); // 读取本地文件
        const md5 = await ctx.service.cos.getBufferMD5(thumbnailBuffer);
        const thumbnailKey = `thumbnail/${md5}_${path.basename(
          video.thumbnail
        )}`; // 存储路径
        uploadPromises.push(
          ctx.service.cos
            .uploadFile(thumbnailBuffer, thumbnailKey, "", "")
            .then(url => {
              console.log("COS返回的URL:", url); // 添加日志
              video.thumbnail = url;
            })
        );
      }

      // 等待所有上传完成
      await Promise.all(uploadPromises);

      const videoData = {
        ...video,
        ...crateInfo,
        orgUuid,
      };
      return await app.model.Video.saveNew(videoData);
    } catch (e) {
      this.ctx.logger.error("视频存储失败:", e);
      return null;
    }
  }

  /**
   * 上传视频到COS并保存记录
   * @param {Buffer} fileInput - 视频文件Buffer
   * @param {String} fileName - 原始文件名
   * @param {String} prefix - COS存储路径前缀
   */
  async uploadVideo(fileInput, fileName, prefix = "WXvideo") {
    try {
      const { cos } = this.ctx.service;

      // 新增文件路径处理逻辑
      let videoBuffer;
      if (typeof fileInput === "string") {
        if (!fs.existsSync(fileInput)) {
          throw new Error("视频文件不存在");
        }
        videoBuffer = fs.readFileSync(fileInput);
        fileName = fileName || path.basename(fileInput);
      } else {
        videoBuffer = fileInput;
      }

      // 根据文件大小自动选择上传方式（10MB为阈值）
      const maxDirectUploadSize = 10 * 1024 * 1024;
      let videoUrl;

      if (videoBuffer.length > maxDirectUploadSize) {
        // 大文件使用分块上传
        const key = `${prefix}/${crypto
          .createHash("md5")
          .update(videoBuffer)
          .digest("hex")}-${Date.now()}${path.extname(fileName)}`;
        videoUrl = await cos.multipartUpload(videoBuffer, key);
      } else {
        // 小文件直接上传（复用goods.js的上传逻辑）
        const key = `${prefix}/${path.basename(
          fileName,
          path.extname(fileName)
        )}-${Date.now()}${path.extname(fileName)}`;
        videoUrl = await cos.uploadFile(videoBuffer, key);
      }

      console.log("COS返回的URL:", videoUrl); // 添加日志
      return {
        videoUrl,
        size: videoBuffer.length,
      };
    } catch (e) {
      this.ctx.logger.error("视频上传失败:", e);
      throw new Error(`视频上传失败: ${e.message}`);
    }
  }

  async getVideoList(params = {}) {
    const { app, ctx } = this;
    try {
      const videoList = await app.model.Video.getVideoList(params);
      return videoList;
    } catch (e) {
      this.ctx.logger.error("获取视频列表失败:", e);
    }
  }

  async saveLikes(parmas = {}) {
    const { app, ctx } = this;
    const result = await app.model.Video.saveLikes(parmas);
    return result;
  }
}

module.exports = VideoService;
