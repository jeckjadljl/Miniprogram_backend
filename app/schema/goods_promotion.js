/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-04-09 15:57:44
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-04-13 22:47:08
 * @FilePath: \Mini_program_backend\app\schema\goods_promotion.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
module.exports = app => {
  const { STRING, UUIDV4, DATE, BIGINT } = app.Sequelize;

  return {
    uuid: {
      type: STRING(38),
      defaultValue: UUIDV4,
      primaryKey: true,
    },
    member_goods_id: {
      type: STRING(38),
      allowNull: false,
    },
    promotion_id: {
      type: STRING(38),
      allowNull: false,
    },
    createdTime: {
      type: DATE,
      allowNull: false,
    },
    lastModifiedTime: {
      type: DATE,
      allowNull: false,
    },
    version: {
      type: BIGINT,
      defaultValue: 0,
    },
  };
};
