---
task_schema: plan-tasks-tracker/v3
plan_schema: rumelt-task-plan/v2
task_slug: full-stack-course-growth
plan_id: PT-full-stack-growth
plan_version: 1
plan_status: APPROVED
approved_by: user
approved_steps: S-01,S-02,S-03,S-04
approved_scope: A-01,A-02,A-03,A-04
approved_plan_digest: sha256:025c46527b78a396d85d3b3336ba6d2ebfff58f3f2d5bc60b0154b772c580094
routing_mode: auto
selected_modules: M-01,M-02,M-03,M-04,M-07,M-08
execution_status: IN_PROGRESS
created_at: 2026-09-08
updated_at: 2026-09-08
---

## 任务目标与批准快照

- 目标：交付一份可逐课执行、以证据验收的全栈软件工程师成长课程安排，并保留后续课程学习的依赖与恢复边界。
- 主要诊断：如果学习者只复现 AI 的成功操作，就可能无法在陌生故障中识别数据停在哪一层；增加功能不会自动形成可迁移的工程判断。
- 指导方针：沿一个项目逐层增加主要复杂性；每课经过解释、证据、迁移、验证与恢复四项验收后推进；AI 修改代码，学习者审查 diff 并先做判断。
- 近端目标：完成课程文档交付、结构校验与 Git 提交；后续课程从入门短测和 L08 字段契约实验开始。
- 主动不做：不在本轮执行 48 节课程、不安装依赖、不修改业务代码、不发布、不使用真实数据或外部写入。
- 批准依据：用户已批准 PT-full-stack-growth v1 全部步骤，并明确要求检查无误后提交 Git。
- 路由快照：routing_mode=auto；风险等级=标准；不可逆性=可逆；课程主链按先修顺序串行推进。
- 已选模块：M-01,M-02,M-03,M-04,M-07,M-08。
- 用户步骤映射：S-01 -> A-01; S-02 -> A-02; S-03 -> A-03; S-04 -> A-04

## 变更范围

- 涉及模块或目录：COURSE_PLAN.md、docs/full-stack-course-design-plan.md、TASK/pending/full-stack-course-growth/、TASK/in-progress/full-stack-course-growth/、TASK/completed/full-stack-course-growth/。
- 预计影响文件数：4 个交付文档文件（课程课表、批准方案、PLAN.md、TASK.md）；Git 提交记录另计。
- 允许的工具与权限：在当前项目目录读取和写入 Markdown；使用 apply_patch、本地 Python 计划校验器、Git status/diff/add/commit。
- 禁止或需另行批准：依赖安装、应用代码修改、数据库与真实数据、外部发送、部署发布、破坏性 Git 操作；未来课程实验按每课授权。

## 行动执行契约

| action_id | input | output | dependencies | permissions | acceptance | failure_response |
| --- | --- | --- | --- | --- | --- | --- |
| A-01 | 当前项目、会话与 L01–L07 | 有证据的入门测评记录 | none | 获准当前本地课程的读取与观察 | 能定位入口并解释一次输入到响应；不把接触标为通过 | 暂缓依赖课程，按失分维度补语言或观察工具 |
| A-02 | A-01 通过记录与共同主线 | 48 课逐课产物与九个阶段交付 | A-01 | 分课授权的本地实验；外部发布另行确认 | 每课四维全过；功能、失败和恢复均有证据 | 停在最近失败的先修关卡，恢复实验后做等价补测 |
| A-03 | A-02 的阶段产物、未展示的变式 | 诊断记录、复测和毕业项目证据 | A-02 | 当前练习环境和学习记录 | 陌生需求与故障仍可判断、验证、复述；不是 AI 代答 | 撤销受影响知识的通过状态，回到原课变式验证 |
| A-04 | 共同主线通过记录、兴趣与项目需求 | 一个方向三课的递进作品 | A-03 | 新方向当前课程的本地范围 | 达到对应分支逐课及综合验收；能说明复杂性成本 | 回补该分支列出的先修项，删减没有需求支撑的技术 |

## 任务明细

- [ ] T-01 | A-01 | 按当前项目与既有会话核对学习起点并执行入门短测 | output: 有记录的入门测评与需要补课的维度 | acceptance: 能定位入口并解释一次输入到响应，且已接触内容没有被直接标为掌握
- [ ] T-02 | A-02 | 按课程先修顺序开展共同主线并保存阶段产物 | output: 48 节课程记录与九个阶段交付证据 | acceptance: 每节课的解释、证据、迁移、验证与恢复四项均通过，且未绕过先修关卡
- [ ] T-03 | A-03 | 用未提前透露根因的变式题和毕业项目复测迁移能力 | output: 诊断记录、复测结果与毕业证据包 | acceptance: 陌生需求和故障能由学习者先判断、取证、验证与复述，不能由 AI 代答充数
- [ ] T-04 | A-04 | 在共同主线通过后选择一个方向并完成三课递进作品 | output: 一个方向的三课作品与取舍记录 | acceptance: 方向课程及综合关卡通过，并能解释新增复杂性的收益与维护成本

## 发现与变更记录

- 2026-09-08 | 用户批准 PT-full-stack-growth v1，并授权课程文档交付、验证与 Git 提交；后续课程学习尚未开始。
- 2026-09-08 | state: PENDING -> IN_PROGRESS | reason: 开始或恢复执行

## 完成标准

- COURSE_PLAN.md 包含共同主线、阶段关卡、逐课字段、进阶方向、评分规则、记录模板和下一次学习入口。
- 课程设计方案包含完整的诊断、取舍、行动接口、依赖、失败处理和步骤映射，并通过计划校验器。
- 文档中的本地链接、课程编号、阶段数量和每课必需字段通过结构检查。
- Git 工作区只包含本轮课程文档与任务包变更，提交信息清楚，提交后状态可核对。
- 后续课程未被本轮文档提交伪装为已学习或已验收。
