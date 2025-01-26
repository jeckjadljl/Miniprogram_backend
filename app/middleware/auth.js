/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-11-03 11:54:16
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-01-17 11:48:16
 * @FilePath: \Mini_program_backend\app\middleware\auth.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
// app/middleware/auth.js

module.exports = options => {
  return async function auth(ctx, next) {
    const authHeader = ctx.request.header.authorization;

    // 判断是否为登录或刷新 token 的接口，如果是，直接放行
    const exemptRoutes = ["/login", "/login/test", "/refresh-token", "/"];
    const exemptPrefixes = [
      "/goods",
      "/cart",
      "/address",
      "/merchant",
      "/goodsCategory",
      "/order",
      "/bill",
      "/deliveryTimeType",
      "/freightPlan",
      "/referral",
    ]; // 定义需要前缀匹配的路由
    if (
      exemptRoutes.includes(ctx.path) ||
      exemptPrefixes.some(prefix => ctx.path.startsWith(prefix))
    ) {
      await next();
      return;
    }

    if (!authHeader) {
      ctx.status = 401;
      ctx.body = { message: "Access Token not provided" };
      return;
    }

    // 使用正则表达式匹配Bearer token并提取其中的token值
    const token = authHeader.replace(/^Bearer\s+/i, "");

    try {
      // 验证 Access Token（JWT 自带有效期）
      const decoded = await ctx.service.jwt.verifyToken(token);

      if (!decoded) {
        throw new Error("User token verification failed");
      }

      const session_key = ctx.service.redis.get(decoded.uid);

      if (!session_key) {
        ctx.status = 401;
        ctx.body = { message: "Session expired, please log in again." };
        return;
      }

      const refreshToken = await ctx.service.redis.get(decoded.uid);
      console.log(refreshToken);
      if (refreshToken) {
        throw new Error("The refresh_token is Block! pleace to login");
      }

      const roles = ctx.service.role.getUserRoles(decoded.uid);

      if (roles) {
        throw new Error("The roles is not found");
      }

      const user = {
        roles,
        ...decoded,
      };

      // 将用户信息附加到上下文
      ctx.state.user = user;
      ctx.state.token = token;
      await next();
    } catch (err) {
      throw err;
    }
  };
};
