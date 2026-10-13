# L12 学习进度｜组件如何协作

记录核对日期：2026-10-13

状态：真实 HTTP 页组件已拆分，2026-10-13 完成有提示的输入/回调/State/props 断点观察，现暂停学习；完整提交请求回归、重复状态故障诊断与正式验收待完成。不记录 L12 通过或阶段 2 完成，不编造四维分数。

## 已有代码与证据

- `9d215637c407bb0166980d90fbac0b4623ebfcfe`（用户时区 America/Los_Angeles：2026-10-04 08:48:15 PDT；原始提交时间 `2026-10-04T23:48:15+08:00`）：保存 Grid 与 React 组件观察页。提交正文记录父组件 `name` 经 props 传递、输入通过回调更新父组件、HTTP 页请求快照与响应来源的观察；记录前端构建通过、两个演示页在当时 5174 服务返回 HTTP 200。它是进度节点，当时尚未拆分真实 HTTP 页，不等于完整交互或正式验收通过。
- `93d1d74d481dc265fa54ff51bf80111bd2c580c0`（用户时区 America/Los_Angeles：2026-10-10 07:01:17 PDT；原始提交时间 `2026-10-10T22:01:17+08:00`）：仅修改 [frontend/src/App.tsx](../frontend/src/App.tsx)，拆出 `NameForm` 与 `ResultView`。提交正文明确记录前端类型检查/构建通过，同时说明提交后未重新做浏览器复测、L12 正式验收尚未通过。本记录引用历史结果，本次未重新运行构建或浏览器。
- 当前代码可核对：`App` 持有 `name`、请求/响应及展示状态；`NameForm` 接收 `name`、`isLoading` 和回调；`ResultView` 接收 `status`、`message`，负责结果展示。没有为子组件再建立一份姓名 State。

## 当前数据流

```text
输入事件 → NameForm.onNameChange → App.handleNameChange → App 的 name State
提交事件 → NameForm.onSubmit → App.sendName → 前端校验/请求快照 → fetch
HTTP Response → JSON 解析/错误分支 → App 更新展示 State → ResultView props → 页面
```

当前输入、已发送请求快照和后端响应各有来源，不能因字段相似就当作一份值；上述是源码与提交记录的核对，不能代替拆分后的真实页面/Network 观察。

## 本次断点观察（2026-10-13）

- 学习者在真实 HTTP 页的 Sources 中操作断点，AI 逐步指导；未修改源码。证据来自本次会话的用户截图与对实际值的确认，不将其记为无提示正式验收。
- 概念讲解涵盖：`useState` 获取的 State 与普通 `const payload` 局部变量不同；`name={currentName}` 的左侧是 props 属性名，右侧是父组件变量，二者不必同名；子组件参数 `{ name }` 按属性名读取值。JSX 描述组件使用，组件函数与返回的 JSX 需区分。这些内容已讲解，独立迁移理解仍待复测。
- 输入变化触发 `onChange`，提交触发 `onSubmit`，二者时机不同；学习者确认输入时即可暂停，无需按回车。新输入值是输入框的完整内容，而非仅新增的字符。
- 最初输入 `A`：`handleNameChange` 内观察到 `nextName = "A"`、旧 `name = ""`；新一轮 `App` 执行读取到 `name = "A"`，`NameForm` 也收到 `name = "A"`。
- `NameForm` 中调试器显示 `onNameChange = ƒ handleNameChange(nextName)`，以及 `onSubmit` 指向 `sendName`。这是函数引用，非返回结果。
- 将输入从 `A` 改成 `Ac`：停在输入回调时观察 `event.target.value = "Ac"`；单步进入 `handleNameChange`，截图显示参数 `nextName = "Ac"`；单步执行日志后，学习者确认 Console 打印了 `Ac`。
- 执行 `setName(nextName)` 后停在函数结尾，学习者确认当前事件处理函数读取的 `name` 仍为 `"A"`。继续到新一轮 `App` 的第 58 行，截图显示前一行 `useState` 已读取到 `name = "Ac"`；继续到 `NameForm`，学习者确认其接收的 `name = "Ac"`。
- 由上述证据核对：输入事件 → 子组件回调 → 父组件处理函数 → State 更新请求 → 新一轮父组件渲染 → props → 子组件。设置 State 不会重新赋值当前渲染中的旧 `name`。
- AI 已说明取消本次断点并恢复运行的方法；用户未单独确认全部断点已清除，不把清除状态记为已验证。断点属于浏览器调试状态，本次没有源码故障或源码恢复操作。

本轮验证仅覆盖输入链路与日志，没有提交表单、核对 Network、后端接口、等待/失败反馈，也没有重新运行构建。此前构建结果仍仅作为历史证据。

暂停后的续学入口：先简短回顾上述输入链路，再逐步观察 `onSubmit` 调用 `sendName`、请求快照及响应如何进入 `ResultView`；正式验收仍按下列先修与验证要求执行。

## 未完成的验证与正式验收

1. 按 [课表 v1.1](../COURSE_PLAN.md) 核对 L01–L07 的必要基础、L03-S01、L11 和 L11-S01；等价短测/跨课证据逐项映射，Git 不评分。
2. 在真实 HTTP 页重新验证非空输入成功、空白输入不发请求、等待及失败反馈；对照页面、Network、日志和组件 State，确认 props/回调保持原校验与请求行为。
3. 由 AI 在已授权本地范围设置可恢复的重复状态单点故障；用户先判断唯一可信状态来源，再用证据诊断。修复后做正常、空输入和受影响回归。
4. 用未提前透露根因的等价变式确认解释、证据、迁移、验证与恢复。当前无正式评分；证据齐全再记录通过。

当前导航：先补必要基础与 L11 新变式，再完成本课回归及正式验收；不要因代码已拆分、提交已存在或历史构建通过直接进入 L13。L11 的历史练习与限制见 [L11 记录](L11-html-css-dom-progress.md)。
