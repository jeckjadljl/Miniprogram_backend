/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-12-23 10:35:45
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-04-05 16:30:19
 * @FilePath: \Mini_program_backend\app\model\notice_for_weapp.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

module.exports = app => {
  const { Sequelize, model, getSortInfo, checkUpdate } = app;
  const { Op } = Sequelize;
  const noticeForWeappSchema = require("../schema/noticeforweapp")(app);
  const NoticeForWeapp = model.define("noticeforweapp", noticeForWeappSchema);

  NoticeForWeapp.saveNew = async noticeForWeapp => {
    return await NoticeForWeapp.create(noticeForWeapp);
  };

  NoticeForWeapp.getAll = async () => {
    return await NoticeForWeapp.findAll();
  };

  NoticeForWeapp.getNoticeOrMessage = async params => {
    const { purpose, noticeType } = params;
    return await NoticeForWeapp.findAll({
      where: { purpose, noticeType },
    });
  };

  NoticeForWeapp.getNoticeByElementsId = async params => {
    const { elements_id } = params;
    return await NoticeForWeapp.findAll({ where: { elements_id } });
  };

  return NoticeForWeapp;
};
