/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-11-10 10:58:30
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-02-28 22:34:39
 * @FilePath: \Mini_program_backend\app\service\redis.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

const Service = require("egg").Service;

class RedisService extends Service {
  /**
   * @description 获取 Redis 客户端
   * @param {string} clientName Redis 客户端名称 (default, token, order)
   * @return {object} Redis 客户端实例
   */
  getClient(clientName = "default") {
    const client = this.app.redis.get(clientName);
    if (!client) {
      throw new Error(`Redis client '${clientName}' is not available.`);
    }
    return client;
  }

  /**
   * @description Sets a value in the cache with an optional expiration time.
   * @param {string} key The key to set.
   * @param {*} value The value to set.
   * @param clientName
   * @param {number} [seconds] Expiration time in seconds.
   */
  async set(key, value, seconds, clientName = "default") {
    try {
      const client = this.getClient(clientName);
      const data = JSON.stringify(value);

      if (!seconds) {
        await client.set(key, data);
      } else {
        await client.set(key, data, "EX", seconds);
      }
    } catch (error) {
      console.error(
        `Error setting data in cache [${clientName}]:`,
        error.message
      );
    }
  }

  /**
   * @description Retrieves a value from the cache.
   * @param clientName
   * @param {string} key The key to retrieve.
   * @return {*} The retrieved value, or undefined if the key doesn't exist.
   */
  async get(key, clientName = "default") {
    try {
      const client = this.getClient(clientName);
      const data = await client.get(key);

      if (!data) {
        return undefined;
      }

      return JSON.parse(data);
    } catch (error) {
      console.error(
        `Error retrieving data from cache [${clientName}]:`,
        error.message
      );
      return undefined;
    }
  }

  /**
   * @description Deletes a key from the cache.
   * @param clientName
   * @param {string} key The key to delete.
   */
  async del(key, clientName = "default") {
    try {
      const client = this.getClient(clientName);

      await client.del(key);
    } catch (error) {
      console.error(
        `Error deleting data from cache [${clientName}]:`,
        error.message
      );
    }
  }
}

module.exports = RedisService;
