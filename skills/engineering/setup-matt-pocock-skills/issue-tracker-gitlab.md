# Issue tracker: GitLab

Issues and specs for this repo live as GitLab issues. Use the [`glab`](https://gitlab.com/gitlab-org/cli) CLI for all operations.

## Conventions

- **Create an issue**: `glab issue create --title "..." --description "..."`. Use a heredoc for multi-line descriptions. Pass `--description -` to open an editor.
- **Read an issue**: `glab issue view <number> --comments`. Use `-F json` for machine-readable output.
- **List issues**: `glab issue list -F json` with appropriate `--label` filters.
- **Comment on an issue**: `glab issue note <number> --message "..."`. GitLab calls comments "notes".
- **Apply / remove labels**: `glab issue update <number> --label "..."` / `--unlabel "..."`. Multiple labels can be comma-separated or by repeating the flag.
- **List repository labels**: `glab label list --output json`; page through the result when the project has more labels than one response page.
- **Create a missing label**: `glab label create --name "<name>"`. Setup creates only names that are absent; it does not edit an existing label's color or description.
- **Close**: `glab issue close <number>`. `glab issue close` does not accept a closing comment, so post the explanation first with `glab issue note <number> --message "..."`, then close.
- **Merge requests**: GitLab calls PRs "merge requests". Use `glab mr create`, `glab mr view`, `glab mr note`, etc. — the same shape as `gh pr ...` with `mr` in place of `pr` and `note`/`--message` in place of `comment`/`--body`.

Infer the repo from `git remote -v` — `glab` does this automatically when run inside a clone.

## Merge requests as a triage surface

**MRs as a request surface: no.** _(Set to `yes` if this repo treats external merge requests as feature requests; `/triage` reads this flag.)_

When set to `yes`, MRs run through the same labels and states as issues, using the `glab mr` equivalents:

- **Read an MR**: `glab mr view <number> --comments` and `glab mr diff <number>` for the diff.
- **List external MRs for triage**: list open MRs with `glab mr list -F json` and obtain the project's effective member set from GitLab's Projects Members API (`GET /projects/:id/members/all`, paginated). Keep only MRs whose author id is not in that member set. Fetch full discussions only after an MR is selected for triage.
- **Comment / label / close**: `glab mr note`, `glab mr update --label`/`--unlabel`, `glab mr close`.

Unlike GitHub, GitLab numbers issues and MRs separately, so `#42` is unambiguous once you know which surface the maintainer means.

## When a skill says "publish to the issue tracker"

Create a GitLab issue.

## When a skill says "fetch the relevant ticket"

Run `glab issue view <number> --comments`.

## Work item operations

Used by skills that coordinate work through issues.

- **Blocking**: GitLab's **native blocking link** is the canonical, UI-visible representation. Add it with the `/blocked_by #<n>` quick action, posted as a note (`glab issue note <child> --message "/blocked_by #<blocker>"`). Native blocking links are a Premium/Ultimate feature; on the free tier (or where unavailable) fall back to a `Blocked by: #<n>, #<n>` line at the top of the description. A work item is unblocked when every blocker is closed or otherwise resolved by the owning workflow.
- **Frontier query**: list the relevant work items with `glab issue list -F json`, then drop any with an open blocker — a native `blocked_by` link to an open issue (`glab api projects/:id/issues/:iid/links`), or an unresolved issue in the `Blocked by` line — or a workflow-defined active claim. Preserve the owning workflow's ordering when choosing among the remainder.
- **Claim**: `glab issue update <n> --assignee @me` is the tracker-visible claim when workers have distinct GitLab identities. A coordination workflow may require a stronger claim when several Agents share one GitLab user; follow that workflow's deterministic claim protocol and treat the assignee as visibility rather than mutual exclusion.

## Wayfinding operations

Used by `/wayfinder`. The **map** is a single issue with **child** issues as tickets. Its tickets use the shared blocking, frontier, and claim operations above.

- **Map**: a single issue carrying canonical workflow role `wayfinder:map`, holding the Notes / Decisions-so-far / Fog body. When setup materialises this adapter, substitute the configured tracker label for that role in `glab issue create --label "<mapped-wayfinder-map-label>"`. (On GitLab tiers with native epics, an epic may hold the map instead; a labelled issue works everywhere.)
- **Child ticket**: an issue carrying `Part of #<map>` at the top of its description and the configured tracker label mapped from its canonical `wayfinder:<type>` role (`research`/`prototype`/`grilling`/`task`). Once claimed, the ticket is assigned to the driving dev.
- **Resolve**: `glab issue note <n> --message "<answer>"`, then `glab issue close <n>`, then append a context pointer (gist + link) to the map's Decisions-so-far.
