/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-11-24 12:11:43
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-03-16 17:02:25
 * @FilePath: \Mini_program_backend\app\schema\points.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
module.exports = app => {
  const { STRING, UUIDV4, DATE, DECIMAL, ENUM } = app.Sequelize;

  return {
    uuid: {
      type: STRING(38),
      defaultValue: UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: STRING(38),
      allowNull: false,
    },
    type: {
      type: ENUM("add", "subtract"), // 增加或减少积分
      allowNull: false,
    },
    points: {
      type: DECIMAL(10, 2),
      allowNull: false,
    },
    points_image: {
      type: STRING(255),
      allowNull: true,
    },
    current_balance: {
      type: DECIMAL(10, 2),
      allowNull: false,
    },
    source: {
      type: STRING(50),
      allowNull: true,
    },
    description: {
      type: STRING,
    },
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
