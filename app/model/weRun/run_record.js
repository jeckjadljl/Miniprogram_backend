/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-07-25 18:15:17
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-07-29 17:01:03
 * @FilePath: \Mini_program_backend\app\model\weRun\run_record.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

module.exports = app => {
  const { model } = app;
  const RunRecordSchema = require("../../../app/schema/weRun/run_record")(app);

  const RunRecord = model.define("weRun/run_record", RunRecordSchema, {
    tableName: "run_record", // 对应数据库中的 'cart' 表
  });

  RunRecord.associate = function () {
    const { User } = app.model;
    const { ReviewRecord, Team } = app.model.WeRun;
    RunRecord.belongsTo(User, { foreignKey: "user_id", as: "user" });
    RunRecord.belongsTo(Team, { foreignKey: "team_id", as: "team" });

    RunRecord.hasMany(ReviewRecord, {
      foreignKey: "run_record_id",
      as: "reviews",
    });
  };

  RunRecord.saveNew = async params => {
    return await RunRecord.create(params);
  };

  return RunRecord;
};
