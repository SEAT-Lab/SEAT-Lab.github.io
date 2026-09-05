# SEAT-Lab @ Purdue — Website

Official website for the **Sensor, Electro-Acoustics Technology Laboratory (SEAT-Lab)** at Purdue University.

**Live site:** [https://seat-lab.github.io/](https://seat-lab.github.io/)

## About

This repository hosts a static lab website built with HTML, CSS, and JavaScript. It is deployed through GitHub Pages.

## Pages

| Page | File | Description |
|------|------|-------------|
| Home | `index.html` | Lab overview, news, team, collaborators, research, projects preview, publications preview, contact |
| Projects | `projects.html` | Research project details |
| Publications | `publications.html` | Full publication archive by year |
| News | `news.html` | Full news archive |

## Quick start (local preview)

```bash
# From repo root — Python 3
python local-support/local_server.py
```

Optional file-watching support:

```bash
pip install -r local-support/requirements.txt
python local-support/local_server.py
```

The server opens `http://localhost:8080` by default.

## Branching and publishing

| Branch | Purpose |
|--------|---------|
| `main` | Day-to-day development (commit here) |
| `publish` | Branch GitHub Pages deploys from |

Publishing updates the live site:

```bash
git push origin main:publish
```

Or use **Actions → Publish Site Branch → Run workflow** in GitHub.

A scheduled workflow also syncs `main` → `publish` every two months when new commits exist.

## Documentation

- [Site Development Guide](docs/Site_Development.md) — repo structure, workflows, and how to change the site
- [Editing Cards](docs/Editing_Document.md) — adding and editing people, publications, projects, and other cards

## Contact

Max Chen - [chen3901@purdue.edu](mailto:chen3901@purdue.edu)
