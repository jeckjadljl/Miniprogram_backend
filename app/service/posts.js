/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-07-05 17:18:37
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-07-09 22:05:32
 * @FilePath: \Mini_program_backend\app\service\posts.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

const Service = require("egg").Service;
const fs = require("fs");
const path = require("path");
const UpLoadImage = require("../utils/uploadImage");

class PostsService extends Service {
  async saveNew(params = {}) {
    const { ctx, app } = this;
    try {
      const uploadPromises = [];
      const mediaTypeCount = { image: 0, video: 0 };

      // 新增多媒体处理逻辑
      if (params.media && params.media.length > 0) {
        const mediaList = [];

        for (const item of params.media) {
          const ext = path.extname(item).toLowerCase();
          const isVideo = [".mp4", ".mov", ".avi"].includes(ext);

          if (fs.existsSync(item)) {
            const fileBuffer = fs.readFileSync(item);

            // 视频使用分块上传逻辑
            if (isVideo) {
              uploadPromises.push(
                ctx.service.video
                  .uploadVideo(fileBuffer, path.basename(item), "PostsVideo")
                  .then(({ videoUrl }) => {
                    mediaList.push(videoUrl);
                    mediaTypeCount.video++;
                  })
              );
            } else {
              const md5 = await ctx.service.cos.getBufferMD5(fileBuffer);
              const key = `PostsImages/${md5}_${Date.now()}${path.extname(
                item
              )}`;
              uploadPromises.push(
                ctx.service.cos.uploadFile(fileBuffer, key).then(url => {
                  mediaList.push(url);
                  mediaTypeCount.image++;
                })
              );
            }
          }
        }

        await Promise.all(uploadPromises);
        params.media = mediaList;

        // 自动设置帖子类型
        params.post_type =
          mediaTypeCount.image && mediaTypeCount.video
            ? "mixed"
            : mediaTypeCount.video
            ? "video"
            : "image";
      }

      return await app.model.Posts.saveNew(params);
    } catch (e) {
      ctx.logger.error("帖子创建失败:", e);
      return null;
    }
  }

  async getPostsByUserId(params = {}) {
    const { app } = this;

    const posts = await app.model.Posts.getUserPosts({
      ...params,
      postsAttributes: [
        "uuid",
        "user_id",
        "user_name",
        "avatar",
        "posts_title",
        "post_content",
        "media",
        "likes",
        "comments",
        "shares",
        "createdTime",
        "post_type",
      ],
    });

    return posts;
  }

  async getWaterfullPostsList(params = {}) {
    const { app, ctx } = this;

    const posts = await app.model.Posts.getWaterfullPostsList({
      ...params,
      postsAttributes: [
        "uuid",
        "user_id",
        "user_name",
        "avatar",
        "posts_title",
        "post_content",
        "cover",
        "media",
        "likes",
        "comments",
        "post_type",
      ],
    });

    if (app._.isEmpty(posts)) {
      ctx.throw(200, "暂无可用的帖子");
    }

    return posts;
  }

  async getVideoFeedList() {
    const { app, ctx } = this;

    const posts = await app.model.Posts.getVideoFeedList({
      postsAttributes: [
        "uuid",
        "user_id",
        "user_name",
        "avatar",
        "posts_title",
        "post_content",
        "cover",
        "media",
        "likes",
        "comments",
        "shares",
        "post_type",
        "createdTime",
      ],
    });

    return posts;
  }

  async saveModify(params = {}) {
    const { ctx, app } = this;
    try {
      const { posts_id, user_id, ...updateData } = params;

      const uploadPromises = [];
      const mediaTypeCount = { image: 0, video: 0 };

      // 新增封面图片处理
      if (updateData.cover) {
        const uploadImage = new UpLoadImage(ctx);
        const image = await uploadImage.uploadImage({
          image: updateData.cover,
          BucketType: "PostsImages", // 指定封面存储路径
        });
        updateData.cover = image;
      }

      // 处理媒体更新（复用新建时的上传逻辑）
      if (updateData.media && updateData.media.length > 0) {
        const mediaList = [];
        for (const item of params.media) {
          const ext = path.extname(item).toLowerCase();
          const isVideo = [".mp4", ".mov", ".avi"].includes(ext);

          if (fs.existsSync(item)) {
            const fileBuffer = fs.readFileSync(item);

            // 视频使用分块上传逻辑
            if (isVideo) {
              uploadPromises.push(
                ctx.service.video
                  .uploadVideo(fileBuffer, path.basename(item), "PostsVideo")
                  .then(({ videoUrl }) => {
                    mediaList.push(videoUrl);
                    mediaTypeCount.video++;
                  })
              );
            } else {
              const md5 = await ctx.service.cos.getBufferMD5(fileBuffer);
              const key = `PostsImages/${md5}_${Date.now()}${path.extname(
                item
              )}`;
              uploadPromises.push(
                ctx.service.cos.uploadFile(fileBuffer, key).then(url => {
                  mediaList.push(url);
                  mediaTypeCount.image++;
                })
              );
            }
          }
        }

        await Promise.all(uploadPromises);
        params.media = mediaList;

        // 自动设置帖子类型
        params.post_type =
          mediaTypeCount.image && mediaTypeCount.video
            ? "mixed"
            : mediaTypeCount.video
            ? "video"
            : "image";
      }

      return await app.model.Posts.saveModify({
        posts_id,
        user_id,
        updateData,
      });
    } catch (e) {
      ctx.logger.error("帖子修改失败:", e);
      return null;
    }
  }
}

module.exports = PostsService;
