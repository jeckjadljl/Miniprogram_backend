/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-05-18 11:58:01
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-07-09 21:55:47
 * @FilePath: \Mini_program_backend\app\model\posts.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
module.exports = app => {
  const { Sequelize, model, checkUpdate, getSortInfo, _ } = app;
  const { Op } = Sequelize;
  const PostsSchema = require("../../app/schema/posts")(app);

  const Posts = model.define("posts", PostsSchema, {
    tableName: "posts", // 对应数据库中的 'goods' 表
  });

  Posts.associate = function () {
    const { User } = model;
    Posts.belongsTo(User, {
      foreignKey: "user_id",
    });
  };

  Posts.saveNew = async goodsSpecData => {
    return await Posts.create(goodsSpecData);
  };

  Posts.getUserPosts = async ({
    postsAttributes,
    pagination = {},
    filter = {},
    sort = [],
    user_id,
    randomSeed = null, // 新增：接收随机种子参数
  }) => {
    const { page = 1, pageSize: limit = 10 } = pagination;
    const { keywordsLike, daterange, postType } = filter;

    // 检测是否请求随机排序
    const isRandomSort = sort.some(s => s.field === "random");

    // 生成或使用随机种子
    let seed = randomSeed;
    let returnSeed = null;

    if (isRandomSort) {
      // 仅在第一页生成新种子
      if (page === 1 && !seed) {
        // 生成基于时间戳和用户ID的唯一种子
        seed = Date.now().toString(36) + "_" + user_id;
        returnSeed = seed; // 标记需要返回给客户端
      }
    }

    const condition = {
      offset: (page - 1) * limit,
      limit,
      attributes: postsAttributes,
      where: { user_id },
    };

    // 处理排序逻辑
    if (isRandomSort && seed) {
      // 使用固定种子的随机排序
      condition.order = [
        [Sequelize.fn("RAND", Sequelize.fn("MD5", seed)), "ASC"],
      ];
    } else if (!_.isEmpty(sort)) {
      // 普通排序
      condition.order = getSortInfo(sort);
    } else {
      // 默认按创建时间倒序
      condition.order = [["createdTime", "DESC"]];
    }

    if (postType) {
      condition.where.post_type = postType;
    }

    // 日期范围过滤
    if (!_.isEmpty(daterange)) {
      const [startDate, endDate] = daterange.map(date => new Date(date));
      condition.where.createdTime = {
        [Op.between]: [startDate, endDate],
      };
    }

    // 关键词搜索
    if (keywordsLike) {
      condition.where[Op.or] = [
        { posts_title: { [Op.like]: `%${keywordsLike}%` } },
        { post_content: { [Op.like]: `%${keywordsLike}%` } },
      ];
    }

    const result = await Posts.findAll(condition);
    const total = await Posts.count({
      where: condition.where,
    });

    // 构造返回结果
    const response = {
      page,
      total,
      totalPages: Math.ceil(total / limit),
      pageSize: limit,
      data: result,
    };

    // 如果是第一页且生成了新种子，返回给客户端
    if (returnSeed) {
      response.randomSeed = returnSeed;
    }

    return response;
  };

  Posts.getWaterfullPostsList = async ({
    postsAttributes,
    pagination = {},
    filter = {},
    sort = [],
    randomSeed = null,
  }) => {
    const { page = 1, pageSize: limit = 10 } = pagination;
    const { keywordsLike, daterange, postType, userId } = filter;

    // 检测是否请求随机排序
    const isRandomSort = sort.some(s => s.field === "random");

    // 生成或使用随机种子
    let seed = randomSeed;
    let returnSeed = null;

    if (isRandomSort) {
      // 仅在第一页生成新种子
      if (page === 1 && !seed) {
        // 生成基于时间戳和用户ID的唯一种子
        seed = Date.now().toString(36) + "_" + (userId || "global");
        returnSeed = seed; // 标记需要返回给客户端
      }
    }

    // 构建基础查询条件
    const condition = {
      offset: (page - 1) * limit,
      limit,
      attributes: postsAttributes,
      where: {},
    };

    // 处理排序逻辑
    if (isRandomSort && seed) {
      // 使用固定种子的随机排序
      condition.order = [
        [Sequelize.fn("RAND", Sequelize.fn("MD5", seed)), "ASC"],
      ];
    } else if (!_.isEmpty(sort)) {
      // 普通排序
      condition.order = getSortInfo(sort);
    } else {
      // 默认按创建时间倒序
      condition.order = [["createdTime", "DESC"]];
    }

    // 按用户ID过滤
    if (userId) {
      condition.where.user_id = userId;
    }

    // 按帖子类型过滤
    if (postType) {
      condition.where.post_type = postType;
    } else {
      // 默认只获取视频类型
      condition.where.post_type = "video";
    }

    // 日期范围过滤
    if (!_.isEmpty(daterange)) {
      const [startDate, endDate] = daterange.map(date => new Date(date));
      condition.where.createdTime = {
        [Op.between]: [startDate, endDate],
      };
    }

    // 关键词搜索
    if (keywordsLike) {
      condition.where[Op.or] = [
        { posts_title: { [Op.like]: `%${keywordsLike}%` } },
        { post_content: { [Op.like]: `%${keywordsLike}%` } },
      ];
    }

    // 执行查询
    const result = await Posts.findAll(condition);

    // 获取总数用于分页
    const total = await Posts.count({
      where: condition.where,
    });

    // 转换media字段为数组
    const transformedData = result.map(post => {
      const plainPost = post.get({ plain: true });
      return {
        ...plainPost,
        // 确保media是数组格式
        media: plainPost.media
          ? Array.isArray(plainPost.media)
            ? plainPost.media
            : plainPost.media.split(",")
          : [],
      };
    });

    // 构造返回结果
    const response = {
      page,
      total,
      totalPages: Math.ceil(total / limit),
      pageSize: limit,
      data: transformedData,
    };

    // 如果是第一页且生成了新种子，返回给客户端
    if (returnSeed) {
      response.randomSeed = returnSeed;
    }

    return response;
  };

  // 在 Posts 模型中添加 getVideoFeedList 方法
  Posts.getVideoFeedList = async ({
    postsAttributes,
    pagination = {},
    filter = {},
    sort = [],
    initialPostId = null, // 新增：初始视频ID
    randomSeed = null,
  }) => {
    const { page = 1, pageSize: limit = 10 } = pagination;
    const { keywordsLike, daterange, userId } = filter;

    // 检测是否请求随机排序
    const isRandomSort = sort.some(s => s.field === "random");

    // 生成或使用随机种子
    let seed = randomSeed;
    let returnSeed = null;

    if (isRandomSort) {
      // 仅在第一页生成新种子
      if (page === 1 && !seed) {
        // 生成基于时间戳和用户ID的唯一种子
        seed = Date.now().toString(36) + "_" + (userId || "global");
        returnSeed = seed; // 标记需要返回给客户端
      }
    }

    // 构建基础查询条件
    const condition = {
      offset: (page - 1) * limit,
      limit,
      attributes: postsAttributes,
      where: {
        post_type: "video", // 只获取视频类型
      },
    };

    // 如果有初始视频ID，定位到该视频位置
    if (initialPostId && page === 1) {
      // 1. 获取初始视频的创建时间
      const initialVideo = await Posts.findOne({
        where: { uuid: initialPostId },
        attributes: ["createdTime"],
      });

      if (initialVideo) {
        // 2. 调整查询条件以初始视频为中心
        condition.where.createdTime = {
          [Op.lte]: initialVideo.createdTime, // 获取初始视频及之前的视频
        };
        condition.order = [["createdTime", "DESC"]];

        // 3. 计算偏移量使初始视频在列表中间
        const totalBefore = await Posts.count({
          where: {
            createdTime: { [Op.gt]: initialVideo.createdTime },
            post_type: "video",
          },
        });

        // 调整偏移量使初始视频出现在第一页中间位置
        const targetPosition = Math.floor(limit / 2);
        condition.offset = Math.max(0, totalBefore - targetPosition);
      }
    }

    // 处理排序逻辑
    if (isRandomSort && seed) {
      // 使用固定种子的随机排序
      condition.order = [
        [Sequelize.fn("RAND", Sequelize.fn("MD5", seed)), "ASC"],
      ];
    } else if (!_.isEmpty(sort)) {
      condition.order = getSortInfo(sort);
    } else {
      // 默认按创建时间倒序
      condition.order = [["createdTime", "DESC"]];
    }

    // 按用户ID过滤
    if (userId) {
      condition.where.user_id = userId;
    }

    // 日期范围过滤
    if (!_.isEmpty(daterange)) {
      const [startDate, endDate] = daterange.map(date => new Date(date));
      condition.where.createdTime = condition.where.createdTime || {};
      Object.assign(condition.where.createdTime, {
        [Op.between]: [startDate, endDate],
      });
    }

    // 关键词搜索
    if (keywordsLike) {
      condition.where[Op.or] = [
        { posts_title: { [Op.like]: `%${keywordsLike}%` } },
        { post_content: { [Op.like]: `%${keywordsLike}%` } },
      ];
    }

    // 执行查询
    const result = await Posts.findAll(condition);

    // 获取总数用于分页
    const total = await Posts.count({
      where: condition.where,
    });

    // 转换media字段为数组
    const transformedData = result.map(post => {
      const plainPost = post.get({ plain: true });
      return {
        ...plainPost,
        // 确保media是数组格式
        media: plainPost.media
          ? Array.isArray(plainPost.media)
            ? plainPost.media
            : plainPost.media.split(",")
          : [],
      };
    });

    // 查找初始视频在结果中的位置
    let initialIndex = -1;
    if (initialPostId && page === 1) {
      initialIndex = transformedData.findIndex(v => v.uuid === initialPostId);
    }

    // 构造返回结果
    const response = {
      page,
      total,
      totalPages: Math.ceil(total / limit),
      pageSize: limit,
      data: transformedData,
      initialIndex, // 返回初始视频在列表中的位置
    };

    if (returnSeed) {
      response.randomSeed = returnSeed;
    }

    return response;
  };

  Posts.saveModify = async (params = {}) => {
    const { posts_id, user_id, updateData } = params;

    if (!posts_id || !user_id) {
      throw new Error("缺少必要参数: posts_id 或 user_id");
    }

    const [affectedCount] = await Posts.update(updateData, {
      where: {
        uuid: posts_id,
        user_id, // 确保只能修改自己的帖子
      },
    });

    if (affectedCount === 0) {
      throw new Error("帖子不存在或没有修改权限");
    }

    return await Posts.findOne({ where: { uuid: posts_id } });
  };

  return Posts;
};
