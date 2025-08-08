/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-07-17 16:29:55
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-07-18 15:19:01
 * @FilePath: \Mini_program_backend\app\model\wallet_transaction.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

module.exports = app => {
  const { _, Sequelize, model, getSortInfo } = app;
  const { Op } = Sequelize;
  const walletTransactionSchema =
    require("../../app/schema/wallet_transaction")(app);

  const WalletTransaction = model.define(
    "wallet_transaction",
    walletTransactionSchema,
    {
      tableName: "wallet_transaction", // 对应数据库中的 'user_roles' 表
    }
  );

  WalletTransaction.associate = function () {
    const { User, Order } = model;
    WalletTransaction.belongsTo(User, {
      foreignKey: "user_id", // 外键字段
    });
    WalletTransaction.belongsTo(Order, {
      foreignKey: "order_id", // 外键字段
    });
  };

  WalletTransaction.saveNew = async (params = {}) => {
    const { order_id, user_id, points, type, description } = params;
    const walletTransaction = await WalletTransaction.create({
      order_id,
      user_id,
      points,
      type,
      description,
    });
    return walletTransaction;
  };

  WalletTransaction.getAllWalletRecords = async ({
    user_id,
    walletAttributes,
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
      attributes: walletAttributes,
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

    const result = await WalletTransaction.findAll(condition);

    // 需要手动处理分页总数
    const total = await WalletTransaction.count({
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

  return WalletTransaction;
};
