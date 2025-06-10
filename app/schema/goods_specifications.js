/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-04-01 23:15:32
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-06-09 17:15:10
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
    member_goods_id: {
      type: STRING(38),
      allowNull: true,
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
      allowNull: false,
    }, // 规格对应的价格
    stock: {
      type: BIGINT,
      allowNull: true,
      defaultValue: 0,
    }, // 规格对应的库存
    specThumbnail: {
      type: STRING(1024), // 规格对应的缩略图
      allowNull: true,
    },
    point_spend: {
      type: DECIMAL(10, 2),
      allowNull: true,
    }, // 可直接设置可使用的健康币数量
    cash_amount: {
      type: DECIMAL(10, 2),
      allowNull: true,
    }, // 健康币兑换所需的现金
    sort_order: {
      type: BIGINT,
      allowNull: false,
      defaultValue: 0,
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
