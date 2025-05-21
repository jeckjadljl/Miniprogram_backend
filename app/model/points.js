/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-11-24 16:34:32
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-04-26 17:21:17
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
    const { user_id, points, source, current_balance } = data;

    const point = await Points.create({
      user_id,
      type: "add",
      points,
      source,
      current_balance,
    });

    return point.uuid;
  };

  Points.subtract = async data => {
    const { user_id, points, source, description, current_balance } = data;

    const point = await Points.create({
      user_id,
      type: "subtract",
      points,
      source,
      description,
      current_balance,
    });

    return point.uuid;
  };

  Points.getPointsByReferral = async ({ user_id }) => {
    const points = await Points.findOne({
      where: { user_id, source: "referral" },
    });

    return points;
  };

  return Points;
};
