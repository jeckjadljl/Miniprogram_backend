/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-07-25 15:34:36
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-07-29 17:09:13
 * @FilePath: \Mini_program_backend\app\schema\weRun\run_record.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

module.exports = app => {
  const { STRING, DATE, INTEGER, UUIDV4, BIGINT, ENUM, DECIMAL, TEXT } =
    app.Sequelize;

  return {
    uuid: {
      type: STRING(38),
      primaryKey: true,
      allowNull: false,
      defaultValue: UUIDV4,
    }, // 关联用户表
    user_id: {
      type: STRING(38),
      allowNull: false,
    },
    distance: {
      type: DECIMAL(10, 2),
      allowNull: false,
    },
    duration: {
      type: DECIMAL(10, 2),
      allowNull: false,
    },
    screenshot: {
      type: TEXT,
      get() {
        // 将存储的逗号分隔的字符串转换为数组
        const rawValue = this.getDataValue("screenshot");
        return rawValue ? rawValue.split(",") : [];
      },
      set(value) {
        // 保存时将数组转换为逗号分隔的字符串
        this.setDataValue(
          "screenshot",
          Array.isArray(value) ? value.join(",") : value
        );
      },
    },
    steps: {
      type: INTEGER,
      allowNull: false,
    },
    sports_mode: {
      type: ENUM("running", "cross_country", "cycling", "swimming", "other"),
      allowNull: false,
      defaultValue: "running",
    },
    status: {
      type: ENUM("pending", "reviewing", "approved", "rejected", "cancelled"),
      defaultValue: "pending",
    },
    team_id: STRING(38),
    reviewer_id: STRING(38),
    review_time: DATE,
    reject_reason: STRING(255),
    date: {
      type: DATE,
      allowNull: false,
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
