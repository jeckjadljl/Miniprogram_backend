/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-03-13 22:13:46
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-03-15 10:01:03
 * @FilePath: \Mini_program_backend\app\service\voucher_rules.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

const Service = require("egg").Service;
const fecha = require("fecha");
const fs = require("fs");
const path = require("path");

class Voucher_rulesService extends Service {
  async saveNew(params = {}) {
    const { app, ctx } = this;
    let { voucher_image } = params;
    const uploadPromises = [];

    if (voucher_image && fs.existsSync(voucher_image)) {
      const thumbnailBuffer = fs.readFileSync(voucher_image); // 读取本地文件
      const thumbnailKey = `Vouchers/${path.basename(voucher_image)}`; // 存储路径
      uploadPromises.push(
        ctx.service.cos
          .uploadFile(thumbnailBuffer, thumbnailKey, "", "")
          .then(url => {
            console.log("COS返回的URL:", url); // 添加日志
            voucher_image = url;
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

      const voucherRulesData = {
        ...params,
        voucher_image, // 使用更新后的值
        // start_date: fecha.format(now, "YYYY-MM-DD HH:mm:ss"),
        // end_date: fecha.format(endDate, "YYYY-MM-DD HH:mm:ss"),
      };

      return await app.model.VoucherRules.saveNew(voucherRulesData);
    } catch (error) {
      ctx.logger.error("Error uploading images:", error);
      throw error;
    }
  }
}

module.exports = Voucher_rulesService;
