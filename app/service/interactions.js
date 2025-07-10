/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-07-05 17:11:45
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-07-05 17:18:08
 * @FilePath: \Mini_program_backend\app\service\interactions.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

const Service = require("egg").Service;

class InteractionsService extends Service {
  async saveNew() {
    const { ctx, app } = this;
    const result = await app.model.Interactions.saveNew(ctx.request.body);
    return result;
  }

  async getInteractionsForReplyType(params = {}) {
    const { app } = this;
    const { reply_type, user_profile_id } = params;

    const { count, rows } = await app.model.Interactions.findAndCountAll({
      where: { reply_type, user_profile_id },
    });
    return {
      count,
      rows,
    };
  }
}

module.exports = InteractionsService;
