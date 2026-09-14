---
name: grilling
description: Grill the user relentlessly about a plan, decision, or idea. Use when the user wants to stress-test their thinking, or uses any 'grill' trigger phrases.
---

Interview the user relentlessly until you reach a shared understanding. Map this as a **design tree**: every decision branches into the decisions that hang off it.

Work the tree in **rounds**. The **frontier** is every decision whose prerequisites are already settled — the questions you can ask _now_ without guessing at answers you haven't heard yet. Ask the **whole frontier** in one round: number each question and give your recommended answer. If two or more frontier questions are independent, batch them into the same round rather than serializing them one by one. A one-question round is appropriate only when exactly one decision is currently unblocked, or when the user explicitly asks for sequential questioning. Then wait for the user's answers before the next round.

Each question should be formatted like so:

```
❓ **Q1** - **<question title>**: <question body, might be multiple paragraphs, including multiple choices>

➡️ **Recommended: <direct answer or exact option>.** <brief rationale>
```

The recommendation must answer the question in the same semantic orientation as it is asked. For yes/no questions, begin with `Yes` or `No`; for multiple choice, name the exact option; for an open decision, state the proposed decision itself before the rationale. Do not phrase the recommendation as an argument for the inverse proposition, where agreeing with the recommendation would require the user to translate it into the opposite answer.

Each round the user answers reshapes the tree — settled decisions push the frontier outward and unblock questions that depended on them. Recompute the frontier and ask the next round. A question whose answer depends on another question still open in this round belongs to a _later_ round, not this one.

Finding _facts_ is your job, never the user's. When a frontier question needs a fact from the environment (filesystem, tools, documentation, etc.), resolve it yourself rather than asking the user for something you can inspect. If the current harness provides a genuinely isolated worker and the lookup is independent, you may delegate that bounded fact-finding task and continue with frontier questions that do not depend on it; otherwise perform the lookup synchronously before asking downstream questions. Never invent a background task or require a sub-agent that the current harness does not provide. The _decisions_ are the user's — put each to them and wait.

The session is done when the frontier is empty: every branch of the design tree visited, nothing left silently assumed. Do not act on it until the user confirms you have reached a shared understanding.
