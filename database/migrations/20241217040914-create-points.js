/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-12-17 12:09:14
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2024-12-17 12:15:15
 * @FilePath: \Mini_program_backend\database\migrations\20241217040914-create-points.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { STRING, UUIDV4, DATE, DECIMAL, ENUM, NOW } = Sequelize;

    await queryInterface.createTable("points", {
      uuid: {
        type: STRING(38),
        defaultValue: UUIDV4, // 自动生成 UUID
        primaryKey: true,
      },
      user_id: {
        type: STRING(38),
        allowNull: false,
        comment: "用户ID",
      },
      type: {
        type: ENUM("add", "subtract"), // 增加或减少积分
        allowNull: false,
        comment: "操作类型（增加/减少）",
      },
      points: {
        type: DECIMAL(10, 2),
        allowNull: false,
        comment: "变动的积分值",
      },
      current_balance: {
        type: DECIMAL(10, 2),
        allowNull: false,
        comment: "当前积分余额",
      },
      source: {
        type: STRING(50),
        allowNull: true,
        comment: "积分来源（如订单、活动等）",
      },
      description: {
        type: STRING,
        allowNull: true,
        comment: "积分变动描述",
      },
      created_at: {
        type: DATE,
        defaultValue: NOW,
        allowNull: false,
        comment: "创建时间",
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("points");
  },
};
