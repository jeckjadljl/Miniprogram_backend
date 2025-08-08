/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-03-10 16:13:29
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-07-16 10:46:07
 * @FilePath: \Mini_program_backend\app\schema\member_privileges.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
module.exports = app => {
  const { STRING, UUIDV4, DATE, ENUM, TEXT, BIGINT } = app.Sequelize;

  return {
    uuid: {
      type: STRING(38),
      defaultValue: UUIDV4,
      primaryKey: true,
    },
    // 会员卡ID
    member_card_id: {
      type: STRING(38),
      allowNull: true,
    },
    member_goods_id: {
      type: STRING(38),
      allowNull: true,
    },
    // 会员权限ID
    permissions_id: {
      type: STRING(38),
      allowNull: true,
    },
    card_type: {
      type: ENUM("green", "pink", "orange", "black", "general"),
      allowNull: true,
    },
    privilege_images: {
      type: TEXT,
      get() {
        // 将存储的逗号分隔的字符串转换为数组
        const rawValue = this.getDataValue("privilege_images");
        return rawValue ? rawValue.split(",") : [];
      },
      set(value) {
        // 保存时将数组转换为逗号分隔的字符串
        this.setDataValue(
          "privilege_images",
          Array.isArray(value) ? value.join(",") : value
        );
      },
    },
    privilege_name: {
      type: STRING(50),
      allowNull: true,
    },
    privilege_desc: {
      type: STRING(255),
      allowNull: true,
    },
    privilege_type: {
      type: ENUM("task", "goods", "voucher"),
      allowNull: true,
    },
    sort_order: {
      type: BIGINT,
      allowNull: false,
      defaultValue: 0,
    },
    createdTime: {
      type: DATE,
      allowNull: false,
    },
    lastModifiedTime: {
      type: DATE,
      allowNull: false,
    },
  };
};
