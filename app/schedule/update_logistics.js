/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-05-04 20:43:12
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-07-01 22:22:57
 * @FilePath: \Mini_program_backend\app\schedule\update_logistics.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
module.exports = {
  schedule: {
    interval: "10m", // 每30分钟执行一次
    type: "worker",
  },

  async task(ctx) {
    const { app } = ctx;
    // 添加分布式锁防止多实例重复执行
    const lockKey = "logistics_update_lock";
    const lock = await app.redlock.lock(lockKey, 60000); // 30秒锁

    try {
      const pendingLogistics = await ctx.model.Logistics.findAll({
        where: {
          logistics_status: {
            [ctx.app.Sequelize.Op.notIn]: [4, 5, 6],
          },
          check_count: {
            [ctx.app.Sequelize.Op.lt]: 50, // 最大检查50次
          },
          [ctx.app.Sequelize.Op.or]: [
            { last_checked_time: null },
            {
              last_checked_time: {
                [ctx.app.Sequelize.Op.lt]: ctx.app.Sequelize.literal(
                  "NOW() - INTERVAL 1 HOUR"
                ),
              },
            },
          ],
        },
        order: [
          ["last_checked_time", "ASC"], // 优先最久未检查的
          ["check_count", "ASC"], // 优先检查次数少的
        ],
        limit: 15, // 每次处理20条
      });

      for (const logistics of pendingLogistics) {
        try {
          const result = await ctx.service.logistics.updateWaybillToken(
            logistics.uuid
          );

          if (!result) continue;
          // 添加调用日志
          ctx.logger.info("开始处理物流记录", {
            logistics_id: logistics.uuid,
            orderitem_id: result?.orderitemId,
          });
          if (result) {
            // 添加超时处理
            await Promise.race([
              ctx.service.logistics.queryTrace(result.orderitemId),
              new Promise((_, reject) =>
                setTimeout(() => reject(new Error("查询超时")), 10000)
              ),
            ]);
            ctx.logger.info(`物流${logistics.uuid}更新成功`);
          } else {
            ctx.logger.warn(`物流${logistics.uuid}未获取到waybill_token`);
          }
        } catch (error) {
          ctx.logger.error(`物流${logistics.uuid}处理失败：`, error);
          // 增强错误日志
          ctx.logger.error(`物流处理失败详情`, {
            logistics_id: logistics.uuid,
            error: error.message,
            stack: error.stack,
          });

          // 更新记录避免卡死
          await ctx.model.Logistics.update(
            {
              last_checked_time: new Date(),
              check_count: ctx.app.Sequelize.literal("check_count + 1"),
            },
            { where: { uuid: logistics.uuid } }
          );

          if (error.message.includes("超过最大检查次数")) {
            await ctx.model.Logistics.update(
              {
                logistics_status: 5, // 标记为异常
              },
              { where: { uuid: logistics.uuid } }
            );
          }
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (error) {
      ctx.logger.error("物流定时任务执行失败：", error);
    } finally {
      await lock.unlock();
    }
  },
};
