/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-11-12 18:11:51
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-04-08 17:07:47
 * @FilePath: \Mini_program_backend\app\schema\order_items.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
// schema/order_items.js
module.exports = app => {
  const { STRING, INTEGER, DECIMAL, UUIDV4, DATE, JSON } = app.Sequelize;

  return {
    uuid: {
      type: STRING(38),
      allowNull: false,
      primaryKey: true,
      defaultValue: UUIDV4,
    },
    order_id: {
      type: STRING(38),
      allowNull: false,
    },
    member_card_id: {
      type: STRING(38),
      allowNull: true,
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
    member_goods_id: {
      type: STRING(38),
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
    points_deduction: {
      type: DECIMAL(10, 2),
      allowNull: true,
    }, // 可抵扣的健康币的比值
    points_amount: {
      type: DECIMAL(10, 2),
      allowNull: true, // 实际支付的健康币数量
    },
    payment_amount: {
      type: DECIMAL(10, 2),
      allowNull: false,
    }, // 实际支付的金额
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
    lastModifiedTime: {
      type: DATE,
      allowNull: false,
    },
    createdTime: {
      type: DATE,
      allowNull: false,
    },
  };
};
