/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-11-12 18:11:51
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2024-12-25 11:18:49
 * @FilePath: \Mini_program_backend\app\schema\order_items.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
// schema/order_items.js
module.exports = app => {
  const { STRING, INTEGER, DECIMAL, UUIDV4 } = app.Sequelize;

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
    goods_id: {
      type: STRING(38),
      allowNull: false,
    },
    name: {
      type: STRING(255),
      allowNull: false,
    },
    thumbnail: {
      type: STRING(255),
      allowNull: true, // 可存储商品的主图地址
    },
    unitName: {
      type: STRING(20),
      allowNull: false, // 如 "件", "包"
    },
    salePrice: {
      type: DECIMAL(10, 2),
      allowNull: false, // 商品下单时的单价
    },
    spec: {
      type: STRING(255),
      allowNull: true, // 商品规格信息，如颜色、尺寸等
    },
    quantity: {
      type: INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  };
};
