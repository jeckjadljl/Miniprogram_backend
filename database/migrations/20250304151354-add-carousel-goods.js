/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-03-04 23:13:54
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-03-04 23:17:03
 * @FilePath: \Mini_program_backend\database\migrations\20250304151354-add-carousel-goods.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("goods", "carousel", {
      type: Sequelize.TEXT,
      defaultValue: "[]", // 默认值为空数组的 JSON 字符串
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("goods", "carousel");
  },
};
