/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-11-24 16:34:32
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-07-19 16:53:27
 * @FilePath: \Mini_program_backend\app\model\points.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
module.exports = app => {
  const { _, Sequelize, model, getSortInfo } = app;
  const { Op } = Sequelize;
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
    const { user_id, points, source, description, current_balance, source_id } =
      data;

    const point = await Points.create({
      user_id,
      type: "add",
      points,
      source,
      description,
      current_balance,
      ...(source_id && { source_id }), // 条件添加字段
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

  Points.getPointsByReferral = async ({ user_id, source, source_id }) => {
    const points = await Points.findOne({
      where: { user_id, source, source_id },
    });

    return points;
  };

  Points.getAllPointsRecords = async ({
    user_id,
    PointsAttributes,
    pagination = {},
    filter = {},
    sort = [],
  }) => {
    const { page, pageSize: limit } = pagination;
    const { daterange, type } = filter;
    const order = getSortInfo(sort);
    const condition = {
      offset: (page - 1) * limit,
      limit,
      order,
      attributes: PointsAttributes,
      where: { user_id },
    };

    if (type) {
      condition.where.type = type;
    }

    if (!_.isEmpty(daterange)) {
      const startDate = new Date(daterange[0]);
      const endDate = new Date(daterange[1]);

      if (_.isDate(startDate) && _.isDate(endDate)) {
        condition.where.createdTime = {
          [Op.gt]: startDate,
          [Op.lt]: endDate,
        };
      }
    }

    const result = await Points.findAll(condition);

    // 需要手动处理分页总数
    const total = await Points.count({
      where: condition.where,
    });

    return {
      page,
      total,
      totalPages: Math.ceil(total / limit),
      pageSize: limit,
      data: result,
    };
  };

  return Points;
};
