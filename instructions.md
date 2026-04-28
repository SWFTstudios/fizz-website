# Engineering Workflow Instructions

Use this workflow for all changes in this project.

## 1) Explain before editing

Before changing files, state:
- the issue/feature being solved
- files likely affected
- change type using commit-aligned categories (`fix`, `feat`, `refactor`, `style`, `docs`, `chore`, `test`, `perf`)
- mapping note: use `fix` for bug fixes and `chore` for config/tooling/maintenance updates

## 2) Branch workflow

Use:
- `elombe/<issue-number-or-task>-<short-description>`
- if no issue number: `elombe/task-<short-description>`

Examples:
- `elombe/1-fix-login-error`
- `elombe/task-update-footer-copy`

## 3) Keep changes small and trackable

Do not mix unrelated work in one change set. Separate:
- bug fixes
- features
- styling
- refactors
- dependency updates
- documentation

## 4) Plan before coding

Before implementation, include:
- goal
- files to change
- step-by-step approach
- risks / checks
- test strategy

## 5) Changelog after edits

After changes, summarize:
- files changed
- what changed per file
- why it changed
- possible side effects
- local test steps

## 6) Commit messages

Format:
- `type(scope): short description`

Allowed types:
- `feat`
- `fix`
- `refactor`
- `style`
- `docs`
- `chore`
- `test`
- `perf`

## 7) Protect main

Default flow:
- `main`
- create feature branch
- make changes
- test locally
- commit
- push branch
- open PR
- review
- merge to `main`

Avoid direct work on `main` unless explicit emergency hotfix.

## 8) Diff and safety checks before commit

Review:
- `git status`
- `git diff`
- changed file list
- accidental secrets/API keys
- large unwanted files
- debug logs
- broken links
- formatting issues

## 9) Preserve working behavior

Before large edits:
- identify current behavior
- preserve working functionality
- make minimal required changes
- explain deletions/replacements and why safe

## 10) Clean history

Encourage:
- small commits
- one purpose per commit
- meaningful commit messages
- PR summaries
- README updates when usage/setup changes

## 11) PR template

Use:

## Summary
Briefly explain what changed.

## Changes Made
- Change 1
- Change 2
- Change 3

## Testing
- How it was tested locally
- Any edge cases checked

## Screenshots / Notes
Add if relevant.

## Risk Level
Low / Medium / High

## Rollback Plan
How to undo this if something breaks.

## 12) Safe debugging

When fixing bugs:
- identify likely cause first
- inspect recent changes with `git diff`, `git log`, `git status`
- avoid stacking multiple untested fixes
- fix one issue at a time

## 13) Required kickoff output for each new task

Always start with:
1. recommended branch name
2. implementation plan
3. likely affected files
4. testing checklist
5. commit message suggestion
