English | [繁體中文](./README.zh-TW.md)

# GitHub Docs Lang Switch (zh-CN)

> Scope (`@match`): `https://docs.github.com/*/*`

## What it does

Adds a small floating button at the top-right corner (`top: 6px`) of every [docs.github.com](https://docs.github.com/) page that has a locale segment in its URL. The button toggles the current page between English and Simplified Chinese:

- When the URL contains `/en/`, the button shows **簡** and clicking it navigates to the `/zh/` version of the same page.
- When the URL contains `/zh/`, the button shows **EN** and clicking it navigates to the `/en/` version of the same page.

The button is semi-transparent by default and becomes fully opaque on hover, so it stays out of the way while reading.

## Install

1. Install a userscript manager such as [Tampermonkey](https://www.tampermonkey.net/) (Chrome, Edge, Firefox, Safari).
2. Click the install link:
   [Install `github-docs-lang-switch-cn.user.js`](https://raw.githubusercontent.com/lettucebo/TampermonkeyScripts/main/scripts/github-docs-lang-switch-cn/github-docs-lang-switch-cn.user.js)
   <br/>💡 _**Ctrl/Cmd-click** (or middle-click) the link above to open it in a new tab — GitHub strips `target="_blank"` from README links so plain clicks navigate this tab away._
3. Confirm the install prompt in Tampermonkey.

Tampermonkey will auto-update the script from this repository's raw URL on its normal update schedule.

## How it works

The script inspects `location.href` with the regex `/com\/(en|zh)\//` to detect the current locale segment. GitHub Docs uses **bare two-letter locale codes** (`en`, `zh`, `ja`, `ko`, …) directly after the `docs.github.com/` host — this is different from Microsoft Learn, which uses hyphenated codes such as `en-us` and `zh-cn`. The same `/com\/(en|zh)\//` pattern is used to build the target URL when the button is clicked, so the match and the replace stay in sync.

If the URL has no locale segment (for example the root `https://docs.github.com/`), the script does nothing.

## Bug fixes vs. the original gist

This repo version fixes two bugs that shipped in the original gist (`lettucebo/a69c5d5cb2f09bbff962568a8e14206c`):

- **`@updateURL` / `@downloadURL` pointed at the wrong gist.** The gist version's `@updateURL` and `@downloadURL` pointed at the unrelated **Microsoft Learn** zh-CN gist (`lettucebo/75f05f94...`). The practical impact: Tampermonkey would silently auto-update this script's installs with the MS Learn script's code on the next update check, replacing the GitHub Docs switcher with something completely different. The repo version points at its own raw URL inside this repository, so updates stay on this script.
- **The click handler's URL-replace regex never matched.** The gist version detected the locale with `/com\/(en|zh)\//` (correct) but tried to rewrite the URL with `/com\/(en-us|zh-cn)\//` (wrong — that pattern matches Microsoft Learn URLs, not GitHub Docs). Net effect: the button rendered, but clicking it did nothing. The repo version uses `/com\/(en|zh)\//` for both match and replace, so the button actually navigates.

## Upgrade from gist install (≤ v0.2)

The `@namespace` changed from `http://tampermonkey.net/` to `https://github.com/lettucebo/TampermonkeyScripts`, so Tampermonkey treats the repo version as a **different script** from the gist version. To avoid two copies running side-by-side:

1. Open the Tampermonkey dashboard.
2. Delete the old `GitHub 中英快速切換 - CN` entry that came from the gist.
3. Install the repo version using the link above.

## License

[MIT](https://opensource.org/licenses/MIT)
