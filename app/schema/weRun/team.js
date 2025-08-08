/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-07-25 15:42:33
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-07-29 16:46:25
 * @FilePath: \Mini_program_backend\app\schema\weRun\team.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

module.exports = app => {
  const { STRING, DATE, INTEGER, UUIDV4, BIGINT, DECIMAL } = app.Sequelize;

  return {
    uuid: {
      type: STRING(38),
      primaryKey: true,
      allowNull: false,
      defaultValue: UUIDV4,
    }, // 关联用户表
    team_name: {
      type: STRING(50),
      allowNull: false,
    },
    logo_image: {
      type: STRING(500),
      allowNull: false,
    },
    captain: {
      type: STRING(38),
      allowNull: false,
    },
    totalDistance: {
      type: DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    activityCount: {
      type: INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    slogan: {
      type: STRING(50),
      allowNull: true,
    },
    description: {
      type: STRING(255),
      allowNull: true,
    },
    points_amount: {
      type: DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0.0,
    },
    population_limit: {
      type: INTEGER,
      allowNull: true,
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
