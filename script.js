// Initialize GLightbox
document.addEventListener('DOMContentLoaded', function() {

    // Portfolio Toggle Functionality
    const portfolioToggle = document.getElementById('portfolioToggle');
    const heroHeader = document.querySelector('.hero-header');
    const heroSubtitle = document.getElementById('heroSubtitle');
    const portfolioImages = document.querySelectorAll('.portfolio-image');
    const toggleLabels = document.querySelectorAll('.toggle-label');
    const galleryLinks = document.querySelectorAll('.gallery-item.glightbox, .fullwidth-section .glightbox');

    // Set initial active state for toggle label
    updateToggleLabels(false);

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
        const transitionDuration = animate ? 400 : 0;

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

        // Transition images
        portfolioImages.forEach(img => {
            if (animate) {
                img.classList.add('transitioning');
            }

            setTimeout(() => {
                const newSrc = isIllustrations ? img.dataset.illusSrc : img.dataset.photoSrc;
                img.src = newSrc;

                // Update parent link href for lightbox
                const parentLink = img.closest('a.glightbox');
                if (parentLink) {
                    parentLink.href = newSrc;
                }

                if (animate) {
                    img.classList.remove('transitioning');
                }
            }, animate ? transitionDuration / 2 : 0);
        });

        // Reinitialize lightbox after image swap
        if (animate) {
            setTimeout(() => {
                lightbox.reload();
            }, transitionDuration);
        }
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

    // Initialize lightbox gallery
    const lightbox = GLightbox({
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

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
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
        const parallaxSections = document.querySelectorAll('.parallax');

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
            const firstSection = document.querySelector('.gallery-section');
            if (firstSection) {
                firstSection.scrollIntoView({ behavior: 'smooth' });
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

    // Observe gallery items for fade-in effect
    document.querySelectorAll('.gallery-item').forEach(item => {
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
    const sections = document.querySelectorAll('section[id], header[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function highlightNavigation() {
        let current = '';
        const scrollPosition = window.pageYOffset;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

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

    // Preload critical images
    const preloadImages = () => {
        const photoHeader = new Image();
        photoHeader.src = 'images/photography/header/header.jpg';
        const illusHeader = new Image();
        illusHeader.src = 'images/illustrations/header/header.jpg';
    };

    preloadImages();

    console.log('Matteo Bal Portfolio initialized');
});
