// Floating TOC functionality
document.addEventListener('DOMContentLoaded', function() {
    const floatingTOC = document.querySelector('.floating-toc');
    const toggleButton = document.querySelector('.toc-toggle');
    const closeButton = document.querySelector('.toc-close');
    const tocPanel = document.querySelector('.toc-panel');
    const tocLinks = document.querySelectorAll('.toc-link');
    const sections = document.querySelectorAll('section[id], .timeline-item[id], .year-section[id]');
    const progressBar = document.querySelector('.toc-progress-bar');
    
    let isExpanded = false;
    let scrollTimeout;
    
    // Ensure TOC starts closed
    function ensureTOCClosed() {
        isExpanded = false;
        if (floatingTOC) {
            floatingTOC.classList.remove('expanded');
            toggleButton.setAttribute('aria-label', 'Open table of contents');
        }
    }
    
    // Function to update active navigation item and progress
    function updateActiveNavItem() {
        let currentSection = '';
        const scrollY = window.scrollY;
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollProgress = (scrollY / documentHeight) * 100;
        
        // Update progress bar
        if (progressBar) {
            progressBar.style.height = Math.min(scrollProgress, 100) + '%';
        }
        
        // Find current section
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const sectionTop = rect.top + window.pageYOffset;
            const sectionHeight = rect.height;
            
            // Use the same offset calculation as the scroll function
            const header = document.querySelector('nav');
            const headerHeight = header ? header.offsetHeight : 60;
            const threshold = headerHeight + 30; // Slightly larger threshold for better detection
            
            if (scrollY >= sectionTop - threshold && scrollY < sectionTop + sectionHeight - threshold) {
                currentSection = section.getAttribute('id');
            }
        });
        
        // Update active states
        tocLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + currentSection) {
                link.classList.add('active');
            }
        });
    }
    
    // Smooth scroll function with improved behavior
    function smoothScrollTo(targetId) {
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            // Calculate offset based on fixed header height and desired padding
            const header = document.querySelector('nav');
            const headerHeight = header ? header.offsetHeight : 60;
            const additionalPadding = 40; // Extra space for better visual positioning
            const offset = headerHeight + additionalPadding;
            
            // Get the element's position relative to the document
            const elementRect = targetElement.getBoundingClientRect();
            const elementPosition = elementRect.top + window.pageYOffset;
            const offsetPosition = Math.max(0, elementPosition - offset);
            
            // Ensure we don't scroll past the bottom of the document
            const maxScrollTop = document.documentElement.scrollHeight - window.innerHeight;
            const finalPosition = Math.min(offsetPosition, maxScrollTop);
            
            window.scrollTo({
                top: finalPosition,
                behavior: 'smooth'
            });
            
            // Update URL hash without scrolling
            history.pushState(null, null, '#' + targetId);
        }
    }
    
    // Toggle TOC function
    function toggleTOC() {
        isExpanded = !isExpanded;
        floatingTOC.classList.toggle('expanded', isExpanded);
        
        // Update button aria-label
        toggleButton.setAttribute('aria-label', 
            isExpanded ? 'Close table of contents' : 'Open table of contents'
        );
        
        // Add focus trap if expanded
        if (isExpanded) {
            setTimeout(() => {
                closeButton.focus();
            }, 100);
        }
    }
    
    // Close TOC function
    function closeTOC() {
        isExpanded = false;
        floatingTOC.classList.remove('expanded');
        toggleButton.setAttribute('aria-label', 'Open table of contents');
        
        // Return focus to toggle button
        setTimeout(() => {
            toggleButton.focus();
        }, 100);
    }
    
    // Show/hide TOC based on scroll direction
    let lastScrollTop = 0;
    let tocVisible = true;
    
    // Check if we're on the publications page
    const isPublicationsPage = window.location.pathname.includes('publications.html');
    
    function handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Don't hide TOC if it's expanded or if we're on the publications page
        if (!isExpanded && !isPublicationsPage) {
            // Determine scroll direction
            if (scrollTop > lastScrollTop && scrollTop > 300) {
                // Scrolling down & past threshold - hide TOC
                if (tocVisible) {
                    floatingTOC.style.opacity = '0';
                    floatingTOC.style.transform = 'translateY(20px)';
                    tocVisible = false;
                }
            } else {
                // Scrolling up or near top - show TOC
                if (!tocVisible) {
                    floatingTOC.style.opacity = '1';
                    floatingTOC.style.transform = 'translateY(0)';
                    tocVisible = true;
                }
            }
        }
        
        lastScrollTop = scrollTop;
        
        // Throttle the active item updates for better performance
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(updateActiveNavItem, 100);
    }
    
    // Event listeners
    if (toggleButton) {
        toggleButton.addEventListener('click', toggleTOC);
    }
    
    if (closeButton) {
        closeButton.addEventListener('click', closeTOC);
    }
    
    // Add scroll event listener with throttling for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Add resize event listener to ensure TOC stays closed
    window.addEventListener('resize', function() {
        if (!isExpanded) {
            ensureTOCClosed();
        }
    });
    
    // Initialize active state and ensure TOC is closed
    updateActiveNavItem();
    ensureTOCClosed();
    
    // Add click and hover event listeners for all TOC links
    tocLinks.forEach(link => {
        // Click event
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            smoothScrollTo(targetId);
            
            // Close TOC after navigation on mobile
            if (window.innerWidth <= 768) {
                setTimeout(closeTOC, 300);
            }
        });
        
    });
    
    // Handle escape key to close TOC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isExpanded) {
            closeTOC();
        }
    });
    
    // Close TOC when clicking outside
    document.addEventListener('click', function(e) {
        if (isExpanded && !floatingTOC.contains(e.target)) {
            closeTOC();
        }
    });
    
    // Check for hash in URL and scroll to section after page loads
    window.addEventListener('load', function() {
        const hash = window.location.hash;
        if (hash) {
            const targetId = hash.substring(1);
            setTimeout(() => {
                smoothScrollTo(targetId);
            }, 500);
        }
    });
}); 