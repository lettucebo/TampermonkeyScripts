# Releasing

This project releases via Git tags + GitHub Releases. Versions follow
[SemVer](https://semver.org/) and align with the userscript header's
`@version`.

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
   git tag -a v0.3.0 -m "v0.3.0 — Auto-update + folder naming cleanup"
   git push origin v0.3.0
   ```

4. Create the GitHub Release from the tag, using the matching
   `CHANGELOG.md` section as the release notes:

   ```bash
   gh release create v0.3.0 \
     --target main \
     --title "v0.3.0 — Auto-update + folder naming cleanup" \
     --notes-from-tag=false \
     --notes-file <(awk '/^## \[0\.3\.0\]/{flag=1;print;next} /^## \[/{flag=0} flag' CHANGELOG.md) \
     --latest
   ```

   Or, if you prefer the GitHub web UI: **Releases → Draft a new
   release**, select the `v0.3.0` tag, paste the `[0.3.0]` section from
   `CHANGELOG.md` as the body, tick **Set as the latest release**, and
   publish.

5. No release assets are needed — Tampermonkey pulls the userscript via
   `@updateURL` / `@downloadURL` from the GitHub raw URL, not from
   release attachments.

## Verifying

- Tampermonkey users should see the new version on their next daily
  update check (or immediately if they trigger **Check for userscript
  updates**).
- The release should appear on the repo home page under "Releases".
