/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-04-09 15:57:44
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-05-19 15:12:48
 * @FilePath: \Mini_program_backend\app\schema\groups.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
module.exports = app => {
  const { STRING, UUIDV4, DATE, DECIMAL, BIGINT, ENUM, INTEGER } =
    app.Sequelize;

  return {
    group_id: {
      type: STRING(38),
      defaultValue: UUIDV4,
      primaryKey: true,
    },
    group_no: {
      type: STRING(38),
      allowNull: true,
      comment: "促销活动编号",
    },
    group_title: {
      type: STRING(255),
      allowNull: true,
    },
    begin_time: DATE,
    end_time: DATE,
    buyer_amt: DECIMAL(10, 2),
    buyer_points_amt: DECIMAL(10, 2),
    min_amt: DECIMAL(12, 2),
    min_points_amt: DECIMAL(10, 2),
    group_status: {
      // 活动状态
      type: ENUM("1", "-1", "2", "3"),
      comment: "状态(1发布 -1未发布 2团成 3未团成)",
    },
    current_members: INTEGER,
    min_members: {
      type: INTEGER,
      defaultValue: 3,
    },
    remarks: STRING(256),
    createdTime: {
      type: DATE,
      allowNull: false,
      comment: "创建时间",
    },
    creatorName: {
      type: STRING(76),
      allowNull: false,
    },
    creatorId: {
      type: STRING(38),
      allowNull: false,
    },
    lastModifiedTime: {
      type: DATE,
      allowNull: false,
      comment: "最后修改时间",
    },
    lastModifierName: {
      type: STRING(76),
      allowNull: false,
    },
    lastModifierId: {
      type: STRING(38),
      allowNull: false,
    },
    version: {
      type: BIGINT,
      defaultValue: 0,
    },
  };
};
