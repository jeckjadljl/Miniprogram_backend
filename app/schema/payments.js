/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-12-09 21:48:53
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-06-07 16:36:07
 * @FilePath: \Mini_program_backend\app\schema\payments.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

module.exports = app => {
  const { STRING, DATE, UUIDV4, ENUM, BIGINT, JSON } = app.Sequelize;

  return {
    uuid: {
      type: STRING(38),
      allowNull: false,
      primaryKey: true,
      defaultValue: UUIDV4,
    },
    user_id: {
      type: STRING(38),
      allowNull: false,
    },
    transaction_id: {
      type: STRING(32),
      allowNull: true,
    },
    prepay_id: {
      type: STRING(64), // 预支付交易会话标识
      allowNull: true,
    },
    business_order_id: {
      type: JSON, // 商户订单号，支持绑定多个订单
      defaultValue: [],
      allowNull: false,
      validate: {
        isValidArray(value) {
          if (
            !Array.isArray(value) ||
            !value.every(v => typeof v === "string")
          ) {
            throw new Error("business_order_id必须为字符串数组");
          }
        },
      },
      get() {
        // 确保读取时返回数组
        const value = this.getDataValue("business_order_id");
        return Array.isArray(value) ? value : [];
      },
      set(value) {
        // 存储时统一为数组格式
        this.setDataValue(
          "business_order_id",
          Array.isArray(value) ? value : [value]
        );
      },
    },
    out_trade_no: {
      type: STRING(32), // 商户订单号（与business_order_id一致）
      allowNull: false,
    },
    // "unpaid": 未支付, "paid": 已支付, "refunded": 已退款
    payment_status: {
      type: ENUM("unpaid", "paid", "closed", "refunded"),
      defaultValue: "unpaid",
    },
    payment_method: {
      type: STRING(32),
      allowNull: false,
    },
    appId: {
      type: STRING(32),
      allowNull: false,
    },
    mchId: {
      type: STRING(32),
      allowNull: false,
    },
    openId: {
      type: STRING(32),
      allowNull: false,
    },
    trade_state: {
      type: STRING(32), // 交易状态
      allowNull: true,
    },
    trade_state_desc: {
      type: STRING(255), // 交易状态描述
      allowNull: true,
    },
    total_amount: {
      type: BIGINT, // 订单金额（单位为分）
      allowNull: false,
    },
    pay_time: DATE,
    // refund_status: {
    //   type: STRING(20),
    //   comment: "退款状态(none/processing/success/failed)",
    // },
    // out_refund_no: {
    //   type: STRING(64),
    //   comment: "微信退款单号",
    // },
    // refund_id: {
    //   type: STRING(32),
    //   comment: "商户退款单号",
    // },
    // refund_amount: {
    //   type: BIGINT,
    //   comment: "退款金额（单位为分）",
    // },
    // refund_success_time: {
    //   type: DATE,
    //   comment: "退款成功时间",
    // },
    lastModifiedTime: {
      type: DATE,
      allowNull: false,
    },
    createdTime: {
      type: DATE,
      allowNull: false,
    },
    version: {
      type: BIGINT,
      defaultValue: 0,
    },
  };
};
