/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-03-11 16:06:35
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-07-16 11:27:32
 * @FilePath: \Mini_program_backend\app\service\member_privileges.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

const Service = require("egg").Service;
const UpLoadImage = require("../utils/uploadImage");

class Member_privilegesService extends Service {
  async saveNew(params = {}) {
    const { app, ctx } = this;
    const { privileges } = params;

    const image = new UpLoadImage(ctx);
    const upload = await image.uploadImage({
      image: privileges.privilege_images,
      BucketType: "carousel",
    });
    const privilegesData = {
      ...privileges,
      privilege_images: upload,
    };

    const result = await app.model.MemberPrivileges.saveNew(privilegesData);
    return result;
  }

  async saveModify(params = {}) {
    const { app, ctx } = this;
    const { privileges } = params;

    const image = new UpLoadImage(ctx);
    const upload = await image.uploadImage({
      image: privileges.privilege_images,
      BucketType: "carousel",
    });

    const privilegesData = {
      ...privileges,
      privilege_images: upload,
    };

    const result = await app.model.MemberPrivileges.saveModify(privilegesData);
    return result;
  }

  async getAll() {
    const { app } = this;
    const result = await app.model.MemberPrivileges.getAllPrivileges({
      attributes: [
        "uuid",
        "member_card_id",
        "permissions_id",
        "card_type",
        "privilege_images",
        "privilege_name",
        "privilege_desc",
        "privilege_type",
        "sort_order",
      ],
    });
    return result;
  }
}

module.exports = Member_privilegesService;
