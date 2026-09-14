## 它做什么

`ask-akira` 是 Akira 在 Matt 工程方法之上的执行策略入口。当前稳定能力用于用户显式选择 `rapid`、`emergency` 或 `competition` 模式：它改变规划成本、交互频率、验证强度和协调方式，但不复制 `tdd`、`code-review`、`diagnosing-bugs` 等专业工程方法。

## 当前模式

- `rapid`：减少非必要流程成本，尽快交付仍可维护的软件。
- `emergency`：优先恢复正确行为并限制影响范围。
- `competition`：围绕明确截止时间和演示关键路径最大化可交付成果。

模式作用域默认为当前任务；只有用户显式选择会话作用域时才跨多个任务持续。模式内部继续按需加载 Matt 的专业 Skill，缺少真实依赖时不得用模型记忆模拟其方法。

## 与 Matt 的关系

`ask-akira` 当前只拥有特殊执行策略。Matt 的标准工程主流程仍由 `ask-matt` 路由；具体实现、TDD、代码审查、缺陷诊断、领域建模和其他专业方法继续由各自 canonical Skill 拥有。

`ask-akira` 位于稳定 `skills/engineering/`，因此随稳定 Engineering suite 安装，不再作为单独的实验 Skill 选择。
