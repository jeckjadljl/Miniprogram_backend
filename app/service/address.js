/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-11-18 16:07:21
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-03-25 10:55:58
 * @FilePath: \Mini_program_backend\app\service\address.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

const Service = require("egg").Service;

class AddressService extends Service {
  /**
   * 根据uuid获取用户地址
   * @param {object} params - 条件
   * @return {object|null} - 查找结果
   */
  async get(params = {}) {
    const { app } = this;
    return await app.model.Address.get({
      ...params,
      attributes: [
        "address_id",
        "version",
        "linkMan",
        "linkPhone",
        "province",
        "city",
        "district",
        "detail",
        "is_default",
      ],
    });
  }

  /**
   * 获取用户默认地址
   * @param {object} params - 条件
   * @return {object|null} - 查找结果
   */
  async getDefault(params = {}) {
    const { app } = this;
    return await app.model.Address.getDefault({
      ...params,
      attributes: [
        "address_id",
        "linkMan",
        "linkPhone",
        "province",
        "city",
        "district",
        "detail",
      ],
    });
  }

  /**
   * 设置用户默认地址
   * @param {object} params - 条件
   * @return {string|null} - 用户地址uuid
   */
  async setDefault(params = {}) {
    const { app } = this;
    return await app.model.Address.setDefault(params);
  }

  /**
   * 删除用户地址
   * @param {object} params - 条件
   * @return {string|null} - 删除用户地址uuid
   */
  async remove(params = {}) {
    const { app } = this;
    return await app.model.Address.remove(params);
  }

  /**
   * 获取用户地址列表
   * @param {object} params - 条件
   * @return {Array|null} - 查找结果
   */
  async getList(params = {}) {
    const { app } = this;
    // const { Sequelize } = app;
    return await app.model.Address.getList({
      ...params,
      attributes: [
        "address_id",
        "linkMan",
        "linkPhone",
        "province",
        "city",
        "district",
        "detail",
        "address_tag",
        "is_default",
        // 拼接 province, city, district, detail 成 address
        // [
        //   Sequelize.fn(
        //     "CONCAT",
        //     Sequelize.col("province"),
        //     Sequelize.literal("' '"), // 空格分隔
        //     Sequelize.col("city"),
        //     Sequelize.literal("' '"),
        //     Sequelize.col("district"),
        //     Sequelize.literal("' '"),
        //     Sequelize.col("detail")
        //   ),
        //   "address", // 拼接后的字段名
        // ],
      ],
    });
  }

  /**
   * 新增用户地址
   * @param {object} params - 条件
   * @return {string|null} - 用户地址uuid
   */
  async saveNew(params = {}) {
    const { address } = params;
    const { user_id, linkMan } = address;
    const { app } = this;
    const crateInfo = app.getCrateInfo(user_id, linkMan);

    // 参数验证，确保 address、openId 和 creator_name 有效
    app.validateParams(params);

    // 合并地址和额外信息（openId 和 creator_name）
    const addressData = {
      ...address,
      ...crateInfo,
    };

    return await app.model.Address.saveNew(addressData);
  }

  /**
   * 修改用户地址
   * @param {object} params - 条件
   * @return {string|null} - 查找结果
   */
  async saveModify(params = {}) {
    const { address } = params;
    const { user_id, linkMan } = address;
    const { app } = this;
    const modifyInfo = app.getModifyInfo(user_id, linkMan);

    const addressData = {
      ...address,
      ...modifyInfo,
    };

    return await app.model.Address.saveModify(addressData);
  }
}

module.exports = AddressService;
