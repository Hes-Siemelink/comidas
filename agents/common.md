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
- **Never include AI tool references** in commit messages (e.g., "Generated with Claude Code", "Co-Authored-By: Claude").

**Examples:**
- ✅ Good: "Complete story add-chakra-ui-i18next"
- ❌ Avoid: "Move accepted story to done folder, story was accepted by Product Owner"

### Documentation / Agent Instruction Commits

For commits that update project documentation or agent workflows:
- **Title**: Use "Agent instructions" (≤50 chars)
- **Body**: List specific documentation changes as bullet points
- **Focus**: Workflow updates, guideline additions, process clarifications

**Examples:**
- ✅ "Agent instructions\n\n- Add code cleanup guidelines\n- Define commit format standards"


### Code Cleanup / Chore Commits

For maintenance commits that improve code quality without functional changes:
- **Title**: Use "Code cleanup" (≤50 chars)
- **Body**: List specific changes as bullet points
- **Test**: Always run tests before committing to ensure no functional impact
- **Focus**: Remove unused dependencies, fix formatting, organize imports, etc.

**Examples:**
- ✅ "Code cleanup\n\n- Remove unused Jest dependencies\n- Fix import organization"
- ❌ "Verified all tests still pass" (testing is implied)

## Moving Files

- Use `git mv` when moving files to properly track the move in Git.
- Alternative: Use `mv` then `git add` both the new location AND `git rm` the old location.
- Never use regular `mv` alone and only add the new location - this creates dangling files in Git.

---

Add further common instructions here as the project evolves.
