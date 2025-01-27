/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-11-13 12:00:43
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-01-27 17:58:02
 * @FilePath: \Mini_program_backend\app\model\address.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
// app/model/address.js
module.exports = app => {
  const { model, checkUpdate, checkDelete } = app;
  const AddressSchema = require("../../app/schema/addresses")(app);

  const Address = model.define("address", AddressSchema, {
    tableName: "addresses",
  });

  Address.associate = function () {
    const { User, Order } = model;
    Address.belongsTo(User, { foreignKey: "user_id" });
    Address.hasMany(Order, { foreignKey: "address_id" });
  };

  /**
   * 根据uuid获取用户地址
   * @param {object} { uuid, attributes } - 条件
   * @return {object|null} - 查找结果
   */
  Address.get = async ({ address_id, user_id, attributes }) => {
    return await Address.findOne({
      attributes,
      where: { address_id, user_id },
    });
  };

  /**
   * 查询用户默认地址
   * @param {object} { openId, attributes } - 条件
   * @return {object|null} - 查找结果
   */
  Address.getDefault = async ({ user_id, attributes }) => {
    return await Address.findOne({
      attributes,
      where: { user_id, is_default: true },
    });
  };

  /**
   * 设置用户默认地址
   * @param {object} { uuid } - 条件
   * @return {string|null} - 用户地址uuid
   */
  Address.setDefault = async ({ address_id, user_id }) => {
    return await app.transaction(async transaction => {
      // 将用户的其他默认地址设为非默认
      const [updateCount] = await Address.update(
        { is_default: false },
        { where: { user_id, is_default: true }, transaction }
      );

      if (updateCount > 0) {
        app.checkUpdate([updateCount]);
      }

      // 将指定地址设为默认
      const [updateDefaultCount] = await Address.update(
        { is_default: true },
        { where: { address_id, user_id }, transaction }
      );

      if (updateDefaultCount === 0) {
        throw new Error("设置默认地址失败");
      }

      return address_id;
    });
  };

  /**
   * 删除用户地址
   * @param {object} { uuid } - 条件
   * @return {string|null} - 删除用户地址uuid
   */
  Address.remove = async ({ address_id, user_id }) => {
    const result = await Address.destroy({
      where: { address_id, user_id },
    });

    checkDelete(result);

    return address_id;
  };

  /**
   * 查询用户地址列表
   * @param {object} { openId, attributes } - 条件
   * @return {Array|null} - 查找结果
   */
  Address.getList = async ({ user_id, attributes }) => {
    return await Address.findAll({
      attributes,
      where: { user_id },
    });
  };

  /**
   * 新增用户地址
   * @param {object} address - 条件
   * @return {string} - 地址uuid
   */
  Address.saveNew = async address => {
    const { user_id, is_default } = address;

    if (is_default === true) {
      // 如果地址是默认地址，开启事务处理
      return await app.transaction(async transaction => {
        // 将当前用户的其他默认地址设为非默认
        const [updateCount] = await Address.update(
          { is_default: false },
          { where: { user_id, is_default: true }, transaction }
        );

        // 检查更新是否成功
        if (updateCount > 0) {
          checkUpdate([updateCount]);
        }

        // 插入新地址
        const newAddress = await Address.create(address, { transaction });
        return newAddress.address_id;
      });
    }
    // 如果不是默认地址，直接插入
    const newAddress = await Address.create(address);
    return newAddress.address_id;
  };

  /**
   * 修改用户地址
   * @param {object} address - 条件
   * @return {string} - 返回地址uuid
   */
  Address.saveModify = async address => {
    const { address_id, user_id, is_default } = address;

    return await app.transaction(async transaction => {
      if (is_default === true) {
        // 将当前用户的其他默认地址设置为非默认
        const [updateCount] = await Address.update(
          { is_default: false },
          { where: { user_id, is_default: true }, transaction }
        );
        // 检查是否成功更新默认地址
        checkUpdate([updateCount]);
      }
      const [updateResult] = await Address.update(address, {
        where: { address_id, user_id },
        transaction,
      });

      checkUpdate([updateResult]);

      return address_id;
    });
  };

  return Address;
};
