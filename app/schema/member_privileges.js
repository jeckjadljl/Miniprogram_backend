/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-03-10 16:13:29
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-06-10 11:24:20
 * @FilePath: \Mini_program_backend\app\schema\member_privileges.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
module.exports = app => {
  const { STRING, UUIDV4, DATE, ENUM } = app.Sequelize;

  return {
    uuid: {
      type: STRING(38),
      defaultValue: UUIDV4,
      primaryKey: true,
    },
    // 会员卡ID
    member_card_id: {
      type: STRING(38),
      allowNull: true,
    },
    member_goods_id: {
      type: STRING(38),
      allowNull: true,
    },
    // 会员权限ID
    permissions_id: {
      type: STRING(38),
      allowNull: true,
    },
    card_type: {
      type: ENUM("green", "pink", "orange", "black"),
      allowNull: true,
    },
    privilege_name: {
      type: STRING(50),
      allowNull: true,
    },
    privilege_desc: {
      type: STRING(255),
      allowNull: true,
    },
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
