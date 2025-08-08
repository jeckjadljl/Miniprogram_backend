/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-08-06 12:23:14
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-08-06 15:22:05
 * @FilePath: \Mini_program_backend\app\service\member_goods_package.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

const Service = require("egg").Service;

class Member_goods_packageService extends Service {
  async saveNew(params = {}) {
    const { app, ctx } = this;
    const { user_id, userName, memberPackage } = params;
    const crateInfo = app.getCrateInfo(user_id, userName);
    const packageData = {
      ...memberPackage,
      ...crateInfo,
    };
    const result = await app.model.MemberGoodsPackage.saveNew(packageData);
    return result;
  }

  async getPackageByCardId(params = {}) {
    const { app, ctx } = this;
    const packageInfo = await app.model.MemberGoodsPackage.getPackageByCardId(
      params
    );
    return packageInfo;
  }
}
module.exports = Member_goods_packageService;
