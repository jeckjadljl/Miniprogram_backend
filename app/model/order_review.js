/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-11-13 11:45:28
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-06-06 18:56:18
 * @FilePath: \Mini_program_backend\app\model\order_review.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
// app/model/order_item.js
module.exports = app => {
  const { model } = app;
  const OrderReviewSchema = require("../../app/schema/order_review")(app);

  const OrderReview = model.define("order_review", OrderReviewSchema, {
    tableName: "order_review",
  });

  OrderReview.associate = function () {
    const { Order, Goods, User } = model;
    OrderReview.belongsTo(Order, { foreignKey: "order_id" });
    OrderReview.belongsTo(Goods, { foreignKey: "goods_id" });
    OrderReview.belongsTo(User, { foreignKey: "user_id" });
  };

  OrderReview.saveNew = async data => {
    const order_review = await OrderReview.create(data);
    return order_review.uuid;
  };

  OrderReview.saveLikes = async (params = {}) => {
    const { uuid, goods_id, likes } = params;
    const goods = await OrderReview.findOne({
      where: {
        uuid,
        goods_id,
      },
    });
    if (goods) {
      goods.likes = likes;
      return await goods.save();
    }
    return null;
  };

  return OrderReview;
};
