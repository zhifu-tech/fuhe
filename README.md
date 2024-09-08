# fuhe store 库存管理小程序

福猫微信小程序

## 工程目录结构

```sh
.
├── app.js
├── app.json
├── app.wxss
├── cloud-models.d.ts       // 数据模型的定义
├── cloudbaserc.json        // 数据模型的版本和环境
├── components
├── config
├── config.js
├── custom-tab-bar
├── evnList.js              // 环境配置
├── miniprogram_npm
├── mocks
├── node_modules
├── package-lock.json
├── package.json
├── package_home
├── package_user
├── pages
├── pbcopy
├── services
├── sitemap.json
├── style
└── tsconfig.json
```

## 数据模型

### 1. [数据模型的文档](https://docs.cloudbase.net/model/introduce)

### 2. [同步模型的同步](https://docs.cloudbase.net/model/sync-schema)

- step1. 在 app.json 文件同目录下运行命令。

```
cd path/to/project/miniprogram
```

- step2. 执行 tcb 到命令

```sh
tcb sync-model-dts --envId=<envId>
```

- step3. 查看资源文件

```
├── cloud-models.d.ts // 云数据模型定义
├── cloudbaserc.json  // 云数据模型版本和工程环境
```

## 日志

- [控制台日志](https://developers.weixin.qq.com/miniprogram/dev/reference/api/console.html)
- LogManager, 普通日志， 用户上报的日志
- [RealtimeLogManager，实时日志](https://developers.weixin.qq.com/miniprogram/dev/platform-capabilities/extended/log/)，自动收集上报

### 本地日志（控制台日志）

[winston 日志工具](https://github.com/winstonjs/winston)

## 开发资源

[TDesign MiniProgram](https://tdesign.tencent.com/miniprogram/overview)


## 关于索引
1. popup 