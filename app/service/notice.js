/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-12-22 15:46:58
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-06-30 22:22:37
 * @FilePath: \Mini_program_backend\app\service\notice.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

const Service = require("egg").Service;
const { default: axios } = require("axios");
const crypto = require("crypto");
// const { promisify } = require("util");
// const { XMLParser } = require("fast-xml-parser");
// const aes256gcm = promisify(crypto.createCipheriv);
// const aes256gcmDecrypt = promisify(crypto.aes256gcmDecrypt);

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

  async decryptResource(params = {}) {
    const { app } = this;
    const { resource } = params;
    const { apiV3Key } = app.config.wechatPay;

    const key = Buffer.from(apiV3Key, "utf8");
    const nonce = Buffer.from(resource.nonce, "utf8");
    const associatedData = Buffer.from(resource.associated_data, "utf8");
    const ciphertextBuffer = Buffer.from(resource.ciphertext, "base64");
    const decipher = crypto.createDecipheriv("aes-256-gcm", key, nonce);
    decipher.setAAD(associatedData);
    const authTag = Buffer.from(
      ciphertextBuffer.subarray(ciphertextBuffer.length - 16)
    );
    decipher.setAuthTag(authTag);
    // 除去最后16个字节以外的字节作为加密数据
    const encryptedData = Buffer.from(
      ciphertextBuffer.subarray(0, ciphertextBuffer.length - 16)
    );
    // 调用update方法解密数据
    let decrypted = decipher.update(encryptedData);
    // 调用final方法指定编码格式为utf8
    decrypted += decipher.final("utf8");
    console.log(decrypted);

    const paySucData = JSON.parse(decrypted);
    return paySucData;
  }

  /**
   * 小程序端
   */
  async wechatPayCallback(params = {}) {
    const { ctx, app } = this;
    const { event_type, resource } = params;
    // const { apiV3Key } = app.config.wechatPay;

    try {
      if (event_type === "TRANSACTION.SUCCESS") {
        console.log("resource:", resource);
        if (
          !resource ||
          !resource.nonce ||
          !resource.associated_data ||
          !resource.ciphertext
        ) {
          throw new Error("缺少必要的加密参数");
        }
        const paySucData = await this.decryptResource(params);

        // const key = Buffer.from(apiV3Key, "utf8");
        // const nonce = Buffer.from(resource.nonce, "utf8");
        // const associatedData = Buffer.from(resource.associated_data, "utf8");
        // const ciphertextBuffer = Buffer.from(resource.ciphertext, "base64");
        // const decipher = crypto.createDecipheriv("aes-256-gcm", key, nonce);
        // decipher.setAAD(associatedData);
        // const authTag = Buffer.from(
        //   ciphertextBuffer.subarray(ciphertextBuffer.length - 16)
        // );
        // decipher.setAuthTag(authTag);
        // // 除去最后16个字节以外的字节作为加密数据
        // const encryptedData = Buffer.from(
        //   ciphertextBuffer.subarray(0, ciphertextBuffer.length - 16)
        // );
        // // 调用update方法解密数据
        // let decrypted = decipher.update(encryptedData);
        // // 调用final方法指定编码格式为utf8
        // decrypted += decipher.final("utf8");
        // console.log(decrypted);

        // const paySucData = JSON.parse(decrypted);
        // 处理支付结果
        const result = await this.handlePaymentResult(paySucData);
        return result;
      }

      if (event_type === "REFUND.SUCCESS") {
        const payRefData = await this.decryptResource(params);
        const result = await this.handleRefund(payRefData);
        return result;
      }

      console.log("未知事件类型:", event_type);
      ctx.body = { error: "未知事件类型" };
      ctx.status = 400;
      return;
    } catch (error) {
      console.error("微信支付回调处理失败:", error);
      ctx.body = { error: "处理失败" };
      ctx.status = 500;
      return;
    }

    // Todo: 后续增加退款方法等
    // switch (event_type) {
    //   case "TRANSACTION.SUCCESS":
    //     await this.handlePaymentSuccess(paymentData);
    //     break;
    //   case "TRANSACTION.REFUND":
    //     await this.handleRefund(paymentData);
    //     break;
    //   default:
    //     ctx.body = "未知事件类型";
    //     ctx.status = 400;
    //     return;
    // }
  }

  // 处理支付结果
  async handlePaymentResult(paymentData) {
    const {
      transaction_id,
      out_trade_no,
      trade_state,
      trade_state_desc,
      success_time,
      payer,
    } = paymentData;
    const paymentService = this.ctx.service.payments;

    // 更新本地订单状态
    await paymentService.updateOrderStatus(out_trade_no, {
      transaction_id,
      trade_state,
      trade_state_desc,
      success_time,
    });

    this.ctx.logger.info(
      `支付成功: 订单号 ${out_trade_no}, 交易状态: ${trade_state}, 描述: ${trade_state_desc}`
    );
  }

  // 处理退款
  async handleRefund(data) {
    const {
      transaction_id,
      refund_id,
      out_trade_no,
      out_refund_no,
      refund_status,
      success_time,
    } = data;
    const paymentService = this.ctx.service.payments;

    // 更新本地订单状态
    // await paymentService.updateOrderStatus(out_trade_no, {
    //   payment_status: "refunded",
    //   refund_status,
    //   refund_success_time: success_time,
    // });

    // 触发订单状态更新
    await paymentService.updateRefundStatus(out_trade_no, {
      payment_status: "refunded",
      refund_status,
      out_refund_no,
      refund_id,
      refund_success_time: success_time,
    });

    this.ctx.logger.info(
      `退款成功: 订单号 ${out_trade_no}, 退款状态: ${refund_status}`
    );
  }

  /**
   * 小程序端页面消息通知
   */
  async saveNewForWeapp(params = {}) {
    const { app } = this;
    return await app.model.NoticeForWeapp.saveNew(params);
  }

  async getNotice(params = {}) {
    const { app } = this;
    return await app.model.NoticeForWeapp.getNoticeOrMessage(params);
  }

  async getNoticeByElementsId(params = {}) {
    const { app } = this;
    return await app.model.NoticeForWeapp.getNoticeByElementsId(params);
  }

  async sendSubscribeMessage(params = {}) {
    const { app, ctx } = this;
    const { openid, page, data } = params;
    const { groupBuy } = app.config.subscribeTemplate;

    const getAccessToken = await ctx.service.jwt.getAccessToken();
    const url = `/cgi-bin/message/subscribe/send?access_token=${getAccessToken}`;

    const body = {
      touser: openid,
      template_id: groupBuy,
      page: page || "subpackageCore/pages/index/index",
      data: {
        thing1: data?.thing1 || "拼团成功，请完成该订单", // 支持动态内容
        character_string2: data?.character_string2 || "",
        amount10: data?.amount10 || "",
        number6: data?.number6 || "",
        thing5: data?.thing5 || "如有任何疑问请联系客服微信",
      },
    };

    try {
      const result = await axios.get(`https://api.weixin.qq.com${url}`, body);

      if (result.data.errcode === 0) {
        return result.data;
      }
    } catch (err) {
      return err;
    }
  }
}

module.exports = NoticeService;
