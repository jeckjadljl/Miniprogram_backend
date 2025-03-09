/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-02-26 16:18:39
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-03-08 21:05:17
 * @FilePath: \Mini_program_backend\app\utils\wechatPay.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
// app/utils/wechatPay.js
const fs = require("fs");
const crypto = require("crypto");
const path = require("path");

class WechatPayUtil {
  constructor(ctx) {
    this.ctx = ctx;
    this.config = ctx.app.config.wechatPay;
  }

  // 生成签名
  async generateSignature(method, url, timestamp, nonce_str, body = "") {
    const { privateKeyPath } = this.config;
    const privateKey = fs.readFileSync(path.resolve(privateKeyPath), "utf-8");

    const message = `${method}\n${url}\n${timestamp}\n${nonce_str}\n${body}\n`;
    const signer = crypto.createSign("RSA-SHA256");
    signer.update(message);
    signer.end();

    const signature = signer.sign(
      { key: privateKey, padding: crypto.constants.RSA_PKCS1_PADDING },
      "base64"
    );
    return signature;
  }

  // 构造Authorization头
  async getAuthorization(method, url, body = "") {
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const nonce_str = Math.random().toString(36).substr(2, 16);
    console.log("timestamp:", timestamp);
    console.log("nonce_str:", nonce_str);

    const signature = await this.generateSignature(
      method,
      url,
      timestamp,
      nonce_str,
      body
    );

    return {
      mchid: this.config.mchId,
      nonce_str,
      signature,
      timestamp,
      serial_no: this.config.serialNo,
    };
  }

  // RSA 签名方法
  async generateRsaSign(params) {
    const privateKeyPath = this.config.privateKeyPath; // 私钥文件路径
    const privateKey = fs.readFileSync(privateKeyPath, "utf-8");
    console.log("私钥证书：", privateKey);

    // 构造待签名字符串
    // const pairs = Object.keys(params)
    //   .sort()
    //   .map(key => `${key}=${params[key]}`)
    //   .join("\n");
    // const message = pairs;
    // 构造微信支付 V3 的签名明文（四行格式）
    const message =
      [params.appId, params.timeStamp, params.nonceStr, params.package].join(
        "\n"
      ) + "\n"; // 每行以换行符结尾，最后一行也要换行

    console.log("待签名字符串：", message);
    // 使用 RSA-SHA256 签名
    const signer = crypto.createSign("RSA-SHA256");
    signer.update(message);
    const signature = signer.sign(privateKey, "base64");
    console.log("签名结果：", signature);
    return signature;
  }

  // 生成调起支付参数
  async generatePaymentParams(prepayId) {
    const { appId } = this.config;
    const timeStamp = Math.floor(Date.now() / 1000).toString();
    const nonceStr = Math.random().toString(36).substr(2, 16);
    const packageValue = `prepay_id=${prepayId}`;
    const signType = "RSA";

    // 构造签名参数
    const signParams = {
      appId,
      timeStamp,
      nonceStr,
      package: packageValue,
    };

    console.log("签名参数：", signParams);
    // 生成签名
    const paySign = await this.generateRsaSign(signParams);

    return {
      appId,
      timeStamp,
      nonceStr,
      package: packageValue,
      signType,
      paySign,
    };
  }
}

module.exports = WechatPayUtil;
