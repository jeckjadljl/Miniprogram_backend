/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-08-09 16:38:23
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-08-09 17:29:03
 * @FilePath: \Mini_program_backend\app\listener\followEvent.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
module.exports = app => {
  // 监听关注事件
  app.on("follow", async data => {
    const { follower_id, following_id, follower_info } = data;
    app.logger.info(`用户 ${follower_id} 关注了用户 ${following_id}`);

    // 可以在这里添加额外逻辑，如：
    // 1. 更新用户关注数统计
    // 2. 推送实时通知
    // 3. 生成动态
    try {
      // 获取关注者信息
      const follower =
        follower_info ||
        (await app.model.User.findByPk(follower_id, {
          attributes: ["uuid", "user_name", "avatar"],
        }));

      // 创建关注通知
      await app.service.notification.createNotification({
        user_id: following_id,
        type: "follow",
        title: "新的关注",
        content: `${follower.user_name}关注了你`,
        related_id: follower_id,
        related_type: "user",
        avatar: follower.avatar,
      });

      // TODO: 可以添加WebSocket推送逻辑
    } catch (error) {
      app.logger.error("处理关注通知失败:", error);
    }
  });

  // 监听点赞事件
  app.on("like", async data => {
    const { user_id, post_id, post_author_id, user_info } = data;
    app.logger.info(`用户 ${user_id} 点赞了帖子 ${post_id}`);

    try {
      // 获取点赞用户信息
      const user =
        user_info ||
        (await app.model.User.findByPk(user_id, {
          attributes: ["uuid", "user_name", "avatar"],
        }));

      // 创建点赞通知
      await app.service.notification.createNotification({
        user_id: post_author_id,
        type: "like",
        title: "内容被点赞",
        content: `${user.user_name}点赞了你的帖子`,
        related_id: post_id,
        related_type: "post",
        avatar: user.avatar,
      });
    } catch (error) {
      app.logger.error("处理点赞通知失败:", error);
    }
  });

  // 监听评论事件
  app.on("comment", async data => {
    const { user_id, post_id, comment_id, post_author_id, content, user_info } =
      data;
    app.logger.info(`用户 ${user_id} 评论了帖子 ${post_id}`);

    try {
      // 获取评论用户信息
      const user =
        user_info ||
        (await app.model.User.findByPk(user_id, {
          attributes: ["uuid", "user_name", "avatar"],
        }));

      // 创建评论通知
      await app.service.notification.createNotification({
        user_id: post_author_id,
        type: "comment",
        title: "新的评论",
        content: `${user.user_name}: ${content.substring(0, 20)}${
          content.length > 20 ? "..." : ""
        }`,
        related_id: comment_id,
        related_type: "comment",
        avatar: user.avatar,
      });
    } catch (error) {
      app.logger.error("处理评论通知失败:", error);
    }
  });

  // 监听通知创建事件(用于实时推送)
  app.on("notification.created", async notification => {
    // 这里可以添加WebSocket推送逻辑
    // 例如: app.ws.sendToUser(notification.user_id, { type: 'notification', data: notification });
    app.logger.info(
      `通知已创建: ${notification.id}, 用户: ${notification.user_id}`
    );
  });

  // 监听取消关注事件
  app.on("unfollow", async data => {
    const { follower_id, following_id } = data;
    app.logger.info(`用户 ${follower_id} 取消关注了用户 ${following_id}`);

    // 可以在这里添加额外逻辑
  });
};
