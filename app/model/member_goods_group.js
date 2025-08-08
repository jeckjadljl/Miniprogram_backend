/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-11-04 11:34:52
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-08-06 11:23:29
 * @FilePath: \Mini_program_backend\app\model\member_goods_group.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
module.exports = app => {
  const { _, Sequelize, model, checkUpdate, getSortInfo } = app;
  const { Op } = Sequelize;
  const MemberGoodsGroupSchema = require("../../app/schema/member_goods_group")(
    app
  );

  const MemberGoodsGroup = model.define(
    "member_goods_group",
    MemberGoodsGroupSchema,
    {
      tableName: "member_goods_group", // 对应数据库中的 'goods' 表
    }
  );

  MemberGoodsGroup.associate = function () {
    const { MemberGoodsPackage } = model;
    MemberGoodsGroup.belongsTo(MemberGoodsPackage, {
      foreignKey: "member_package_id",
    });
  };

  /**
   * 新增商品
   * @param {object} params - 条件
   * @return {string} - 类别uuid
   */
  MemberGoodsGroup.saveNew = async params => {
    const result = await MemberGoodsGroup.create(params);
    return result;
  };

  MemberGoodsGroup.getAllGroupByCardId = async params => {
    const { member_card_id } = params;
    const result = await MemberGoodsGroup.findAll({
      where: { member_card_id },
      attributes: [
        "id",
        "member_card_id",
        "group_name",
        "require_type",
        "combination_rules",
        "min_total",
        "max_total",
        "createdTime",
        "creatorName",
        "creatorId",
        "lastModifiedTime",
        "lastModifierName",
        "lastModifierId",
        "version",
      ],
    });
    return result;
  };

  return MemberGoodsGroup;
};
