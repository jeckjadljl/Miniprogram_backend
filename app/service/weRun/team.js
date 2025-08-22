/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-07-25 16:09:37
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-08-22 11:11:04
 * @FilePath: \Mini_program_backend\app\service\weRun\team.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

const Service = require("egg").Service;
// const UpLoadImage = require("../../utils/uploadImage");

class TeamService extends Service {
  async createTeam(params = {}) {
    const { app, ctx } = this;
    const { user_id, userName, Team } = params;
    const { team_name } = Team;
    const crateInfo = app.getCrateInfo(user_id, userName);

    // 唯一名称校验
    const exist = await app.model.WeRun.Team.findOne({ where: { team_name } });
    if (exist) {
      throw new Error("战队名称已存在");
    }

    // 新增：检查用户是否已加入其他战队
    const existingMembership = await app.model.WeRun.TeamMembers.findOne({
      where: { user_id },
    });
    if (existingMembership) {
      throw new Error("您已加入其他战队，无法创建新战队");
    }

    const team = await app.model.WeRun.Team.saveNew({
      ...Team,
      // logo_image: upload[0],
      ...crateInfo,
    });

    return team;
  }

  async getRanking(params = {}) {
    const { app } = this;
    const { type = "team", range = "week" } = params; // 新增参数：type-排行榜类型，range-时间范围

    // 时间范围计算
    const now = new Date();
    let startTime;
    switch (range) {
      case "day":
        startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case "week":
        startTime = new Date(now - 7 * 86400 * 1000);
        break;
      case "month":
        startTime = new Date(now - 30 * 86400 * 1000);
        break;
      default:
        throw new Error("无效的时间范围参数");
    }

    if (type === "team") {
      return app.model.WeRun.Team.findAll({
        attributes: [
          "uuid",
          "team_name",
          "logo_image",
          "captain",
          // 新增：通过 CASE 语句从成员中提取队长名称
          [
            app.model.literal(
              "MAX(CASE WHEN users.uuid = captain THEN users.user_name END)"
            ),
            "captain_name",
          ],
          [
            app.model.fn("SUM", app.model.col("users.run_records.distance")),
            "totalDistance",
          ],
          [
            app.model.fn("COUNT", app.model.col("users.run_records.uuid")),
            "totalRecords",
          ],
          // 新增：战队人数统计
          [
            app.model.fn(
              "COUNT",
              app.model.fn("DISTINCT", app.model.col("users.uuid"))
            ),
            "member_count",
          ],
          // 新增：今日打卡人数统计
          [
            app.model.literal(`(
              SELECT COUNT(DISTINCT user_id) 
              FROM run_record
              WHERE team_id = uuid
                AND date >= CURDATE() 
                AND status = 'approved'
            )`),
            "today_checkin_count",
          ],
          // [
          //   app.model.fn("SUM", app.model.col("team_activities.distance")),
          //   "total_distance",
          // ],
          // [app.model.fn("COUNT", app.model.col("users.uuid")), "member_count"],
        ],
        include: [
          {
            model: app.model.User,
            as: "users",
            attributes: [],
            through: { attributes: [] }, // 新增：排除中间表字段
            include: [
              {
                model: app.model.WeRun.RunRecord,
                as: "run_records",
                attributes: [],
                required: false, // 添加此行启用左连接
                where: {
                  date: { [app.model.Sequelize.Op.gte]: startTime },
                  status: "approved",
                },
              },
            ],
          },
        ],
        group: [
          "weRun/team.uuid",
          "weRun/team.team_name",
          "weRun/team.logo_image",
          "weRun/team.captain",
        ],
        order: [
          [app.model.literal("totalDistance"), "DESC"],
          [app.model.literal("totalRecords"), "DESC"],
        ],
        // include: [
        //   {
        //     model: app.model.WeRun.TeamActivity,
        //     as: "team_activities",
        //     where: {
        //       start_time: { [app.model.Sequelize.Op.gte]: startTime },
        //     },
        //   },
        //   { model: app.model.User, as: "users" },
        // ],
        // group: ["weRun/team.uuid"],
        // order: [[app.model.literal("total_distance"), "DESC"]],
      });
    }

    // 个人排行榜
    return app.model.WeRun.RunRecord.findAll({
      attributes: [
        "user_id",
        [app.model.fn("SUM", app.model.col("distance")), "total_distance"],
        [
          app.model.fn("COUNT", app.model.col("weRun/run_record.uuid")),
          "total_records",
        ],
      ],
      where: {
        // date: { [app.model.Sequelize.Op.gte]: startTime },
        status: "approved",
      },
      include: [
        {
          model: app.model.User,
          attributes: ["uuid", "user_name", "avatar", "real_name"],
          as: "user",
        },
      ],
      group: ["weRun/run_record.user_id"],
      order: [
        [app.model.literal("total_distance"), "DESC"],
        [app.model.literal("total_records"), "DESC"],
      ],
    });
  }

  async getTeamInfo(team_id) {
    const { app } = this;
    const now = new Date();
    const startTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const team = await app.model.WeRun.Team.findOne({
      where: { uuid: team_id },
      include: [
        {
          model: app.model.User,
          as: "users",
          attributes: [
            "uuid",
            "user_name",
            "avatar",
            "real_name",
            // 新增统计字段
            [
              app.model.literal(`(
              SELECT COALESCE(SUM(distance), 0) 
              FROM run_record 
              WHERE user_id = users.uuid 
                AND date >= '${startTime.toISOString()}'
                AND status = 'approved'
            )`),
              "today_distance",
            ],
            [
              app.model.literal(`(
              SELECT COUNT(DISTINCT DATE(date)) 
              FROM run_record 
              WHERE user_id = users.uuid 
                AND status = 'approved'
            )`),
              "total_days",
            ],
          ],
          through: { attributes: [] },
        },
        {
          model: app.model.WeRun.TeamActivity,
          as: "team_activities",
          // where: { start_time: { [app.model.Sequelize.Op.gte]: sevenDaysAgo } },
        },
      ],
    });

    return team;
  }

  async joinTeam(params = {}) {
    const { app } = this;
    const { team_id, user_id } = params;

    return await app.transaction(async transaction => {
      try {
        // 锁定战队记录（使用行级锁）
        const team = await app.model.WeRun.Team.findByPk(team_id, {
          lock: transaction.LOCK.UPDATE,
          transaction,
        });

        if (!team) {
          throw new Error("战队不存在");
        }

        // 检查人数限制（假设表中有 max_members 字段）
        const currentMembers = await app.model.WeRun.Team.countMember(
          { team_id },
          { transaction }
        );
        console.log(currentMembers);
        if (currentMembers >= team.population_limit) {
          throw new Error("战队人数已达上限");
        }

        // const existingMembership = await app.model.WeRun.TeamMembers.findOne({
        //   where: { user_id },
        //   transaction,
        // });

        // if (existingMembership) {
        //   throw new Error("用户已加入其他战队");
        // }

        // 检查用户是否已加入其他战队
        const result = await app.model.WeRun.Team.getTeamMember({
          team_id,
          attributes: [
            "uuid",
            "team_name",
            "logo_image",
            "captain",
            "totalDistance",
            "activityCount",
            "slogan",
            "population_limit",
            "createdTime",
          ],
          userAttributes: ["uuid", "user_name", "avatar", "real_name"],
        });

        console.log("result", result.users);
        if (result.users.find(user => user.uuid === user_id)) {
          throw new Error("用户已加入其他战队");
        }

        // 更新战队成员
        await app.model.WeRun.TeamMembers.joinActivity(
          {
            team_id,
            user_id,
          },
          { transaction }
        );
        return {
          currentMembers: currentMembers + 1,
          team,
        };
      } catch (e) {
        this.ctx.logger.error(e);
        throw e;
      }
    });
  }

  // 在 TeamService 类中添加以下方法
  async setReviewers(params = {}) {
    const { app } = this;
    const { team_id, captain_id, reviewer_ids } = params;

    // 验证操作者是队长
    const team = await app.model.WeRun.Team.findOne({
      where: {
        uuid: team_id,
        captain: captain_id,
      },
      include: [
        {
          model: app.model.User,
          as: "users",
          attributes: ["uuid"],
        },
      ],
    });

    if (!team) {
      throw new Error("仅队长可设置审核人");
    }

    // 验证成员属于本战队
    const memberIds = team.users.map(u => u.uuid);
    const isValid = reviewer_ids.every(id => memberIds.includes(id));
    if (!isValid) {
      throw new Error("包含非战队成员");
    }

    // 限制最多设置2人
    if (reviewer_ids.length > 2) {
      throw new Error("最多设置2位审核人");
    }

    // 更新副审核人列表
    return team.update({
      secondary_reviewers: reviewer_ids.slice(0, 2),
    });
  }

  async saveNew(params = {}) {
    const { app } = this;
    const result = await app.model.WeRun.Team.saveNew(params);
    return result;
  }
}

module.exports = TeamService;
