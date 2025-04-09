/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-11-28 12:01:09
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-03-15 15:43:35
 * @FilePath: \Mini_program_backend\app\model\vouchers.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

module.exports = app => {
  const { model } = app;
  const vouchersSchema = require("../../app/schema/vouchers")(app);

  const Vouchers = model.define("vouchers", vouchersSchema, {
    tableName: "vouchers", // 对应数据库中的 'roles' 表
  });

  Vouchers.saveNew = async params => {
    const voucher = await Vouchers.create(params);
    return voucher.id;
  };

  Vouchers.findAll = async userId => {
    const vouchers = await Vouchers.findAll({
      where: {
        user_id: userId,
      },
    });
    return vouchers;
  };

  Vouchers.get = async ({ voucherId, userId, status }) => {
    const voucher = await Vouchers.findOne({
      where: { id: voucherId, user_id: userId, status },
    });

    return voucher;
  };

  Vouchers.grantVoucher = async (userId, totalAmount) => {
    const result = await Vouchers.create({
      user_id: userId,
      total_amount: totalAmount,
      current_balance: totalAmount,
      status: "active",
      created_at: new Date(),
    });

    this.logger.info(`用户 ${userId} 获得抵用券，金额 ${totalAmount}`);
    return result;
  };

  return Vouchers;
};
