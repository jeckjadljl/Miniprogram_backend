"use strict";

const Service = require("egg").Service;

class NotificationService extends Service {
  /**
   * 创建通知
   * @param {Object} params - 通知参数
   * @returns {Promise<Object>} 创建的通知
   */
  async createNotification(params = {}) {
    const { app, ctx } = this;

    try {
      // 验证必要参数
      if (!params.user_id || !params.type || !params.content) {
        ctx.throw(400, "用户ID、通知类型和内容为必填项");
      }

      // 创建通知
      const notification = await app.model.Notification.create({
        user_id: params.user_id,
        type: params.type,
        title: params.title || this._getDefaultTitle(params.type),
        content: params.content,
        related_id: params.related_id,
        related_type: params.related_type,
        is_read: false,
        avatar: params.avatar,
      });

      // 触发通知事件(可用于WebSocket推送等)
      app.emit("notification.created", notification);

      return notification;
    } catch (error) {
      ctx.logger.error("创建通知失败:", error);
      throw error;
    }
  }

  /**
   * 获取用户通知列表
   * @param {Object} params - 查询参数
   * @returns {Promise<Object>} 通知列表和统计信息
   */
  async getUserNotifications(params = {}) {
    const { app } = this;
    const { user_id, page = 1, limit = 20, is_read, type } = params;

    // 构建查询条件
    const where = { user_id };
    if (is_read !== undefined) where.is_read = is_read;
    if (type) where.type = type;

    // 查询通知
    const result = await app.model.Notification.findAndCountAll({
      where,
      order: [["created_at", "DESC"]],
      limit,
      offset: (page - 1) * limit,
    });

    return {
      list: result.rows,
      total: result.count,
      page,
      limit,
      totalPages: Math.ceil(result.count / limit),
    };
  }

  /**
   * 标记通知为已读
   * @param {Object} params - 标记参数
   * @returns {Promise<number>} 影响的行数
   */
  async markAsRead(params = {}) {
    const { app, ctx } = this;
    const { user_id, notification_ids, all = false } = params;

    if (!user_id || (!notification_ids && !all)) {
      ctx.throw(400, "用户ID和通知ID列表或全部标记参数为必填项");
    }

    // 构建更新条件
    const where = { user_id, is_read: false };
    if (!all && notification_ids && notification_ids.length) {
      where.id = notification_ids;
    }

    // 更新通知状态
    const [updated] = await app.model.Notification.update(
      { is_read: true },
      { where }
    );

    return updated;
  }

  /**
   * 获取用户未读通知数量
   * @param {string} user_id - 用户ID
   * @returns {Promise<number>} 未读通知数量
   */
  async getUnreadCount(user_id) {
    const { app } = this;

    if (!user_id) {
      return 0;
    }

    return await app.model.Notification.count({
      where: { user_id, is_read: false },
    });
  }

  /**
   * 删除通知
   * @param {Object} params - 删除参数
   * @returns {Promise<number>} 影响的行数
   */
  async deleteNotification(params = {}) {
    const { app, ctx } = this;
    const { user_id, notification_id } = params;

    if (!user_id || !notification_id) {
      ctx.throw(400, "用户ID和通知ID为必填项");
    }

    return await app.model.Notification.destroy({
      where: { user_id, id: notification_id },
    });
  }

  /**
   * 获取通知默认标题
   * @param {string} type - 通知类型
   * @returns {string} 默认标题
   */
  _getDefaultTitle(type) {
    const titles = {
      follow: "新的关注",
      like: "内容被点赞",
      comment: "新的评论",
      system: "系统通知",
    };

    return titles[type] || "收到新通知";
  }
}

module.exports = NotificationService;
