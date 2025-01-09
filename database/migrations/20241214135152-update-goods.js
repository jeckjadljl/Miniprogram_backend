/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-12-14 21:51:52
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2024-12-15 10:19:02
 * @FilePath: \Mini_program_backend\database\migrations\20241214135152-update-goods.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { STRING, DECIMAL, ENUM, TEXT, DATE } = Sequelize;

    // 修改表结构
    await Promise.all([
      // 修改字段名
      queryInterface.renameColumn("goods", "goods_name", "name"),
      queryInterface.renameColumn("goods", "goods_images", "thumbnail"),
      queryInterface.renameColumn("goods", "goods_price", "salePrice"),
      queryInterface.renameColumn("goods", "goods_desc", "goodsInfo"),
      queryInterface.renameColumn("goods", "goods_spec", "spec"),

      // 添加新字段
      queryInterface.addColumn("goods", "unitName", {
        type: STRING(76),
        allowNull: false,
      }),
      queryInterface.addColumn("goods", "imagesJsonStr", {
        type: STRING(2000),
      }),
      queryInterface.addColumn("goods", "created_at", {
        type: DATE,
        allowNull: false,
      }),

      queryInterface.addColumn("goods", "updated_at", {
        type: DATE,
        allowNull: false,
      }),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    const { STRING, DECIMAL } = Sequelize;

    // 回滚表结构
    await Promise.all([
      // 恢复字段名
      queryInterface.renameColumn("goods", "name", "goods_name"),
      queryInterface.renameColumn("goods", "thumbnail", "goods_images"),
      queryInterface.renameColumn("goods", "salePrice", "goods_price"),
      queryInterface.renameColumn("goods", "goodsInfo", "goods_desc"),
      queryInterface.renameColumn("goods", "spec", "goods_spec"),

      // 删除新添加的字段
      queryInterface.removeColumn("goods", "unitName"),
      queryInterface.removeColumn("goods", "imagesJsonStr"),
      queryInterface.removeColumn("goods", "created_at"),
      queryInterface.removeColumn("goods", "updated_at"),
    ]);
  },
};
