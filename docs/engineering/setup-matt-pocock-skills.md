## What it does

`setup-matt-pocock-skills` answers three questions about one repo — where issues live, which workflow-role values the installed engineering flows require, and where the domain docs sit — and records the answers as markdown files under `docs/agents/`.

Those files are the only thing that varies between repos. The skills themselves are identical everywhere; they read `docs/agents/issue-tracker.md` at run time and do what it says. That is why the set is not tied to GitHub, and why no skill file ever needs editing to point it somewhere else. Invoking it with "link the skills to a custom issue tracker" works with anything you can connect to programmatically, with zero changes to the skills.

It is a prompt-driven skill, not a deterministic script. It reads your `git remote`, existing project Agent instructions, `CONTEXT.md` and tracker state, proposes what it found, and waits for you to confirm before writing anything. Project instructions have one canonical source: `AGENTS.md` is the executor-neutral default when the repository has not already declared another authority; executor-specific files may point to that source but should not maintain a second copy of the same `Agent skills` block.

## When to reach for it

You invoke this by typing `/setup-matt-pocock-skills` — the agent won't reach for it on its own. It is deliberately marked non-invokable, so no other skill can fire it for you.

Reach for it when a repository-stateful Matt flow needs tracker/workflow/domain configuration and those files are absent or stale — most commonly before triage, to-spec, to-tickets or wayfinder. It is **not** a universal prerequisite for engineering Skills such as tdd, diagnosing-bugs or codebase-design that can operate without repository tracker configuration. A repo already halfway through a project is a fine place to run it; the skill reads what is already there and no earlier work is wasted.

## Prerequisites

It writes into the repo you run it in:

| It writes | Where |
| --- | --- |
| `issue-tracker.md` | `docs/agents/` |
| `domain.md` | `docs/agents/` |
| `triage-labels.md` | `docs/agents/`, when at least one installed flow consumes tracker labels; compatibility path for the workflow-role mapping |
| An `## Agent skills` block | the repository's confirmed canonical Agent instruction file; `AGENTS.md` is the neutral default when no authority is already declared |

All of it is committed markdown. There is no user-level or global mode: the config lives in the repo, so every repo gets its own copy.

## The three decisions

It leads each section with the recommended answer, and skips whatever exploration already settled. Most runs are two confirmations and done.

| Decision | What it proposes | When it actually asks |
| --- | --- | --- |
| **Issue tracker** | the one matching your `git remote` | always — this is the one real choice |
| **Workflow roles** | keep canonical role names for the union required by installed flows; map them to tracker labels or local `Status:`/`Category:` values as the selected tracker requires | only when at least one installed flow consumes configurable workflow roles; one naming decision covers the required subset |
| **Domain docs** | single-context: one root `CONTEXT.md`; preserve any existing ADR location/naming/template, falling back to `docs/adr/` only when the repo has no ADR convention | only if it spots monorepo signals, and then it offers a multi-context `CONTEXT-MAP.md` |

The tracker options:

| Option | Where issues live | Needs |
| --- | --- | --- |
| **GitHub** | the repo's GitHub Issues | the `gh` CLI |
| **GitLab** | the repo's GitLab Issues | the `glab` CLI |
| **Local markdown** | files under `.scratch/<feature>/` in this repo | nothing — no remote at all |
| **Other** | wherever you say | one paragraph from you describing the workflow |

The first three ship as templates in the skill and work out of the box. Local markdown is a first-class option, not a fallback: a solo project with no remote is fully supported. One caveat is worth repeating: don't use local markdown if you're using GitHub. They are alternatives, not layers.

"Other" is not a stub either. It is the reason Jira, Linear, Azure DevOps and Beads all work: you describe the workflow, the skill records your prose in `docs/agents/issue-tracker.md`, and the downstream skills follow the prose. The community has already done this — a Jira-over-MCP variant, a Gitea CLI shaped like `gh`, a hand-built local dashboard.

## Common questions

**Do I have to use GitHub?**

No. GitHub, GitLab and local markdown under `.scratch/` all ship as ready-made templates, and anything else works through the "other" path. This is the most-repeated question in the record, in roughly these words: *"hard locked to github"*, *"can I use GitLab / Jira"*, *"what about Azure DevOps"*. The answer every time is that the tracker is a setup answer, not a skill property.

**Do I need to re-run it after updating the skills?**

Asked directly after v1.1, Matt said yes. The skill's own closing message is softer — it tells you re-running is only needed to switch trackers or start over. Both are defensible and the reason for the gap is real: the seed templates change between versions, so a `docs/agents/issue-tracker.md` written by an older release can go stale against the skills now reading it. If a downstream skill starts doing something the docs describe differently, re-running is the cheap fix.

**Which Agent instruction file does setup edit?**

It now resolves a canonical project instruction source instead of choosing by executor filename. Existing root `AGENTS.md` is preferred as the neutral source; an executor-specific file that is a symlink or pointer to it stays a compatibility view. If a repository explicitly declares another canonical file, setup respects that. If the only existing instructions are in an executor-specific file with substantive project rules, setup recommends migration to `AGENTS.md` but asks before changing ownership, because silently duplicating the same standing rules into both files creates two sources of truth.

**Does setup create the labels the workflows need?**

Yes, on supported real trackers. `docs/agents/triage-labels.md` remains the compatibility-path mapping from workflow roles to tracker labels, but setup now verifies the required subset after you approve the plan and creates only names that are missing. Existing labels are never force-updated, so their color and description remain repository-owned.

The required set is capability- and tracker-driven rather than triage-only: installed `to-tickets` needs `ready-for-agent`; installed `triage` adds `bug`, `enhancement`, `needs-triage`, `needs-info`, `ready-for-human`, and `wontfix`; installed `wayfinder` adds `wayfinder:map` plus its four ticket-type roles only when the selected tracker represents those types as labels. Local Wayfinder instead uses canonical `Type:` plus lifecycle `Status:` fields and therefore adds no Wayfinder label mapping. Setup takes the union and omits role mapping entirely when no installed flow needs configurable role values. Local markdown needs no remote label creation. A custom tracker without a deterministic label-create operation is reported as an explicit setup gap rather than silently treated as complete.

**Can I configure the other skills' behaviour here — grilling cadence, question format, tone?**

No. It configures three things: tracker, workflow-role mapping, and doc layout. Project-specific standing preferences belong in the repository's canonical Agent instructions, not in this setup Skill and not in an executor-specific file merely because that executor is currently running.

**Can I keep the tracker/domain configuration in a user-level executor directory instead of committing it to every repo?**

No. Tracker, domain-layout and workflow-role configuration describe the repository, so every repo carries its own `docs/agents/`. Executor-level personal preferences are a separate concern and do not replace repository configuration.

**Isn't it strange to have a skill that configures the other skills?**

One long-standing complaint says yes, in these words: *"having a skill to set up the other skill does not feel right to me — that means the LLM is configuring its own skills."* The trade is real and acknowledged: the alternative to a setup step is duplicating tracker instructions into every skill that touches issues. The output is inspectable, editable markdown, which is the mitigation — you can read every file it wrote and change it by hand, and day-to-day tweaks are exactly that, not another run.

## It's working if

- `docs/agents/issue-tracker.md` and `docs/agents/domain.md` exist; the compatibility-path `docs/agents/triage-labels.md` also exists when an installed flow consumes tracker labels.
- An `## Agent skills` section appears in the repository's canonical Agent instruction source, with a one-line summary pointing at each of those files.
- The tracker it proposed matches the remote you really use; every required workflow role has a concrete tracker value, and every required label on a label-based tracker either exists or is explicitly reported as an unsupported setup gap.
- Afterwards, `/to-tickets` publishes without asking you where issues live, and `/triage` applies labels rather than inventing them.
- Nothing in the skill files themselves changed. If setup edited a `SKILL.md`, something went wrong.

## Where it fits

`setup-matt-pocock-skills` is the repository-configuration entry point for the Matt flows that actually consume tracker, workflow-role or domain-layout state; it is not a mandatory first step for every engineering Skill. Its main readers are triage, to-spec, to-tickets and wayfinder. Those flows use the configured tracker's shared **Work item operations** for blocking, frontier and claim, while domain-aware flows consume the recorded domain-doc convention when relevant. The domain-modeling Skill fills `CONTEXT.md` and ADRs lazily when terms or decisions actually resolve, so an empty domain model immediately after setup is expected. For which Skill to reach for next, ask-matt routes the whole set.
