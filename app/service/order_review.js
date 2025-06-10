/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-06-04 11:13:16
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-06-10 00:47:18
 * @FilePath: \Mini_program_backend\app\service\order_review.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

const Service = require("egg").Service;

const UpLoadImage = require("../utils/uploadImage");

class Order_reviewService extends Service {
  async saveNew(params = {}) {
    const { reviews, user_id, userName } = params;
    const { ctx, app } = this;
    const crateInfo = app.getCrateInfo(user_id, userName);

    const image = new UpLoadImage(ctx);
    const upload = await image.uploadImage({
      image: reviews.imagesUrl,
      BucketType: "carousel",
    });

    console.log("上传的图片:", upload);
    const reviewData = {
      ...reviews,
      imagesUrl: upload,
      user_id,
      userName,
      ...crateInfo,
    };
    const result = await ctx.model.OrderReview.saveNew(reviewData);
    if (result) {
      await ctx.service.order.complete({
        uuid: reviews.order_id,
        user_id,
        userName,
      });
      await ctx.service.bullmq.addDelayJob(
        "taskQueue",
        "distributeReward",
        {
          uuid: reviews.order_id,
          goods_id: reviews.goods_id, // 传递已评价的商品项ID
          reviewData: {
            // 新增评价参数
            imageCount: reviews.imagesUrl?.length || 0,
            rating: reviews.rating,
            reviewText: reviews.review,
          },
        },
        3 * 60
      );

      // // ▼▼▼ 新增奖励计算逻辑 ▼▼▼
      // // 获取商品信息
      // const goods = await app.model.Goods.findOne({
      //   goods_id: reviews.goods_id,
      // });

      // if (!goods) {
      //   ctx.logger.error(`评价奖励计算失败，未找到商品：${reviews.goods_id}`);
      //   throw new Error("商品信息不存在");
      // }

      // // 计算有效字数（去除标点符号和空格）
      // const cleanReview = reviews.review.replace(
      //   /[^\u4e00-\u9fa5a-zA-Z0-9]/g,
      //   ""
      // );
      // const wordCount = cleanReview.length;

      // // 进阶奖励（示例：5星+2图+20字）
      // let extraReward = 0;
      // if (
      //   reviews.imagesUrl?.length >= 2 &&
      //   reviews.rating === 5 &&
      //   wordCount >= 20
      // ) {
      //   extraReward = goods.salePrice * 0.05;
      // }

      // // 基础奖励判断
      // let baseReward = 0;
      // if (
      //   reviews.imagesUrl?.length >= 1 &&
      //   reviews.rating >= 4 &&
      //   wordCount >= 10
      // ) {
      //   baseReward = goods.salePrice * 0.03;
      // }

      // // 合并奖励并四舍五入
      // const totalReward = Math.round(baseReward + extraReward);

      // // 发放健康币奖励
      // if (totalReward > 0) {
      //   await ctx.service.points.saveNew({
      //     user_id,
      //     points: totalReward,
      //     source: "review_reward",
      //     description: `订单 ${reviews.order_id} 评价奖励`,
      //   });
      //   ctx.logger.info(`用户${user_id}获得评价奖励健康币${totalReward}`, {
      //     baseReward,
      //     extraReward,
      //     finalReward: totalReward,
      //   });
      // }
      // // ▲▲▲ 新增逻辑结束 ▲▲▲
    }
    this.ctx.logger.info("已设置延时发放奖励:", result);
    return result;
  }

  async saveLikes(params = {}) {
    const { ctx } = this;
    const result = await ctx.model.OrderReview.saveLikes(params);
    return result;
  }
}

module.exports = Order_reviewService;
