# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.5.0] — 2026-05-11

### Added
- **Shift+Click range selection on course checkboxes.** Plain click on
  a checkbox still toggles that one row, but a subsequent **Shift+Click**
  on another row now bulk-selects every visible course between the last
  clicked row (the "anchor") and this one, inclusive. The range is
  intentionally limited to **the same category** — Shift+Click across
  categories (e.g. Azure → Microsoft 365) falls through to a normal
  single-row click. Collapsed / hidden rows are not included.
- Repeated Shift+Click keeps pivoting around the same anchor (standard
  Windows Explorer / Outlook behaviour). The anchor is reset by a plain
  click on any row, or by using the toolbar's `Select all visible` /
  `Clear selection` buttons.
- New `selection.addMany(ids)` helper that batches multiple selections
  into a single change notification, so the range select doesn't churn
  the toolbar count.

### Fixed
- Make sure Shift+Click also visually checks the clicked row (the
  range's last endpoint). Drive Shift-range selection from the
  `change` event instead of `click` + `preventDefault`: stash the
  computed range in the click handler and apply it after the browser
  has committed its natural toggle. The previous attempt that used
  `preventDefault` + `queueMicrotask` did not reliably defer the DOM
  `checked` sync past the browser's legacy-canceled-activation
  revert, which left the clicked row visually unchecked even though
  the selection state correctly included it.

## [0.4.0] — 2026-05-09

### Added
- New `Sort:` dropdown in the toolbar with three modes (`Default`,
  `Updated ↓ (newest first)`, `Updated ↑ (oldest first)`). Sorting only
  reorders courses **within each category** — the order of the categories
  themselves is left untouched. The chosen mode is persisted via
  `GM.setValue` and restored on the next page load.
- Courses without any parseable date metadata stably sink to the bottom of
  their category. If no course in the API has any date field at all, the
  sort dropdown auto-disables with a ⚠️ tooltip.
- Pure helpers in `courseParser` (`parseDate`, `pickFileDate`,
  `courseLastModified`) so the sort source is testable without a browser.
  Tests grew 56 → 93 cases.

### Changed
- Sort `<select>` keeps `aria-disabled` in sync with `disabled` for
  better screen-reader behaviour.
- `courseLastModified` is documented to mirror the SPA's `Updated:` badge,
  so the sort order matches what users already see in the page.

### Fixed
- `findRowContainer` now `console.warn`s when its 6-level walk exhausts
  without finding a row container, so future LDC layout regressions are
  detectable instead of failing silently.
- `saveSortMode` now awaits `GM.setValue` so the persisted choice survives
  a fast tab close.
- Removed a dead `if (sorting) return` MutationObserver guard whose
  `sorting` flag was always already reset by the time the microtask fired;
  the same-order short-circuit inside `applySortIfNeeded` is the real
  re-entrancy guard.

## [0.3.0] — 2026-05-09

### Added
- Tampermonkey auto-update support via `@updateURL` / `@downloadURL`
  pointing at the GitHub raw URL, so installed scripts pick up new
  versions automatically.

### Changed
- Course folder names now strip the `T00` / `T00A` Microsoft training
  course version suffix (e.g. `AZ-040T00` → `AZ-040`,
  `PL-300T00A` → `PL-300`). File names themselves keep Microsoft's
  original naming.
- Hardening pass from code review: fixed resource leaks, removed dead
  code, and tightened error handling across the orchestrator and FSA
  writer.

### Fixed
- Checkbox alignment in the course list.
- Queue deadlock that could occur when `navigator.locks` was held across
  multiple tabs.

### Upgrade notes
- Folders downloaded by 0.2.x (e.g. `AZ-040T00 ...`) are treated as
  non-existent under 0.3.0 and will be re-downloaded under the new name
  (`AZ-040 ...`). To keep existing files, manually rename the old
  folders to drop the `T00` / `T00A` suffix; rename their sub-folders
  too.

## [0.2.0] — 2026-05-07

### Added
- First usable release of the LDC Batch Downloader Tampermonkey
  userscript.
  - Course batch selection, header toolbar, floating progress panel,
    preflight confirmation dialog.
  - Local writes via the File System Access API; chosen folder handle
    persisted in IndexedDB.
  - Concurrent download queue with retry, skip-if-exists, and multi-tab
    mutual exclusion via `navigator.locks`.
  - Token interception (fetch + XHR hook at `document-start`), JWT
    expiry pre-detection, and handling for HTTP 429 (rate limit) and
    401 (token expired).

[Unreleased]: https://github.com/lettucebo/LDC-Tools/compare/v0.5.0...HEAD
[0.5.0]: https://github.com/lettucebo/LDC-Tools/compare/v0.4.0...v0.5.0
[0.4.0]: https://github.com/lettucebo/LDC-Tools/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/lettucebo/LDC-Tools/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/lettucebo/LDC-Tools/releases/tag/v0.2.0
