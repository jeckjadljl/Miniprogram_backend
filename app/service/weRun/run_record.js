/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-07-25 18:19:19
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-08-22 10:12:05
 * @FilePath: \Mini_program_backend\app\service\weRun\run_record.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

const Service = require("egg").Service;

// const UpLoadImage = require("../../utils/uploadImage");

class Run_recordService extends Service {
  async submitRunRecord(params = {}) {
    const { app, ctx } = this;
    const { user_id, userName, records } = params;
    const crateInfo = app.getCrateInfo(user_id, userName);

    // 新增：检查打卡时间（5:00-22:00）
    const now = new Date();
    const currentHour = now.getHours();
    if (currentHour < 5 || currentHour >= 22) {
      throw new Error("每日有效打卡时间为05:00-22:00，当前时间不可打卡");
    }

    // 新增：检查当日是否已存在记录
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);

    const existing = await app.model.WeRun.RunRecord.findOne({
      where: {
        user_id,
        date: {
          [app.Sequelize.Op.between]: [todayStart, todayEnd],
        },
      },
    });

    if (existing) {
      throw new Error("每日只能提交一次跑步记录");
    }

    // 获取用户所属战队
    const result = await app.model.User.findTeamMember({
      user_id,
      attributes: ["uuid", "user_name", "avatar", "real_name"],
      teamAttributes: [
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
    });
    console.log("战队数组:", result.teams);
    console.log("第一个战队对象:", result.teams?.[0]);
    console.log("UUID:", result.teams?.[0]?.uuid);

    // const image = new UpLoadImage(ctx);
    // const upload = await image.uploadImage({
    //   image: records.screenshot,
    //   BucketType: "RunRecord",
    // });

    const teamUUID = result.teams?.[0]?.uuid;

    // console.log("上传的图片:", upload);
    return app.model.WeRun.RunRecord.saveNew({
      ...records,
      ...crateInfo,
      screenshot: records.screenshot,
      user_id,
      team_id: teamUUID,
      status: "pending", // 无战队自动通过
      date: new Date(),
    });
  }

  async modifyRecords(params = {}) {
    const { app, ctx } = this;
    const { records, user_id, userName } = params;
    const { record_id } = records;
    const modify = await app.getModifyInfo(user_id, userName);

    // let upload;
    // if (records.screenshot) {
    //   const image = new UpLoadImage(ctx);
    //   upload = await image.uploadImage({
    //     image: records.screenshot,
    //     BucketType: "RunRecord",
    //   });
    // }

    // console.log("上传的图片:", upload);
    return app.model.WeRun.RunRecord.update(
      {
        ...records,
        screenshot: records.screenshot,
        ...modify,
      },
      {
        where: { uuid: record_id },
      }
    );
  }

  async getHistory(userId) {
    return this.ctx.model.WeRun.RunRecord.findAll({
      where: { user_id: userId },
      order: [["createdTime", "DESC"]],
      attributes: [
        "distance",
        "duration",
        "steps",
        "sports_mode",
        "date",
        "createdTime",
      ],
    });
  }

  async getCalendar(userId, month) {
    const startDate = new Date(month);
    const endDate = new Date(
      startDate.getFullYear(),
      startDate.getMonth() + 1,
      0
    );

    const records = await this.ctx.model.WeRun.RunRecord.findAll({
      where: {
        user_id: userId,
        date: { [this.app.Sequelize.Op.between]: [startDate, endDate] },
      },
      attributes: ["date"],
    });

    const calendarMap = new Map(
      records.map(r => [r.date.toISOString().slice(0, 10), 1])
    );

    const daysInMonth = endDate.getDate();
    return Array.from({ length: daysInMonth }, (_, i) => {
      const date = new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        i + 1
      )
        .toISOString()
        .slice(0, 10);
      return { date, status: calendarMap.has(date) ? 1 : 0 };
    });
  }

  // 新增月度结算方法
  async calculateMonthlyReward(userId, month) {
    const calendar = await this.getCalendar(userId, month);
    const totalDays = calendar.length;
    const completedDays = calendar.filter(d => d.status === 1).length;

    // 奖励规则示例（可根据需求调整）
    const rewardRules = [
      { days: totalDays, reward: "全勤奖" }, // 全勤
      { days: 25, reward: "银牌坚持奖" }, // 25天以上
      { days: 15, reward: "铜牌参与奖" }, // 15天以上
    ];

    // 匹配最高达标奖励
    const validReward = rewardRules
      .sort((a, b) => b.days - a.days)
      .find(rule => completedDays >= rule.days);

    return {
      month,
      totalDays,
      completedDays,
      reward: validReward ? validReward.reward : null,
    };
  }

  // 获取用户战队数据
  async getUserTeamData(params = {}) {
    const { app } = this;
    const { user_id } = params;
    // 查询用户所属战队信息
    const result = await app.model.User.findTeamMember({
      user_id,
      attributes: ["uuid", "user_name", "avatar", "real_name"],
      teamAttributes: [
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
    });
    // 返回战队数组，如果没有战队则返回空数组
    return result;
  }

  // 获取待审核记录
  async getPendingRecords(params = {}) {
    const { app } = this;
    const { user_id } = params;

    // 获取用户所属战队
    const result = await app.model.User.findTeamMember({
      user_id,
      attributes: ["uuid", "user_name", "avatar", "real_name"],
      teamAttributes: [
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
    });
    const teamUuids = result.teams?.map(team => team.uuid) || [];

    console.log("用户加入战队ID:", teamUuids);
    console.log("用户所属战队:", result);

    // 修复查询条件构建
    const whereCondition = {
      status: "pending",
      [app.Sequelize.Op.and]: [
        { user_id: { [app.Sequelize.Op.ne]: user_id } }, // 使用ne替代notIn
        teamUuids.length > 0
          ? {
              [app.Sequelize.Op.or]: [
                { team_id: { [app.Sequelize.Op.or]: [null, ""] } },
                { team_id: { [app.Sequelize.Op.notIn]: teamUuids } },
              ],
            }
          : {}, // 无战队用户时不过滤team_id
        // teamUuids.length > 0
        //   ? {
        //       team_id: {
        //         [app.Sequelize.Op.or]: [null, ""],
        //         [app.Sequelize.Op.notIn]: teamUuids,
        //       },
        //     }
        //   : {},
      ],
    };
    return app.model.WeRun.RunRecord.findAll({
      where: whereCondition,
      order: [["createdTime", "DESC"]], // 新增排序条件
      // where: {
      //   status: "pending",
      //   user_id: { [app.Sequelize.Op.notIn]: user_id },
      //   // team_id: {
      //   //   [app.Sequelize.Op.or]: [
      //   //     { [app.Sequelize.Op.notIn]: teamUuids },
      //   //     null,
      //   //   ],
      // }, // 排除自己战队的
      include: [
        {
          model: app.model.User,
          as: "user",
          attributes: ["uuid", "user_name", "avatar", "real_name"], // 选择需要返回的用户字段
        },
        {
          model: app.model.WeRun.Team,
          as: "team",
          attributes: [
            "uuid",
            "team_name",
            "logo_image",
            "captain",
            "totalDistance",
            "activityCount",
            "slogan",
          ], // 选择需要返回的战队字段
          required: false, // 允许没有战队的记录
        },
      ],
      // include: [
      //   {
      //     model: app.model.User,
      //     as: "users",
      //     where: {
      //       team_id: { [app.Sequelize.Op.notIn]: teamIds },
      //     },
      //   },
      // ],
    });

    // return app.model.WeRun.RunRecord.findAll({
    //   where: {
    //     team_id,
    //     status: "pending",
    //   },
    //   include: [{ model: app.model.User, as: "users" }],
    // });
  }

  // 提交审核
  async submitReview(params) {
    const { app } = this;
    const {
      record_id,
      reviewer_id,
      reviewer_name,
      reviewer_team_id,
      reviewer_team_name,
      status,
      reason,
    } = params;

    return await app.transaction(async transaction => {
      // 新增：检查当日审核次数
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const todayCount = await app.model.WeRun.ReviewRecord.count({
        where: {
          reviewer_id,
          createdTime: { [app.Sequelize.Op.gte]: todayStart },
        },
        transaction,
      });

      if (todayCount >= 10) {
        throw new Error("今日审核次数已达上限");
      }

      // 记录审核操作
      await app.model.WeRun.ReviewRecord.create(
        {
          run_record_id: record_id,
          reviewer_id,
          reviewer_name,
          reviewer_team_id, // 审核人所属战队ID
          reviewer_team_name, // 审核人所属战队名称
          status,
        },
        { transaction }
      );

      const record = await app.model.WeRun.RunRecord.findByPk(record_id, {
        transaction,
      });

      // 新增：立即处理驳回
      if (status === "rejected") {
        const res = await record.update(
          {
            reviewer_id,
            status: "rejected",
            review_time: new Date(),
            reject_reason: reason,
          },
          { transaction }
        );
        return { status: "rejected", rejectedRecord: res };
      }

      // 获取当前审核状态
      // const approvals = await app.model.WeRun.ReviewRecord.count({
      //   where: {
      //     run_record_id: record_id,
      //     status: "approved",
      //   },
      //   transaction,
      // });

      // 根据业务规则判断是否通过（示例：需要3个不同战队的通过）
      // if (approvals >= 3) {
      const res = await record.update(
        {
          status: "approved",
          review_time: new Date(),
        },
        { transaction }
      );
      // }

      return { status: "approved", approvalRecord: res };
    });
  }

  // 审核记录
  async reviewRecord(params = {}) {
    const { app } = this;
    const { record_id, reviewer_id, status, reason } = params;
    // 获取原记录和战队信息
    const record = await app.model.WeRun.RunRecord.findByPk(record_id);
    const team = await app.model.Team.findByPk(record.team_id, {
      attributes: ["secondary_reviewers"], // 新增字段存储副审核人数组
    });

    // 修改后的审核逻辑核心判断
    if ([team.captain, ...team.secondary_reviewers].includes(reviewer_id)) {
      // 如果是队长或副审核人提交的记录，需要其他两人审核
      const otherReviewers = [team.captain, ...team.secondary_reviewers].filter(
        id => id !== record.user_id
      ); // 排除自己

      if (!otherReviewers.some(id => id === reviewer_id)) {
        throw new Error("该记录需要由其他审核人处理");
      }
    }

    // 判断是否为首次审核
    if (!record.first_reviewer_id) {
      // 首次审核必须是队长
      if (reviewer_id !== team.captain) {
        throw new Error("首次审核必须由队长完成");
      }

      // 更新首次审核信息
      await record.update({
        first_reviewer_id: reviewer_id,
        first_review_time: new Date(),
        status: status === "approved" ? "pending_secondary" : "rejected",
        reject_reason: reason,
      });

      // 如果拒绝则直接返回
      if (status !== "approved") return;

      // 通过后需要二次审核
      return { needSecondaryReview: true };
    }
    // 二次审核人必须是配置的副审核人
    if (!team.secondary_reviewers.includes(reviewer_id)) {
      throw new Error("无权进行二次审核");
    }

    // 更新二次审核信息
    return record.update({
      second_reviewer_id: reviewer_id,
      second_review_time: new Date(),
      status,
      reject_reason: reason,
    });

    // return app.model.WeRun.RunRecord.update(
    //   {
    //     status,
    //     reviewer_id,
    //     review_time: new Date(),
    //     reject_reason: reason,
    //   },
    //   {
    //     where: { uuid: record_id },
    //   }
    // );
  }

  // 获取用户运动数据
  async getUserRunStats(params = {}) {
    const { app } = this;
    const { user_id } = params;

    // 新增：检查当天是否已打卡
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);

    const todayRecord = await app.model.WeRun.RunRecord.findOne({
      where: {
        user_id,
        date: { [app.Sequelize.Op.between]: [todayStart, todayEnd] },
      },
    });

    // 获取基础统计数据
    const totalStats = await app.model.WeRun.RunRecord.findAll({
      where: {
        user_id,
        status: "approved", // 只统计已通过记录
      },
      attributes: [
        [app.Sequelize.fn("COUNT", app.Sequelize.col("uuid")), "totalDays"],
        [
          app.Sequelize.fn("SUM", app.Sequelize.col("distance")),
          "totalDistance",
        ],
        [
          app.Sequelize.fn("SUM", app.Sequelize.col("duration")),
          "totalDuration",
        ],
      ],
      raw: true,
    });

    // 获取本月打卡日历
    const currentMonth = new Date().toISOString().slice(0, 7);
    const calendar = await this.getCalendar(user_id, `${currentMonth}-01`);

    return {
      totalDays: Number(totalStats[0]?.totalDays || 0),
      totalDistance: Number(totalStats[0]?.totalDistance || 0).toFixed(2),
      totalDuration: Number(totalStats[0]?.totalDuration || 0).toFixed(2),
      currentMonth,
      hasTodayRecord: !!todayRecord, // 新增当天打卡状态
      currentMonthDays: calendar
        .filter(day => day.status === 1)
        .map(day => day.date.slice(8, 10)), // 返回日期数组如 ["01", "05", "15"]
    };
  }

  async getRecordDetail(params = {}) {
    const { app } = this;
    const { record_id } = params;
    if (!record_id) {
      throw new Error("记录ID不能为空");
    }
    return app.model.WeRun.RunRecord.findByPk(record_id);
  }

  async getReviewedRecords(params = {}) {
    const { app } = this;
    const { user_id, page = 1, pageSize = 10 } = params;

    const { count, rows } = await app.model.WeRun.RunRecord.findAndCountAll({
      where: {
        user_id,
        status: {
          [app.Sequelize.Op.in]: ["approved", "rejected"],
        },
      },
      include: [
        {
          model: app.model.WeRun.ReviewRecord,
          as: "reviews",
          attributes: [
            "run_record_id",
            "reviewer_id",
            "reviewer_name",
            "reviewer_team_id",
            "reviewer_team_name",
            "status",
            "createdTime",
          ],
        },
      ],
      order: [["review_time", "DESC"]],
      limit: pageSize,
      offset: (page - 1) * pageSize,
      distinct: true, // 避免分页计数错误
    });

    return { page, count, rows };
  }

  async getReviewedCount(params = {}) {
    const { app } = this;
    const { user_id } = params;

    return app.model.WeRun.RunRecord.count({
      where: {
        user_id,
        status: {
          [app.Sequelize.Op.in]: ["approved", "rejected"],
        },
      },
    });
  }
}

module.exports = Run_recordService;
