"use strict";

module.exports = app => {
  const { model } = app;
  const TeamMembersActivitySchema =
    require("../../../app/schema/weRun/team_members_activity")(app);

  const TeamMembersActivity = model.define(
    "weRun/team_members_activity",
    TeamMembersActivitySchema,
    {
      tableName: "team_members_activity", // 对应数据库中的 'cart' 表
    }
  );

  TeamMembersActivity.saveNew = async params => {
    return await TeamMembersActivity.create(params);
  };

  TeamMembersActivity.joinActivity = async params => {
    const newRecord = await TeamMembersActivity.create(params);
    return [newRecord];
  };

  return TeamMembersActivity;
};
