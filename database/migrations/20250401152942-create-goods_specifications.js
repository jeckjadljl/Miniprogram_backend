"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("goods_specifications", {
      spec_id: {
        type: Sequelize.STRING(38),
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
      },
      goods_id: {
        type: Sequelize.STRING(38),
        allowNull: false,
      },
      specName: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      specValue: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      specPrice: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      stock: {
        type: Sequelize.BIGINT,
        allowNull: true,
        defaultValue: 0,
      },
      specThumbnail: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      specImages: {
        type: Sequelize.TEXT,
      },
      specPosters: {
        type: Sequelize.TEXT,
      },
      isDefault: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      createdTime: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      lastModifiedTime: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.removeColumn("goods", "spec");
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("goods_specifications");
    await queryInterface.addColumn("goods", "spec", {
      type: Sequelize.STRING(255),
    });
  },
};
