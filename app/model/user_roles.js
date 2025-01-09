/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-11-06 16:32:21
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2024-12-04 13:34:46
 * @FilePath: \Mini_program_backend\app\model\user_roles.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

module.exports = app => {
  const { model } = app;
  const userRolesSchema = require("../../app/schema/user_roles")(app);

  const UserRoles = model.define("user_roles", userRolesSchema, {
    tableName: "user_roles", // 对应数据库中的 'user_roles' 表
    timestamps: false, // 如果表中没有 createdAt 和 updatedAt 字段
  });

  UserRoles.add = async ({ userId, roleId }) => {
    const [userRole, created] = await UserRoles.findOrCreate({
      where: {
        user_id: userId,
        role_id: roleId,
      },
      defaults: {
        created_at: new Date(),
      },
    });

    return created;
  };

  UserRoles.getUserRoles = async userId => {
    try {
      const roles = await UserRoles.findAll({
        where: { user_id: userId },
        include: [
          {
            model: model.Role,
            as: "role", // 根据关联的别名
          },
        ],
      });

      return roles.map(role => role.role); // 返回角色列表
    } catch (error) {
      app.logger.error(`查询用户角色失败: 用户 ${userId}`, error);
      throw error;
    }
  };

  UserRoles.addMembershipRole = async (userId, roleName) => {
    const newRole = await model.Role.findOne({
      where: { name: roleName },
    });
    if (!newRole) {
      throw new Error(`角色 ${roleName} 不存在`);
    }

    const [userRole, created] = await UserRoles.findOrCreate({
      where: {
        user_id: userId,
        role_id: newRole.id,
      },
      defaults: {
        created_at: new Date(),
      },
    });

    if (created) {
      app.logger.info(`用户 ${userId} 的会员等级已更新为 ${roleName}`);
    } else {
      app.logger.info(`用户 ${userId} 已经是 ${roleName} 会员`);
    }
  };

  return UserRoles;
};
