/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-11-09 17:09:22
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-01-13 11:16:32
 * @FilePath: \Mini_program_backend\app\service\jwt.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

const Service = require("egg").Service;
const axios = require("axios"); // 使用 axios

const appid = process.env.WX_APPID; // 小程序的 appid
const secret = process.env.WX_APPSECRET; // 小程序的密钥

class JwtService extends Service {
  async createToken(uid, secret, expire) {
    // Parameter validation
    if (!uid || !secret || typeof expire !== "number" || expire <= 0) {
      throw new Error("Invalid parameters");
    }

    // 获取当前时间的 Unix 时间戳（单位为秒）
    const now = Math.floor(Date.now() / 1000);

    const payload = {
      aud: "http://127.0.0.1",
      iss: "mmyx", // Configure as per actual scenario
      iat: now,
      nbf: now,
      exp: now + expire,
      uid,
    };

    try {
      // Sign the JWT using a secure signing algorithm
      const token = await this.app.jwt.sign(payload, secret);
      return token;
    } catch (error) {
      console.error("JWT 签名失败，详细信息：", error);
      throw new Error("JWT signing failed");
    }
  }

  // 获取 access_token（有效期为2小时），可以缓存起来避免频繁请求
  async getAccessToken() {
    const response = await axios.get(
      `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${secret}`
    );
    return response.data.access_token;
  }

  async generateToken(user) {
    const { secret, expire } = this.config.jwt;
    return {
      token: await this.createToken(user, secret, expire),
    };
  }

  // 刷新 access_token
  async refreshAccessToken(token) {
    const decode = this.app.jwt.decode(token);
    const session_key = await this.ctx.service.redis.get(decode.uid);

    if (!session_key) {
      throw new Error("Session expired, please log in again.");
    }

    // 如果 session_key 有效，则生成并返回新的 access_token
    const newAccessToken = await this.generateToken(decode.uid);
    return newAccessToken;
  }

  /**
   * @description
   * Verifies the provided token using JWT (JSON Web Token) strategy.
   * It checks whether the token is valid and, based on the 'isRefresh' flag,
   * selects the appropriate secret for verification.
   * @param {string} token - The token string to verify.
   * @param {boolean} isRefresh - A flag to determine if the refresh secret should be used for verification (default is false).
   * @return {Promise<Object>} - Resolves with the decoded token information if verification is successful.
   * @throws {Error} - Throws an error if the token is missing, or if the verification process fails, including for expired tokens.
   */
  async verifyToken(token, isRefresh = false) {
    const { secret } = this.app.config.jwt;

    if (!token) {
      throw new Error("Token is missing");
    }

    try {
      await this.app.jwt.verify(token, (isRefresh = secret));
      const decode = this.app.jwt.decode(token);
      return decode;
    } catch (e) {
      if (e.message === "jwt expired" && !isRefresh) {
        this.ctx.response.body = {
          error: "Fail to auth request due to exception: " + e,
          code: 100,
        };
        // throw new AuthException('令牌过期', 10003);
      }
      this.ctx.response.body = {
        error: "Fail to auth request due to exception: " + e,
        code: 100,
      };
      // throw new AuthException();
    }
  }
}

module.exports = JwtService;
