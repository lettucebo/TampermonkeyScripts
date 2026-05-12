# Releasing

This repo is a collection of independent Tampermonkey userscripts under
`scripts/<script-id>/`. Each script versions independently using
[SemVer](https://semver.org/), aligned with its userscript header's
`@version` and its own `CHANGELOG.md`.

## Tag scheme

Per-script tags use the form `<script-id>-v<X.Y.Z>`, for example:

- `ldc-batch-download-v0.6.0`
- `ms-learn-lang-switch-tw-v0.3.0`
- `ms-learn-lang-switch-cn-v0.3.0`
- `github-docs-lang-switch-cn-v0.3.0`

> **Historical note**: `v0.4.0` and `v0.5.0` exist as legacy repo-wide
> tags from when this repo was named `LDC-Tools` and only held the LDC
> Batch Downloader. They map to LDC versions of those numbers. Going
> forward, every tag is namespaced with its `<script-id>-` prefix.
>
> `v0.3.0` was deployed via Tampermonkey's auto-update mechanism and
> never given an explicit Git tag — that decision still stands.

## Cutting a release

1. **Bump the script's `@version`.** In
   `scripts/<script-id>/<script-id>.user.js`, edit the
   `// @version  X.Y.Z` line. Tampermonkey auto-update needs this to
   trigger a fresh download for existing installs.

2. **Update the script's CHANGELOG.** In
   `scripts/<script-id>/CHANGELOG.md`, move anything from
   `## [Unreleased]` into a new `## [X.Y.Z] — YYYY-MM-DD` section, and
   update the compare-URL footnotes at the bottom of the file.

3. **Commit and merge to `main`.**

4. **Create an annotated tag and push it:**

   ```bash
   git checkout main
   git pull --ff-only
   git tag -a <script-id>-vX.Y.Z -m "<script-id> vX.Y.Z — <one-line summary>"
   git push origin <script-id>-vX.Y.Z
   ```

5. **Create the GitHub Release from the tag**, using the matching
   `CHANGELOG.md` section as the release notes. The awk one-liner below
   extracts the right section from the per-script CHANGELOG:

   ```bash
   gh release create <script-id>-vX.Y.Z \
     --target main \
     --title "<script-id> vX.Y.Z — <one-line summary>" \
     --notes-from-tag=false \
     --notes-file <(awk '/^## \[X\.Y\.Z\]/{flag=1;print;next} /^## \[/{flag=0} flag' scripts/<script-id>/CHANGELOG.md) \
     --latest
   ```

   (Escape the dots in the awk regex for the literal version, e.g.
   `\[0\.6\.0\]` for `v0.6.0`.)

   `--latest` is optional; use it only when this is the
   most-recently-shipped script of any kind. Since each script versions
   independently, you can also pass `--latest=false` for non-headline
   releases.

6. **No release assets needed.** Tampermonkey pulls the userscript via
   `@updateURL` / `@downloadURL` from the GitHub raw URL, not from
   release attachments.

## Worked examples

### `ldc-batch-download` v0.6.0

```bash
git tag -a ldc-batch-download-v0.6.0 -m "ldc-batch-download v0.6.0 — repo restructure"
git push origin ldc-batch-download-v0.6.0

gh release create ldc-batch-download-v0.6.0 \
  --target main \
  --title "ldc-batch-download v0.6.0 — repo restructure" \
  --notes-from-tag=false \
  --notes-file <(awk '/^## \[0\.6\.0\]/{flag=1;print;next} /^## \[/{flag=0} flag' scripts/ldc-batch-download/CHANGELOG.md) \
  --latest
```

### `ms-learn-lang-switch-tw` v0.3.0

```bash
git tag -a ms-learn-lang-switch-tw-v0.3.0 -m "ms-learn-lang-switch-tw v0.3.0 — moved from gist into repo"
git push origin ms-learn-lang-switch-tw-v0.3.0

gh release create ms-learn-lang-switch-tw-v0.3.0 \
  --target main \
  --title "ms-learn-lang-switch-tw v0.3.0 — moved from gist into repo" \
  --notes-from-tag=false \
  --notes-file <(awk '/^## \[0\.3\.0\]/{flag=1;print;next} /^## \[/{flag=0} flag' scripts/ms-learn-lang-switch-tw/CHANGELOG.md)
```

(No `--latest` flag here — it's not the headline release.)

## Verifying

- Tampermonkey users should see the new version on their next daily
  update check (or immediately if they trigger **Check for userscript
  updates**).
- The release should appear on the repo home page under "Releases",
  tagged with the per-script identifier.
- The userscript at the `@updateURL` path on `main` should now have the
  bumped `@version` in its header.

## Adding a new userscript to the repo

When you add a new userscript, scaffolded under `scripts/<new-id>/`:

1. The userscript's `@updateURL` / `@downloadURL` / `@homepageURL` /
   `@namespace` / `@supportURL` must point at the new repo paths from
   day one (see existing scripts as templates).
2. Author the script's own `README.md` (+ `README.zh-TW.md` if
   bilingual) and `CHANGELOG.md` in the same folder.
3. Update the root `README.md` / `README.zh-TW.md` index to add the
   new script.
4. Tag the first public release as `<new-id>-v<X.Y.Z>` following the
   process above.
