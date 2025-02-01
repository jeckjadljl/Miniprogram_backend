# Mini_program_backend

满满严选微信小程序后端项目

mini program

## QuickStart

<!-- add docs here for user -->

see [egg docs][egg] for more detail.

### Development

```bash
# 安装依赖
npm i

# 启动开发环境
npm run dev

# 在浏览器打开
open http://localhost:7001/
```

### Deploy 使用 docker

```bash
# 使用测试环境配置，确保在项目根目录下有 .env.test 文件
docker-compose --env-file .env.test -f docker-compose.test.yml up -d

# 使用生产环境配置，确保在项目根目录下有 .env 文件
docker compose up -d
```

### npm scripts

- Use `npm run lint` to check code style.
- Use `npm test` to run unit test.

[egg]: https://eggjs.org
