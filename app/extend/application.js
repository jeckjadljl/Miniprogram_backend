/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-11-17 16:56:36
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-02-27 23:01:41
 * @FilePath: \Mini_program_backend\app\extend\application.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
"use strict";
const _ = require("lodash");
const fecha = require("fecha");

const handlers = {}; // 任务处理器map
const events = {}; // 任务类型map
const tasks = {}; // 任务列表
const delayEventKeyPrefix = "delay_event_"; // 定时任务key前缀

module.exports = {
  _,
  dayFormat: "%Y-%m-%d",
  dayTimeFormat: "%Y-%m-%d %H:%i:%s",

  getEastEightTime() {
    // 获取当前 UTC 时间
    const now = new Date();

    // 转换为东八区时间（添加 8 小时）
    const eastEightTime = new Date(now.getTime() + 8 * 60 * 60 * 1000);

    // 格式化为需要的时间格式
    const formattedTime = fecha.format(eastEightTime, "YYYY-MM-DD HH:mm:ss");

    return formattedTime;
  },

  /**
   * 统一事务处理方法
   * @param {Function} callback - 包含事务逻辑的回调函数
   * @return {Promise<*>} 返回事务回调的结果
   */
  async transaction(callback) {
    const transaction = await this.model.transaction();
    try {
      const result = await callback(transaction);
      await transaction.commit();
      return result;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  // 获取排序条件数组
  getSortInfo(sort) {
    return _.isEmpty(sort) ? [["created_at", "DESC"]] : sort;
  },
  // create所需的一些公共字段
  getCrateInfo(creatorId, creatorName) {
    return {
      creatorId,
      creatorName,
      lastModifierId: creatorId,
      lastModifierName: creatorName,
    };
  },
  // modify所需的一些公共字段
  getModifyInfo(modifyId, modifyName) {
    return {
      lastModifierId: modifyId || "system",
      lastModifierName: modifyName || "system",
    };
  },

  validateParams(params) {
    const { address } = params;

    // 验证主参数
    if (!address) {
      throw new Error("缺少必要的参数");
    }

    const requiredFields = [
      "user_id",
      "province",
      "city",
      "district",
      "detail",
      "linkMan",
      "linkPhone",
    ];
    requiredFields.forEach(field => {
      if (!address[field]) {
        throw new Error(`地址缺少必要字段：${field}`);
      }
    });
  },

  // 单号生成，暂时是日期+6位
  async getBillNumber(prefix = "B") {
    const ctx = this.createAnonymousContext(); // 创建临时上下文
    const { redis } = ctx.service;
    const dateStr = fecha.format(new Date(), "YYYYMMDD");
    const key = `${prefix}${dateStr}`;

    // 使用 Redis 的 INCR 命令自增序列号
    // const sequence = await redis.incr(key);
    const value = (await redis.get(key, "order")) || 1;
    // 如果序列号为 1，设置键的过期时间为 24 小时（86400 秒）
    // if (sequence === 1) {
    //   await redis.expire(key, 86400);
    // }

    // 返回完整的订单号，格式为 前缀 + 日期 + 流水号（补零到 6 位）
    // return `${prefix}${dateStr}${String(sequence).padStart(6, "0")}`;
    await redis.set(key, value + 1, 3600 * 24, "order");

    return `${key}${String(value).padStart(6, "0")}`;
  },

  // 检查update
  checkUpdate(arr, message) {
    if (arr.includes(0)) {
      const error = new Error(message || "保存失败，请刷新后重试！");
      error.status = 422;
      throw error;
    }
  },
  // 检查delete
  checkDelete(count, message) {
    if (!count) {
      const error = new Error(message || "删除失败，请刷新后重试！");
      error.status = 422;
      throw error;
    }
  },

  // 任务处理
  registerTaskHandler(type, handler) {
    if (!type) {
      throw new Error("type不能为空");
    }
    if (!_.isFunction(handler)) {
      throw new Error("handler类型非function");
    }
    handlers[type] = handler;
    events[type] = true;
  },

  /**
   * @description 添加延迟任务
   * @param {string} type 任务类型
   * @param {string} id 任务 ID
   * @param {object} body 任务数据
   * @param {number} delay 延迟时间（秒）
   * @param {object} redis Redis 客户端实例
   */
  async addDelayTask(type, id, body = {}, delay = 3600) {
    const ctx = this.createAnonymousContext(); // 创建临时上下文
    const { redis } = ctx.service;
    if (!type || !id) {
      throw new Error("type 和 id 不能为空");
    }

    const key = `${delayEventKeyPrefix}${type}_${id}`;
    const taskKey = `${type}_${id}`;

    try {
      await redis.set(key, "delay_task", delay, "default");
      tasks[taskKey] = body;

      console.log(`延迟任务已添加：type=${type}, id=${id}, delay=${delay}s`);
    } catch (err) {
      console.error(`添加延迟任务失败：type=${type}, id=${id}`, err.message);
    }
  },

  // 订阅和处理延迟任务
  initDelayTask() {
    const ctx = this.createAnonymousContext(); // 创建临时上下文
    const { redis } = ctx.service;
    const subscribeClient = redis.getClient("subscribe");
    // 订阅
    subscribeClient.psubscribe("__keyevent@0__:expired", (err, count) => {
      if (err) {
        console.error("订阅延迟任务失败：", err.message);
      } else {
        console.log(`已订阅延迟任务事件，共 ${count} 个频道`);
      }
    });

    // 处理
    subscribeClient.on("pmessage", async (pattern, channel, message) => {
      // 匹配key
      const result = message.match(
        new RegExp(
          `^${delayEventKeyPrefix}(${_.keys(events).join("|")})_(\\S+)$`
        )
      );

      if (result) {
        const type = result[1];
        const id = result[2];
        const handler = handlers[type];

        if (_.isFunction(handler)) {
          const taskKey = `${type}_${id}`;
          const taskData = tasks[taskKey];

          if (taskData) {
            console.log(`处理延迟任务：type=${type}, id=${id}`);
            handler(id, tasks[taskKey]);
            tasks[taskKey] = null;
          } else {
            console.log(`未找到延迟任务：type=${type}, id=${id}`);
          }

          // 清理 Redis 中的任务数据
          await redis.del(`${delayEventKeyPrefix}${type}_${id}`, "default");
        } else {
          console.log(`未找到任务处理器：type=${type}`);
        }
      }
    });
  },
};
