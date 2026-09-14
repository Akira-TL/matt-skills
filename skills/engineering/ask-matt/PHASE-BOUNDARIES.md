# Phase boundaries

A **phase** is a coherent chunk of work inside one working context — grilling, implementation, review, QA. A **phase boundary** is the point between two such chunks where context strategy can be reconsidered without interrupting an unfinished line of reasoning.

The method is independent of any one Agent product. A harness may expose commands such as clear, compact, fork, sub-agent, or new-session controls; another may expose different primitives. Choose the semantic move first, then use whatever mechanism the current harness actually provides.

## The five semantic moves

| Move | Use it when |
| --- | --- |
| **Continue** | The next phase benefits materially from the full current reasoning and the context remains healthy enough to continue. |
| **Fresh context** | The previous phase is no longer needed as evidence for the next one. Start clean rather than carrying irrelevant history. |
| **Handoff artifact** | Work must move to another harness, directory, repository, colleague, or independently resumable thread. Write a portable artifact that carries only what the receiver needs. |
| **Isolated worker** | A tightly scoped side task can be executed without steering and the current harness genuinely provides an isolated worker context. |
| **Summary transfer** | The next phase still needs some of the current reasoning, but retaining the whole context is no longer desirable or possible. Carry a deliberate summary into a fresh/compacted context. |

`/handoff` is the Matt Skill for the portable-artifact case. Fresh-context and summary-transfer mechanisms are harness-specific: use `/clear`, `/compact`, a new session, a fork, or another equivalent only when that capability actually exists. Do not write product-specific commands into the engineering method as universal requirements.

## Decision order

Work top to bottom at a phase boundary. The first applicable answer wins.

### 1. Can you safely continue?

Continue when the next phase genuinely needs the current phase as a **primary source**, or when keeping the existing reasoning clearly costs less than reconstructing it. Grilling → a small implementation is a common example: the implementation may rely on distinctions and rejected alternatives that a summary would flatten.

Do not use a fixed token number as the decision rule. Context limits and degradation behaviour vary by model and harness. Use observable pressure instead: repeated forgetting, inability to keep relevant files/decisions in view, excessive compression of earlier reasoning, or an executor-reported context constraint.

### 2. Is the previous context disposable?

If the next phase needs only durable artifacts — ticket, spec, ADR, committed code — and not the conversational reasoning behind them, start a **fresh context**.

This is the normal boundary between independent implementation tickets. The exact action may be a new session, a clear/reset command, or another executor-specific fresh-context mechanism.

### 3. Does the work need to travel?

Use a **handoff artifact** when the receiver changes in a way that needs portability:

- another Agent harness;
- another repository or directory;
- another human collaborator;
- a side thread that must be independently resumable.

A handoff is not merely a way to shrink context. Its value is that the artifact can travel and be inspected independently.

### 4. Is there a separable side task and real isolation available?

If a task is narrowly scoped, does not need interactive steering, and the current harness provides a genuinely isolated worker, run it there and return only the result/evidence needed by the parent context.

If no isolated worker exists, perform the task synchronously or defer it. Do not simulate independence inside the same context and do not claim parallelism that did not happen.

### 5. Otherwise, transfer a summary

When the next phase still depends on the current reasoning but carrying the full context is undesirable, create a **summary transfer** focused on the next phase: decisions, rejected alternatives that still matter, open constraints, evidence pointers, and current state.

Use the harness's compaction/fork/new-session mechanism if one exists; otherwise create an explicit summary/handoff artifact. The important property is that this is a **secondary source**: useful, smaller, and intentionally lossy.

## Primary and secondary sources

Every move except Continue changes how much of the original reasoning remains directly available.

| Context form | Information retained | Noise retained | Portability |
| --- | --- | --- | --- |
| Current context | Highest | Highest | Low |
| Fresh context | None beyond durable artifacts | Lowest | Medium |
| Isolated worker result | Task-specific | Low | Medium |
| Handoff / summary transfer | Selected, lossy | Low | High |

This is why Continue is considered first: do not pay information loss when the next phase truly needs the original reasoning. It is also why fresh context is preferable when only durable artifacts matter: carrying irrelevant history has no engineering value.

## Mid-phase rule

Do not switch context strategy merely because the session feels long. Mid-phase, finish the coherent unit if possible. If a separable side task appears, isolate only that side task when the harness supports it. Reconsider the parent context at the next real phase boundary.
