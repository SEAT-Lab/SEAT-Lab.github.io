// Floating TOC functionality
document.addEventListener('DOMContentLoaded', function() {
    const floatingTOC = document.querySelector('.floating-toc');
    const toggleButton = document.querySelector('.toc-toggle');
    const tocPanel = document.querySelector('.toc-panel');
    const tocLinks = document.querySelectorAll('.toc-link');
    const sections = document.querySelectorAll('section[id], .timeline-item[id]');
    const progressBar = document.querySelector('.toc-progress-bar');
    
    let isExpanded = false;
    
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
            const threshold = headerHeight + 50; // Slightly larger threshold for better detection
            
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
    
    // Smooth scroll function
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
    }
    
    // Close TOC function
    function closeTOC() {
        isExpanded = false;
        floatingTOC.classList.remove('expanded');
        toggleButton.setAttribute('aria-label', 'Open table of contents');
    }
    
    // Event listeners
    if (toggleButton) {
        toggleButton.addEventListener('click', toggleTOC);
    }
    
    // Add scroll event listener
    window.addEventListener('scroll', updateActiveNavItem);
    
    // Add resize event listener to ensure TOC stays closed
    window.addEventListener('resize', function() {
        if (!isExpanded) {
            ensureTOCClosed();
        }
    });
    
    // Initialize active state and ensure TOC is closed
    updateActiveNavItem();
    ensureTOCClosed();
    
    // Add click event listeners for all TOC links
    tocLinks.forEach(link => {
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
}); 