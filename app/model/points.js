/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-11-24 16:34:32
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-03-15 15:41:48
 * @FilePath: \Mini_program_backend\app\model\points.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
module.exports = app => {
  const { model } = app;
  const PointsSchema = require("../../app/schema/points")(app);

  const Points = model.define("points", PointsSchema, {
    tableName: "points",
  });

  Points.associate = function () {
    const { User } = model;
    Points.belongsTo(User, { foreignKey: "user_id" });
  };

  Points.findPointAmount = async ({ userId }) => {
    return await Points.findOne({
      where: { user_id: userId },
    });
  };

  Points.add = async data => {
    const { user_id, points, current_balance } = data;

    const point = await Points.create({
      user_id,
      type: "add",
      points,
      current_balance,
    });

    return point.uuid;
  };

  return Points;
};
