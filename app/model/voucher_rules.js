/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-11-28 15:40:15
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2024-12-31 12:21:16
 * @FilePath: \Mini_program_backend\app\model\voucher_rules.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

module.exports = app => {
  const { model } = app;
  const VoucherRulesSchema = require("../../app/schema/voucher_rules")(app);

  const VoucherRules = model.define("voucher_rules", VoucherRulesSchema, {
    tableName: "voucher_rules", // 对应数据库中的 'roles' 表
    timestamps: false, // 如果表中没有 createdAt 和 updatedAt 字段
  });

  VoucherRules.addRules = async ({ min_spend, deduction }) => {
    const rules = await VoucherRules.create({
      min_spend,
      deduction,
    });

    return rules;
  };

  VoucherRules.getDeduction = async orderAmount => {
    const rules = await VoucherRules.findAll({
      where: {
        min_spend: { [app.Sequelize.Op.lte]: orderAmount }, // 查找小于等于订单金额的规则
      },
      order: [["min_spend", "DESC"]], // 按最低消费金额降序排列
    });

    return rules.length > 0 ? rules[0].deduction : 0; // 返回最大可抵扣金额
  };

  return VoucherRules;
};
