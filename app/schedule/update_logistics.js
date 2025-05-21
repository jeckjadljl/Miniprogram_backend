/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-05-04 20:43:12
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-05-05 10:33:16
 * @FilePath: \Mini_program_backend\app\schedule\update_logistics.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
module.exports = {
  schedule: {
    interval: "30m", // 每30分钟执行一次
    type: "worker",
  },

  async task(ctx) {
    try {
      const pendingLogistics = await ctx.model.Logistics.findAll({
        where: {
          [ctx.app.Sequelize.Op.or]: [{ waybill_token: null }],
        },
        limit: 20, // 每次处理20条
      });

      await Promise.all(
        pendingLogistics.map(logistics =>
          ctx.service.logistics.updateWaybillToken(
            logistics.uuid,
            logistics.order_id
          )
        )
      );
    } catch (error) {
      ctx.logger.error("物流定时任务执行失败：", error);
    }
  },
};
