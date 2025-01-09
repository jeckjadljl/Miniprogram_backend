/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-11-06 16:31:36
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2024-12-02 18:47:01
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
    timestamps: false, // 如果表中没有 createdAt 和 updatedAt 字段
  });

  // 在这里定义 belongsToMany 关联
  Permissions.associate = function () {
    const { Role, RolePermissions } = model;
    Permissions.belongsToMany(Role, {
      through: RolePermissions,
      foreignKey: "permission_id",
      otherKey: "role_id",
    });
  };

  return Permissions;
};
