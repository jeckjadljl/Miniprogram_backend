/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-05-18 11:59:42
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-06-23 11:00:29
 * @FilePath: \Mini_program_backend\app\model\group_item.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
module.exports = app => {
  const { Sequelize, model, checkUpdate } = app;
  const { Op } = Sequelize;
  const GroupItemSchema = require("../../app/schema/group_item")(app);

  const GroupItem = model.define("group_item", GroupItemSchema, {
    tableName: "group_item", // 对应数据库中的 'goods' 表
  });

  GroupItem.associate = function () {
    const { Goods, Groups } = model;
    GroupItem.belongsTo(Goods, {
      foreignKey: "goods_id",
      as: "goods",
    });
    GroupItem.belongsTo(Groups, {
      foreignKey: "group_id",
      targetKey: "group_id", // 新增明确指定关联字段
      as: "group", // 添加别名保持与查询一致
    });
  };

  GroupItem.saveNew = async goodsSpecData => {
    return await GroupItem.create(goodsSpecData);
  };

  GroupItem.getGroupByItemId = async order_id => {
    const group = await GroupItem.findOne({
      where: {
        order_id,
      },
      include: [
        {
          model: model.Groups,
          as: "group",
        },
      ],
    });

    return group;
  };

  return GroupItem;
};
