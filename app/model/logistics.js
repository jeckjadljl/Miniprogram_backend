/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-04-29 20:27:08
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-05-05 10:12:41
 * @FilePath: \Mini_program_backend\app\model\logistics.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

module.exports = app => {
  const { Sequelize, model, getSortInfo, checkUpdate, checkDelete } = app;
  const { Op } = Sequelize;
  const LogisticsSchema = require("../schema/logistics")(app);

  const Logistics = model.define("logistics", LogisticsSchema, {
    tableName: "logistics",
  });

  Logistics.associate = function () {
    const { OrderItem, Order } = model;
    Logistics.belongsTo(OrderItem, {
      foreignKey: "orderitem_id",
    });
    Logistics.belongsTo(Order, {
      foreignKey: "order_id",
    });
  };

  Logistics.saveNew = async logistics => {
    const result = await Logistics.create(logistics);
    return result;
  };

  return Logistics;
};
