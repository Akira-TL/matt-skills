# code-review

## What it does

`code-review` reviews committed changes between `HEAD` and a fixed point along two deliberately separate axes:

- **Standards** — does the change follow this repository's documented engineering rules and the Skill's baseline code-smell heuristics?
- **Spec** — does the change implement what the originating issue/spec actually asked for, without omissions or scope creep?

The axes stay separate so one kind of success cannot hide failure in the other.

## Review target

The caller supplies a fixed point: a commit, branch, tag, `main`, `HEAD~5`, or another Git revision. The Skill verifies that the ref resolves and that `git diff <fixed-point>...HEAD` is non-empty before review begins.

This means the intended target is a **committed Git state**. `implement` therefore commits a completed atomic implementation slice before invoking `code-review`. Staged, unstaged and untracked files are not silently folded into the review target.

## Sources

### Standards axis

Read repository-owned standards such as `AGENTS.md`, `CONTRIBUTING.md`, coding standards and relevant ADRs. Repository rules override generic heuristics.

The built-in baseline is a set of Fowler-style code-smell heuristics such as Mysterious Name, Duplicated Code, Feature Envy, Data Clumps, Primitive Obsession, Repeated Switches, Shotgun Surgery, Divergent Change, Speculative Generality, Message Chains, Middle Man and Refused Bequest. These are judgement calls, not automatic violations.

### Spec axis

Find the originating work source in this order:

1. issue/ticket references in the commits;
2. a path supplied by the caller;
3. a matching spec under the repository's normal spec locations;
4. ask the user if the source cannot be established.

If there is genuinely no spec, skip the Spec axis and say so rather than inventing requirements.

## Isolation and harness portability

The method requires **two separate review perspectives**, not a particular Agent product.

First freeze one Review Packet containing the fixed point, diff command, commit list, standards sources, smell baseline and spec source.

- If the current harness genuinely provides isolated reviewer contexts, run Standards and Spec in separate contexts. They may run in parallel when useful. Each reviewer receives only its assigned brief and must not invoke `code-review` recursively or delegate another reviewer.
- If isolated reviewer contexts are unavailable, run the same Standards and Spec briefs sequentially in the current context from the frozen Review Packet. Label the output **non-isolated two-axis review**. Do not describe two passes in one context as independent reviewers.

Isolation increases independence; it is not a precondition for the Skill to function.

## Output contract

Return two sections:

```text
## Standards
...

## Spec
...
```

Every Standards finding cites either a repository rule or a named smell plus the relevant hunk. Every Spec finding cites the corresponding requirement. Keep the axes separate and do not rank one against the other.

End with:

- finding count for each axis;
- worst issue within each axis, if any;
- execution mode: isolated reviewers or non-isolated sequential fallback.

Findings are review claims, not unquestionable facts. Before changing code, verify the cited file/hunk/spec line is real and still applies to the reviewed commit.

## Where it fits

`code-review` is the review step after an atomic implementation commit and can also be invoked independently on an existing branch or PR. A review finding that requires code changes becomes a separate atomic fix, followed by the focused validation/review needed to close that finding.
