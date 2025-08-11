/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-07-06 11:54:12
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-08-10 17:47:20
 * @FilePath: \Mini_program_backend\app\controller\posts.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

const Controller = require("../core/base_controller");

class PostsController extends Controller {
  async saveNew() {
    const { ctx } = this;
    const params = ctx.request.body;
    const result = await ctx.service.posts.saveNew(params);
    this.success(result);
  }

  async getPostsByUserId() {
    const { ctx } = this;
    const params = ctx.request.body;
    const posts = await ctx.service.posts.getPostsByUserId(params);
    this.success(posts);
  }

  async getWaterfullPostsList() {
    const { ctx } = this;
    const params = ctx.request.body;
    const posts = await ctx.service.posts.getWaterfullPostsList(params);
    this.success(posts);
  }

  async getVideoFeedList() {
    const { ctx } = this;
    const params = ctx.request.body;
    const posts = await ctx.service.posts.getVideoFeedList(params);
    this.success(posts);
  }

  async saveModify() {
    const { ctx } = this;
    const params = ctx.request.body;

    try {
      const result = await ctx.service.posts.saveModify(params);
      this.success(result);
    } catch (error) {
      this.fail(error.message);
    }
  }

  async likePost() {
    const { ctx } = this;
    const params = ctx.request.body;
    const result = await ctx.service.posts.likePost(params);
    this.success(result);
  }

  async commentPost() {
    const { ctx } = this;
    const params = ctx.request.body;
    const result = await ctx.service.posts.commentPost(params);
    this.success(result);
  }

  async getCommentsByPostId() {
    const { ctx } = this;
    const params = ctx.request.body;
    const result = await ctx.service.posts.getCommentsByPostId(params);
    this.success(result);
  }

  async getPostInteractionStats() {
    const { ctx } = this;
    const params = ctx.request.body;
    const result = await ctx.service.posts.getPostInteractionStats(params);
    this.success(result);
  }
}

module.exports = PostsController;
