/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-07-05 17:18:37
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-08-10 22:44:36
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

  // 点赞/取消点赞功能
  async likePost(params = {}) {
    const { app, ctx } = this;
    const { user_id, post_id, user_name, avatar } = params;

    // 检查是否已点赞
    const existingLike = await app.model.Media.Like.findOne({
      where: { user_id, post_id },
    });

    // 获取帖子信息
    const post = await app.model.Posts.findByPk(post_id);
    if (!post) {
      ctx.throw(404, "帖子不存在");
    }

    // 如果是点赞操作且帖子作者不是当前用户，则触发点赞事件
    if (!existingLike && post.user_id !== user_id) {
      // 获取当前用户信息
      const user = await app.model.User.findByPk(user_id, {
        attributes: ["uuid", "user_name", "avatar"],
      });

      // 触发点赞事件
      app.emit("like", {
        user_id,
        post_id,
        post_author_id: post.user_id,
        user_info: user,
        timestamp: new Date(),
      });
    }

    if (existingLike) {
      // 取消点赞
      await existingLike.destroy();
      await app.model.Posts.decrement("likes", { where: { uuid: post_id } });
      return { liked: false };
    }
    // 创建点赞记录
    await app.model.Media.Like.create({ user_id, post_id, user_name, avatar });
    await app.model.Posts.increment("likes", { where: { uuid: post_id } });
    return { liked: true };
  }

  async commentPost(params = {}) {
    const { app, ctx } = this;
    const { user_id, post_id, content, user_name, avatar } = params;

    // 获取帖子信息
    const post = await app.model.Posts.findByPk(post_id);
    if (!post) {
      ctx.throw(404, "帖子不存在");
    }

    // 创建评论
    const comment = await app.model.Media.Comment.create({
      user_id,
      post_id,
      user_name,
      avatar,
      content,
    });

    // 更新帖子评论数
    await app.model.Posts.increment("comments", { where: { uuid: post_id } });

    // 如果评论者不是帖子作者，则触发评论事件
    if (post.user_id !== user_id) {
      // 获取当前用户信息
      const user = await app.model.User.findByPk(user_id, {
        attributes: ["uuid", "user_name", "avatar"],
      });

      // 触发评论事件
      app.emit("comment", {
        user_id,
        post_id,
        comment_id: comment.uuid,
        post_author_id: post.user_id,
        content,
        user_info: user,
        timestamp: new Date(),
      });
    }

    return comment;
  }

  async getCommentsByPostId(params = {}) {
    const { app, ctx } = this;
    const { post_id } = params;

    if (!post_id) {
      ctx.throw(400, "帖子ID不能为空");
    }

    // 验证帖子存在性
    const postExists = await app.model.Posts.findByPk(post_id);
    if (!postExists) {
      ctx.throw(404, "帖子不存在");
    }

    // 获取分页评论
    const result = await app.model.Media.Comment.getCommentsByPostId({
      ...params,
    });

    return result;
  }

  /**
   * 获取帖子的点赞和评论数量统计
   * @param {Object} params - 查询参数
   * @returns {Promise<Object>} 包含点赞数和评论数的对象
   */
  async getPostInteractionStats(params = {}) {
    const { app, ctx } = this;
    const { post_id } = params;

    // 验证参数
    if (!post_id) {
      ctx.throw(400, "帖子ID不能为空");
    }

    // 查询帖子统计信息
    const post = await app.model.Posts.findByPk(post_id, {
      attributes: ["likes", "comments"],
    });

    if (!post) {
      ctx.throw(404, "帖子不存在");
    }

    return {
      likeCount: post.likes || 0,
      commentCount: post.comments || 0,
    };
  }
}

module.exports = PostsService;
