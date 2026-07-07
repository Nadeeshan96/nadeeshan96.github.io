# 2026 Redesign — al-folio (Jekyll) → static antigravity-inspired site

Branch: `redesign-antigravity` · July 2026

## Why

The site was built on the [al-folio](https://github.com/alshedivat/al-folio) Jekyll theme and had
not been maintained: end-of-life Bootstrap 4 / MDB 4 / jQuery, a Ruby + ImageMagick + Node build
chain, and a dozen CDN-loaded third-party assets (one of which, polyfill.io, actually turned
malicious in 2024 and had to be hot-fixed). The goal of this redesign:

1. A modern look inspired by [antigravity.google](https://antigravity.google/) — dark space
   aesthetic, glowing gradients, starfield, and an effect that follows the cursor.
2. **Zero content changes** — every sentence, date, rank, and link from the old
   `_pages/about.md` and `_pages/cv.md` is preserved verbatim.
3. A radically simpler stack that cannot rot: plain HTML/CSS/JS, no build, no dependencies.
4. The final-year-project video plays **on the page** (embedded LinkedIn post) instead of being a
   link users must click through.

## What changed

### Stack

| Before | After |
|---|---|
| Jekyll + 12 plugins, Ruby, Docker, SCSS | 1 HTML file + 1 CSS file + 1 JS file |
| Bootstrap 4, MDB 4, jQuery, Masonry, MathJax… from CDNs | No third-party code at all |
| Google-hosted web fonts | Self-hosted WOFF2 (Space Grotesk + Inter, OFL license) |
| CI builds Jekyll then pushes `_site` to `gh-pages` | CI pushes the repo as-is to `gh-pages` |

The only external resource on the whole site is the LinkedIn `<iframe>` that embeds the
final-year-project video. Everything else (fonts, styles, scripts, images) is served from this
repository — which is also a security posture: no supply-chain exposure to CDNs.

### Design (antigravity-inspired)

- **Dark space theme**: near-black `#07070f` background, periwinkle/violet/cyan accent palette,
  gradient headline text, glassy translucent cards.
- **Cursor glow** (`assets/js/effects.js`): a large soft radial-gradient orb eases toward the
  pointer each animation frame (lerp), giving a weightless "antigravity" trail.
- **Starfield**: a full-viewport `<canvas>` of drifting, twinkling stars with subtle scroll
  parallax.
- **Reveal-on-scroll**: sections float up into view via `IntersectionObserver`.
- **Floating hero**: the profile photo hovers on a slow sine animation with a conic-gradient glow
  ring.
- **Accessibility/robustness**: all effects are disabled under `prefers-reduced-motion`; the
  cursor glow is disabled on touch devices; with JavaScript disabled the full content is still
  visible (the `reveal` class only hides content when JS has added the `js` class to `<html>`);
  the page is fully keyboard-navigable and uses semantic landmarks.

### Content mapping (old → new)

All content is now in `index.html`, one `<section>` per topic. Anchor ids intentionally match the
old site's anchors, and `/cv/` redirects to `/` preserving the hash, so **old inbound links keep
working** (`/cv/#work` → `/#work`, etc.).

| Old location | New location |
|---|---|
| `_pages/about.md` (bio, subtitle, interests, skills) | Hero + `#about` section |
| `_pages/cv.md` § Education | `#education` |
| `_pages/cv.md` § Publications | `#publications` |
| `_pages/cv.md` § Work Experience | `#work` |
| `_pages/cv.md` § Projects | `#projects` |
| `_pages/cv.md` § Achievements | `#achievements` |
| `_pages/cv.md` § Extra-curricular activities | `#volunteering` |
| `_pages/cv.md` § Courses | `#courses` |
| Social links from `_config.yml` (email, GitHub, LinkedIn, Scholar) | Hero + footer icons |
| `assets/img/prof_pic.jpg` | unchanged |

The **only content-level change** (explicitly requested): on the *Human-Motion Recognition using
Micro-Doppler Signatures* project, the `[video]` link to LinkedIn was replaced by an embedded
iframe (`https://www.linkedin.com/embed/feed/update/urn:li:activity:6845025388213637120`) so the
video plays in-page. The original LinkedIn link is kept below the player as a fallback for
browsers that block third-party iframes. The email link keeps the same percent-encoding
obfuscation the old site used (`jekyll-email-protect` equivalent).

### Removed

The entire al-folio machinery: `_includes/`, `_layouts/`, `_sass/`, `_plugins/`, `_data/`,
`_bibliography/` (the papers.bib was empty — publications were always hand-written in cv.md),
`_config.yml`, `Gemfile`, Docker files, `bin/` scripts, blog scaffolding (there were no posts),
demo images, and the al-folio contributor/funding/issue-template metadata. `LICENSE` (MIT, from
the original theme) is retained.

## How to preview locally

```sh
git checkout redesign-antigravity
python3 -m http.server 8000
# open http://localhost:8000
```

No build step, no dependencies. (Any static server works; opening `index.html` directly with
`file://` also mostly works, but fonts/redirects behave better over HTTP.)

## How to deploy THIS branch to GitHub Pages (instead of master's site)

GitHub Pages is configured to serve the **`gh-pages`** branch. The `deploy` workflow
(`.github/workflows/deploy.yml`) publishes whatever branch it runs on. Pushing this branch does
**not** deploy it automatically — deployment is a deliberate, manual step:

1. Open the repository on GitHub → **Actions** tab.
2. Select the **deploy** workflow in the left sidebar.
3. Click **Run workflow** (top right), choose branch **`redesign-antigravity`**, click the green
   **Run workflow** button.
4. Wait ~30 s for the run to finish; https://nadeeshan96.github.io/ now serves the redesign.

### Rollback / switching back to the old site

- Run the same manual workflow from **`master`** — the old Jekyll site will NOT build this way
  (the new workflow has no Jekyll step). Instead, to restore the old site:
  `git revert` the redesign commits on master, or re-run the *old* deploy workflow by checking
  out a commit that still has it. Simplest safe path before merging: the previous `gh-pages`
  content stays in the `gh-pages` branch history — `git push` an older `gh-pages` commit, or run
  the manual deploy again from any branch/commit that contains the site you want.
- After the redesign is merged to `master`, every push to `master` deploys automatically, same
  as before.

## Future work

- Light theme + toggle (the site is dark-only by design for now).
- Extra pages if content outgrows the single page (the nav/footer are ready for it).
