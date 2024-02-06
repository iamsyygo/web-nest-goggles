<div align="center" style="display:flex;align-items:center;justify-content:space-around">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</div>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

<p align="center">一个用于构建高效且可扩展的服务器端应用程序的先进的 <a href="http://nodejs.org" target="_blank">Node.js</a>框架</p>
<p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>

## 描述

[Nest](https://github.com/nestjs/nest) 框架 TypeScript 初始仓库。

## 安装

```bash
$ pnpm install
```

## 运行应用

```bash
# 开发模式
$ pnpm run start

# 监视模式
$ pnpm run start:dev

# 生产模式
$ pnpm run start:prod
```

## 测试

```bash
# 单元测试
$ pnpm run test

# e2e 端到端测试
$ pnpm run test:e2e

# 测试覆盖率
$ pnpm run test:cov
```


## Vercel 部署
在 Vercel 上部署 NestJS 并不是默认的场景。它需要一点魔法一个 vercel.json 文件，它负责在项目中配置和覆盖 Vercel 的默认行为，为项目自定义 Vercel 的行为。
1、根目录下创建一个 vercel.json
```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/main.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/main.ts",
      "methods": ["GET", "POST", "PUT", "DELETE"]
    }
  ]
}
```

2、线上数据库采用[railway](https://railway.app/project/4c1e2c89-e769-4c75-afd1-3ccd033b3cc2/service/de9706e5-d3b9-428b-9436-aa00fedb359f/settings)
客户端连接时记得开启 SSL
也可以是 [planetscale](https://auth.planetscale.com/sign-up)

一些 bug 解决方案：
- [vercel 路径问题](https://github.com/orgs/vercel/discussions/2323)

## 支持

Nest 是一个 MIT 许可的开源项目。它能够因为赞助商和出色的支持者而发展。如果你想加入他们，请[在此阅读更多](https://docs.nestjs.com/support).

## 保持联系

- 作者 - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- 网站 - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## 许可

Nest 使用 [MIT 许可](LICENSE).
