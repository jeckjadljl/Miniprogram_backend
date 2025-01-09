/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-11-18 17:31:35
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2024-12-06 17:08:27
 * @FilePath: \Mini_program_backend\app\controller\address.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

const Controller = require("../core/base_controller");

class AddressController extends Controller {
  /**
   * 根据uuid获取用户地址
   */
  async getAddress() {
    const { ctx } = this;
    const address = await ctx.service.address.get(ctx.request.body);
    this.success(address);
  }

  /**
   * 获取用户默认地址
   */
  async getDefaultAddress() {
    const { ctx } = this;
    const address = await ctx.service.address.getDefault(ctx.request.body);

    this.success(address);
  }

  /**
   * 设置用户默认地址
   */
  async setDefaultAddress() {
    const { ctx } = this;
    const uuid = await ctx.service.address.setDefault(ctx.request.body);

    this.success(uuid);
  }

  /**
   * 删除用户地址
   */
  async deleteAddress() {
    const { ctx } = this;
    const uuid = await ctx.service.address.remove(ctx.request.body);

    this.success(uuid);
  }

  /**
   * 获取用户地址列表
   */
  async getAddressList() {
    const { ctx } = this;
    const addressList = await ctx.service.address.getList(ctx.request.body);

    this.success(addressList);
  }

  /**
   * 新增用户地址
   */
  async saveNewAddress() {
    const { ctx } = this;
    const rule = {
      address: "object",
    };
    ctx.validate(rule);
    const uuid = await ctx.service.address.saveNew(ctx.request.body);

    this.success(uuid);
  }

  /**
   * 修改用户地址
   */
  async saveModifyAddress() {
    const { ctx } = this;
    const rule = {
      address: "object",
    };
    ctx.validate(rule);
    const uuid = await ctx.service.address.saveModify(ctx.request.body);

    this.success(uuid);
  }
}

module.exports = AddressController;
