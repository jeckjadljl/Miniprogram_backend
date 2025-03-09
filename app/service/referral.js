/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-11-21 16:39:54
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-03-05 17:38:12
 * @FilePath: \Mini_program_backend\app\service\referral.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

const Service = require("egg").Service;
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");

class ReferralService extends Service {
  async distributeReferralReward(referredUserId, membershipLevel) {
    const { Referrals, Rewards, User } = this.ctx.model;
    // 查询推荐关系
    const referral = await Referrals.findReferred(referredUserId);
    if (!referral) return; // 没有推荐关系

    // 获取推荐人信息
    const referrerId = referral.referrer_id;
    // const referrer = await this.ctx.model.User.findByPk(referrerId);

    // 计算奖励金额
    let rewardAmount = 0;
    let rewardDescription = "";

    // 根据被推荐人的会员等级发放奖励
    if (membershipLevel === "general") {
      rewardAmount = 50; // 严选会员推荐奖励
      rewardDescription = `推荐严选会员 ${referredUserId} 的奖励`;
    } else if (membershipLevel === "junior") {
      const successfulReferrals = await Referrals.count({
        where: { referrer_id: referrerId, membership_level: "junior" },
      });

      rewardAmount = this.calculateRewardAmount(successfulReferrals);
      rewardDescription = `推荐分享会员 ${referredUserId} 的奖励`;
    } else if (membershipLevel === "premium") {
      rewardAmount = 200; // 推荐 3990 元资深会员
      rewardDescription = `推荐资深会员 ${referredUserId} 的奖励`;
    }

    // 发放奖励
    if (rewardAmount > 0) {
      await User.addBalance(rewardAmount);

      await Rewards.createReward({
        userId: referrerId,
        amount: rewardAmount,
        description: rewardDescription,
      });

      this.logger.info(
        `推荐奖励发放成功，推荐人: ${referrerId}, 奖励金额: ${rewardAmount}`
      );
    }
  }

  /**
   * 根据推荐人数计算奖励金额
   * @param {number} successfulReferrals 已成功推荐的初级会员数量
   * @return {number} 奖励金额
   */
  calculateRewardAmount(successfulReferrals) {
    // 每 3 名为一组的返现规则
    const position = (successfulReferrals - 1) % 3; // 当前组内位置（0, 1, 2）

    if (position === 0) return 98; // 第一名奖励 98 元
    if (position === 1) return 100; // 第二名奖励 100 元
    if (position === 2) return 100; // 第三名奖励 100 元

    return 0; // 不在有效奖励范围
  }

  async getRefererCount(referrerId) {
    const { Referrals } = this.ctx.model;
    const result = await Referrals.countReferrals(referrerId);
    return result;
  }

  async getReferrer(promotionCodeId) {
    const { Qrcode } = this.ctx.model;
    const getReferrer = await Qrcode.getReferrer({
      promotionCodeId,
      attributes: ["uuid", "avatar", "user_name", "phoneNumber"],
    });
    if (!getReferrer) {
      throw new Error("未找到推荐人ID");
    }
    return getReferrer;
  }

  async getReferred(referrerId) {
    const { Referrals } = this.ctx.model;
    const getReferred = await Referrals.getReferred({
      referrerId,
      attributes: ["uuid", "avatar", "user_name", "phoneNumber"],
    });
    if (!getReferred) {
      throw new Error("未找到扫码记录");
    }
    return getReferred;
  }

  async saveNew(referrerId, referredUserId) {
    const { Referrals, UserRoles } = this.ctx.model;

    const referrerL1 = await Referrals.findReferred({
      referredUserId,
      attributes: ["uuid", "avatar", "user_name", "phoneNumber"],
    });
    if (!referrerL1) {
      const referrerL2 = await Referrals.findReferred({
        referredUserId: referrerId,
        attributes: ["uuid", "avatar", "user_name", "phoneNumber"],
      });
      if (referrerL2) {
        await Referrals.saveNew({
          referrerId: referrerL2.referrer_id,
          referredUserId,
          referralLevel: 2,
        });
        console.log(
          `用户 ${referredUserId} 已与他的团队长${referrerL2.referrer_id}绑定关系`
        );
      }

      const result = await Referrals.saveNew({
        referrerId,
        referredUserId,
        referralLevel: 1,
      });
      const getaReferrerRole = await UserRoles.getUserHighestRole(referrerId);

      return {
        direct: {
          result,
          getaReferrerRole,
        },
        team: referrerL2,
      };
    }
    // 已有推荐关系
    throw new Error("该用户已有推荐关系，无法再与当前推荐人绑定关系");
  }

  async generateMiniProgramCode(referrerId) {
    const { ctx } = this;
    const { Qrcode } = ctx.model;

    // 生成一个不超过 32 个字符的推广码ID
    const promotionCodeId = uuidv4().replace(/-/g, "").slice(0, 32);

    // 查询数据库是否存在该用户的二维码
    const existingRecord = await Qrcode.get({ referrerId });
    if (existingRecord) {
      // 如果已存在，直接返回二维码记录
      return {
        qrcodeUrl: existingRecord.qrcode,
        promotionCode: existingRecord.promotion_code,
      };
    }

    const accessToken = await ctx.service.jwt.getAccessToken(); // 获取 access_token
    const url = `https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=${accessToken}`;

    const requestData = {
      scene: promotionCodeId, // 参数，限制 32 个可见字符（如推广码 ID）
      width: 280, // 小程序码宽度
    };

    const response = await axios.post(url, requestData, {
      responseType: "arraybuffer",
    });

    if (response.headers["content-type"] === "image/jpeg") {
      try {
        const fileBuffer = Buffer.from(response.data); // 转换为 Buffer

        // 为上传的二维码生成一个唯一的文件名
        const fileName = `qrcode/${promotionCodeId}-${Date.now()}.jpeg`;

        // 使用通用的上传文件方法
        const avatarUrl = await ctx.service.cos.uploadFile(
          fileBuffer,
          fileName,
          "",
          ""
        );

        // 保存二维码记录到数据库（如果需要）
        await Qrcode.saveNew({
          referrerId, // 推广码关联的场景
          promotionCodeId, // 推广码ID
          qrcode: avatarUrl, // 存储在 COS 上的二维码 URL
        });

        return {
          qrcodeUrl: avatarUrl, // 返回 COS 上二维码的 URL
          promotionCode: promotionCodeId,
        };
      } catch (uploadError) {
        console.error("上传二维码到 COS 失败:", uploadError);
        throw new Error("Failed to upload QR code to COS.");
      }
    }
    const error = JSON.parse(response.data.toString());
    throw new Error(`Failed to generate QR code: ${error.errmsg}`);
  }

  async updataQRCode(path, referrerId, promotionCodeId) {
    const { ctx } = this;
    const { Qrcode } = ctx.model;

    // 查询数据库是否存在该用户的二维码
    const existingRecord = await Qrcode.get({ referrerId });
    if (existingRecord) {
      // 如果已存在，直接返回二维码记录
      return { qrcode_path: existingRecord.qrcode };
    }

    // 保存数据到数据库
    const result = await Qrcode.saveNew({
      referrerId, // 确保传递正确的 referrerId
      promotionCodeId,
      qrcode: path,
    });

    return { qrcode_path: result.qrcode };
  }
}

module.exports = ReferralService;
