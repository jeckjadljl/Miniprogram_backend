"use strict";

module.exports = app => {
  const { Sequelize, model, getSortInfo, checkUpdate, checkDelete } = app;
  const { Op } = Sequelize;
  const goodsCategorySchema = require("../schema/goods_category.js")(app);

  const GoodsCategory = model.define("goodscategory", goodsCategorySchema, {
    tableName: "goods_category",
  });

  GoodsCategory.associate = function () {
    const { Goods, Merchant } = model;
    GoodsCategory.hasMany(Goods, { foreignKey: "category_id" });
    GoodsCategory.belongsTo(Merchant, { foreignKey: "orgUuid" });
  };

  /**
   * 新增类别
   * @param {object} goodsCategory - 条件
   * @return {string} - 类别uuid
   */
  GoodsCategory.saveNew = async goodsCategory => {
    const result = await GoodsCategory.create(goodsCategory);
    return result.uuid;
  };

  /**
   * 修改类别
   * @param {object} goodsCategory - 条件
   * @return {string} - 类别uuid
   */
  GoodsCategory.saveModify = async goodsCategory => {
    const { uuid, name, orgUuid, lastModifierId, lastModifierName } =
      goodsCategory;
    const result = await GoodsCategory.update(
      { name, lastModifierId, lastModifierName },
      { where: { uuid, orgUuid } }
    );

    checkUpdate(result);

    return uuid;
  };

  /**
   * 删除类别
   * @param {object} { uuid, orgUuid } - 条件
   * @return {string} - 删除类别uuid
   */
  GoodsCategory.remove = async ({ uuid, orgUuid }) => {
    const result = await GoodsCategory.destroy({ where: { uuid, orgUuid } });

    checkDelete(result);

    return uuid;
  };

  /**
   * 查询类别分页列表
   * @param {object} { orgUuid, attributes, pagination, filter } - 条件
   * @return {object|null} - 查找结果
   */
  GoodsCategory.query = async ({
    orgUuid,
    attributes,
    pagination = {},
    filter = {},
    sort = [],
  }) => {
    const { page, pageSize: limit } = pagination;
    const { keywordsLike } = filter;
    const order = getSortInfo(sort);
    const condition = {
      offset: (page - 1) * limit,
      limit,
      order,
      attributes,
      where: { orgUuid },
    };

    if (keywordsLike) {
      condition.where.name = { [Op.like]: `%%${keywordsLike}%%` };
    }

    const { count, rows } = await GoodsCategory.findAndCountAll(condition);

    return { page, count, rows };
  };

  /**
   * 查询类别列表
   * @param {object} { orgUuid, attributes, filter } - 条件
   * @return {object|null} - 查找结果
   */
  GoodsCategory.getList = async ({ orgUuid, attributes, filter = {} }) => {
    return await GoodsCategory.findAll({
      attributes,
      where: { ...filter, orgUuid },
    });
  };

  /**
   * 根据uuid获取类别
   * @param {object} { uuid, orgUuid, attributes } - 条件
   * @return {object|null} - 查找结果
   */
  GoodsCategory.get = async ({ uuid, orgUuid, attributes }) => {
    return await GoodsCategory.findOne({
      attributes,
      where: { uuid, orgUuid },
    });
  };

  return GoodsCategory;
};
