/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-11-12 21:44:14
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-04-14 09:51:13
 * @FilePath: \Mini_program_backend\app\schema\goods.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
module.exports = app => {
  const { STRING, DECIMAL, UUIDV4, DATE, BIGINT, ENUM, TEXT } = app.Sequelize;

  return {
    goods_id: {
      type: STRING(38),
      primaryKey: true,
      allowNull: false,
      defaultValue: UUIDV4,
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
    category_id: STRING(38),
    orgUuid: {
      type: STRING(38),
      allowNull: false,
    },
    status: {
      type: ENUM("up", "down"),
      allowNull: false,
    },
    name: {
      type: STRING(30),
      allowNull: false,
    },
    unitName: {
      type: STRING(76),
      allowNull: false,
    }, // 商品的计量单位名称
    salePrice: {
      type: DECIMAL(10, 2),
      allowNull: false,
    },
    originalPrice: {
      type: DECIMAL(10, 2),
      allowNull: false,
    },
    goodsInfo: TEXT,
    // spec: {
    //   type: STRING(255),
    //   get() {
    //     // 将存储的逗号分隔的字符串转换为数组
    //     const rawValue = this.getDataValue("spec");
    //     return rawValue ? rawValue.split(",") : [];
    //   },
    //   set(value) {
    //     // 保存时将数组转换为逗号分隔的字符串
    //     this.setDataValue(
    //       "spec",
    //       Array.isArray(value) ? value.join(",") : value
    //     );
    //   },
    // },
    thumbnail: STRING(255), // 商品缩略图的 URL
    carousel: {
      type: TEXT,
      get() {
        // 将存储的逗号分隔的字符串转换为数组
        const rawValue = this.getDataValue("carousel");
        return rawValue ? rawValue.split(",") : [];
      },
      set(value) {
        // 保存时将数组转换为逗号分隔的字符串
        this.setDataValue(
          "carousel",
          Array.isArray(value) ? value.join(",") : value
        );
      },
    },
    imagesJsonStr: STRING(2000), // 存储商品图片的 JSON 格式字符串
    version: {
      type: BIGINT,
      defaultValue: 0,
    },
  };
};
