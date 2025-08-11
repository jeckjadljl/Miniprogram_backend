/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-08-09 16:49:48
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-08-10 22:22:51
 * @FilePath: \Mini_program_backend\app\model\media\comment.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

module.exports = app => {
  const { model, checkUpdate, getSortInfo } = app;
  const CommentSchema = require("../../schema/media/comment")(app);
  const Comment = model.define("media/comment", CommentSchema, {
    tableName: "comment", // 对应数据库中的 'comment' 表
  });

  Comment.associate = function () {
    const { Posts, User } = model;
    Comment.belongsTo(User, { foreignKey: "user_id" });
    Comment.belongsTo(Posts, { foreignKey: "post_id", as: "post" });
  };

  Comment.getCommentsByPostId = async ({
    pagination = {},
    sort = [],
    post_id,
  }) => {
    const { page = 1, pageSize: limit = 10 } = pagination;
    const order = getSortInfo(sort);
    const condition = {
      offset: (page - 1) * limit,
      limit,
      order,
      include: [
        {
          model: app.model.User,
          as: "user",
          attributes: ["uuid", "user_name", "avatar"],
        },
      ],
      where: { post_id },
    };

    // const result = await Comment.findAll(condition);

    // // 需要手动处理分页总数
    // const total = await Comment.count({
    //   where: condition.where,
    // });

    const { count, rows } = await Comment.findAndCountAll(condition);

    return {
      page,
      total: count,
      totalPages: Math.ceil(count / limit),
      pageSize: limit,
      data: rows,
    };
  };

  return Comment;
};
