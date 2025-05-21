/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-04-01 23:15:32
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-05-14 23:39:06
 * @FilePath: \Mini_program_backend\app\schema\goods_spec_color.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
module.exports = app => {
  const { STRING, DECIMAL, UUIDV4, DATE, BIGINT, TEXT, BOOLEAN } =
    app.Sequelize;

  return {
    uuid: {
      type: STRING(38),
      primaryKey: true,
      allowNull: false,
      defaultValue: UUIDV4,
    },
    spec_id: {
      type: STRING(38),
      allowNull: true,
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
      allowNull: true,
    }, // 规格值，例如 "红色"、"M码"
    specPrice: {
      type: DECIMAL(10, 2),
      allowNull: true,
    }, // 规格对应的价格
    specColorThumbnail: {
      type: STRING(255), // 规格对应的缩略图
      allowNull: true,
    },
    specColorImages: {
      type: TEXT,
      get() {
        // 将存储的逗号分隔的字符串转换为数组
        const rawValue = this.getDataValue("specColorImages");
        return rawValue ? rawValue.split(",") : [];
      },
      set(value) {
        // 保存时将数组转换为逗号分隔的字符串
        this.setDataValue(
          "specColorImages",
          Array.isArray(value) ? value.join(",") : value
        );
      },
    }, // 规格对应的图片
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
