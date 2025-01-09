/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-11-13 11:45:28
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2024-12-18 11:12:13
 * @FilePath: \Mini_program_backend\app\model\order_item.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
// app/model/order_item.js
module.exports = app => {
  const { model } = app;
  const OrderItemSchema = require("../../app/schema/order_items")(app);

  const OrderItem = model.define("orderitem", OrderItemSchema, {
    tableName: "order_items",
    timestamps: false,
  });

  OrderItem.associate = function () {
    const { Order, Goods } = model;
    OrderItem.belongsTo(Order, { foreignKey: "order_id" });
    OrderItem.belongsTo(Goods, { foreignKey: "goods_id" });
  };

  return OrderItem;
};
