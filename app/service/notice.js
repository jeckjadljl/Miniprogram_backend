/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-12-22 15:46:58
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-02-27 15:02:04
 * @FilePath: \Mini_program_backend\app\service\notice.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

const Service = require("egg").Service;

/**
 * Service - 消息通知
 * @class
 * @author ruiyong-lee
 */
class NoticeService extends Service {
  /**
   * 发送消息
   */
  async send(acticon, notice) {
    const { ctx, app } = this;
    const result = await app.model.Notice.saveNew(notice); // 持久化消息
    const msg = ctx.helper.parseSocketMsg(acticon, result); // 封装数据
    app.io.of("/").emit("notice", msg); // 向客户端发送
    return result;
  }

  /**
   * 全部标记为已读
   * @param {object} params - 条件
   * @return {object|null} - 操作结果
   */
  async readAll(params = {}) {
    const { app } = this;
    return await app.model.Notice.readAll(params);
  }

  /**
   * 获取消息概况（最多5条）
   * @param {object} params - 条件
   * @return {object|null} - 查找结果
   */
  async overview(params = {}) {
    const { app } = this;
    return await app.model.Notice.overview(params);
  }

  /**
   * 获取消息分页列表
   * @param {object} params - 条件
   * @return {object|null} - 查找结果
   */
  async query(params = {}) {
    const { app } = this;
    return await app.model.Notice.query(params);
  }

  /**
   * 小程序端
   */
  async wechatPayCallback(xmlData) {
    const { ctx } = this;

    // 解析XML数据
    const result = this.parseXml(xmlData);

    if (!result) {
      ctx.body = "签名验证失败";
      ctx.status = 403;
      return;
    }

    const { resource } = result;
    // 验证签名
    const isValid = await this.validateSignature(resource);
    if (!isValid) {
      ctx.body = "签名验证失败";
      ctx.status = 403;
      return;
    }

    // 处理支付结果
    const { event_type, resource_type, content } = resource;
    const paymentData = JSON.parse(content);

    switch (event_type) {
      case "TRANSACTION.SUCCESS":
        await this.handlePaymentSuccess(paymentData);
        break;
      case "TRANSACTION.REFUND":
        await this.handleRefund(paymentData);
        break;
      default:
        ctx.body = "未知事件类型";
        ctx.status = 400;
        return;
    }

    // 返回成功响应
    ctx.body = "OK";
    ctx.status = 200;
  }

  // 解析XML数据
  async parseXml(xmlData) {
    const { parseString } = require("xml2js");
    return new Promise((resolve, reject) => {
      parseString(
        xmlData,
        { explicitArray: false, ignoreAttrs: true },
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });
  }

  // 验证签名
  async validateSignature(resource) {
    const { nonce_str, timestamp, signature } = resource;
    const { apiV3Key } = this.app.config.wechatPay;

    const message = `${nonce_str}\n${timestamp}\n${resource.resource}\n`;
    const expectedSignature = crypto
      .createHmac("sha256", apiV3Key)
      .update(message)
      .digest("hex");

    return signature === expectedSignature;
  }

  // 处理支付成功
  async handlePaymentSuccess(data) {
    const { transaction_id, out_trade_no, trade_state, trade_state_desc } =
      data;
    const paymentService = this.ctx.service.payments;

    // 更新本地订单状态
    await paymentService.updateOrderStatus(out_trade_no, {
      transaction_id,
      payment_status: trade_state,
      trade_state_desc,
    });

    this.ctx.logger.info(
      `支付成功: 订单号 ${out_trade_no}, 交易状态: ${trade_state}, 描述: ${trade_state_desc}`
    );
  }

  // 处理退款
  async handleRefund(data) {
    const { transaction_id, out_trade_no, trade_state, trade_state_desc } =
      data;
    const paymentService = this.ctx.service.payments;

    // 更新本地订单状态
    await paymentService.updateOrderStatus(out_trade_no, {
      transaction_id,
      payment_status: trade_state,
      trade_state_desc,
    });

    this.ctx.logger.info(
      `退款成功: 订单号 ${out_trade_no}, 交易状态: ${trade_state}, 描述: ${trade_state_desc}`
    );
  }
}

module.exports = NoticeService;
