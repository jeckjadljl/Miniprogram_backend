/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-04-29 20:34:19
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-05-05 16:15:19
 * @FilePath: \Mini_program_backend\app\service\logistics.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

const axios = require("axios");

const Service = require("egg").Service;

class LogisticsService extends Service {
  constructor(ctx) {
    super(ctx);
    this.jwt = ctx.service.jwt;
  }

  async getAllDelivery() {
    try {
      const access_token = await this.jwt.getAccessToken();

      // 构造请求 URL
      const url = `https://api.weixin.qq.com/cgi-bin/express/business/delivery/getall?access_token=${access_token}`;

      // 发起 GET 请求
      const response = await axios.get(url);

      if (response.data.errcode === 0) {
        return response.data;
      }
      // 如果 errcode 不为 0，抛出错误
      throw new Error(`获取快递公司列表失败：${response.data.errmsg}`);
    } catch (error) {
      // 捕获并处理错误
      this.ctx.logger.error("getAllDelivery error:", error);
      throw error;
    }
  }

  async traceWaybill({
    orderId,
    openid,
    receiverPhone,
    waybillId,
    goodsInfo,
    transId,
  }) {
    const accessToken = await this.jwt.getAccessToken();
    console.log("accessToken:", accessToken);
    const url = `https://api.weixin.qq.com/cgi-bin/express/delivery/open_msg/trace_waybill?access_token=${accessToken}`;
    const data = {
      openid,
      receiver_phone: receiverPhone,
      waybill_id: waybillId,
      goods_info: {
        detail_list: goodsInfo.detail_list.map(item => ({
          goods_name: item.goods_name,
          goods_img_url: item.goods_img_url,
        })),
      },
      trans_id: transId,
    };

    console.log("data:", data);
    const response = await axios.post(url, data);
    console.log("response:", response.data);
    if (
      response.status === 200 &&
      response.data &&
      response.data.waybill_token
    ) {
      // 将waybill_token存储到数据库中，方便后续查询
      await this.ctx.model.Logistics.update(
        { waybill_token: response.data.waybill_token },
        { where: { orderitem_id: orderId } }
      );
      return response.data;
    }
    throw new Error("上传运单信息失败");
  }

  async queryTrace(orderId) {
    const { ctx } = this;
    const order = await ctx.model.Order.findByPk(orderId, {
      include: [
        {
          model: ctx.model.Logistics,
          attributes: ["uuid"],
        },
      ],
    });
    if (!order || !order.waybill_token) {
      throw new Error("订单不存在或未上传运单信息");
    }

    const accessToken = await this.jwt.getAccessToken();
    const url = `https://api.weixin.qq.com/cgi-bin/express/delivery/open_msg/query_trace?access_token=${accessToken}`;
    const data = {
      waybill_token: order.waybill_token,
    };
    const response = await axios.post(url, data);
    if (
      response.status === 200 &&
      response.data &&
      response.data.waybill_info
    ) {
      return response.data;
    }
    throw new Error("查询运单信息失败");
  }

  async getPaymentInfoByLogistics(logisticsId, orderId) {
    const { ctx, app } = this;
    const { Sequelize } = app;

    // 获取物流记录及关联数据
    const logistics = await ctx.model.Logistics.findOne({
      where: { uuid: logisticsId },
      include: [
        {
          model: ctx.model.OrderItem,
          attributes: ["uuid", "name", "thumbnail"],
        },
      ],
    });

    if (!logistics) {
      throw new Error("物流记录不存在或未关联订单项");
    }

    // const whereClause = {
    //   [Sequelize.Op.and]: Sequelize.where(
    //     Sequelize.fn(
    //       "JSON_CONTAINS",
    //       Sequelize.col("business_order_id"),
    //       Sequelize.literal(`'${JSON.stringify(orderUuid)}'`)
    //     ),
    //     "=",
    //     1
    //   ),
    // };

    // 查询支付信息
    const paymentsInfo = await ctx.model.Payments.findOne({
      where: {
        // 使用 Sequelize 的 JSON 查询语法
        [Sequelize.Op.and]: [
          Sequelize.where(
            Sequelize.fn(
              "JSON_CONTAINS",
              Sequelize.col("business_order_id"),
              app.Sequelize.literal(`'${JSON.stringify([orderId])}'`)
            ),
            "=",
            1
          ),
        ],
      },
    });
    console.log("查询订单支付记录:", paymentsInfo);
    return {
      logistics,
      paymentsInfo,
    };
  }

  async saveNew(params = {}) {
    const { ctx, app } = this;
    const { logistics, user_id, userName, orgUuid } = params;
    const crateInfo = app.getCrateInfo(user_id, userName);

    const logisticsData = {
      ...logistics,
      ...crateInfo,
      // userName, // 确保传递用户名
      // user_id, // 确保传递用户ID
      orgUuid,
    };

    const result = await ctx.model.Logistics.saveNew(logisticsData);
    return result;
  }

  async updateWaybillToken(logisticsId, orderId) {
    const { ctx } = this;
    try {
      // 新增支付信息获取
      const result = await this.getPaymentInfoByLogistics(logisticsId, orderId);

      if (!result) {
        ctx.logger.error(`物流记录不存在：${logisticsId}`);
        return;
      }
      const goodsData = {
        goods_name: result.logistics.orderitem.name,
        goods_img_url: result.logistics.orderitem.thumbnail,
      };

      const response = await this.traceWaybill({
        orderId: result.logistics.orderitem.uuid, // 从关联订单获取订单ID
        openid: result.paymentsInfo.openId,
        receiverPhone: result.logistics.receiver_phone,
        waybillId: result.logistics.waybill_id,
        goodsInfo: { detail_list: [goodsData] },
        transId: result.paymentsInfo.transaction_id,
      });

      return response;
    } catch (error) {
      ctx.logger.error(`更新物流信息失败：${error.message}`);
    }
  }
}

module.exports = LogisticsService;
