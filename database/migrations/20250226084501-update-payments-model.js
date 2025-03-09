"use strict";

/** @type {import('sequelize-cli').Migration} */
// migrations/YYYYMMDDHHMMSS-update-payments-model.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 添加新字段
    await queryInterface.addColumn("payments", "prepay_id", {
      type: Sequelize.STRING(64),
      allowNull: true,
    });

    await queryInterface.addColumn("payments", "trade_state", {
      type: Sequelize.STRING(32),
      allowNull: true,
    });

    await queryInterface.addColumn("payments", "trade_state_desc", {
      type: Sequelize.STRING(255),
      allowNull: true,
    });

    await queryInterface.addColumn("payments", "total_amount", {
      type: Sequelize.BIGINT,
      allowNull: false,
      defaultValue: 0,
    });

    // 修改字段类型和长度
    await queryInterface.changeColumn("payments", "transaction_id", {
      type: Sequelize.STRING(32),
      allowNull: true,
    });

    await queryInterface.changeColumn("payments", "appId", {
      type: Sequelize.STRING(32),
      allowNull: false,
    });

    await queryInterface.changeColumn("payments", "mchId", {
      type: Sequelize.STRING(32),
      allowNull: false,
    });

    await queryInterface.changeColumn("payments", "openId", {
      type: Sequelize.STRING(32),
      allowNull: false,
    });

    // 重命名字段
    await queryInterface.renameColumn(
      "payments",
      "order_id",
      "business_order_id"
    );
    await queryInterface.renameColumn(
      "payments",
      "orderBillNumber",
      "out_trade_no"
    );
    await queryInterface.renameColumn("payments", "payTime", "pay_time");
  },

  down: async (queryInterface, Sequelize) => {
    // 删除新添加的字段
    await queryInterface.removeColumn("payments", "prepay_id");
    await queryInterface.removeColumn("payments", "trade_state");
    await queryInterface.removeColumn("payments", "trade_state_desc");
    await queryInterface.removeColumn("payments", "total_amount");

    // 恢复字段类型和长度
    await queryInterface.changeColumn("payments", "transaction_id", {
      type: Sequelize.STRING(38),
      allowNull: true,
    });

    await queryInterface.changeColumn("payments", "appId", {
      type: Sequelize.STRING(38),
      allowNull: false,
    });

    await queryInterface.changeColumn("payments", "mchId", {
      type: Sequelize.STRING(38),
      allowNull: false,
    });

    await queryInterface.changeColumn("payments", "openId", {
      type: Sequelize.STRING(38),
      allowNull: false,
    });

    // 恢复字段名
    await queryInterface.renameColumn(
      "payments",
      "business_order_id",
      "order_id"
    );
    await queryInterface.renameColumn(
      "payments",
      "out_trade_no",
      "orderBillNumber"
    );
    await queryInterface.renameColumn("payments", "pay_time", "payTime");
  },
};
