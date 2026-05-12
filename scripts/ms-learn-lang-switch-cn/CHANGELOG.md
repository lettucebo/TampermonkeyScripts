# Changelog

All notable changes to this script are documented in this file. Format based on [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/); this script follows [SemVer](https://semver.org/).

## [Unreleased]

## [0.3.0] — 2026-05-12

### Added
- Moved from gist `lettucebo/75f05f94b7ee2dace41b5ec06b6bf022` into the `lettucebo/TampermonkeyScripts` repo at `scripts/ms-learn-lang-switch-cn/`.
- Bilingual README (English + 繁體中文).
- Proper Tampermonkey metadata: `@license MIT`, `@homepageURL`, `@supportURL`, repo-based `@namespace`, and `@updateURL` / `@downloadURL` pointing at the repo raw URL so Tampermonkey can auto-update from this repo.

### Changed
- `@author` from `You` to `lettucebo`.
- `@namespace` from `http://tampermonkey.net/` to `https://github.com/lettucebo/TampermonkeyScripts`.
- `@name` from `中英快速切換 - CN` to `MS Learn Lang Switch (zh-CN)`; original Chinese name retained as `@name:zh-TW`.

### Upgrade notes
- The `@namespace` change means Tampermonkey treats this as a different script from the gist version. If you previously installed the script from the gist, uninstall the old entry from the Tampermonkey dashboard before installing from this repo to avoid two copies running.

## [0.2.0]

### Added
- Initial public release on gist `lettucebo/75f05f94b7ee2dace41b5ec06b6bf022`.
