# AGENTS.md

## Purpose
- This repository is shared between Codex and Antigravity.
- Shared context must survive new sessions even when the user does not restate prior work.

## Shared Source Of Truth
- `ANTIGRAVITY_WORKLOG.md` is the primary handoff log between agents.
- `git status` and current diffs are the secondary source of truth for in-progress work.

## Collaboration Rules
- Always read `ANTIGRAVITY_WORKLOG.md` before starting implementation.
- Always run `git status` before editing files.
- If recent changes exist in files related to the task, inspect those diffs before making edits.
- Never overwrite, revert, or ignore unexplained recent changes unless the user explicitly asks for that.
- Assume Codex or Antigravity may have made relevant workspace changes even if the user does not mention them.
- If the current task overlaps with ongoing work, continue from the shared context instead of starting from scratch.

## Session Start Workflow
1. Open `ANTIGRAVITY_WORKLOG.md` and read the latest relevant entries.
2. Run `git status` to identify in-progress changes.
3. Review diffs for files related to the current task.
4. Use the worklog and diffs to recover context before making changes.

## During Work Workflow
1. Before editing a shared file, check whether it contains recent concurrent changes.
2. Keep changes compatible with existing in-progress work when possible.
3. If a decision affects future sessions, record it in `ANTIGRAVITY_WORKLOG.md`.

## Session End Workflow
1. Append a short entry to `ANTIGRAVITY_WORKLOG.md`.
2. Use the fixed worklog template sections:
   - Request
   - Scope
   - Implemented
   - Validation
   - Files
   - Notes
3. Keep entries concise and actionable so another agent can resume without re-briefing.

## Worklog Trigger
- When finishing any task, append a new entry to `ANTIGRAVITY_WORKLOG.md` using the fixed template exactly:
  `Request / Scope / Implemented / Validation / Files / Notes`

## Worklog Format
- Use dated sections in `ANTIGRAVITY_WORKLOG.md`.
- Follow the fixed entry template defined at the top of `ANTIGRAVITY_WORKLOG.md`.
- Write only the information needed for another agent to continue work safely.
- Prefer implementation facts over narrative.

## Conflict Handling
- If both agents touched the same area, compare current diffs and reconcile instead of replacing.
- If intent is unclear, preserve existing work and make the smallest safe change.

## Default Assumption
- New sessions should automatically recover shared context from:
  1. `ANTIGRAVITY_WORKLOG.md`
  2. `git status`
  3. current diffs in task-related files
