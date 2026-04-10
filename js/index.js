// ============================================
// PAGE LOAD ANIMATION
// ============================================
document.body.classList.add('is-loading');
window.addEventListener('load', () => {
    document.body.classList.remove('is-loading');
    // Hide preloader
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('hidden');
            setTimeout(() => preloader.remove(), 500);
        }, 400);
    }
});

// ============================================
// NAVIGATION TOGGLE
// ============================================
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelectorAll('.nav__link');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        document.body.classList.toggle('nav-open');
    });
}

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        document.body.classList.remove('nav-open');
    });
});

// ============================================
// STICKY HEADER WITH SHRINK ON SCROLL
// ============================================
function initStickyHeader() {
    const header = document.querySelector('.header');
    if (!header) return;
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        if (scrollY > 50) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }
        // Hide on scroll down, show on scroll up
        if (scrollY > lastScroll && scrollY > 300) {
            header.classList.add('header--hidden');
        } else {
            header.classList.remove('header--hidden');
        }
        lastScroll = scrollY;
    }, { passive: true });
}
initStickyHeader();

// ============================================
// DARK/LIGHT MODE TOGGLE
// ============================================
function initThemeToggle() {
    const toggle = document.querySelector('.theme-toggle');
    if (!toggle) return;

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }

    toggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
    });
}
initThemeToggle();

// ============================================
// TYPING ANIMATION ON HERO SUBTITLE
// ============================================
function initTypingAnimation() {
    const el = document.querySelector('.hero__subtitle');
    if (!el) return;
    const text = el.textContent;
    el.textContent = '';
    el.style.borderRight = '2px solid var(--color-primary)';
    let i = 0;

    function type() {
        if (i < text.length) {
            el.textContent += text.charAt(i);
            i++;
            setTimeout(type, 60);
        } else {
            // Blink cursor then remove
            setTimeout(() => { el.style.borderRight = 'none'; }, 2000);
        }
    }

    // Start after page load animation
    setTimeout(type, 800);
}
initTypingAnimation();

// ============================================
// SCROLL-REVEAL ANIMATIONS (Enhanced)
// ============================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            const delay = index * 100;
            entry.target.style.animationDelay = `${delay}ms`;
            const revealType = entry.target.getAttribute('data-reveal');
            if (revealType) {
                entry.target.classList.add('reveal-' + revealType);
            } else {
                entry.target.classList.add('fade-in');
            }
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.skill-card').forEach(card => {
    card.style.opacity = '0';
    observer.observe(card);
});

document.querySelectorAll('.portfolio-card').forEach(card => {
    card.style.opacity = '0';
    observer.observe(card);
});

document.querySelectorAll('[data-reveal]').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
});

// ============================================
// ACTIVE NAV LINK HIGHLIGHTING
// ============================================
const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav__link');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href').slice(1) === current) {
            item.classList.add('active');
        }
    });
});

// ============================================
// PARALLAX EFFECT
// ============================================
function initParallax() {
    const shape = document.querySelector('.hero__parallax-shape');
    if (!shape) return;
    window.addEventListener('scroll', () => {
        shape.style.transform = `translateY(${window.scrollY * 0.4}px)`;
    }, { passive: true });
}
initParallax();

// ============================================
// MOUSE-FOLLOWING GRADIENT (Desktop only)
// ============================================
if (window.innerWidth > 768) {
    const hero = document.querySelector('.hero');
    if (hero) {
        document.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth) * 100;
            const y = (e.clientY / window.innerHeight) * 100;
            hero.style.backgroundPosition = `${x}% ${y}%`;
        });
    }
}

// ============================================
// CUSTOM CURSOR (Desktop only)
// ============================================
function initCustomCursor() {
    if (window.innerWidth <= 768) return;
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    // Enlarge on interactive elements
    document.querySelectorAll('a, button, .portfolio-card, .skill-card, .highlight-card, img[style*="cursor"]').forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('custom-cursor--active'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('custom-cursor--active'));
    });
}
initCustomCursor();

// ============================================
// COUNTER ANIMATION (with formatting)
// ============================================
const animateCounters = () => {
    const counters = document.querySelectorAll('[data-count]');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000;
        const increment = target / (duration / 50);
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current).toLocaleString();
                setTimeout(updateCounter, 50);
            } else {
                counter.textContent = target.toLocaleString();
            }
        };

        const counterObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                updateCounter();
                counterObserver.unobserve(counter);
            }
        });
        counterObserver.observe(counter);
    });
};
animateCounters();

// ============================================
// PORTFOLIO IMAGE STAGGER
// ============================================
document.querySelectorAll('.portfolio-images__item img').forEach((img, index) => {
    img.style.animationDelay = `${index * 150}ms`;
    img.classList.add('fade-in');
});

// ============================================
// LAZY LOADING IMAGES
// ============================================
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    if (!images.length) return;

    const imgObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                img.addEventListener('load', () => {
                    img.classList.add('img-loaded');
                });
                imgObserver.unobserve(img);
            }
        });
    }, { rootMargin: '200px' });

    images.forEach(img => imgObserver.observe(img));
}
initLazyLoading();

// ============================================
// BUTTON HOVER EFFECTS
// ============================================
document.querySelectorAll('.btn, .nav__link').forEach(button => {
    button.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
    });
    button.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// ============================================
// SCROLL PROGRESS INDICATOR
// ============================================
window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    const progressBar = document.querySelector('.scroll-progress');
    if (progressBar) {
        progressBar.style.width = scrollPercent + '%';
    }
});

// ============================================
// BACK-TO-TOP BUTTON
// ============================================
function initBackToTop() {
    const btn = document.querySelector('.back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}
initBackToTop();

// ============================================
// IMAGE LIGHTBOX
// ============================================
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    if (!lightbox || !lightboxImg) return;

    const triggers = document.querySelectorAll(
        '.portfolio-images__item img, .portfolio-header__image img, .portfolio-story__image img, .portfolio-felicitation__image img'
    );

    triggers.forEach(img => {
        img.addEventListener('click', () => {
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.classList.contains('lightbox__close')) {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}
initLightbox();

// ============================================
// PORTFOLIO PAGE SWIPE NAVIGATION (Mobile)
// ============================================
function initSwipeNavigation() {
    const prevLink = document.querySelector('.portfolio-nav__prev');
    const nextLink = document.querySelector('.portfolio-nav__next');
    if (!prevLink && !nextLink) return;

    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 80) {
            if (diff > 0 && nextLink) {
                window.location.href = nextLink.href;
            } else if (diff < 0 && prevLink) {
                window.location.href = prevLink.href;
            }
        }
    }, { passive: true });
}
initSwipeNavigation();

// ============================================
// TIMELINE / GRID VIEW TOGGLE
// ============================================
function initViewToggle() {
    const toggleBtns = document.querySelectorAll('.view-toggle-btn');
    const grid = document.querySelector('.portfolio-grid');
    const timelineContainer = document.querySelector('.portfolio-timeline');
    if (!toggleBtns.length || !grid || !timelineContainer) return;

    let timelineBuilt = false;

    function formatTimelineDate(dateStr) {
        if (!dateStr) return '';
        const [year, month] = dateStr.split('-');
        const months = ['', 'January', 'February', 'March', 'April', 'May',
            'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        return `${months[parseInt(month)]} ${year}`;
    }

    function buildTimeline() {
        if (timelineBuilt) return;
        const cards = document.querySelectorAll('.portfolio-card');
        const items = Array.from(cards).map(card => ({
            href: card.getAttribute('href'),
            title: card.getAttribute('data-title') || 'Project',
            date: card.getAttribute('data-date') || '',
            img: card.querySelector('img')?.src || ''
        }));

        items.sort((a, b) => a.date.localeCompare(b.date));

        items.forEach(item => {
            const el = document.createElement('div');
            el.className = 'timeline-item';
            el.innerHTML = `
                <div class="timeline-item__date">${formatTimelineDate(item.date)}</div>
                <a href="${item.href}" class="timeline-item__card">
                    <div class="timeline-item__image">
                        <img src="${item.img}" alt="${item.title}">
                    </div>
                    <h3 class="timeline-item__title">${item.title}</h3>
                </a>
            `;
            timelineContainer.appendChild(el);
        });
        timelineBuilt = true;
    }

    toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            toggleBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            if (btn.dataset.view === 'timeline') {
                buildTimeline();
                grid.style.display = 'none';
                timelineContainer.style.display = 'block';
            } else {
                grid.style.display = '';
                timelineContainer.style.display = 'none';
            }
        });
    });
}
initViewToggle();

// ============================================
// YOUTUBE REAL-TIME STATS
// ============================================
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(0) + 'K';
    }
    return num.toString();
}

function getCachedStats() {
    const cached = localStorage.getItem('youtube_stats');
    if (cached) {
        const data = JSON.parse(cached);
        if (Date.now() - data.timestamp < window.YOUTUBE_CONFIG.CACHE_DURATION) {
            return data.stats;
        }
    }
    return null;
}

function setCachedStats(stats) {
    localStorage.setItem('youtube_stats', JSON.stringify({
        stats: stats,
        timestamp: Date.now()
    }));
}

async function fetchYouTubeStats() {
    const config = window.YOUTUBE_CONFIG;
    if (!config) return;

    const cachedStats = getCachedStats();
    if (cachedStats) {
        updateYouTubeStats(cachedStats);
        return;
    }

    if (!config.API_KEY) {
        updateYouTubeStats({ subscriberCount: '57000', viewCount: '11000000' });
        return;
    }

    try {
        const url = `https://www.googleapis.com/youtube/v3/channels?key=${config.API_KEY}&id=${config.CHANNEL_ID}&part=statistics`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`YouTube API error: ${response.status}`);
        const data = await response.json();
        if (!data.items || data.items.length === 0) throw new Error('Channel not found');
        const stats = data.items[0].statistics;
        setCachedStats(stats);
        updateYouTubeStats(stats);
    } catch (error) {
        console.error('Failed to fetch YouTube stats:', error);
        const cachedStats = localStorage.getItem('youtube_stats');
        if (cachedStats) {
            updateYouTubeStats(JSON.parse(cachedStats).stats);
        } else {
            updateYouTubeStats({ subscriberCount: '57000', viewCount: '11000000' });
        }
    }
}

function updateYouTubeStats(stats) {
    const subscriberCount = parseInt(stats.subscriberCount) || 57000;
    const viewCount = parseInt(stats.viewCount) || 11000000;

    const subText = document.getElementById('yt-sub-text');
    if (subText) subText.textContent = formatNumber(subscriberCount) + '+';

    const subCounter = document.getElementById('yt-subscribers');
    if (subCounter) {
        subCounter.dataset.count = subscriberCount;
        subCounter.textContent = formatNumber(subscriberCount);
    }

    const viewCounter = document.getElementById('yt-views');
    if (viewCounter) {
        viewCounter.dataset.count = viewCount;
        viewCounter.textContent = formatNumber(viewCount);
    }

    [subCounter, viewCounter].filter(el => el).forEach(counter => {
        const obs = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                counter.classList.add('fade-in');
                obs.unobserve(counter);
            }
        }, { threshold: 0.1 });
        obs.observe(counter);
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fetchYouTubeStats);
} else {
    fetchYouTubeStats();
}

// ============================================
// 3D TILT EFFECT ON PORTFOLIO CARDS
// ============================================
function initTiltEffect() {
    if (window.innerWidth <= 768) return;
    const cards = document.querySelectorAll('.portfolio-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -8;
            const rotateY = ((x - centerX) / centerX) * 8;
            card.classList.add('tilt-active');
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.classList.remove('tilt-active');
            card.style.transform = '';
        });
    });
}
initTiltEffect();

// ============================================
// FLOATING DECORATIVE SHAPES
// ============================================
function initFloatingShapes() {
    const sections = document.querySelectorAll('.hero, .work, .highlights');
    sections.forEach(section => {
        if (section.querySelector('.floating-shapes')) return;
        const container = document.createElement('div');
        container.className = 'floating-shapes';
        container.setAttribute('aria-hidden', 'true');
        for (let i = 1; i <= 4; i++) {
            const shape = document.createElement('div');
            shape.className = `floating-shape floating-shape--${i}`;
            container.appendChild(shape);
        }
        section.style.position = 'relative';
        section.prepend(container);
    });
}
initFloatingShapes();

// ============================================
// STAGGERED CARD ANIMATIONS
// ============================================
function initStaggeredAnimations() {
    const groups = [
        '.portfolio-grid .portfolio-card',
        '.skills-grid .skill-card',
        '.highlights-grid .highlight-card'
    ];

    groups.forEach(selector => {
        const items = document.querySelectorAll(selector);
        if (!items.length) return;
        items.forEach(item => {
            item.classList.add('stagger-reveal');
            item.style.opacity = '0';
        });

        const staggerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const parent = entry.target.parentElement;
                    const siblings = parent.querySelectorAll('.stagger-reveal:not(.stagger-visible)');
                    siblings.forEach((el, i) => {
                        setTimeout(() => {
                            el.classList.add('stagger-visible');
                        }, i * 120);
                    });
                    staggerObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        if (items[0]) staggerObserver.observe(items[0]);
    });
}
initStaggeredAnimations();

// ============================================
// TEXT REVEAL ON SCROLL
// ============================================
function initTextReveal() {
    const elements = document.querySelectorAll('.section__title, .section__subtitle');
    elements.forEach(el => {
        el.classList.add('text-reveal');
        const text = el.textContent;
        el.innerHTML = `<span class="text-reveal__line">${text}</span>`;
    });

    const textObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                textObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('.text-reveal').forEach(el => textObserver.observe(el));
}
initTextReveal();

// ============================================
// PARTICLE NETWORK CANVAS (Hero)
// ============================================
function initParticleCanvas() {
    const canvas = document.querySelector('.hero__particles');
    if (!canvas || canvas.tagName !== 'CANVAS') return;
    const ctx = canvas.getContext('2d');
    let w, h, particles = [];
    const PARTICLE_COUNT = 50;
    const MAX_DIST = 120;

    function resize() {
        w = canvas.width = canvas.parentElement.offsetWidth;
        h = canvas.height = canvas.parentElement.offsetHeight;
    }

    function Particle() {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.r = Math.random() * 2 + 1;
    }

    function init() {
        resize();
        particles = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());
    }

    function draw() {
        ctx.clearRect(0, 0, w, h);
        const color = getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim() || '#6366f1';
        particles.forEach((p, i) => {
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0 || p.x > w) p.vx *= -1;
            if (p.y < 0 || p.y > h) p.vy *= -1;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.globalAlpha = 0.4;
            ctx.fill();
            for (let j = i + 1; j < particles.length; j++) {
                const dx = p.x - particles[j].x;
                const dy = p.y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < MAX_DIST) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = color;
                    ctx.globalAlpha = 0.1 * (1 - dist / MAX_DIST);
                    ctx.stroke();
                }
            }
        });
        ctx.globalAlpha = 1;
        requestAnimationFrame(draw);
    }

    init();
    draw();
    window.addEventListener('resize', resize);
}
initParticleCanvas();

// ============================================
// SMOOTH PAGE TRANSITIONS
// ============================================
function initPageTransitions() {
    const overlay = document.querySelector('.page-transition');
    if (!overlay) return;
    document.querySelectorAll('a[href]').forEach(link => {
        const href = link.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('http') || link.target === '_blank') return;
        link.addEventListener('click', (e) => {
            e.preventDefault();
            overlay.classList.add('page-transition--entering');
            setTimeout(() => { window.location.href = href; }, 400);
        });
    });
    // On page load, slide out
    overlay.classList.add('page-transition--leaving');
    setTimeout(() => overlay.classList.remove('page-transition--leaving'), 500);
}
initPageTransitions();

// ============================================
// ANIMATED SKILL PROGRESS RINGS
// ============================================
function initSkillRings() {
    const rings = document.querySelectorAll('.skill-ring');
    if (!rings.length) return;
    const ringObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                ringObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    rings.forEach(ring => ringObserver.observe(ring));
}
initSkillRings();

// ============================================
// MAGNETIC BUTTONS
// ============================================
function initMagneticButtons() {
    if (window.innerWidth <= 768) return;
    document.querySelectorAll('.btn').forEach(btn => {
        btn.classList.add('magnetic');
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });
}
initMagneticButtons();

// ============================================
// MOUSE SPARKLE TRAIL
// ============================================
function initSparkleTrail() {
    if (window.innerWidth <= 768) return;
    let lastSparkle = 0;
    const colors = ['#6366f1', '#10b981', '#f59e0b', '#8b5cf6'];
    document.addEventListener('mousemove', (e) => {
        const now = Date.now();
        if (now - lastSparkle < 50) return;
        lastSparkle = now;
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.left = e.clientX + 'px';
        sparkle.style.top = e.clientY + 'px';
        sparkle.style.background = colors[Math.floor(Math.random() * colors.length)];
        document.body.appendChild(sparkle);
        setTimeout(() => sparkle.remove(), 600);
    });
}
initSparkleTrail();

// ============================================
// MORPHING BLOB SVG
// ============================================
function initMorphingBlobs() {
    const blobs = document.querySelectorAll('.morphing-blob path');
    if (!blobs.length) return;
    const paths = [
        'M44.5,-76.3C57.3,-69.6,67.1,-57.2,74.6,-43.4C82.1,-29.7,87.3,-14.8,87.2,-0.1C87,14.7,81.5,29.3,73.2,42.1C64.9,54.9,53.9,65.8,40.8,73.2C27.7,80.6,12.5,84.5,-1.5,87C-15.5,89.5,-31,90.6,-44.2,84.1C-57.4,77.6,-68.3,63.5,-75.5,48.3C-82.7,33.1,-86.2,16.6,-85.8,0.2C-85.4,-16.1,-81,-32.2,-72.6,-45.6C-64.2,-59,-51.8,-69.7,-38.1,-75.8C-24.4,-81.9,-9.5,-83.4,3.6,-89.6C16.7,-95.8,31.7,-83,44.5,-76.3Z',
        'M43.3,-74.8C55.8,-67.5,65.3,-55.4,72.8,-42.1C80.3,-28.8,85.8,-14.4,86.1,0.2C86.4,14.8,81.5,29.5,73.3,42.1C65.1,54.7,53.6,65.1,40.4,72.1C27.2,79.1,12.3,82.7,-2.1,86.3C-16.5,89.9,-33,93.5,-46.1,87.1C-59.2,80.7,-68.9,64.3,-76.4,47.5C-83.9,30.7,-89.2,13.6,-88.5,0.4C-87.8,-12.8,-81.1,-25.6,-72.4,-36.8C-63.7,-48,-53,-57.6,-40.5,-64.9C-28,-72.2,-13.7,-77.2,1,-78.9C15.7,-80.6,30.8,-82.1,43.3,-74.8Z'
    ];
    let current = 0;
    setInterval(() => {
        current = (current + 1) % paths.length;
        blobs.forEach(blob => {
            blob.setAttribute('d', paths[current]);
        });
    }, 4000);
}
initMorphingBlobs();

// ============================================
// SCROLL-DRIVEN HORIZONTAL GALLERY
// ============================================
function initHorizontalGallery() {
    const gallery = document.querySelector('.horizontal-gallery');
    const track = document.querySelector('.horizontal-gallery__track');
    if (!gallery || !track) return;

    window.addEventListener('scroll', () => {
        const rect = gallery.getBoundingClientRect();
        const viewH = window.innerHeight;
        if (rect.top < viewH && rect.bottom > 0) {
            const progress = (viewH - rect.top) / (viewH + rect.height);
            const maxScroll = track.scrollWidth - gallery.offsetWidth;
            track.style.transform = `translateX(${-progress * maxScroll * 0.6}px)`;
        }
    }, { passive: true });
}
initHorizontalGallery();

// ============================================
// DYNAMIC COLOR THEME PICKER
// ============================================
function initThemePicker() {
    const toggle = document.querySelector('.theme-picker__toggle');
    const picker = document.querySelector('.theme-picker');
    if (!toggle || !picker) return;

    const themes = {
        indigo: { primary: '#6366f1', secondary: '#10b981', accent: '#f59e0b' },
        rose: { primary: '#e11d48', secondary: '#06b6d4', accent: '#eab308' },
        emerald: { primary: '#059669', secondary: '#8b5cf6', accent: '#f97316' },
        amber: { primary: '#d97706', secondary: '#6366f1', accent: '#ef4444' }
    };

    toggle.addEventListener('click', () => {
        picker.classList.toggle('visible');
    });

    picker.querySelectorAll('.theme-picker__btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const theme = themes[btn.dataset.color];
            if (!theme) return;
            document.documentElement.style.setProperty('--color-primary', theme.primary);
            document.documentElement.style.setProperty('--color-secondary', theme.secondary);
            document.documentElement.style.setProperty('--color-accent', theme.accent);
            document.documentElement.style.setProperty('--gradient-primary', `linear-gradient(135deg, ${theme.primary} 0%, ${adjustColor(theme.primary, 30)} 100%)`);
            document.documentElement.style.setProperty('--gradient-secondary', `linear-gradient(135deg, ${theme.secondary} 0%, ${adjustColor(theme.secondary, 20)} 100%)`);
            document.documentElement.style.setProperty('--gradient-accent', `linear-gradient(135deg, ${theme.accent} 0%, ${adjustColor(theme.accent, -20)} 100%)`);
            localStorage.setItem('colorTheme', btn.dataset.color);
            picker.querySelectorAll('.theme-picker__btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // Restore saved theme
    const saved = localStorage.getItem('colorTheme');
    if (saved) {
        const btn = picker.querySelector(`[data-color="${saved}"]`);
        if (btn) btn.click();
    }
}

function adjustColor(hex, amount) {
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
    r = Math.min(255, Math.max(0, r + amount));
    g = Math.min(255, Math.max(0, g + amount));
    b = Math.min(255, Math.max(0, b + amount));
    return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
}

initThemePicker();

// ============================================
// ANIMATED SVG LOGO
// ============================================
function initLogoAnimation() {
    const logo = document.querySelector('.logo');
    if (!logo || logo.querySelector('.logo__svg-anim')) return;
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'logo__svg-anim');
    svg.setAttribute('viewBox', '0 0 54 54');
    svg.setAttribute('aria-hidden', 'true');
    svg.style.cssText = 'position:absolute;inset:-4px;width:calc(100% + 8px);height:calc(100% + 8px);pointer-events:none;';
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', '27');
    circle.setAttribute('cy', '27');
    circle.setAttribute('r', '25');
    svg.appendChild(circle);
    logo.appendChild(svg);
}
initLogoAnimation();
