"use strict";

module.exports = app => {
  const { Sequelize, model, getSortInfo, checkUpdate, checkDelete } = app;
  const { Op } = Sequelize;
  const elementsSchema = require("../schema/elements")(app);

  const Elements = model.define("elements", elementsSchema, {
    tableName: "elements",
  });

  Elements.associate = function () {
    const { GoodsCategory, Posters } = model;
    Elements.hasMany(GoodsCategory, {
      as: "categories",
      foreignKey: "elements_id",
    });
    Elements.hasMany(Posters, { as: "posterList", foreignKey: "elements_id" });
  };

  /**
   * 新增类别
   * @param {object} elements - 条件
   * @return {string} - 类别uuid
   */
  Elements.saveNew = async elements => {
    const result = await Elements.create(elements);
    return result.uuid;
  };

  /**
   * 修改类别
   * @param {object} elements - 条件
   * @return {string} - 类别uuid
   */
  Elements.saveModify = async elements => {
    const { uuid, name, images, orgUuid, lastModifierId, lastModifierName } =
      elements;
    const result = await Elements.update(
      { name, images, lastModifierId, lastModifierName },
      { where: { uuid, orgUuid } }
    );

    checkUpdate(result);

    return uuid;
  };

  /**
   * 删除类别
   * @param {object} uuid - 条件
   * @param {object} orgUuid - 条件
   * @return {string} - 删除类别uuid
   */
  Elements.remove = async ({ uuid, orgUuid }) => {
    const result = await Elements.destroy({ where: { uuid, orgUuid } });

    checkDelete(result);

    return uuid;
  };

  /**
   * 查询健康四要素中的类别列表
   * @param {object} { orgUuid, attributes, pagination, filter } - 条件
   * @return {object|null} - 查找结果
   */
  Elements.query = async ({
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

    const { count, rows } = await Elements.findAndCountAll(condition);

    return { page, count, rows };
  };

  Elements.getByUuid = async ({ uuid, orgUuid }) => {
    return await Elements.findOne({
      where: { uuid, orgUuid },
    });
  };

  /**
   * 查询类别列表
   * @param {object} { orgUuid, attributes, filter } - 条件
   * @return {object|null} - 查找结果
   */
  Elements.getCategories = async ({ orgUuid, attributes, filter = {} }) => {
    return await Elements.findAll({
      attributes,
      where: { ...filter, orgUuid },
    });
  };

  /**
   * 根据uuid获取类别
   * @param {object} { uuid, orgUuid, attributes } - 条件
   * @return {object|null} - 查找结果
   */
  Elements.get = async ({
    uuid,
    orgUuid,
    elementsAttributes,
    categoriesAttributes,
    postersAttributes,
  }) => {
    return await Elements.findOne({
      attributes: elementsAttributes,
      include: [
        {
          model: model.GoodsCategory,
          as: "categories",
          attributes: categoriesAttributes,
          // where: { elements_id: uuid },
        },
        {
          model: model.Posters,
          as: "posterList",
          attributes: postersAttributes,
          // where: { elements_id: uuid },
        },
      ],
      where: { uuid, orgUuid },
    });
  };

  Elements.getAll = async ({ attributes }) => {
    return await Elements.findAll({ attributes });
  };

  return Elements;
};
