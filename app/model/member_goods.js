/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-11-04 11:34:52
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-04-08 23:27:05
 * @FilePath: \Mini_program_backend\app\model\member_goods.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
module.exports = app => {
  const { _, Sequelize, model, checkUpdate, getSortInfo } = app;
  const { Op } = Sequelize;
  const MemberGoodsSchema = require("../../app/schema/member_goods")(app);

  const MemberGoods = model.define("member_goods", MemberGoodsSchema, {
    tableName: "member_goods", // 对应数据库中的 'goods' 表
  });

  MemberGoods.associate = function () {
    const { OrderItem, Permissions, MemberPrivileges } = model;
    MemberGoods.hasMany(OrderItem, { foreignKey: "member_goods_id" });
    MemberGoods.belongsToMany(Permissions, {
      through: MemberPrivileges,
      foreignKey: "member_goods_id",
      otherKey: "permissions_id",
      as: "privileges",
    });
  };

  /**
   * 新增商品
   * @param {object} goods - 条件
   * @return {string} - 类别uuid
   */
  MemberGoods.saveNew = async goods => {
    const result = await MemberGoods.create(goods);
    return result.id;
  };

  /**
   * 修改商品
   * @param {object} goods - 条件
   * @return {string} - 商品uuid
   */
  MemberGoods.saveModify = async goods => {
    const { goods_id } = goods;
    const result = await MemberGoods.update(goods, { where: { goods_id } });

    checkUpdate(result);

    return goods_id;
  };

  MemberGoods.getGoodsByCardId = async params => {
    const { member_card_id } = params;
    return await MemberGoods.findAll({ where: { member_card_id } });
  };

  // 获取所有商品列表
  MemberGoods.getAllGoods = async ({ attributes }) => {
    return await MemberGoods.findAll({ attributes });
  };

  MemberGoods.getMemberGoodsList = async ({
    memberGoodsAttributes,
    pagination = {},
    filter = {},
    sort = [],
  }) => {
    const { page = 1, pageSize: limit = 10 } = pagination;
    const { keywordsLike, daterange, status } = filter;
    const order = getSortInfo(sort);
    const condition = {
      offset: (page - 1) * limit,
      limit,
      order,
      attributes: memberGoodsAttributes,
      where: {}, // 初始化where对象
    };

    if (status) {
      condition.where.deduction_type = status;
    }

    // 日期范围过滤
    if (!_.isEmpty(daterange)) {
      const [startDate, endDate] = daterange.map(date => new Date(date));
      condition.where.createdTime = {
        [Op.between]: [startDate, endDate],
      };
    }

    // 关键词搜索
    if (keywordsLike) {
      condition.where[Op.or] = [
        { member_packs_name: { [Op.like]: `%${keywordsLike}%` } },
        { name: { [Op.like]: `%${keywordsLike}%` } },
        { voucher_name: { [Op.like]: `%${keywordsLike}%` } },
      ];
    }

    const result = await MemberGoods.findAll(condition);

    // 需要手动处理分页总数
    const total = await MemberGoods.count({
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

  return MemberGoods;
};
