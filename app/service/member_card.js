/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-03-10 18:50:11
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-03-27 17:13:07
 * @FilePath: \Mini_program_backend\app\service\member_card.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

const Service = require("egg").Service;

const fecha = require("fecha");
const fs = require("fs");
const path = require("path");

class Member_cardService extends Service {
  async saveNew(params = {}) {
    const { ctx, app } = this;
    const { user_id, userName, MemberCard, orgUuid } = params;
    const crateInfo = app.getCrateInfo(user_id, userName);

    const uploadPromises = [];

    if (MemberCard.card_images && fs.existsSync(MemberCard.card_images)) {
      const thumbnailBuffer = fs.readFileSync(MemberCard.card_images); // 读取本地文件
      const thumbnailKey = `MemberCard/${path.basename(
        MemberCard.card_images
      )}`; // 存储路径
      uploadPromises.push(
        ctx.service.cos
          .uploadFile(thumbnailBuffer, thumbnailKey, "", "")
          .then(url => {
            console.log("COS返回的URL:", url); // 添加日志
            MemberCard.card_images = url;
          })
      );
    }
    try {
      // 等待所有上传完成
      await Promise.all(uploadPromises);

      // 修改选中代码部分
      // const now = new Date();
      // const endDate = new Date(now);
      // endDate.setFullYear(now.getFullYear() + 1);

      const memberCardData = {
        ...MemberCard,
        ...crateInfo,
        user_id,
        userName,
        // start_date: fecha.format(now, "YYYY-MM-DD HH:mm:ss"),
        // end_date: fecha.format(endDate, "YYYY-MM-DD HH:mm:ss"),
        orgUuid,
      };
      return await app.model.MemberCard.saveNew(memberCardData);
    } catch (error) {
      ctx.logger.error("Error uploading images:", error);
      throw error;
    }
  }

  async getAll() {
    const { app } = this;
    return await app.model.MemberCard.getAllCards({
      attributes: [
        "uuid",
        "version",
        "card_images",
        "card_name",
        "salePrice",
        "tag",
        "card_type",
        "membership_level",
        "description",
      ],
    });
  }
}

module.exports = Member_cardService;
