/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-04-09 15:57:44
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-04-09 16:35:21
 * @FilePath: \Mini_program_backend\app\schema\promotion.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
module.exports = app => {
  const { STRING, UUIDV4, DATE, DECIMAL, BOOLEAN, ENUM } = app.Sequelize;

  return {
    uuid: {
      type: STRING(38),
      defaultValue: UUIDV4,
      primaryKey: true,
    },
    name: {
      type: STRING(100),
      allowNull: false,
      comment: "促销活动名称",
    },
    description: {
      type: STRING(255),
      allowNull: true,
      comment: "活动描述",
    },
    activity_type: {
      type: ENUM("限时抢购", "季节性", "联名定制", "大促专属"),
      allowNull: false,
      comment: "活动类型",
    },
    rate: {
      type: DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 1.0,
      comment: "促销汇率",
    },
    status: {
      // 活动状态
      type: ENUM("pending", "active", "ended", "cancelled"),
      allowNull: false,
      defaultValue: "pending",
      comment: "活动状态",
    },
    start_time: {
      type: DATE,
      allowNull: false,
      comment: "活动开始时间",
    },
    end_time: {
      type: DATE,
      allowNull: false,
      comment: "活动结束时间",
    },
    createdTime: {
      type: DATE,
      allowNull: false,
      comment: "创建时间",
    },
    lastModifiedTime: {
      type: DATE,
      allowNull: false,
      comment: "最后修改时间",
    },
  };
};
