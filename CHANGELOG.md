# Changelog

## Unreleased

### Changed

- 将 `Akira-TL/matt-skills` 从上游产品分发模型切换为 Akira 自主维护的 Matt 系列 Skill 仓；上游 `mattpocock/skills` 仅作为选择性参考来源。
- 移除 Claude plugin、marketplace、Changesets/npm 版本链、上游 release workflow、本地执行器 Skill 链接脚本与 aihero 专属发布约束。
- 正式运行时安装统一由 `akira` Router 从远端 `Akira-TL/matt-skills` GitHub source 执行。
- 清理不属于当前 Akira Matt 产品的上游实验/杂项 Skill：只在 `in-progress` 保留 `ask-akira`、`parallel-coordinator`、`parallel-execution`；移除上游 `misc` bucket 与其他实验能力。
- 移除上游 `aihero.dev` 文档导航和第三方 Skill package manager 安装语义；历史上游 issue、Git commit 与许可证引用继续作为来源证据保留。

## Historical provenance

本仓历史来源于 `mattpocock/skills`，既有上游演进、作者信息与发布历史仍可通过 Git history 追溯。当前 Changelog 从 Akira 独立维护阶段开始记录，不再复制上游 release log。
