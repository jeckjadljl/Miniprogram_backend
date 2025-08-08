module.exports = app => {
  const { _, Sequelize, model, checkUpdate, getSortInfo } = app;
  const { Op } = Sequelize;
  const MemberGoodsPackageItemSchema =
    require("../../app/schema/member_goods_package_item")(app);

  const MemberGoodsPackageItem = model.define(
    "member_goods_package_item",
    MemberGoodsPackageItemSchema,
    {
      tableName: "member_goods_package_item", // 对应数据库中的 'goods' 表
    }
  );

  MemberGoodsPackageItem.associate = function () {
    const { MemberGoodsPackage, Goods } = model;
    MemberGoodsPackageItem.belongsTo(MemberGoodsPackage, {
      foreignKey: "member_package_id",
    });
    MemberGoodsPackageItem.belongsTo(Goods, {
      foreignKey: "goods_id",
    });
  };

  /**
   * 新增商品
   * @param {object} params - 条件
   * @return {string} - 类别uuid
   */
  MemberGoodsPackageItem.saveNew = async params => {
    const result = await MemberGoodsPackageItem.create(params);
    return result;
  };

  MemberGoodsPackageItem.getAllPackageByCardId = async params => {
    const { member_card_id } = params;
    const result = await MemberGoodsPackageItem.findAll({
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

  return MemberGoodsPackageItem;
};
