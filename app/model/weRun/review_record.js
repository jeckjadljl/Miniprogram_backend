/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-07-29 16:56:48
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-07-29 16:59:59
 * @FilePath: \Mini_program_backend\app\model\weRun\review_record.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
module.exports = app => {
  const { model } = app;
  const ReviewRecordSchema = require("../../../app/schema/weRun/review_record")(
    app
  );

  const ReviewRecord = model.define("weRun/review_record", ReviewRecordSchema, {
    tableName: "review_record",
  });

  ReviewRecord.associate = function () {
    const { RunRecord, Team } = model.WeRun;
    const { User } = model;
    // 关联跑步记录
    ReviewRecord.belongsTo(RunRecord, {
      foreignKey: "run_record_id",
      as: "runRecord",
    });
    // 关联审核人
    ReviewRecord.belongsTo(User, {
      foreignKey: "reviewer_id",
      as: "reviewer",
    });
    // 关联审核人所属战队
    ReviewRecord.belongsTo(Team, {
      foreignKey: "reviewer_team_id",
      as: "reviewerTeam",
    });
  };

  return ReviewRecord;
};
