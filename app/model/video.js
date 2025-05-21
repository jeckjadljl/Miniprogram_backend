/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-04-22 23:32:34
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-04-25 18:15:23
 * @FilePath: \Mini_program_backend\app\model\video.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
module.exports = app => {
  const { Sequelize, model } = app;
  const { Op } = Sequelize;
  const VideoSchema = require("../../app/schema/video")(app);

  const Video = model.define("video", VideoSchema, {
    tableName: "video",
  });

  Video.associate = function () {
    const { Elements } = model;
    Video.belongsTo(Elements, { foreignKey: "elements_id" });
  };

  Video.saveNew = async params => {
    return await Video.create(params);
  };

  Video.getVideoList = async ({
    elements_id,
    pagination = {},
    filter = {},
    excludeIds = [], // 新增：已获取的视频ID集合
    randomSeed = null, // 新增：随机种子
  }) => {
    const { page = 1, pageSize: limit = 20 } = pagination;
    const { keywordsLike, daterange, status } = filter;
    const condition = {
      offset: (page - 1) * limit,
      limit,
      order: randomSeed
        ? [
            [Sequelize.literal(`RAND(${randomSeed})`)], // 使用固定随机种子
          ]
        : [
            [Sequelize.literal("RAND()")], // 保留原有随机逻辑
          ],
      where: {
        elements_id,
        uuid: { [Op.notIn]: excludeIds }, // 排除已获取视频
      },
    };

    // 关键词搜索
    if (keywordsLike) {
      condition.where[Op.or] = [
        { billNumber: { [Op.like]: `%${keywordsLike}%` } },
        { userName: { [Op.like]: `%${keywordsLike}%` } },
      ];
    }

    const result = await Video.findAll(condition);

    // 需要手动处理分页总数
    const total = await Video.count({
      where: condition.where,
    });

    return {
      page,
      total,
      totalPages: Math.ceil(total / limit),
      pageSize: limit,
      data: result,
      randomSeed: randomSeed || Date.now(), // 返回随机种子用于下次请求
    };
  };

  Video.saveLikes = async (params = {}) => {
    const { uuid, elements_id, likes } = params;
    const video = await Video.findOne({
      where: {
        uuid,
        elements_id,
      },
    });
    if (video) {
      video.likes = likes;
      return await video.save();
    }
    return null;
  };

  return Video;
};
