/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-11-12 18:11:51
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-06-04 16:56:52
 * @FilePath: \Mini_program_backend\app\schema\order_review.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
// schema/order_items.js
module.exports = app => {
  const { STRING, INTEGER, DECIMAL, UUIDV4, DATE, ENUM, TEXT, BIGINT } =
    app.Sequelize;

  return {
    uuid: {
      type: STRING(38),
      allowNull: false,
      primaryKey: true,
      defaultValue: UUIDV4,
    },
    order_id: {
      type: STRING(38),
      allowNull: false,
    },
    goods_id: {
      type: STRING(38),
      allowNull: false,
    },
    user_id: {
      type: STRING(38),
      allowNull: false,
    },
    userAvatar: {
      type: STRING(255),
      allowNull: true,
    },
    userName: {
      type: STRING(76),
      allowNull: false,
    },
    review: {
      type: STRING(255),
      allowNull: true,
    },
    imagesUrl: {
      type: TEXT,
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
    rating: {
      type: INTEGER,
      allowNull: false,
    },
    ratingTag: {
      type: ENUM("超好评", "好评", "一般", "差评"),
      allowNull: true,
    },
    likes: {
      type: INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    lastModifiedTime: {
      type: DATE,
      allowNull: false,
    },
    lastModifierName: {
      type: STRING(76),
      allowNull: false,
    },
    lastModifierId: {
      type: STRING(38),
      allowNull: false,
    },
    createdTime: {
      type: DATE,
      allowNull: false,
    },
    creatorName: {
      type: STRING(76),
      allowNull: false,
    },
    creatorId: {
      type: STRING(38),
      allowNull: false,
    },
    version: {
      type: BIGINT,
      defaultValue: 0,
    },
  };
};
