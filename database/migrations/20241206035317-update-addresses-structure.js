/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-12-06 11:53:17
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2024-12-06 18:00:09
 * @FilePath: \Mini_program_backend\database\migrations\20241206035317-update-addresses-structure.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 添加新字段
    await queryInterface.addColumn("addresses", "province", {
      type: Sequelize.STRING(50),
      allowNull: false,
      defaultValue: "",
    });
    await queryInterface.addColumn("addresses", "city", {
      type: Sequelize.STRING(50),
      allowNull: false,
      defaultValue: "",
    });
    await queryInterface.addColumn("addresses", "district", {
      type: Sequelize.STRING(50),
      allowNull: false,
      defaultValue: "",
    });
    await queryInterface.addColumn("addresses", "detail", {
      type: Sequelize.STRING(255),
      allowNull: false,
      defaultValue: "",
    });

    // 将旧的 `address` 字段中的数据拆分到新字段
    const addresses = await queryInterface.sequelize.query(
      `SELECT address_id, address FROM addresses`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    for (const { address_id, address } of addresses) {
      // 假设 `address` 格式为 "广东省深圳市南山区科技园路1号"
      const [province, city, district, ...detail] = address.split(" ");
      await queryInterface.bulkUpdate(
        "addresses",
        {
          province: province || "",
          city: city || "",
          district: district || "",
          detail: detail.join(" ") || "",
        },
        { address_id }
      );
    }

    // 删除旧的 `address` 字段
    await queryInterface.removeColumn("addresses", "address");
    await queryInterface.removeColumn("addresses", "openId");
  },

  down: async (queryInterface, Sequelize) => {
    // 还原旧的 `address` 字段
    await queryInterface.addColumn("addresses", "address", {
      type: Sequelize.STRING(255),
      allowNull: false,
    });

    // 回滚：重新添加 open_id 字段
    await queryInterface.addColumn("addresses", "openId", {
      type: Sequelize.STRING(38),
      allowNull: false,
    });

    // 将新字段组合为旧的 `address` 字段
    const addresses = await queryInterface.sequelize.query(
      `SELECT address_id, province, city, district, detail FROM addresses`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    for (const { address_id, province, city, district, detail } of addresses) {
      const address = `${province}${city}${district}${detail}`;
      await queryInterface.bulkUpdate("addresses", { address }, { address_id });
    }

    // 删除新字段
    await queryInterface.removeColumn("addresses", "province");
    await queryInterface.removeColumn("addresses", "city");
    await queryInterface.removeColumn("addresses", "district");
    await queryInterface.removeColumn("addresses", "detail");
  },
};
