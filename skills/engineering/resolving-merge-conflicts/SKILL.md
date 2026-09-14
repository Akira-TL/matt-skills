---
name: resolving-merge-conflicts
description: "Use when you need to resolve an in-progress git merge/rebase conflict."
---

1. **See the current state** of the merge/rebase. Check git history, the conflicting files, and the full working-tree/index status. Record any pre-existing unrelated modifications or staged paths so resolving the conflict never sweeps them into the operation by accident.

2. **Find the primary sources** for each conflict. Understand deeply why each change was made, and what the original intent was. Read the commit messages, check the PRs, check original issues/tickets.

3. **Resolve each hunk.** Preserve both intents where possible. Where incompatible, pick the one matching the merge's stated goal and note the trade-off. Do **not** invent new behaviour. Always resolve; never `--abort`.

4. Discover the project's **automated checks** and run the checks justified by the conflicted scope — typically typecheck and focused tests, plus formatting where the repository requires it. Fix anything the merge/rebase resolution broke, but do not absorb unrelated pre-existing worktree changes into the resolution.

5. **Finish the existing Git operation without changing its ownership semantics.** Stage only the resolved conflict paths and any additional files changed specifically to make that resolution valid; preserve unrelated pre-existing staged/unstaged work exactly as found. For a rebase, use the normal `git rebase --continue` sequence after staging each resolved set — do not manufacture a separate ad-hoc commit. For a merge, complete the merge commit through the repository's required guarded commit path when one exists; otherwise use the repository's normal merge-completion mechanism. Never force-push or rewrite unrelated history as part of conflict resolution.
