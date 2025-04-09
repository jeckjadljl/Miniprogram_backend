/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-03-10 21:14:15
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-03-27 17:54:02
 * @FilePath: \Mini_program_backend\app\model\member_card_record.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
module.exports = app => {
  const { Sequelize, model } = app;
  const { Op } = Sequelize;
  const MemberCardRecordSchema = require("../../app/schema/member_card_record")(
    app
  );

  const MemberCardRecord = model.define(
    "member_card_record",
    MemberCardRecordSchema,
    {
      tableName: "member_card_record", // 对应数据库中的 'goods' 表
    }
  );

  /**
   * 新增商品
   * @param {object} cardData - 条件
   * @return {string} - 类别uuid
   */
  MemberCardRecord.saveNew = async cardData => {
    const result = await MemberCardRecord.create(cardData);
    return result;
  };

  MemberCardRecord.getAll = async user_id => {
    const result = await MemberCardRecord.findAll({
      where: { user_id },
    });
    return result;
  };

  return MemberCardRecord;
};
