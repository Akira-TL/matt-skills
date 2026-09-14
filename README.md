# Akira Matt Skills

`Akira-TL/matt-skills` 是 Akira 自己维护的工程 Skill 产品仓。它以 Matt 系列工程方法为基础，继续维护需求澄清、Spec/Ticket、实现、TDD、代码审查、缺陷诊断、架构改进等工作流，并承载 `ask-akira`、`parallel-coordinator`、`parallel-execution` 等 Akira 工程扩展。

本仓历史来源于 `mattpocock/skills`，相关许可证与 Git 历史继续保留；当前产品方向、发布方式和维护决策由 Akira 自己负责。上游只作为参考来源，后续只选择性吸收确有价值的变化，不再整体同步上游产品结构。

## 结构

```text
skills/
├── engineering/     # 稳定工程 Skills
├── productivity/    # 与工程流协作的通用 Skills
├── in-progress/     # 尚未稳定的 Akira/Matt 扩展
└── deprecated/      # 弃用与迁移说明
docs/                # 稳定 Skill 的人类说明
scripts/list-skills.sh
```

`ask-matt` 是 Matt 系列总 Router。软件工程任务通常先从它进入，再按真实需要路由到 `grill-with-docs`、`to-spec`、`to-tickets`、`implement`、`tdd`、`code-review`、`diagnosing-bugs` 等能力。

## 安装

运行时只从远端 `Akira-TL/matt-skills` 安装，不使用 Lattice 本地 submodule checkout：

```bash
uv run python ~/.agents/skills/akira/scripts/skills.py install \
  https://github.com/Akira-TL/matt-skills.git \
  --all \
  --root skills/engineering \
  --root skills/productivity \
  --skill ask-akira \
  --skill parallel-coordinator \
  --skill parallel-execution
```

该命令安装稳定 Engineering / Productivity Skills，并显式加入当前 Akira 工程扩展；其他实验性 Skill 不会因为整仓存在而自动进入机器级注册表。

本仓不再提供 Claude plugin、marketplace、`skills.sh`、npm/Changesets 或本地执行器链接作为正式安装路径。

## 上游

上游 `mattpocock/skills` 只用于发现可能值得吸收的改进。我们不整体 merge `upstream/main`；每次只审阅并引入当前 Akira Matt 系列真正需要的 commit、规则或实现，然后由本仓继续维护。详细规则见 [`.agents/upstream.md`](.agents/upstream.md)。

## 开发

列出当前 Skill：

```bash
./scripts/list-skills.sh
```

仓库级结构检查与 Git 提交使用 Akira Lattice Guard。稳定 Skill 的行为变化应同步对应 `docs/` 页面；改变用户可达 Skill 或工程流程关系时同步更新 `ask-matt`。
