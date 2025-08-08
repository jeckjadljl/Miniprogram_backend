/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-11-22 16:29:35
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-07-22 10:36:21
 * @FilePath: \Mini_program_backend\app\model\rewards.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
module.exports = app => {
  const { _, Sequelize, model, getSortInfo } = app;
  const { Op } = Sequelize;
  const RewardsSchema = require("../../app/schema/rewards")(app);

  const Rewards = model.define("reward", RewardsSchema, {
    tableName: "rewards",
  });

  Rewards.associate = function () {
    const { User, Order } = model;
    Rewards.belongsTo(User, { foreignKey: "user_id" });
    Rewards.belongsTo(Order, { foreignKey: "order_id" });
  };

  // Rewards.findBalanceAmount = async ({ userId }) => {
  //   return await Rewards.findOne({
  //     where: { user_id: userId },
  //   });
  // };

  // 创建奖励记录
  Rewards.createReward = async ({
    user_id,
    txn_type,
    txn_no,
    order_id,
    amount,
    balance_after,
    remark,
    description,
  }) => {
    await Rewards.create({
      user_id,
      txn_type,
      txn_no,
      order_id,
      amount,
      balance_after,
      remark,
      description,
    });
  };

  Rewards.getAllRewardsRecords = async ({
    user_id,
    RewardsAttributes,
    pagination = {},
    filter = {},
    sort = [],
  }) => {
    const { page, pageSize: limit } = pagination;
    const { keywordsLike, daterange, type } = filter;
    const order = getSortInfo(sort);
    const condition = {
      offset: (page - 1) * limit,
      limit,
      order,
      attributes: RewardsAttributes,
      where: { user_id },
    };

    if (type) {
      condition.where.txn_type = type;
    }

    if (keywordsLike) {
      condition.where[Op.or] = [
        { billNumber: { [Op.like]: `%%${keywordsLike}%%` } },
        { userName: { [Op.like]: `%%${keywordsLike}%%` } },
      ];
    }

    if (!_.isEmpty(daterange)) {
      const startDate = new Date(daterange[0]);
      const endDate = new Date(daterange[1]);

      if (_.isDate(startDate) && _.isDate(endDate)) {
        condition.where.createdTime = {
          [Op.gt]: startDate,
          [Op.lt]: endDate,
        };
      }
    }

    const result = await Rewards.findAll(condition);

    // 需要手动处理分页总数
    const total = await Rewards.count({
      where: condition.where,
    });

    return {
      page,
      total,
      totalPages: Math.ceil(total / limit),
      pageSize: limit,
      data: result,
    };
  };

  return Rewards;
};
