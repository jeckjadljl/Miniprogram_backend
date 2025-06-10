// test/user.test.js
const { app } = require("egg-mock/bootstrap");
const assert = require("assert");
const factory = require("factory-girl").factory;

describe("User model CRUD with factory-girl and assert", function () {
  this.timeout(10000);
  // 合并 before 钩子
  before(async function () {
    await app.ready(); // 等待应用准备好

    // 清理数据库中的所有用户数据
    await app.model.User.destroy({ where: {}, truncate: true });

    // 动态导入并定义用户工厂
    factory.define("user", app.model.User, {
      openid: factory.seq("User.openid", n => `openid${n}`),
      session_key: "some_session_key",
      unionid: null,
      user_name: factory.chance("name"),
    });
  });

  it("should create a new user using factory", async function () {
    this.timeout(10000); // add timeout.
    const user = await factory.create("user"); // 使用 factory 创建用户
    assert(user);
    assert(user.openid);
  });

  it("should retrieve a user", async () => {
    const user = await factory.create("user"); // 创建另一个用户
    const foundUser = await app.model.User.findOne({
      where: { openid: user.openid },
    });
    assert.strictEqual(foundUser.user_name, user.user_name);
  });

  it("should update a user", async () => {
    const user = await factory.create("user");
    await app.model.User.update(
      { session_key: "updated_session_key" },
      { where: { openid: user.openid } }
    );

    const updatedUser = await app.model.User.findOne({
      where: { openid: user.openid },
    });
    assert.strictEqual(updatedUser.session_key, "updated_session_key");
  });

  it("should delete a user", async () => {
    const user = await factory.create("user");
    await app.model.User.destroy({ where: { openid: user.openid } });

    const deletedUser = await app.model.User.findOne({
      where: { openid: user.openid },
    });
    assert.strictEqual(deletedUser, null);
  });
});
