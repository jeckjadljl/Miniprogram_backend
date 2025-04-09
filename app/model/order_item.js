/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-11-13 11:45:28
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-03-16 17:42:53
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
  });

  OrderItem.associate = function () {
    const { Order, Goods, MemberGoods, VoucherRules } = model;
    OrderItem.belongsTo(Order, { foreignKey: "order_id" });
    OrderItem.belongsTo(Goods, { foreignKey: "goods_id" });
    OrderItem.belongsTo(MemberGoods, { foreignKey: "member_goods_id" });
    OrderItem.belongsTo(VoucherRules, { foreignKey: "voucher_id" });
  };

  return OrderItem;
};
