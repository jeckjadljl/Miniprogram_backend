/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-11-19 17:50:12
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2024-12-25 11:03:29
 * @FilePath: \Mini_program_backend\app\schema\referrals.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
module.exports = app => {
  const { STRING, UUIDV4, DATE, ENUM } = app.Sequelize;

  return {
    id: {
      type: STRING,
      defaultValue: UUIDV4,
      primaryKey: true,
    },
    referrer_id: {
      type: STRING(38),
      allowNull: false,
    }, // 推荐人
    referred_user_id: {
      type: STRING(38),
      allowNull: false,
    }, // 被推荐的用户
    membership_level: ENUM("general", "junior", "premium"),
    level: ENUM("1", "2"),
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
