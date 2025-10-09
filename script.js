// Main JavaScript for Max Chen's Portfolio Website

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle functionality
    const hamburger = document.querySelector('.hamburger-menu');
    const navOverlay = document.querySelector('.nav-overlay');
    const navLinks = document.querySelectorAll('.nav-links a');
    const body = document.body;
    
    function toggleMobileMenu() {
        body.classList.toggle('menu-open');
    }
    
    function closeMobileMenu() {
        body.classList.remove('menu-open');
    }
    
    // Add event listeners if elements exist
    if (hamburger) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }
    
    if (navOverlay) {
        navOverlay.addEventListener('click', closeMobileMenu);
    }
    
    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (body.classList.contains('menu-open')) {
                closeMobileMenu();
            }
        });
    });

    // Researcher dropdown functionality
    const researcherToggles = document.querySelectorAll('.researcher-toggle');
    
    researcherToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const researcherItem = this.closest('.researcher-item');
            const isExpanded = researcherItem.classList.contains('expanded');
            
            // Toggle the expanded state
            if (isExpanded) {
                researcherItem.classList.remove('expanded');
                this.setAttribute('aria-expanded', 'false');
            } else {
                researcherItem.classList.add('expanded');
                this.setAttribute('aria-expanded', 'true');
            }
        });
        
        // Initialize aria-expanded attribute
        toggle.setAttribute('aria-expanded', 'false');
    });

    // Also allow clicking on the researcher header to toggle
    const researcherHeaders = document.querySelectorAll('.researcher-header');
    
    researcherHeaders.forEach(header => {
        header.addEventListener('click', function(e) {
            // Don't trigger if the toggle button was clicked directly
            if (e.target.closest('.researcher-toggle')) {
                return;
            }
            
            const toggle = this.querySelector('.researcher-toggle');
            if (toggle) {
                toggle.click();
            }
        });
    });

    // Collaborator dropdown functionality
    const collaboratorToggles = document.querySelectorAll('.collaborator-toggle');
    
    collaboratorToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const collaboratorItem = this.closest('.collaborator-item');
            const isExpanded = collaboratorItem.classList.contains('expanded');
            
            // Toggle the expanded state
            if (isExpanded) {
                collaboratorItem.classList.remove('expanded');
                this.setAttribute('aria-expanded', 'false');
            } else {
                collaboratorItem.classList.add('expanded');
                this.setAttribute('aria-expanded', 'true');
            }
        });
        
        // Initialize aria-expanded attribute
        toggle.setAttribute('aria-expanded', 'false');
    });

    // Also allow clicking on the collaborator header to toggle
    const collaboratorHeaders = document.querySelectorAll('.collaborator-header');
    
    collaboratorHeaders.forEach(header => {
        header.addEventListener('click', function(e) {
            // Don't trigger if the toggle button was clicked directly
            if (e.target.closest('.collaborator-toggle')) {
                return;
            }
            
            const toggle = this.querySelector('.collaborator-toggle');
            if (toggle) {
                toggle.click();
            }
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (body.classList.contains('menu-open')) {
            const isMenuClick = e.target.closest('.nav-links') || 
                               e.target.closest('.hamburger-menu');
            if (!isMenuClick) {
                closeMobileMenu();
            }
        }
    });
    
    // Handle escape key to close menu
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && body.classList.contains('menu-open')) {
            closeMobileMenu();
        }
    });
    
    // Function to handle scrolling to an element with proper offset
    function scrollToElement(targetElement, useSmooth = true) {
        if (!targetElement) return;
        
        // Get the height of the fixed header
        const nav = document.querySelector('nav');
        const navHeight = nav ? nav.offsetHeight : 60;
        // Add extra padding for better visual appearance
        const extraPadding = 30;
        const totalOffset = navHeight + extraPadding;
        
        // Get the element's position relative to the viewport
        const elementRect = targetElement.getBoundingClientRect();
        const absoluteElementTop = elementRect.top + window.pageYOffset;
        
        // Scroll to element
        window.scrollTo({
            top: absoluteElementTop - totalOffset,
            behavior: useSmooth ? 'smooth' : 'auto'
        });
    }
    
    // Smooth scrolling for anchor links (only for same-page links)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            
            // Skip if it's just "#" or empty
            if (targetId === '#' || targetId === '#top') {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                return;
            }
            
            const targetElement = document.querySelector(targetId);
            
            // Only prevent default if target exists on current page
            if (targetElement) {
                e.preventDefault();
                scrollToElement(targetElement, true);
            }
            // If target doesn't exist, let the browser handle it (might be on another page)
        });
    });
    
    // Handle direct URL navigation to anchor links
    if (window.location.hash) {
        // Use a delay to ensure the page is fully loaded and rendered
        setTimeout(function() {
            const targetId = window.location.hash;
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                scrollToElement(targetElement, false);
            }
        }, 300);
    }
    
    // Recalculate scroll positions when window is resized
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            // If we're at a hash location, reposition after resize
            if (window.location.hash) {
                const targetElement = document.querySelector(window.location.hash);
                if (targetElement) {
                    scrollToElement(targetElement, false);
                }
            }
        }, 250);
    });
    
    // Add scrolled class to body when page is scrolled
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            body.classList.add('scrolled');
        } else {
            body.classList.remove('scrolled');
        }
        
        // Show/hide back to top button
        const backToTop = document.querySelector('.back-to-top');
        if (backToTop) {
            if (window.scrollY > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }
        
        // Update progress bar
        updateProgressBar();
    });
    
    
    // Set active page in navigation for multi-page structure
    function setActivePageNav() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('nav ul li a');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const linkPath = link.getAttribute('href');
            
            // Check if this link matches the current page
            if (linkPath === currentPage || 
                (currentPage === '' && linkPath === 'index.html') ||
                (currentPage === 'index.html' && linkPath === 'index.html') ||
                linkPath.endsWith(currentPage)) {
                link.classList.add('active');
            }
        });
    }
    
    // Set active page navigation on load
    setActivePageNav();
    
    // Image lazy loading
    const lazyImages = document.querySelectorAll('img[loading="lazy"], .gallery-item img, .project-image img');
    
    // For browsers that support IntersectionObserver
    if ('IntersectionObserver' in window && lazyImages.length > 0) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const image = entry.target;
                    
                    // If the image has a data-src, load that image
                    if (image.dataset.src) {
                        image.src = image.dataset.src;
                        image.removeAttribute('data-src');
                    }
                    
                    image.classList.add('loaded');
                    imageObserver.unobserve(image);
                }
            });
        });
        
        lazyImages.forEach(image => {
            imageObserver.observe(image);
        });
    }
    

    
    // Gallery functionality for project images
    const galleryItems = document.querySelectorAll('.gallery-item');
    if (galleryItems.length > 0) {
        galleryItems.forEach(item => {
            item.addEventListener('click', function() {
                const img = this.querySelector('img');
                const overlay = this.querySelector('.gallery-overlay');
                if (img) {
                    let description = img.alt;
                    
                    // Try to get more descriptive text from overlay
                    if (overlay) {
                        const title = overlay.querySelector('h4');
                        const subtitle = overlay.querySelector('p');
                        if (title && subtitle) {
                            description = `${title.textContent} - ${subtitle.textContent}`;
                        } else if (title) {
                            description = title.textContent;
                        }
                    }
                    
                    openImageModal(img.src, img.alt, description);
                }
            });
        });
    }
    
    // Clickable image functionality
    const clickableImages = document.querySelectorAll('.clickable-image');
    if (clickableImages.length > 0) {
        clickableImages.forEach(item => {
            item.addEventListener('click', function() {
                const img = this.querySelector('img');
                if (img) {
                    // Try to find a more descriptive caption nearby
                    let description = img.alt;
                    
                    // Look for project header or title in parent elements
                    const projectCard = this.closest('.project-card');
                    if (projectCard) {
                        const projectTitle = projectCard.querySelector('h3');
                        if (projectTitle) {
                            description = `${projectTitle.textContent} - ${img.alt}`;
                        }
                    }
                    
                    // Look for timeline content headers
                    const timelineContent = this.closest('.timeline-content');
                    if (timelineContent) {
                        const jobTitle = timelineContent.querySelector('.job-title');
                        if (jobTitle) {
                            description = `${jobTitle.textContent} - ${img.alt}`;
                        }
                    }
                    
                    openImageModal(img.src, img.alt, description);
                }
            });
        });
    }
    
    // Enhanced image modal with description
    function openImageModal(src, alt, description = null) {
        // Use alt text as description if no specific description provided
        const modalDescription = description || alt;
        
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'image-modal';
        modal.innerHTML = `
            <div class="modal-backdrop">
                <div class="modal-content">
                    <div class="modal-image-container">
                        <img src="${src}" alt="${alt}">
                    </div>
                    ${modalDescription ? `
                        <div class="modal-description">
                            <h3>${modalDescription}</h3>
                        </div>
                    ` : ''}
                    <button class="modal-close" aria-label="Close">&times;</button>
                </div>
            </div>
        `;
        
        // Add modal styles
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            padding: 2rem;
            box-sizing: border-box;
        `;
        
        const modalContent = modal.querySelector('.modal-content');
        modalContent.style.cssText = `
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            max-width: 90vw;
            max-height: 90vh;
            gap: 1rem;
            background: transparent;
        `;
        
        const imageContainer = modal.querySelector('.modal-image-container');
        imageContainer.style.cssText = `
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            max-width: 100%;
            max-height: 80vh;
        `;
        
        const modalImg = modal.querySelector('img');
        modalImg.style.cssText = `
            max-width: 100%;
            max-height: 100%;
            width: auto;
            height: auto;
            border-radius: 12px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        `;
        
        const descriptionEl = modal.querySelector('.modal-description');
        if (descriptionEl) {
            descriptionEl.style.cssText = `
                background: rgba(255, 255, 255, 0.95);
                color: #1f2937;
                padding: 1rem 1.5rem;
                border-radius: 12px;
                text-align: center;
                backdrop-filter: blur(10px);
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
                max-width: 600px;
            `;
            
            const titleEl = descriptionEl.querySelector('h3');
            if (titleEl) {
                titleEl.style.cssText = `
                    margin: 0;
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: #1f2937;
                    line-height: 1.4;
                `;
            }
        }
        
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.8);
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            padding: 12px;
            width: 44px;
            height: 44px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1001;
            transition: all 0.3s ease;
            border: 2px solid rgba(255, 255, 255, 0.2);
        `;
        
        // Enhanced close button hover effect
        closeBtn.addEventListener('mouseenter', function() {
            this.style.background = 'rgba(239, 68, 68, 0.9)';
            this.style.transform = 'scale(1.1)';
        });
        
        closeBtn.addEventListener('mouseleave', function() {
            this.style.background = 'rgba(0, 0, 0, 0.8)';
            this.style.transform = 'scale(1)';
        });
        
        // Close modal function
        function closeModal() {
            modal.style.opacity = '0';
            setTimeout(() => {
                modal.remove();
            }, 300);
        }
        
        // Fade in animation
        modal.style.opacity = '0';
        modal.style.transition = 'opacity 0.3s ease';
        
        // Event listeners
        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', function(e) {
            if (e.target === modal || e.target === modal.querySelector('.modal-backdrop') || e.target === modal.querySelector('.modal-content')) {
                closeModal();
            }
        });
        
        // Allow clicking on modal content area to close
        const modalContentEl = modal.querySelector('.modal-content');
        modalContentEl.addEventListener('click', function(e) {
            // Only close if clicking directly on the modal content container, not on image or description
            if (e.target === modalContentEl) {
                closeModal();
            }
        });
        
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeModal();
            }
        });
        
        // Add to DOM and fade in
        document.body.appendChild(modal);
        setTimeout(() => {
            modal.style.opacity = '1';
        }, 10);
    }
    
    // Progress bar functionality
    function updateProgressBar() {
        const progressBar = document.getElementById('progress-bar');
        if (!progressBar) return;
        
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        
        progressBar.style.width = scrolled + '%';
    }
    
    // Initialize progress bar
    updateProgressBar();
    
    // Smooth scroll for back to top button
    const backToTopBtn = document.querySelector('.back-to-top');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Add animation on scroll for content sections
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe content sections for animation
    const contentSections = document.querySelectorAll('.content-section');
    contentSections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        sectionObserver.observe(section);
    });

    // Collapsible experience cards functionality
    const timelineContents = document.querySelectorAll('.timeline-content');
    if (timelineContents.length > 0) {
        timelineContents.forEach(content => {
            // Add accessibility attributes
            content.setAttribute('role', 'button');
            content.setAttribute('tabindex', '0');
            content.setAttribute('aria-expanded', 'true'); // Default expanded on desktop
            
            content.addEventListener('click', function(e) {
                // Prevent clicking on links from triggering collapse
                if (e.target.tagName === 'A' || e.target.closest('a')) {
                    return;
                }
                
                toggleTimelineContent(this);
            });
            
            // Handle keyboard navigation
            content.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    // Prevent clicking on links from triggering collapse
                    if (e.target.tagName === 'A' || e.target.closest('a')) {
                        return;
                    }
                    
                    toggleTimelineContent(this);
                }
            });
            
            // Add cursor pointer to indicate it's clickable
            content.style.cursor = 'pointer';
        });
    }

    // Ensure chevron buttons are specifically clickable
    const collapseButtons = document.querySelectorAll('.collapse-btn');
    if (collapseButtons.length > 0) {
        collapseButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                // Don't prevent propagation - let it bubble up to the card
                const timelineContent = this.closest('.timeline-content');
                if (timelineContent) {
                    toggleTimelineContent(timelineContent);
                }
            });
        });
    }

    // Ensure the header area (title/period area) is specifically clickable
    const collapsibleHeaders = document.querySelectorAll('.collapsible-header');
    if (collapsibleHeaders.length > 0) {
        collapsibleHeaders.forEach(header => {
            header.addEventListener('click', function(e) {
                // Prevent clicking on links from triggering collapse
                if (e.target.tagName === 'A' || e.target.closest('a')) {
                    return;
                }
                
                const timelineContent = this.closest('.timeline-content');
                if (timelineContent) {
                    toggleTimelineContent(timelineContent);
                }
            });
        });
    }

    // Project Cards Collapsible Functionality
    const projectCards = document.querySelectorAll('.project-card');
    if (projectCards.length > 0) {
        projectCards.forEach(card => {
            // Add accessibility attributes
            card.setAttribute('role', 'button');
            card.setAttribute('tabindex', '0');
            card.setAttribute('aria-expanded', 'true'); // Default expanded on desktop
            
            card.addEventListener('click', function(e) {
                // Prevent clicking on links, images, or videos from triggering collapse
                if (e.target.tagName === 'A' || e.target.closest('a') || 
                    e.target.tagName === 'IMG' || e.target.closest('.clickable-image') ||
                    e.target.tagName === 'IFRAME' || e.target.closest('.youtube-embed')) {
                    return;
                }
                
                toggleProjectCard(this);
            });
            
            // Handle keyboard navigation
            card.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    // Prevent clicking on links from triggering collapse
                    if (e.target.tagName === 'A' || e.target.closest('a')) {
                        return;
                    }
                    
                    toggleProjectCard(this);
                }
            });
            
            // Add cursor pointer to indicate it's clickable
            card.style.cursor = 'pointer';
        });
    }

    // Ensure project header area is specifically clickable
    const projectCollapsibleHeaders = document.querySelectorAll('.project-collapsible-header');
    if (projectCollapsibleHeaders.length > 0) {
        projectCollapsibleHeaders.forEach(header => {
            header.addEventListener('click', function(e) {
                // Prevent clicking on links from triggering collapse
                if (e.target.tagName === 'A' || e.target.closest('a')) {
                    return;
                }
                
                const projectCard = this.closest('.project-card');
                if (projectCard) {
                    toggleProjectCard(projectCard);
                }
            });
        });
    }

    // Ensure project headers (title area) are specifically clickable
    const projectHeaders = document.querySelectorAll('.project-header');
    if (projectHeaders.length > 0) {
        projectHeaders.forEach(header => {
            header.addEventListener('click', function(e) {
                // Prevent clicking on links from triggering collapse
                if (e.target.tagName === 'A' || e.target.closest('a')) {
                    return;
                }
                
                const projectCard = this.closest('.project-card');
                if (projectCard) {
                    toggleProjectCard(projectCard);
                }
            });
        });
    }

    // Ensure project chevron buttons are specifically clickable
    const projectCollapseButtons = document.querySelectorAll('.project-collapse-btn');
    if (projectCollapseButtons.length > 0) {
        projectCollapseButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                // Don't prevent propagation - let it bubble up to the card
                const projectCard = this.closest('.project-card');
                if (projectCard) {
                    toggleProjectCard(projectCard);
                }
            });
        });
    }



    // Function to toggle timeline content
    function toggleTimelineContent(timelineContent) {
        let isExpanded;
        
        if (window.innerWidth <= 768) {
            // Mobile: toggle expanded class
            timelineContent.classList.toggle('expanded');
            isExpanded = timelineContent.classList.contains('expanded');
        } else {
            // Desktop: toggle collapsed class
            timelineContent.classList.toggle('collapsed');
            isExpanded = !timelineContent.classList.contains('collapsed');
        }
        
        // Update aria-expanded attribute for accessibility
        timelineContent.setAttribute('aria-expanded', isExpanded.toString());
    }

    // Function to toggle project card content
    function toggleProjectCard(projectCard) {
        let isExpanded;
        
        if (window.innerWidth <= 768) {
            // Mobile: toggle expanded class
            projectCard.classList.toggle('expanded');
            isExpanded = projectCard.classList.contains('expanded');
        } else {
            // Desktop: toggle collapsed class
            projectCard.classList.toggle('collapsed');
            isExpanded = !projectCard.classList.contains('collapsed');
        }
        
        // Update aria-expanded attribute for accessibility
        projectCard.setAttribute('aria-expanded', isExpanded.toString());
    }

    // Initialize collapse states based on screen size
    function initializeCollapseStates() {
        const timelineContents = document.querySelectorAll('.timeline-content');
        
        timelineContents.forEach(content => {
            let isExpanded;
            
            if (window.innerWidth <= 768) {
                // Mobile: collapsed by default, use expanded class to show
                content.classList.remove('collapsed');
                content.classList.remove('expanded');
                isExpanded = false;
            } else {
                // Desktop: expanded by default, use collapsed class to hide
                content.classList.remove('collapsed');
                content.classList.remove('expanded');
                isExpanded = true;
            }
            
            // Update aria-expanded attribute
            content.setAttribute('aria-expanded', isExpanded.toString());
        });

        // Initialize project cards
        const projectCards = document.querySelectorAll('.project-card');
        
        projectCards.forEach(card => {
            let isExpanded;
            
            if (window.innerWidth <= 768) {
                // Mobile: collapsed by default, use expanded class to show
                card.classList.remove('collapsed');
                card.classList.remove('expanded');
                isExpanded = false;
            } else {
                // Desktop: expanded by default, use collapsed class to hide
                card.classList.remove('collapsed');
                card.classList.remove('expanded');
                isExpanded = true;
            }
            
            // Update aria-expanded attribute
            card.setAttribute('aria-expanded', isExpanded.toString());
        });
    }

    // Initialize on load
    initializeCollapseStates();

    // Reinitialize on resize
    let resizeCollapseTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeCollapseTimer);
        resizeCollapseTimer = setTimeout(initializeCollapseStates, 100);
    });

    // Active section highlighting in navigation
    function updateActiveSection() {
        const sections = document.querySelectorAll('.content-section[id]');
        const navLinks = document.querySelectorAll('nav ul li a[href^="#"]');
        
        if (sections.length === 0 || navLinks.length === 0) return;
        
        const scrollPosition = window.scrollY + 100; // Add offset for better detection
        let activeSection = null;
        
        // Find the topmost visible section
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionBottom = sectionTop + sectionHeight;
            
            // Check if section is currently visible on screen
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                if (!activeSection || sectionTop < activeSection.offsetTop) {
                    activeSection = section;
                }
            }
        });
        
        // Remove all active classes
        navLinks.forEach(link => link.classList.remove('active'));
        
        // Add active class to the corresponding nav link
        if (activeSection) {
            const activeId = activeSection.id;
            const activeLink = document.querySelector(`nav ul li a[href="#${activeId}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    }

    // Throttle scroll events for better performance
    let scrollTimeout;
    function throttledUpdateActiveSection() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(updateActiveSection, 10);
    }

    // Add scroll event listener for navigation highlighting
    window.addEventListener('scroll', throttledUpdateActiveSection);
    
    // Initialize on load
    updateActiveSection();
});

// Helper function to close TOC if it's open
function closeTOCIfOpen() {
    const floatingTOC = document.querySelector('.floating-toc');
    const toggleButton = document.querySelector('.toc-toggle');
    
    if (floatingTOC && floatingTOC.classList.contains('expanded')) {
        floatingTOC.classList.remove('expanded');
        if (toggleButton) {
            toggleButton.setAttribute('aria-label', 'Open table of contents');
        }
    }
}

// Modal functions for resume preview
function openResumeModal() {
    // Close TOC if it's open
    closeTOCIfOpen();
    
    const modal = document.getElementById('resumeModal');
    const frame = document.getElementById('resumeFrame');
    
    // Set the PDF source
    frame.src = 'documents/Max_Chen_Resume.pdf';
    
    // Show modal
    modal.style.display = 'block';
    
    // Prevent body scrolling when modal is open
    document.body.style.overflow = 'hidden';
}

function closeResumeModal() {
    const modal = document.getElementById('resumeModal');
    const frame = document.getElementById('resumeFrame');
    
    // Hide modal
    modal.style.display = 'none';
    
    // Clear iframe source to stop loading
    frame.src = '';
    
    // Re-enable body scrolling
    document.body.style.overflow = 'auto';
}

function downloadFromModal() {
    // Create temporary link and trigger download
    const link = document.createElement('a');
    link.href = 'documents/Max_Chen_Resume.pdf';
    link.download = 'Max_Chen_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// CV Modal functions
function openCVModal() {
    // Close TOC if it's open
    closeTOCIfOpen();
    
    const modal = document.getElementById('cvModal');
    const frame = document.getElementById('cvFrame');
    
    // Set the PDF source
    frame.src = 'documents/Max_Chen_CV.pdf';
    
    // Show modal
    modal.style.display = 'block';
    
    // Prevent body scrolling when modal is open
    document.body.style.overflow = 'hidden';
}

function closeCVModal() {
    const modal = document.getElementById('cvModal');
    const frame = document.getElementById('cvFrame');
    
    // Hide modal
    modal.style.display = 'none';
    
    // Clear iframe source to stop loading
    frame.src = '';
    
    // Re-enable body scrolling
    document.body.style.overflow = 'auto';
}

function downloadCVFromModal() {
    // Create temporary link and trigger download
    const link = document.createElement('a');
    link.href = 'documents/Max_Chen_CV.pdf';
    link.download = 'Max_Chen_CV.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Close modal when clicking outside of it
window.onclick = function(event) {
    const resumeModal = document.getElementById('resumeModal');
    const cvModal = document.getElementById('cvModal');
    
    if (event.target === resumeModal) {
        closeResumeModal();
    }
    if (event.target === cvModal) {
        closeCVModal();
    }
}

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const resumeModal = document.getElementById('resumeModal');
        const cvModal = document.getElementById('cvModal');
        
        if (resumeModal.style.display === 'block') {
            closeResumeModal();
        }
        if (cvModal.style.display === 'block') {
            closeCVModal();
        }
    }
}); 