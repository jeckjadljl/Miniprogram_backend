/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-11-03 15:50:48
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-06-06 11:26:16
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
// const { createBullBoard } = require("@bull-board/api");
// const { BullMQAdapter } = require("@bull-board/api/bullMQAdapter");
// const { KoaAdapter } = require("@bull-board/koa");

const {
  ADMIN_USERNAME,
  ADMIN_PASSWORD,
  TENCENT_BUCKET,
  TENCENT_REGION,
  REDIS_HOST,
  REDIS_PORT,
} = process.env;

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
    // 添加 redis 客户端
    const Redis = require("ioredis");
    const Redlock = require("redlock");

    // 确保 Redis 配置存在
    // if (!this.app.config.redis || !this.app.config.redis.client) {
    //   this.app.logger.error("Redis configuration is missing");
    //   throw new Error("Redis configuration is required");
    // }

    // 初始化 redis 实例
    const redisClient = new Redis({
      host: REDIS_HOST,
      port: REDIS_PORT,
      password: "",
      db: 0,
    });

    // 解决 ioredis v5+ 兼容性问题
    redisClient.connect = redisClient.connect || (() => Promise.resolve());

    // 创建 redlock 实例并挂载到 app 对象
    const redlock = new Redlock(
      [redisClient],
      {
        // 确保有合理的默认配置
        driftFactor: 0.01,
        retryCount: 3,
        retryDelay: 200,
        retryJitter: 200,
      }
      // ...(this.app.config.redlock.options || {})
    );
    this.app.redlock = redlock;

    // 正确的错误处理（应监听 redlock 实例）
    redlock.on("error", err => {
      console.error("Redlock error:", err);
      // 2. 使用错误名判断类型（4.2.0 没有 ResourceLockedError 导出）
      if (err.name === "ResourceLockedError") {
        this.app.logger.warn("[Redlock] Resource locked:", err.message);
      } else {
        this.app.logger.error("[Redlock] Critical error:", err);
      }
    });

    // Redis 客户端基础错误处理
    redisClient.on("error", error => {
      this.app.logger.error("[Redis] Connection error:", error);
    });

    console.log("Redlock instance type:", redlock.constructor.name);
    console.log("Lock method exists:", typeof redlock.lock === "function");

    // 测试代码 - 验证 Redlock 是否工作
    try {
      const lock = await redlock.acquire(["test-resource"], 1000);
      this.app.logger.info("✅ Redlock test: Lock acquired");
      await lock.release();
      this.app.logger.info("✅ Redlock test: Lock released");
    } catch (err) {
      this.app.logger.error("❌ Redlock test failed:", err);
    }
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
        voucher_image: `https://${TENCENT_BUCKET}.cos.${TENCENT_REGION}.myqcloud.com/Vouchers/%E7%94%9F%E6%88%90%E7%BE%8E%E5%BC%8F%E5%92%96%E5%95%A1%E6%8A%B5%E7%94%A8%E5%88%B8.png`,
        status: true,
      },
      {
        voucher_name: "运动电解质粉剂胶囊抵用卷",
        voucher_type: "运动电解质粉剂胶囊抵用卷",
        voucher_image: `https://${TENCENT_BUCKET}.cos.${TENCENT_REGION}.myqcloud.com/Vouchers/%E8%BF%90%E5%8A%A8%E7%94%B5%E8%A7%A3%E8%B4%A8%E7%B2%89%E5%89%82%E8%83%B6%E5%9B%8A.png`,
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
          voucher_image: rule.voucher_image,
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
    const { app } = this;
    const ctx = app.createAnonymousContext();

    // Add null-check before accessing queues
    if (!app.bullmq) {
      // Initialize bullmq service
      ctx.service.bullmq;
    }

    // 初始化 BullMQ 处理器
    const taskJobs = require("./app/job/task")(app);
    const bullmqService = ctx.service.bullmq;

    // 创建 worker 并绑定处理器
    bullmqService.createWorker("taskQueue", async job => {
      const { name, data } = job;
      ctx.logger.info(`[Worker] 开始处理任务: ${name}`);

      // 通过闭包传递 app 实例
      const processor = taskJobs[name];
      if (processor) {
        await processor.call({ app, ctx }, job); // 绑定上下文
      } else {
        ctx.logger.warn(`未知任务类型: ${name}`);
      }
    });

    // Modified queue initialization
    // const queues = app.bullmq?.queues ? Object.values(app.bullmq.queues) : [];

    // const serverAdapter = new KoaAdapter();
    // serverAdapter.setBasePath("/admin/queues");

    // const bullBoard = createBullBoard({
    //   queues: queues.map(q => new BullMQAdapter(q)),
    //   serverAdapter,
    // });

    // this.app.bullboard = bullBoard;
    // this.app.router.get("/admin/queues", bullBoard.getRouter());

    // app.logger.info("BullBoard 监控界面已启用: /admin/queues");
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

    // 在app.js的延迟任务处理器中新增
    app.registerTaskHandler("autoClosePaymentOrder", async outTradeNo => {
      const ctx = app.createAnonymousContext();
      try {
        // 1. 关闭微信支付订单
        await ctx.service.payments.closeOrder(outTradeNo);

        // 2. 更新本地订单状态
        const payment = await ctx.model.Payments.findOne({
          where: { out_trade_no: outTradeNo },
        });

        if (payment && payment.payment_status === "unpaid") {
          await payment.update({
            payment_status: "closed",
            trade_state: "CLOSED",
          });

          // 3. 关联业务订单状态更新
          const orderService = ctx.service.order;
          for (const orderId of payment.business_order_id) {
            await orderService.cancel({
              uuid: orderId,
              user_id: payment.user_id,
              orgUuid: payment.orgUuid,
            });
          }
        }
      } catch (error) {
        ctx.logger.error(`自动关闭订单失败: ${outTradeNo}`, error);
      }
    });

    app.registerTaskHandler("rewardDistribution", async (uuid, taskData) => {
      try {
        const order = await ctx.service.order.getByUuid(uuid);
        if (order && order.order_status === "remark") {
          await ctx.service.rewards.processCompletedOrder({
            order,
            ...taskData,
          });
          console.log(`订单奖励发放成功: ${uuid}`);
        }
      } catch (e) {
        ctx.logger.error(`奖励发放任务失败: ${uuid}`, e.message);
      }
    });

    console.log("延迟任务初始化完成并注册任务处理器");
  }
}

module.exports = AppBootHook;
