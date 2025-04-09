/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-11-21 17:04:41
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-03-10 18:24:31
 * @FilePath: \Mini_program_backend\app\schema\rewards.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
module.exports = app => {
  const { STRING, UUIDV4, DATE, DECIMAL } = app.Sequelize;

  return {
    id: {
      type: STRING,
      defaultValue: UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: STRING,
      allowNull: false,
    },
    amount: {
      type: DECIMAL(10, 2),
      allowNull: false,
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
