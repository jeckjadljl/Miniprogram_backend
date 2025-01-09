/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-11-21 16:39:54
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-01-03 10:37:29
 * @FilePath: \Mini_program_backend\app\service\referral.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

const Service = require("egg").Service;
const axios = require("axios");
const fs = require("fs");

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

      rewardAmount = this.calculateJuniorReward(successfulReferrals);
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

  async generateMiniProgramCode(scene, page) {
    const { ctx } = this;
    const accessToken = await ctx.service.jwt.getAccessToken(); // 获取 access_token
    const url = `https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=${accessToken}`;

    const requestData = {
      scene, // 参数，限制 32 个可见字符（如推广码 ID）
      page,
      width: 280, // 小程序码宽度
    };

    const response = await axios.post(url, requestData, {
      responseType: "arraybuffer",
    });

    // 将小程序码保存到服务器本地
    const filePath = `./qrcodes/${scene}.png`;
    fs.writeFileSync(filePath, response.data);
    return filePath;
  }
}

module.exports = ReferralService;
