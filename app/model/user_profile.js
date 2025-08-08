/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-05-18 11:58:01
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-07-22 16:05:30
 * @FilePath: \Mini_program_backend\app\model\user_profile.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
module.exports = app => {
  const { Sequelize, model, checkUpdate } = app;
  const { Op } = Sequelize;
  const UserProfileSchema = require("../../app/schema/user_profile")(app);

  const UserProfile = model.define("user_profile", UserProfileSchema, {
    tableName: "user_profile", // 对应数据库中的 'goods' 表
  });

  UserProfile.associate = function () {
    const { Groups, User, Order } = model;
    UserProfile.belongsTo(User, {
      foreignKey: "user_id",
    });
  };

  UserProfile.saveNew = async params => {
    return await UserProfile.create(params);
  };

  UserProfile.saveModify = async params => {
    const { user_id } = params;
    return await UserProfile.update(params, {
      where: { user_id },
    });
  };

  return UserProfile;
};
