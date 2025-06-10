/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-05-04 20:43:12
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-06-08 11:35:31
 * @FilePath: \Mini_program_backend\app\schedule\update_logistics.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
module.exports = {
  schedule: {
    interval: "5m", // 每30分钟执行一次
    type: "worker",
  },

  async task(ctx) {
    const { app } = ctx;
    // 添加分布式锁防止多实例重复执行
    const lockKey = "logistics_update_lock";
    const lock = await app.redlock.lock(lockKey, 30000); // 30秒锁

    try {
      const pendingLogistics = await ctx.model.Logistics.findAll({
        where: {
          [ctx.app.Sequelize.Op.or]: [
            { waybill_token: null }, // 未获取token的记录
            { logistics_status: { [ctx.app.Sequelize.Op.notIn]: [4, 5] } }, // 未完成状态的记录
          ],
          [ctx.app.Sequelize.Op.and]: [
            ctx.app.Sequelize.where(
              ctx.app.Sequelize.literal(
                "TIMESTAMPDIFF(MINUTE, last_checked_time, NOW())"
              ),
              ">=",
              5 // 至少30分钟未检查的记录
            ),
          ],
        },
        order: [
          ["check_count", "ASC"], // 优先检查次数少的
          ["last_checked_time", "ASC"], // 优先最久未检查的
        ],
        limit: 20, // 每次处理20条
      });

      await Promise.all(
        pendingLogistics.map(async logistics => {
          try {
            const result = await ctx.service.logistics.updateWaybillToken(
              logistics.uuid
            );
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
          }
        })
      );
    } catch (error) {
      ctx.logger.error("物流定时任务执行失败：", error);
    } finally {
      await lock.unlock();
    }
  },
};
