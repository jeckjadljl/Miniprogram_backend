/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-03-11 15:37:09
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-03-11 15:44:32
 * @FilePath: \Mini_program_backend\app\service\permissions.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

const Service = require("egg").Service;

class PermissionsService extends Service {
  async saveNew(params = {}) {
    const { app } = this;
    const result = await app.model.Permissions.saveNew(params);
    return result;
  }
}

module.exports = PermissionsService;
