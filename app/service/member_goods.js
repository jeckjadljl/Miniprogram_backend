/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-03-12 09:21:27
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-06-06 00:00:37
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

  // 验证兑换限制
  async validateExchange(params = {}) {
    const { memberGoodsId, userId } = params;
    const { app, ctx } = this;
    const memberGoods = await app.model.MemberGoods.findByPk(memberGoodsId);

    console.log(memberGoods);
    // 验证会员等级
    if (memberGoods.require_premium === true) {
      // 修正：添加 await 并处理空值情况
      const userRole = await app.model.UserRoles.getUserHighestRole(userId);
      if (userRole !== "premium") {
        const error = new Error("该商品需要城市合伙人权限才能兑换");
        error.name = "Permission_Limit";
        throw error;
      }
    }

    // 验证月度兑换限制
    if (memberGoods.deduction_type === "points") {
      const lastExchange = await app.model.Order.findOne({
        where: {
          user_id: userId,
          order_type: "points_exchange",
          // order_status: "completed", // 只统计已完成订单
        },
        order: [["createdTime", "DESC"]],
      });

      if (lastExchange) {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

        if (lastExchange.createdTime > oneMonthAgo) {
          const error = new Error("每月仅可兑换一次纯健康币商品");
          error.name = "Exchange_Time_Limit";
          throw error;
        }
      }
    }

    return true;
  }
}

module.exports = Member_goodsService;
