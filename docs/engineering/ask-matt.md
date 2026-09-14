## What it does

`ask-matt` is the router over the skills in this repo. You describe the situation you are in — an idea you cannot start, a pile of incoming bug reports, a session that has run long — and it names the skill or the sequence of skills that fits, plus where the human decisions in that sequence sit.

It recommends and stops. It does not grill, write a spec, open a file or fire the skill it just named; what you get back is the next thing to type, and you type it. This Akira-maintained Matt series keeps the flow as the engineering backbone and carries its Akira execution extensions in the same repository: `/ask-akira` provides explicit rapid/emergency/competition execution policy, while `/parallel-coordinator` plus `parallel-execution` add coordinated multi-Agent execution without replacing Matt planning, TDD, review, or implementation.

## When to reach for it

You invoke this by typing `/ask-matt` — the agent won't reach for it on its own.

| Your situation | What the router gives back |
| --- | --- |
| An idea, and no idea where to start | The head of the main flow, whether the build is small enough to skip the spec, and after `to-tickets` whether execution is ordinary or coordinated multi-Agent |
| Bugs and requests arriving from other people | The triage on-ramp, and why tickets you generated yourself don't belong on it |
| Two skills that look interchangeable | The line between them, and it is usually one concrete test rather than a matter of taste. grill-me or grill-with-docs turns on whether you are in a working directory; grill-with-docs or wayfinder turns on whether the effort fits one session |
| A long session and a decision about the context | The ordered tree over the five options at a phase boundary |
| A skill you have already picked | Nothing useful. Invoke that skill directly. |

## Prerequisites

The router names skills; it does not install them. Everything it points at has to be installed for the recommendation to be actionable. Its maintained map is the stable Engineering / Productivity set plus the explicitly maintained `ask-akira`, `parallel-coordinator`, and `parallel-execution` extensions; it does not scan arbitrary installed skills.

The tracker-dependent routes — triage, `to-spec`, `to-tickets`, `implement` — assume setup-matt-pocock-skills has already configured an issue tracker in the repo. The router will happily recommend them before that has happened.

## Flows, not skills

The word the skill gives you to think with is **flow**: a path *through* the skills, not a single one. Naming your situation places you on a flow at a step, which is a different answer from "here is the skill that matches your keywords". Four kinds of route exist, and the skill itself carries them in full:

- **The main flow**, idea to ship. Grill, spec, tickets, implement, review, with three branches inside it: a prototype detour when a question needs runnable code to settle; the spec-and-tickets split, which only earns its cost when the build spans more than one session; and, after `to-tickets`, an execution-mode split between ordinary `/implement` runs and Akira coordinated multi-Agent execution.
- **Akira execution extensions**, still inside this fork: `/ask-akira` changes execution policy only when the user explicitly requests rapid/emergency/competition, while `/parallel-coordinator` and `parallel-execution` add durable multi-Agent coordination around the existing Matt implementation loop.
- **On-ramps**, for a situation that generates work and then merges onto the main flow: incoming bug reports, something broken, or an effort too foggy and too large to hold in one session.
- **Standalones**, off every flow, reached for on their own terms — the prototype, the questionnaire, the merge conflict you are already sitting in.
- **A vocabulary layer underneath**, the two references the other skills pull in when the words rather than the process are the problem.

## The phase boundary

The other idea it hands you is the **phase boundary**. A phase is a coherent chunk of work — grilling, implementation, review, QA — and the boundary between two of them is where context strategy belongs. Matt chooses the semantic move; the current Agent harness chooses the concrete mechanism.

| Move | Take it when |
| --- | --- |
| **Continue** | The next phase materially needs the full current reasoning and the context remains reliable |
| **Fresh context** | Durable artifacts contain everything the next phase needs, so prior conversational history is disposable |
| **Handoff artifact** | Work must travel to another harness, directory/repository, collaborator, or independently resumable thread |
| **Isolated worker** | A separable side task can run without steering and the current harness genuinely provides isolation |
| **Summary transfer** | The next phase still needs selected reasoning but carrying the full context is undesirable |

Commands such as `/clear`, `/compact`, new-session/fork controls and sub-agent tools are possible executor-specific adapters for those moves; they are not universal Matt requirements. The decision order still prefers preserving primary-source reasoning when it is genuinely needed, and otherwise sheds context deliberately rather than by a fixed token threshold.

## Common questions

**Isn't there just a list of the skills in the right order?**

People keep asking for one in the README. This skill is that list — it is what it exists for. A static table would say `wayfinder → to-spec → to-tickets → implement → code-review` and be wrong for most situations, because the interesting parts are the branches — is there a codebase, does the build span sessions, can this question be settled by talking. The honest cost is that the router is hand-maintained and lags the repo. `/grilling` and `/resolving-merge-conflicts` both shipped long before the router named them.

**It told me half the skills aren't installed.**

A known class of false negative comes from invocation metadata: a user-invoked skill can be absent from the model-visible skill list even though it is installed. The router must not treat the current prompt-visible list as an exhaustive installation inventory. Check the machine registry at `~/.agents/skills/<name>` when availability matters; if the registry entry exists, the current executor decides how that installed skill is exposed or invoked.

**It described a skill's behaviour, and the skill doesn't do that.**

Also real, also unfixed. The router answers from its own one-line summary of each skill rather than from the skill. One detailed report tracked three instances in a single session, including a recommendation to skip to-spec on the strength of the gloss "turn the thread into a spec" — `to-spec/SKILL.md` was never opened. In every case it verified only after the user pushed back, and never on its own initiative. Skipping `to-spec` there cost a real seam check, and the tickets that came out undercounted the work. When the router asserts something load-bearing about another skill, ask it to open that `SKILL.md` first. The same applies to questions the map does not cover at all, such as whether to use plan mode: that answer is the model's inference, not something written down here.

**Why is it prose instead of a numbered checklist?**

A fair complaint, filed as an open issue arguing that most of the routing is deterministic and the narrative makes it hard to scan. Nothing stops you asking for the compressed form — "just give me the sequence" gets you the sequence. What the prose is carrying is the conditional half: the branches, where a human decision is expected, and where context should continue, restart, hand off, isolate a side task or transfer a summary. A flat checklist drops exactly that.

**Can it route over my own skills, or another author's?**

Not generically. Three separate proposals have asked for a router that scans your local `skills/` directory and recommends from whatever is installed; `ask-matt` still does not do that. This fork has one deliberate integration point for Akira's Parallel Coordinator because that coordinator extends Matt's execution stage without replacing Matt's planning, TDD, review, or implementation methods.

**It told me to edit a SKILL.md.**

Editing an installed runtime Skill is not a durable project-local customization. Akira-managed Skills point into a shared remote checkout, so later source updates can replace those edits for every project using that Skill. Put project-specific standing behaviour in the project's Agent instructions or say it in the invocation. If the Matt Skill itself should change for everyone, change this canonical repository, review it as a product change, and publish that revision normally.

**It named a skill I don't have, or missed one I do.**

Check the changelog for a rename before assuming it is gone. `writing-great-skills` became writing-for-agents with no alias, `to-prd` became to-spec, and `pathfinder` became wayfinder. Four skills were retired outright into the skills that absorbed them: `ubiquitous-language`, `design-an-interface`, `qa` and `request-refactor-plan`. The reverse case is the router's own lag, above.

## It's working if

- It ends by naming what to type and stops there, instead of starting the work itself.
- The route it gives back identifies the important phase boundaries and whether to continue, start fresh, hand off, isolate a side task or transfer a summary, rather than assuming one product's context commands.
- Where two skills are close, it says which one and why the other is wrong for you.
- Any claim it makes about another skill's behaviour shows up in the trace as it reading that skill's `SKILL.md`.
- You recognise your own situation in what it hands back, rather than the nearest generic scenario.

## Where it fits

`ask-matt` is a **standalone router** that sits over the Matt set plus Akira's maintained execution extensions. It is never a step in a chain; it points into the chain, can identify `/ask-akira` when the user explicitly wants a special execution policy, and chooses the ordinary-versus-Parallel execution branch after `to-tickets`. From here you most often land on grill-with-docs, the head of the main flow, or triage, the on-ramp for work that arrived rather than work you started.

It is a secondary source over the skills it describes. Where the router and a `SKILL.md` disagree, the `SKILL.md` is right.
