// Initialize GLightbox
document.addEventListener('DOMContentLoaded', function() {

    // Apply gallery settings from gallery-config.json (managed via beheer.html).
    // Sets crop focus (--px/--py), zoom (--zoom) and image sources per grid cell,
    // and grows/shrinks each grid to match the configured item count.
    async function applyGalleryConfig() {
        try {
            const resp = await fetch('gallery-config.json', { cache: 'no-cache' });
            if (!resp.ok) return false;
            const config = await resp.json();
            Object.entries(config.sections || {}).forEach(([sid, sec]) => {
                const section = document.getElementById(sid);
                const grid = section && section.querySelector('.grid-6');
                if (!grid || !Array.isArray(sec.items) || sec.items.length === 0) return;
                const cells = Array.from(grid.querySelectorAll('.gallery-item'));
                while (cells.length < sec.items.length) {
                    const clone = cells[0].cloneNode(true);
                    clone.style.opacity = '1';
                    clone.style.transform = '';
                    clone.style.transition = '';
                    grid.appendChild(clone);
                    cells.push(clone);
                }
                while (cells.length > sec.items.length) {
                    cells.pop().remove();
                }
                sec.items.forEach((item, i) => {
                    const a = cells[i];
                    const img = a.querySelector('img');
                    if (!img) return;
                    a.setAttribute('href', item.src);
                    const want = item.thumb || item.src;
                    if (img.getAttribute('src') !== want) img.setAttribute('src', want);
                    img.style.setProperty('--px', (item.x != null ? item.x : 50) + '%');
                    img.style.setProperty('--py', (item.y != null ? item.y : 50) + '%');
                    img.style.setProperty('--zoom', item.zoom != null ? item.zoom : 1);
                });
            });
            // Headers: hero backgrounds and fullwidth banners
            const hdr = config.headers || {};
            const hero = document.querySelector('.hero-header');
            if (hero) {
                const applyHero = (h, prefix) => {
                    if (!h) return;
                    hero.style.setProperty(`--${prefix}-src`, `url("${h.src}")`);
                    hero.style.setProperty(`--${prefix}-pos`, `${h.x ?? 50}% ${h.y ?? 0}%`);
                    const z = h.zoom ?? 1;
                    if (z !== 1 && h.ar) {
                        // zoomed: explicit cover × zoom (default stays plain 'cover')
                        hero.style.setProperty(`--${prefix}-size`,
                            `calc(max(100vw, 100vh * ${h.ar}) * ${z}) auto`);
                        if (prefix === 'hero-photo') hero.style.setProperty('--hero-photo-z', z);
                    }
                };
                applyHero(hdr['photography-hero'], 'hero-photo');
                applyHero(hdr['illustrations-hero'], 'hero-ill');
                const heroBg = document.querySelector('.hero-bg');
                if (heroBg) {
                    window.__syncHeroBg = () => {
                        const isIll = hero.classList.contains('illustrations');
                        const cfg = hdr[isIll ? 'illustrations-hero' : 'photography-hero'];
                        if (!cfg) return;
                        if (heroBg.getAttribute('src') !== cfg.src) heroBg.setAttribute('src', cfg.src);
                        heroBg.style.objectPosition = `${cfg.x ?? 50}% ${cfg.y ?? 0}%`;
                    };
                    window.__syncHeroBg();
                }
            }
            const banners = { 'zwartwit-banner': 'zwartwit', 'character-banner': 'character-design', 'animatie-banner': 'animatie' };
            Object.entries(banners).forEach(([key, sid]) => {
                const b = hdr[key];
                const section = document.getElementById(sid);
                const img = section && section.querySelector('.fullwidth-section img.fullwidth-image');
                if (!b || !img) return;
                const a = img.closest('a');
                if (a && key !== 'animatie-banner') a.setAttribute('href', b.src);
                if (key === 'character-banner' && b.ar) {
                    const overlap = window.innerWidth <= 768 ? 80 : (window.innerWidth <= 1024 ? 100 : 150);
                    section.querySelector('.fullwidth-section').style.height =
                        'calc(' + (100 / b.ar).toFixed(2) + 'vw + ' + overlap + 'px)';
                }
                if (img.getAttribute('src') !== b.src) img.setAttribute('src', b.src);
                img.style.setProperty('--px', (b.x ?? 50) + '%');
                img.style.setProperty('--py', (b.y ?? 50) + '%');
                img.style.setProperty('--zoom', b.zoom ?? 1);
            });
            return true;
        } catch (e) {
            return false;
        }
    }

    // Portfolio Mode Detection (URL parameter)
    const heroHeader = document.querySelector('.hero-header');
    const navGroups = document.querySelectorAll('.nav-group');
    const portfolioSections = document.querySelectorAll('.portfolio-section');

    // Fade-in animation observer (disabled to prevent flickering)
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

    // Initialize lightbox gallery
    let lightbox = GLightbox({
        selector: '.portfolio-section:not([hidden]) .glightbox, .about-contact-section .glightbox',
        touchNavigation: true,
        loop: true,
        autoplayVideos: true,
        zoomable: true,
        draggable: true,
        closeButton: true,
        closeOnOutsideClick: true,
        keyboardNavigation: true,
        preload: true,
        videosWidth: '90vw'
    });

    // Fade each (lazy) image in once it has loaded, so pop-in looks deliberate
    function watchImageLoads() {
        document.querySelectorAll('.gallery-item img, .fullwidth-image').forEach(img => {
            if (img.classList.contains('img-loaded')) return;
            if (img.complete && img.naturalWidth) { img.classList.add('img-loaded'); return; }
            img.addEventListener('load', () => img.classList.add('img-loaded'), { once: true });
        });
    }
    watchImageLoads();

    // Apply configured gallery crops/images, then refresh the lightbox links
    applyGalleryConfig().then(changed => {
        watchImageLoads();
        if (changed) {
            lightbox.destroy();
            lightbox = GLightbox({
                selector: '.portfolio-section:not([hidden]) .glightbox, .about-contact-section .glightbox',
                touchNavigation: true,
                loop: true,
                autoplayVideos: true,
                zoomable: true,
                draggable: true,
                closeButton: true,
                closeOnOutsideClick: true,
                keyboardNavigation: true,
                preload: true,
                videosWidth: '90vw'
            });
        }
    });

    // Check URL parameter to show correct portfolio
    const urlParams = new URLSearchParams(window.location.search);
    const urlMode = urlParams.get('mode');

    if (urlMode === 'illustrations') {
        switchPortfolio(true, false); // instant switch, no animation
    }

    // Keep URL parameter so hard refresh stays on the same portfolio
    // (Don't clear it anymore)

    function switchPortfolio(isIllustrations, animate) {
        const targetPortfolio = isIllustrations ? 'illustrations' : 'photography';
        const transitionDuration = animate ? 300 : 0;

        // Toggle header background
        if (isIllustrations) {
            heroHeader.classList.add('illustrations');
        } else {
            heroHeader.classList.remove('illustrations');
        }

        // Switch mobile hero background image with the mode
        const heroBgEl = document.querySelector('.hero-bg');
        if (heroBgEl) {
            if (window.__syncHeroBg) {
                setTimeout(() => window.__syncHeroBg(), 0);
            } else {
                heroBgEl.src = isIllustrations
                    ? 'images/illustrations/header/header.jpg'
                    : 'images/photography/header/header.jpg';
            }
        }

        // Switch logo based on portfolio mode
        const portfolioLogo = document.getElementById('portfolio-logo');
        if (portfolioLogo) {
            const newSrc = isIllustrations
                ? portfolioLogo.dataset.illustrationsSrc
                : portfolioLogo.dataset.photographySrc;
            if (newSrc) {
                portfolioLogo.src = newSrc;
            }
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
                // Re-apply fade-in animations for gallery items
                section.querySelectorAll('.gallery-item').forEach(item => {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(30px)';
                    item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
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
                selector: '.portfolio-section:not([hidden]) .glightbox, .about-contact-section .glightbox',
                touchNavigation: true,
                loop: true,
                autoplayVideos: true,
                zoomable: true,
                draggable: true,
                closeButton: true,
                closeOnOutsideClick: true,
                keyboardNavigation: true,
                preload: true,
                videosWidth: '90vw'
            });
        }, transitionDuration);
    }

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target && !target.hidden) {
                    // First sections (kleur, redactioneel) scroll to gallery section
                    if (href === '#kleur' || href === '#redactioneel') {
                        const gallerySection = target.querySelector('.gallery-section');
                        if (gallerySection) {
                            gallerySection.scrollIntoView({
                                behavior: 'smooth',
                                block: 'start'
                            });
                        }
                    }
                    // Contact section - scroll directly to the contact container
                    else if (href === '#contact') {
                        const aboutContactSection = document.querySelector('.about-contact-section');
                        if (aboutContactSection) {
                            aboutContactSection.scrollIntoView({
                                behavior: 'smooth',
                                block: 'start'
                            });
                        }
                    }
                    // Other sections: scroll to show full header image with title just visible
                    else {
                        const fullwidthSection = target.querySelector('.fullwidth-section');
                        const gallerySection = target.querySelector('.gallery-section');
                        if (fullwidthSection && gallerySection) {
                            // Scroll to show full header and just a bit of the gallery section with title
                            const targetPosition = gallerySection.getBoundingClientRect().top + window.pageYOffset;
                            const offset = window.innerHeight * 0.85; // Show about 85% down the gallery section
                            window.scrollTo({
                                top: targetPosition - offset,
                                behavior: 'smooth'
                            });
                        } else if (fullwidthSection) {
                            // Sections with only a fullwidth header (e.g. animatie)
                            fullwidthSection.scrollIntoView({
                                behavior: 'smooth',
                                block: 'center'
                            });
                        }
                    }
                }
            }
        });
    });

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

    // Initialize gallery item animations (observer is defined at the top)
    document.querySelectorAll('.portfolio-section:not([hidden]) .gallery-item').forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(item);
    });

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

    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // Resize handling
        }, 250);
    });

    // Preload header images and logos
    const preloadImages = () => {
        const photoHeader = new Image();
        photoHeader.src = 'images/photography/header/header.jpg';
        const illusHeader = new Image();
        illusHeader.src = 'images/illustrations/header/header.jpg';
        const photoLogo = new Image();
        photoLogo.src = 'images/logo-photography.png';
        const illusLogo = new Image();
        illusLogo.src = 'images/logo.png';
        const subjectOverlay = new Image();
        subjectOverlay.src = 'images/photography/header/subject.png';
    };

    preloadImages();

    // Give the footer credit a tiny hop each time the footer scrolls into view
    const footer = document.querySelector('.footer');
    if (footer && 'IntersectionObserver' in window) {
        const footerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    footer.classList.add('in-view');
                } else {
                    footer.classList.remove('in-view');
                }
            });
        }, { threshold: 0.9 });
        footerObserver.observe(footer);
    }

    console.log('Matteo Bal Portfolio initialized');
});
