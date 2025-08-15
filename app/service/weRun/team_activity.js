/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-07-26 14:54:39
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-08-15 13:54:36
 * @FilePath: \Mini_program_backend\app\service\weRun\team_activity.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-07-26 14:54:39
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-08-04 17:21:55
 * @FilePath: \Mini_program_backend\app\service\weRun\team_activity.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

const Service = require("egg").Service;

class Team_activityService extends Service {
  // 创建战队活动
  async createActivity(params) {
    const { app } = this;
    const { user_id, userName, activity } = params;
    const { team_id } = activity;

    const team = await app.model.WeRun.Team.findOne({
      where: { uuid: team_id },
    });
    if (team) {
      team.update({
        activityCount: team.activityCount + 1,
      });
    }

    return app.model.WeRun.TeamActivity.saveNew({
      ...activity,
      ...app.getCrateInfo(user_id, userName),
    });
  }

  // 参加战队活动
  async joinActivity(params = {}) {
    const { app } = this;
    const { user_id, team_activity_id } = params;

    // 1. 获取活动详情
    const activityDetail = await this.getActivityDetail({
      uuid: team_activity_id,
    });
    if (!activityDetail) {
      throw new Error("活动不存在");
    }

    // 2. 检查活动是否已满员
    const currentParticipants = await app.model.WeRun.TeamMembersActivity.count(
      {
        where: { team_activity_id },
      }
    );
    if (currentParticipants >= activityDetail.population_limit) {
      throw new Error("活动人数已满，无法加入");
    }

    // 3. 检查用户是否已参加该活动
    const existingRecord = await app.model.WeRun.TeamMembersActivity.findOne({
      where: { team_activity_id, user_id },
    });
    if (existingRecord) {
      throw new Error("您已参加该活动，无需重复加入");
    }

    return app.model.WeRun.TeamMembersActivity.joinActivity(params);
  }

  async getActivityList(params = {}) {
    const { app } = this;
    return app.model.WeRun.TeamActivity.getActivityList({
      ...params,
      teamActivityAttributes: [
        "uuid",
        "team_id",
        "team_name",
        "activity_image",
        "title",
        "contact_person",
        "contact_information",
        "description",
        "location",
        "population_limit",
        "status",
        "start_time",
        "end_time",
      ],
    });
  }

  async getActivityDetail(params = {}) {
    const { app } = this;
    const activityDetail = await app.model.WeRun.TeamActivity.getActivityDetail(
      params
    );

    // if (activityDetail) {
    //   activityDetail.dataValues = activityDetail.dataValues || {};
    //   activityDetail.dataValues.members = [];

    //   // 2. 如果活动存在且有战队ID，查询战队成员
    //   if (activityDetail.team_id) {
    //     // 查询战队成员（只获取头像和名称）
    //     const team = await app.model.WeRun.Team.findOne({
    //       where: { uuid: activityDetail.team_id },
    //       include: [
    //         {
    //           model: app.model.User,
    //           attributes: ["avatar", "user_name"],
    //           as: "users",
    //         },
    //       ],
    //     });
    //     console.log("teamMembers:", team?.users);
    //     // 3. 将成员信息添加到活动详情中
    //     activityDetail.dataValues.members = team?.users || [];
    //   }
    // }
    // console.log("activityDetail:", activityDetail);

    return activityDetail;
  }
}

module.exports = Team_activityService;
