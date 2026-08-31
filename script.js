/**
 * SEAT-Lab site scripts — shared across pages.
 */
document.addEventListener('DOMContentLoaded', function () {
    const body = document.body;
    const hamburger = document.querySelector('.hamburger-menu');
    const navOverlay = document.querySelector('.nav-overlay');
    const navLinks = document.querySelectorAll('.nav-links a');

    function toggleMobileMenu() {
        body.classList.toggle('menu-open');
    }

    function closeMobileMenu() {
        body.classList.remove('menu-open');
    }

    if (hamburger) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }

    if (navOverlay) {
        navOverlay.addEventListener('click', closeMobileMenu);
    }

    navLinks.forEach((link) => {
        link.addEventListener('click', () => {
            if (body.classList.contains('menu-open')) {
                closeMobileMenu();
            }
        });
    });

    document.addEventListener('click', function (e) {
        if (!body.classList.contains('menu-open')) return;
        const isMenuClick =
            e.target.closest('.nav-links') || e.target.closest('.hamburger-menu');
        if (!isMenuClick) {
            closeMobileMenu();
        }
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && body.classList.contains('menu-open')) {
            closeMobileMenu();
        }
    });

    // Collapsible person cards (e.g. Alumni)
    document.querySelectorAll('.person-card-toggle').forEach((toggle) => {
        const card = toggle.closest('.collapsible-card');
        const expanded = card && !card.classList.contains('collapsed');
        toggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
        toggle.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            const card = this.closest('.collapsible-card');
            if (!card) return;

            const collapsed = card.classList.toggle('collapsed');
            this.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
        });
    });

    document.querySelectorAll('.person-card-header').forEach((header) => {
        header.addEventListener('click', function (e) {
            if (e.target.closest('.person-card-toggle')) return;
            const toggle = this.querySelector('.person-card-toggle');
            if (toggle) toggle.click();
        });
    });

    // Researcher bio expand/collapse
    document.querySelectorAll('.researcher-toggle').forEach((toggle) => {
        toggle.setAttribute('aria-expanded', 'false');
        toggle.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            const item = this.closest('.researcher-item');
            if (!item) return;

            const expanded = item.classList.toggle('expanded');
            this.setAttribute('aria-expanded', expanded ? 'true' : 'false');
        });
    });

    document.querySelectorAll('.researcher-header').forEach((header) => {
        header.addEventListener('click', function (e) {
            if (e.target.closest('.researcher-toggle')) return;
            const toggle = this.querySelector('.researcher-toggle');
            if (toggle) toggle.click();
        });
    });

    function scrollToElement(targetElement, useSmooth = true) {
        if (!targetElement) return;

        const nav = document.querySelector('nav');
        const navHeight = nav ? nav.offsetHeight : 60;
        const totalOffset = navHeight + 30;
        const absoluteElementTop =
            targetElement.getBoundingClientRect().top + window.pageYOffset;

        window.scrollTo({
            top: absoluteElementTop - totalOffset,
            behavior: useSmooth ? 'smooth' : 'auto',
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');

            if (targetId === '#' || targetId === '#top') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                scrollToElement(targetElement, true);
            }
        });
    });

    if (window.location.hash) {
        setTimeout(function () {
            const targetElement = document.querySelector(window.location.hash);
            if (targetElement) {
                scrollToElement(targetElement, false);
            }
        }, 300);
    }

    let resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            if (!window.location.hash) return;
            const targetElement = document.querySelector(window.location.hash);
            if (targetElement) {
                scrollToElement(targetElement, false);
            }
        }, 250);
    });

    function updateProgressBar() {
        const progressBar = document.getElementById('progress-bar');
        if (!progressBar) return;

        const winScroll =
            document.body.scrollTop || document.documentElement.scrollTop;
        const height =
            document.documentElement.scrollHeight -
            document.documentElement.clientHeight;
        const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
        progressBar.style.width = scrolled + '%';
    }

    const backToTopBtn = document.querySelector('.back-to-top');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', function (e) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            body.classList.add('scrolled');
        } else {
            body.classList.remove('scrolled');
        }

        if (backToTopBtn) {
            backToTopBtn.classList.toggle('visible', window.scrollY > 300);
        }

        updateProgressBar();
    });

    updateProgressBar();

    // Multi-page active nav (projects.html / publications.html)
    (function setActivePageNav() {
        const currentPage =
            window.location.pathname.split('/').pop() || 'index.html';
        if (currentPage === 'index.html' || currentPage === '') return;

        document.querySelectorAll('nav ul li a').forEach((link) => {
            const href = link.getAttribute('href') || '';
            const isActive =
                href === currentPage ||
                href.endsWith('/' + currentPage) ||
                href.split('#')[0] === currentPage;
            link.classList.toggle('active', isActive);
        });
    })();

    // Project detail collapse (projects page)
    function toggleProjectCard(projectCard) {
        let isExpanded;

        if (window.innerWidth <= 768) {
            projectCard.classList.toggle('expanded');
            isExpanded = projectCard.classList.contains('expanded');
        } else {
            projectCard.classList.toggle('collapsed');
            isExpanded = !projectCard.classList.contains('collapsed');
        }

        projectCard.setAttribute('aria-expanded', isExpanded.toString());
    }

    function initializeProjectCollapseStates() {
        document.querySelectorAll('.project-card').forEach((card) => {
            if (!card.querySelector('.project-details')) return;

            card.classList.remove('collapsed', 'expanded');
            const isExpanded = window.innerWidth > 768;
            card.setAttribute('aria-expanded', isExpanded.toString());
        });
    }

    const projectCollapseButtons = document.querySelectorAll(
        '.project-collapse-btn'
    );
    if (projectCollapseButtons.length > 0) {
        projectCollapseButtons.forEach((button) => {
            button.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                const projectCard = this.closest('.project-card');
                if (projectCard) toggleProjectCard(projectCard);
            });
        });

        document
            .querySelectorAll('.project-collapsible-header')
            .forEach((header) => {
                header.addEventListener('click', function (e) {
                    if (
                        e.target.tagName === 'A' ||
                        e.target.closest('a') ||
                        e.target.closest('.project-collapse-btn')
                    ) {
                        return;
                    }
                    const projectCard = this.closest('.project-card');
                    if (projectCard) toggleProjectCard(projectCard);
                });
            });

        initializeProjectCollapseStates();

        let projectResizeTimer;
        window.addEventListener('resize', function () {
            clearTimeout(projectResizeTimer);
            projectResizeTimer = setTimeout(
                initializeProjectCollapseStates,
                100
            );
        });
    }

    // Homepage: highlight section in sticky nav while scrolling
    function updateActiveSection() {
        const sections = document.querySelectorAll('.content-section[id]');
        const sectionNavLinks = document.querySelectorAll(
            'nav ul li a[href^="#"]'
        );
        if (sections.length === 0 || sectionNavLinks.length === 0) return;

        const scrollPosition = window.scrollY + 100;
        let activeSection = null;

        sections.forEach((section) => {
            const top = section.offsetTop;
            const bottom = top + section.offsetHeight;
            if (scrollPosition >= top && scrollPosition < bottom) {
                if (!activeSection || top < activeSection.offsetTop) {
                    activeSection = section;
                }
            }
        });

        sectionNavLinks.forEach((link) => link.classList.remove('active'));
        if (activeSection) {
            const activeLink = document.querySelector(
                `nav ul li a[href="#${activeSection.id}"]`
            );
            if (activeLink) activeLink.classList.add('active');
        }
    }

    let sectionScrollTimeout;
    window.addEventListener('scroll', function () {
        if (sectionScrollTimeout) clearTimeout(sectionScrollTimeout);
        sectionScrollTimeout = setTimeout(updateActiveSection, 10);
    });
    updateActiveSection();
});
