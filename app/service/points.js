/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-03-14 23:49:24
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-03-15 16:49:57
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
}

module.exports = PointsService;
