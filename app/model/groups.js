module.exports = app => {
  const { Sequelize, model, checkUpdate } = app;
  const { Op } = Sequelize;
  const GroupsSchema = require("../../app/schema/groups")(app);

  const Groups = model.define("groups", GroupsSchema, {
    tableName: "groups", // 对应数据库中的 'goods' 表
  });

  Groups.associate = function () {
    const { GroupBuyer, GroupItem } = model;
    Groups.hasMany(GroupBuyer, {
      foreignKey: "group_id",
      as: "groupBuyer",
    });
    Groups.hasMany(GroupItem, {
      foreignKey: "group_id",
      as: "groupItem",
    });
  };

  Groups.saveNew = async groupsData => {
    return await app.transaction(async transaction => {
      const groups = await Groups.create(groupsData, { transaction });

      // 获取创建者信息
      const crateInfo = {
        creatorId: groupsData.creatorId,
        creatorName: groupsData.creatorName,
        lastModifierId: groupsData.creatorId,
        lastModifierName: groupsData.creatorName,
      };

      const groupItem = await groupsData.groupItem.map(item => ({
        group_id: groups.group_id,
        goods_id: item.goods_id,
        spec_id: item.spec_id,
        order_id: groupsData.order_id || item.order_id,
        group_price: groupsData.min_amt || item.group_price,
        item_status: item.item_status,
        gb_time: groupsData.begin_time || item.gb_time,
        ...item,
        ...crateInfo,
      }));

      const groupBuyer = await groupsData.groupBuyer.map(item => ({
        group_id: groups.group_id,
        buyer_id: item.buyer_id,
        item_id: groupItem.item_id,
        order_id: groupsData.order_id || item.order_id,
        group_status: item.group_status,
        gb_price: item.group_price,
        gb_status: item.gb_status,
        gb_time: groupsData.begin_time || item.gb_time,
        ...item,
        ...crateInfo,
      }));

      await model.GroupItem.bulkCreate(groupItem, { transaction });
      await model.GroupBuyer.bulkCreate(groupBuyer, { transaction });

      // 创建团购后添加Redis操作
      // const endTimestamp = groups.end_time.getTime();
      // const currentTimestamp = Date.now();
      // const ttl = Math.floor((endTimestamp - currentTimestamp) / 1000);

      // await ctx.service.redis.set(
      //   `group:${groups.group_id}:current_members`,
      //   groupBuyer.length, // 使用实际创建的参团人数
      //   ttl,
      //   "group"
      // );

      return {
        groups,
        groupItem,
      };
    });
  };

  Groups.saveModify = async groupsData => {
    const { spec_id, goods_id } = groupsData;
    console.log(groupsData);

    if (!spec_id || !goods_id) {
      throw new Error("缺少必要参数: spec_id 或 goods_id");
    }

    const result = await Groups.update(groupsData, {
      where: {
        spec_id,
        goods_id,
      },
    });

    checkUpdate(result);

    return goods_id;
  };

  Groups.getGroupById = async group_id => {
    const group = await Groups.findOne({
      where: {
        group_id,
      },
      include: [
        {
          model: model.GroupBuyer,
          as: "groupBuyer",
          attributes: ["buyer_id", "order_id"],
          include: [
            {
              model: model.User,
              as: "user",
              attributes: [
                "uuid",
                "openid",
                "user_name",
                "avatar",
                "phoneNumber",
              ],
            },
          ],
        },
        {
          model: model.GroupItem,
          as: "groupItem",
        },
      ],
    });

    return group;
  };

  // Groups.getGroupByItemId = async order_id => {
  //   console.log("order_id", order_id);
  //   const group = await model.GroupItem.findOne({
  //     where: {
  //       order_id,
  //     },
  //     include: [
  //       {
  //         model: Groups,
  //         as: "group",
  //       },
  //     ],
  //   });

  //   console.log("group", group);
  //   return group;
  // };

  return Groups;
};
