module.exports = app => {
  const { Sequelize, model, checkUpdate } = app;
  const { Op } = Sequelize;
  const GroupsSchema = require("../../app/schema/group_buyer")(app);

  const GroupBuyer = model.define("group_buyer", GroupsSchema, {
    tableName: "group_buyer", // 对应数据库中的 'goods' 表
  });

  GroupBuyer.associate = function () {
    const { Groups, User, Order } = model;
    GroupBuyer.belongsTo(Groups, {
      foreignKey: "group_id",
    });
    GroupBuyer.belongsTo(User, {
      foreignKey: "buyer_id",
    });
    GroupBuyer.belongsTo(Order, {
      foreignKey: "order_id",
    });
  };

  GroupBuyer.saveNew = async goodsSpecData => {
    return await GroupBuyer.create(goodsSpecData);
  };

  return GroupBuyer;
};
