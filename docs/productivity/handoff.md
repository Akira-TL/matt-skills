## What it does

`handoff` writes the current work into a **portable Markdown handoff artifact** in the operating system's temporary directory so another agent, harness, directory, repository, or collaborator can continue from it.

Its value is **portability**, not merely making context shorter. If the next phase stays in the same place and needs no portable artifact, use the phase-boundary strategy from `ask-matt` instead: continue, start fresh, use an isolated worker when available, or transfer a summary with the current harness's own context mechanism.

## When to reach for it

Invoke `/handoff` when the work itself must travel:

| Situation | Why a file helps |
| --- | --- |
| Changing Agent harness | The destination cannot rely on the source conversation being present |
| Moving to another directory or repository | The receiving context needs a portable pointer to the current state |
| Sending work to a human collaborator | They need an inspectable artifact rather than hidden session state |
| Forking an independently resumable side task | The parent thread can continue while the side task gets only the context it needs |

A handoff is not the universal end-of-phase action. Same-task context management belongs to `ask-matt`'s phase-boundary rules.

## What the artifact contains

The document captures only live context that has not already been made durable elsewhere:

- current objective and immediate next work;
- decisions that matter to continuation;
- unresolved constraints or blockers;
- evidence pointers and current Git/workspace state when relevant;
- a **suggested skills** section for the receiving agent.

Do not copy specs, ADRs, issues, plans, commits or diffs into the handoff when they already exist. Reference their path, stable issue reference, URL or commit instead. This keeps one source of truth for settled information.

Secrets and sensitive material are redacted before the artifact is written. API keys, passwords, access tokens, cookies and unrelated personal information do not belong in a handoff.

If the user states what the next context will focus on, the handoff should be selective: preserve reasoning and evidence that bear on that focus rather than summarising the entire conversation uniformly.

## Completion reply

After writing the artifact, return:

1. its full path;
2. a fenced `text` block containing a ready-to-paste pickup prompt for the receiving agent.

The pickup prompt is transport UI, not part of the handoff file. It points the receiver to the artifact and states the intended continuation task.

## Handoff versus other context moves

At a phase boundary, distinguish the semantic move before choosing a tool:

- **Continue** retains the original conversation as the primary source.
- **Fresh context** discards conversational history and reloads only durable artifacts.
- **Isolated worker** handles a separable side task when the current harness genuinely provides context isolation.
- **Summary transfer** carries selected reasoning into another context using whatever compaction/fork/new-session mechanism the current harness provides.
- **Handoff artifact** creates a portable file because the work must travel independently of the source harness/session.

The first four do not require this Skill. `/handoff` owns only the portable-artifact case.

## Temporary-file boundary

The OS temp directory is appropriate for short-lived transfer, not durable project knowledge. Some environments clear temporary files between sessions or on restart. If the receiving context will not start soon, or if the handoff must survive machine/session cleanup, move or copy it to a durable user-approved location before relying on it.

The same rule applies to anything the handoff references: a pointer to another temporary file is only useful while that file still exists.

## Common questions

**Why not paste the summary directly into the next prompt?**

You can for a tiny transfer, but a file is easier to inspect, reference, revise before sending, and reuse across harnesses. The pickup prompt should point at the artifact rather than interpolate arbitrary handoff text into a shell command.

**Is a native fork/new-session feature better?**

When it preserves exactly the context you need and the work stays inside that environment, usually yes. Use the native mechanism. The handoff file becomes preferable when the destination is outside that context boundary or needs an independently inspectable artifact.

**What belongs in project Agent instructions instead?**

Standing project rules and facts that should still be true next month belong in the project's persistent Agent instructions or canonical docs. A handoff describes one piece of work in flight and expires when that work is complete.

**It captures the what but not the why.**

Pass the intended next-session focus when invoking the Skill. The handoff should preserve load-bearing reasoning, rejected alternatives that still constrain the next step, and uncertainty that has not been resolved. It should not upgrade assumptions into facts merely to make the summary concise.

## It's working if

- the artifact is much smaller than the source conversation;
- durable project information is referenced rather than duplicated;
- the receiver can start without asking for the setup again;
- a forked side task does not require the parent context to be abandoned;
- the suggested-skills section matches the actual next work;
- the completion reply includes the full path and ready-to-paste pickup prompt;
- no secret or unrelated personal information is present.

## Where it fits

`handoff` is a reach-for-it-anytime portability Skill. It is useful at boundaries where work changes context ownership; it is not a required step in the main engineering chain. `ask-matt` owns the broader decision about whether to continue, start fresh, isolate a side task, transfer a summary, or write a handoff artifact.
