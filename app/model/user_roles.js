/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-11-06 16:32:21
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-03-01 12:15:44
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
  });

  UserRoles.add = async ({ userId, roleId }) => {
    // 确保 userId 和 roleId 是有效的
    if (!userId || !roleId) {
      throw new Error("Both userId and roleId are required");
    }

    const [userRole, created] = await UserRoles.findOrCreate({
      where: {
        user_id: userId,
        role_id: roleId,
      },
      defaults: {
        // 只传递需要的字段，不包括 created_at
        user_id: userId,
        role_id: roleId,
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

  UserRoles.getUserHighestRole = async userId => {
    try {
      // 获取用户的角色列表
      const roles = await UserRoles.findAll({
        where: { user_id: userId },
        include: [
          {
            model: model.Role,
            as: "user_id", // 根据关联的别名
          },
        ],
      });

      // 提取角色的名称
      const roleNames = roles.map(role => role.role.name);

      // 定义角色的优先级，从最高到最低
      const roleHierarchy = ["premium", "junior", "general", "user"];

      // 找到用户拥有的最高级别角色
      for (const role of roleHierarchy) {
        if (roleNames.includes(role)) {
          return role; // 返回最高级别的角色
        }
      }

      // 如果没有匹配到任何角色，返回一个默认值或 null
      return null;
    } catch (error) {
      app.logger.error(`查询用户最高级别角色失败: 用户 ${userId}`, error);
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
        user_id: userId,
        role_id: newRole.id,
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
