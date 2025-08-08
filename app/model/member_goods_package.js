/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-08-06 11:19:36
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-08-07 12:05:12
 * @FilePath: \Mini_program_backend\app\model\member_goods_package.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
const { at } = require("lodash");

module.exports = app => {
  const { _, Sequelize, model, checkUpdate, getSortInfo } = app;
  const { Op } = Sequelize;
  const MemberGoodsPackageSchema =
    require("../../app/schema/member_goods_package")(app);

  const MemberGoodsPackage = model.define(
    "member_goods_package",
    MemberGoodsPackageSchema,
    {
      tableName: "member_goods_package", // 对应数据库中的 'goods' 表
    }
  );

  MemberGoodsPackage.associate = function () {
    const { MemberCard, MemberGoodsPackageItem, MemberGoodsGroup } = model;
    MemberGoodsPackage.belongsTo(MemberCard, { foreignKey: "member_card_id" });
    MemberGoodsPackage.hasMany(MemberGoodsPackageItem, {
      foreignKey: "member_package_id",
      as: "packageItems",
    });
    MemberGoodsPackage.hasMany(MemberGoodsGroup, {
      foreignKey: "member_package_id",
      as: "packageGroups",
    });
  };

  /**
   * 新增商品
   * @param {object} params - 条件
   * @return {string} - 类别uuid
   */
  MemberGoodsPackage.saveNew = async params => {
    const result = await MemberGoodsPackage.create(params);
    return result;
  };

  MemberGoodsPackage.getPackageByCardId = async params => {
    const { member_card_id } = params;
    const result = await MemberGoodsPackage.findAll({
      where: { member_card_id },
      include: [
        {
          model: model.MemberGoodsPackageItem,
          as: "packageItems",
          attributes: [
            "id",
            "member_package_id",
            "goods_id",
            "goods_name",
            "goods_image",
            "goods_package_category",
            "salePrice",
            "sort_order",
            "createdTime",
          ],
        },
      ],
    });
    return result;
  };

  return MemberGoodsPackage;
};
