/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-11-24 16:34:32
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-04-09 16:37:45
 * @FilePath: \Mini_program_backend\app\model\promotion.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
module.exports = app => {
  const { model } = app;
  const PointsSchema = require("../../app/schema/promotion")(app);

  const Promotion = model.define("promotion", PointsSchema, {
    tableName: "promotion",
  });

  Promotion.saveNew = async params => {
    return await Promotion.create(params);
  };

  return Promotion;
};
