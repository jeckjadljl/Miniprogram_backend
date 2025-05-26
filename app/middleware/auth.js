/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-11-03 11:54:16
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-05-27 00:02:44
 * @FilePath: \Mini_program_backend\app\middleware\auth.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
// app/middleware/auth.js

module.exports = options => {
  return async function auth(ctx, next) {
    const authHeader = ctx.request.header.authorization;

    // 判断是否为登录或刷新 token 的接口，如果是，直接放行
    const exemptRoutes = [
      "/login",
      "/login/test",
      "/login/getOpenId",
      "/common/login",
      "/auth/refreshToken",
      "/auth/refreshAdminToken",
      "/",
      "/goods/getGoodsWithCategory",
      "/goods/getGoodsList",
      "/goods/getGoodsById",
      "/goodsCategory/getAll",
      "/referral/getReferrer",
      "/referral/getReferred",
      "/referral/saveNew",
      "/user/uploadAvatar",
      "/user/getUserByUuid",
      "/elements/saveNew",
      "/elements/getAll",
      "/elements/get",
      "/posters/saveNew",
      "/posters/saveModify",
      "/goodsCategory/saveModify",
      "/payments/createOrder",
      "/order/createBill",
      "/merchant/register",
      "/goods/query",
      "/goods/saveNew",
      "/goodsCategory/saveNew",
      "/goods/saveModify",
      "/goods/get",
      "/bill/order/get",
      "/member/test/saveNew",
      "/membership/saveNew",
      "/membership/getAll",
      "/permissions/saveNew",
      "/memberPrivileges/saveNew",
      "/memberPrivileges/getAll",
      "/memberGoods/getGoodsByCardId",
      "/memberGoods/saveNew",
      "/user/getUserByName",
      "/voucher_rules/saveNew",
      "/notice/wechatPayCallback",
      "/bill/order/query",
      "/posters/getHomeCarousel",
      "/address/saveNewAddress",
      "/address/saveModifyAddress",
      "/referral/getRefererCount",
      "/membership/upgradeMembershipLevel",
      "/payments/queryOrder",
      "/notice/saveNewForWeapp",
      "/notice/getNotice",
      "/notice/getNoticeByElementsId",
      "/memberGoods/getMemberGoodsList",
      "/goodsSpecifications/saveNew",
      "/goodsSpecifications/saveModify",
      "/memberGoods/getByPromotionName",
      "/promotion/saveNew",
      "/memberGoods/saveModify",
      "/cart/getCartList",
      "/video/saveNew",
      "/video/getVideoList",
      "/video/saveLikes",
      "/promotion/getAll",
      "/logistics/saveNew",
      "/logistics/updateWaybillToken",
      "/cart/getCombinedCartList",
      "/memberCart/addGoodsToCart",
      "/promotion/getByActivityType",
      "/goodsPromotion/saveNew",
      "/goodsSpecColor/saveNew",
      "/goodsSpecColor/saveModify",
      "/goodsPricing/saveNew",
      "/goodsPricing/getGoodsPricingById",
      "/group/saveNew",
      "/order/getUserOrders",
      "/promotion/saveModify",
      "/memberGoods/validateExchange",
    ];
    if (exemptRoutes.includes(ctx.path)) {
      await next();
      return;
    }

    if (!authHeader) {
      ctx.status = 400;
      ctx.body = { message: "Access Token not provided" };
      return;
    }

    // 使用正则表达式匹配Bearer token并提取其中的token值
    const token = authHeader.replace(/^Bearer\s+/i, "");

    try {
      // 验证 Access Token（JWT 自带有效期）
      const decoded = await ctx.service.jwt.verifyToken(token);
      if (!decoded) {
        ctx.status = 401;
        ctx.body = { message: "Invalid access token" };
        return;
      }

      const session_key = await ctx.service.redis.get(decoded.uid, "token");
      if (!session_key) {
        ctx.status = 401;
        ctx.body = { message: "Session expired, please log in again." };
        return;
      }

      // 续签 Access Token（如果即将过期）
      const now = Math.floor(Date.now() / 1000);

      if (decoded.exp - now < 10 * 60) {
        // 10分钟内过期，刷新token
        const newToken = await ctx.service.jwt.refreshAccessToken(
          decoded.uid,
          "token"
        );
        ctx.set("new-access-token", newToken); // 设置响应头
      }

      // 将用户信息附加到上下文
      ctx.state.user = decoded;
      await next();
    } catch (err) {
      ctx.status = 401;
      ctx.body = { message: "Unauthorized", error: err.message };
    }
  };
};
