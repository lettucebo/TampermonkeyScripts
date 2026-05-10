# Releasing

This project releases via Git tags + GitHub Releases. Versions follow
[SemVer](https://semver.org/) and align with the userscript header's
`@version`.

> **Note on `v0.3.0`**: `v0.3.0` was deployed to existing installs via
> Tampermonkey's auto-update mechanism (`@updateURL` / `@downloadURL`
> point at the GitHub raw URL, which always serves the latest committed
> version on `main`). It was never given an explicit Git tag or GitHub
> Release, and we are intentionally not creating one retroactively —
> the auto-update path already covered all users. `v0.4.0` is the first
> formally tagged release.

## Cutting a release

1. Make sure the version in `src/ldc-batch-download.user.js`
   (`// @version`) matches the version you're about to tag, and that
   `CHANGELOG.md` has a corresponding entry under that version (move
   anything from `[Unreleased]` into the new version section, dated
   today).

2. Commit any changelog/version bumps and merge to `main`.

3. From an up-to-date `main`, create an annotated tag and push it:

   ```bash
   git checkout main
   git pull --ff-only
   git tag -a v0.4.0 -m "v0.4.0 — Sort by last-updated date"
   git push origin v0.4.0
   ```

4. Create the GitHub Release from the tag, using the matching
   `CHANGELOG.md` section as the release notes:

   ```bash
   gh release create v0.4.0 \
     --target main \
     --title "v0.4.0 — Sort by last-updated date" \
     --notes-from-tag=false \
     --notes-file <(awk '/^## \[0\.4\.0\]/{flag=1;print;next} /^## \[/{flag=0} flag' CHANGELOG.md) \
     --latest
   ```

   Or, if you prefer the GitHub web UI: **Releases → Draft a new
   release**, select the `v0.4.0` tag, paste the `[0.4.0]` section from
   `CHANGELOG.md` as the body, tick **Set as the latest release**, and
   publish.

5. No release assets are needed — Tampermonkey pulls the userscript via
   `@updateURL` / `@downloadURL` from the GitHub raw URL, not from
   release attachments.

## Generic template (for future releases)

For any version `vX.Y.Z`, replace the literal `0.4.0` references above
with the new version. The release notes selector stays the same shape:

```bash
git tag -a vX.Y.Z -m "vX.Y.Z — <one-line summary>"
git push origin vX.Y.Z

gh release create vX.Y.Z \
  --target main \
  --title "vX.Y.Z — <one-line summary>" \
  --notes-from-tag=false \
  --notes-file <(awk '/^## \[X\.Y\.Z\]/{flag=1;print;next} /^## \[/{flag=0} flag' CHANGELOG.md) \
  --latest
```

(Escape the dots in the awk regex when expanding `X.Y.Z` literally,
e.g. `\[1\.0\.0\]` for `v1.0.0`.)

## Verifying

- Tampermonkey users should see the new version on their next daily
  update check (or immediately if they trigger **Check for userscript
  updates**).
- The release should appear on the repo home page under "Releases".
