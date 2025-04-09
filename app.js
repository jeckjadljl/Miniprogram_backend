/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-11-03 15:50:48
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-03-17 11:16:02
 * @FilePath: \Mini_program_backend\app.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
require("dotenv").config();
// const fecha = require("fecha");
// const { v4: uuidv4 } = require("uuid");
const md5 = require("md5");
// const fecha = require("fecha");

const { ADMIN_USERNAME, ADMIN_PASSWORD } = process.env;

class AppBootHook {
  constructor(app) {
    this.app = app;
  }

  configWillLoad() {
    // 配置文件和插件文件已被加载。
  }

  configDidLoad() {
    // 配置文件和插件文件已被加载。
  }

  async didLoad() {
    // 所有文件已加载，可以启动插件。
  }

  async willReady() {
    // 所有插件已启动，应用准备就绪前执行操作。
    const {
      Role,
      Permissions,
      User,
      UserRoles,
      RolePermissions,
      VoucherRules,
      Admin, // 添加 Admin 模型引用
    } = this.app.model;

    // try {
    //   await this.app.model.sync({ alter: true }); // force: true 将强制重建表（删除数据）
    //   console.log("所有模型与数据库同步成功！");
    // } catch (error) {
    //   console.error("模型同步失败:", error);
    //   throw error; // 抛出错误终止启动
    // }

    // 初始化角色
    const roles = [
      { name: "admin", description: "管理员" },
      { name: "general", description: "严选会员" },
      { name: "junior", description: "分享会员" },
      { name: "premium", description: "资深会员" },
      { name: "user", description: "普通用户" },
    ];

    for (const role of roles) {
      const [createdRole, created] = await Role.findOrCreate({
        where: { name: role.name },
        defaults: { description: role.description },
      });
      if (created) {
        this.app.logger.info(`角色 ${role.name} 初始化成功`);
      }
    }

    // 初始化权限
    const permissions = [
      { name: "*", description: "代表拥有所有权限" },
      { name: "invite-user", description: "拥有邀请新用户的权限" },
    ];

    for (const permission of permissions) {
      const [createdPermission, created] = await Permissions.findOrCreate({
        where: { name: permission.name },
        defaults: { description: permission.description },
      });
      if (created) {
        this.app.logger.info(`权限 ${permission.name} 初始化成功`);
      }
    }

    // 检查并创建管理员角色与权限关联
    const adminRole = await Role.findOne({ where: { name: "admin" } });
    const allPermission = await Permissions.findOne({ where: { name: "*" } });

    if (adminRole && allPermission) {
      const existingRolePermission = await RolePermissions.get({
        roleId: adminRole.id,
        permissionId: allPermission.id,
      });

      if (!existingRolePermission) {
        await RolePermissions.add({
          roleId: adminRole.id,
          permissionId: allPermission.id,
        });
        this.app.logger.info("管理员角色与 '*' 权限的关联已创建");
      } else {
        this.app.logger.info("管理员角色与 '*' 权限的关联已存在");
      }
    }

    const [admin, adminCreated] = await Admin.findOrCreate({
      where: { userName: ADMIN_USERNAME },
      defaults: {
        lastModifierName: "system",
        lastModifierId: "system",
        creatorName: "system",
        creatorId: "system",
        name: "超级管理员",
        enableStatus: "enabled",
        userType: "admin",
        userName: ADMIN_USERNAME,
        password: md5(ADMIN_PASSWORD), // 默认密码
      },
    });

    if (adminCreated) {
      this.app.logger.info("system 超级管理员 admin 创建成功");
    }

    // 创建 admin 超级管理员用户
    const [adminUser, userCreated] = await User.findOrCreate({
      where: { user_name: ADMIN_USERNAME },
      defaults: {
        openid: "admin_openid", // 假设一个唯一的 openid
        user_name: ADMIN_USERNAME,
        avatar: "https://api.multiavatar.com/$%7Bctry_code%7D$%7Bmobile%7D.svg",
        phoneNumber: "13306047118", // 假设一个有效的手机号码
        password: md5(ADMIN_PASSWORD), // 默认密码
        desc: "超级管理员", // 描述
        lastLoginAt: new Date(), // 最近登录时间
      },
    });

    if (userCreated) {
      this.app.logger.info("超级管理员 admin 用户创建成功");
    }

    // 检查并创建用户与角色关联
    if (adminUser && adminRole) {
      const existingUserRole = await UserRoles.findOne({
        where: { user_id: adminUser.uuid, role_id: adminRole.id },
      });

      if (!existingUserRole) {
        await UserRoles.add({
          userId: adminUser.uuid,
          roleId: adminRole.id,
        });
        this.app.logger.info("管理员用户与管理员角色的关联已创建");
      } else {
        this.app.logger.info("管理员用户与管理员角色的关联已存在");
      }
    }

    // 初始化抵用券规则
    const voucherRules = [
      {
        voucher_name: "美式咖啡抵用券",
        voucher_type: "美式咖啡抵用券",
        status: true,
      },
      {
        voucher_name: "运动电解质粉剂胶囊抵用卷",
        voucher_type: "运动电解质粉剂胶囊抵用卷",
        status: true,
      },
    ];

    // const now = new Date();
    // const endDate = new Date(now);
    // endDate.setFullYear(now.getFullYear() + 1);

    for (const rule of voucherRules) {
      const [createdRule, created] = await VoucherRules.findOrCreate({
        where: { voucher_name: rule.voucher_name },
        defaults: {
          voucher_name: rule.voucher_name,
          voucher_type: rule.voucher_type,
          status: rule.status,
          // start_date: fecha.format(now, "YYYY-MM-DD HH:mm:ss"),
          // end_date: fecha.format(endDate, "YYYY-MM-DD HH:mm:ss"),
        },
      });
      if (created) {
        this.app.logger.info(
          `抵用券规则：满 ${rule.min_spend} 减 ${rule.deduction} 初始化成功`
        );
      }
    }

    // 初始化延迟任务并注册订单过期取消任务处理器
    this.initDelayTask();

    this.app.logger.info("初始化操作完成");
  }

  async didReady() {
    // worker 已准备就绪，可以执行操作
    // await this.app.runSchedule("task_name");
  }

  async serverDidReady() {
    // 服务器已开始监听
  }

  /**
   * 初始化延迟任务
   */
  initDelayTask() {
    const app = this.app;
    const ctx = app.createAnonymousContext();

    // 初始化延迟任务
    app.initDelayTask();

    // 注册订单过期自动取消任务处理器
    app.registerTaskHandler("cancelOrder", async uuid => {
      try {
        // 从服务中获取订单详情
        const goodsOrder = await ctx.service.order.getByUuid(uuid);

        if (goodsOrder && goodsOrder.order_status === "initial") {
          // 执行取消订单操作
          await ctx.service.order.cancel(goodsOrder.dataValues);
          console.log(`过期自动取消订单成功: uuid=${uuid}`);
        } else {
          console.log(
            `无需取消订单: uuid=${uuid}, 当前状态: ${goodsOrder?.status}`
          );
        }
      } catch (error) {
        console.error(
          `处理取消订单任务时出错: uuid=${uuid}, 错误信息:`,
          error.message
        );
      }
    });

    console.log("延迟任务初始化完成并注册任务处理器");
  }
}

module.exports = AppBootHook;
