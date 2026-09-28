# Akira Matt Skills

`Akira-TL/matt-skills` 是 Akira 自己维护的工程 Skill 产品仓。它以 Matt 系列工程方法为基础，继续维护需求澄清、Spec/Ticket、实现、TDD、代码审查、缺陷诊断、架构改进等工作流，并承载 `ask-akira`、`parallel-coordinator`、`parallel-execution` 等 Akira 工程扩展。

本仓历史来源于 `mattpocock/skills`，相关许可证与 Git 历史继续保留；当前产品方向、发布方式和维护决策由 Akira 自己负责。上游只作为参考来源，后续只选择性吸收确有价值的变化，不再整体同步上游产品结构。

## 结构

```text
skills/
├── engineering/     # 稳定工程 Skills
├── productivity/    # 与工程流协作的通用 Skills
├── in-progress/     # 尚未稳定的 Parallel 扩展
└── deprecated/      # 弃用与迁移说明
docs/                # 稳定 Skill 的人类说明
scripts/list-skills.sh
```

`ask-akira` 是软件工程 Primary Router：普通任务默认进入 `standard`，由 `ask-matt` 继续解析 Matt 标准工程流；`rapid`、`emergency`、`competition` 与正式 Parallel 协作的 Execution Policy 由 `ask-akira` 持有。具体需求澄清、Spec/Ticket、实现、TDD、代码审查、缺陷诊断等方法继续由各自 canonical Skill 持有。

## 安装

Matt Engineering 是项目级专业工作流。运行时由 `akira` Router 从远端 `Akira-TL/matt-skills` 选择入口 Package，并从目标软件项目根目录通过 Skiloom 安装到 `workspace` Target；不使用 Lattice 本地 submodule checkout，也不进入用户级 `~/.agents/skills` Target。

标准工程入口：

```text
skiloom install akira-tl/matt-skills/ask-akira --git main --scope workspace --plan --json
skiloom install akira-tl/matt-skills/ask-akira --git main --scope workspace --yes --json
```

完整 Matt standard dependency closure 由 `ask-akira` / `ask-matt` 的 `skiloom-package.toml` 自动解析。需要正式 Parallel 主协调时，再按真实任务额外安装：

```text
skiloom install akira-tl/matt-skills/parallel-coordinator --git main --scope workspace --plan --json
```

本仓不再提供旧 Akira installer、Claude plugin、marketplace、`skills.sh`、npm/Changesets 或本地执行器链接作为正式安装路径。

## 上游

上游 `mattpocock/skills` 只用于发现可能值得吸收的改进。我们不整体 merge `upstream/main`；每次只审阅并引入当前 Akira Matt 系列真正需要的 commit、规则或实现，然后由本仓继续维护。详细规则见 [`.agents/upstream.md`](.agents/upstream.md)。

## 开发

列出当前 Skill：

```bash
./scripts/list-skills.sh
```

仓库级结构检查与 Git 提交使用 Akira Guard；Lattice 只保留自身静态配置与仓库拓扑检查。稳定 Skill 的行为变化应同步对应 `docs/` 页面；改变工程入口或 Execution Policy 时同步更新 `ask-akira`，改变 Matt standard flow 时同步更新 `ask-matt`。
