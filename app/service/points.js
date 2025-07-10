/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-03-14 23:49:24
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-06-29 17:39:49
 * @FilePath: \Mini_program_backend\app\service\points.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

const Service = require("egg").Service;

class PointsService extends Service {
  async saveNew(params = {}) {
    const { app } = this;
    const { Points, User } = app.model;
    const { user_id, points } = params;
    const current_balance = await User.addPoints(user_id, points);

    const result = await Points.add({
      ...params,
      current_balance,
    });
    return result;
  }

  async subtract(params = {}) {
    const { app } = this;
    const { Points, User } = app.model;
    const { user_id, points } = params;
    const current_balance = await User.subtractPoints(user_id, points);

    const result = await Points.subtract({
      ...params,
      current_balance,
    });

    return result;
  }

  async getPointsByReferral(params = {}) {
    const { app } = this;
    const { Points } = app.model;
    const result = await Points.getPointsByReferral({
      user_id: params.referrer_id,
      source: "referral",
      source_id: params.referred_user_id,
    });
    return result;
  }

  async CheckForAvailable(params = {}) {
    const { app } = this;
    const { Order } = app.model;
    const { user_id } = params;
    // 查询用户累计消费金额
    const totalConsumption = await Order.sum("payment_amount", {
      where: { user_id },
    });

    return totalConsumption.toFixed(2) >= 50; // 直接返回金额是否达标
  }

  // 新增健康币检查方法
  async checkUserPoints(userId, requiredPoints) {
    const { app } = this;
    const { User, Points } = app.model;
    const user = await User.findOne({ where: { uuid: userId } });

    if (!user) {
      const error = new Error("用户不存在");
      error.name = "UserNotFound";
      throw error;
    }

    const userPoints = Number(user.consumption_points);
    const required = Number(requiredPoints);

    console.log(typeof user.consumption_points, typeof requiredPoints);
    console.log(Number(user.consumption_points), Number(requiredPoints));

    return Number(userPoints.toFixed(2)) >= Number(required.toFixed(2));
  }
}

module.exports = PointsService;
