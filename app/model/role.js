/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-11-03 11:33:05
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-01-12 16:03:15
 * @FilePath: \Mini_program_backend\app\model\role.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

module.exports = app => {
  const { model } = app;
  const roleSchema = require("../../app/schema/role")(app);

  const Role = model.define("role", roleSchema, {
    tableName: "role", // 对应数据库中的 'roles' 表
  });

  // 在这里定义 belongsToMany 关联
  Role.associate = function () {
    const { Role, User, Permissions, UserRoles, RolePermissions } = model;
    Role.belongsToMany(User, {
      through: UserRoles,
      foreignKey: "role_id",
      otherKey: "user_id",
    });
    Role.belongsToMany(Permissions, {
      through: RolePermissions,
      foreignKey: "role_id",
      otherKey: "permission_id",
    });
  };

  Role.get = async roleName => {
    const role = await Role.findOne({ where: { name: roleName } });
    if (!role) {
      this.ctx.throw(404, `角色 ${roleName} 不存在`);
    }
    return role;
  };

  return Role;
};
