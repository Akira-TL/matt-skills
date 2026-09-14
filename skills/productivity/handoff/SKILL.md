---
name: handoff
description: Summarise the current working context into a portable handoff document for another agent, harness, directory, repository, or collaborator to pick up.
argument-hint: "What will the next session be used for?"
disable-model-invocation: true
---

Write a portable handoff document summarising the current working context so a fresh agent can continue the work somewhere else. Save to the temporary directory of the user's OS - not the current workspace.

Include a "suggested skills" section in the document, which suggests skills that the agent should invoke.

Do not duplicate content already captured in other artifacts (specs, plans, ADRs, issues, commits, diffs). Reference them by path or URL instead.

Redact any sensitive information, such as API keys, passwords, or personally identifiable information.

If the user passed arguments, treat them as a description of what the next session will focus on and tailor the doc accordingly.

After saving the handoff document, include its full path in the completion reply and add a fenced `text` block containing a ready-to-paste pickup prompt for the next agent. The pickup prompt must include the full handoff path and tell the next agent to read the document and continue the work, tailored to the user's stated next-session focus when one was provided. Keep this pickup prompt in the completion reply only; do not write it into the handoff document.
