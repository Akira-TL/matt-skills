---
name: setup-matt-pocock-skills
description: Configure per-repo tracker, workflow-role mapping, and domain-doc conventions for Matt flows that consume repository configuration. Run before tracker-backed flows such as triage, to-spec, to-tickets or wayfinder when that configuration is absent; it is not a prerequisite for every engineering Skill.
disable-model-invocation: true
---

# Setup Matt Pocock's Skills

Scaffold the per-repo configuration that the engineering skills assume:

- **Issue tracker** — where issues live (GitHub by default; local markdown is also supported out of the box)
- **Workflow roles** — the role-to-value mapping required by installed engineering flows: tracker label strings on real trackers and machine-readable field values in local markdown
- **Domain docs** — where `CONTEXT.md` and ADRs live, and the consumer rules for reading them

This is a prompt-driven skill, not a deterministic script. Explore, present what you found, confirm with the user, then write.

## Process

### 1. Explore

Look at the current repo to understand its starting state. Read whatever exists; don't assume:

- `git remote -v` and `.git/config` — is this a GitHub repo? Which one?
- Project Agent instruction files at the repo root, especially `AGENTS.md` and executor-specific compatibility files such as `CLAUDE.md` — which file is canonical, is one a symlink/pointer to another, and is there already an `## Agent skills` section?
- `CONTEXT.md` and `CONTEXT-MAP.md` at the repo root
- Existing ADR locations, naming patterns and templates/conventions — start with `docs/adr/` and any `src/*/docs/adr/`, but also follow repository instructions, contribution docs and existing decision records if the project already uses another convention
- `docs/agents/` — does this skill's prior output already exist?
- `.scratch/` — sign that a local-markdown issue tracker convention is already in use
- Which workflow-role consumers are installed? `to-tickets` needs the `ready-for-agent` role; `triage` adds its category/state roles; on a real label-based tracker, `wayfinder` adds its `wayfinder:*` roles. Local Wayfinder uses `Type:` and lifecycle `Status:` fields instead of tracker labels. This determines the required role set in Section B.
- Monorepo signals — a `pnpm-workspace.yaml`, a `workspaces` field in `package.json`, or a populated `packages/*` with its own `src/`. Present only in a genuinely large multi-package repo; their absence means single-context, which is almost every repo.

### 2. Present findings and ask

Summarise what's present and what's missing. Then take the sections in order — one section, one answer, then the next.

Lead each section with the recommended answer so the user can accept it in a word. Give a one-line explainer only when the choice genuinely branches; skip Section C when exploration already settled there is no monorepo.

**Section A — Issue tracker.**

> Explainer: The "issue tracker" is where issues live for this repo. Skills like `to-tickets`, `triage`, and `to-spec` read from and write to it — they need to know whether to call `gh issue create`, write a markdown file under `.scratch/`, or follow some other workflow you describe. Pick the place you actually track work for this repo.

Default posture: these skills were designed for GitHub. If a `git remote` points at GitHub, propose that. If a `git remote` points at GitLab (`gitlab.com` or a self-hosted host), propose GitLab. Otherwise (or if the user prefers), offer:

- **GitHub** — issues live in the repo's GitHub Issues (uses the `gh` CLI)
- **GitLab** — issues live in the repo's GitLab Issues (uses the [`glab`](https://gitlab.com/gitlab-org/cli) CLI)
- **Local markdown** — issues live as files under `.scratch/<feature>/` in this repo (good for solo projects or repos without a remote)
- **Other** (Jira, Linear, etc.) — ask the user to describe the workflow in one paragraph; the skill will record it as freeform prose

Record the choice in `docs/agents/issue-tracker.md`. The GitHub and GitLab templates carry a "PRs as a request surface" flag, defaulted **off** — leave it off and don't raise it; a user who wants external PRs in the triage queue can flip the flag in the file later.

**Section B — Workflow-role mapping.** Build the required role set from the selected tracker and installed role-consuming flows. Skip this section only when that set is empty.

- if `to-tickets` is installed: `ready-for-agent`;
- if `triage` is installed: category roles `bug`, `enhancement`, plus state roles `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`;
- if `wayfinder` is installed **and the selected tracker represents Wayfinder types as labels**: `wayfinder:map`, `wayfinder:research`, `wayfinder:prototype`, `wayfinder:grilling`, `wayfinder:task`.

Ask exactly one naming question:

> Do you want to keep the canonical workflow role values? (recommended: **yes**)

On **yes**, map each required role to the same string. Only if the user says no — usually because the tracker already uses another vocabulary — collect the overrides needed by the installed flows so downstream skills reuse the repository's existing values rather than inventing duplicates. `docs/agents/triage-labels.md` remains the compatibility path for this broader workflow-role mapping.

**Section C — Domain docs.** Default to **single-context** — one `CONTEXT.md` at the repo root. For ADRs, preserve any established repository location, naming scheme and template; only default to `docs/adr/` plus Matt's bundled ADR format when exploration found no existing ADR convention.

Offer **multi-context** — a root `CONTEXT-MAP.md` pointing to per-context `CONTEXT.md` files — only when exploration found monorepo signals. Then confirm which context layout they want. Existing ADR ownership remains independent of that context-layout choice unless the repository already scopes ADRs per context.

### 3. Confirm and edit

First identify the repository's **canonical Agent instruction file**. The goal is one maintained source of truth, not matching whichever executor happens to be running today.

Selection rules:

- If root `AGENTS.md` exists, prefer it as the executor-neutral canonical file.
- If an executor-specific file such as `CLAUDE.md` is a symlink or a clear pointer to `AGENTS.md`, edit only `AGENTS.md`.
- If project instructions explicitly declare another file canonical, respect that declaration instead of inventing a migration.
- If only an executor-specific instruction file exists and it contains substantive project rules, recommend migrating to an executor-neutral `AGENTS.md`, but show that as an explicit user choice before changing instruction ownership. Do not silently copy the same standing rules into two maintained files.
- If no project Agent instruction file exists, recommend creating root `AGENTS.md`.

Then show the user a draft of:

- the target canonical instruction file and any proposed compatibility-pointer change;
- the `## Agent skills` block to add or update there;
- the contents of `docs/agents/issue-tracker.md` and `docs/agents/domain.md`;
- when Section B has a non-empty role set, the required-role subset of `docs/agents/triage-labels.md` and, for a real tracker, the labels that already exist plus the exact missing labels setup proposes to create after approval.

Let them edit before writing.

### 4. Write

Write the `## Agent skills` block only to the confirmed canonical Agent instruction file. If an executor-specific compatibility file points to that canonical file, leave the pointer relationship intact. Do not maintain duplicate `Agent skills` blocks in multiple instruction files.

If an `## Agent skills` block already exists in the canonical file, update its contents in-place rather than appending a duplicate. Don't overwrite user edits to surrounding sections. A migration from an executor-specific file to `AGENTS.md` must preserve unrelated project instructions and follow the migration plan the user approved in step 3; setup is not permission to discard existing instructions.

The block:

```markdown
## Agent skills

### Issue tracker

[one-line summary of where issues are tracked]. See `docs/agents/issue-tracker.md`.

### Workflow roles

[one-line summary of the configured workflow-role mapping]. See `docs/agents/triage-labels.md`.

### Domain docs

[one-line summary of layout — "single-context" or "multi-context"]. See `docs/agents/domain.md`.
```

Include the `### Workflow roles` sub-block and write `docs/agents/triage-labels.md` only when Section B has a non-empty required-role set, containing only the roles required by the installed flows.

When Section B has a non-empty role set, verify the required labels after writing the configuration for GitHub or GitLab. Create **only missing labels**, using the configured label strings; never rewrite the color or description of an existing label. Label creation is part of the setup the user already approved in step 3, but it must remain idempotent. For local markdown there is no remote label registry to mutate. For an `Other` tracker, create labels only when the recorded tracker workflow provides a deterministic label-create operation; otherwise record the missing labels as an explicit setup gap instead of pretending setup is complete.

Then write the docs files using the seed templates in this skill folder as a starting point:

- [issue-tracker-github.md](./issue-tracker-github.md) — GitHub issue tracker
- [issue-tracker-gitlab.md](./issue-tracker-gitlab.md) — GitLab issue tracker
- [issue-tracker-local.md](./issue-tracker-local.md) — local-markdown issue tracker
- [triage-labels.md](./triage-labels.md) — compatibility-path template for the workflow-role mapping
- [domain.md](./domain.md) — domain doc consumer rules + layout

When materialising a GitHub/GitLab tracker template, render canonical workflow-role label references with the configured tracker label strings from `docs/agents/triage-labels.md`; do not leave literal `ready-for-agent` or `wayfinder:*` tracker commands behind when the user chose overrides. Local markdown likewise uses the configured mapping for triage/implementation `Status:` and `Category:` values; Wayfinder's `Type: research|prototype|grilling|task` and lifecycle `Status: claimed|resolved` remain canonical local protocol values rather than tracker-label mappings.

For "other" issue trackers, write `docs/agents/issue-tracker.md` from scratch using the user's description.

### 5. Done

Tell the user setup is complete only after the required repository files exist and, for a real tracker with supported label operations, every required mapped label exists. Name which engineering skills will read the files and which labels were created versus already present. Mention they can edit `docs/agents/*.md` directly later — re-running this skill is only necessary if they want to switch issue trackers, change the workflow-role mapping, or restart from scratch.
