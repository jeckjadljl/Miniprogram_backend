/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-08-11 11:56:39
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-08-11 14:34:43
 * @FilePath: \Mini_program_backend\app\schedule\check_team_activity.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

module.exports = {
  schedule: {
    interval: "30m", // 每30分钟执行一次
    type: "worker",
  },

  async task(ctx) {
    try {
      const now = new Date();
      // 更新已过期的活动
      const expired = await ctx.app.model.WeRun.TeamActivity.update(
        { status: "ended" },
        {
          where: {
            end_time: { [ctx.app.Sequelize.Op.lt]: now },
            status: { [ctx.app.Sequelize.Op.ne]: "ended" },
          },
        }
      );

      // 更新进行中的活动
      const ongoing = await ctx.app.model.WeRun.TeamActivity.update(
        { status: "ongoing" },
        {
          where: {
            start_time: { [ctx.app.Sequelize.Op.lt]: now },
            end_time: { [ctx.app.Sequelize.Op.gt]: now },
            status: "pending",
          },
        }
      );

      ctx.logger.info(
        "[schedule] 已更新 %d 个过期活动，%d 个进行中活动",
        expired[0],
        ongoing[0]
      );
    } catch (err) {
      ctx.logger.error("[schedule] 活动状态更新失败: %s", err.message);
    }
  },
};
