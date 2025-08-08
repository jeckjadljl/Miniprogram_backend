/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-07-29 16:35:26
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-07-29 17:07:00
 * @FilePath: \Mini_program_backend\app\schema\weRun\review_record.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

module.exports = app => {
  const { STRING, DATE, ENUM, BIGINT } = app.Sequelize;

  return {
    uuid: {
      type: STRING(38),
      primaryKey: true,
      defaultValue: app.Sequelize.UUIDV4,
    },
    run_record_id: STRING(38), // 关联的跑步记录ID
    reviewer_id: STRING(38), // 审核人ID
    reviewer_name: STRING(255), // 审核人姓名
    reviewer_team_id: STRING(38), // 审核人所属战队ID
    reviewer_team_name: STRING(255), // 审核人所属战队名称
    status: ENUM("approved", "rejected"),
    lastModifiedTime: {
      type: DATE,
      allowNull: false,
    },
    createdTime: {
      type: DATE,
      allowNull: false,
    },
    version: {
      type: BIGINT,
      defaultValue: 0,
    },
  };
};
