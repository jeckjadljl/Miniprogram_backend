/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-08-06 15:27:54
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-08-06 15:34:21
 * @FilePath: \Mini_program_backend\app\service\member_goods_package_item.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

const Service = require("egg").Service;

class Member_goods_package_itemService extends Service {
  async saveNew(params = {}) {
    const { app, ctx } = this;
    const { user_id, userName, memberPackageItem } = params;
    const crateInfo = app.getCrateInfo(user_id, userName);
    const packageItemData = {
      ...memberPackageItem,
      ...crateInfo,
      user_id,
      user_name: userName,
    };
    const result = await app.model.MemberGoodsPackageItem.saveNew(
      packageItemData
    );
    return result;
  }
}

module.exports = Member_goods_package_itemService;
