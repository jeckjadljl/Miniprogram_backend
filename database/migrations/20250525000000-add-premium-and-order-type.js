/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-05-24 17:27:02
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-05-24 17:28:30
 * @FilePath: \Mini_program_backend\database\migrations\20250525000000-add-premium-and-order-type.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 添加会员商品表字段
    await queryInterface.addColumn("member_goods", "require_premium", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });

    // 添加订单类型字段
    await queryInterface.addColumn("orders", "order_type", {
      type: Sequelize.ENUM(
        "normal",
        "points_exchange",
        "mixed_exchange",
        "group_buy",
        "presale",
        "special offer"
      ),
      allowNull: false,
      defaultValue: "normal",
      comment: "订单类型：normal-普通订单, points_exchange-积分兑换订单",
    });
  },

  async down(queryInterface) {
    // 回滚顺序与创建顺序相反
    await queryInterface.removeColumn("orders", "order_type");
    await queryInterface.removeColumn("member_goods", "require_premium");
  },
};
