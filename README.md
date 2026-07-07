# nadeeshan96.github.io

Personal portfolio of **Nadeeshan Dissanayake**, served by [GitHub Pages](https://nadeeshan96.github.io/).

The site is **pure static HTML/CSS/vanilla JavaScript** — no framework, no build step, no runtime
third-party dependencies (fonts are self-hosted). The dark, space-themed design is inspired by
[antigravity.google](https://antigravity.google/): starfield backdrop, glowing gradients, and a
cursor-follow glow effect.

## Structure

```
index.html              The whole site (single scrolling page)
404.html                Not-found page
cv/index.html           Redirect stub: /cv/#section -> /#section (old URLs keep working)
assets/css/style.css    Theme (colors, layout, animations)
assets/js/effects.js    Starfield, cursor glow, reveal-on-scroll (dependency-free)
assets/fonts/           Self-hosted Space Grotesk + Inter (WOFF2, OFL license)
assets/img/prof_pic.jpg Profile photo
docs/REDESIGN.md        What the 2026 redesign changed and why; deploy runbook
.github/workflows/      Deploy workflow (publishes to the gh-pages branch)
```

## Preview locally

No dependencies needed — any static file server works:

```sh
python3 -m http.server 8000
# then open http://localhost:8000
```

## Deploy

GitHub Pages serves the **`gh-pages`** branch. The `deploy` workflow publishes to it:

- **Automatically** on every push to `master`.
- **Manually from any branch**: GitHub → *Actions* → *deploy* → *Run workflow* → choose the branch.
  This is how a feature branch can be published to the live site without merging.

See [docs/REDESIGN.md](docs/REDESIGN.md) for the full deploy/rollback runbook.

## Editing content

All content lives directly in `index.html`, one `<section>` per topic (about, education,
publications, work, projects, achievements, volunteering, courses). Edit the HTML and push.
