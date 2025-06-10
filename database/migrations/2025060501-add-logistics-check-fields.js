/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-06-05 17:46:26
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-06-05 17:46:54
 * @FilePath: \Mini_program_backend\database\migrations\2025060501-add-logistics-check-fields.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("logistics", "last_checked_time", {
      type: Sequelize.DATE,
      comment: "最后检查时间",
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    });

    await queryInterface.addColumn("logistics", "check_count", {
      type: Sequelize.INTEGER,
      comment: "检查次数",
      defaultValue: 0,
    });

    // 添加索引优化查询性能
    await queryInterface.addIndex("logistics", ["last_checked_time"], {
      name: "idx_last_checked_time",
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("logistics", "last_checked_time");
    await queryInterface.removeColumn("logistics", "check_count");
    await queryInterface.removeIndex("logistics", "idx_last_checked_time");
  },
};
