# Engineering

Skills I use daily for code work.

## User-invoked

User-invoked only. Their Skill metadata disables implicit model invocation; each Agent executor decides how that installed user-invoked Skill is surfaced or manually invoked.

- **[grill-with-docs](./grill-with-docs/SKILL.md)** — Grilling session that also builds your project's domain model, sharpening terminology and updating `CONTEXT.md` and ADRs inline.
- **[triage](./triage/SKILL.md)** — Move issues through a state machine of triage roles.
- **[improve-codebase-architecture](./improve-codebase-architecture/SKILL.md)** — Scan a codebase for deepening opportunities, present them as a visual HTML report, then grill through whichever one you pick.
- **[setup-matt-pocock-skills](./setup-matt-pocock-skills/SKILL.md)** — Configure this repo for the engineering skills (issue tracker, workflow-role mapping, domain doc layout). Run once per repo.
- **[to-spec](./to-spec/SKILL.md)** — Turn the current conversation into a spec and publish it to the issue tracker.
- **[to-tickets](./to-tickets/SKILL.md)** — Break any plan, spec, or conversation into a set of tracer-bullet tickets, each declaring its blocking edges — text in a local file, or native blocking links on a real tracker.
- **[implement](./implement/SKILL.md)** — Build one work item from its spec/ticket evidence chain, use `/tdd` only when the slice has observable behaviour and an independent expected result, otherwise use proportionate validation, then commit and review that committed state with `/code-review` before closing an ordinary ticket.
- **[wayfinder](./wayfinder/SKILL.md)** — Plan a huge chunk of work — more than one agent session can hold — as a shared map of decision tickets on the issue tracker, resolved one at a time until the way to the destination is clear.

## Model-invoked

Model- or user-reachable (rich trigger phrasing so the model can reach for them).

- **[ask-akira](./ask-akira/SKILL.md)** — Akira Engineering Primary Router；默认选择 standard，并在需要时切换 rapid、emergency、competition 或识别正式 Parallel coordination 边界。
- **[ask-matt](./ask-matt/SKILL.md)** — Matt Standard Flow Router；由 ask-akira 的 standard 分支或用户直接调用，返回 Matt flow 的下一跳与 phase boundary。
- **[prototype](./prototype/SKILL.md)** — Build a throwaway prototype to answer a design question: a single shareable HTML file for state/logic, or several toggleable UI variations.

- **[diagnosing-bugs](./diagnosing-bugs/SKILL.md)** — Disciplined diagnosis loop for hard, non-trivial bugs and performance regressions: build a feedback loop that goes red on this bug → minimise → hypothesise → instrument → fix → regression-test. Quick factual error explanations should stay direct rather than auto-escalating here.
- **[research](./research/SKILL.md)** — Investigate a narrow question against high-trust primary sources and capture the findings as a cited Markdown artifact; use an isolated worker when the current harness provides one, otherwise run synchronously.
- **[tdd](./tdd/SKILL.md)** — Test-driven red → green development for observable behaviour with an independent expected result, one vertical slice at a time; refactoring belongs to `code-review`.
- **[domain-modeling](./domain-modeling/SKILL.md)** — Actively build and sharpen a project's domain model — challenge terms, stress-test with scenarios, update `CONTEXT.md` and ADRs inline.
- **[codebase-design](./codebase-design/SKILL.md)** — Shared discipline and vocabulary for designing deep modules: small interfaces, clean seams, testable through the interface.
- **[code-review](./code-review/SKILL.md)** — Two-axis review of the diff since a fixed point: **Standards** and **Spec**. Use isolated reviewer contexts in parallel when the current harness provides them; otherwise run both axes sequentially and label the result non-isolated.
- **[resolving-merge-conflicts](./resolving-merge-conflicts/SKILL.md)** — Work through an in-progress git merge or rebase conflict hunk by hunk, resolving by intent traced to each side's primary source, then finish the operation — never `--abort`.
- **[wizard](./wizard/SKILL.md)** — Generate an interactive bash wizard that walks a human through steps only they can perform: provisioning infrastructure, setting up credentials or CI secrets, walking an unfamiliar third-party dashboard, or running a one-off migration or cutover.
