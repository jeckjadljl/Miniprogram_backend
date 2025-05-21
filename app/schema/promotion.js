/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-04-09 15:57:44
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-05-11 20:45:57
 * @FilePath: \Mini_program_backend\app\schema\promotion.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
module.exports = app => {
  const { STRING, UUIDV4, DATE, DECIMAL, BIGINT, ENUM } = app.Sequelize;

  return {
    uuid: {
      type: STRING(38),
      defaultValue: UUIDV4,
      primaryKey: true,
    },
    thumbnail: {
      type: STRING(255),
      allowNull: true,
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
      type: ENUM(
        "限时特价",
        "季节性",
        "联名定制",
        "大促专属",
        "赶圩",
        "团购特价",
        "临期特价"
      ),
      allowNull: true,
      comment: "活动类型",
    },
    points_rate: {
      type: DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0.1,
      comment: "促销汇率",
    },
    discount: {
      type: DECIMAL(10, 2),
      allowNull: true,
      comment: "商品优惠价",
    },
    status: {
      // 活动状态
      type: ENUM("pending", "active", "ended", "cancelled"),
      allowNull: false,
      defaultValue: "pending",
      comment: "活动状态",
    },
    orgUuid: {
      type: STRING(38),
      allowNull: false,
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
