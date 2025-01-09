/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-11-24 16:34:32
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2024-12-17 15:32:57
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
    timestamps: false,
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
    const { user_id, total_amount, source, current_balance, description } =
      data;

    const point = await Points.create({
      user_id,
      type: "add",
      points: total_amount,
      current_balance,
      source,
      description,
    });

    return point.uuid;
  };

  return Points;
};
