/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-02-25 16:25:26
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-04-07 16:54:24
 * @FilePath: \Mini_program_backend\app\service\payments.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

const Service = require("egg").Service;

const axios = require("axios");
const WechatPayUtil = require("../utils/wechatPay");

class PaymentsService extends Service {
  constructor(ctx) {
    super(ctx); // 新增super调用
    this.ctx = ctx;
    this.config = ctx.app.config.wechatPay;
  }

  async createPayment(orderData = {}) {
    const { mchId, appId, notify_url } = this.config;
    const generateOutTradeNo = () => {
      // 组合生成规则：时间戳(13位) + 商户号后4位 + 6位随机数
      const timestamp = Date.now();
      const mchSuffix = this.config.mchId.slice(-4); // 获取商户号后四位
      const random = Math.floor(Math.random() * 899999 + 100000); // 6位随机数

      return `MCH${mchSuffix}T${timestamp}R${random}`;
    };
    const url = "/v3/pay/transactions/jsapi"; // 小程序下单接口
    const method = "POST";
    const out_trade_no = generateOutTradeNo();
    const body = JSON.stringify({
      description: orderData.description,
      out_trade_no, // 注入自动生成的订单号
      mchid: mchId,
      appid: appId,
      notify_url,
      amount: {
        total: orderData.amount.total,
      },
      payer: {
        openid: orderData.payer.openid,
      },
    });

    console.log("创建支付请求参数:", body);
    // 获取签名和Authorization头
    const wechatPayUtil = new WechatPayUtil(this.ctx);
    const authData = await wechatPayUtil.getAuthorization(method, url, body);

    console.log("签名和Authorization头timestamp参数:", authData.timestamp);
    console.log("签名和Authorization头nonce_str参数:", authData.nonce_str);
    console.log("签名和Authorization头signature参数:", authData.signature);
    const headers = {
      "Content-Type": "application/json",
      Authorization: `WECHATPAY2-SHA256-RSA2048 mchid="${authData.mchid}",nonce_str="${authData.nonce_str}",signature="${authData.signature}",timestamp="${authData.timestamp}",serial_no="${authData.serial_no}"`,
    };

    try {
      const response = await axios.post(
        `https://api.mch.weixin.qq.com${url}`,
        body,
        { headers }
      );

      const responseData = response.data;
      console.log("微信支付响应数据:", responseData);

      // 检查是否成功获取 prepay_id
      if (responseData) {
        console.log("请求体数据：", JSON.parse(body));
        // 将支付数据存储到数据库
        await this.savePaymentData(
          JSON.parse(body),
          orderData.business_order_id,
          responseData
        );

        // 生成调起支付参数并签名
        const paymentParams = await wechatPayUtil.generatePaymentParams(
          responseData.prepay_id
        );
        return paymentParams;
      }
      throw new Error("Failed to get prepay_id from WeChat Pay");
    } catch (error) {
      this.ctx.logger.error("微信支付请求失败:", error);
      throw error;
    }
  }

  // 保存支付数据到数据库
  async savePaymentData(orderData, business_order_id, wechatResponse) {
    if (
      !orderData?.amount?.total &&
      !business_order_id &&
      !orderData?.payer?.openid
    ) {
      throw new Error("Invalid orderData structure");
    }
    const { ctx } = this;
    const { amount, out_trade_no, appid, mchid, payer } = orderData;
    const { total } = amount;
    const { openid } = payer;
    const { prepay_id } = wechatResponse;

    const user_id = ctx.state.user.uid;
    // 新增数组转换逻辑
    const businessOrderIds = Array.isArray(business_order_id)
      ? business_order_id
      : [business_order_id];
    // 构造存储数据
    const paymentData = {
      user_id, // 假设用户ID存储在 session 中
      prepay_id,
      business_order_id: businessOrderIds,
      out_trade_no, // 假设商户订单号和业务订单号一致
      payment_status: "unpaid", // 初始状态为未支付
      payment_method: "wechat_pay",
      appId: appid,
      mchId: mchid,
      openId: openid,
      total_amount: total,
    };

    // 保存到数据库
    await ctx.model.Payments.saveNew(paymentData);
    this.ctx.logger.info(`支付数据保存成功: 订单号 ${business_order_id}`);
  }

  async queryOrder(params = {}) {
    const { app, ctx } = this;
    const { mchId } = this.config;
    const { user_id, userName, orderIds, memberCartData } = params;
    console.log("查询订单IDs:", orderIds);

    // 修改后的查询条件
    const whereClause = {
      user_id,
      [app.Sequelize.Op.and]: app.Sequelize.where(
        app.Sequelize.fn(
          "JSON_CONTAINS",
          app.Sequelize.col("business_order_id"),
          app.Sequelize.literal(`'${JSON.stringify(orderIds)}'`)
        ),
        "=",
        1
      ),
    };

    const order = await app.model.Payments.findOne({
      where: whereClause,
    });

    console.log("查询订单:", order);
    if (!order) {
      throw new Error(`订单不存在: ${orderIds}`);
    }
    // ✅ 正确API路径（微信官方文档要求）
    const url = `/v3/pay/transactions/out-trade-no/${order.out_trade_no}?mchid=${mchId}`;
    const method = "GET";
    // 获取签名和Authorization头
    const wechatPayUtil = new WechatPayUtil(this.ctx);
    const authData = await wechatPayUtil.getAuthorization(method, url);
    const headers = {
      "Content-Type": "application/json",
      Authorization: `WECHATPAY2-SHA256-RSA2048 mchid="${authData.mchid}",nonce_str="${authData.nonce_str}",signature="${authData.signature}",timestamp="${authData.timestamp}",serial_no="${authData.serial_no}"`,
    };

    try {
      const response = await axios.get(`https://api.mch.weixin.qq.com${url}`, {
        headers,
      });
      console.log("微信支付查询响应:", response.data);
      if (response.data && response.data.trade_state === "SUCCESS") {
        // 获取所有关联订单
        const orderPromises = order.business_order_id.map(orderId =>
          ctx.service.order.getOrderFromPayments({ uuid: orderId })
        );
        // const getorder = await ctx.service.order.getOrderFromPayments({
        //   uuid: order.business_order_id,
        // });
        // if (!getorder) {
        //   throw new Error(`订单不存在: ${order.out_trade_no}`);
        // }
        // 等待所有订单查询完成
        const orders = await Promise.all(orderPromises);
        // 计算总金额
        const totalAmount = orders.reduce(
          (sum, order) => sum + order.total_amount,
          0
        );

        console.log(orders);
        // 检查是否有订单包含会员卡
        const hasMemberCard = orders.some(order =>
          order.orderitems.some(item => item.member_card_id)
        );
        if (hasMemberCard) {
          this.ctx.logger.info("订单包含会员卡，跳过会员晋升逻辑");
          // 会员卡固定返佣
          await ctx.service.referral.distributeReferralReward({
            user_id: order.user_id,
            items: [], // 传入空数组表示会员卡返佣
            membershipLevel: "member_card", // 特殊标识
          });
        } else {
          // 非会员卡购买，执行会员晋升逻辑
          const result = await ctx.service.membership.checkAndUpgradeMembership(
            order.user_id,
            totalAmount
          );

          // 筛选运动装备商品项
          const allItems = [];
          for (const order of orders) {
            for (const item of order.orderitems) {
              // 获取商品类别信息
              const goods = await ctx.service.goods.get({
                goods_id: item.goods_id,
                orgUuid: order.orgUuid,
              });

              // 添加空值检查
              if (!goods) {
                ctx.logger.warn(`未找到商品ID为 ${item.goods_id} 的商品信息`);
                continue;
              }

              allItems.push({
                item,
                order,
                goods,
              });
            }
          }

          // 统一计算分佣
          await ctx.service.referral.distributeReferralReward({
            user_id: order.user_id,
            items: allItems,
            membershipLevel: result.membership_level, // 根据实际情况传入会员等级
          });
        }

        // 处理每个订单
        for (const getorder of orders) {
          if (!getorder) {
            throw new Error(`订单不存在: ${order.out_trade_no}`);
          }
          const modifyInfo = app.getModifyInfo(user_id, userName);
          const modify = await ctx.model.Order.update(
            {
              order_status: "paid",
              ...modifyInfo,
            },
            {
              where: { uuid: getorder.uuid, user_id },
            }
          );
          if (!modify) {
            throw new Error(`订单修改失败: ${order.out_trade_no}`);
          }

          console.log("会员卡数据:", memberCartData);
          if (memberCartData) {
            const membercardrecord = await ctx.service.memberCardRecord.saveNew(
              {
                user_id: order.user_id,
                member_card_id: memberCartData.member_card_id,
                card_name: memberCartData.card_name,
                card_image: memberCartData.card_image,
                salePrice: memberCartData.salePrice,
                tag: memberCartData.tag,
                card_type: memberCartData.card_type,
                membership_level: memberCartData.membership_level,
                description: memberCartData.description || null,
              }
            );

            if (!membercardrecord) {
              throw new Error(`会员卡记录保存失败: ${order.out_trade_no}`);
            }
            this.ctx.logger.info(
              `用户${order.user_id}获得${memberCartData.card_name}会员卡`
            );
          }

          // 遍历订单商品项
          for (const item of getorder.orderitems) {
            // 发放抵用券
            if (item.voucher_id) {
              await ctx.service.vouchers.saveNew({
                user_id: order.user_id,
                voucher_id: item.voucher_id,
                voucher_name: item.voucher_name,
                voucher_image: item.voucher_image,
                voucher_type: item.voucher_type,
                voucher_quantity: item.voucher_quantity, // 修正拼写错误
              });
              this.ctx.logger.info(
                `用户${order.user_id}获得${item.voucher_name}`
              );
            }

            // 发放健康币
            if (item.points && item.points > 0) {
              await ctx.service.points.saveNew({
                user_id: order.user_id,
                points: item.points,
              });
              this.ctx.logger.info(
                `用户${order.user_id}获得${item.health_coin}健康币`
              );
            }
          }
        }
        console.log("微信支付响应数据:", response.data);
        return {
          mchid: response.data.mchid,
          out_trade_no: response.data.out_trade_no,
          transaction_id: response.data.transaction_id,
          trade_state: response.data.trade_state,
          success_time: response.data.success_time,
          payer: response.data.payer,
          trade_state_desc: response.data.trade_state_desc,
          trade_type: response.data.trade_type,
        };
      }
      console.error("微信支付查询失败:", response.data);
      throw new Error("微信支付查询失败");
    } catch (error) {
      // ✅ 错误处理增强
      if (error.response) {
        const { status, data } = error.response;
        throw new Error(`微信接口错误 ${status}: ${JSON.stringify(data)}`);
      }
      throw error;
    }
  }

  async updateOrderStatus(outTradeNo, updateData) {
    const { app } = this;
    const { transaction_id, trade_state, trade_state_desc, success_time } =
      updateData;

    // 查询订单
    const order = await app.model.Payments.findOne({
      where: { out_trade_no: outTradeNo },
    });
    if (!order) {
      throw new Error(`订单不存在: ${outTradeNo}`);
    }

    const getUser = await app.model.User.findOne({
      where: { uuid: order.user_id },
    });
    if (!getUser) {
      throw new Error(`用户不存在: ${order.user_id}`);
    }

    if (trade_state === "SUCCESS") {
      // 更新订单状态
      await order.update({
        transaction_id,
        payment_status: "paid",
        trade_state,
        trade_state_desc,
        pay_time: success_time,
      });
    }

    this.ctx.logger.info(`订单状态更新成功: ${outTradeNo}`);
    return transaction_id;
  }

  async paymentsOrderQuery(goodsOrder = {}) {
    const { app, ctx } = this;
    try {
      const order = await ctx.service.order.saveNew(goodsOrder);
      if (order) {
        console.log("创建订单成功：", order);
        const paymentsParams = {
          description: "满满严料铺",
          amount: {
            total: order.totalAmount,
          },
          payer: {
            openid: order.openid,
          },
          business_order_id: order.orderUuids,
        };
        const payments = await this.createPayment(paymentsParams);
        if (!payments) {
          throw new Error("创建支付订单失败");
        }
        console.log("创建支付订单成功：", payments);
        return {
          orderIds: order.orderUuids,
          payments,
        };
      }
    } catch (error) {
      // ✅ 错误处理增强
      this.ctx.logger.error("微信支付请求失败:", error);
      throw error;
    }
  }
}

module.exports = PaymentsService;
