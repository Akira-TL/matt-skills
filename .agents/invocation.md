# Model-invoked vs user-invoked

Every `SKILL.md` in this repo is a Skill. The primary invocation axis is **who may start it**:

- **User-invoked** — only an explicit user action starts the Skill. Keep canonical `SKILL.md` frontmatter portable; for OpenAI set `policy.allow_implicit_invocation: false` in `agents/openai.yaml`, and use the equivalent supported policy surface on other executors. The `description` is human-facing: a compact summary for browsing or explicit invocation, not a trigger list.
- **Model-invoked** — model or user may start the Skill. Keep the `description` model-facing with enough trigger phrasing for reliable routing; OpenAI metadata must not prohibit implicit invocation. The test is: _could the model usefully reach for this autonomously?_

Different Agent executors expose invocation policy differently. The repository keeps the portable `SKILL.md` and executor metadata semantically aligned, but does not encode executor-private invocation keys as top-level canonical frontmatter. The engineering method must not depend on one executor's command syntax or UI.

A user-invoked Skill may depend on model-invoked Skills. No Skill may start a user-invoked Skill unless that target was already entered by explicit user action in the current flow; model-invoked Skills may recommend the user-invoked Skill and pass forward context, but must stop short of starting it on the user's behalf.

Bucket `README.md`s and the top-level `README.md` group entries into **User-invoked** and **Model-invoked**.

## Dependencies between them

Cross-Skill dependencies are expressed by **Skill name and capability contract**, not deep `../other-skill/FILE.md` cross-references and not one executor's slash-command syntax. Shared reference docs stay inside the Skill that owns them.

When one Skill depends on another:

1. distinguish **required** dependencies from **conditional** branch dependencies;
2. before relying on the dependency's behavior, load/follow the canonical installed Skill through the current executor's Skill mechanism;
3. naming a Skill in prose is not evidence that its instructions were loaded;
4. if a required dependency cannot be loaded, fail closed and report the missing capability rather than recreating the method from model memory;
5. if the machine-level Skill itself is missing, hand that capability gap to the `akira` Router for normal source/user-approval handling rather than locally copying another Skill's rules;
6. conditional dependencies are loaded only when that branch is actually taken, preserving progressive disclosure.

A wrapper must never claim that `grilling`, `domain-modeling`, `tdd`, `code-review` or another dependency ran unless the dependency's canonical instructions were actually loaded and followed.

## Passive vs active domain work

Merely _reading_ `CONTEXT.md` for vocabulary is a one-line prose pointer, not the `domain-modeling` skill. Only the active build/sharpen discipline (challenge terms, edge-case scenarios, write ADRs, update `CONTEXT.md` inline) is `domain-modeling`.
