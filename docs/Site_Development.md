# SEAT-Lab Website — Development Guide

This guide covers how the site is built, tested, and published. For step-by-step instructions on editing content cards (people, publications, projects), see [Editing_Document.md](Editing_Document.md).

## Overview

The site is a **static** GitHub Pages project. Pages are plain HTML with shared CSS and JavaScript.

| Item | Value |
|------|-------|
| Live URL | https://seat-lab.github.io/ |
| Organization | [SEAT-Lab](https://github.com/SEAT-Lab) |
| Repository | `SEAT-Lab.github.io` |
| Development branch | `main` |
| Published branch | `publish` |

## Repository layout

```
SEAT-Lab.github.io/
├── index.html              # Homepage
├── news.html               # News archive
├── news.txt                # News source (labeled text)
├── projects.html           # Projects page
├── publications.html       # Publications archive
├── styles.css              # Shared styles
├── script.js               # Shared behavior (nav, bios, projects, scroll)
├── publications.js         # Publications page (year sections, counts)
├── toc.js                  # Floating table of contents (publications)
├── sitemap.xml             # Search engine sitemap
├── assets/                 # Images (favicon, etc.)
├── docs/                   # Documentation
│   ├── Site_Development.md
│   └── Editing_Document.md
├── .github/workflows/      # Publish automation
└── local-support/           # Local dev tools
    ├── local_server.py
    └── requirements.txt
```

## How pages share code

Every public page loads:

- **`styles.css`** — layout, typography, cards, navigation, responsive rules
- **`script.js`** — mobile menu, smooth scrolling, researcher bio toggles, project card collapse, progress bar, active nav highlighting

Additional scripts by page:

| Page | Extra scripts |
|------|----------------|
| `publications.html` | `toc.js`, `publications.js` |

## Local development

### Start the preview server

From the repository root:

```bash
python local-support/local_server.py
```

This serves the repo at `http://localhost:8080` and opens a browser. HTML responses include a lightweight auto-refresh hook when file watching is available.

### Optional: file watching

Install the optional dependency once:

```bash
pip install -r local-support/requirements.txt
```

With `watchdog` installed, the local server can detect HTML/CSS/JS changes and prompt a refresh automatically.

## Git workflow

### Daily work

Always develop on **`main`**:

```bash
git checkout main
git pull origin main
# edit files
git add .
git commit -m "Describe your change"
git push origin main
```

Pushing to `main` does **not** update the live site when GitHub Pages is configured to deploy from `publish`.

### Publish to the live site

When changes on `main` are ready to go live:

```bash
git push origin main:publish
```

Alternatively, in GitHub:

1. Go to **Actions**
2. Open **Publish Site Branch**
3. Click **Run workflow** (defaults: `main` → `publish`)

### Scheduled publish

The **Scheduled Publish Sync** workflow runs on the 1st of every other month (UTC). It only acts in **even-numbered months** and only pushes when `main` has commits that `publish` does not already have.

You can also trigger it manually from **Actions → Scheduled Publish Sync → Run workflow**.

## Common editing tasks

| Task | Where to edit | More detail |
|------|---------------|-------------|
| Add a team member | `index.html` → People section | [Editing_Document.md](Editing_Document.md) |
| Add a publication | `publications.html` + homepage preview in `index.html` | [Editing_Document.md](Editing_Document.md) |
| Add a project | `projects.html` + optional preview on `index.html` | [Editing_Document.md](Editing_Document.md) |
| Update contact info | `index.html` → Contact section | Edit HTML directly |
| Change site-wide colors/fonts | `styles.css` (`:root` variables) | Test all three pages |
| Update sitemap dates | `sitemap.xml` | After adding/removing pages |

### Adding a publication (summary)

1. Open `publications.html`
2. Add a new year section or append to the correct `.year-content` block
3. Copy an existing `.publication-detailed-card` and update title, authors, venue, keywords, and links
4. Update the floating TOC year list and counts (or rely on `publications.js` to recount on load)
5. Optionally add a highlight card on `index.html`
6. Update `sitemap.xml` `<lastmod>` if needed

See [Editing_Document.md](Editing_Document.md) for full card HTML patterns.
