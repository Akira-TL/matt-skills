# Akira Matt Skills

本仓库维护 Akira 自己的 Matt 系列工程 Skills。现有能力起源于 `mattpocock/skills`，但当前 canonical product 是 `Akira-TL/matt-skills`；上游只作为选择性参考来源。

## Language

**Issue tracker**：承载项目 Issue 的系统，例如 GitHub Issues、GitLab Issues 或项目内本地 Markdown 约定。

**Issue**：Issue tracker 中一个可跟踪的工作单元，可以是缺陷、任务、Spec 或由 `to-tickets` 产生的实现切片。

**Decision ticket**：`wayfinder` 使用的一类 Issue，用于记录需要解决的决策问题，而不是直接表示实现交付物。

**Triage role**：Issue 在 triage 流程中的状态角色；实际标签字符串由项目自己的 issue-tracker 配置映射。

## Relationships

- 一个 Issue tracker 包含多个 Issue。
- 一个 Issue 在 triage 流程中具有一个当前 Triage role。
- Decision ticket 是一种 Issue。
- `ask-matt` 负责在 Matt 系列能力之间进行顶层路由。
- `ask-akira` 与 Parallel 系列是 Akira 对 Matt 工程流的扩展，不构成第二套独立工程体系。

## Maintenance boundary

- 本仓不继承上游的 plugin、marketplace、npm release 或网站发布体系。
- 上游方法和实现只有在当前 Akira 工程流需要时才选择性吸收。
- 历史上游 Skill 名称与正文可以作为当前重写基线保留；后续按实际设计逐项替换，不因为仓库所有权改变而一次性机械重命名。
