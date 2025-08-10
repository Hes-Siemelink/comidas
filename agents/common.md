# Common Agent Instructions

- Be concise in all communication and documentation.
- Only document what is necessary; avoid repetition and generic statements.
- Use markdown files in the repo for all decisions, questions, and clarifications.

## Git Commits

- Commit messages: Title ≤50 characters, concise and descriptive. Skip trivial details.
- Focus on value and intent, not mechanical actions. Diffs show what changed.

- Use `--author` flag to identify the agent making the commit: `git commit --author="Agent Name <agent@family-recipe-app>" -m "Commit message"`
- Add a blank line after the title, then a detailed body if needed.
- Stage with `git add`, commit with `git commit -m`. Amend with `git commit --amend -m`.

**Examples:**
- ✅ Good: "Complete story add-chakra-ui-i18next"
- ❌ Avoid: "Move accepted story to done folder, story was accepted by Product Owner"

## Moving Files

- Use `git mv` when moving files to properly track the move in Git.
- Alternative: Use `mv` then `git add` both the new location AND `git rm` the old location.
- Never use regular `mv` alone and only add the new location - this creates dangling files in Git.

---

Add further common instructions here as the project evolves.
