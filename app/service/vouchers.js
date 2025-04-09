/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-11-28 16:07:28
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-03-15 10:04:42
 * @FilePath: \Mini_program_backend\app\service\vouchers.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

const Service = require("egg").Service;
const fecha = require("fecha");
const fs = require("fs");
const path = require("path");

class VouchersService extends Service {
  async saveNew(params = {}) {
    const { Vouchers } = this.ctx.model;

    // 修改选中代码部分
    const now = new Date();
    const endDate = new Date(now);
    endDate.setFullYear(now.getFullYear() + 1);

    const vouchersData = {
      ...params,
      start_date: fecha.format(now, "YYYY-MM-DD HH:mm:ss"),
      end_date: fecha.format(endDate, "YYYY-MM-DD HH:mm:ss"),
    };
    const voucher = await Vouchers.saveNew(vouchersData);
    return voucher;
  }

  async useVoucher(userId, voucherId, orderAmount) {
    const { Vouchers, VoucherRule } = this.ctx.model;
    // 查询用户的抵用券
    const voucher = await Vouchers.get({ voucherId, userId, status: "active" });

    if (!voucher) {
      this.ctx.throw(404, "抵用券不可用");
    }

    // 获取订单可抵扣金额
    const deduction = await VoucherRule.getDeduction(orderAmount);

    if (deduction === 0) {
      this.ctx.throw(400, "订单金额未达到抵扣条件");
    }

    // 检查余额是否足够
    const appliedDeduction = Math.min(deduction, voucher.current_balance);

    // 更新抵用券余额
    voucher.current_balance -= appliedDeduction;
    if (voucher.current_balance <= 0) {
      voucher.status = "used_up";
    }
    await voucher.save();

    return { appliedDeduction, remainingBalance: voucher.current_balance };
  }

  async grantVoucher(userId, totalAmount) {
    const { Vouchers } = this.ctx.model;
    const result = await Vouchers.grantVoucher({
      userId,
      totalAmount,
    });

    return result;
  }
}

module.exports = VouchersService;
