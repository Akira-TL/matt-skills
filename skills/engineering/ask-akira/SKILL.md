---
name: ask-akira
description: 软件工程任务的 Akira Primary Router；默认进入 standard Matt flow，需要快速交付、事故恢复、竞赛冲刺或正式多 Agent 协作时选择相应执行策略，并按需路由到 canonical engineering Skills。
argument-hint: "[standard|rapid|emergency|competition] [scope=task|session]"
---

# Ask Akira

`ask-akira` 是 Akira Engineering 的 Primary Router。它拥有软件工程任务的入口、Execution Policy 与跨流程协调；Matt Skills 继续拥有需求澄清、Spec/Ticket、实现、TDD、代码审查、缺陷诊断、领域建模等专业方法。

## 1. 选择 Execution Policy

默认使用 `standard`。只有任务本身已经明确需要特殊执行权衡时才进入其他模式；单纯出现“快一点”“赶紧”“今天完成”等紧迫措辞，不足以改变模式。

- `standard`：使用 Matt 标准工程流，不额外裁剪 ceremony。
- `rapid`：用户明确要求以更少 ceremony 换取更快交付，同时仍保持可维护性。
- `emergency`：当前目标是恢复正在发生的故障、回归或事故，并优先限制 blast radius。
- `competition`：存在比赛、hackathon、评审或演示截止时间，需要围绕可演示关键路径取舍。

用户显式指定模式时以用户选择为准。无法确定特殊模式是否真的成立时保持 `standard`，不要靠语气猜测。

特殊模式的 `scope` 默认为 `task`；只有用户显式指定 `scope=session` 时才跨多个任务持续。`standard` 是普通工程默认，不需要额外模式状态。

## 2. Standard 路由

`standard` 必须加载 canonical `ask-matt`，把 Matt 标准工程流的判断交给它；`ask-akira` 不复制它的 flow map。

- `ask-matt` 只负责 Matt standard flow：idea → clarification/spec/tickets → implementation/review，以及 bug、triage、wayfinder、prototype、phase boundary 等 Matt 方法关系。
- `ask-matt` 返回当前 Matt flow 的下一跳或 execution boundary；Execution Policy、正式 Parallel 协作和 Akira 特殊模式仍由 `ask-akira` 拥有。
- 若目标是 user-invoked Skill，遵守其调用边界，只向用户给出下一步；若目标允许 model invocation，则按真实需要加载 canonical Skill。
- `ask-matt` 无法加载时，向 `akira` Router 报告能力缺口；不得从本文件或模型记忆重建 Matt flow。

## 3. 特殊模式按需加载

进入 `rapid`、`emergency` 或 `competition` 后，只读取对应 `<mode>/ROUTER.md`。Router 只决定下一跳；当前分支未要求的目录不预读。

模式目录中的内容是对 Matt 标准工程方法的 delta。没有 Akira 覆盖的专业能力继续使用其 canonical Matt Skill，不为了让模式目录完整而复制正文。

模式一旦建立，在作用域结束前保持不变。新的风险、难度或截止时间信息可以改变该模式内的优先级和验证强度，但不隐式切换模式。用户明确切换时保留已经确认的需求、事实、设计决定、代码状态和产物，只替换 Execution Policy。

## 4. 专业能力归属

Akira 负责路由，不接管专业方法。需要时按 canonical Skill 的真实触发条件加载，例如：

- `grilling` / `domain-modeling`：存在阻塞性的产品或领域决策。
- `prototype`：必须通过可运行逻辑或可见 UI 才能决定设计。
- `diagnosing-bugs`：需要建立 tight feedback loop、缩小复现并定位根因。
- `tdd`：存在可观察行为与独立 expected result，当前流程选择完整 TDD。
- `codebase-design`：测试 seam 或模块接口本身是设计问题。
- `code-review`：当前流程需要完整双轴审查。
- `research`、`resolving-merge-conflicts`、`wizard`：任务满足各自 canonical 触发条件。

任何依赖只有在其 canonical Skill 实际加载后才能声称已经执行；缺失的 required dependency 必须 fail closed。

## 5. Parallel 协作

Execution Policy 与 Parallel coordination 是正交层。需要 Execution Map、Gate、可领取 Parallel Task、跨会话 Ownership、动态 frontier 或跨任务验收时，正式协调入口是 user-invoked `parallel-coordinator`；`ask-akira` 可以识别并推荐它，但不能替用户启动。

进入 Parallel 后：

- 当前 Execution Policy 继续有效；
- Coordinator 拥有 Execution Map、Gate、Task 与跨任务验收；
- model-invoked `parallel-execution` 拥有 Worker claim、Ownership、生命周期与阶段汇报；
- 实际实现继续复用 Matt 的 implement / tdd / code-review 契约，不建立第二套工程方法。

仅有当前父 Agent 的短时只读并行或完全隔离的小任务时，使用当前 harness 已真实提供的并行能力即可；没有并行能力时保持串行，不伪造 Parallel 状态。

## 6. 风险与完成边界

Execution Policy 只改变流程成本、优先级和验证强度，不构成安全豁免。数据迁移、权限、安全、不可逆写入或广泛 blast radius 等风险只会提高验证强度。

- `standard` → 加载 `ask-matt`。
- `rapid` → 读取 [`rapid/ROUTER.md`](rapid/ROUTER.md)。
- `emergency` → 读取 [`emergency/ROUTER.md`](emergency/ROUTER.md)。
- `competition` → 读取 [`competition/ROUTER.md`](competition/ROUTER.md)。

特殊模式作用域结束后回到 `standard`；整个软件工程入口仍由 `ask-akira` 持有。
