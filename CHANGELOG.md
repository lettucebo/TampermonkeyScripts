# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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

[Unreleased]: https://github.com/lettucebo/LDC-Tools/compare/v0.3.0...HEAD
[0.3.0]: https://github.com/lettucebo/LDC-Tools/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/lettucebo/LDC-Tools/releases/tag/v0.2.0
