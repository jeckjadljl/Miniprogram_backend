/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-08-15 13:46:17
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-08-17 11:35:54
 * @FilePath: \Mini_program_backend\app\schedule\update_team_distance.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

module.exports = {
  schedule: {
    interval: "15m",
    type: "worker",
  },

  async task(ctx) {
    try {
      const approvedRecords = await ctx.model.WeRun.RunRecord.findAll({
        where: { status: "approved" },
        include: [
          {
            model: ctx.model.User,
            as: "user",
            attributes: ["uuid"],
            include: [
              {
                model: ctx.model.WeRun.Team,
                as: "teams",
                attributes: ["uuid"],
                through: { attributes: [] },
              },
            ],
          },
        ],
      });

      const teamDistanceMap = approvedRecords.reduce((acc, record) => {
        record.user.teams.forEach(team => {
          acc[team.uuid] = (acc[team.uuid] || 0) + parseFloat(record.distance);
        });
        return acc;
      }, {});

      await ctx.model.transaction(async t => {
        for (const [teamId, total] of Object.entries(teamDistanceMap)) {
          await ctx.model.WeRun.Team.update(
            {
              totalDistance: ctx.app.Sequelize.literal(
                `totalDistance + ${total}`
              ),
            },
            {
              where: { uuid: teamId },
              transaction: t,
            }
          );
        }
      });

      ctx.logger.info("[TeamDistance] 战队距离更新成功");
    } catch (error) {
      ctx.logger.error("[TeamDistance] 更新失败:", error);
    }
  },
};
