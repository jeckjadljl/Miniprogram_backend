/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-02-25 16:25:26
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-03-08 16:16:00
 * @FilePath: \Mini_program_backend\app\service\payments.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

const Service = require("egg").Service;

const axios = require("axios");
const WechatPayUtil = require("../utils/wechatPay");

class PaymentsService extends Service {
  constructor(ctx) {
    super(ctx); // 新增super调用
    this.ctx = ctx;
    this.config = ctx.app.config.wechatPay;
  }

  async createPayment(orderData = {}) {
    const { mchId, appId, notify_url } = this.config;
    const generateOutTradeNo = () => {
      // 组合生成规则：时间戳(13位) + 商户号后4位 + 6位随机数
      const timestamp = Date.now();
      const mchSuffix = this.config.mchId.slice(-4); // 获取商户号后四位
      const random = Math.floor(Math.random() * 899999 + 100000); // 6位随机数

      return `MCH${mchSuffix}T${timestamp}R${random}`;
    };
    const url = "/v3/pay/transactions/jsapi"; // 小程序下单接口
    const method = "POST";
    const out_trade_no = generateOutTradeNo();
    const body = JSON.stringify({
      description: orderData.description,
      out_trade_no, // 注入自动生成的订单号
      mchid: mchId,
      appid: appId,
      notify_url,
      amount: {
        total: orderData.amount.total,
      },
      payer: {
        openid: orderData.payer.openid,
      },
    });

    // 获取签名和Authorization头
    const wechatPayUtil = new WechatPayUtil(this.ctx);
    const authData = await wechatPayUtil.getAuthorization(method, url, body);

    console.log("签名和Authorization头timestamp参数:", authData.timestamp);
    console.log("签名和Authorization头nonce_str参数:", authData.nonce_str);
    console.log("签名和Authorization头signature参数:", authData.signature);
    const headers = {
      "Content-Type": "application/json",
      Authorization: `WECHATPAY2-SHA256-RSA2048 mchid="${authData.mchid}",nonce_str="${authData.nonce_str}",signature="${authData.signature}",timestamp="${authData.timestamp}",serial_no="${authData.serial_no}"`,
    };

    try {
      const response = await axios.post(
        `https://api.mch.weixin.qq.com${url}`,
        body,
        { headers }
      );

      const responseData = response.data;
      console.log("微信支付响应数据:", responseData);

      // 检查是否成功获取 prepay_id
      if (responseData) {
        console.log("请求体数据：", JSON.parse(body));
        // 将支付数据存储到数据库
        await this.savePaymentData(
          JSON.parse(body),
          orderData.business_order_id,
          responseData
        );

        // 生成调起支付参数并签名
        const paymentParams = await wechatPayUtil.generatePaymentParams(
          responseData.prepay_id
        );
        return paymentParams;
      }
      throw new Error("Failed to get prepay_id from WeChat Pay");
    } catch (error) {
      this.ctx.logger.error("微信支付请求失败:", error);
      throw error;
    }
  }

  // 保存支付数据到数据库
  async savePaymentData(orderData, business_order_id, wechatResponse) {
    if (
      !orderData?.amount?.total &&
      !business_order_id &&
      !orderData?.payer?.openid
    ) {
      throw new Error("Invalid orderData structure");
    }
    const { ctx } = this;
    const { amount, out_trade_no, appid, mchid, payer } = orderData;
    const { total } = amount;
    const { openid } = payer;
    const { prepay_id } = wechatResponse;

    const user_id = ctx.state.user.uid;
    // 构造存储数据
    const paymentData = {
      user_id, // 假设用户ID存储在 session 中
      prepay_id,
      business_order_id,
      out_trade_no, // 假设商户订单号和业务订单号一致
      payment_status: "unpaid", // 初始状态为未支付
      payment_method: "wechat_pay",
      appId: appid,
      mchId: mchid,
      openId: openid,
      total_amount: total,
    };

    // 保存到数据库
    await ctx.model.Payments.saveNew(paymentData);
    this.ctx.logger.info(`支付数据保存成功: 订单号 ${business_order_id}`);
  }

  async updateOrderStatus(outTradeNo, updateData) {
    const { app } = this;
    const { transaction_id, payment_status, trade_state_desc } = updateData;

    // 查询订单
    const order = await app.model.Payments.findOne({
      where: { out_trade_no: outTradeNo },
    });
    if (!order) {
      throw new Error(`订单不存在: ${outTradeNo}`);
    }

    // 更新订单状态
    await order.update({
      transaction_id,
      payment_status,
      trade_state_desc,
    });

    this.ctx.logger.info(`订单状态更新成功: ${outTradeNo}`);
  }
}

module.exports = PaymentsService;
