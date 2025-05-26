/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-11-04 11:34:52
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-05-26 20:23:38
 * @FilePath: \Mini_program_backend\app\model\goods.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
module.exports = app => {
  const { Sequelize, model, checkUpdate, getSortInfo } = app;
  const { Op } = Sequelize;
  const GoodsSchema = require("../../app/schema/goods")(app);

  const Goods = model.define("goods", GoodsSchema, {
    tableName: "goods", // 对应数据库中的 'goods' 表
  });

  Goods.associate = function () {
    const {
      User,
      OrderItem,
      GoodsCategory,
      Merchant,
      MemberCard,
      MemberGoods,
      Posters,
      GoodsSpecifications,
      GoodsSales,
      GoodsSpecColor,
      GoodsPricing,
    } = app.model;
    Goods.belongsToMany(User, {
      through: "Cart",
      foreignKey: "goods_id",
      otherKey: "user_id",
    });
    Goods.hasMany(OrderItem, { foreignKey: "goods_id" });
    Goods.belongsTo(Merchant, { foreignKey: "orgUuid" });
    Goods.hasMany(Posters, { foreignKey: "goods_id" });
    Goods.hasMany(GoodsSpecifications, { foreignKey: "goods_id", as: "spec" });

    Goods.belongsTo(GoodsCategory, {
      foreignKey: "category_id", // 外键字段
      targetKey: "uuid", // 目标字段
      as: "category", // 关联别名
    });
    Goods.belongsToMany(MemberCard, {
      through: MemberGoods,
      foreignKey: "goods_id",
      otherKey: "member_card_id",
    });
    Goods.hasOne(MemberGoods, {
      foreignKey: "goods_id", // 这里应是 member_goods 表指向 goods 表的外键
      as: "membergoods",
    });
    Goods.belongsTo(GoodsSales, { foreignKey: "goods_id", as: "sales" });
    Goods.hasMany(GoodsSpecColor, { foreignKey: "goods_id", as: "specColor" });
    Goods.hasMany(GoodsPricing, {
      foreignKey: "goods_id",
      as: "quantityPricing",
    });
  };

  /**
   * 新增商品
   * @param {object} goods - 条件
   * @return {string} - 类别uuid
   */
  Goods.saveNew = async goods => {
    return await app.transaction(async transaction => {
      const result = await Goods.create(goods, { transaction });

      if (goods.spec && Array.isArray(goods.spec)) {
        const goodsSpec = goods.spec.map(item => ({
          goods_id: result.goods_id,
          specName: item.specName,
          specValue: item.specValue,
          specPrice: item.specPrice,
          stock: item.stock || null,
          specThumbnail: item.specThumbnail || null,
          specImages: item.specImages || null,
          specPosters: item.specPosters || null,
          isDefault: item.isDefault,
          sort_order: item.sort_order,
        }));

        await model.GoodsSpecifications.bulkCreate(goodsSpec, { transaction });
      }

      return result.goods_id;
    });
  };

  /**
   * 修改商品
   * @param {object} goods - 条件
   * @return {string} - 商品uuid
   */
  Goods.saveModify = async goods => {
    const { goods_id } = goods;
    const result = await Goods.update(goods, { where: { goods_id } });

    checkUpdate(result);

    return goods_id;
  };

  /**
   * 查询key为类别的商品数据
   * @param {object} { categoryAttributes, orgUuid, goodsAttributes } - 条件
   * @return {object|null} - 查找结果
   */
  Goods.getGoodsWithCategory = async ({
    uuid,
    categoryAttributes,
    goodsAttributes,
  }) => {
    return await model.GoodsCategory.findAll({
      attributes: categoryAttributes,
      where: { uuid },
      include: [
        {
          model: Goods,
          attributes: goodsAttributes,
          where: { status: "up" },
        },
      ],
    });
  };

  /**
   * 查询某类别的商品数量
   * @param {string} categoryUuid - 类别uuid
   * @return {number|null} - 商品数量
   */
  Goods.countGoodsByCategory = async category_id => {
    return await Goods.count({
      where: { category_id },
    });
  };

  /**
   * 查询商品分页列表
   * @param {object} { orgUuid, attributes, pagination, filter } - 条件
   * @return {object|null} - 查找结果
   */
  Goods.query = async ({
    orgUuid,
    attributes,
    pagination = {},
    filter = {},
    sort = [],
  }) => {
    const { page, pageSize: limit } = pagination;
    const { keywordsLike, categoryUuid, status } = filter;
    const order = getSortInfo(sort);
    const condition = {
      offset: (page - 1) * limit,
      limit,
      order,
      attributes,
      where: { orgUuid },
    };

    if (categoryUuid) {
      condition.where.categoryUuid = categoryUuid;
    }

    if (status) {
      condition.where.status = status;
    }

    if (keywordsLike) {
      condition.where.name = { [Op.like]: `%%${keywordsLike}%%` };
    }

    const { count, rows } = await Goods.findAndCountAll(condition);

    return { page, count, rows };
  };

  /**
   * 查询商品
   * @param {object} params - 条件
   * @return {object|null} - 查找结果
   */
  Goods.get = async params => {
    const { goods_id, orgUuid } = params;
    const images = await model.Posters.findAll({
      where: { goods_id, orgUuid },
    });
    const goodsInfo = await Goods.findOne({
      where: { goods_id, orgUuid, status: "up" },
      include: [
        {
          model: model.GoodsSpecifications,
          attributes: [
            "spec_id",
            "goods_id",
            "member_goods_id",
            "specName",
            "specValue",
            "specPrice",
            "sort_order", // 新增排序字段到返回结果
            "stock",
            "specThumbnail",
            "point_spend",
            "cash_amount",
            "specImages",
            "specPosters",
            "isDefault",
          ],
          as: "spec",
        },
        {
          model: model.GoodsSpecColor,
          attributes: [
            "uuid",
            "goods_id",
            "spec_id",
            "member_goods_id",
            "specName",
            "specValue",
            "specPrice",
            "specColorThumbnail",
            "specColorImages",
            "sort_order", // 新增排序字段到返回结果
          ],
          as: "specColor",
        },
      ],
      order: [
        [{ model: model.GoodsSpecifications, as: "spec" }, "sort_order", "ASC"],
        [{ model: model.GoodsSpecColor, as: "specColor" }, "sort_order", "ASC"],
      ],
      logging: console.log, // 启用日志记录
    });

    if (!goodsInfo) {
      throw new Error("查询不到指定的商品");
    }

    return {
      goodsInfo,
      images,
    };
  };

  // 删除商品
  Goods.removeGoods = async goodsId => {
    const result = await Goods.destroy({
      where: { goodsId },
    });
    if (result === 0) {
      throw new Error("Delete failed, item not found");
    }
    return result;
  };

  // 获取所有商品列表
  Goods.getAllGoods = async ({
    attributes,
    pagination = {},
    filter = {},
    sort = [],
    excludeMemberIds = [],
    excludeIds = [], // 新增：已获取的视频ID集合
  }) => {
    const { page = 1, pageSize: limit = 20 } = pagination;
    const { keywordsLike } = filter;

    // 先查询满足条件的总数
    const baseCondition = {
      where: {
        goods_id: { [Op.notIn]: excludeIds, [Op.notIn]: excludeMemberIds },
        status: "up",
      },
    };

    // 关键词搜索
    if (keywordsLike) {
      baseCondition.where[Op.or] = [
        { billNumber: { [Op.like]: `%${keywordsLike}%` } },
        { userName: { [Op.like]: `%${keywordsLike}%` } },
      ];
    }

    // 需要手动处理分页总数
    const total = await Goods.count(baseCondition);

    const result = await Goods.findAll({
      ...baseCondition,
      limit,
      offset: (page - 1) * limit,
      attributes,
      order: [Sequelize.literal("RAND()")], // 保留原有随机逻辑
    });

    return {
      page,
      total,
      totalPages: Math.ceil(total / limit),
      pageSize: limit,
      data: result,
    };
  };

  return Goods;
};
