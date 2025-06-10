/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-11-04 11:34:52
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-06-10 11:07:34
 * @FilePath: \Mini_program_backend\app\model\member_card.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
module.exports = app => {
  const { Sequelize, model, checkUpdate } = app;
  const { Op } = Sequelize;
  const MemberCardSchema = require("../../app/schema/member_card")(app);

  const MemberCard = model.define("member_card", MemberCardSchema, {
    tableName: "member_card", // 对应数据库中的 'goods' 表
  });

  MemberCard.associate = function () {
    const {
      User,
      Permissions,
      MemberPrivileges,
      MemberCardRecord,
      Goods,
      MemberGoods,
    } = model;
    MemberCard.belongsToMany(User, {
      through: MemberCardRecord,
      foreignKey: "member_card_id",
      otherKey: "user_id",
    });
    MemberCard.belongsToMany(Permissions, {
      through: MemberPrivileges,
      foreignKey: "member_card_id",
      otherKey: "permissions_id",
    });
    MemberCard.belongsToMany(Goods, {
      through: MemberGoods,
      foreignKey: "member_card_id",
      otherKey: "goods_id",
    });
  };

  /**
   * 新增商品
   * @param {object} goods - 条件
   * @return {string} - 类别uuid
   */
  MemberCard.saveNew = async cardData => {
    const result = await MemberCard.create(cardData);
    return result;
  };

  /**
   * 修改商品
   * @param {object} goods - 条件
   * @return {string} - 商品uuid
   */
  MemberCard.saveModify = async goods => {
    const { goods_id } = goods;
    const result = await MemberCard.update(goods, { where: { goods_id } });

    checkUpdate(result);

    return goods_id;
  };

  // 获取所有商品列表
  MemberCard.getAllCards = async ({ attributes }) => {
    return await MemberCard.findAll({
      attributes,
      order: [["salePrice", "ASC"]], // 添加排序条件
    });
  };

  return MemberCard;
};
