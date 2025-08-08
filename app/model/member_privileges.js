/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-03-10 16:57:49
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-07-15 22:01:22
 * @FilePath: \Mini_program_backend\app\model\member_privileges.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
module.exports = app => {
  const { Sequelize, model, checkUpdate } = app;
  const { Op } = Sequelize;
  const MemberPrivilegesSchema = require("../../app/schema/member_privileges")(
    app
  );

  const MemberPrivileges = model.define(
    "member_privileges",
    MemberPrivilegesSchema,
    {
      tableName: "member_privileges",
    }
  );

  MemberPrivileges.saveNew = async memberPrivilegesData => {
    const result = await MemberPrivileges.create(memberPrivilegesData);
    return result.uuid;
  };

  MemberPrivileges.saveModify = async memberPrivilegesData => {
    const result = await MemberPrivileges.update(memberPrivilegesData, {
      where: {
        uuid: memberPrivilegesData.uuid,
      },
    });
    return result;
  };

  MemberPrivileges.getAllPrivileges = async ({ attributes }) => {
    return await MemberPrivileges.findAll({
      attributes,
      order: [["sort_order", "ASC"]],
    });
  };

  return MemberPrivileges;
};
