/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-03-15 09:46:49
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-03-16 18:12:27
 * @FilePath: \Mini_program_backend\database\migrations\20250315014649-update-vouchers-amember-tables.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 获取表结构信息
    const getTableStructure = async table => {
      const structure = await queryInterface.describeTable(table);
      return structure;
    };

    // vouchers 表改动
    const vouchersStructure = await getTableStructure("vouchers");

    // 添加 voucher_image 列（如果不存在）
    if (!vouchersStructure.voucher_image) {
      await queryInterface.addColumn("vouchers", "voucher_image", {
        type: Sequelize.STRING(255),
        allowNull: false,
      });
    }

    // 添加 start_date 列（如果不存在）
    if (!vouchersStructure.start_date) {
      await queryInterface.addColumn("vouchers", "start_date", {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"), // 设置默认值
      });
    }

    // 添加 end_date 列（如果不存在）
    if (!vouchersStructure.end_date) {
      await queryInterface.addColumn("vouchers", "end_date", {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"), // 设置默认值
      });
    }

    // 重命名 quantity 列为 voucher_quantity（如果 quantity 存在且 voucher_quantity 不存在）
    if (vouchersStructure.quantity && !vouchersStructure.voucher_quantity) {
      await queryInterface.renameColumn(
        "vouchers",
        "quantity",
        "voucher_quantity"
      );
    }

    // member_card 表改动
    const memberCardStructure = await getTableStructure("member_card");

    // 删除 start_date 列（如果存在）
    if (memberCardStructure.start_date) {
      await queryInterface.removeColumn("member_card", "start_date");
    }

    // 删除 end_date 列（如果存在）
    if (memberCardStructure.end_date) {
      await queryInterface.removeColumn("member_card", "end_date");
    }

    // member_card_record 表改动
    const memberCardRecordStructure = await getTableStructure(
      "member_card_record"
    );

    // 删除 consumption_points 列（如果存在）
    if (memberCardRecordStructure.consumption_points) {
      await queryInterface.removeColumn(
        "member_card_record",
        "consumption_points"
      );
    }

    // 添加 start_date 列（如果不存在）
    if (!memberCardRecordStructure.start_date) {
      await queryInterface.addColumn("member_card_record", "start_date", {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"), // 设置默认值
      });
    }

    // 添加 end_date 列（如果不存在）
    if (!memberCardRecordStructure.end_date) {
      await queryInterface.addColumn("member_card_record", "end_date", {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"), // 设置默认值
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    // 获取表结构信息
    const getTableStructure = async table => {
      const structure = await queryInterface.describeTable(table);
      return structure;
    };

    // vouchers 表改动
    const vouchersStructure = await getTableStructure("vouchers");

    // 删除 voucher_image 列（如果存在）
    if (vouchersStructure.voucher_image) {
      await queryInterface.removeColumn("vouchers", "voucher_image");
    }

    // 删除 start_date 列（如果存在）
    if (vouchersStructure.start_date) {
      await queryInterface.removeColumn("vouchers", "start_date");
    }

    // 删除 end_date 列（如果存在）
    if (vouchersStructure.end_date) {
      await queryInterface.removeColumn("vouchers", "end_date");
    }

    // 重命名 voucher_quantity 列为 quantity（如果 voucher_quantity 存在且 quantity 不存在）
    if (vouchersStructure.voucher_quantity && !vouchersStructure.quantity) {
      await queryInterface.renameColumn(
        "vouchers",
        "voucher_quantity",
        "quantity"
      );
    }

    // member_card 表改动
    const memberCardStructure = await getTableStructure("member_card");

    // 添加 start_date 列（如果不存在）
    if (!memberCardStructure.start_date) {
      await queryInterface.addColumn("member_card", "start_date", {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"), // 设置默认值
      });
    }

    // 添加 end_date 列（如果不存在）
    if (!memberCardStructure.end_date) {
      await queryInterface.addColumn("member_card", "end_date", {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"), // 设置默认值
      });
    }

    // member_card_record 表改动
    const memberCardRecordStructure = await getTableStructure(
      "member_card_record"
    );

    // 添加 consumption_points 列（如果不存在）
    if (!memberCardRecordStructure.consumption_points) {
      await queryInterface.addColumn(
        "member_card_record",
        "consumption_points",
        {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false,
        }
      );
    }

    // 删除 start_date 列（如果存在）
    if (memberCardRecordStructure.start_date) {
      await queryInterface.removeColumn("member_card_record", "start_date");
    }

    // 删除 end_date 列（如果存在）
    if (memberCardRecordStructure.end_date) {
      await queryInterface.removeColumn("member_card_record", "end_date");
    }
  },
};
