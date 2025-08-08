/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-07-25 16:05:28
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-08-03 16:58:24
 * @FilePath: \Mini_program_backend\app\model\weRun\team.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

module.exports = app => {
  const { model } = app;
  const TeamSchema = require("../../../app/schema/weRun/team")(app);

  const Team = model.define("weRun/team", TeamSchema, {
    tableName: "team", // 对应数据库中的 'cart' 表
  });

  Team.associate = function () {
    const { User } = app.model;
    const { TeamMembers, TeamActivity, ReviewRecord, RunRecord } = model.WeRun;
    Team.hasMany(TeamActivity, {
      foreignKey: "team_id",
      as: "team_activities",
    });
    Team.belongsToMany(User, {
      through: model.WeRun.TeamMembers,
      foreignKey: "team_id",
      otherKey: "user_id",
      as: "users",
    });

    Team.hasMany(RunRecord, {
      foreignKey: "team_id",
      as: "run_records",
    });

    Team.hasMany(ReviewRecord, {
      foreignKey: "reviewer_team_id",
      as: "teamReviews",
    });
  };

  Team.saveNew = async params => {
    return await app.transaction(async transaction => {
      const team = await Team.create(params, { transaction });

      await model.WeRun.TeamMembers.saveNew({
        team_id: team.uuid,
        user_id: params.captain,
      });

      return team;
    });
  };

  Team.countMember = async params => {
    const { team_id } = params;
    const result = await Team.findOne({
      include: [
        {
          model: model.User,
          as: "users",
        },
      ],
      where: { uuid: team_id },
    });

    const count = result.users.length;

    return count;
  };

  Team.getTeamMember = async ({ team_id, attributes, userAttributes }) => {
    return await Team.findOne({
      include: [
        {
          model: model.User,
          attributes: userAttributes,
          as: "users",
        },
      ],
      attributes,
      where: { uuid: team_id },
    });
  };

  return Team;
};
