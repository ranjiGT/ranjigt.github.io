// ============================================
// PAGE LOAD ANIMATION
// ============================================
document.body.classList.add('is-loading');
window.addEventListener('load', () => {
    document.body.classList.remove('is-loading');
});

// ============================================
// NAVIGATION TOGGLE
// ============================================
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelectorAll('.nav__link');

navToggle.addEventListener('click', () => {
    document.body.classList.toggle('nav-open');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        document.body.classList.remove('nav-open');
    });
});

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

            // Check for data-reveal attribute for variety
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

// Observe skill cards and portfolio cards (existing)
document.querySelectorAll('.skill-card').forEach(card => {
    card.style.opacity = '0';
    observer.observe(card);
});

document.querySelectorAll('.portfolio-card').forEach(card => {
    card.style.opacity = '0';
    observer.observe(card);
});

// Observe data-reveal elements (new)
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
// PARALLAX EFFECT (Fixed)
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
// COUNTER ANIMATION
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
                counter.textContent = Math.floor(current);
                setTimeout(updateCounter, 50);
            } else {
                counter.textContent = target;
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
