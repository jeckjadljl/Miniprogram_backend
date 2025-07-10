/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-07-05 10:30:42
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-07-05 11:25:59
 * @FilePath: \Mini_program_backend\app\model\interactions.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
module.exports = app => {
  const { Sequelize, model, checkUpdate } = app;
  const { Op } = Sequelize;
  const InteractionsSchema = require("../../app/schema/interactions")(app);

  const Interactions = model.define("interactions", InteractionsSchema, {
    tableName: "interactions", // 对应数据库中的 'goods' 表
  });

  Interactions.associate = function () {
    const { Posts, User, UserProfile } = model;
    Interactions.belongsTo(User, {
      foreignKey: "reply_user_id",
    });
    Interactions.belongsTo(Posts, {
      foreignKey: "post_id",
    });
    Interactions.belongsTo(UserProfile, {
      foreignKey: "user_profile_id",
    });
  };

  Interactions.saveNew = async goodsSpecData => {
    return await Interactions.create(goodsSpecData);
  };

  return Interactions;
};
