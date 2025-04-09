/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-03-10 11:44:17
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-03-10 12:06:41
 * @FilePath: \Mini_program_backend\app\utils\testMemberCard.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
const axios = require("axios");

const appid = process.env.WX_PUBLIC_ACCOUNTS_APPID; // 小程序的 appid
const secret = process.env.WX_PUBLIC_ACCOUNTS_APPSECRET; // 小程序的密钥

class TestMemberCard {
  constructor(ctx) {
    this.ctx = ctx;
  }

  async getAccessToken(appid, secret) {
    const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${secret}`;
    const response = await axios.get(url);
    return response.data.access_token;
  }

  async createMembershipCard(accessToken, cardData) {
    const url = `https://api.weixin.qq.com/card/create?access_token=${accessToken}`;
    const response = await axios.post(url, cardData);
    console.log("创建会员卡结果：", response.data);
    return response.data;
  }

  async saveNew(cardData) {
    const accessToken = this.getAccessToken(appid, secret);
    // const cardData = {
    //   card: {
    //     card_type: "MEMBER_CARD",
    //     member_card: {
    //       base_info: {
    //         logo_url: "https://example.com/logo.jpg",
    //         brand_name: "满豆破三跑团",
    //         code_type: "QR_CODE",
    //         title: "绿卡会员卡",
    //         color: "Color010",
    //         notice: "消费1元积0.1分",
    //         service_phone: "1234567890",
    //         description: "绿卡会员专享权益：保险、咖啡券或健康币",
    //         date_info: {
    //           type: "DATE_TYPE_FIX_TIME_RANGE",
    //           begin_timestamp: Date.now(),
    //           end_timestamp: Date.now() + 365 * 24 * 60 * 60 * 1000,
    //         },
    //         sku: {
    //           quantity: 1000,
    //         },
    //         get_limit: 1,
    //         use_custom_code: false,
    //         can_share: true,
    //         can_give_friend: true,
    //       },
    //       advanced_info: {
    //         custom_field1: {
    //           name: "会员等级",
    //           value: "绿卡",
    //         },
    //         custom_field2: {
    //           name: "积分",
    //           value: "0",
    //         },
    //       },
    //       member_card_info: {
    //         base_info: {
    //           prerogative: "绿卡会员专享权益：保险、咖啡券或健康币",
    //           initial_amount: 0,
    //           max_amount: 10000,
    //           pay_amount: 198,
    //           balance_strategy: 1,
    //         },
    //         supply_bonus_info: {
    //           supply_bonus_strategy: 1,
    //           supply_bonus_rule: "消费1元积0.1分",
    //         },
    //         deduct_bonus_info: {
    //           deduct_bonus_strategy: 1,
    //         },
    //       },
    //     },
    //   },
    // };

    const result = this.createMembershipCard(accessToken, cardData);
    console.log("会员卡创建结果：", result);
  }
}
module.exports = TestMemberCard;
