/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-03-14 23:49:24
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-04-26 17:22:11
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

    return totalConsumption >= 50; // 直接返回金额是否达标
  }
}

module.exports = PointsService;
