/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-02-22 21:16:48
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-03-23 23:42:20
 * @FilePath: \Mini_program_backend\app\model\posters.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

module.exports = app => {
  const { Sequelize, model, getSortInfo, checkUpdate, checkDelete } = app;
  const { Op } = Sequelize;
  const postersSchema = require("../schema/posters")(app);

  const Posters = model.define("posters", postersSchema, {
    tableName: "posters",
  });

  Posters.associate = function () {
    const { Elements, Goods } = model;
    Posters.belongsTo(Elements, { foreignKey: "elements_id" });
    Posters.belongsTo(Goods, { foreignKey: "goods_id" });
  };

  Posters.saveNew = async posters => {
    const result = await Posters.create(posters);
    return result.uuid;
  };

  Posters.get = async ({ uuid, orgUuid }) => {
    return await Posters.findOne({
      where: { uuid, orgUuid },
    });
  };

  Posters.getHomeCarousel = async () => {
    const carousel = await Posters.findAll({
      where: {
        purpose: "home",
      },
    });
    return carousel;
  };

  return Posters;
};
