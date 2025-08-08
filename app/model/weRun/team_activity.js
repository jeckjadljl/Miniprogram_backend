/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-07-25 16:08:44
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-08-04 18:00:47
 * @FilePath: \Mini_program_backend\app\model\weRun\team_activity.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

module.exports = app => {
  const { Sequelize, model, getSortInfo } = app;
  const { Op } = Sequelize;
  const TeamActivitySchema = require("../../../app/schema/weRun/team_activity")(
    app
  );

  const TeamActivity = model.define("weRun/team_activity", TeamActivitySchema, {
    tableName: "team_activity", // 对应数据库中的 'cart' 表
  });

  TeamActivity.associate = function () {
    const { User } = app.model;
    const { Team, TeamActivity, TeamMembersActivity } = app.model.WeRun;
    TeamActivity.belongsTo(Team, { foreignKey: "team_id" });
    TeamActivity.belongsToMany(User, {
      through: TeamMembersActivity,
      foreignKey: "team_activity_id",
      otherKey: "user_id",
    });
  };

  TeamActivity.saveNew = async params => {
    const event = await TeamActivity.create(params);

    const memberRecord = await model.WeRun.TeamMembersActivity.joinActivity({
      team_activity_id: event.uuid,
      user_id: params.user_id,
    });

    return {
      event,
      memberRecord,
    };
  };

  TeamActivity.getActivityList = async ({
    teamActivityAttributes,
    pagination = {},
    filter = {},
    sort = [],
  }) => {
    const { page = 1, pageSize: limit = 10 } = pagination;
    const { status } = filter;
    const order = getSortInfo(sort);

    const condition = {
      offset: (page - 1) * limit,
      limit,
      order,
      attributes: teamActivityAttributes,
    };

    if (status) {
      if (status === "all") {
        condition.where.status = {
          [Op.in]: ["pending", "ongoing", "ended", "cancelled"],
        };
      } else {
        condition.where.status = status;
      }
    }

    const result = await TeamActivity.findAll(condition);

    // 需要手动处理分页总数
    const total = await TeamActivity.count({
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

  TeamActivity.getActivityDetail = async params => {
    return await TeamActivity.findOne({
      where: {
        uuid: params.uuid,
      },
    });
  };

  return TeamActivity;
};
