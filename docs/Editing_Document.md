# SEAT-Lab Website Card Documentation

This document provides comprehensive guidelines for adding and managing cards across all pages of the SEAT-Lab website. Cards are the primary content containers used throughout the site to display information in a structured, visually appealing format.

## Table of Contents

1. [Card Types Overview](#card-types-overview)
2. [General Card Structure](#general-card-structure)
3. [Page-Specific Card Guidelines](#page-specific-card-guidelines)
4. [CSS Classes and Styling](#css-classes-and-styling)
5. [Adding New Cards](#adding-new-cards)
6. [Best Practices](#best-practices)
7. [Troubleshooting](#troubleshooting)

## Card Types Overview

The website uses several types of cards, each with specific purposes:

### 1. Publication Cards (`publication-detailed-card`)

- **Purpose**: Display research publications with full details
- **Location**: `publications.html`
- **Features**: Authors, venue, keywords, action buttons, abstracts

### 2. Project Cards (`project-card`)

- **Purpose**: Showcase research projects
- **Location**: `projects.html`, `index.html`
- **Features**: Collapsible details, technology tags, links

### 3. Person Cards (`person-card`)

- **Purpose**: Display team member information
- **Location**: `index.html` (People section)
- **Features**: Contact links, role descriptions, collapsible details

### 4. Collaborator Cards (`collaborator-item`)

- **Purpose**: Show research collaborators
- **Location**: `index.html` (Collaborators section)
- **Features**: Institution info, project focus, website links

### 5. Publication Highlight Cards (`publication-highlight-card`)

- **Purpose**: Featured publications on homepage
- **Location**: `index.html` (Publications section)
- **Features**: Year badges, compact format, external links

### 6. Project Preview Cards (`project-preview-card`)

- **Purpose**: Brief project overviews on homepage
- **Location**: `index.html` (Projects section)
- **Features**: Technology tags, description, links to full page

## General Card Structure

All cards follow this basic HTML structure:

```html
<div class="card-class">
    <div class="card-content">
        <!-- Card header with title -->
        <div class="card-header">
            <h3>Card Title</h3>
            <!-- Optional: Action buttons or badges -->
        </div>
        
        <!-- Main content -->
        <div class="card-body">
            <p>Description or main content</p>
            
            <!-- Optional: Additional sections -->
            <div class="card-details">
                <!-- Detailed information -->
            </div>
            
            <!-- Optional: Tags or categories -->
            <div class="card-tags">
                <span class="tag">Tag 1</span>
                <span class="tag">Tag 2</span>
            </div>
            
            <!-- Optional: Action buttons -->
            <div class="card-actions">
                <a href="#" class="action-btn">Action</a>
            </div>
        </div>
    </div>
</div>
```

## Page-Specific Card Guidelines

### Publications Page (`publications.html`)

#### Adding a New Publication Card

1. **Locate the appropriate year section**:

   ```html
   <div id="year-2025" class="year-section">
       <div class="year-header" onclick="toggleYearSection(this)">
           <h3><i class="fas fa-calendar-alt"></i> 2025 <span class="publication-count">(3 publications)</span></h3>
           <i class="fas fa-chevron-down toggle-icon"></i>
       </div>
       <div class="year-content">
           <!-- Add new publication card here -->
       </div>
   </div>
   ```

2. **Use the publication card template**:

   ```html
   <div class="publication-detailed-card">
       <div class="publication-content">
           <h4>Publication Title</h4>
           <div class="publication-authors">
               <span class="author">Author 1</span>,
               <span class="author">Author 2</span>,
               <span class="author">Author 3</span> et al.
           </div>
           <div class="publication-venue">
               <i class="fas fa-journal-whills"></i>
               Journal/Conference Name
           </div>
           <div class="publication-keywords">
               <span class="keyword category">Keyword 1</span>
               <span class="keyword category">Keyword 2</span>
               <span class="keyword category">Keyword 3</span>
           </div>
           <div class="publication-actions">
               <a href="https://doi.org/..." target="_blank" class="publication-action-btn primary">
                   <i class="fas fa-external-link-alt"></i> View Paper
               </a>
           </div>
       </div>
   </div>
   ```

3. **Update publication counts**:
   - Update the count in the year header: `(3 publications)` → `(4 publications)`
   - Update the count in the table of contents

#### Keyword Categories

Use these predefined keyword categories for consistent styling:

- `microfluidics` - Blue styling
- `ml` - Purple styling  
- `healthcare` - Green styling
- `acoustics` - Orange styling
- `sensors` - Teal styling
- `robotics` - Red styling

### Projects Page (`projects.html`)

#### Adding a New Project Card

1. **Use the project card template**:

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
       <p>Project description...</p>
       
       <div class="project-details">
           <h4><i class="fas fa-microscope"></i> Research Objectives</h4>
           <ul>
               <li>Objective 1</li>
               <li>Objective 2</li>
           </ul>
           
           <h4><i class="fas fa-tools"></i> Methodology</h4>
           <ul>
               <li>Method 1</li>
               <li>Method 2</li>
           </ul>
           
           <h4><i class="fas fa-chart-line"></i> Expected Impact</h4>
           <ul>
               <li>Impact 1</li>
               <li>Impact 2</li>
           </ul>
       </div>
       
       <div class="project-tech">
           <span class="tech-tag primary">Primary Technology</span>
           <span class="tech-tag">Technology 1</span>
           <span class="tech-tag">Technology 2</span>
       </div>
   </div>
   ```

2. **Technology Tags**:
   - Use `primary` class for the main technology
   - Keep tags concise and descriptive
   - Use consistent terminology across projects

### Homepage (`index.html`)

#### Adding Team Members

1. **Faculty/Professor**:

   ```html
   <div class="person-card">
       <div class="person-info">
           <h3>Faculty Professor</h3>
           <p class="person-name">Dr. Name</p>
           <p class="person-title">Title</p>
           <p class="person-description">Description...</p>
           <div class="person-links">
               <a href="mailto:email@purdue.edu" class="person-link">
                   <i class="fas fa-envelope"></i> Contact
               </a>
               <!-- Additional links -->
           </div>
       </div>
   </div>
   ```

2. **Students with Collapsible Details**:

   ```html
   <div class="researcher-item">
       <div class="researcher-header">
           <div class="researcher-basic-info">
               <p class="person-name">Student Name</p>
               <p class="person-focus">Program and Supervisor</p>
           </div>
           <button class="researcher-toggle" aria-label="Toggle details">
               <i class="fas fa-chevron-down"></i>
           </button>
       </div>
       <div class="researcher-details">
           <p class="person-description">Detailed description...</p>
           <div class="person-links">
               <!-- Contact links -->
           </div>
       </div>
   </div>
   ```

#### Adding Collaborators

```html
<div class="collaborator-item">
    <div class="collaborator-header">
        <div class="collaborator-basic-info">
            <h4>Dr. Collaborator Name</h4>
            <p class="collaborator-department">Title and Institution</p>
        </div>
        <button class="collaborator-toggle" aria-label="Toggle details">
            <i class="fas fa-chevron-down"></i>
        </button>
    </div>
    <div class="collaborator-details">
        <p class="collaborator-focus">Project: Project description</p>
        <div class="collaborator-links">
            <a href="https://website.com" target="_blank" class="collaborator-link">
                <i class="fas fa-globe"></i> Website
            </a>
        </div>
    </div>
</div>
```

## CSS Classes and Styling

### Core Card Classes

- `.card` - Base card styling
- `.card-header` - Card title section
- `.card-body` - Main content area
- `.card-details` - Collapsible detailed information
- `.card-tags` - Technology/keyword tags
- `.card-actions` - Action buttons

### Specific Card Classes

- `.publication-detailed-card` - Full publication cards
- `.publication-highlight-card` - Compact publication previews
- `.project-card` - Project information cards
- `.person-card` - Team member cards
- `.collaborator-item` - Collaborator information

### Utility Classes

- `.featured` - Highlights important cards
- `.primary` - Primary technology tags
- `.collapsed` - Collapsed state for expandable cards
- `.expanded` - Expanded state for expandable cards

## Adding New Cards

### Step-by-Step Process

1. **Identify the appropriate page and section**
2. **Choose the correct card type** based on content
3. **Copy the template** from existing cards
4. **Replace placeholder content** with actual information
5. **Update any counters** (publication counts, etc.)
6. **Test the card** for proper styling and functionality

### Content Guidelines

#### Text Content

- Keep titles concise but descriptive
- Use proper academic formatting for publications
- Include relevant contact information
- Maintain consistent tone across all cards

#### Links and Actions

- Always include `target="_blank"` for external links
- Include proper `aria-label` attributes

#### Images and Media

- Use consistent aspect ratios
- Include alt text for accessibility
- Optimize file sizes for web
- Use appropriate file formats (WebP, PNG, JPG)

## Best Practices

### Performance

- Optimize images before adding
- Use appropriate image formats

## Troubleshooting

### Common Issues

#### Card Not Displaying Properly

- Check HTML structure matches template
- Verify CSS classes are correct
- Ensure proper nesting of elements
- Check for missing closing tags

#### Content Not Updating

- Clear browser cache
- Check file save status
- Verify GitHub deployment
- Test in different browsers

### Getting Help

If you encounter issues not covered in this documentation:

1. Check existing similar cards for reference
2. Review the CSS file for styling patterns
3. Test changes in a development environment

---

**Last Updated**: October 2025  
**Version**: 1.0 (Partially Generated)
**Maintained by**: Max Chen
