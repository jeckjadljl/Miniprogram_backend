"use strict";

const md5 = require("md5");
const Service = require("egg").Service;

/**
 * Service - 商家
 * @class
 * @author ruiyong-lee
 */
class MerchantService extends Service {
  /**
   * 查找某个商家数据
   * @param {string} userName - 商家账号
   * @param {string} password - 商家密码
   * @return {object|null} - 查找结果
   */
  async getMerchantByLogin(userName, password) {
    return await this.app.mysql.get("merchant", {
      userName,
      password: md5(password),
    });
  }

  async getUserByPhone(phone) {
    // 查询 users 表，根据手机号查找用户
    return await this.app.mysql.get("user", { phoneNumber: phone });
  }

  async registerNewMerchant(merchantData) {
    const { app } = this;
    const { name, password, userName, linkMan, linkPhone } = merchantData;

    const user = await this.getUserByPhone(linkPhone);

    if (!user) {
      const error = new Error("您未注册小程序，请先注册小程序才能成为商家");
      error.name = "NotRegisteredError"; // 用户名错误
      throw error;
    } else if (userName !== user.user_name) {
      const error = new Error("您的名称与小程序的名称不一致");
      error.name = "userNameExistsError"; // 用户名错误
      throw error;
    }

    // 检查此账号是否已被注册
    const existingMerchant = await this.getMerchantByLogin(name, password);
    if (existingMerchant) {
      const error = new Error("该商家已注册，请尝试找回密码");
      error.name = "MerchantNameExistsError"; // 自定义错误名
      throw error;
    }

    // 生成基础信息（如创建时间等）
    const createInfo = app.getCrateInfo(user.uuid, userName);

    const newMerchantData = {
      ...createInfo,
      name,
      linkMan,
      linkPhone,
      password: md5(password), // 加密密码
      userType: "merchant",
      userName,
      enableStatus: true, // 默认启用
      orgName: name,
    };

    // 保存商家到数据库
    return await app.model.Merchant.saveNew(newMerchantData);
  }

  /**
   * 新增商家
   * @param {object} params - 条件
   * @return {string|null} - 商家uuid
   */
  async saveNew(params = {}) {
    const { merchant } = params;
    const { user_id, userName } = merchant;
    const { app, service } = this;

    if (!user_id || !userName) {
      throw new Error("缺少必要的用户信息");
    }
    const getUser = await service.user.getUserByName(userName);
    if (!getUser) {
      const error = new Error("未找到该用户，请输入正确的用户名");
      error.name = "userNameExistsError"; // 用户名错误
      throw error;
    }

    const unique = app.model.Merchant.get({
      user_id,
      attributes: ["uuid", "version", "name"],
    });
    if (unique && unique.name === merchant.name) {
      const error = new Error("该店铺名已存在");
      error.name = "MerchantNameExistsError"; // 自定义错误名
      throw error;
    }

    const crateInfo = app.getCrateInfo(user_id, userName);

    const merchantData = {
      ...merchant,
      ...crateInfo,
      password: md5(merchant.password),
      userType: "merchant",
      orgName: merchant.name,
      enableStatus: true,
    };

    return await app.model.Merchant.saveNew(merchantData);
  }

  /**
   * 修改商家
   * @param {object} params - 条件
   * @return {string|null} - 商家uuid
   */
  async saveModify(params = {}) {
    const { app } = this;
    const { merchant } = params;
    const { user_id, userName } = merchant;
    const { password } = merchant;
    const modifyInfo = app.getModifyInfo(user_id, userName);

    if (password) {
      merchant.password = md5(password);
    }

    const merchantData = { ...merchant, ...modifyInfo };

    return await app.model.Merchant.saveModify(merchantData);
  }

  /**
   * 修改商家密码
   * @param {object} params - 条件
   * @return {string|null} - 商家uuid
   */
  async savePasswordModify(params = {}) {
    const { app } = this;
    const { user_id, userName, oldPassword, newPassword } = params;
    const modifyInfo = app.getModifyInfo(user_id, userName);

    return await app.model.Merchant.savePasswordModify({
      uuid: user_id,
      oldPassword: md5(oldPassword),
      password: md5(newPassword),
      ...modifyInfo,
    });
  }

  /**
   * 获取商家分页列表
   * @param {object} params - 条件
   * @return {object|null} - 查找结果
   */
  async query(params = {}) {
    const { app } = this;
    return await app.model.Merchant.query({
      ...params,
      attributes: [
        "uuid",
        "version",
        "createdTime",
        "name",
        "enableStatus",
        "userName",
        "servicePhone",
        "linkPhone",
        "linkMan",
      ],
    });
  }

  /**
   * 根据uuid获取商家
   * @param {object} uuid - 商家uuid
   * @param {object} userType - 用户类型
   * @return {object|null} - 查找结果
   */
  async get(uuid) {
    const { app } = this;
    return await app.model.Merchant.get({
      uuid,
      attributes: [
        "uuid",
        "version",
        "name",
        "enableStatus",
        "userName",
        "servicePhone",
        "linkPhone",
        "linkMan",
        "address",
        "appId",
        "appSecret",
        "mchId",
        "mchKey",
      ],
    });
  }
}

module.exports = MerchantService;
