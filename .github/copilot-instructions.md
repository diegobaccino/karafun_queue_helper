# KaraFun Queue Helper AI Instructions

Use these instructions for all code, UI, documentation, and maintenance work in this repository.

## Purpose

This project is a dedicated, non-interactive KaraFun queue display for vertical monitors and DJ or kiosk-style environments. The app exists to present the current song, the upcoming queue, and a QR code for joining the active session in a clean, highly visible layout.

## Always Maintain

- Keep README.md current whenever features, setup steps, operator workflow, limitations, or build behavior change.
- Remove obsolete files, generated artifacts, abandoned approaches, and dead code as part of normal implementation work.
- Prefer one clear implementation path over multiple overlapping entrypoints, wrappers, or duplicate systems.
- When changing architecture or behavior, make the resulting repository easier to understand than before the change.

## Documentation Standards

- Document code for both humans and AI agents.
- Add clear inline comments for non-obvious logic, state transitions, protocol handling, recovery behavior, and UI constraints.
- Comments should explain intent, assumptions, and expected behavior, not just restate the code.
- Maintain traceability in code so future agents can understand why a component exists, how it interacts with related components, and what invariants must remain true.
- Any folder with meaningful responsibility should include its own README.md explaining what belongs in that area, how it is used, and any important constraints.
- If a folder is introduced and does not need a README.md, that decision should be deliberate and based on the folder being trivial.

## UI and Visual Principles

- The visual design should stay vibrant and energetic, with color choices that align with KaraFun-style presentation rather than muted enterprise UI.
- The app is designed for display, not interaction. Do not introduce workflows that depend on clicking, hovering, scrolling, dragging, or routine mouse interaction.
- Avoid visible scrollbars. The layout should adapt to the screen and available content instead of expecting manual scrolling.
- The primary interaction expectation is operational only: right-click anywhere to toggle fullscreen and hide menu bars for DJ station use.
- The layout must prioritize vertical monitors.
- Queue visibility is the highest priority element on screen.
- The current song area and QR area together should stay compact and should not expand beyond roughly 15% of the vertical screen height under normal layout conditions.
- The QR code should always appear at the top right on the same row as the current item.

## Queue and Playback UX Rules

- If there are no queued items, show the exact message: No items on the queue
- The queue presentation should adapt to the number of visible items and the available screen height.
- If all queued items cannot fit on screen, show a summary line in the queue area using this format: <number> more songs in the queue
- The next upcoming item should transition to an On Deck state 30 seconds before the current song ends.
- During that On Deck state, show a visible flashing message that says: Get ready
- Any queue-state messaging should remain readable from a distance on a vertical display.

## Fullscreen and Kiosk Behavior

- Right-click anywhere in the UI must toggle fullscreen.
- Fullscreen mode must hide menu bars and reduce operator friction when snapping the app to an external monitor.
- Changes to Electron window behavior must preserve kiosk-style usage and should not regress fullscreen reliability.

## Reliability and Self-Healing

- New code should be written with recovery behavior in mind.
- Components should detect unhealthy states where practical and attempt recovery with minimal visible disruption.
- Prefer graceful retry, reconnection, state refresh, or fallback behavior over hard failure.
- Build and runtime workflows should surface health clearly and attempt to self-heal before requiring operator intervention.
- Recovery logic must be documented inline so future maintainers understand what failure it handles and why the chosen recovery path is safe.

## Repo Hygiene Expectations Per Change

For each meaningful update, check whether the change also requires:

- README.md updates
- folder README.md updates
- inline documentation improvements
- cleanup of unused artifacts or outdated files
- removal of duplicate paths or superseded implementation approaches
- validation that display-first UI rules still hold

## Implementation Bias

- Prefer simple, explicit, maintainable solutions.
- Avoid speculative abstractions.
- Avoid duplicate build paths, duplicate docs, and parallel implementations unless there is a strong operational reason.
- Preserve behavior that supports dedicated-display use, live queue readability, and resilient session operation.
