## 它做什么

`ask-akira` 是 Akira Engineering 的 Primary Router。软件工程任务默认先由它确定 Execution Policy，再把具体专业方法交给 canonical Skill；它不复制 Matt 的需求澄清、Spec/Ticket、实现、TDD、代码审查或缺陷诊断正文。

## Execution Policy

- `standard`：默认策略。加载 `ask-matt`，由它解析 Matt 标准工程流。
- `rapid`：用户明确希望减少非必要流程成本以加快交付时使用。
- `emergency`：当前目标是恢复正在发生的故障、回归或事故并限制影响范围时使用。
- `competition`：比赛、hackathon、评审或演示截止时间决定优先级时使用。

普通紧迫措辞不会自动切换特殊模式；不确定时保持 `standard`。特殊模式默认只作用于当前任务，只有用户显式选择会话作用域时才持续到多个任务。

## 与 ask-matt 的关系

`ask-matt` 现在是 Standard Flow Router，不再是整个 Engineering 产品的总 Router。`ask-akira` 的 `standard` 分支加载它来判断 idea → clarification/spec/tickets → implementation/review，以及 bug、triage、wayfinder、prototype 和 phase boundary 等 Matt flow 关系。

Matt flow 到达实现或协调边界后，Execution Policy 仍归 `ask-akira`；`ask-matt` 不决定 rapid / emergency / competition，也不拥有正式 Parallel coordination。

## 专业 Skill 与调用边界

`ask-akira` 只路由。目标 Skill 允许模型调用时可以按需加载；目标是 user-invoked Skill 时只给出下一步，不能替用户启动。任何 required dependency 都必须实际加载 canonical Skill；缺失时 fail closed，并把机器级能力缺口交给 `akira` Router。

## Parallel

需要 Execution Map、Gate、可领取 Parallel Task、跨会话 Ownership、动态 frontier 或跨任务验收时，`ask-akira` 识别并推荐 user-invoked `parallel-coordinator`。Coordinator 负责正式协调，`parallel-execution` 负责 Worker lifecycle；实现仍复用 Matt 的 implement / tdd / code-review 契约。

## 它正常工作的标志

- 普通软件工程任务自动以 `standard` 进入，而不是要求用户先选择特殊模式。
- `standard` 的 Matt flow 来自实际加载的 `ask-matt`，不是 `ask-akira` 自己复制一张 flow map。
- 特殊模式只覆盖 Execution Policy；专业方法仍由各自 Skill 持有。
- Execution Policy、Parallel coordination 与 Matt standard flow 的 ownership 不重叠。
