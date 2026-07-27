/**
 * Publications page — year sections, counts, and expand/collapse.
 * Loaded only on publications.html (after script.js / toc.js).
 */
(function () {
    'use strict';

    function yearPadding() {
        return window.innerWidth <= 768 ? '0.5rem' : '0.75rem';
    }

    function setYearExpanded(section, expanded) {
        const content = section.querySelector('.year-content');
        const icon = section.querySelector('.toggle-icon');
        if (!content || !icon) return;

        if (expanded) {
            content.style.maxHeight = content.scrollHeight + 'px';
            content.style.paddingTop = yearPadding();
            content.style.paddingBottom = yearPadding();
            icon.style.transform = 'rotate(180deg)';
        } else {
            content.style.maxHeight = '0';
            content.style.paddingTop = '0';
            content.style.paddingBottom = '0';
            icon.style.transform = 'rotate(0deg)';
        }
    }

    function isYearExpanded(section) {
        const content = section.querySelector('.year-content');
        return !!(content && content.style.maxHeight && content.style.maxHeight !== '0px');
    }

    function updateCollapseAllButton() {
        const btn = document.getElementById('collapse-all-btn');
        if (!btn) return;

        const anyExpanded = Array.from(document.querySelectorAll('.year-section')).some(isYearExpanded);
        btn.innerHTML = anyExpanded
            ? '<i class="fas fa-compress-alt"></i> Collapse All'
            : '<i class="fas fa-expand-alt"></i> Expand All';
    }

    function toggleYearSection(header) {
        const section = header.closest('.year-section');
        if (!section) return;
        setYearExpanded(section, !isYearExpanded(section));
        updateCollapseAllButton();
    }

    function toggleAllYears() {
        const sections = document.querySelectorAll('.year-section');
        const anyExpanded = Array.from(sections).some(isYearExpanded);
        sections.forEach((section) => setYearExpanded(section, !anyExpanded));
        updateCollapseAllButton();
    }

    function recalculateExpandedHeights() {
        document.querySelectorAll('.year-section').forEach((section) => {
            if (!isYearExpanded(section)) return;
            const content = section.querySelector('.year-content');
            if (!content) return;
            content.style.maxHeight = 'none';
            content.style.maxHeight = content.scrollHeight + 'px';
        });
    }

    function updatePublicationCounts() {
        document.querySelectorAll('.year-section').forEach((section) => {
            const count = section.querySelectorAll('.publication-detailed-card').length;
            const yearHeader = section.querySelector('.publication-count');
            if (yearHeader) {
                yearHeader.textContent = `(${count} publication${count !== 1 ? 's' : ''})`;
            }

            const tocLink = document.querySelector(`a[href="#${section.id}"]`);
            const tocCount = tocLink && tocLink.querySelector('.count');
            if (tocCount) {
                tocCount.textContent = `(${count})`;
            }
        });
    }

    function initYearSections() {
        const sections = document.querySelectorAll('.year-section');
        if (!sections.length) return;

        updatePublicationCounts();

        const currentYearId = 'year-' + new Date().getFullYear();
        const yearToExpand =
            document.getElementById(currentYearId) || sections[0];

        sections.forEach((section) => {
            setYearExpanded(section, section === yearToExpand);
        });
        updateCollapseAllButton();
    }

    document.addEventListener('DOMContentLoaded', function () {
        initYearSections();

        document.querySelectorAll('.year-header').forEach((header) => {
            header.addEventListener('click', function () {
                toggleYearSection(this);
            });
            header.setAttribute('role', 'button');
            header.setAttribute('tabindex', '0');
            header.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleYearSection(this);
                }
            });
        });

        const collapseBtn = document.getElementById('collapse-all-btn');
        if (collapseBtn) {
            collapseBtn.addEventListener('click', toggleAllYears);
        }

        let resizeTimer;
        window.addEventListener('resize', function () {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(recalculateExpandedHeights, 250);
        });
    });

    // Optional manual refresh after DOM edits
    window.updatePublicationCounts = updatePublicationCounts;
})();
