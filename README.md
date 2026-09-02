# HTTP 数据流实验

这是第一阶段的最小练习项目。它不连接数据库，只打通一条完整的前后端数据链：

```text
用户输入姓名
  ↓
React state
  ↓
fetch 发出 POST Request
  ↓
Express 读取 req.body
  ↓
后端生成 JSON Response
  ↓
React 读取 response.json()
  ↓
页面显示结果
```

## 目录

```text
frontend/
  src/App.tsx       页面、表单状态、fetch、响应状态
  src/main.tsx      React 入口
  src/index.css     页面样式
  package.json      前端依赖和启动命令

backend/
  src/server.ts     Express 入口、API 路由、请求处理
  package.json      后端依赖和启动命令

package.json        根目录工作区和同时启动命令
```

## 运行

在根目录执行：

```bash
npm install
npm run dev
```

然后打开：<http://localhost:5173>

也可以分别启动两个服务：

```bash
npm run dev:backend
npm run dev:frontend
```

前端运行在 `5173`，后端运行在 `3000`。

## 观察练习

1. 在输入框输入“张三”，点击发送。
2. 打开浏览器开发者工具的 Network 面板，找到 `hello` 请求。
3. 查看 Request URL、Request Method、Request Payload、Status Code 和 Response。
4. 同时观察后端终端打印的 `req.body`。
5. 把输入改成“李四”，比较前后两次 Request 和 Response。
6. 留空发送，观察后端返回 `400`，理解后端校验和错误响应。

## API Contract

```text
POST http://localhost:3000/api/hello
Content-Type: application/json
```

Request body:

```json
{
  "name": "张三"
}
```

成功响应 `200`：

```json
{
  "message": "你好，张三",
  "receivedName": "张三"
}
```

空姓名响应 `400`：

```json
{
  "error": "name is required",
  "received": {
    "name": ""
  }
}
```
