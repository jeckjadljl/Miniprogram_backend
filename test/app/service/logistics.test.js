/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-06-05 23:28:54
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-06-05 23:32:36
 * @FilePath: \Mini_program_backend\test\app\service\logistics.test.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
// 修复模块引入路径问题
const LogisticsService = require("../../app/service/logistics"); // 修改为正确的模块路径

// 修复jest模拟设置
jest.mock("../../app/service/jwt", () => ({
  // 匹配实际jwt服务路径
  getAccessToken: jest.fn().mockResolvedValue("mock_token"),
}));

// 在describe块前添加服务实例化
let serviceInstance;

app.transaction.mockImplementation(async callback => {
  const transaction = { commit: jest.fn(), rollback: jest.fn() };
  await callback(transaction);
  return transaction;
});

describe("queryTrace", () => {
  let ctx, app;

  beforeEach(() => {
    // 添加服务实例初始化
    serviceInstance = new LogisticsService(ctx);

    ctx = {
      model: {
        Order: {
          findByPk: jest.fn(),
          update: jest.fn(),
        },
        Logistics: {
          update: jest.fn(),
        },
        OrderItem: {
          update: jest.fn(),
        },
      },
    };
    app = {
      transaction: jest.fn(),
      getModifyInfo: jest.fn(),
      Sequelize: {
        literal: jest.fn(),
      },
    };
    axios.post.mockReset();
  });

  // 修改所有测试用例调用方式
  test("should throw error when order not found", async () => {
    ctx.model.Order.findByPk.mockResolvedValue(null);
    await expect(serviceInstance.queryTrace("order123")).rejects.toThrow(
      "订单不存在或未上传运单信息"
    );
  });

  // 其他测试用例的调用方式统一改为：
  // await serviceInstance.queryTrace("order123");
});
