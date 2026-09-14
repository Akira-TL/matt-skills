# Issue tracker: Local Markdown

Issues and specs for this repo live as markdown files in `.scratch/`.

## Conventions

- One feature per directory: `.scratch/<feature-slug>/`
- The spec is `.scratch/<feature-slug>/spec.md`
- Implementation issues are one file per ticket at `.scratch/<feature-slug>/issues/<NN>-<slug>.md`, numbered from `01` — never a single combined tickets file
- Workflow state is recorded as a machine-readable `Status:` line near the top of each issue file. Incoming triage work also records a machine-readable `Category:` line. Resolve triage/implementation role values through `triage-labels.md` when that mapping exists; for example, canonical role `ready-for-agent` may map to a different local `Status:` value.
- Comments and conversation history append to the bottom of the file under a `## Comments` heading

## When a skill says "publish to the issue tracker"

Create a new file under `.scratch/<feature-slug>/` (creating the directory if needed).

## When a skill says "fetch the relevant ticket"

Read the file at the referenced path. A bare ticket number is valid only when the active `.scratch/<effort>/issues/` directory makes that number unique; if several effort directories contain the same number, require an explicit path instead of guessing.

## Work item operations

Used by skills that coordinate work through local issue files.

- **Blocking**: a `Blocked by: NN, NN` line near the top. A work item is unblocked when every file it lists is in the owning workflow's resolved state.
- **Frontier**: scan the workflow's issue directory for work items that are open, unblocked, and unclaimed, then preserve the workflow's ordering when choosing among them.
- **Claim**: for ordinary local work, update the workflow's `Status:` field to its claimed state and save it as the session's first write. When several Agents can claim concurrently, the coordinating workflow must use its deterministic mutex before or atomically with the tracker update; `Status:` text alone is not mutual exclusion.
- **Complete an ordinary implementation ticket**: check each satisfied acceptance criterion in the ticket file, set `Status: resolved` only when every criterion is established by the completed implementation/review evidence, and leave an unmet criterion unchecked with the ticket still open otherwise.

## Wayfinding operations

Used by `/wayfinder`. The **map** is a file with one **child** file per ticket. Its tickets use the shared blocking, frontier, and claim operations above.

- **Map**: `.scratch/<effort>/map.md` — the Notes / Decisions-so-far / Fog body.
- **Child ticket**: `.scratch/<effort>/issues/NN-<slug>.md`, numbered from `01`, with the question in the body. A `Type:` line records the ticket type (`research`/`prototype`/`grilling`/`task`); a `Status:` line records `claimed`/`resolved`.
- **Resolve**: append the answer under an `## Answer` heading, set `Status: resolved`, then append a context pointer (gist + link) to the map's Decisions-so-far in `map.md`.
