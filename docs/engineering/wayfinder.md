## What it does

`wayfinder` takes an effort too big for one agent session — an idea whose **destination** you can name but whose route you cannot yet see — and charts it as a shared **map** of **decision tickets** on your issue tracker, then resolves them one at a time until the way is clear.

It plans, it does not do. Every ticket holds a question whose resolution is a decision, not a slice of a build to execute, and the map is finished when nothing is left to decide before someone goes and builds the thing. That one rule is what separates a wayfinder ticket from an ordinary implementation ticket, and it is the rule agents break most often. When the map clears, wayfinder hands off; it does not carry on into code.

## When to reach for it

You invoke this by typing `/wayfinder` — the agent won't reach for it on its own.

It is the heaviest, densest flow in the set, so the trigger is narrow: the effort has to be genuinely larger than one agent session can hold, and the route to the destination has to be foggy. The split is a clean one: `/grill-with-docs` for single-session planning, `/wayfinder` for multi-session planning.

| What you have in front of you | What to run |
| --- | --- |
| A well-scoped feature you can settle in one sitting | grill-me, or grill-with-docs when there is a codebase |
| A greenfield project, or a build spanning many sessions, with the route still unclear | `/wayfinder` |
| A thread where the deciding is already done | to-spec — skip straight past the map |
| A cleared wayfinder map | to-spec, then to-tickets and implement |
| An existing session that has already grown too big | say "hand off to `/wayfinder`" — handoff bridges into a map as well as out of one |

Greenfield is not a requirement. Wayfinder is used routinely on legacy and half-built codebases, and it is arguably sharper there, because a lot of the fog is "what is already true here" rather than "what should we do".

## Prerequisites

The map and its tickets live on the repo's configured issue tracker, so the user-invoked `setup-matt-pocock-skills` Skill must have established the tracker contract first. If that configuration is absent, Wayfinder stops and tells the user to run setup explicitly; it does not silently choose local markdown or start another user-invoked Skill on the user's behalf. The setup output includes the "Wayfinding operations" needed for child tickets, blocking edges, frontier queries, claim behavior and type representation. Label-based trackers additionally use the workflow-role mapping for `wayfinder:*`; local markdown records canonical `Type:` values directly and does not require those label mappings.

The tracker is not decoration. Blocking is what renders the frontier visually in the tracker's own UI, and a tracker without native dependency links — a self-hosted Gitea, say — degrades wayfinder to inferring blockers from the map text, which works but needs closer supervision.

## The map, the fog, and the frontier

The **map** is one canonical tracker artifact: a map issue carrying workflow role `wayfinder:map` on label-based trackers, or `map.md` in local markdown. Where a label is used, its actual string is resolved through `docs/agents/triage-labels.md`. Its tickets are its child work items. It is an **index, not a store** — a decision lives in exactly one place, its ticket, and the map only gists it and links. A session loads the map at low resolution and zooms into individual tickets on demand, which is what lets a map keep growing without every session paying for its whole history.

Four things live on it:

- **Destination** — what reaching the end of this map looks like. Naming it is the first act of charting, before any ticket exists, because the destination fixes the scope every ticket is measured against.
- **Decisions so far** — one line per closed ticket, each linking to where the detail actually lives.
- **Not yet specified** — the **fog of war**. Decisions you can tell are coming but cannot yet phrase sharply. The test for fog versus ticket is whether you can state the question precisely *now*, not whether you can answer it. Resolving a ticket clears the fog ahead of it and graduates whatever is now specifiable into fresh tickets.
- **Out of scope** — work ruled beyond the destination. Fog only ever gathers *toward* the destination, so out-of-scope work is closed and never graduates.

The **frontier** is the open, unblocked, genuinely unclaimed tickets — the edge of the known. Claiming follows the active tracker contract. Assignment is sufficient only when worker identities are distinct; when several Agents share one tracker identity or local status text, assignment/status is visibility rather than mutual exclusion, so use the coordinating workflow's deterministic claim primitive or keep Wayfinder serial. Tickets are referred to by name throughout, never by a bare `#42`; a wall of issue numbers is illegible in narration.

## The four decision-ticket types

Every ticket has one canonical Wayfinder type (`research`, `prototype`, `grilling`, or `task`) and is either **HITL** — worked with a human who speaks for themselves — or **AFK**, driven by the agent alone. Label-based trackers resolve the matching `wayfinder:<type>` workflow role before mutation; local markdown writes the canonical type into `Type:` directly. A HITL ticket only resolves through the live exchange; an agent that answers its own grilling questions has broken it.

| Type | Mode | Reach for it when | Resolved by |
| --- | --- | --- | --- |
| `grilling` | HITL | The default. The question can be settled by talking it through. | load required `grilling` + `domain-modeling`, then resolve in a fresh focused context |
| `prototype` | HITL | "How should this look" or "how should this behave" — a question talking cannot settle. | load `prototype`, with the built artifact linked from the ticket as an asset |
| `research` | AFK | A fact outside the working directory is blocking a decision. | load `research`; isolated worker when available, synchronous current-session fallback otherwise |
| `task` | Either | Nothing to decide, but manual work blocks a decision — provisioning access, signing up for a service, moving data so its shape can be seen. | The agent alone where it can, otherwise a precise checklist for the human |

`task` is the only type that *does* rather than decides, and it earns its place by unblocking a decision — never by delivering a piece of the destination. This is the type that goes wrong most often in practice: agents interpret it as an implementation step and start writing product code inside the map.

Tickets still follow the dependency graph and claim contract, but a ticket closure is a **checkpoint rather than a forced session stop**. One session may therefore work through several ordinary tickets sequentially: after each closure the agent reports the decision, refreshes the frontier, and prepares the next already-authorized ticket before continuing. Research remains the natural case for safe concurrent work when isolated workers and distinct claims are available.

## Common questions

**How is this different from `/grill-with-docs`? Which should I start with?**
Session count, not project size. `/grill-with-docs` is single-session planning; wayfinder is multi-session planning. If you can hold the whole thing in one conversation, grilling is the cheaper and better tool, and wayfinder is genuinely slower and denser for that case. The community shorthand that has settled on it: wayfinder only makes sense if the work doesn't fit into a single session. This is by a distance the most-asked wayfinder question, and it keeps being asked because the descriptions do not tell you where your own task sits on that line — you have to judge the session count yourself.

**When it asks for the "destination", does it mean the end of this session or the end of everything?**
The whole map — the destination of the entire map, not just the initial session. The question reads ambiguously because wayfinder is by definition a multi-session tool, so a session-scoped answer never makes sense. Typical destinations are a spec to hand off, a decision to lock before planning starts, a proof of concept, or a change made in place like a data migration.

**The map is cleared. Why do I still need `/to-spec` and `/to-tickets` — didn't wayfinder already write the spec and make the tickets?**
No. Wayfinder's tickets are decision tickets, and by the time the map closes they are all closed too. What is left is a map full of linked decisions, which is not a build plan. to-spec collapses those linked decisions into one spec — `/to-spec #<map_issue>` — and to-tickets slices that into tracer-bullet implementation tickets. Looping the map straight into implement skips the collapse and throws the linked detail away. Go straight to implementation only when the effort turned out genuinely small. People do run the abbreviated pipeline and report it working; the two extra steps buy you an explicit spec artifact that a reviewer or a colleague can read, which matters more the less solo you are.

**My agent started writing production code in the middle of a wayfinder session.**
The most-reported failure with this skill, and there is a real hole behind it. Wayfinder's "plan, don't do" default can be overridden in the map's **Notes** — but the Notes are written by the agent, so the constraint and its exemption live in the same file the constrained party owns. One user watched an agent write "this map carries execution" into its own Notes and then read it back in later sessions as its own licence, building on a live server. There is no hard in-skill stop for "I meant the default." Until there is: read the Notes on any map you didn't chart yourself, keep implementation in its own sessions, and treat any `wayfinder:task` that looks like a slice of the build as mis-typed.

**I charted 27 tickets, and by the time I got to the thirteenth, the rest no longer made sense.**
A real and repeatedly-reported outcome, verbatim from a field report. Wayfinder's default instinct is to plan comprehensively, and a map whose later tickets rest on assumptions the earlier ones invalidate is exactly the waterfall trap the skill is accused of. Two things push back on it. Scope the map to a bounded destination rather than to the whole product — practitioners consistently report that maps scoped to one defined epic behave better than a sprawling "implement V1", and planning something very big is not the goal in the first place — shipping small increments is. And prototype aggressively: the whole reason the route stays current is that uncertainty is flushed out by cheap concrete artifacts before implementation depends on it. Wayfinder is "prototypemaxxing", not "planmaxxing".

**Can I work several tickets in parallel?**
The frontier is built to show what is takeable, but parallelism is valid only when both the dependency graph and the claim mechanism are safe. One-at-a-time remains the default for HITL `grilling` and `prototype` tickets because parallel sessions can ask stale questions or race on user decisions. AFK `research` tickets are the natural parallel case: use isolated workers only when the current harness actually provides them and the tracker can distinguish claims; otherwise resolve them serially. A shared assignee or `Status: claimed` line is not enough mutual exclusion for several Agents sharing one identity.

**Do I have to use GitHub Issues?**
No — any issue tracker works. GitHub is the best-supported path because its native sub-issues and blocking relationships are what make the frontier visible without opening the map; GitLab, Linear, Jira and local markdown all get used. Two honest caveats. A tracker with no native blocking means the dependency graph is inferred from text and needs manual correction. And local markdown puts the artifacts in your repo, which is not recommended: storing this material in the repo tends to lead to accidental persistence. Open-source maintainers hit the opposite problem — public trackers filling with agent-generated planning tickets — and tend to choose local markdown anyway.

**The grilling is exhausting. Every question is three paragraphs long.**
This is the sharpest live complaint about wayfinder and it is not resolved. The decomposition one user gave: the verbosity itself causes decision exhaustion, and the length strips out *why* a question is being asked, so you lose the chain from decision to decision as the map gets longer. The verbosity can vary by model/executor. If a standing project preference is needed, put a plain-language instruction in the project's canonical Agent instructions; executor-level reasoning controls may also be adjusted when the current harness exposes them. Expect to spend real thought here regardless — the amount of thinking wayfinder demands from you is not a defect, it is most of what it is for.

**A decision I already closed turned out to be wrong. Do I edit the old ticket or make a new one?**
There is no official guidance, and the agent's instinct is unhelpful: it tends to design around the bad decision rather than challenge it, so you have to steer manually. What does work is telling wayfinder plainly what changed — it updates the map, revises the affected tickets, and comments on already-closed ones. Scope changes mid-map are recoverable. A map you *designed* to change is a scoping smell.

**Where did `decision-mapping` go?**
It is this skill, renamed to `wayfinder` in v1.1 and invoked as `/wayfinder`. "Decision map" was jargon and was also inaccurate, since only one of the four ticket types is really a decision by itself. The reframe gave the skill one coherent vocabulary — destination, fog of war, frontier, the map — instead of an invented term layered on top. The unit kept the "decision" word, though: a **decision ticket** is what a wayfinder ticket is called, precisely to stop people reading it as an implementation ticket.

## It's working if

- The destination is written down and agreed before a single ticket exists.
- Every open ticket reads as a question. Any ticket that reads "build the X" is either mis-typed or belongs downstream of the map.
- You can look at your tracker and see which tickets are takeable without opening the map — that is the frontier rendering itself through native blocking.
- Each resolved ticket gets a visible checkpoint: the agent posts the answer as a resolution comment, closes it, leaves one line on the map's *Decisions so far*, tells you what changed, refreshes the frontier, and prepares the next ticket without asking for redundant permission. It waits only when the next ticket actually needs human input, the frontier is blocked, scope must change, or the current context is no longer reliable.
- **Not yet specified** shrinks over time. A patch of fog that graduates into a ticket disappears from that section rather than living in both places.
- When the opening breadth-first grill turns up no fog at all, the skill stops and tells you the effort is small enough to skip the map.
- The session that finishes the map hands you toward a spec, not a pull request.

## Where it fits

`wayfinder` is a **situational on-ramp**, not the default front door. The grill-led idea → ship chain is still where most work starts; wayfinder is what you climb onto when the idea is too big to hold in one session, and it merges back onto that chain at to-spec, because a cleared map hands off rather than builds.

Underneath, it is mostly other Skills wearing Wayfinder's scheduling. Those are real dependencies, not prose aliases: Grilling tickets load `grilling` + `domain-modeling`, Prototype tickets load `prototype`, and Research tickets load `research`. If a branch dependency cannot be loaded, Wayfinder reports the gap rather than simulating the missing method. Research may use an isolated worker when available, but Wayfinder does not require one. `handoff` is the bridge for work that must travel independently; `ask-matt` routes the wider set.
