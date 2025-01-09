/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-10-16 17:44:22
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-01-03 10:51:31
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
    cart,
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
  } = controller;

  router.get("/", home.index);

  /**
   * 微信小程序
   */
  router.post("/login", login.login);

  // 购物车
  router.post("/cart/addGoodsToCart", cart.addGoodsToCart);
  router.post("/cart/removeGoodsFromCart", cart.removeGoodsFromCart);
  router.post("/cart/decrementGoodsQuantity", cart.decrementGoodsQuantity);
  router.get("/cart/getCartList", cart.getCartList);
  router.post("/cart/clearCart", cart.clearCart);

  // 商品数据
  router.get("/goods/getGoodsList", goods.getGoodsList);

  // 订单操作
  router.post("/order/queryOrderBill", order.queryOrderBill);
  router.post("/order/getOrderBill", order.getOrderBill);
  router.post("/order/createBill", order.createBill);
  router.post("/order/cancelBill", order.cancelBill);
  router.post("/order/auditBill", order.auditBill);
  router.post("/order/completeBill", order.completeBill);
  router.get("/order/getUserOrders", order.getUserOrders);
  router.get("/order/getOrderDetails", order.getOrderDetails);

  // 地址设置
  router.get("/address/getAddress", address.getAddress);
  router.get("/address/getDefaultAddress", address.getDefaultAddress);
  router.post("/address/setDefaultAddress", address.setDefaultAddress);
  router.post("/address/deleteAddress", address.deleteAddress);
  router.get("/address/getAddressList", address.getAddressList);
  router.post("/address/saveNewAddress", address.saveNewAddress);
  router.post("/address/saveModifyAddress", address.saveModifyAddress);

  // 小程序推广码
  router.post("/referral/getCode", referral.getCode);

  /**
   * 管理端
   */

  router.post("/common/login", common.login);
  router.post("/common/savePasswordModify", common.savePasswordModify);
  router.post("/common/logout", common.logout);

  // 消息通知
  router.post("/notice/readAll", notice.readAll);
  router.get("/notice/overview", notice.overview);
  router.post("/notice/query", notice.query);

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
  router.get("/bill/order/get", order.get);
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
  router.get("/goods/get", goods.get);

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
