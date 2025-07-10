/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-02-25 16:25:26
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-07-10 15:23:17
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
    const now = new Date();
    const expireTime = new Date(now.getTime() + 30 * 60000);
    const time_expire = expireTime.toISOString().split(".")[0] + "+08:00"; // 北京时间

    const amountInYuan = orderData.amount.total;
    const amountInCents = Math.round(amountInYuan * 100); // 转换为分，并四舍五入
    // const amountInCents = 10;

    const url = "/v3/pay/transactions/jsapi"; // 小程序下单接口
    const method = "POST";
    const out_trade_no = orderData.out_trade_no
      ? orderData.out_trade_no
      : this.generateOutTradeNo();
    const body = JSON.stringify({
      description: orderData.description,
      out_trade_no, // 注入自动生成的订单号
      mchid: mchId,
      appid: appId,
      notify_url,
      time_expire, // 新增支付过期时间
      amount: {
        total: amountInCents,
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

        // 判断是否是重新调起原有的支付订单
        if (orderData.out_trade_no) {
          console.log(`重新调起支付订单${orderData.out_trade_no}`);
          const paymentParams = await wechatPayUtil.generatePaymentParams(
            responseData.prepay_id
          );
          return paymentParams;
        }
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

  async groupBuyPayment(orderData = {}) {
    const { business_order_id } = orderData;
    const payments = await this.createPayment(orderData);
    if (!payments) {
      throw new Error("创建支付订单失败");
    }

    return {
      autoCancelTime: 1800,
      orderIds: business_order_id,
      payments,
    };
  }

  // 提取订单号生成方法（原createPayment中的逻辑）
  generateOutTradeNo() {
    const timestamp = Date.now();
    const mchSuffix = this.config.mchId.slice(-6);
    const random = Math.floor(Math.random() * 899999 + 100000);
    return `M${timestamp}${random}${mchSuffix}`;
  }

  async closeOrder(outTradeNo) {
    const { mchId } = this.config;
    const url = `/v3/pay/transactions/out-trade-no/${outTradeNo}/close`;
    const method = "POST";
    const body = JSON.stringify({ mchid: mchId });

    // 获取签名和Authorization头
    const wechatPayUtil = new WechatPayUtil(this.ctx);
    const authData = await wechatPayUtil.getAuthorization(method, url, body);

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

      if (response.status === 204) {
        this.ctx.logger.info(`订单关闭成功: ${outTradeNo}`);

        // ▼▼▼ 新增状态查询和更新逻辑 ▼▼▼
        // 调用查询接口获取最新状态
        const queryUrl = `/v3/pay/transactions/out-trade-no/${outTradeNo}?mchid=${mchId}`;
        const queryAuth = await wechatPayUtil.getAuthorization("GET", queryUrl);

        const queryResponse = await axios.get(
          `https://api.mch.weixin.qq.com${queryUrl}`,
          {
            headers: {
              Authorization: `WECHATPAY2-SHA256-RSA2048 mchid="${queryAuth.mchid}",nonce_str="${queryAuth.nonce_str}",signature="${queryAuth.signature}",timestamp="${queryAuth.timestamp}",serial_no="${queryAuth.serial_no}"`,
            },
          }
        );

        // 更新本地支付记录
        await this.ctx.model.Payments.update(
          {
            trade_state: queryResponse.data.trade_state,
            trade_state_desc: queryResponse.data.trade_state_desc,
            payment_status:
              queryResponse.data.trade_state === "CLOSED" ? "closed" : "unpaid",
          },
          {
            where: { out_trade_no: outTradeNo },
          }
        );
        // ▲▲▲ 新增逻辑结束 ▲▲▲

        return { success: true };
      }
      throw new Error(`关闭订单失败: ${response.status}`);
    } catch (error) {
      this.ctx.logger.error("关闭订单请求失败:", error);
      throw error;
    }
  }

  async continuePayment(params = {}) {
    const { ctx } = this;
    const { orderIds, user_id, userName } = params;

    try {
      // 2. 调用微信接口查询最新状态
      const wxOrder = await this.queryOrder({
        orderIds,
        user_id,
      });

      // 3. 根据微信订单状态处理
      if (wxOrder.trade_state !== "NOTPAY") {
        throw new Error(`订单当前状态不可支付：[${wxOrder.trade_state}]`);
      }

      const order = wxOrder.paymentsOrder;
      // 4. 判断是否超时（同时校验本地和微信的时间）
      const isTimeout =
        Date.now() > new Date(order.createdTime).getTime() + 30 * 60000;

      // 5. 准备支付参数
      const paymentParams = {
        description: "满满严料铺",
        amount: { total: order.total_amount / 100 },
        payer: { openid: order.openId },
        business_order_id: orderIds,
        out_trade_no: isTimeout
          ? this.generateOutTradeNo()
          : order.out_trade_no,
      };
      console.log("准备支付参数:", paymentParams);

      // 6. 调用原有支付方法
      return await this.createPayment(paymentParams);
    } catch (error) {
      ctx.logger.error("继续支付失败:", error);
      throw new Error("支付订单已过期，请重新创建");
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
    const result = await ctx.model.Payments.saveNew(paymentData);

    if (result) {
      const autoCancelSeconds = 1800; // 保持与定时任务一致
      const createdAt = new Date();

      // 修改后的延迟任务添加逻辑 ▼▼▼
      await ctx.service.bullmq.addDelayJob(
        "taskQueue",
        "closePaymentAndOrders", // 新任务类型
        {
          paymentId: result.uuid, // 支付记录ID
          orderIds: businessOrderIds, // 全部订单ID数组
          outTradeNo: out_trade_no, // 支付单号
        },
        autoCancelSeconds
      );
      this.ctx.logger.info(
        `订单创建成功，已设置30分钟后自动取消: 包含订单 ${businessOrderIds.join(
          ","
        )}`
      );

      // 存储Redis时间戳
      await ctx.service.redis.set(
        `payments:${result.uuid}:createdAt`,
        createdAt.getTime(),
        autoCancelSeconds,
        "order"
      );
      // 使用更精确的任务命名
      // await ctx.service.bullmq.addDelayJob(
      //   "taskQueue",
      //   "closePayment",
      //   {
      //     outTradeNo: out_trade_no,
      //   },
      //   1800
      // );

      this.ctx.logger.info(
        `支付数据保存成功: 支付记录 ${
          result.uuid
        } 包含订单 ${businessOrderIds.join(",")}`
      );
      return result;
    }
    throw new Error("Failed to save payment data");
  }

  async updatePaymentData(orderData) {
    const { app, ctx } = this;
    const { amount, out_trade_no, out_refund_no } = orderData;
    const { total, refund } = amount;

    const refundPaymentData = {
      out_trade_no,
      out_refund_no,
      refund_amount: refund,
    };

    const result = await ctx.model.Payments.saveModify(refundPaymentData);
    return result;
  }

  async getByOutTradeNo(params = {}) {
    const { app } = this;
    const { Payments } = app.model;
    const result = Payments.getByOutTradeNo(params);
    console.log("result", result);
    return result;
  }

  async getByOrderIds(params = {}) {
    const { app } = this;
    const { Payments } = app.model;
    const result = await Payments.getByOrderIds(params);
    return result;
  }

  async getByUuid(uuid) {
    const { app } = this;
    const { Payments } = app.model;
    const result = await Payments.getByUuid(uuid);
    return result;
  }

  async getUnpaid(params = {}) {
    const { app } = this;
    const result = await app.model.Payments.getUnpaid(params);
    return result;
  }

  async queryOrder(params = {}) {
    const { app, ctx } = this;
    const { User } = app.model;
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
        // 等待所有订单查询完成
        const orders = await Promise.all(orderPromises);
        // 计算总金额
        const totalAmount = orders.reduce(
          (sum, order) => sum + order.payment_amount,
          0
        );
        await User.cumulativeSpent(user_id, totalAmount);
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
          console.log("订单不包含会员卡，继续执行");
          // 将发放奖励的逻辑移到订单完成逻辑中执行
          // // 非会员卡购买，执行会员晋升逻辑
          // const result = await ctx.service.membership.checkAndUpgradeMembership(
          //   order.user_id,
          //   totalAmount
          // );

          // // 筛选运动装备商品项
          // const allItems = [];
          // for (const order of orders) {
          //   for (const item of order.orderitems) {
          //     // 获取商品类别信息
          //     const goods = await ctx.service.goods.get({
          //       goods_id: item.goods_id,
          //       orgUuid: order.orgUuid,
          //     });

          //     // 添加空值检查
          //     if (!goods) {
          //       ctx.logger.warn(`未找到商品ID为 ${item.goods_id} 的商品信息`);
          //       continue;
          //     }

          //     allItems.push({
          //       item,
          //       order,
          //       goods,
          //     });
          //   }
          // }

          // // 统一计算分佣
          // await ctx.service.referral.distributeReferralReward({
          //   user_id: order.user_id,
          //   items: allItems,
          //   totalSpent: result.totalSpent,
          //   membershipLevel: result.memberLevel, // 根据实际情况传入会员等级
          // });
        }

        // 处理每个订单
        for (const getorder of orders) {
          if (!getorder) {
            throw new Error(`订单不存在: ${order.out_trade_no}`);
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

            // 更新订单状态
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

            // 新增订单项状态更新 ▼▼▼
            await ctx.model.OrderItem.update(
              { status: "paid" },
              {
                where: { order_id: getorder.uuid, uuid: item.uuid },
                transaction: modify.transaction, // 使用相同事务
              }
            );

            if (!modify) {
              throw new Error(`订单修改失败: ${order.out_trade_no}`);
            }

            // ▼▼▼ 新增健康币扣减逻辑 ▼▼▼
            // if (item.points_amount && item.points_amount > 0) {
            //   await ctx.service.points.subtract({
            //     user_id: order.user_id,
            //     points: item.points_amount, // 使用负数进行扣减
            //     source: "order_deduction",
            //     description: `订单 ${getorder.uuid} 健康币抵扣`,
            //   });
            //   this.ctx.logger.info(
            //     `用户${order.user_id}扣减${item.points_amount}健康币，订单项ID: ${item.uuid}`
            //   );
            // }
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

      return {
        paymentsOrder: order,
        mchid: response.data.mchid,
        out_trade_no: response.data.out_trade_no,
        transaction_id: response.data.transaction_id,
        trade_state: response.data.trade_state,
        success_time: response.data.success_time,
        payer: response.data.payer,
        trade_state_desc: response.data.trade_state_desc,
      };
      // console.error("微信支付查询失败:", response.data);
      // throw new Error("微信支付查询失败");
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
    const { app, ctx } = this;
    const { GoodsSales } = this.ctx.model;
    const { transaction_id, trade_state, trade_state_desc, success_time } =
      updateData;

    // 查询订单
    const payment = await app.model.Payments.findOne({
      where: { out_trade_no: outTradeNo },
    });
    if (!payment) {
      throw new Error(`订单不存在: ${outTradeNo}`);
    }

    const getUser = await app.model.User.findOne({
      where: { uuid: payment.user_id },
    });
    if (!getUser) {
      throw new Error(`用户不存在: ${payment.user_id}`);
    }

    if (trade_state === "SUCCESS") {
      // 更新订单状态
      await payment.update({
        transaction_id,
        payment_status: "paid",
        trade_state,
        trade_state_desc,
        pay_time: success_time,
      });

      // 获取所有关联订单
      const orderPromises = payment.business_order_id.map(orderId =>
        ctx.service.order.getOrderFromPayments({ uuid: orderId })
      );
      const orders = await Promise.all(orderPromises);

      // 记录商品销量
      if (orders && orders.length > 0) {
        for (const order of orders) {
          if (order && order.orderitems) {
            for (const item of order.orderitems) {
              await GoodsSales.recordSales(
                item.goods_id,
                item.spec,
                item.quantity
              );
            }
          }
        }
      }

      this.ctx.logger.info(
        `支付成功: 订单号 ${outTradeNo}, 交易状态: ${trade_state}, 描述: ${trade_state_desc}`
      );
    }

    this.ctx.logger.info(`订单状态更新成功: ${outTradeNo}`);
    return transaction_id;
  }

  async updateRefundStatus(out_trade_no, updateData) {
    const { app, ctx } = this;
    const { GoodsSales } = this.ctx.model;
    const {
      // transaction_id,
      payment_status,
      refund_status,
      out_refund_no,
      refund_id,
      refund_success_time,
    } = updateData;

    const payment = await app.model.Payments.findOne({
      where: { out_trade_no },
    });
    if (!payment) {
      throw new Error(`订单不存在: ${out_trade_no}`);
    }

    const getUser = await app.model.User.findOne({
      where: { uuid: payment.user_id },
    });
    if (!getUser) {
      throw new Error(`用户不存在: ${payment.user_id}`);
    }

    if (refund_status === "SUCCESS") {
      // 更新订单状态
      await payment.update({
        payment_status,
        refund_status,
        out_refund_no,
        refund_id,
        refund_success_time,
      });

      // 获取所有关联订单
      const orderPromises = payment.business_order_id.map(orderId =>
        ctx.service.order.getOrderFromPayments({ uuid: orderId })
      );
      const orders = await Promise.all(orderPromises);

      // 记录商品销量
      if (orders && orders.length > 0) {
        for (const order of orders) {
          if (order && order.orderitems) {
            for (const item of order.orderitems) {
              try {
                await GoodsSales.reverseSales(
                  item.goods_id,
                  item.spec,
                  item.quantity
                );
                this.ctx.logger.info(
                  `已恢复商品库存: 商品ID ${item.goods_id} 规格 ${item.spec} 数量 ${item.quantity}`
                );
              } catch (error) {
                this.ctx.logger.error(
                  `商品销量恢复失败：商品ID ${item.goods_id} 规格 ${item.spec} 数量 ${item.quantity}`,
                  error
                );
              }
            }
          }
        }
      }

      this.ctx.logger.info(
        `退款成功: 订单号 ${out_refund_no}, 退款状态: ${refund_status}`
      );
    }
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
          autoCancelTime: order.autoCancelTime,
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

  async refundPayments(params = {}) {
    const { out_trade_no, reason, amount } = params;
    const { notify_url } = this.config;
    const url = "/v3/refund/domestic/refunds";
    const method = "POST";

    // 生成退款单号（规则与支付单号类似）
    const out_refund_no = this.generateOutTradeNo().replace("MCH", "REF");

    const body = JSON.stringify({
      out_trade_no,
      out_refund_no,
      reason,
      notify_url: `${notify_url}/refund`, // 使用独立的退款通知地址
      amount: {
        refund: Math.round(amount.refund * 100), // 转为分
        total: Math.round(amount.total * 100), // 实际应查询原订单金额
        currency: "CNY",
      },
    });

    const wechatPayUtil = new WechatPayUtil(this.ctx);
    const authData = await wechatPayUtil.getAuthorization(method, url, body);

    try {
      const response = await axios.post(
        `https://api.mch.weixin.qq.com${url}`,
        body,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `WECHATPAY2-SHA256-RSA2048 mchid="${authData.mchid}",nonce_str="${authData.nonce_str}",signature="${authData.signature}",timestamp="${authData.timestamp}",serial_no="${authData.serial_no}"`,
          },
        }
      );

      // 更新本地退款状态
      if (response.data) {
        const result = await this.updatePaymentData(JSON.parse(body));
        if (result) {
          return response.data;
        }
      }
      // await this.updateOrderStatus(out_trade_no, {
      //   refund_status: "processing",
      //   out_refund_no,
      //   refund_id: response.data.refund_id,
      // });
    } catch (error) {
      this.ctx.logger.error("微信退款请求失败:", error);
      throw new Error(
        `退款失败: ${error.response?.data?.message || error.message}`
      );
    }
  }

  async getAutoCancelTime(paymentId) {
    const { app, ctx } = this;

    // 获取订单专用的redis客户端
    const redis = app.redis.get("order");

    // 直接从Redis获取时间戳
    const [createdTimestamp, ttl] = await Promise.all([
      ctx.service.redis.get(`payments:${paymentId}:createdAt`, "order"),
      redis.ttl(`payments:${paymentId}:createdAt`),
    ]);

    if (!createdTimestamp || ttl < 0) {
      return { valid: false, remaining: null };
    }

    return {
      valid: true,
      remaining: ttl,
      expiresAt: new Date(parseInt(createdTimestamp) + 1800 * 1000),
    };
  }

  async getOrdersForDelivery(transactionId) {
    const { ctx, app } = this;

    // 1. 通过交易单号获取支付记录
    const payment = await ctx.model.Payments.findOne({
      where: { transaction_id: transactionId },
    });

    if (!payment) {
      throw new Error("支付记录不存在");
    }

    // 2. 获取关联的所有订单（使用新的查询方式）

    const orderPromises = payment.business_order_id.map(
      orderId =>
        console.log("订单ID:", orderId) ||
        ctx.service.order.getOrderFromPayments({
          uuid: orderId,
        })
    );

    const orders = await Promise.all(orderPromises);

    return orders.filter(Boolean).map(order => ({
      orderId: order.uuid,
      items: order.orderitems.map(item => ({
        名称: item.name,
        规格: item.spec,
        价格: item.payment_amount,
        数量: item.quantity,
      })),
      收货信息: {
        联系人: order.address.linkMan,
        电话: order.address.linkPhone,
        地址: `${order.address.province} ${order.address.city} ${order.address.district} ${order.address.detail}`,
      },
    }));
  }

  /**
   *
   * 微信支付分
   */

  // 新增微信支付分创建订单方法
  async createPaymentScoreOrder(orderParams = {}) {
    const { mchId, appId, notify_url, service_id } = this.config;
    const url = "/v3/payscore/serviceorder";
    const method = "POST";

    const out_order_no = this.generateOutTradeNo().replace("MCH", "PSF"); // 生成支付分专用订单号
    const body = JSON.stringify({
      out_order_no,
      service_id,
      service_introduction:
        orderParams.service_introduction || "满满严料铺服务",
      time_range: {
        start_time: new Date().toISOString().split(".")[0] + "+08:00",
        end_time:
          orderParams.end_time ||
          new Date(Date.now() + 3600 * 1000).toISOString().split(".")[0] +
            "+08:00",
      },
      risk_fund: {
        name: "ESTIMATE_ORDER_COST",
        amount: Math.round(orderParams.estimate_amount * 100),
        description: "预估费用",
      },
      notify_url: `${notify_url}/payscore`, // 支付分专用回调地址
      openid: orderParams.openid,
      post_payments: orderParams.post_payments || [],
      post_discounts: orderParams.post_discounts || [],
      location: orderParams.location || {
        start_location: "上海满满严料铺",
        end_location: "上海满满严料铺",
      },
    });

    // 获取支付分专用Authorization
    const wechatPayUtil = new WechatPayUtil(this.ctx);
    const authData = await wechatPayUtil.getAuthorization(method, url, body);

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

      // 保存支付分订单数据
      await this.savePaymentScoreData({
        ...JSON.parse(body),
        wechatResponse: response.data,
      });

      return {
        appId,
        service_id,
        out_order_no,
        package: response.data.package,
        sign_type: "RSA",
        timestamp: authData.timestamp,
        nonce_str: authData.nonce_str,
        sign: authData.signature,
      };
    } catch (error) {
      this.ctx.logger.error("支付分订单创建失败:", error);
      throw new Error(
        `支付分订单创建失败: ${error.response?.data?.message || error.message}`
      );
    }
  }

  // 新增支付分订单存储方法
  async savePaymentScoreData(orderData) {
    const { ctx } = this;
    const paymentData = {
      user_id: ctx.state.user?.uid,
      out_order_no: orderData.out_order_no,
      service_id: orderData.service_id,
      total_amount: orderData.risk_fund.amount,
      payment_status: "created",
      payment_method: "wechat_payscore",
      extra_data: {
        wechatResponse: orderData.wechatResponse,
        location: orderData.location,
        time_range: orderData.time_range,
      },
    };

    const result = await ctx.model.PaymentScores.saveNew(paymentData);
    if (!result) {
      throw new Error("支付分订单保存失败");
    }
    return result;
  }

  async completePaymentScoreOrder(params = {}) {
    const { mchId, service_id } = this.config;
    const { out_order_no, real_service_end_time } = params;
    const url = `/v3/payscore/serviceorder/${out_order_no}/complete`;
    const method = "POST";

    const body = JSON.stringify({
      service_id,
      mchid: mchId,
      type: "OrderedService",
      finish_time: new Date().toISOString().split(".")[0] + "+08:00",
      real_service_end_time:
        real_service_end_time ||
        new Date().toISOString().split(".")[0] + "+08:00",
    });

    const wechatPayUtil = new WechatPayUtil(this.ctx);
    const authData = await wechatPayUtil.getAuthorization(method, url, body);

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

      // 更新本地支付分订单状态
      await this.ctx.model.PaymentScores.update(
        {
          payment_status: "completed",
          complete_time: new Date(),
          trade_state: response.data.service_state,
          transaction_id: response.data.transaction_id,
        },
        {
          where: { out_order_no },
        }
      );

      return response.data;
    } catch (error) {
      this.ctx.logger.error("支付分订单完结失败:", error);
      throw new Error(
        `支付分订单完结失败: ${error.response?.data?.message || error.message}`
      );
    }
  }
}

module.exports = PaymentsService;
