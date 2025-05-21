/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-03-12 09:21:27
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-05-13 11:51:18
 * @FilePath: \Mini_program_backend\app\service\member_goods.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

const Service = require("egg").Service;

class Member_goodsService extends Service {
  async saveNew(params = {}) {
    const { app, ctx } = this;
    const { memberGoods, spec } = params;
    const { goods_id } = memberGoods;

    const mgId = await app.model.MemberGoods.saveNew(memberGoods);

    if (spec) {
      // 获取商品完整规格数据
      const fullSpecs = await ctx.service.goodsSpecifications.getByGoodsId({
        goods_id,
      });

      // 匹配前端传入的规格项
      for (const specItem of spec) {
        const targetSpec = fullSpecs.find(
          s =>
            s.specName === specItem.specName &&
            s.specValue === specItem.specValue
        );

        if (!targetSpec) {
          ctx.throw(
            400,
            `未找到匹配的规格项：${specItem.specName} - ${specItem.specValue}`
          );
        }

        await app.model.GoodsSpecifications.saveModify({
          spec_id: targetSpec.spec_id,
          goods_id,
          member_goods_id: mgId,
          point_spend: specItem.point_spend,
          cash_amount: specItem.cash_amount,
        });
      }
    }

    return mgId;
  }

  async saveModify(params = {}) {
    const { app } = this;
    const { memberGoods } = params;
    return await app.model.MemberGoods.saveModify(memberGoods);
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
        "point_spend",
        "cash_amount",
        "points_deduction",
        "points_rate",
        "deduction_type",
        "goods_id",
        "name",
        "thumbnail",
        "unitName",
        "salePrice",
        "spec",
        "quantity",
        "discount_type",
        "discount_tag",
        "member_goods_status",
        "orgUuid",
      ],
    });

    if (app._.isEmpty(memberGoods)) {
      ctx.throw(200, "查询不到会员兑换商品列表");
    }

    return memberGoods;
  }

  async getByPromotionName(params = {}) {
    const { app } = this;
    return await app.model.MemberGoods.getByPromotionName(params);
  }
}

module.exports = Member_goodsService;
