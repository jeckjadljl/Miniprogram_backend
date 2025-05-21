/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-10-16 17:44:22
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-05-21 00:20:13
 * @FilePath: \Mini_program_backend\app\router.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  const {
    home,
    login,
    user,
    cart,
    memberCart,
    goods,
    order,
    address,
    goodsCategory,
    merchant,
    common,
    notice,
    deliveryTimeType,
    freightPlan,
    referral,
    auth,
    elements,
    posters,
    payments,
    membership,
    permissions,
    memberPrivileges,
    memberGoods,
    voucherRules,
    vouchers,
    points,
    goodsSpecifications,
    promotion,
    video,
    logistics,
    goodsPromotion,
    goodsPricing,
    groups,
  } = controller;

  router.get("/", home.index);

  // 测试创建会员卡
  // router.post("/member/test/saveNew", membership.saveNew);
  router.post(
    "/membership/upgradeMembershipLevel",
    membership.upgradeMembershipLevel
  );

  /**
   * 微信小程序
   */

  // 登录
  router.post("/login", login.login);
  router.post("/login/test", login.testlogin);
  router.post("/login/getOpenId", login.getOpenId);

  // 上传用户头像
  router.post("/user/uploadAvatar", user.uploadAvatar);
  // 获取用户数据
  router.post("/user/getUserByUuid", user.getUserByUuid);
  // 更新用户信息
  router.post("/user/saveModify", user.saveModify);
  // 获取管理员用户(暂用)
  router.post("/user/getUserByName", user.getUserByName);

  // 刷新Token
  router.post("/auth/refreshToken", auth.refreshAccessToken);

  // 购物车
  router.post("/cart/addGoodsToCart", cart.addGoodsToCart);
  router.post("/cart/updateSpec", cart.updateSpec);
  router.post("/cart/removeGoodsFromCart", cart.removeGoodsFromCart);
  router.post("/cart/decrementGoodsQuantity", cart.decrementGoodsQuantity);
  router.post("/cart/getCartList", cart.getCartList);
  router.post("/cart/clearCart", cart.clearCart);
  router.post("/cart/getCombinedCartList", cart.getCombinedCartList);

  // 会员商品购物车
  router.post("/memberCart/addGoodsToCart", memberCart.addGoodsToCart);
  router.post("/memberCart/updateSpec", memberCart.updateSpec);
  router.post(
    "/memberCart/removeGoodsFromCart",
    memberCart.removeGoodsFromCart
  );
  router.post("/memberCart/getCartList", memberCart.getCartList);

  // 商品数据
  router.post("/goods/getGoodsWithCategory", goods.getGoodsWithCategory);
  router.post("/goods/getGoodsList", goods.getGoodsList);
  router.post("/goods/getGoodsById", goods.getGoodsById);

  // 商品类别
  router.get("/goodsCategory/getAll", goodsCategory.getAll);

  // 订单操作
  router.post("/order/queryOrderBill", order.queryOrderBill);
  router.post("/order/getOrderBill", order.getOrderBill);
  router.post("/order/createBill", order.createBill);
  router.post("/order/cancelBill", order.cancelBill);
  router.post("/order/auditBill", order.auditBill);
  router.post("/order/completeBill", order.completeBill);
  router.post("/order/getUserOrders", order.getUserOrders);
  router.get("/order/getOrderDetails", order.getOrderDetails);

  // 地址设置
  router.get("/address/getAddress", address.getAddress);
  router.post("/address/getDefaultAddress", address.getDefaultAddress);
  router.post("/address/setDefaultAddress", address.setDefaultAddress);
  router.post("/address/deleteAddress", address.deleteAddress);
  router.post("/address/getAddressList", address.getAddressList);
  router.post("/address/saveNewAddress", address.saveNewAddress);
  router.post("/address/saveModifyAddress", address.saveModifyAddress);

  // 微信小程序消息通知栏
  router.post("/notice/saveNewForWeapp", notice.saveNewForWeapp);
  router.post("/notice/getNotice", notice.getNotice);
  router.post("/notice/getNoticeByElementsId", notice.getNoticeByElementsId);

  // 小程序推广码
  router.post("/referral/getCode", referral.getCode);
  router.post("/referral/updataQRCode", referral.updataQRCode);

  // 获取推荐人数
  router.post("/referral/getRefererCount", referral.getRefererCount);

  // 查询推荐人ID
  router.post("/referral/getReferrer", referral.getReferrer);

  // 查询被推荐人信息
  router.post("/referral/getReferred", referral.getReferred);

  // 绑定推荐关系
  router.post("/referral/saveNew", referral.saveNew);

  // 健康四要素
  router.post("/elements/saveNew", elements.saveNew);
  router.get("/elements/getAll", elements.getAll);
  router.post("/elements/get", elements.get);

  // 获取促销板块
  router.get("/promotion/getAll", promotion.getAll);
  router.post("/promotion/getByActivityType", promotion.getByActivityType);

  // 获取视频列表
  router.post("/video/getVideoList", video.getVideoList);
  router.post("/video/saveLikes", video.saveLikes);

  // 上传海报
  router.post("/posters/saveNew", posters.saveNew);
  router.post("/posters/saveModify", posters.saveModify);

  // 获取主页海报（轮播图）
  router.get("/posters/getHomeCarousel", posters.getHomeCarousel);

  // 微信支付(调起支付)
  router.post("/payments/createPayment", payments.createPayment);
  // 继续支付
  router.post("/payments/continuePayment", payments.continuePayment);
  // 微信支付回调消息
  router.post("/notice/wechatPayCallback", notice.wechatPayCallback);
  // 微信支付订单号查询订单
  router.post("/payments/queryOrder", payments.getOrderStatus);
  // 支付统一调起流程（试验中）
  router.post("/payments/paymentsOrderQuery", payments.paymentsOrderQuery);
  // 获取未支付的记录
  router.post("/payments/getUnpaid", payments.getUnpaid);

  // 获取会员卡数据
  router.get("/membership/getAll", membership.getAll);
  router.post("/membership/getAllMemberCard", membership.getAllMemberCard);
  router.get("/memberPrivileges/getAll", memberPrivileges.getAll);

  // 会员商品
  router.post("/memberGoods/getGoodsByCardId", memberGoods.getGoodsByCardId);
  router.post(
    "/memberGoods/getMemberGoodsList",
    memberGoods.getMemberGoodsList
  );
  router.post(
    "/memberGoods/getByPromotionName",
    memberGoods.getByPromotionName
  );
  // 获取用户会员等级
  router.post("/membership/getMembershipLevel", membership.getMembershipLevel);

  // 检查用户是否能够使用健康币
  router.post("/points/checkForAvailable", points.checkForAvailable);

  // 团购
  router.post("/group/saveNew", groups.createGroup);
  router.post("/group/getGroupStatus", groups.getGroupStatus);
  router.post("/group/joinGroup", groups.joinGroup);

  /**
   * 暂时无用
   */
  // 用户获取抵用券
  router.post("/vouchers/saveNew", vouchers.saveNew);
  // 获取健康币
  router.post("/points/saveNew", points.saveNew);
  // 新增会员卡记录
  router.post("/memberCardRecord/saveNew", membership.saveMemberCardRecord);

  /**
   * 管理端
   */
  router.post("/auth/refreshAdminToken", auth.refreshAdminToken);

  router.post("/common/login", common.login);
  router.post("/common/savePasswordModify", common.savePasswordModify);
  router.post("/common/logout", common.logout);

  // 消息通知
  router.post("/notice/readAll", notice.readAll);
  router.get("/notice/overview", notice.overview);
  router.post("/notice/query", notice.query);

  // 会员卡
  router.post("/membership/saveNew", membership.memberCard);

  // 权益&权限
  router.post("/permissions/saveNew", permissions.saveNew);
  router.post("/memberPrivileges/saveNew", memberPrivileges.saveNew);

  // 会员卡/会员商品
  router.post("/memberGoods/saveNew", memberGoods.saveNew);
  router.post("/memberGoods/saveModify", memberGoods.saveModify);

  // 抵用券
  router.post("/voucher_rules/saveNew", voucherRules.saveNew);

  // 促销活动
  router.post("/promotion/saveNew", promotion.saveNew);
  router.post("/promotion/saveModify", promotion.saveModify);

  // 视频
  router.post("/video/saveNew", video.saveNew);

  // 添加运单号
  router.post("/logistics/saveNew", logistics.saveNew);
  router.post("/logistics/updateWaybillToken", logistics.updateWaybillToken);

  // 添加会员商品到对应活动中
  router.post("/goodsPromotion/saveNew", goodsPromotion.saveNew);

  /**
   * 管理端-管理员
   */

  router.post("/merchant/saveNew", merchant.saveNew);
  router.post("/merchant/saveModify", merchant.saveModify);
  router.post("/merchant/query", merchant.query);
  router.get("/merchant/get", merchant.get);

  /**
   * 管理端-商家
   */

  router.post("/merchant/register", common.merchantRegister);

  // 订货单
  router.post("/bill/order/query", order.query);
  router.post("/bill/order/get", order.get);
  router.post("/bill/order/dispatch", order.dispatch);
  router.post("/bill/order/complete", order.complete);

  // 商品类别
  router.post("/goodsCategory/saveNew", goodsCategory.saveNew);
  router.post("/goodsCategory/saveModify", goodsCategory.saveModify);
  router.post("/goodsCategory/remove", goodsCategory.remove);
  router.post("/goodsCategory/query", goodsCategory.query);
  router.get("/goodsCategory/getDropdownList", goodsCategory.getDropdownList);
  router.get("/goodsCategory/get", goodsCategory.get);

  // 商品
  router.post("/goods/saveNew", goods.saveNew);
  router.post("/goods/saveModify", goods.saveModify);
  router.post("/goods/up", goods.up);
  router.post("/goods/down", goods.down);
  router.post("/goods/query", goods.query);
  router.post("/goods/get", goods.get);

  // 商品规格
  router.post("/goodsSpecifications/saveNew", goodsSpecifications.saveNew);
  router.post(
    "/goodsSpecifications/saveModify",
    goodsSpecifications.saveModify
  );

  // 商品规格颜色
  router.post("/goodsSpecColor/saveNew", goodsSpecifications.saveNewColor);
  router.post(
    "/goodsSpecColor/saveModify",
    goodsSpecifications.saveModifyColor
  );

  // 商品对应数量的价格管理
  router.post("/goodsPricing/saveNew", goodsPricing.saveNew);
  router.post(
    "/goodsPricing/getGoodsPricingById",
    goodsPricing.getGoodsPricingById
  );

  // 运费方案
  router.post("/freightPlan/saveNew", freightPlan.saveNew);
  router.post("/freightPlan/saveModify", freightPlan.saveModify);
  router.post("/freightPlan/remove", freightPlan.remove);
  router.post("/freightPlan/query", freightPlan.query);
  router.get("/freightPlan/get", freightPlan.get);

  // 送货时间
  router.post("/deliveryTimeType/saveNew", deliveryTimeType.saveNew);
  router.post("/deliveryTimeType/saveModify", deliveryTimeType.saveModify);
  router.post("/deliveryTimeType/remove", deliveryTimeType.remove);
  router.post("/deliveryTimeType/query", deliveryTimeType.query);
  router.get("/deliveryTimeType/get", deliveryTimeType.get);
};
