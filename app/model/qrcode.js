/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-01-16 20:23:03
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-03-01 14:42:40
 * @FilePath: \Mini_program_backend\app\model\qrcode.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
module.exports = app => {
  const { model } = app;
  const QrcodeSchema = require("../../app/schema/qrcode")(app);

  const Qrcode = model.define("qrcode", QrcodeSchema, {
    tableName: "qrcode",
  });

  Qrcode.associate = function () {
    const { User } = model;
    // 推荐人关联到 User
    Qrcode.belongsTo(User, {
      foreignKey: "referrer_id",
      as: "referrerInfo", // 关联推荐人
    });
  };

  Qrcode.saveNew = async ({ referrerId, promotionCodeId, qrcode }) => {
    return await Qrcode.create({
      referrer_id: referrerId,
      promotion_code: promotionCodeId,
      qrcode,
    });
  };

  Qrcode.get = async ({ referrerId }) => {
    return await Qrcode.findOne({ where: { referrer_id: referrerId } });
  };

  Qrcode.getReferrer = async ({ promotionCodeId, attributes }) => {
    return await Qrcode.findOne({
      where: { promotion_code: promotionCodeId },
      include: [
        {
          model: model.User,
          attributes,
          as: "referrerInfo",
        },
      ],
    });
  };

  return Qrcode;
};
