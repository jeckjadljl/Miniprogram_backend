/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-05-18 23:14:34
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-05-19 12:23:33
 * @FilePath: \Mini_program_backend\app\service\group_buyer.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

const Service = require("egg").Service;

class Group_buyerService extends Service {
  async joinGroup(params = {}) {
    const { app, ctx } = this;
    const { group_id, buyer_id } = params;

    return await app.transaction(async transaction => {
      // 检查是否已参团
      const exists = await app.model.GroupBuyer.findOne({
        where: {
          group_id,
          buyer_id,
        },
        transaction,
      });
      if (exists) {
        throw ctx.helper.createError({
          code: 1002,
          message: "您已参加过该团购",
        });
      }

      // 创建参团记录
      const buyer = await app.model.GroupBuyer.create(params, { transaction });

      // 获取团购信息（包含目标人数）
      const group = await app.model.Groups.findByPk(group_id, {
        attributes: ["group_status"],
        transaction,
      });

      // Redis Lua脚本原子操作
      const luaScript = `
        local key = KEYS[1]
        local target = tonumber(ARGV[1])
        local current = redis.call('GET', key) or 0
        current = tonumber(current)
        
        if current + 1 >= target then
          redis.call('SET', key..'_status', '2')  -- 2表示已团成
          return {current + 1, 1}
        else
          return {current + 1, 0}
        end
      `;

      // 执行原子操作
      const [newCount, isSuccess] = await ctx.service.redis
        .getClient("group")
        .eval(
          luaScript,
          1,
          `group:${group_id}:current_members`,
          group.group_status
        );

      // 更新团状态（如果成团）
      if (isSuccess === 1 && group.group_status !== "2") {
        await app.model.Groups.update(
          {
            group_status: "2",
            current_members: newCount,
          },
          {
            where: { group_id },
            transaction,
          }
        );
      }

      return {
        ...buyer.toJSON(),
        current_members: newCount,
        group_status: isSuccess === 1 ? "2" : group.group_status,
      };
    });
  }
}

module.exports = Group_buyerService;
