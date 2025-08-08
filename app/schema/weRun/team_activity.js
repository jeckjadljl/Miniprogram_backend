/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-07-25 15:45:55
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-08-03 10:03:15
 * @FilePath: \Mini_program_backend\app\schema\weRun\team_activity.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

module.exports = app => {
  const { STRING, DATE, INTEGER, UUIDV4, BIGINT, JSON, ENUM } = app.Sequelize;

  return {
    uuid: {
      type: STRING(38),
      primaryKey: true,
      allowNull: false,
      defaultValue: UUIDV4,
    }, // 关联用户表
    team_id: {
      type: STRING(38),
      allowNull: false,
    },
    team_name: {
      type: STRING(30),
      allowNull: false,
    },
    activity_image: {
      type: STRING(255),
      allowNull: false,
    },
    title: {
      type: STRING(30),
      allowNull: false,
    },
    contact_person: {
      type: STRING(30),
      allowNull: false,
    },
    contact_information: {
      type: STRING(30),
      allowNull: false,
    },
    description: {
      type: STRING(255),
      allowNull: true,
    },
    location: {
      type: STRING(255),
      allowNull: true,
    },
    population_limit: {
      type: INTEGER,
      allowNull: true,
    },
    status: {
      type: ENUM("pending", "ongoing", "ended", "cancelled"),
      allowNull: true,
      comment: "活动状态",
    },
    start_time: {
      type: DATE,
      allowNull: true,
      comment: "活动开始时间",
    },
    end_time: {
      type: DATE,
      allowNull: true,
      comment: "活动结束时间",
    },
    check_in_start_time: {
      type: DATE,
      allowNull: true,
      comment: "签到开始时间",
    },
    check_in_end_time: {
      type: DATE,
      allowNull: true,
      comment: "签到结束时间",
    },
    lastModifiedTime: {
      type: DATE,
      allowNull: false,
    },
    lastModifierName: {
      type: STRING(76),
      allowNull: false,
    },
    lastModifierId: {
      type: STRING(38),
      allowNull: false,
    },
    createdTime: {
      type: DATE,
      allowNull: false,
    },
    creatorName: {
      type: STRING(76),
      allowNull: false,
    },
    creatorId: {
      type: STRING(38),
      allowNull: false,
    },
    version: {
      type: BIGINT,
      defaultValue: 0,
    },
  };
};
