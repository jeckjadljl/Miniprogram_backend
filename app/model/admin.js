/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-03-01 22:21:17
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-03-01 22:23:46
 * @FilePath: \Mini_program_backend\app\model\admin.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

module.exports = app => {
  const { model, checkUpdate } = app;
  const adminSchema = require("../schema/admin")(app);
  const Admin = model.define("admin", adminSchema);

  /**
   * 查找管理员
   * @param {object} { uuid, attributes } - 条件
   * @return {object|null} - 查找结果
   */
  Admin.get = async ({ uuid, attributes }) => {
    return await Admin.findOne({
      attributes,
      where: { uuid },
    });
  };

  /**
   * 修改商家密码
   * @param {object} params - 条件
   * @return {string} - 商家uuid
   */
  Admin.savePasswordModify = async params => {
    const { uuid, oldPassword, password, lastModifierId, lastModifierName } =
      params;
    const result = await Admin.update(
      { password, lastModifierId, lastModifierName },
      {
        where: {
          uuid,
          password: oldPassword,
        },
      }
    );

    checkUpdate(result, "旧密码不正确");

    return uuid;
  };

  return Admin;
};
