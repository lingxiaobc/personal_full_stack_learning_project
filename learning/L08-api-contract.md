# L08 学习记录｜字段契约不一致：有数据为什么仍失败

日期：2026-09-14
状态：已通过（2026-09-14）
关联课程：L08；为 L09「请求失败分类」提供前置证据。

## 本课核心主线

同一份 HTTP 数据必须同时满足字段名、运行时类型和业务含义的契约。Request 到达后端，只能证明浏览器通信和 JSON 解析发生了；不代表后端一定能按预期读取并接受该数据。

## 涉及组件与数据流

- 前端页面与 React State：[frontend/src/App.tsx](../frontend/src/App.tsx)。页面提交由 `sendName()` 构造 `{ name }`，调用 `fetch()`，再依据 Response 更新 State。
- 后端 API：[backend/src/server.ts](../backend/src/server.ts)。后端监听 3000 端口，`POST /api/hello` 读取 `request.body?.name`，仅在值是字符串时执行 `trim()`。
- 浏览器 Console：可直接调用 `fetch()`，但不会经过 `sendName()`，也不会自动调用 React 的 `setMessage`、`setResponseData` 等 State 更新。
- 主要观察点：页面、Network、Console、后端终端。每一处证明的事实不同，不能互相替代。

## 已完成的训练与证据

| 场景 | 已观察事实 | 说明 |
| --- | --- | --- |
| 字段名失配 | 后端曾临时把读取字段从 `name` 改为 `username`；前端仍发送 `name`，请求返回 400。恢复为 `name` 后，同样的正常输入返回 200。 | `request.body` 中有 `name` 不等于后端读取表达式能得到值；该故障已恢复。具体证据见 tracker 的 T-05。 |
| 类型变式 | 浏览器 Console 直接发送 `POST /api/hello` 和 `{ name: 123 }`；Network/Console 显示 HTTP 400，错误响应体含 `error: "name is required"` 与 `received.name: 123`。 | `rawName` 为数字 `123`，`typeof rawName` 为字符串 `"number"`；类型守卫失败后，后端局部变量 `name` 使用空字符串兜底。 |
| 表单与 Console 的差异 | 页面输入框中键入 `123` 后，页面的 Request Payload 是 `{ "name": "123" }`，并得到 HTTP 200；同一时间 Console 的数值请求是 `{ "name": 123 }`，得到 HTTP 400。 | HTML 文本输入的 `event.target.value` 是字符串；同一路径不代表 Request Body 的类型相同。 |
| 请求构造失败 | Console 中把方法改成 `GET` 但仍保留 `body`，浏览器抛出 `TypeError: Request with GET/HEAD method cannot have body` 并进入 `catch`。 | 这是浏览器在发送前拒绝请求，不是后端返回 400 或 404。 |
| 无提示复测 | AI 临时注入一处前端 payload 契约故障；学习者输入 `Lenox` 后，独立发现 Network Payload 为 `{ "name": 123 }`、HTTP 400、错误 JSON Response，并在未查看源码或 diff 前将最早异常定位为前端构造 payload，优先选择 `App.tsx` 约第 40 行检查。 | 真实 diff 仅让前端忽略输入并发送运行时数值 `123`；恢复后构建通过，`{ name: "Lenox" }` 回归 200，`{ name: 123 }` 保持 400。 |

## 已验证的结论

1. `rawName = request.body?.name` 读取的是实际属性值。`{ name: 123 }` 中该属性存在，所以 `rawName` 是 `123`，而不是 `undefined`。
2. `typeof rawName` 返回类型描述字符串；对数值 `123` 的结果是 `"number"`。
3. 当前后端的表达式 `typeof rawName === "string" ? rawName.trim() : ""` 在数值输入时会令局部 `name` 变成空字符串，因此触发显式的 HTTP 400 业务校验。
4. HTTP 400 表示后端已收到并处理请求后主动拒绝该输入；它不等于连接失败。
5. Request URL 表示请求目标。`http://localhost:5173`/`5174` 是 Vite 前端页面来源，`http://localhost:3000/api/hello` 是 Express 后端的具体 API 目标；端口不同意味着不同 Origin 与不同服务进程。

## 无提示复测结果与边界澄清

学习者在未查看源码或 `git diff` 的条件下，先给出正常请求预期，再根据页面、Network、Console/终端证据正确判断：非空输入没有按原值成为 Payload，异常最早发生在前端构造 payload 的阶段。主要根因和优先检查位置均正确。

复测中提出的“fetch 请求配置错误”是次要假设，但现有证据不支持它：请求已经以 `POST` 到达后端，后端返回了合法 JSON 的 HTTP 400，因此 URL、Method、连接、路由和 Response 解析均不是最早故障点。该辨析保留为 L09 的首轮训练内容。

这次页面能够显示 `name is required` 也证明：页面自己的 `sendName()` 收到合法 JSON 的 HTTP 400 后，仍可以更新 React State。直接在 Console 调用 `fetch()` 不会更新页面，是因为它没有经过 `sendName()`，不是因为 HTTP 400 阻止更新。

HTTP 4xx/5xx 本身通常不会使 `fetch()` 自动进入 `catch`；`catch` 还可能来自请求配置错误、连接失败、CORS 拒绝或 `response.json()` 解析非 JSON 内容。错误端口、404 与非 JSON 响应将在 L09 作为独立实作证据继续验证。

## 暂定评分

| 维度 | 暂定 | 依据 |
| --- | ---: | --- |
| 解释 | 2/2 | 无提示复测中正确解释输入值与实际 Payload 不一致，并定位前端构造 payload 为最早异常层。 |
| 证据 | 2/2 | 已使用 Network Payload/Status/Response、Console 输出、页面状态和既有后端恢复证据。 |
| 迁移 | 2/2 | 在未泄露具体根因的前端类型变式中，先观察输入与 Payload 的差异，再选择正确文件和位置定位。 |
| 验证与恢复 | 2/2 | 原字段失配故障已恢复，正常请求回到 HTTP 200；后续 Console 实验没有留下源文件改动。 |

## 当前结论与下一步

L08 已通过。原因是：字段名失配和类型变式均有实际证据；无提示复测中已在观察到 diff 前正确定位前端 payload 构造；故障已恢复，构建、正常输入和异常类型输入均完成回归。

下一课进入 L09。首轮实作依次使用单变量场景比较：请求配置在浏览器端失败、错误端口没有可用 Response、错误路径返回 404、响应体非 JSON 导致 `response.json()` 失败。每个场景都要同时记录 Network、Console、后端终端和页面是否更新。

## 恢复点

无提示复测期间只临时修改了前端 payload 构造的一行，现已恢复。后端读取字段最终仍是 `request.body?.name`；`npm.cmd run build` 已通过，正常 `POST /api/hello` 的 `{ name: "Lenox" }` 回归 HTTP 200，数值 `{ name: 123 }` 保持 HTTP 400。任何后续故障实验只撤销该实验自己的 diff，不覆盖现有工作区改动。
