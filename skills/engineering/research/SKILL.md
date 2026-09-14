---
name: research
description: Investigate a focused engineering question against high-trust primary sources and capture the findings as a cited Markdown file in the repo. Use when the user needs docs, API, specification, source-code, or version facts established before a decision.
---

Research is defined by its source discipline and durable output, not by a particular Agent execution primitive.

1. Narrow the question enough that the run has a checkable answer boundary.
2. Investigate it against **primary sources** — official docs, source code, specifications, first-party APIs — rather than secondary retellings. Follow each material claim back to the source that owns it.
3. If the current harness actually provides an isolated/background worker and using one would keep unrelated reasoning out of the caller's context, delegate this one bounded research unit once. Tell the worker to perform the research directly and **not re-delegate or invoke `research` recursively**. If no such execution primitive exists, perform exactly the same research synchronously in the current context; never pretend a background task exists.
4. Write the findings to one Markdown file, citing the source for each material claim and marking unresolved facts explicitly.
5. Save it where the repository already keeps temporary or research notes. If no convention exists, choose a sensible location and report the exact path.

The artifact, citations, and answer boundary are required. Background execution and parallelism are optional implementation details.
