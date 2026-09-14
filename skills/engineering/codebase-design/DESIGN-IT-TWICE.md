# Design It Twice

When the user wants to explore alternative interfaces for a chosen deepening candidate, produce **at least three genuinely different designs** before selecting one. The technique comes from Ousterhout's "Design It Twice": the first plausible interface is rarely the only useful shape.

Use the vocabulary in [SKILL.md](SKILL.md) — **module**, **interface**, **seam**, **adapter**, **leverage**, **locality**.

## 1. Freeze the problem frame

Before generating alternatives, write one shared design brief containing:

- the behaviour the module must hide;
- constraints every interface must satisfy;
- the dependencies involved and their category from [DEEPENING.md](DEEPENING.md);
- invariants, ordering constraints and important error modes;
- the project-domain vocabulary from `CONTEXT.md` when available;
- a small illustrative usage sketch that clarifies the problem without committing to one design.

All alternatives must use this same frozen frame so differences come from design choices rather than different assumptions.

## 2. Generate independent alternatives

Produce at least three substantially different interfaces. Use different design pressures, for example:

1. **Minimum surface** — aim for very few entry points and high leverage per entry point.
2. **Flexibility** — support the important variation without leaking implementation detail.
3. **Common-path optimisation** — make the dominant caller simple while keeping invariants explicit.
4. **Ports and adapters**, when a true cross-seam dependency justifies it.

When the current harness genuinely provides isolated worker contexts, these alternatives may be generated independently and in parallel. Give each worker the same frozen frame plus one design pressure, and tell it not to delegate further. If isolated workers are unavailable, generate the alternatives sequentially in the current context, keeping each proposal separate and deliberately starting from a different design pressure. Do not claim the sequential fallback is independent or parallel.

Each alternative must state:

1. interface: types, methods, parameters, invariants, ordering and error modes;
2. one realistic caller example;
3. what complexity is hidden behind the seam;
4. dependency/adaptor strategy;
5. trade-offs in depth, leverage and locality.

## 3. Compare before choosing

Present the alternatives separately, then compare them on:

- **depth** — capability per unit of interface a caller must learn;
- **locality** — where future change and debugging concentrate;
- **seam placement** — whether the interface sits at the right change boundary;
- **dependency honesty** — whether adapters correspond to real variation rather than speculative indirection;
- **caller ergonomics** — especially the dominant use case.

Give a recommendation and explain why it is strongest. A hybrid is acceptable when it combines compatible strengths, but do not blur all alternatives into one compromise merely to avoid choosing.
