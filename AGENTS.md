# Repository instructions

本仓库是 `Akira-TL/matt-skills` 的 canonical source，维护 Akira 自己的 Matt 系列工程 Skills。仓库历史来源于 `mattpocock/skills`，但现在按 Akira 的工程方法独立演进；上游只作为可选参考来源，不再作为需要整体同步的产品主线。

## 目录与所有权

- `skills/engineering/`：稳定工程工作流与工程方法。
- `skills/productivity/`：与 Matt 工程流直接协作的通用工作方法。
- `skills/in-progress/`：尚未稳定的 Akira/Matt 扩展，包括 `ask-akira`、Parallel 系列等。
- `skills/misc/`：保留但默认不安装的低频能力。
- `skills/deprecated/`：已弃用能力及迁移说明。
- `docs/<bucket>/<skill>.md`：稳定 Skill 的人类说明；与 Skill 行为发生实质变化时同步更新。

`ask-matt` 是 Matt 系列总 Router。新增、删除、重命名用户可达 Skill，或改变它们在工程流程中的关系时，必须同步检查并更新 `ask-matt`。

## 安装边界

本仓不维护 Claude plugin、marketplace、npm/Changesets 发布链或本地执行器 Skill 链接脚本。运行时安装统一由 `akira` Router 从远端 GitHub source 执行：

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

本地 `skills/matt` checkout 只用于开发、review、测试与固定 revision，不作为运行时安装 source，也不得直接链接到具体执行器的 Skill 目录。

## 上游边界

`mattpocock/skills` 只作为参考 upstream。需要吸收上游变化时：

1. 先 fetch 并阅读具体 commit / diff；
2. 只选择当前 Akira Matt 系列真实需要的内容；
3. 优先人工适配或选择性 cherry-pick 单个提交，不整体 merge `upstream/main`；
4. 上游内容进入本仓后即由我们维护，必须符合当前 Akira 规则与 Skill 关系；
5. `upstream` push 必须保持禁用。

具体来源与选择性吸收规则见 [`.agents/upstream.md`](.agents/upstream.md)。

## Skill 编写

- 每个 Skill 只有一个 canonical `SKILL.md`；目录名与 frontmatter `name` 必须一致。
- 调用模式遵循 [`.agents/invocation.md`](.agents/invocation.md)。
- Skill 之间通过能力名和明确 pointer 协作，不复制彼此正文。
- 保留已有专业工程术语，不为 Akira 定制自行创造无来源术语。
- 当前仍保留的历史上游 Skill 名称可以继续工作；涉及名称、职责或主流程重构时按独立语义修改逐步迁移，不在基础设施清理中批量改名。

## 检查与提交

- `scripts/list-skills.sh` 只用于列出本仓 Skill，不承担安装或发布职责。
- 机械结构检查与正式提交使用 Akira Lattice 的 Guard。
- 修改应保持原子提交；上游吸收与 Akira 自有功能修改不要混在同一个提交里。
