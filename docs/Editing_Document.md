# SEAT-Lab Website Card Documentation

This document provides guidelines for adding and managing content cards across the SEAT-Lab website. Cards are the primary HTML patterns used to display structured information.

For repository setup, local preview, and publishing, see [Site_Development.md](Site_Development.md). For a quick overview, see the [README](../README.md).

## Table of Contents

1. [Card Types Overview](#card-types-overview)
2. [Publications Page](#publications-page-publicationshtml)
3. [Projects Page](#projects-page-projectshtml)
4. [Homepage](#homepage-indexhtml)
5. [CSS Classes Reference](#css-classes-reference)
6. [Adding New Content](#adding-new-content)
7. [Best Practices](#best-practices)
8. [Troubleshooting](#troubleshooting)

## Card Types Overview

| Card type | CSS class | Location | Notes |
|-----------|-----------|----------|-------|
| Publication (full) | `publication-detailed-card` | `publications.html` | Authors, venue, keywords, links; abstract optional |
| Publication (homepage) | `publication-highlight-card` | `index.html` | Compact preview with year badge and `pub-tag` labels |
| Project (full) | `project-card` | `projects.html` | Collapsible details, `tech-tag` labels |
| Project (homepage) | `project-preview-card` | `index.html` | Short summary; links to `projects.html` |
| Faculty / group | `person-card` | `index.html` | Team section; may contain a `researcher-list` |
| Team member row | `researcher-item` | `index.html` | Simple name/focus, or expandable bio |
| Collaborator | `collaborator-item` | `index.html` | Always visible; no expand/collapse |
| Research focus | `skill-category` | `index.html` | Tag groups under Research |
| About blurb | `overview-card` | `index.html` | Lab description text |
| Contact blocks | `contact-*-card` | `index.html` | Primary contact, links, location, hours |

There is no shared generic `.card` wrapper. Copy an existing card of the same type and edit its content.

## Publications Page (`publications.html`)

Year sections are controlled by `publications.js` (click handlers, expand/collapse, and counts). Do **not** add `onclick` attributes to year headers.

### Adding a publication to an existing year

1. Find the correct `.year-content` block (e.g. `#year-2026`).
2. Copy an existing `.publication-detailed-card` inside that block.
3. Update title, authors, venue, keywords, and action links.

**Year section structure:**

```html
<div id="year-2026" class="year-section">
    <div class="year-header">
        <h3><i class="fas fa-calendar-alt"></i> 2026 <span class="publication-count">(1 publication)</span></h3>
        <i class="fas fa-chevron-down toggle-icon"></i>
    </div>
    <div class="year-content">
        <!-- publication-detailed-card entries here -->
    </div>
</div>
```

**Publication card template:**

```html
<div class="publication-detailed-card">
    <div class="publication-content">
        <h4>Publication Title</h4>
        <div class="publication-authors">
            <span class="author">Author One</span>,
            <span class="author">Author Two</span> et al.
        </div>
        <div class="publication-venue">
            <i class="fas fa-journal-whills"></i>
            Journal or Conference Name, year, pages
        </div>
        <!-- Optional: include for poster abstracts or when a summary helps -->
        <div class="publication-abstract">
            <h5><i class="fas fa-file-text"></i> Abstract</h5>
            <p>Short abstract text...</p>
        </div>
        <div class="publication-keywords">
            <span class="keyword ml">Machine Learning</span>
            <span class="keyword acoustics">Acoustics</span>
            <span class="keyword sensors">Sensors</span>
        </div>
        <div class="publication-actions">
            <a href="https://doi.org/..." target="_blank" class="publication-action-btn primary">
                <i class="fas fa-external-link-alt"></i> View Paper
            </a>
        </div>
    </div>
</div>
```

Use `<i class="fas fa-university"></i>` in `.publication-venue` for symposium or institutional entries instead of the journal icon.

### Adding a new year

1. Add a new `.year-section` with `id="year-YYYY"` at the top of `.publications-by-year` (newest year first).
2. Add a matching entry to the floating TOC in the same file:

```html
<li class="toc-item"><a href="#year-2027" class="toc-link"><span>2027</span> <span class="count">(0)</span></a></li>
```

3. Place one or more `.publication-detailed-card` entries inside `.year-content`.

**Counts:** `publications.js` recalculates `.publication-count` in each year header and `.count` in the TOC on page load. Placeholder counts in HTML are fine; they update automatically. You still need to add a TOC row manually for a brand-new year.

**Default expand behavior:** Only the current calendar year opens on load. If that year section does not exist, the first year section opens instead.

### Keyword color categories

Keywords use two classes: `keyword` plus a category slug. The visible label is the tag text, not the slug.

| Slug class | Typical use |
|------------|-------------|
| `microfluidics` | Lab-on-chip, acoustofluidics |
| `ml` | Machine learning, neural networks |
| `healthcare` | Medical, hearing health |
| `acoustics` | Acoustic analysis, electroacoustics |
| `sensors` | Sensing, MEMS, transducers |
| `robotics` | Robotics, automation |

Example: `<span class="keyword ml">Deep Neural Networks</span>`

## Projects Page (`projects.html`)

Project cards collapse via `script.js`. Copy an existing `.project-card` and edit content.

```html
<div class="project-card featured">
    <div class="project-collapsible-header">
        <div class="project-header">
            <h3>Project Title</h3>
        </div>
        <button class="project-collapse-btn" aria-label="Toggle project details">
            <i class="fas fa-chevron-down"></i>
        </button>
    </div>
    <p>Short summary visible when collapsed...</p>

    <div class="project-details">
        <h4><i class="fas fa-microscope"></i> Research Objectives</h4>
        <ul>
            <li>Objective 1</li>
        </ul>
        <h4><i class="fas fa-tools"></i> Methodology</h4>
        <ul>
            <li>Method 1</li>
        </ul>
        <!-- Other h4 blocks are fine (e.g. System Features, Publications) -->
    </div>

    <div class="project-tech">
        <span class="tech-tag primary">Main Technology</span>
        <span class="tech-tag">Supporting Tag</span>
    </div>
</div>
```

- Use `featured` on cards you want highlighted.
- Use `primary` on one or two main `tech-tag` entries.
- `.project-details` may include custom `<h4>` sections and `.project-links` with `.project-link-btn` where needed.

## Homepage (`index.html`)

### Faculty (`person-card`)

Faculty entries use a full `.person-card` with name, title, description, and links:

```html
<div class="person-card">
    <div class="person-info">
        <h3>Faculty Professor</h3>
        <p class="person-name">Dr. Name</p>
        <p class="person-title">Title, School</p>
        <p class="person-description">Bio paragraph...</p>
        <div class="person-links">
            <a href="mailto:email@purdue.edu" class="person-link">
                <i class="fas fa-envelope"></i> Contact
            </a>
        </div>
    </div>
</div>
```

### Students and alumni (`researcher-item`)

Grouped inside a `.person-card` → `.researcher-list`. Use one of two patterns:

**Simple entry** (name and role only):

```html
<div class="researcher-item">
    <p class="person-name">Student Name</p>
    <p class="person-focus">MS Student in Engineering Technology</p>
</div>
```

**Expandable entry** (bio and links):

```html
<div class="researcher-item">
    <div class="researcher-header">
        <div class="researcher-basic-info">
            <p class="person-name">Student Name</p>
            <p class="person-focus">MS Student in Engineering Technology</p>
        </div>
        <button class="researcher-toggle" aria-label="Toggle details" aria-expanded="false">
            <i class="fas fa-chevron-down"></i>
        </button>
    </div>
    <div class="researcher-details">
        <p class="person-description">Bio paragraph...</p>
        <div class="person-links">
            <a href="mailto:email@purdue.edu" class="person-link">
                <i class="fas fa-envelope"></i> Contact
            </a>
        </div>
    </div>
</div>
```

Toggle behavior is handled by `script.js`. Only add a `.researcher-toggle` when there is extra detail worth hiding.

### Collaborators (`collaborator-item`)

Collaborators are **always visible**. Do not add a toggle button.

Place entries under the correct `.collaborator-category` (Purdue vs External):

```html
<div class="collaborator-item">
    <div class="collaborator-header">
        <div class="collaborator-basic-info">
            <h4>Dr. Collaborator Name</h4>
            <p class="collaborator-department">Title and Institution</p>
        </div>
    </div>
    <div class="collaborator-details">
        <p class="collaborator-focus">Project: Short project description</p>
        <div class="collaborator-links">
            <a href="https://example.com" target="_blank" class="collaborator-link">
                <i class="fas fa-globe"></i> Website
            </a>
        </div>
    </div>
</div>
```

### Research focuses (`skill-category`)

```html
<div class="skill-category">
    <h3><i class="fas fa-ear-listen"></i> Area Title</h3>
    <div class="skill-tags">
        <span class="skill-tag primary">Primary Topic</span>
        <span class="skill-tag">Related Topic</span>
    </div>
</div>
```

### Homepage project preview (`project-preview-card`)

```html
<div class="project-preview-card">
    <div class="project-preview-header">
        <h3>Project Title</h3>
    </div>
    <p class="project-preview-description">One or two sentences...</p>
    <div class="project-preview-tech">
        <span class="tech-tag">Tag One</span>
        <span class="tech-tag">Tag Two</span>
    </div>
</div>
```

Add full project write-ups on `projects.html`; keep previews brief here.

### Homepage publication highlight (`publication-highlight-card`)

Uses `pub-tag` (not `keyword`) for labels:

```html
<div class="publication-highlight-card">
    <div class="publication-year-badge">2025</div>
    <div class="publication-content">
        <h4>Publication Title</h4>
        <p class="publication-authors">Author One, Author Two</p>
        <p class="publication-venue">Venue or journal</p>
        <div class="publication-tags">
            <span class="pub-tag">Topic One</span>
            <span class="pub-tag">Topic Two</span>
        </div>
        <div class="publication-links">
            <a href="https://doi.org/..." target="_blank" class="publication-link">
                <i class="fas fa-external-link-alt"></i> View Paper
            </a>
        </div>
    </div>
</div>
```

When adding a major publication, update both `publications.html` and, if it should be featured, this homepage section.

### Contact section

Contact uses dedicated card classes (`contact-main-card`, `contact-links-card`, `contact-location-card`, `contact-hours-card`, `contact-collaboration-card`). Edit text and links in place rather than copying from other card types.

## CSS Classes Reference

### Publication page

- `.year-section`, `.year-header`, `.year-content`, `.toggle-icon`, `.publication-count`
- `.publication-detailed-card`, `.publication-content`, `.publication-authors`, `.author`
- `.publication-venue`, `.publication-abstract`, `.publication-keywords`, `.keyword`
- `.publication-actions`, `.publication-action-btn`

### Projects

- `.project-card`, `.project-collapsible-header`, `.project-collapse-btn`, `.project-details`, `.project-tech`, `.tech-tag`

### Homepage

- `.person-card`, `.person-info`, `.researcher-list`, `.researcher-item`, `.researcher-toggle`, `.researcher-details`
- `.collaborator-category`, `.collaborator-item`, `.collaborator-details`
- `.skill-category`, `.skill-tag`, `.overview-card`
- `.project-preview-card`, `.publication-highlight-card`, `.pub-tag`
- `.contact-main-card`, `.contact-links-card`, and related contact classes

### State classes (applied by JavaScript)

- `.researcher-item.expanded` — open bio on homepage
- `.project-card.expanded` / `.project-card.collapsed` — project detail visibility on `projects.html`

## Adding New Content

1. Identify the page and section (see table above).
2. Copy an existing card of the **same type** from that section.
3. Replace text, links, and tags.
4. For a new publication year, add the year section **and** a TOC link.
5. Preview locally (`python local-support/local_server.py`), then commit to `main`.
6. Publish to the live site when ready (`git push origin main:publish` — see [Site_Development.md](Site_Development.md)).

### Content guidelines

- Keep titles concise; use standard academic formatting for publications.
- Use `target="_blank"` on external links.
- Include `aria-label` on toggle buttons.
- Bump the `?v=` query on `styles.css` in HTML files after CSS changes so browsers load the new styles.

## Best Practices

- Copy from live cards instead of using generic templates.
- Match tag conventions: `keyword` + slug on the publications page, `pub-tag` on homepage highlights, `tech-tag` on projects.
- After editing publications, reload `publications.html` and confirm year counts and expand/collapse behavior.

## Troubleshooting

| Issue | What to check |
|-------|----------------|
| Card layout looks wrong | HTML structure matches a working card of the same type; classes spelled correctly |
| Styles not updating | Hard refresh; bump `styles.css?v=...` in HTML |
| Live site unchanged | Changes may be on `main` only — push to `publish` |
| Year section won't open | `publications.js` loaded on `publications.html`; `.year-header` has no inline `onclick` |
| Researcher bio won't expand | `.researcher-toggle` inside `.researcher-item`; `script.js` loaded |
| Project won't collapse | `.project-collapse-btn` present; test on `projects.html` |

If something still fails, compare against a similar working card in the same file and check the browser console for JavaScript errors.

---

**Last Updated**: July 2026  
**Maintained by**: Max Chen
