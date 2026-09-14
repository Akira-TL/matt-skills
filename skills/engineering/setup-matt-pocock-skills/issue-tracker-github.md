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

**Detect GitHub CLI capabilities; do not infer them from `gh --version` or from current online documentation.** Before relying on native issue-dependency or sub-issue flags/JSON fields, inspect the installed CLI (`gh issue create --help`, `gh issue edit --help`, and a non-mutating `gh issue list --limit 1 --json <field>` probe). A repository may intentionally run an older packaged `gh`; lack of a convenience flag is not a reason to require an upgrade when `gh api` can express the same GitHub relationship.

- **Blocking**: GitHub's **native issue dependencies** are the canonical, UI-visible representation. If the installed CLI exposes `--blocked-by` / `--add-blocked-by` and `blockedBy`, use those conveniences. Otherwise use the REST API through the already-authenticated `gh api`: resolve each blocker issue's database id with `gh api 'repos/{owner}/{repo}/issues/<blocker>' --jq .id`, then add the edge with `gh api --method POST 'repos/{owner}/{repo}/issues/<child>/dependencies/blocked_by' -F issue_id=<blocker-id>`. Read blockers with `gh api --paginate 'repos/{owner}/{repo}/issues/<child>/dependencies/blocked_by'`. Only when the GitHub dependency API itself is unavailable for the repository/account should the adapter fall back to a machine-readable `Blocked by: #<n>, #<n>` line in the child body. A work item is unblocked when every blocker is closed or otherwise resolved by the owning workflow.
- **Frontier query**: list the relevant open work items, then determine blockers using the strongest capability actually available: native `blockedBy` JSON when supported, otherwise the REST `dependencies/blocked_by` endpoint per candidate, otherwise the fallback `Blocked by:` line. Drop any item with an unresolved blocker or a workflow-defined active claim. Preserve the owning workflow's ordering when choosing among the remainder.
- **Claim**: `gh issue edit <n> --add-assignee @me` is the tracker-visible claim when workers have distinct GitHub identities. A coordination workflow may require a stronger claim when several Agents share one GitHub user; follow that workflow's deterministic claim protocol and treat the assignee as visibility rather than mutual exclusion.
- **Complete an ordinary implementation ticket**: update the issue body so every established acceptance criterion is checked, then close with `gh issue close <n> --comment "<completion evidence>"`. If any criterion remains unmet, leave the issue open and identify the unmet criterion instead of closing it.
- **Resolve an ordinary implementation ticket**: re-read the issue body and verify each Acceptance Criterion against the final committed implementation, validation and review evidence. Update only satisfied checkboxes to checked, add a concise evidence comment, remove the configured tracker label mapped from canonical role `ready-for-agent` when present, then close with `gh issue close <n> --comment "<completion summary>"`. If any criterion remains unsatisfied, leave the issue open and report the gap. Never close the parent Spec or parent issue as a side effect of resolving one implementation ticket.

## Wayfinding operations

Used by `/wayfinder`. The **map** is a single issue with **child** issues as tickets. Its tickets use the shared blocking, frontier, and claim operations above.

- **Map**: a single issue carrying canonical workflow role `wayfinder:map`, holding the Notes / Decisions-so-far / Fog body. When setup materialises this adapter, substitute the configured tracker label for that role in `gh issue create --label "<mapped-wayfinder-map-label>"`.
- **Child ticket**: use native CLI parent/sub-issue flags only when capability probing confirms the installed `gh` supports them. Otherwise create the issue normally, resolve the child issue's database id with `gh api 'repos/{owner}/{repo}/issues/<child>' --jq .id`, then attach it with `gh api --method POST 'repos/{owner}/{repo}/issues/<map>/sub_issues' -F sub_issue_id=<child-id>`. If the GitHub sub-issue API itself is unavailable, add the child to a task list in the map body and put `Part of #<map>` at the top of the child body. Apply the tracker label mapped from the canonical `wayfinder:<type>` role. Once claimed, the ticket is assigned to the driving dev.
- **Resolve**: `gh issue comment <n> --body "<answer>"`, then `gh issue close <n>`, then append a context pointer (gist + link) to the map's Decisions-so-far.
