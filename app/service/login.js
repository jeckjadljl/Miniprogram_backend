/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-10-16 18:15:54
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-08-08 23:09:17
 * @FilePath: \Mini_program_backend\app\service\login.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

const Service = require("egg").Service;
const axios = require("axios"); // 使用 axios
// const UUID = require("uuid").v4;
const crypto = require("crypto"); // 用于解密

const appid = process.env.WX_APPID; // 小程序的 appid
const secret = process.env.WX_APPSECRET; // 小程序的密钥

class LoginService extends Service {
  async login({ code, sessionKey, userInfo }) {
    try {
      // 发起请求到微信的 jscode2session 接口
      const response = await axios.get(
        "https://api.weixin.qq.com/sns/jscode2session",
        {
          params: {
            appid,
            secret,
            js_code: code,
            grant_type: "authorization_code",
          },
        }
      );
      const { openid, session_key, errcode, errmsg } = response.data;
      if (errcode) {
        console.error(`微信接口错误: errcode=${errcode}, errmsg=${errmsg}`);
        throw new Error(`微信接口错误: ${errmsg || "未知错误"}`);
      }

      if (openid && session_key) {
        // 第二步：解密手机号和其他用户信息
        const phone = await this.getPhoneNumber(sessionKey);

        if (!phone) {
          throw new Error("获取手机号失败");
        }

        const { ctx } = this;

        const getuser = await ctx.service.user.getUserByOpenid(openid);
        // 注册的逻辑
        if (!getuser) {
          const userData = {
            openid,
            phoneNumber: phone,
            user_name: userInfo.nickName, // 将 userInfo 中的 nickName 对应到数据库的 user_name
            avatar: userInfo.avatarUrl, // 将 userInfo 中的 avatarUrl 对应到数据库的 avatar
          };

          const getrole = await ctx.service.role.findRoleByName("general");

          const newUser = await ctx.service.user.addUser(userData);
          if (!newUser) {
            console.log(`用户${newUser.user_name}创建失败:`, openid);
            throw new Error(`用户${newUser.user_name}创建失败`);
          }
          console.log("用户uuid:", newUser.uuid);
          const roles = await ctx.service.role.UserRoles(
            newUser.uuid,
            getrole.id
          );
          const token = await ctx.service.jwt.generateToken(newUser.uuid);

          if (!roles) {
            throw new Error("用户与角色关联失败");
          }

          await ctx.service.redis.set(
            newUser.uuid,
            session_key,
            3 * 24 * 60 * 60,
            "token"
          ); // 设置3天有效期
          console.log(`用户${newUser.user_name}注册成功`);

          // 只返回头像和名称
          const filteredUser = {
            uuid: newUser.uuid,
            avatarUrl: newUser.avatar,
            nickName: newUser.user_name,
          };

          return {
            token: token.token,
            session_key,
            user: filteredUser,
            type: "register",
          };
        }

        // 如果已有用户数据就直接登录
        const token = await ctx.service.jwt.generateToken(getuser.uuid);
        await ctx.service.redis.set(
          getuser.uuid,
          session_key,
          3 * 24 * 60 * 60,
          "token"
        ); // 设置3天有效期

        if (
          getuser.avatar !== userInfo.avatarUrl ||
          getuser.user_name !== userInfo.nickName
        ) {
          const userData = {};

          // 更新头像
          if (getuser.avatar !== userInfo.avatarUrl) {
            userData.avatar = userInfo.avatarUrl;
          }

          // 更新昵称
          if (getuser.user_name !== userInfo.nickName) {
            userData.user_name = userInfo.nickName;
          }

          // 如果头像或昵称有变化，更新数据库
          await ctx.service.user.updateUser(getuser.uuid, userData);

          // 重新获取更新后的用户数据
          const updatedUser = await ctx.service.user.getUserByOpenid(openid);
          // 只返回头像和名称
          const filteredUser = {
            uuid: updatedUser.uuid,
            avatarUrl: updatedUser.avatar,
            nickName: updatedUser.user_name,
            type: "login",
          };

          return {
            token: token.token,
            session_key,
            user: filteredUser,
            type: "login",
          };
        }

        // 只返回头像和名称
        const filteredUser = {
          uuid: getuser.uuid,
          avatarUrl: getuser.avatar,
          nickName: getuser.user_name,
        };

        return {
          token: token.token,
          session_key,
          user: filteredUser,
        };
      }
      throw new Error("获取 openid 和 session_key 失败");
    } catch (error) {
      console.error("请求失败:", error);
      return { error: "请求失败", message: error.message };
    }
  }

  // 解密手机号
  async decryptPhoneNumber(encryptedData, iv, sessionKey) {
    try {
      const pc = new crypto.Decipheriv(
        "aes-128-cbc",
        Buffer.from(sessionKey, "base64"),
        Buffer.from(iv, "base64")
      );
      pc.setAutoPadding(true);
      let decoded = pc.update(Buffer.from(encryptedData, "base64"));
      decoded = Buffer.concat([decoded, pc.final()]);
      const decodedData = JSON.parse(decoded.toString());
      return decodedData.phoneNumber; // 返回手机号
    } catch (error) {
      console.error("解密失败", error);
      return null;
    }
  }

  async testlogin({ code, userInfo }) {
    try {
      // 发起请求到微信的 jscode2session 接口
      const response = await axios.get(
        "https://api.weixin.qq.com/sns/jscode2session",
        {
          params: {
            appid,
            secret,
            js_code: code,
            grant_type: "authorization_code",
          },
        }
      );

      const { openid, session_key, errcode, errmsg } = response.data;
      console.log(openid, session_key);

      if (errcode) {
        console.error(`微信接口错误: errcode=${errcode}, errmsg=${errmsg}`);
        throw new Error(`微信接口错误: ${errmsg || "未知错误"}`);
      }

      if (openid && session_key) {
        const { ctx } = this;

        const getuser = await ctx.service.user.getUserByOpenid(openid);
        if (!getuser) {
          const userData = {
            openid,
            phoneNumber: "13003913193", // 测试手机号
            user_name: userInfo.nickName, // 将 userInfo 中的 nickName 对应到数据库的 user_name
            avatar: userInfo.avatarUrl, // 将 userInfo 中的 avatarUrl 对应到数据库的 avatar
          };

          const getrole = await ctx.service.role.findRoleByName("user");

          const newUser = await ctx.service.user.addUser(userData);
          if (!newUser) {
            console.log(`用户${newUser.user_name}创建失败:`, openid);
            throw new Error(`用户${newUser.user_name}创建失败`);
          }

          const roles = await ctx.service.role.UserRoles(
            newUser.uuid,
            getrole.id
          );
          const token = await ctx.service.jwt.generateToken(newUser.uuid);

          if (!roles) {
            throw new Error("用户与角色关联失败");
          }

          await ctx.service.redis.set(
            `session:${newUser.uuid}`,
            session_key,
            3 * 24 * 60 * 60
          ); // 设置3天有效期
          console.log(`用户${newUser.user_name}注册成功`);

          // 只返回头像和名称
          const filteredUser = {
            uuid: newUser.uuid,
            avatarUrl: newUser.avatar,
            nickName: newUser.user_name,
          };

          return {
            token: token.token,
            session_key,
            user: filteredUser,
          };
        }

        console.log(getuser.uuid);
        const token = await ctx.service.jwt.generateToken(getuser.uuid);
        await ctx.service.redis.set(
          `session:${getuser.uuid}`,
          session_key,
          3 * 24 * 60 * 60
        ); // 设置3天有效期

        // 只返回头像和名称
        const filteredUser = {
          uuid: getuser.uuid,
          avatarUrl: getuser.avatar,
          nickName: getuser.user_name,
        };

        return {
          token: token.token,
          session_key,
          user: filteredUser,
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

  async Login(code) {
    const response = await axios.get(
      "https://api.weixin.qq.com/sns/jscode2session",
      {
        params: {
          appid,
          secret,
          js_code: code,
          grant_type: "authorization_code",
        },
      }
    );
    console.log(response.data);
    return response.data;
  }

  async refreshLoginStatue(params = {}) {
    const { ctx } = this;
    const { code, userInfo } = params;
    const { uuid, nickName, avatarUrl } = userInfo;

    try {
      const response = await axios.get(
        "https://api.weixin.qq.com/sns/jscode2session",
        {
          params: {
            appid,
            secret,
            js_code: code,
            grant_type: "authorization_code",
          },
        }
      );
      const { openid, session_key, errcode, errmsg } = response.data;
      if (errcode) {
        console.error(`微信接口错误: errcode=${errcode}, errmsg=${errmsg}`);
        throw new Error(`微信接口错误: ${errmsg || "未知错误"}`);
      }

      if (!uuid) {
        const user = await ctx.service.user.getUserByOpenid(openid);
        if (user) {
          const token = await ctx.service.jwt.generateToken(user.uuid);
          await ctx.service.redis.set(
            user.uuid,
            session_key,
            3 * 24 * 60 * 60,
            "token"
          ); // 设置3天有效期
          return {
            token: token.token,
            uuid: user.uuid,
            session_key,
            type: "refresh",
          };
        }
        throw new Error("用户不存在");
      } else {
        const token = await ctx.service.jwt.generateToken(uuid);
        await ctx.service.redis.set(
          uuid,
          session_key,
          3 * 24 * 60 * 60,
          "token"
        ); // 设置3天有效期
        return {
          token: token.token,
          uuid,
          session_key,
          type: "refresh",
        };
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

module.exports = LoginService;
