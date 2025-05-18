# 极客时间AI调用测试项目

这是一个用于测试AI API调用的Node.js项目，主要演示如何使用OpenAI的Function Calling功能实现天气查询应用。

## 项目结构

```
├── .env                 # 环境变量配置文件
├── package.json         # 项目依赖配置
├── code/                # 代码目录
│   └── 02|weatherDemo.js  # 天气查询演示代码
└── note/                # 笔记目录
```

## 安装与设置

1. 克隆项目后，安装依赖：

```bash
npm install
```

2. 配置环境变量：

编辑 `.env` 文件，添加你的OpenAI API密钥：

```
OPENAI_API_KEY=your_openai_api_key_here
```

## 使用方法

运行天气查询演示：

```bash
npm start
```

默认查询北京的天气。如需查询其他城市，可以传入城市名称：

```bash
node "code/02|weatherDemo.js" 上海
```

## 功能说明

- 使用OpenAI的Function Calling功能实现天气查询
- 演示如何定义函数并让AI决定何时调用
- 模拟天气API返回数据
- 展示完整的AI对话流程

## 技术栈

- Node.js
- OpenAI API
- dotenv (环境变量管理)
- axios (HTTP请求)