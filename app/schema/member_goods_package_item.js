/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-08-06 11:03:36
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-08-06 21:59:18
 * @FilePath: \Mini_program_backend\app\schema\member_goods_package_item.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
module.exports = app => {
  const { STRING, INTEGER, UUIDV4, ENUM, DATE, BIGINT, DECIMAL } =
    app.Sequelize;

  return {
    id: {
      type: STRING(38),
      primaryKey: true,
      defaultValue: UUIDV4,
    },
    member_package_id: {
      type: STRING(38),
      allowNull: false,
    },
    goods_id: {
      type: STRING(38),
      allowNull: false,
    },
    goods_name: {
      type: STRING(50),
      allowNull: false,
    },
    goods_image: {
      type: STRING(255),
      allowNull: false,
    },
    goods_package_category: {
      type: ENUM("CLOTHING", "PANTS", "BAG", "SHOES", "WATCH"),
      defaultValue: "CLOTHING",
      comment: "CLOTHING-服装 / PANTS-裤子 / BAG-包 / SHOES-鞋子 / WATCH-手表",
    },
    salePrice: {
      type: DECIMAL(10, 2),
      allowNull: false,
    },
    stock: {
      type: INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    sort_order: {
      type: BIGINT,
      allowNull: false,
      defaultValue: 0,
    },
    createdTime: {
      type: DATE,
      allowNull: false,
    },
    creatorName: {
      type: STRING(76),
      allowNull: false,
    },
    creatorId: {
      type: STRING(38),
      allowNull: false,
    },
    lastModifiedTime: {
      type: DATE,
      allowNull: false,
    },
    lastModifierName: {
      type: STRING(76),
      allowNull: false,
    },
    lastModifierId: {
      type: STRING(38),
      allowNull: false,
    },
    version: {
      type: BIGINT,
      defaultValue: 0,
    },
  };
};
