/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-04-14 15:39:45
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-04-14 16:50:49
 * @FilePath: \Mini_program_backend\app\schema\goods_sales.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
module.exports = app => {
  const { UUIDV4, STRING, INTEGER, DATE } = app.Sequelize;

  return {
    id: {
      type: STRING(38),
      primaryKey: true,
      allowNull: false,
      defaultValue: UUIDV4,
    },
    goods_id: {
      type: STRING(38),
      allowNull: false,
      comment: "商品ID",
    },
    spec: {
      type: STRING(255),
      allowNull: false,
      comment: "商品规格",
    },
    quantity: {
      type: INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "销售数量",
    },
    createdTime: {
      type: DATE,
      allowNull: false,
      comment: "创建时间",
    },
    lastModifiedTime: {
      type: DATE,
      allowNull: false,
      comment: "最后修改时间",
    },
  };
};
