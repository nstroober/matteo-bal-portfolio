// Initialize GLightbox
document.addEventListener('DOMContentLoaded', function() {

    // Portfolio Toggle Functionality
    const portfolioToggle = document.getElementById('portfolioToggle');
    const heroHeader = document.querySelector('.hero-header');
    const heroSubtitle = document.getElementById('heroSubtitle');
    const toggleLabels = document.querySelectorAll('.toggle-label');
    const navGroups = document.querySelectorAll('.nav-group');
    const portfolioSections = document.querySelectorAll('.portfolio-section');

    // Set initial active state for toggle label
    updateToggleLabels(false);

    // Initialize lightbox gallery
    let lightbox = GLightbox({
        selector: '.portfolio-section:not([hidden]) .glightbox, .contact-section .glightbox',
        touchNavigation: true,
        loop: true,
        autoplayVideos: true,
        zoomable: true,
        draggable: true,
        closeButton: true,
        closeOnOutsideClick: true,
        keyboardNavigation: true,
        preload: true
    });

    // Load saved preference
    const savedMode = localStorage.getItem('portfolioMode');
    if (savedMode === 'illustrations') {
        portfolioToggle.checked = true;
        switchPortfolio(true, false); // instant switch, no animation
    }

    // Toggle event listener
    portfolioToggle.addEventListener('change', function() {
        const isIllustrations = this.checked;
        switchPortfolio(isIllustrations, true);
        localStorage.setItem('portfolioMode', isIllustrations ? 'illustrations' : 'photography');
    });

    function switchPortfolio(isIllustrations, animate) {
        const targetPortfolio = isIllustrations ? 'illustrations' : 'photography';
        const transitionDuration = animate ? 300 : 0;

        // Update toggle labels
        updateToggleLabels(isIllustrations);

        // Toggle header background
        if (isIllustrations) {
            heroHeader.classList.add('illustrations');
        } else {
            heroHeader.classList.remove('illustrations');
        }

        // Transition subtitle
        if (animate) {
            heroSubtitle.classList.add('transitioning');
            setTimeout(() => {
                heroSubtitle.textContent = isIllustrations ? 'Illustrations' : 'Photography';
                heroSubtitle.classList.remove('transitioning');
            }, transitionDuration / 2);
        } else {
            heroSubtitle.textContent = isIllustrations ? 'Illustrations' : 'Photography';
        }

        // Toggle navigation groups
        navGroups.forEach(group => {
            if (group.dataset.portfolio === targetPortfolio) {
                group.hidden = false;
            } else {
                group.hidden = true;
            }
        });

        // Toggle portfolio sections
        portfolioSections.forEach(section => {
            if (section.dataset.portfolio === targetPortfolio) {
                section.hidden = false;
                // Re-observe gallery items for fade-in effect
                section.querySelectorAll('.gallery-item').forEach(item => {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(30px)';
                    observer.observe(item);
                });
            } else {
                section.hidden = true;
            }
        });

        // Scroll to top of page when switching (if animated)
        if (animate) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // Reinitialize lightbox with visible elements
        setTimeout(() => {
            lightbox.destroy();
            lightbox = GLightbox({
                selector: '.portfolio-section:not([hidden]) .glightbox',
                touchNavigation: true,
                loop: true,
                autoplayVideos: true,
                zoomable: true,
                draggable: true,
                closeButton: true,
                closeOnOutsideClick: true,
                keyboardNavigation: true,
                preload: true
            });
        }, transitionDuration);
    }

    function updateToggleLabels(isIllustrations) {
        toggleLabels.forEach(label => {
            const mode = label.dataset.mode;
            if ((mode === 'photo' && !isIllustrations) || (mode === 'illus' && isIllustrations)) {
                label.classList.add('active');
            } else {
                label.classList.remove('active');
            }
        });
    }

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target && !target.hidden) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // Parallax effect for full-width images
    let ticking = false;

    function updateParallax() {
        const parallaxSections = document.querySelectorAll('.portfolio-section:not([hidden]) .parallax');

        parallaxSections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const scrolled = window.pageYOffset;
            const imgElement = section.querySelector('img');

            if (imgElement && rect.top < window.innerHeight && rect.bottom > 0) {
                const yPos = -(scrolled - section.offsetTop) * 0.4;
                imgElement.style.transform = `translate3d(0, ${yPos}px, 0)`;
            }
        });

        ticking = false;
    }

    function requestParallaxUpdate() {
        if (!ticking) {
            window.requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }

    // Only apply parallax on devices that support it well (not mobile)
    if (window.innerWidth > 768) {
        window.addEventListener('scroll', requestParallaxUpdate);
        updateParallax(); // Initial call
    }

    // Scroll indicator click handler
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            // Find first visible portfolio section
            const firstVisibleSection = document.querySelector('.portfolio-section:not([hidden])');
            if (firstVisibleSection) {
                firstVisibleSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Fade-in animation on scroll for gallery items
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe gallery items for fade-in effect (only visible sections)
    document.querySelectorAll('.portfolio-section:not([hidden]) .gallery-item').forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(item);
    });

    // Lazy loading for images
    if ('loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    } else {
        // Fallback for browsers that don't support lazy loading
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
        document.body.appendChild(script);
    }

    // Add active state to navigation based on scroll position
    function highlightNavigation() {
        const visibleSections = document.querySelectorAll('.portfolio-section:not([hidden]), #contact');
        const activeNavGroup = document.querySelector('.nav-group:not([hidden])');
        if (!activeNavGroup) return;

        const navLinks = activeNavGroup.querySelectorAll('.nav-link');
        let current = '';
        const scrollPosition = window.pageYOffset;

        visibleSections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollPosition >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', highlightNavigation);
    highlightNavigation(); // Call once on load

    // Handle window resize for parallax
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth <= 768) {
                // Disable parallax on mobile
                window.removeEventListener('scroll', requestParallaxUpdate);
            } else {
                // Enable parallax on desktop
                window.addEventListener('scroll', requestParallaxUpdate);
                updateParallax();
            }
        }, 250);
    });

    // Preload header images
    const preloadImages = () => {
        const photoHeader = new Image();
        photoHeader.src = 'images/photography/header/header.jpg';
        const illusHeader = new Image();
        illusHeader.src = 'images/illustrations/header/header.jpg';
    };

    preloadImages();

    console.log('Matteo Bal Portfolio initialized');
});
