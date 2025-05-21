/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-05-04 15:35:39
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-05-04 15:44:09
 * @FilePath: \Mini_program_backend\database\migrations\20250504073539-create-logistics-table.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("logistics", {
      uuid: {
        type: Sequelize.STRING(38),
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      lastModifiedTime: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      lastModifierName: {
        type: Sequelize.STRING(76),
        allowNull: false,
      },
      lastModifierId: {
        type: Sequelize.STRING(38),
        allowNull: false,
      },
      createdTime: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      creatorName: {
        type: Sequelize.STRING(76),
        allowNull: false,
      },
      creatorId: {
        type: Sequelize.STRING(38),
        allowNull: false,
      },
      userName: {
        type: Sequelize.STRING(76),
        allowNull: false,
      },
      user_id: {
        type: Sequelize.STRING(38),
        allowNull: false,
      },
      orgUuid: {
        type: Sequelize.STRING(38),
        allowNull: false,
      },
      orderitem_id: {
        type: Sequelize.STRING(38),
        allowNull: false,
      },
      waybill_id: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      receiver_phone: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      delivery_id: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      logistics_status: {
        type: Sequelize.STRING(50),
      },
      logistics_info: {
        type: Sequelize.TEXT,
      },
      version: {
        type: Sequelize.BIGINT,
        defaultValue: 0,
      },
    });

    await queryInterface.addColumn("order_items", "status", {
      type: Sequelize.ENUM(
        "initial",
        "paid",
        "shipped",
        "completed",
        "canceled"
      ),
      allowNull: false,
      defaultValue: "initial",
    });
  },

  down: async queryInterface => {
    await queryInterface.dropTable("logistics");
    await queryInterface.removeColumn("order_items", "status");
  },
};
