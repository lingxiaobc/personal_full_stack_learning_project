# L10 学习记录｜陌生故障的完整证据链

日期：2026-09-27

状态：已通过；阶段 1 综合关卡完成，暂停消化
关联课程：阶段 1 · L10；前置记录见 [L09 学习记录](L09-request-failure-classification.md)。

## 本课目标

由学习者先提出诊断假设与检查顺序，再通过一次只改变一个变量的实验定位故障；恢复后验证成功、后端拒绝和前端拦截三条路径。

## 故障现场与学习者诊断

故障现场：页面提交非空姓名，Network 中 Request Payload 是 `{ "name": "Lenox" }`，请求发往 `POST http://localhost:3000/api/hello` 并收到 HTTP 400。前端 Console 收到 Response 并成功解析错误 JSON，没有进入无 Response 的外层 `catch`，页面显示 `name is required`。

学习者最初把范围定位到后端解析请求体或业务逻辑，并提出至少两个假设：请求体解析错误、解析后业务判断错误。学习者先排查请求链路，指出请求已到达后端，端口、路径、Method 和前端 Payload 与预期一致，再检查后端解析和读取逻辑。

复核后将首要检查收窄为：`express.json()` 是否存在、是否在读取 `request.body` 的 Route 之前执行；同时检查 Request `Content-Type`，避免把 Middleware 顺序与请求媒体类型混为一谈。

## 根因与最小恢复

受控实验只改变了 `backend/src/server.ts` 中 `express.json()` 的注册位置：把它从 `/api/hello` Route 之前移到 Route 之后。Route 因而先读取 `request.body` 并结束响应，后面的 JSON Middleware 没有机会解析该请求。前端仍发送非空姓名，但后端校验分支返回 `name is required`。

最小恢复是把 `app.use(express.json())` 放回需要读取 JSON Body 的 Route 之前。当前 [server.ts](../backend/src/server.ts) 已恢复为该顺序。实验修改已撤销，工作区在学习记录更新前干净。

故障时的 Network 截图显示了非空 Payload 和 HTTP 400；响应中 `received` 字段未出现，与 `request.body` 未定义相符，因为 JSON 序列化会省略值为 `undefined` 的对象属性。故障时后端终端的 `req.body` 单行没有保存在本次截图中，因此这一点是旁证；Middleware 位置的单变量改动及恢复后的成功回归提供了主要因果证据。

## 回归观察

| 场景 | 用户操作 / 输入 | 观察到的证据 | 验证结论 |
| --- | --- | --- | --- |
| A：正常页面请求 | 页面输入 `Lenox` 并提交 | Console 显示 Request、HTTP 200、解析后的 JSON 和页面更新；Network 显示 `POST /api/hello`、200 和 JSON Response；页面显示“你好，Lenox” | JSON Middleware 顺序恢复后，前端到后端再回到页面的成功链路正常 |
| B：绕过前端校验 | 浏览器 Console 发送 `{ name: "" }` | Network Payload 为 `{ "name": "" }`；后端终端显示 `req.body: { name: '' }` 并返回错误对象；浏览器拿到 HTTP 400，JSON 解析成功，没有进入代码中的 `catch` | 后端独立收到并拒绝空姓名；HTTP 400 不等于 Fetch Promise 失败 |
| C：页面空输入 | 清空输入框后通过页面提交 | 页面显示“前端校验：姓名不能为空”；Console 显示前端阻止请求；用户确认 Network 没有新的 API 请求 | 页面校验在 Fetch 之前返回，后端不会收到这次请求 |
| 首尾空格变式 | 页面输入首尾带空格的非空姓名 | Network Payload 保留原始首尾空格；成功 Response 的 `receivedName` 为去掉首尾空格后的姓名 | 前端发送的原始 Payload 没有被改写；后端 `trim()` 生成用于校验与响应的规范化局部值 |

## 已建立的诊断方法

```text
先看 Network 的 URL、Method、Payload 和状态码
↓
再看 Console：是否收到 Response、是否解析成功、走了哪个分支
↓
对照后端 req.body 与 Content-Type
↓
检查 Middleware 是否在 Route 前运行
↓
一次只改变一个变量，观察故障是否随之出现或消失
↓
恢复后验证正常请求、后端拒绝和前端拦截
```

本课尤其区分了两种最后会汇合到同一 400 校验分支的输入状态：

- `{ name: "" }`：`req.body` 已解析，姓名字段存在但为空。
- Middleware 顺序错误：Route 执行时 `req.body` 未被 JSON Middleware 填充，姓名读取结果为 `undefined`，业务代码将其转成空字符串。

两者可能显示相同错误文字；Network Payload 和后端 `req.body` 日志能区分根因。

## 暂定验收

- 解释：2/2。能描述请求、解析、业务校验、Response 与前端更新的边界，并区分三类回归路径。
- 证据：2/2。结合 Network、Console、页面、后端终端和 Middleware 代码顺序定位；故障时的后端 `req.body` 终端行未单独留图，已在根因说明中标注该证据限制。
- 迁移：2/2。用绕过页面的空姓名请求区分后端校验，并用首尾空格变式观察原始值与规范化值。
- 验证与恢复：2/2。恢复后验证页面正常请求 200、直接空姓名 400、页面空输入不发送 API 请求。

## 下一步

阶段 1 的 L10 综合关卡通过，暂停消化。恢复学习时进入 L11；开始阶段 2 前，用短挑战补验尚未逐课验收的 L01–L04 基础，只补未通过的能力点。
