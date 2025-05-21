/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-04-14 16:12:22
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-04-14 16:53:25
 * @FilePath: \Mini_program_backend\database\migrations\20250414081222-create-goods-sales-table.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("goods_sales", {
      id: {
        type: Sequelize.STRING(38),
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        comment: "主键ID",
      },
      goods_id: {
        type: Sequelize.STRING(38),
        allowNull: false,
        comment: "商品ID",
      },
      spec: {
        type: Sequelize.STRING(255),
        allowNull: false,
        comment: "商品规格",
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: "销售数量",
      },
      createdTime: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
        comment: "创建时间",
      },
      lastModifiedTime: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
        comment: "最后修改时间",
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("goods_sales");
  },
};
