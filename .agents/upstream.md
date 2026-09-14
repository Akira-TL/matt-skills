# Matt 上游参考规则

本仓的 upstream 是 `git@github.com:mattpocock/skills.git`。它用于发现值得参考的改进，不是本仓需要整体追随的发布主线。

## 基本规则

- `origin` 是 `Akira-TL/matt-skills`，是本仓唯一发布远端。
- `upstream` 只允许 fetch，push URL 必须保持禁用。
- 不整体 merge `upstream/main`，也不以“保持同步”为目标。
- 先阅读具体上游 commit / diff，再判断它是否适合当前 Akira Matt 工程流。
- 需要时选择性 cherry-pick 单个提交，或人工移植其中一部分设计；引入后按本仓规则继续维护。
- 上游改动如果与 `ask-akira`、Parallel 协作、Akira Core 或当前 Router 关系冲突，以本仓当前设计为准。
- 上游来源需要保留可追溯性；不要把上游变化伪装成无来源的本地原创。

## 推荐检查方式

```bash
git fetch upstream
git log --oneline HEAD..upstream/main
git show <upstream-commit>
```

确认某个提交确实需要后，再选择性处理。不要使用自动化脚本把整个 upstream 分支合并进本仓。
