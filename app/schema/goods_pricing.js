/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-05-15 23:14:12
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-05-16 00:05:24
 * @FilePath: \Mini_program_backend\app\schema\goods_pricing.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

module.exports = app => {
  const { STRING, DATE, INTEGER, DECIMAL, UUIDV4 } = app.Sequelize;

  return {
    uuid: {
      type: STRING(38),
      primaryKey: true,
      allowNull: false,
      defaultValue: UUIDV4,
    },
    goods_id: {
      type: STRING(38),
      allowNull: false,
    }, // 关联产品表
    spec_id: {
      type: STRING(38),
      allowNull: true,
    },
    spec_color_id: {
      type: STRING(38),
      allowNull: true,
    },
    quantity: {
      type: INTEGER,
      allowNull: false,
    },
    salePrice: {
      type: DECIMAL(10, 2),
      allowNull: false,
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
