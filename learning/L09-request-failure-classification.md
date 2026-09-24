# L09 学习记录｜把“请求失败”拆成不同原因

日期：2026-09-25
状态：已通过（2026-09-25）；暂停消化，L10 待开始
关联课程：阶段 1 · L09；L08 字段契约记录见 [L08 学习记录](L08-api-contract.md)。

## 本课核心主线

一次请求可能在不同边界失败，不能把所有红色报错都叫作“后端没连上”：

```text
前端校验 → fetch 请求构造/发送 → 收到 HTTP Response → 解析 Response Body → 更新 React State
```

- 前端校验提前返回：没有这次 HTTP 请求；但若代码调用了 `console.log`，浏览器 Console 仍会有本地校验日志。
- `fetch` 因请求配置、连接或 CORS 等原因失败：没有可用的 HTTP Response；如果在 `try` 中 `await fetch()`，会进入对应的 `catch`。
- HTTP 400/404 等：服务器已返回 Response。`fetch` 通常不会仅因状态码是 4xx/5xx 而拒绝 Promise；要检查 `response.status` / `response.ok`。
- Response Body 解析失败：已经收到 Response，但解析步骤（如 `response.json()`）抛错，也会进入 `catch`。
- `response.json()` 与 `response.text()` 是不同的读取方式；应与后端实际返回的正文格式匹配。Request 的 `Content-Type` 和 Response 的 `Content-Type` 分属请求、响应两端。

## 用户的理解与本轮复述

用户能够说明：网页组件的空输入会被前端校验拦截；在浏览器 Console 直接发请求会绕过 React 表单校验；后端仍可对直接请求进行自己的校验；错误端口且无服务时不会得到 404 Response；正确端口上的错误路径会由服务器返回 404；响应体需要使用匹配的方式读取。

在提示后，用户还正确预测：若收到 404 且正文是合法 JSON，Response 可以被拿到、JSON 可以解析；`response.ok` 为 `false`，应由 HTTP 错误分支处理，而不是仅因为 404 自动进入 `catch`。这是预测记录，尚未单独实测该变式。

本轮页面集成复测已经覆盖：错端口导致无可用 Response、CORS 预检通过、200 文本响应解析失败、200 JSON 正常响应，以及 400 JSON 错误响应。用户能够根据页面、Network、Console 和后端终端把同一请求在各层的状态对应起来。

无提示短测：面对 HTTP 200、合法 JSON、但响应缺少前端需要字段的场景，用户定位到响应契约/后端响应结构边界，排除了请求、连接、路由和 JSON 解析问题，说明了 `response.ok === true` 不代表数据结构正确，并提出对照前后端字段后做最小修复。L09 正式验收通过。

## 实验观察与证据

| 场景 | 实际观察 | 结论 / 边界 |
| --- | --- | --- |
| 浏览器拒绝 `GET` 携带 Body | Console 中的 Fetch 调用报 `TypeError`；浏览器在发送 HTTP 请求前拒绝配置，未得到 HTTP Response。 | 如果代码捕获该 Promise 拒绝，会进入 `catch`；这不是后端返回的 HTTP 状态码。 |
| 错误端口 `3001`，该端口没有实验后端 | Network 显示对 `http://localhost:3001/api/hello` 的失败尝试；前端得到 `Failed to fetch`，没有可用的 HTTP 状态码或响应体。 | 监听 `3000` 的后端不会因此收到请求；失败记录不等于 HTTP 404。浏览器 Network 中失败条目的 Method 仍应按实际记录判断，不能仅凭 URL 推断。 |
| 正确端口 `3000`、错误路径 `/api/not-found` | Network 显示 `POST`、HTTP 404；Response `Content-Type` 是 `text/html`。Console 先打印 `status: 404`，再因 HTML 不能解析为 JSON 而记录 `SyntaxError` 并进入 `catch`。 | 服务器收到了请求并返回 404。`/api/hello` 的自定义日志在该路由处理函数内部；错误路径不匹配时看不到这条日志，不代表服务器没收到。 |
| 文本实验路由 `/api/hello-text` + `response.json()` | Network 显示 `POST`、HTTP 200，Response `Content-Type: text/plain; charset=utf-8`，正文 `OK`；Request `Content-Type` 是 `application/json`。Console 显示 `ok: true`，随后 `response.json()` 解析失败并进入 `catch`。 | HTTP 通信成功；错误发生在 Response Body 解析，不是请求头或连接失败。 |
| 同一文本响应改用 `response.text()` | Console 打印 `OK`，未进入该片段的 `catch`；页面卡片未变化。 | Console 代码没有调用 React 组件的 State 更新函数；Network Response 标签仍可显示正文，但不等于页面 UI 更新。 |
| 前端表单空输入 vs Console 直接请求 | 用户理解了两条路径的边界：表单校验发生在 `fetch` 前；Console 直接 `fetch` 不会调用 `sendName()` 的校验。 | 直接请求 `{ name: "" }` 到正确的 `POST /api/hello` 应由后端校验；这一项在本轮属于推理，未作为新的浏览器实测证据记录。 |
| 页面请求 `3001` 且无服务 | 页面 Console 显示 `net::ERR_CONNECTION_REFUSED` 和外层 fetch 错误；Network 没有可用 HTTP 状态码或响应体；页面显示“没有收到 HTTP 响应”；后端 `3000` 没有收到 POST。 | 页面集成验证了“无 HTTP Response”分支；前端页面中的 Request Payload 只是准备发送的数据，不证明后端收到。 |
| 页面请求 `3000/api/hello-text` | 先看到 `OPTIONS` 预检 `204`，再看到 `POST` `200`；请求 `Content-Type` 是 `application/json`，响应 `Content-Type` 是 `text/plain; charset=utf-8`，正文是 `OK`；页面进入 JSON 解析失败提示。 | CORS 通过不等于响应格式匹配；Request 和 Response 各自有独立的 `Content-Type`。 |
| 页面恢复 `POST /api/hello` 正常 JSON | Network 显示 `POST` `200` 和 `application/json; charset=utf-8`；Console 依次出现收到 Response、解析 Body、成功更新页面；页面显示“你好，lenox”；后端打印 `req.body` 和成功响应。 | 错误分类改动没有破坏原来的成功路径，完成了页面正常回归。 |
| 页面发送 `{ userName: "lenox" }` 到 `/api/hello` | 后端收到请求并返回 `400` JSON；前端出现 `[前端 3]`、`[前端 4]`、错误响应分支，不进入 `catch`；页面显示 `name is required`。 | HTTP 400 仍然有 Response；JSON 解析成功与 HTTP 业务成功是两件事。 |
| L09 无提示短测：HTTP 200 + 合法 JSON，但响应字段不符合前端预期 | 用户判断请求、连接、路由和 JSON 解析均正常，异常在响应契约/业务字段使用边界；说明不一定进入 `catch`，并提出检查后端响应结构与前端期待字段。 | 通过了从证据到根因、最小修复方向和回归要求的独立诊断。 |

## 代码变更与数据流影响

- [backend/src/server.ts](../backend/src/server.ts)：新增独立的 `POST /api/hello-text` 学习路由。它记录 Request `Content-Type` 和 `req.body`，然后返回 HTTP 200、`text/plain`、正文 `OK`；原有 `/api/hello` 行为不变。
- [frontend/src/App.tsx](../frontend/src/App.tsx)：把 `fetch` 失败和 `response.json()` 解析失败分开处理；收到 Response 后先记录状态码。无 Response 时提示检查接口地址、端口或请求配置；已收到 Response 但 JSON 解析失败时，提示状态码和响应 `Content-Type`。
- `API_URL` 已恢复为 `http://localhost:3000/api/hello`；临时的 `/api/hello-text` 和字段失配实验均已恢复前端正常请求。
- [backend/src/server.ts](../backend/src/server.ts)：为 `127.0.0.1:5173/5174` 增加精确 CORS allow list，并保留文本响应实验路由。
- `frontend/vite.config.ts` 的 host/port 配置属于此前端口与浏览器访问实验，本次作为本地运行环境的相关配置保留；是否纳入提交按 Git 暂存检查单独确认。

## 自动验证与未覆盖项

已完成：

- `npm run build --workspace backend`：通过。
- 使用本机 HTTP 请求调用 `POST /api/hello-text`：得到状态 200、`text/plain; charset=utf-8` 和正文 `OK`。
- `npm run build --workspace frontend`：TypeScript 检查与 Vite 构建通过。
- `git diff --check`：通过；仅有 Git 关于 LF/CRLF 的环境提示。

补充说明：

- L09 的页面、Network、Console、后端终端和无提示诊断证据已经齐全。
- 响应契约缺失字段的实际代码修复不在本次 L09 运行态实验中；它将作为后续 L10 陌生故障或响应契约专题的练习素材。

## 暂定掌握情况

本轮前面的代码实验有讲解和提示，但最终无提示短测完成了响应契约变式的独立诊断；页面正常/失败/解析异常路径也已完成恢复回归。

正式评分：解释 2/2，证据 2/2，迁移 2/2，验证与恢复 2/2。依据是用户能结合页面、Network、Console 和后端终端复述数据流，独立排除无关层级并指出响应结构边界，且已有正常路径和故障路径的恢复证据。

## 下一步

1. 暂停消化 L09 的请求生命周期和错误分类。
2. 下一次开始 L10：面对未提前透露根因的陌生故障，由用户主持完整证据链、最小修复和回归。
3. 响应契约缺失字段可以作为 L10 的候选故障，但 L10 不等于单独讲解响应契约。
