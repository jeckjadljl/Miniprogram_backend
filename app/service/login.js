/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-10-16 18:15:54
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-01-03 10:38:24
 * @FilePath: \Mini_program_backend\app\service\login.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

const Service = require("egg").Service;
const axios = require("axios"); // 使用 axios
const UUID = require("uuid").v4;

const appid = process.env.WX_APPID; // 小程序的 appid
const secret = process.env.WX_APPSECRET; // 小程序的密钥

class LoginService extends Service {
  async login(loginCode, getPhoneCode, userinfo) {
    try {
      // 发起请求到微信的 jscode2session 接口
      const response = await axios.get(
        "https://api.weixin.qq.com/sns/jscode2session",
        {
          params: {
            appid,
            secret,
            js_code: loginCode,
            grant_type: "authorization_code",
          },
        }
      );

      const { openid, session_key } = response.data;

      if (openid && session_key) {
        const { ctx } = this;
        const jti = UUID(); // Generate a unique identifier

        const getphone = await this.getPhoneNumber(getPhoneCode);

        if (!getphone) {
          throw new Error("获取手机号失败");
        }

        const getuser = await ctx.service.user.getUserByOpenid(openid);
        if (!getuser) {
          const userData = {
            jti,
            openid,
            phoneNumber: getphone,
            userinfo,
          };

          const getrole = await ctx.service.role.findRoleByName("user");

          const user = await ctx.service.user.addUser(userData);
          const roles = await ctx.service.role.UserRoles(jti, getrole.id);
          const token = await ctx.service.jwt.generateToken(user.uuid);

          if (!roles) {
            throw new Error("用户与角色关联失败");
          }

          if (!user) {
            console.log(`用户${user.user_name}创建失败:`, openid);
            throw new Error(`用户${user.user_name}创建失败`);
          }
          await ctx.service.redis.set(jti, session_key, 3 * 24 * 60 * 60); // 设置3天有效期
          console.log(`用户${user.user_name}注册成功`);
          return {
            token,
            session_key,
            user,
          };
        }

        const token = await ctx.service.jwt.generateToken(getuser.uuid);
        await ctx.service.redis.set(jti, session_key, 3 * 24 * 60 * 60); // 设置3天有效期

        return {
          token,
          session_key,
          getuser,
        };
      }
      throw new Error("获取 openid 和 session_key 失败");
    } catch (error) {
      console.error("请求失败:", error);
      return { error: "请求失败", message: error.message };
    }
  }

  async getPhoneNumber(code) {
    const { ctx } = this;
    try {
      const response = await axios.post(
        "https://api.weixin.qq.com/wxa/business/getuserphonenumber",
        {
          code,
        },
        {
          params: {
            access_token: await ctx.service.jwt.getAccessToken(),
          },
        }
      );

      if (response.data.errcode === 0) {
        return response.data.phone_info.phoneNumber; // 返回手机号
      }
      throw new Error(`Error: ${response.data.errmsg}`);
    } catch (error) {
      console.error("获取手机号失败", error);
      throw error;
    }
  }
}

module.exports = LoginService;
