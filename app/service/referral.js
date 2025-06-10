/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-11-21 16:39:54
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-06-10 17:31:23
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
  async distributeReferralReward(
    user_id,
    items,
    totalSpent,
    membershipLevel,
    options = {}
  ) {
    const { Referrals, Rewards, User, UserRoles, Order } = this.ctx.model;
    const { ctx } = this;
    const { transaction } = options;

    // 查询直接推荐关系
    const directReferral = await Referrals.findReferred({
      referredUserId: user_id,
      attributes: ["uuid", "avatar", "user_name", "phoneNumber"],
    });
    // ▼▼▼ 强化空值检查 ▼▼▼
    if (!directReferral || !directReferral.referrer_id) {
      this.ctx.logger.warn(`用户 ${user_id} 没有直接推荐关系`);
      return;
    }
    const directReferrerId = directReferral.referrer_id;

    const upperReferral = await Referrals.findReferred({
      referredUserId: directReferrerId,
      attributes: ["uuid", "avatar", "user_name", "phoneNumber"],
    });

    // ▼▼▼ 新增空值检查 ▼▼▼
    if (!upperReferral) {
      this.ctx.logger.warn(`用户 ${directReferrerId} 没有上级推荐人`);
      return;
    }
    // 获取上级推荐人信息
    const upperReferrerId = upperReferral.referrer_id;

    // 查询用户订单总数
    const orderCount = await Order.count({
      where: {
        user_id,
        order_status: "completed", // 只统计已完成订单
      },
    });

    // 查询用户累计消费金额
    const totalConsumption = await Order.sum("payment_amount", {
      where: {
        user_id,
        order_status: "completed", // 只统计已完成订单
      },
    });

    // 判断是否满足发放健康币条件
    const referralPoints = await ctx.service.points.getPointsByReferral({
      referrer_id: directReferrerId, // 推荐人ID
      referred_user_id: user_id, // 被推荐人ID
    });

    // 获取首次订单信息
    const firstOrder = await Order.findOne({
      where: {
        user_id,
        order_status: "completed", // 只统计已完成订单
      },
      order: [["createdTime", "ASC"]],
    });

    const shouldGivePoints =
      (orderCount === 1 && totalSpent >= 50) || // 首单达标
      (totalConsumption >= 50 && // 累计达标
        (!referralPoints || // 未发过奖励
          (firstOrder && referralPoints.createdTime < firstOrder.createdTime))); // 防御已有错误数据

    // 发放健康币
    if (shouldGivePoints) {
      // 给直接推荐人发放50个健康币
      await ctx.service.points.saveNew(
        {
          user_id: directReferrerId,
          points: 50,
          source: "referral",
          source_id: user_id, // 新增被推荐人ID
        },
        { transaction }
      );
      this.logger.info(
        `直接推荐奖励发放成功，推荐人: ${directReferrerId}, 健康币x50`
      );

      // 给上级推荐人发放5个健康币
      if (upperReferrerId) {
        await ctx.service.points.saveNew(
          {
            user_id: upperReferrerId,
            points: 5,
            source: "referral",
            source_id: user_id, // 新增被推荐人ID
          },
          { transaction }
        );
        this.logger.info(
          `上级推荐奖励发放成功，推荐人: ${upperReferrerId}, 健康币x5`
        );
      }
    }

    // 会员卡固定返佣逻辑
    if (membershipLevel === "member_card") {
      const fixedReward = 9.9;
      await User.addBalance(user_id, fixedReward, { transaction });
      await Rewards.createReward(
        {
          userId: user_id,
          amount: fixedReward,
          description: `会员卡推荐 ${user_id} 的固定奖励`,
        },
        { transaction }
      );
      this.logger.info(
        `会员卡固定奖励发放成功，获取人: ${user_id}, 奖励金额: ${fixedReward}`
      );
      return;
    }

    // 初始化佣金统计
    let totalDirectReward = 0;
    let totalUpperReward = 0;

    // 遍历所有商品项计算佣金
    for (const { item, goods } of items) {
      const { salePrice, payment_amount } = item;
      const st = payment_amount > 0 ? payment_amount : salePrice;
      const categoryName = goods?.goodsInfo.categoryName || "";

      // const getUserLevel = await UserRoles.getMembershipLevel(user_id);

      // 运动装备特殊分佣逻辑
      if (categoryName === "运动装备") {
        if (st === 298) {
          totalDirectReward += 88;
          totalUpperReward += 20;
        } else if (st === 168) {
          totalDirectReward += 50;
          totalUpperReward += 10;
        }
        totalDirectReward += st * 0.03;
        totalUpperReward += st * 0.005;
      } else if (membershipLevel === "premium") {
        totalDirectReward += st * 0.05; // 直接推荐人奖励
        totalUpperReward += st * 0.01; // 上级推荐人奖励
      } else {
        // 普通商品分佣逻辑
        totalDirectReward += st * 0.03;
        totalUpperReward += st * 0.005;
      }
    }

    this.logger.info(
      `[分佣计算] 用户 ${user_id} 的直接佣金: ${totalDirectReward}, 上级佣金: ${totalUpperReward}`
    );
    // 获取直接推荐人信息

    // 存入直接推荐佣金
    if (totalDirectReward > 0) {
      const finalAmount = Number(totalDirectReward.toFixed(2));
      await User.addBalance(directReferrerId, finalAmount, { transaction });
      await Rewards.createReward(
        {
          userId: directReferrerId,
          amount: finalAmount,
          description: `直接推荐 ${user_id} 的奖励`,
        },
        { transaction }
      );
      this.logger.info(
        `直接推荐奖励发放成功，推荐人: ${directReferrerId}, 奖励金额: ${finalAmount}`
      );
    }

    // 查询上级推荐关系
    if (upperReferral && totalUpperReward > 0) {
      const finalAmount = Number(totalUpperReward.toFixed(2));
      // 存入上级推荐佣金
      await User.addBalance(upperReferrerId, finalAmount, { transaction });
      await Rewards.createReward(
        {
          userId: upperReferrerId,
          amount: finalAmount,
          description: `间接推荐 ${user_id} 的奖励`,
        },
        { transaction }
      );
      this.logger.info(
        `间接推荐奖励发放成功，推荐人: ${upperReferrerId}, 奖励金额: ${finalAmount}`
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

  async getReferrer(promotionCodeId, referrer_id) {
    const { Qrcode } = this.ctx.model;
    const getReferrer = await Qrcode.getReferrer({
      promotionCodeId,
      referrer_id,
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
    const { ctx } = this;
    const { Referrals, UserRoles } = ctx.model;

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

      // 获取直接推荐人角色
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
    const error = new Error("该用户已有推荐关系，无法再与当前推荐人绑定关系");
    error.name = "DuplicateReferralError";
    throw error;
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
      page: "pages/login/index",
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
