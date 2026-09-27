# Skill mechanics

The skill-specific branch of [`writing-for-agents`](SKILL.md): what changes when the document is a skill — frontmatter, the invocation choice, and router skills. Everything else about writing it is the universal reference in `SKILL.md`.

## Invocation

Two choices, trading the two loads. Keep the canonical `SKILL.md` frontmatter within the portable Agent Skill fields; invocation permission is a product-level policy whose enforcement belongs to executor-supported metadata rather than private top-level frontmatter keys.

- A **model-invoked** skill keeps a model-facing `description`, so the agent can fire it autonomously — and other skills can reach it. You can still type its name: model-invocation always _includes_ user reach. The description is the skill's top-level context pointer, forced to stay loaded at all times — permanent context load in exchange for discoverability. A model-invoked skill whose content is all reference is also one home for shared reference: another skill can invoke it, so reference needed by several skills lives in one place. For OpenAI packaging, `agents/openai.yaml` must not prohibit implicit invocation.
- A **user-invoked** skill is started only by explicit user action. Its `description` is human-facing — a compact summary for browsing or explicit invocation, not a trigger list. For OpenAI packaging, set `policy.allow_implicit_invocation: false` in `agents/openai.yaml`. Other executors use their own supported policy surface; if an executor cannot enforce the restriction, state that limitation rather than inventing a canonical `SKILL.md` field.

Pick model-invocation only when the agent must reach the skill on its own, or another skill must. If it only ever fires by hand, make it user-invoked and keep the executor policy aligned with that intent.

Shared reference that two user-invoked skills both need can live in neither as an autonomous dependency: push it to a plain file outside the skill system that both can point at.

## Splitting by invocation

The invocation cut of splitting (the sequence cut lives in `SKILL.md`): split off a model-invoked skill when you have a distinct leading word that should trigger it on its own — a trigger word you actually use in your prompts — or another skill must reach it. You pay context load for the new always-loaded description, so that independent reach has to be worth it.

## Router skills

When user-invoked skills multiply past what you can remember, that piled-up cognitive load is cured by a **router skill**: one user-invoked skill that names the others and when to reach for each, so the human has one skill to remember instead of many. It can only hint, never fire another user-invoked skill: executor policy still requires explicit user action to start that target.
