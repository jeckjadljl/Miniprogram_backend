"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("elements", {
      uuid: {
        type: Sequelize.STRING(38),
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      thumbnail: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      carousel: {
        type: Sequelize.JSON,
        defaultValue: [],
      },
      posters: {
        type: Sequelize.JSON,
        defaultValue: [],
      },
      orgUuid: {
        type: Sequelize.STRING(38),
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
      creatorName: {
        type: Sequelize.STRING(76),
        allowNull: false,
      },
      creatorId: {
        type: Sequelize.STRING(38),
        allowNull: false,
      },
      createdTime: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      lastModifiedTime: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      version: {
        type: Sequelize.BIGINT,
        defaultValue: 0,
      },
    });

    await queryInterface.createTable("posters", {
      uuid: {
        type: Sequelize.STRING(38),
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      elements_id: {
        type: Sequelize.STRING(38),
        allowNull: true,
      },
      imageUrl: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      purpose: {
        type: Sequelize.ENUM("home", "elements", "user"),
        allowNull: false,
      },
      purposeType: {
        type: Sequelize.ENUM("carousel", "posters"),
        allowNull: false,
      },
      title: { type: Sequelize.STRING(20) },
      link: { type: Sequelize.STRING(255) },
      orgUuid: {
        type: Sequelize.STRING(38),
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
      creatorName: {
        type: Sequelize.STRING(76),
        allowNull: false,
      },
      creatorId: {
        type: Sequelize.STRING(38),
        allowNull: false,
      },
      createdTime: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      lastModifiedTime: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      version: {
        type: Sequelize.BIGINT,
        defaultValue: 0,
      },
    });

    await queryInterface.addColumn("goods_category", "elements_id", {
      type: Sequelize.STRING(38),
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("elements");
    await queryInterface.dropTable("posters");
    await queryInterface.removeColumn("goods_category", "elements_id");
  },
};
