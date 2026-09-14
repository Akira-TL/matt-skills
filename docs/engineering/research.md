# research

## What it does

`research` answers a focused engineering question from the sources that own the answer, then leaves a cited Markdown artifact that another session, ticket, spec, or reviewer can inspect.

The defining contract is **primary-source research + durable cited output**. Background execution is optional; it is not part of the semantic definition of the Skill.

## When to use it

Use `research` when an engineering decision is waiting on a fact outside the current working tree, for example:

- how an external API or SDK actually behaves;
- what an official specification requires;
- whether a feature exists in a particular version;
- what upstream source code does;
- which documented limitation or compatibility boundary applies.

If the open question is a decision to make with the user rather than a fact to establish, use `grilling` / `grill-with-docs`. If the question can only be answered by executing a local design, use `prototype`.

## Execution model

The Skill is harness-agnostic.

1. First narrow the question to a checkable answer boundary.
2. Prefer official documentation, specifications, first-party APIs and authoritative source code over secondary summaries.
3. When the current harness genuinely provides an isolated/background worker and the research unit is independent, it may be delegated once so the caller can keep unrelated context clean. The delegated worker performs the research directly and must not recursively invoke `research` or create another research worker.
4. When no isolated worker exists, perform the same work synchronously in the current context. Do not fail merely because a background-agent primitive is absent, and do not claim asynchronous work was started when it was not.
5. Write one Markdown artifact. Cite the owning source for every material claim and mark unresolved points explicitly.
6. Follow the repository's existing location convention for research/notes. If none exists, choose a sensible temporary or project location and report the exact path.

Parallelism changes scheduling, not evidence quality or completion criteria.

## Source discipline

A source is useful here because it is authoritative for the claim being made, not because it ranks highly in search results. Prefer the narrowest source that owns the fact:

- an API claim → official API documentation or implementation source;
- a language/runtime rule → official specification or documentation;
- a version-specific behaviour → release notes, tagged source or versioned documentation;
- an upstream implementation fact → the upstream repository at the relevant revision.

Secondary material can help locate the primary source but should not silently replace it when the primary source is available.

## Output contract

A successful run leaves enough evidence for another Agent or human to verify the answer without replaying the whole investigation:

- the exact question;
- concise findings;
- source links or stable source locations attached to the claims they support;
- relevant version/revision context;
- unresolved uncertainty and what would settle it;
- the artifact path.

The research artifact is evidence for later engineering reasoning, not an architectural decision by itself. Durable decisions still belong in the project's normal spec/ADR/domain-model workflow.

## Where it fits

`research` is a standalone fact-finding capability that feeds `grilling`, `grill-with-docs`, `wayfinder`, `to-spec`, debugging and design work. `wayfinder` may schedule multiple independent research tickets concurrently when the current harness supports safe isolated execution; otherwise those tickets are resolved serially with the same research contract.
