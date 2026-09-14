# Issue tracker: GitHub

Issues and specs for this repo live as GitHub issues. Use the `gh` CLI for all operations.

## Conventions

- **Create an issue**: `gh issue create --title "..." --body "..."`. Use a heredoc for multi-line bodies.
- **Read an issue**: `gh issue view <number> --comments`, filtering comments by `jq` and also fetching labels.
- **List issues**: `gh issue list --state open --json number,title,body,labels,comments --jq '[.[] | {number, title, body, labels: [.labels[].name], comments: [.comments[].body]}]'` with appropriate `--label` and `--state` filters.
- **Comment on an issue**: `gh issue comment <number> --body "..."`
- **Apply / remove labels**: `gh issue edit <number> --add-label "..."` / `--remove-label "..."`
- **List repository labels**: `gh label list --limit 1000 --json name --jq '.[].name'`
- **Create a missing label**: `gh label create "<name>"`. Do not pass `--force` during setup; an existing label keeps its current color and description.
- **Close**: `gh issue close <number> --comment "..."`

Infer the repo from `git remote -v` — `gh` does this automatically when run inside a clone.

## Pull requests as a triage surface

**PRs as a request surface: no.** _(Set to `yes` if this repo treats external PRs as feature requests; `/triage` reads this flag.)_

When set to `yes`, PRs run through the same labels and states as issues, using the `gh pr` equivalents:

- **Read a PR**: `gh pr view <number> --comments` and `gh pr diff <number>` for the diff.
- **List external PRs for triage**: use the GitHub API because `gh pr list --json` does not expose a reliable author-association field. Resolve `<owner>/<repo>` from the remote, then query `gh api --paginate 'repos/<owner>/<repo>/pulls?state=open&per_page=100'` and keep entries whose `author_association` is not `OWNER`, `MEMBER`, or `COLLABORATOR`. Fetch full comments only after a PR is selected for triage.
- **Comment / label / close**: `gh pr comment`, `gh pr edit --add-label`/`--remove-label`, `gh pr close`.

GitHub shares one number space across issues and PRs, so a bare `#42` may be either — resolve with `gh pr view 42` and fall back to `gh issue view 42`.

## When a skill says "publish to the issue tracker"

Create a GitHub issue.

## When a skill says "fetch the relevant ticket"

Run `gh issue view <number> --comments`.

## Work item operations

Used by skills that coordinate work through issues.

- **Blocking**: GitHub's **native issue dependencies** are the canonical, UI-visible representation. When creating a child whose blockers are already known, use `gh issue create --blocked-by <n>,<n>`; for an existing issue use `gh issue edit <child> --add-blocked-by <n>,<n>`. Current `gh issue list/view --json` expose the native `blockedBy` relationship directly. Use the REST endpoint only as a compatibility fallback for an older GitHub CLI that lacks these flags/fields. Where native dependencies themselves aren't available, fall back to a `Blocked by: #<n>, #<n>` line at the top of the child body. A work item is unblocked when every blocker is closed or otherwise resolved by the owning workflow.
- **Frontier query**: list the relevant open work items with `blockedBy` included in `--json`, then drop any whose `blockedBy` array contains an open blocker (or whose fallback `Blocked by:` line names an unresolved issue) or that carries a workflow-defined active claim. Preserve the owning workflow's ordering when choosing among the remainder.
- **Claim**: `gh issue edit <n> --add-assignee @me` is the tracker-visible claim when workers have distinct GitHub identities. A coordination workflow may require a stronger claim when several Agents share one GitHub user; follow that workflow's deterministic claim protocol and treat the assignee as visibility rather than mutual exclusion.

## Wayfinding operations

Used by `/wayfinder`. The **map** is a single issue with **child** issues as tickets. Its tickets use the shared blocking, frontier, and claim operations above.

- **Map**: a single issue carrying canonical workflow role `wayfinder:map`, holding the Notes / Decisions-so-far / Fog body. When setup materialises this adapter, substitute the configured tracker label for that role in `gh issue create --label "<mapped-wayfinder-map-label>"`.
- **Child ticket**: create it with `gh issue create --parent <map>` or attach an existing issue with `gh issue edit <child> --parent <map>` / `gh issue edit <map> --add-sub-issue <child>`. Use the REST sub-issues endpoint only as a compatibility fallback for an older GitHub CLI. Where sub-issues aren't enabled, add the child to a task list in the map body and put `Part of #<map>` at the top of the child body. Apply the tracker label mapped from the canonical `wayfinder:<type>` role. Once claimed, the ticket is assigned to the driving dev.
- **Resolve**: `gh issue comment <n> --body "<answer>"`, then `gh issue close <n>`, then append a context pointer (gist + link) to the map's Decisions-so-far.
