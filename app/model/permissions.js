/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-11-06 16:31:36
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-04-08 11:02:31
 * @FilePath: \Mini_program_backend\app\model\permissions.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

module.exports = app => {
  const { model } = app;
  const permissionsSchema = require("../../app/schema/permissions")(app);

  const Permissions = model.define("permissions", permissionsSchema, {
    tableName: "permissions", // 对应数据库中的 'roles' 表
  });

  // 在这里定义 belongsToMany 关联
  Permissions.associate = function () {
    const { Role, RolePermissions, MemberCard, MemberPrivileges, MemberGoods } =
      model;
    Permissions.belongsToMany(Role, {
      through: RolePermissions,
      foreignKey: "permission_id",
      otherKey: "role_id",
    });

    Permissions.belongsToMany(MemberCard, {
      through: MemberPrivileges,
      foreignKey: "permission_id",
      otherKey: "member_card_id",
    });

    Permissions.belongsToMany(MemberGoods, {
      through: MemberPrivileges,
      foreignKey: "permissions_id",
      otherKey: "member_goods_id",
    });
  };

  Permissions.saveNew = async params => {
    const permission = await Permissions.create(params);
    return permission.id;
  };

  return Permissions;
};
