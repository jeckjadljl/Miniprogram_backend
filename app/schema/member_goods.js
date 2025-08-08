/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-11-07 16:07:57
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-08-06 11:12:03
 * @FilePath: \Mini_program_backend\app\schema\member_goods.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

module.exports = app => {
  const { STRING, DECIMAL, INTEGER, UUIDV4, DATE, BIGINT, ENUM, BOOLEAN } =
    app.Sequelize;

  return {
    id: {
      type: STRING(38),
      primaryKey: true,
      defaultValue: UUIDV4,
    },
    member_card_id: {
      type: STRING(38),
      allowNull: true,
    },
    member_goods_group_id: {
      type: STRING(38),
      allowNull: true,
      comment: "组合分组ID（相同ID的商品为一组）",
    },
    group_type: {
      type: ENUM("single", "combo-item", "combo-group"),
      allowNull: false,
      defaultValue: "single",
      comment:
        "商品类型：single-独立商品 / combo-item-组合子项 / combo-group-组合父项",
    },
    min_select: {
      type: INTEGER,
      allowNull: true,
      comment: "本组最少选择数量",
    },
    max_select: {
      type: INTEGER,
      allowNull: true,
      comment: "本组最多选择数量",
    },
    member_card_name: {
      type: STRING(50),
      allowNull: true,
    },
    member_card_images: {
      type: STRING(255),
      allowNull: true,
    },
    member_card_salePrice: {
      type: DECIMAL(10, 2),
      allowNull: true,
    },
    member_packs_name: {
      type: STRING(50),
      allowNull: true,
    },
    member_packs_salePrice: {
      type: DECIMAL(10, 2),
      allowNull: true,
    },
    voucher_id: {
      type: STRING(38),
      allowNull: true,
    },
    voucher_name: {
      type: STRING(50),
      allowNull: true,
    },
    voucher_image: {
      type: STRING(255),
      allowNull: true,
    },
    voucher_type: {
      type: STRING(30),
      allowNull: true,
    },
    voucher_quantity: {
      type: INTEGER,
      allowNull: true,
      defaultValue: 1,
    },
    points: {
      type: DECIMAL(10, 2),
      allowNull: true,
    },
    points_image: {
      type: STRING(255),
      allowNull: true,
    },
    point_spend: {
      type: DECIMAL(10, 2),
      allowNull: true,
    }, // 可直接设置可使用的健康币数量
    cash_amount: {
      type: DECIMAL(10, 2),
      allowNull: true,
    }, // 健康币兑换所需的现金
    points_deduction: {
      type: DECIMAL(10, 2),
      allowNull: true,
    }, // 可抵扣的健康币的比值
    points_rate: {
      type: DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0.1, // 默认健康币汇率
    },
    require_premium: {
      type: BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: "是否需要城市合伙人权限",
    },
    deduction_type: {
      type: ENUM("points", "mixed"),
      allowNull: true,
    },
    goods_id: {
      type: STRING(38),
      allowNull: true,
    },
    name: {
      type: STRING(255),
      allowNull: true,
    },
    thumbnail: {
      type: STRING(255),
      allowNull: true, // 可存储商品的主图地址
    },
    unitName: {
      type: STRING(20),
      allowNull: true, // 如 "件", "包"
    },
    salePrice: {
      type: DECIMAL(10, 2),
      allowNull: true, // 商品下单时的单价
    },
    spec: {
      type: STRING(255),
      allowNull: true, // 商品规格信息，如颜色、尺寸等
    },
    quantity: {
      type: INTEGER,
      allowNull: true,
      defaultValue: 1,
    },
    discount_amount: {
      type: DECIMAL(10, 2),
      allowNull: true, // 折扣金额，如 10.00
    },
    discount_type: {
      type: ENUM("exchange", "special offer", "Presale", "group buy"), // 折扣类型，如固定金额或百分比
      allowNull: true,
    },
    discount_tag: {
      type: STRING(100), // 折扣标签，如 "满减", "限时折扣"
      allowNull: true,
    },
    member_goods_status: {
      type: ENUM("up", "down"),
      allowNull: false,
    },
    orgUuid: {
      type: STRING(38),
      allowNull: false,
    },
    createdTime: {
      type: DATE,
      allowNull: false,
    },
    lastModifiedTime: {
      type: DATE,
      allowNull: false,
    },
    version: {
      type: BIGINT,
      defaultValue: 0,
    },
  };
};
