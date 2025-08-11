/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-07-05 10:42:16
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-08-09 17:25:35
 * @FilePath: \Mini_program_backend\app\service\user_profile.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

const Service = require("egg").Service;

class User_profileService extends Service {
  async saveNew(params = {}) {
    const { ctx, app } = this;
    const result = await app.model.UserProfile.saveNew(params);
    return result;
  }

  // 新增获取或创建方法（用于用户访问时调用）
  async getOrCreateProfile(params = {}) {
    const { app } = this;
    const { user_id } = params;
    let profile = await app.model.UserProfile.findOne({
      where: { user_id },
    });

    if (!profile) {
      const user = await this.ctx.service.user.getUserByUuid(user_id);
      if (!user) {
        throw new Error("User not found");
      }
      profile = await this.saveNew({
        user_id,
        user_name: user.user_name,
        avatar: user.avatar,
      });
    }
    return profile;
  }

  async saveModify(params = {}) {
    const { ctx } = this;
    const result = await ctx.model.UserProfile.saveModify(params);
    return result;
  }

  // 完善关注/取消关注功能
  async followUser(params = {}) {
    const { app, ctx } = this;
    const { follower_id, following_id } = params;

    // 验证参数
    if (!follower_id || !following_id) {
      ctx.throw(400, "关注者和被关注者ID不能为空");
    }

    // 不能关注自己
    if (follower_id === following_id) {
      ctx.throw(400, "不能关注自己");
    }

    // 检查用户是否存在
    const [follower, following] = await Promise.all([
      app.model.User.findByPk(follower_id),
      app.model.User.findByPk(following_id),
    ]);

    if (!follower) {
      ctx.throw(404, "关注者不存在");
    }

    if (!following) {
      ctx.throw(404, "被关注者不存在");
    }

    // 检查是否已关注
    const existingFollow = await app.model.Follow.findOne({
      where: { follower_id, following_id },
    });

    try {
      if (existingFollow) {
        // 取消关注
        await existingFollow.destroy();

        // 发送取消关注事件
        app.emit("unfollow", {
          follower_id,
          following_id,
          timestamp: new Date(),
        });

        return { followed: false, message: "取消关注成功" };
      }
      // 创建关注记录
      const followRecord = await app.model.Follow.create({
        follower_id,
        following_id,
      });

      // 发送关注事件
      app.emit("follow", {
        follower_id,
        following_id,
        timestamp: new Date(),
        followRecord,
        follower_info: follower,
      });

      // 创建通知
      await app.model.Notification.create({
        user_id: following_id,
        type: "follow",
        content: `${follower.user_name}关注了你`,
        related_id: follower_id,
        is_read: false,
        avatar: follower.avatar,
      });

      return { followed: true, message: "关注成功", followRecord };
    } catch (error) {
      ctx.logger.error("关注操作失败:", error);
      ctx.throw(500, "关注操作失败，请重试");
    }
  }

  // 获取用户的关注列表
  async getFollowingList(params = {}) {
    const { app } = this;
    const { user_id, page = 1, limit = 20 } = params;

    const result = await app.model.Follow.findAndCountAll({
      where: { follower_id: user_id },
      include: [
        {
          model: app.model.User,
          as: "following",
          attributes: ["uuid", "user_name", "avatar", "signature"],
        },
      ],
      limit,
      offset: (page - 1) * limit,
      order: [["created_at", "DESC"]],
    });

    return {
      list: result.rows.map(item => item.following),
      total: result.count,
      page,
      limit,
    };
  }

  // 获取用户的粉丝列表
  async getFollowerList(params = {}) {
    const { app } = this;
    const { user_id, page = 1, limit = 20 } = params;

    const result = await app.model.Follow.findAndCountAll({
      where: { following_id: user_id },
      include: [
        {
          model: app.model.User,
          as: "follower",
          attributes: ["uuid", "user_name", "avatar", "signature"],
        },
      ],
      limit,
      offset: (page - 1) * limit,
      order: [["created_at", "DESC"]],
    });

    return {
      list: result.rows.map(item => item.follower),
      total: result.count,
      page,
      limit,
    };
  }

  // 检查是否已关注
  async isFollowing(params = {}) {
    const { app } = this;
    const { follower_id, following_id } = params;

    const follow = await app.model.Follow.findOne({
      where: { follower_id, following_id },
    });

    return !!follow;
  }
}

module.exports = User_profileService;
