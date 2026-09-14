## 它做什么

`ask-matt` 是 Matt Standard Flow Router。它由 `ask-akira` 的 `standard` 分支按需加载，也允许用户直接询问 Matt 方法体系中的下一步。它负责 Matt flow map 与 phase boundary，不拥有 Akira 的 Execution Policy、特殊模式或正式 Parallel coordination。

它是其他 Matt Skill 的 secondary source：涉及某个 Skill 的触发条件、前置条件、副作用、输出契约或能否跳过时，必须实际加载该 Skill 的 canonical `SKILL.md` 再做关键判断。

## 标准主流程

Matt 标准工程流的主路径是：

1. 工作目录中的新想法通常从 `grill-with-docs` 澄清；没有工作目录时使用 `grill-me`。
2. 需要可运行代码或可见 UI 才能回答的设计问题，使用 `prototype` 形成可验证答案。
3. 多会话构建先进入 `to-spec`，再由 `to-tickets` 形成带 blocking edges 的实现 Ticket；小范围工作可以直接到达 `implement` 边界。
4. `implement` 根据真实 seam 条件按需加载 `tdd`，完成实现与验证后对 committed state 使用 `code-review`，普通 Ticket 只有在 Acceptance Criteria 闭环后才关闭。

`ask-matt` 到达实现边界后只返回 Matt flow 决策。普通执行、正式多 Agent 协作以及 rapid / emergency / competition 等 Execution Policy 由 `ask-akira` 决定。


## On-ramp

- 外部进入的 bug 或 feature request → `triage`。
- 难定位、间歇性或回归型故障 → `diagnosing-bugs`。
- 大到单次会话无法看清路径的工作 → `wayfinder`，先解析 decision tickets，再回到 `to-spec`。
- 代码库健康与结构改善 → `improve-codebase-architecture`；具体模块边界与 seam 设计使用 `codebase-design`。

## Phase boundary

阶段之间根据语义选择：继续当前上下文、Fresh context、Handoff artifact、Isolated worker 或 Summary transfer。具体命令与 Agent harness 机制只是执行适配，不属于 Matt 方法本身。

独立 `/implement` Ticket 通常依赖 Ticket、Source Spec 与 ADR 等 durable artifact，而不是继承上一张 Ticket 的全部会话推理。

## Standalone 与 vocabulary

`resolving-merge-conflicts`、`research`、`to-questionnaire`、`wizard`、`wait-what`、`teach` 等能力按各自 canonical 触发条件独立使用；`domain-modeling` 与 `codebase-design` 提供其他工程流共享的领域语言与模块设计 vocabulary。

Repository-stateful 流程需要 tracker / workflow / domain 配置且配置缺失时，按目标 Skill 的规则让用户显式运行 `setup-matt-pocock-skills`。TDD、debugging、codebase-design 等不依赖这些配置的独立方法不把 setup 当通用前置条件。

## 调用边界

`ask-matt` 允许模型或用户调用，但 Router 自身只返回下一跳：

- 目标是 model-invoked Skill 时，调用方可按真实需要继续加载 canonical Skill。
- 目标是 user-invoked Skill 时，只向用户给出明确下一步，不替用户启动。
- Skill 真正不可用时报告 capability gap，不从 Router 摘要或模型记忆重建其方法。

普通软件工程入口由 `ask-akira` 持有。用户若只想询问 Matt 标准方法体系，也可以直接调用 `ask-matt`。

## 它正常工作的标志

- 它只解释 Matt standard flow，不重新决定 Akira Execution Policy。
- 关键推荐会实际核对目标 Skill 的 canonical `SKILL.md`。
- flow 到达实现或协调边界后把边界返回给 `ask-akira`。
- 它不会因为自己是 Router 就绕过 user-invoked Skill 的显式调用要求。
