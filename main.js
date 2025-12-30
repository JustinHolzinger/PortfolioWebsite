/**
 * Justin Holzinger Portfolio
 * Blue Theme with Text Hover Animation
 */

document.addEventListener('DOMContentLoaded', () => {
    initHoverTextEffect();
    initNavigation();
    initMobileMenu();
    initScrollEffects();
    initSmoothScroll();
    initAnimations();
    initFormValidation();
    initMarquee();
});

/**
 * Text Hover Effect - Slide Up Animation
 * Applies to all elements with .hover-text class
 */
function initHoverTextEffect() {
    document.querySelectorAll('.hover-text').forEach(link => {
        const spans = link.querySelectorAll('span');
        spans.forEach((span, index) => {
            // Set data-char attribute for the ::before pseudo-element
            span.setAttribute('data-char', span.textContent);
            // Set staggered delay for animation
            span.style.setProperty('--delay', `${index * 0.03}s`);
        });
    });
}

/**
 * Navigation - Scroll Effect & Active States
 */
function initNavigation() {
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    // Scroll effect for navigation
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const currentScroll = window.pageYOffset;

                if (currentScroll > 50) {
                    nav.classList.add('scrolled');
                } else {
                    nav.classList.remove('scrolled');
                }

                ticking = false;
            });

            ticking = true;
        }
    });

    // Active link highlighting
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -80% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
}

/**
 * Mobile Menu
 */
function initMobileMenu() {
    const toggle = document.querySelector('.nav-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (!toggle || !mobileMenu) return;

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu on link click
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            toggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

/**
 * Scroll-based Effects
 */
function initScrollEffects() {
    const heroScroll = document.querySelector('.hero-scroll-indicator');

    if (heroScroll) {
        window.addEventListener('scroll', () => {
            const opacity = Math.max(0, 1 - window.pageYOffset / 400);
            heroScroll.style.opacity = opacity;
        });
    }
}

/**
 * Smooth Scrolling
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                const headerOffset = 100;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Scroll Animations
 */
function initAnimations() {
    const animateElements = document.querySelectorAll(
        '.section-header, .project-item, .project-card, .game-card, .gallery-item, .video-featured, .video-card, .skill-block, .contact-link'
    );

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 50);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animateElements.forEach(el => {
        el.classList.add('animate-in');
        observer.observe(el);
    });

    // Hero title animation
    const heroWords = document.querySelectorAll('.hero-title-word');
    heroWords.forEach((word, index) => {
        word.style.animationDelay = `${0.3 + index * 0.15}s`;
    });
}

/**
 * Form Validation & Submission
 */
function initFormValidation() {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        // Validation
        if (!data.name || !data.email || !data.message) {
            showNotification('Bitte alle Pflichtfelder ausfuellen.', 'error');
            return;
        }

        if (!isValidEmail(data.email)) {
            showNotification('Bitte eine gultige E-Mail-Adresse eingeben.', 'error');
            return;
        }

        // Simulate submission
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalContent = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>Wird gesendet...</span>';
        submitBtn.disabled = true;

        await new Promise(resolve => setTimeout(resolve, 1500));

        showNotification('Nachricht erfolgreich gesendet!', 'success');
        form.reset();
        submitBtn.innerHTML = originalContent;
        submitBtn.disabled = false;
    });
}

/**
 * Email Validation
 */
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Notification System
 */
function showNotification(message, type = 'info') {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;

    notification.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        padding: 1.25rem 1.5rem;
        background: ${type === 'success' ? '#3b9edd' : type === 'error' ? '#e74c3c' : '#0f5484'};
        color: #ffffff;
        border-radius: 1rem;
        display: flex;
        align-items: center;
        gap: 1rem;
        font-size: 0.9375rem;
        font-weight: 600;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        z-index: 9999;
        animation: notificationIn 0.4s cubic-bezier(0.65, 0.05, 0, 1);
    `;

    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes notificationIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes notificationOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: inherit;
        font-size: 1.5rem;
        cursor: pointer;
        opacity: 0.7;
        line-height: 1;
        padding: 0;
        margin-left: 0.5rem;
    `;

    const removeNotification = () => {
        notification.style.animation = 'notificationOut 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    };

    closeBtn.addEventListener('click', removeNotification);
    document.body.appendChild(notification);
    setTimeout(removeNotification, 5000);
}

/**
 * Marquee Animation
 */
function initMarquee() {
    const marquees = document.querySelectorAll('.marquee-track');

    marquees.forEach(marquee => {
        const content = marquee.querySelector('.marquee-content');
        if (!content) return;

        // Clone content for seamless loop
        const clone = content.cloneNode(true);
        marquee.appendChild(clone);
    });
}

/**
 * Parallax effect for hero gradient
 */
document.addEventListener('mousemove', (e) => {
    const heroGradient = document.querySelector('.hero-gradient');
    if (!heroGradient) return;

    const moveX = (e.clientX - window.innerWidth / 2) * 0.02;
    const moveY = (e.clientY - window.innerHeight / 2) * 0.02;

    heroGradient.style.transform = `translate(${moveX}px, ${moveY}px)`;
});

/**
 * Gallery item click (placeholder for lightbox)
 */
document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
        const category = item.getAttribute('data-category');
        console.log(`Gallery category: ${category} - Lightbox coming soon`);
    });
});

/**
 * Video play button click (placeholder)
 */
document.querySelectorAll('.video-play-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        console.log('Video player - Coming soon');
    });
});
