/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-06-04 15:05:23
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-06-04 15:13:31
 * @FilePath: \Mini_program_backend\database\migrations\20250604070523-add-rating-to-order-review.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("order_review", {
      uuid: {
        type: Sequelize.STRING(38),
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      order_id: {
        type: Sequelize.STRING(38),
        allowNull: false,
      },
      goods_id: {
        type: Sequelize.STRING(38),
        allowNull: false,
      },
      user_id: {
        type: Sequelize.STRING(38),
        allowNull: false,
      },
      userAvatar: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      userName: {
        type: Sequelize.STRING(76),
        allowNull: false,
      },
      review: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      imagesUrl: {
        type: Sequelize.TEXT,
        get() {
          // 将存储的逗号分隔的字符串转换为数组
          const rawValue = this.getDataValue("imagesUrl");
          return rawValue ? rawValue.split(",") : [];
        },
        set(value) {
          // 保存时将数组转换为逗号分隔的字符串
          this.setDataValue(
            "imagesUrl",
            Array.isArray(value) ? value.join(",") : value
          );
        },
      },
      likes: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
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
      version: {
        type: Sequelize.BIGINT,
        defaultValue: 0,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("order_review");
  },
};
