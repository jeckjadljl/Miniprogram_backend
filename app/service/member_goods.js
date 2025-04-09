/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-03-12 09:21:27
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-04-08 21:46:14
 * @FilePath: \Mini_program_backend\app\service\member_goods.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

const Service = require("egg").Service;

class Member_goodsService extends Service {
  async saveNew(params = {}) {
    const { app } = this;
    return await app.model.MemberGoods.saveNew(params);
  }

  async getGoodsByCardId(params = {}) {
    const { app } = this;
    return await app.model.MemberGoods.getGoodsByCardId(params);
  }

  async getMemberGoodsList(params = {}) {
    const { app, ctx } = this;
    const { Sequelize } = app;
    const memberGoods = await app.model.MemberGoods.getMemberGoodsList({
      ...params,
      memberGoodsAttributes: [
        "id",
        "member_packs_name",
        "member_packs_salePrice",
        "voucher_id",
        "voucher_name",
        "voucher_image",
        "voucher_type",
        "voucher_quantity",
        "points",
        "points_image",
        "points_deduction",
        "deduction_type",
        "goods_id",
        "name",
        "thumbnail",
        "unitName",
        "salePrice",
        "spec",
        "quantity",
        "member_goods_status",
        "orgUuid",
      ],
    });

    if (app._.isEmpty(memberGoods)) {
      ctx.throw(200, "查询不到会员兑换商品列表");
    }

    return memberGoods;
  }
}

module.exports = Member_goodsService;
