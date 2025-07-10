/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-04-29 20:34:19
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-07-02 00:04:44
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
      return response.data.waybill_token;
    }
    throw new Error("上传运单信息失败");
  }

  async queryTrace(orderitem_id) {
    const { ctx, app } = this;
    const orderitem = await ctx.model.OrderItem.findByPk(orderitem_id, {
      include: [
        {
          model: ctx.model.Logistics,
          as: "logistic",
        },
      ],
    });

    if (!orderitem) {
      throw new Error(`订单项[${orderitem_id}]不存在`);
    }

    const logistics = orderitem.logistic;
    console.log("logistics:", logistics);

    const accessToken = await this.jwt.getAccessToken();
    const response = await axios.post(
      `https://api.weixin.qq.com/cgi-bin/express/delivery/open_msg/query_trace?access_token=${accessToken}`,
      { waybill_token: logistics.waybill_token }
    );

    if (response.data.errcode) {
      ctx.logger.error(
        `物流查询失败[${logistics.uuid}]:`,
        response.data.errmsg
      );
    }

    return await app.transaction(async transaction => {
      console.log("response.data:", response.data);
      // 更新物流状态
      if (response.data.waybill_info?.status) {
        const [logisticsUpdatedCount] = await ctx.model.Logistics.update(
          {
            logistics_status: response.data.waybill_info.status,
            last_checked_time: new Date(),
            check_count: ctx.app.Sequelize.literal("check_count + 1"),
          },
          {
            where: { uuid: logistics.uuid },
            transaction,
          }
        );
        if (logisticsUpdatedCount === 0) {
          ctx.logger.warn(
            `Logistics record with uuid ${logistics.uuid} not found`
          );
        }

        const mappedStatus = this.mapLogisticsStatus(
          response.data.waybill_info.status
        );
        if (mappedStatus) {
          // 更新订单项状态
          const [orderitemUpdatedCount] = await ctx.model.OrderItem.update(
            {
              status: mappedStatus,
            },
            {
              where: {
                uuid: orderitem_id,
                status: "paid", // 只更新已支付状态的订单
              },
              transaction,
            }
          );
          if (orderitemUpdatedCount === 0) {
            ctx.logger.warn(
              `OrderItem record with uuid ${orderitem_id} not found`
            );
          }

          // 添加调试日志
          ctx.logger.info("开始更新物流状态", {
            orderitem_id,
            wx_status: response.data.waybill_info.status,
            mapped_status: this.mapLogisticsStatus(
              response.data.waybill_info.status
            ),
          });

          // 更新主订单状态（根据所有订单项的状态）
          await ctx.model.Order.update(
            {
              order_status: mappedStatus,
            },
            {
              where: {
                uuid: orderitem.order_id,
                order_status: "paid", // 只更新已支付状态的订单
              },
              transaction,
            }
          );
        } else {
          ctx.logger.warn("未映射的物流状态", {
            wx_status: response.data.waybill_info.status,
            orderitem_id,
          });
        }
        this.logger.info("物流查询成功:", response.data);
      }
      if (response.data.errcode) {
        this.logger.error("物流查询失败:", response.data.errmsg);
        throw new Error(response.data.errmsg); // 抛出错误触发回滚
      }
    });

    // const accessToken = await this.jwt.getAccessToken();
    // const url = `https://api.weixin.qq.com/cgi-bin/express/delivery/open_msg/query_trace?access_token=${accessToken}`;
    // const data = {
    //   waybill_token: order.orderitems.logistic.waybill_token,
    // };
    // const response = await axios.post(url, data);
    // console.log(response.status, response.data);
    // if (
    //   response.status === 200 &&
    //   response.data &&
    //   response.data.waybill_info
    // ) {
    //   const logisticsStatus = response.data.waybill_info.status;
    //   await ctx.model.Logistics.update(
    //     {
    //       last_checked_time: new Date(),
    //       check_count: ctx.app.Sequelize.literal("check_count + 1"),
    //       logistics_status: logisticsStatus,
    //     },
    //     { where: { orderitem_id: order.orderitems.uuid } }
    //   );

    //   console.log(`订单${orderId}物流状态更新为${logisticsStatus}`);
    //   // 微信物流状态码建议明确判断：
    //   const WX_LOGISTICS_STATUS = {
    //     ON_WAY: 2, // 运输中
    //     DELIVERING: 3, // 派件中
    //     DELIVERED: 4, // 已签收
    //   };
    //   if (
    //     [
    //       WX_LOGISTICS_STATUS.ON_WAY,
    //       WX_LOGISTICS_STATUS.DELIVERING,
    //       WX_LOGISTICS_STATUS.DELIVERED,
    //     ].includes(logisticsStatus)
    //   ) {
    //     return await app.transaction(async transaction => {
    //       const modifyInfo = app.getModifyInfo(order.user_id, order.userName);
    //       const modify = await ctx.model.Order.update(
    //         {
    //           order_status: "shipped",
    //           ...modifyInfo,
    //         },
    //         {
    //           where: { uuid: order.uuid, user_id: order.user_id },
    //           transaction,
    //         }
    //       );

    //       // 新增订单项状态更新 ▼▼▼
    //       await ctx.model.OrderItem.update(
    //         { status: "shipped" },
    //         {
    //           where: { order_id: order.uuid, uuid: order.orderitems.uuid },
    //           transaction, // 使用相同事务
    //         }
    //       );
    //     });
    //   }
    //   return response.data;
    // }
    // throw new Error("查询运单信息失败");
  }

  // 新增状态映射方法
  mapLogisticsStatus(wxStatus) {
    const STATUS_MAP = {
      0: "paid", // 待揽件
      1: "paid", // 揽件中
      2: "paid", // 运输中
      3: "shipped", // 派件中
      4: "shipped", // 已签收
      5: "shipped", // 异常
      6: "shipped", // 代签收
    };
    return STATUS_MAP[wxStatus];
  }

  async getPaymentInfoByLogistics(logisticsId) {
    const { ctx, app } = this;
    const { Sequelize } = app;

    // 获取物流记录及关联数据
    const logistics = await ctx.model.Logistics.findOne({
      where: { uuid: logisticsId },
      include: [
        {
          model: ctx.model.OrderItem,
          as: "orderitem",
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
              app.Sequelize.literal(`'${JSON.stringify([logistics.order_id])}'`)
            ),
            "=",
            1
          ),
        ],
      },
    });
    console.log("查询订单支付记录:", paymentsInfo);
    console.log("物流信息:", logistics);
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
      user_id,
      userName,
      orgUuid,
    };

    const result = await ctx.model.Logistics.saveNew(logisticsData);
    return result;
  }

  async updateWaybillToken(logisticsId) {
    const { ctx } = this;
    try {
      // 新增支付信息获取
      const result = await this.getPaymentInfoByLogistics(logisticsId);

      if (!result) {
        ctx.logger.error(`物流记录不存在：${logisticsId}`);
        return;
      }
      // 添加运单存在性检查
      if (!result.logistics?.waybill_id) {
        this.ctx.logger.error(`物流记录缺少运单号：${logisticsId}`);
        return null;
      }
      // 如果已获取waybill_token就直接返回
      // if (result.logistics.waybill_token) {
      //   const waybill_token = result.logistics.waybill_token;
      //   return {
      //     waybill_token,
      //     orderitemId: result.logistics.orderitem.uuid,
      //   };
      // }
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

      return {
        waybill_token: response,
        orderitemId: result.logistics.orderitem.uuid,
      };
    } catch (error) {
      ctx.logger.error(`更新物流信息失败：${error.message}`);
    }
  }
}

module.exports = LogisticsService;
