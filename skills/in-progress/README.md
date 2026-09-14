# In Progress

本目录只保留 Akira 正在维护、但尚未提升为稳定能力的 Matt 工程扩展。它们不因位于本仓就自动进入普通稳定安装集；需要时由 `akira` Router 显式选择。

当前能力：

- **[ask-akira](./ask-akira/SKILL.md)** — Matt 执行策略扩展；显式切换 rapid、emergency 或 competition 模式，不重写 Matt 的专业能力。User-invoked.
- **[parallel-coordinator](./parallel-coordinator/SKILL.md)** — 在 Matt Ticket / Spec 或 Akira mode Work State 之上建立 Execution Map、Gate 与 Parallel Tasks，并负责跨任务验收。User-invoked.
- **[parallel-execution](./parallel-execution/SKILL.md)** — Worker 侧的 Parallel Task claim、Ownership、生命周期与阶段汇报协议；实际实现继续复用 Matt implement / tdd / code-review。Model-invoked.

需要单独安装其中一个实验能力时，仍使用 `akira` Router 自带安装器从远端 `Akira-TL/matt-skills` source 注册，不使用第三方 Skill package manager 或本地 checkout 链接。
