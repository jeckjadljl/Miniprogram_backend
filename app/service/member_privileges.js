/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-03-11 16:06:35
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-03-11 17:32:37
 * @FilePath: \Mini_program_backend\app\service\member_privileges.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

const Service = require("egg").Service;

class Member_privilegesService extends Service {
  async saveNew(params = {}) {
    const { app } = this;
    const result = await app.model.MemberPrivileges.saveNew(params);
    return result;
  }

  async getAll() {
    const { app } = this;
    const result = await app.model.MemberPrivileges.getAllPrivileges({
      attributes: [
        "uuid",
        "member_card_id",
        "permissions_id",
        "card_type",
        "privilege_name",
        "privilege_desc",
      ],
    });
    return result;
  }
}

module.exports = Member_privilegesService;
