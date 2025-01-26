/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-01-16 20:05:53
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-01-17 16:03:33
 * @FilePath: \Mini_program_backend\app\schema\qrcode.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
module.exports = app => {
  const { STRING, UUIDV4, DATE } = app.Sequelize;

  return {
    id: {
      type: STRING(38),
      defaultValue: UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    referrer_id: {
      type: STRING(38),
      allowNull: false,
    }, // 推荐人uuid
    promotion_code: {
      type: STRING(32), // 存储推广码 ID
      allowNull: false,
    },
    qrcode: {
      type: STRING(255),
      allowNull: false,
    }, // 推荐人uuid
    lastModifiedTime: {
      type: DATE,
      allowNull: false,
    },
    createdTime: {
      type: DATE,
      allowNull: false,
    },
  };
};
