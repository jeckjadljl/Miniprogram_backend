const posters = require("./posters");

/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-04-01 23:15:32
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-04-02 00:19:03
 * @FilePath: \Mini_program_backend\app\schema\goods_specifications.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
module.exports = app => {
  const { STRING, DECIMAL, UUIDV4, DATE, BIGINT, TEXT, BOOLEAN } =
    app.Sequelize;

  return {
    spec_id: {
      type: STRING(38),
      primaryKey: true,
      allowNull: false,
      defaultValue: UUIDV4,
    },
    goods_id: {
      type: STRING(38),
      allowNull: false,
    },
    specName: {
      type: STRING(255),
      allowNull: false,
    }, // 规格名称，例如 "颜色"、"尺寸"
    specValue: {
      type: STRING(255),
      allowNull: false,
    }, // 规格值，例如 "红色"、"M码"
    specPrice: {
      type: DECIMAL(10, 2),
      allowNull: false,
    }, // 规格对应的价格
    stock: {
      type: BIGINT,
      allowNull: true,
      defaultValue: 0,
    }, // 规格对应的库存
    specThumbnail: {
      type: STRING(255), // 规格对应的缩略图
      allowNull: true,
    },
    specImages: {
      type: TEXT,
      get() {
        // 将存储的逗号分隔的字符串转换为数组
        const rawValue = this.getDataValue("specImages");
        return rawValue ? rawValue.split(",") : [];
      },
      set(value) {
        // 保存时将数组转换为逗号分隔的字符串
        this.setDataValue(
          "specImages",
          Array.isArray(value) ? value.join(",") : value
        );
      },
    }, // 规格对应的图片
    specPosters: {
      type: TEXT,
      get() {
        // 将存储的逗号分隔的字符串转换为数组
        const rawValue = this.getDataValue("specPosters");
        return rawValue ? rawValue.split(",") : [];
      },
      set(value) {
        // 保存时将数组转换为逗号分隔的字符串
        this.setDataValue(
          "specPosters",
          Array.isArray(value) ? value.join(",") : value
        );
      },
    },
    isDefault: {
      type: BOOLEAN,
      allowNull: true,
      defaultValue: false,
    }, // 是否为默认规格
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
