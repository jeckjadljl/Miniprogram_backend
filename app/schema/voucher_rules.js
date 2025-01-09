/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-11-28 15:38:06
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2024-11-30 10:44:42
 * @FilePath: \Mini_program_backend\app\schema\voucher_rules.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

module.exports = app => {
  const { STRING, UUIDV4, DECIMAL } = app.Sequelize;

  return {
    id: {
      type: STRING(38),
      primaryKey: true,
      allowNull: false,
      defaultValue: UUIDV4,
    },
    min_spend: DECIMAL(10, 2), // 最低消费金额
    deduction: DECIMAL(10, 2), // 抵扣金额
  };
};
