/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-04-01 23:37:50
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-04-02 11:40:54
 * @FilePath: \Mini_program_backend\app\model\goods_specifications.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
module.exports = app => {
  const { Sequelize, model, checkUpdate, getSortInfo } = app;
  const { Op } = Sequelize;
  const GoodsSpecificationsSchema =
    require("../../app/schema/goods_specifications")(app);

  const GoodsSpecifications = model.define(
    "goods_specifications",
    GoodsSpecificationsSchema,
    {
      tableName: "goods_specifications", // 对应数据库中的 'goods' 表
    }
  );

  GoodsSpecifications.associate = function () {
    const { Goods } = model;
    GoodsSpecifications.belongsTo(Goods, {
      foreignKey: "goods_id",
      as: "goods",
    });
  };

  GoodsSpecifications.saveNew = async goodsSpecificationsData => {
    return await GoodsSpecifications.create(goodsSpecificationsData);
  };

  return GoodsSpecifications;
};
