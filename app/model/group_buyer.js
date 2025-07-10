/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-05-18 11:58:01
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-06-25 18:06:00
 * @FilePath: \Mini_program_backend\app\model\group_buyer.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
module.exports = app => {
  const { Sequelize, model, checkUpdate } = app;
  const { Op } = Sequelize;
  const GroupBuyerSchema = require("../../app/schema/group_buyer")(app);

  const GroupBuyer = model.define("group_buyer", GroupBuyerSchema, {
    tableName: "group_buyer", // 对应数据库中的 'goods' 表
  });

  GroupBuyer.associate = function () {
    const { Groups, User, Order } = model;
    GroupBuyer.belongsTo(Groups, {
      foreignKey: "group_id",
    });
    GroupBuyer.belongsTo(User, {
      foreignKey: "buyer_id",
    });
    GroupBuyer.belongsTo(Order, {
      foreignKey: "order_id",
    });
  };

  GroupBuyer.saveNew = async goodsSpecData => {
    return await GroupBuyer.create(goodsSpecData);
  };

  GroupBuyer.findByGroupId = async params => {
    const { group_id, buyer_id } = params;
    return await GroupBuyer.findOne({
      where: {
        group_id,
        buyer_id,
      },
    });
  };

  return GroupBuyer;
};
