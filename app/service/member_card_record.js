/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-03-17 10:25:34
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-03-27 17:53:48
 * @FilePath: \Mini_program_backend\app\service\member_card_record.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

const Service = require("egg").Service;
const fecha = require("fecha");

class Member_card_recordService extends Service {
  async saveNew(params = {}) {
    const { app } = this;
    const { user_id, membership_level } = params;

    const now = new Date();
    const endDate = new Date(now);
    endDate.setFullYear(now.getFullYear() + 1);

    const cardData = {
      ...params,
      status: "active",
      start_date: fecha.format(now, "YYYY-MM-DD HH:mm:ss"),
      end_date: fecha.format(endDate, "YYYY-MM-DD HH:mm:ss"),
    };

    await app.model.UserRoles.addMembershipRole(user_id, membership_level);
    const result = await app.model.MemberCardRecord.saveNew(cardData);
    return result;
  }

  async getAll(user_id) {
    const { app } = this;
    const result = await app.model.MemberCardRecord.getAll(user_id);
    return result;
  }
}

module.exports = Member_card_recordService;
