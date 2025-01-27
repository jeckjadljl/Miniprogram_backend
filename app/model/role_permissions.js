/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-11-06 16:31:56
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-01-27 17:55:32
 * @FilePath: \Mini_program_backend\app\model\role_permissions.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
// app/model/role_permissions.js
"use strict";

module.exports = app => {
  const { model } = app;
  const rolePermissionsSchema = require("../../app/schema/role_permissions")(
    app
  );

  const RolePermissions = model.define(
    "role_permissions",
    rolePermissionsSchema,
    {
      tableName: "role_permissions", // 对应数据库中的 'roles' 表
    }
  );

  RolePermissions.add = async ({ roleId, permissionId }) => {
    const result = await RolePermissions.findOrCreate({
      where: {
        role_id: roleId,
        permission_id: permissionId,
      },
      defaults: {
        created_at: new Date(),
      },
    });
    return result;
  };

  RolePermissions.get = async ({ roleId, permissionId }) => {
    const result = await RolePermissions.findOne({
      where: { role_id: roleId, permission_id: permissionId },
    });
    return result;
  };

  return RolePermissions;
};
