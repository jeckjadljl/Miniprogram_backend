/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-11-04 11:34:52
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2024-12-14 22:57:39
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
    timestamps: false, // 如果表中没有 createdAt 和 updatedAt 字段
  });

  Goods.associate = function () {
    const { User, OrderItem, GoodsCategory, Merchant } = app.model;
    Goods.belongsToMany(User, {
      through: "Cart",
      foreignKey: "goods_id",
      otherKey: "user_id",
    });
    Goods.hasMany(OrderItem, { foreignKey: "goods_id" });
    Goods.belongsTo(Merchant, { foreignKey: "orgUuid" });

    Goods.belongsTo(GoodsCategory, {
      foreignKey: "category_id", // 外键字段
      targetKey: "uuid", // 目标字段
      as: "category", // 关联别名
    });
  };

  /**
   * 新增商品
   * @param {object} goods - 条件
   * @return {string} - 类别uuid
   */
  Goods.saveNew = async goods => {
    const result = await Goods.create(goods);
    return result.goods_id;
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
    categoryAttributes,
    orgUuid,
    goodsAttributes,
  }) => {
    return await model.Goodscategory.findAll({
      attributes: categoryAttributes,
      where: { orgUuid },
      include: [
        {
          model: Goods,
          attributes: goodsAttributes,
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
   * @param {object} { uuid, orgUuid } - 条件
   * @return {object|null} - 查找结果
   */
  Goods.get = async ({ goods_id, orgUuid }) => {
    return await Goods.findOne({
      where: { goods_id, orgUuid },
    });
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
  Goods.getAllGoods = async () => {
    return await Goods.findAll();
  };

  return Goods;
};
