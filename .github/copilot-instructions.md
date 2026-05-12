# Project conventions

This repository is `lettucebo/TampermonkeyScripts` — a collection of
independent Tampermonkey userscripts. Each script lives in its own
`scripts/<script-id>/` folder.

## Tampermonkey userscript conventions

When adding or modifying a userscript:

- Each userscript's `@version` must follow [SemVer](https://semver.org/)
  and be kept in sync with a matching `## [X.Y.Z] — YYYY-MM-DD` entry in
  the script's own `scripts/<script-id>/CHANGELOG.md`.
- Set `@namespace` to `https://github.com/lettucebo/TampermonkeyScripts`
  on every script in this repo. (Tampermonkey identifies installed
  scripts by `(name, namespace)` — changing namespace splits installs.)
- Set `@updateURL` and `@downloadURL` to the GitHub raw URL of the
  script under its repo path:
  `https://raw.githubusercontent.com/lettucebo/TampermonkeyScripts/main/scripts/<script-id>/<script-id>.user.js`.
  Tampermonkey relies on this for auto-update.
- Set `@homepageURL` to
  `https://github.com/lettucebo/TampermonkeyScripts/tree/main/scripts/<script-id>`.
- Set `@supportURL` to
  `https://github.com/lettucebo/TampermonkeyScripts/issues`.
- Always set `@license MIT`.
- For user-facing strings (`@name`, `@description`), provide an English
  version and a `:zh-TW` translation pair when the script has user-facing
  UI in either language.

## Per-script tag scheme

Releases use tags of the form `<script-id>-v<X.Y.Z>`, e.g.
`ldc-batch-download-v0.6.0`, `ms-learn-lang-switch-tw-v0.3.0`. See
`RELEASING.md` for the full release procedure.

## Folder layout per script

```
scripts/<script-id>/
├── <script-id>.user.js
├── README.md
├── README.zh-TW.md        ← if bilingual docs
├── CHANGELOG.md
└── test/                  ← if the script has tests
```

The root `README.md` / `README.zh-TW.md` is an index of all userscripts
in the repo and should be kept up to date when a new script is added or
removed.

## Other conventions

- 若使用 Python 的話，必須使用 Python 虛擬環境。
