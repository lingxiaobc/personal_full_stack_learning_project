---
task_schema: plan-tasks-tracker/v3
plan_schema: rumelt-task-plan/v2
task_slug: frontend-validation-bypass
plan_id: PT-frontend-validation-bypass
plan_version: 1
plan_status: APPROVED
approved_by: user
approved_steps: S-01,S-02,S-03,S-04,S-05
approved_scope: A-01,A-02,A-03,A-04,A-05
approved_plan_digest: sha256:87d4db8a882d9ed5f0f014f578dfbbd7c5e4989ab8513ce8ea45aaad12961391
routing_mode: auto
selected_modules: M-01,M-03,M-04,M-07,M-08,M-09
execution_status: COMPLETED
created_at: 2026-09-08
updated_at: 2026-09-08
---
# 任务跟踪：前端校验可绕过实验

## 任务目标与批准快照

- 目标：在本机前后端数据流实验中，对照前端校验、临时无后端校验和恢复后端校验三种状态，证明前端校验不能替代后端校验。
- 主要诊断：D-01；前端校验只能控制页面路径，调用方可以跳过页面直接访问 API，因此服务端必须独立校验输入。
- 指导方针：G-01；每阶段只改变一个关键变量，固定请求输入，临时不安全状态只在 localhost 存在并最终恢复。
- 近端目标：O-01；同一空姓名请求在页面路径被拦截、在临时无校验后端得到 200、在恢复后端校验后得到 400。
- 主动不做：NG-01、NG-02；不访问外部地址、不使用真实敏感数据、不扩展到认证/权限/数据库，也不把前端限制当作安全结论。
- 批准依据：用户已明确回复“批准并全部执行”，批准当前计划 v1 的五个可见步骤及其全部五个行动。
- 路由快照：routing_mode=auto；风险等级为标准；不可逆性为可逆；串行依赖为 A-01 -> A-02 -> A-03 -> A-04 -> A-05。
- 已选模块：M-01,M-03,M-04,M-07,M-08,M-09。
- 用户步骤映射：S-01 -> A-01; S-02 -> A-02; S-03 -> A-03; S-04 -> A-04; S-05 -> A-05

## 变更范围

- 涉及模块或目录：`frontend/src/App.tsx`、`backend/src/server.ts`、`TASK/pending/frontend-validation-bypass/` 任务记录；观察范围为当前项目的 localhost 服务。
- 预计影响文件数：目标代码文件 2 个；任务包文件 2 个；不修改依赖、锁文件、构建产物或外部系统。
- 允许的工具与权限：在当前工作区使用 `apply_patch` 修改目标源文件，使用 PowerShell、项目构建命令、localhost HTTP 请求和浏览器开发者工具进行验证；允许执行任务包状态迁移脚本。
- 禁止或需另行批准：访问外部 URL、部署、发送外部消息、使用真实秘密或数据、修改认证/权限/数据库、删除用户文件、扩大到未批准的源文件或接口。

## 行动执行契约

| action_id | input | output | dependencies | permissions | acceptance | failure_response |
| --- | --- | --- | --- | --- | --- | --- |
| A-01 | 当前 `frontend/src/App.tsx`、`backend/src/server.ts`、运行中的 localhost 服务和一条正常/空姓名请求 | 基线观察记录：正常姓名返回 200，空姓名返回 400，并标明 Console、Network、后端终端现象 | none | 只读项目文件、开发者工具和 localhost 请求 | 在修改代码前确认正常请求为 200、空姓名请求为 400，且空姓名请求确实进入后端并产生 400 响应 | 若状态码、端口或日志不符合预期，停止后续修改，先检查当前运行进程、API 地址、CORS 和后端校验代码 |
| A-02 | A-01 的基线和 `frontend/src/App.tsx` 当前提交处理函数 | 前端在 `fetch` 之前拦截空姓名并显示错误，正常姓名路径保持可发送 | A-01 | 修改工作区内前端文件并运行前端/全栈构建 | 空姓名通过页面提交时页面显示前端错误且 Network 没有 `POST /api/hello`；正常姓名仍能发送并成功显示响应；构建通过 | 停止在 A-02，检查 `onSubmit` 的早退位置和状态更新；只撤回 A-02 的局部改动，恢复 A-01 基线后再继续 |
| A-03 | A-02 完成后的 `backend/src/server.ts` 和已保留的前端校验 | 实验期间后端对空姓名不再返回 400，但前端页面仍会阻止空姓名 | A-02 | 修改工作区内后端文件并运行后端构建或热重载检查 | 后端源代码暂时不含空姓名拒绝分支，服务可启动；页面路径仍被 A-02 的前端校验拦截 | 立即恢复后端校验到 A-01 的已知安全版本并暂停，不能带着不确定的后端状态进入直接请求阶段 |
| A-04 | A-03 的临时后端状态、当前浏览器页面和固定 payload `{ name: "" }` | 直接请求的 Console/Network/后端终端记录，证明请求跳过页面校验后在无后端校验时得到 200 | A-03 | 仅在当前浏览器上下文或 localhost 终端发送请求 | 不点击页面按钮，直接向 `http://localhost:3000/api/hello` 发送空姓名；服务返回 200，后端日志显示收到该请求体，且页面路径本身仍未发送空姓名 POST | 若请求没有到达，先检查端口、CORS、服务重载和请求体；若后端仍返回 400，回到 A-03 检查校验是否真的移除；不扩大请求范围 |
| A-05 | A-04 的观察记录和 A-03 的临时后端代码 | 恢复后的安全后端代码以及回归证据：直接空姓名为 400，正常姓名为 200，前端空姓名仍被拦截，构建通过 | A-04 | 修改工作区内后端文件并运行构建、localhost 请求和必要的浏览器观察 | `backend/src/server.ts` 恢复空姓名校验；同一个 Console 请求返回 400；正常请求仍返回 200；前后端构建通过 | 先恢复到 A-01 的后端校验版本并停止；检查 diff、编译输出和终端日志，未满足全部条件不得标记实验完成 |

## 任务明细

- [x] T-01 | A-01 | 记录正常姓名和空姓名请求的前端、Network、后端基线 | output: A-01 基线记录，包含两个状态码、请求体和后端日志观察 | acceptance: 修改代码前正常请求为 200，空姓名请求为 400，且两次请求均能定位到 `/api/hello`
- [x] T-02 | A-02 | 在 `frontend/src/App.tsx` 的提交处理函数中加入空姓名早退校验并验证正常路径 | output: 前端源文件中的 `trim` 校验和前端错误状态更新 | acceptance: 页面空姓名提交无 `POST /api/hello`，正常姓名提交仍返回成功，`npm run build` 返回 0
- [x] T-03 | A-03 | 在 `backend/src/server.ts` 中临时移除空姓名拒绝分支并确认服务重新加载 | output: 实验期间的后端无校验代码状态 | acceptance: 后端可启动且源文件没有空姓名 400 分支，前端页面仍由 T-02 拦截空姓名
- [x] T-04 | A-04 | 使用固定空姓名 payload 直接请求 localhost API 并记录绕过页面后的响应 | output: Console/Network/后端终端的直接请求记录 | acceptance: 不经过页面按钮时无校验后端对 `{ name: "" }` 返回 200，并在后端日志中看到该请求体
- [x] T-05 | A-05 | 恢复 `backend/src/server.ts` 的空姓名校验并执行完整回归检查 | output: 恢复后的安全后端源文件、状态码对照和前后端构建结果 | acceptance: 同一直接空请求返回 400，正常请求返回 200，页面空请求不发 POST，`npm run build` 返回 0

## 发现与变更记录

- 2026-09-08 | 创建 pending 任务包并绑定已批准方案；目标代码尚未因本任务包发生修改。
- 2026-09-08 | T-01 | evidence: type=manual; locator=Chrome tab HTTP 数据流实验 at http://localhost:5173/ after normal and empty form submissions on 2026-09-08; result=页面普通姓名显示 HTTP 200 和欢迎 JSON，空姓名显示 HTTP 400、error=name is required，前端 Console 记录了两次 Request/Response 链路。
- 2026-09-08 | T-01 | evidence: type=command; locator=Invoke-WebRequest POST http://localhost:3000/api/hello with JSON bodies {"name":"基线命令"} and {"name":""}; result=正常请求 Status 200，响应包含 receivedName=基线命令；空姓名请求 Status 400，响应包含 error=name is required 和 received.name 为空。
- 2026-09-08 | T-02 | evidence: type=file; locator=P:\codex_project\full_stack_try\frontend\src\App.tsx lines 26-35; result=提交处理函数在构造 payload 和调用 fetch 之前检查 name.trim()，空姓名更新前端错误状态并 return。
- 2026-09-08 | T-02 | evidence: type=manual; locator=Chrome tab HTTP 数据流实验 at http://localhost:5173/ after empty and normal submissions on 2026-09-08; result=空姓名页面显示前端校验错误，页面 Request/Response 显示尚未发送/收到，正常姓名显示 HTTP 200 和欢迎 JSON。
- 2026-09-08 | T-02 | evidence: type=test; locator=CDP Network.requestWillBeSent and Network.responseReceived events after empty form click on http://localhost:5173/; result=提交后的事件列表为空，未产生 POST /api/hello；前端 Console 新增 [前端校验] 阻止请求日志。
- 2026-09-08 | T-02 | evidence: type=command; locator=npm.cmd run build; result=frontend tsc --noEmit 和 vite build 成功，backend tsc 成功，命令退出码为 0。
- 2026-09-08 | T-03 | evidence: type=file; locator=P:\codex_project\full_stack_try\backend\src\server.ts lines 27-44; result=空姓名 400 分支已临时移除，仅保留带实验说明的 successResponse，源文件不再包含 if (!name) 拒绝分支。
- 2026-09-08 | T-03 | evidence: type=command; locator=npm.cmd run build --workspace backend; result=student-data-flow-backend tsc 完成，命令退出码为 0。
- 2026-09-08 | T-03 | evidence: type=manual; locator=backend dev terminal output after tsx watch detected server.ts change on 2026-09-08; result=终端显示 [tsx] change in ./src\\server.ts Restarting、Backend running at http://localhost:3000，说明无校验代码已重新加载。
- 2026-09-08 | T-04 | evidence: type=test; locator=Chrome CDP Runtime.evaluate fetch POST http://localhost:3000/api/hello with body {"name":""}; result=浏览器上下文直接请求返回 status 200、ok true，body 为 message=你好， 和 receivedName=空字符串。
- 2026-09-08 | T-04 | evidence: type=test; locator=Chrome CDP Network.requestWillBeSent and Network.responseReceived after direct fetch; result=Network 记录 POST /api/hello 的 postData={"name":""}，OPTIONS 返回 204，POST 返回 200。
- 2026-09-08 | T-04 | evidence: type=manual; locator=backend dev terminal output after direct fetch on 2026-09-08; result=后端终端显示收到请求 POST /api/hello、req.body 为 { name: '' }，并返回 message=你好，、receivedName=空字符串。
- 2026-09-08 | T-05 | evidence: type=file; locator=P:\codex_project\full_stack_try\backend\src\server.ts lines 34-49; result=恢复后源文件重新包含 if (!name) 分支、name is required 错误体、HTTP 400 和 return。
- 2026-09-08 | T-05 | evidence: type=test; locator=Chrome CDP Runtime.evaluate fetch POST http://localhost:3000/api/hello with body {"name":""} after restoration; result=同一直接请求返回 status 400、ok false，body 为 error=name is required 且 received.name 为空。
- 2026-09-08 | T-05 | evidence: type=test; locator=Chrome CDP Network events after restored direct fetch and final empty form click; result=恢复后直接 POST 的 response status 为 400，最终页面空输入点击产生 0 个 Network 请求事件。
- 2026-09-08 | T-05 | evidence: type=manual; locator=Chrome tab HTTP 数据流实验 at http://localhost:5173/ after restored normal and empty submissions on 2026-09-08; result=正常姓名显示 HTTP 200 和欢迎 JSON，空姓名显示前端校验错误且页面 Request/Response 被清空。
- 2026-09-08 | T-05 | evidence: type=command; locator=npm.cmd run build; result=frontend tsc --noEmit、vite build 和 backend tsc 全部成功，命令退出码为 0。
- 2026-09-08 | state: PENDING -> IN_PROGRESS | reason: 开始或恢复执行
- 2026-09-08 | state: IN_PROGRESS -> COMPLETED | reason: 全部验收通过

## 完成标准

- 五个任务 T-01 至 T-05 全部勾选，并且每个任务在本节上方的变更记录中有同 ID 的结构化证据。
- `frontend/src/App.tsx` 在 `fetch` 前拦截空姓名，`backend/src/server.ts` 最终保留空姓名 400 校验。
- 同一 `{ "name": "" }` 直接请求在临时无校验阶段为 200、恢复阶段为 400；正常姓名请求最终为 200。
- 前端和后端构建均返回 0，最终 diff 只保留获批范围内的教学改动和任务记录。
- A-01 | evidence: type=manual; locator=Chrome form baseline and Invoke-WebRequest results on 2026-09-08; result=正常页面请求为 200，空姓名页面请求为 400，前端和后端观察记录完整。
- A-02 | evidence: type=test; locator=Chrome CDP Network events after empty form click and frontend build on 2026-09-08; result=空姓名页面提交没有 POST /api/hello，正常姓名仍为 200，构建退出码为 0。
- A-03 | evidence: type=file; locator=P:\codex_project\full_stack_try\backend\src\server.ts and backend build output on 2026-09-08; result=空姓名拒绝分支在实验期间移除，tsx watch 重新加载，backend tsc 退出码为 0。
- A-04 | evidence: type=test; locator=Chrome CDP Runtime.evaluate and Network events for direct localhost fetch on 2026-09-08; result=固定 {"name":""} 直接请求在无校验阶段返回 200，Network 显示 POST payload，后端终端显示收到并返回空姓名成功体。
- A-05 | evidence: type=test; locator=Chrome CDP restored fetch, final UI Network capture, and npm.cmd run build on 2026-09-08; result=恢复后直接空请求为 400，正常页面请求为 200，最终页面空提交无 POST，前后端构建退出码为 0。
- overall | evidence: type=test; locator=PowerShell project verification and Chrome local browser observations on 2026-09-08; result=五阶段顺序执行完成，后端最终保留服务端校验，前端页面校验与直接 API 回归结果符合批准方案。
