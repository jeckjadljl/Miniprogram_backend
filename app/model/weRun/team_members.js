/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-07-26 16:02:52
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-07-26 17:43:09
 * @FilePath: \Mini_program_backend\app\model\weRun\team_members.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

module.exports = app => {
  const { model } = app;
  const TeamMembersSchema = require("../../../app/schema/weRun/team_members")(
    app
  );

  const TeamMembers = model.define("weRun/team_members", TeamMembersSchema, {
    tableName: "team_members", // 对应数据库中的 'cart' 表
  });

  TeamMembers.saveNew = async params => {
    return await TeamMembers.create(params);
  };

  TeamMembers.joinActivity = async params => {
    return await TeamMembers.create(params);
  };

  return TeamMembers;
};
