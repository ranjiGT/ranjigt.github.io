// Navigation Toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelectorAll('.nav__link');
const body = document.body;

navToggle.addEventListener('click', () => {
    body.classList.toggle('nav-open');
});

// Close navigation when a link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        body.classList.remove('nav-open');
    });
});

// Enhanced Scroll Animations with Stagger Effect
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            // Add staggered delay to elements
            const delay = index * 100;
            entry.target.style.animationDelay = `${delay}ms`;
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe skill cards and portfolio cards with animation
const skillCards = document.querySelectorAll('.skill-card');
const portfolioCards = document.querySelectorAll('.portfolio-card');

skillCards.forEach(card => {
    card.style.opacity = '0';
    observer.observe(card);
});

portfolioCards.forEach(card => {
    card.style.opacity = '0';
    observer.observe(card);
});

// Smooth active link highlighting
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

// Parallax effect
window.addEventListener('scroll', () => {
    const parallaxElements = document.querySelectorAll('.hero::before');
    const scrollY = window.scrollY;

    parallaxElements.forEach(el => {
        el.style.transform = `translateY(${scrollY * 0.5}px)`;
    });
});

// Mouse-following gradient effect (only on desktop)
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

// Counter animation for numbers
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

        // Only start animation when element is in view
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

// Add animation classes to portfolio item images
document.querySelectorAll('.portfolio-images__item img').forEach((img, index) => {
    img.style.animationDelay = `${index * 150}ms`;
    img.classList.add('fade-in');
});

// Enhanced button hover effects
const buttons = document.querySelectorAll('.btn, .nav__link');
buttons.forEach(button => {
    button.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
    });
    button.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Scroll progress indicator
window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;

    const progressBar = document.querySelector('.scroll-progress');
    if (progressBar) {
        progressBar.style.width = scrollPercent + '%';
    }
});

// Page load animation for header
window.addEventListener('load', () => {
    const header = document.querySelector('.header, header');
    if (header) {
        header.style.animation = 'slideInRight 0.6s ease-out';
    }
});

// Prevent animation jank with requestAnimationFrame
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            ticking = false;
        });
        ticking = true;
    }
});

/* ============================================
   YOUTUBE REAL-TIME STATS
   ============================================ */

// Format large numbers to human-readable format
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(0) + 'K';
    }
    return num.toString();
}

// Get cached stats from localStorage
function getCachedStats() {
    const cached = localStorage.getItem('youtube_stats');
    if (cached) {
        const data = JSON.parse(cached);
        // Check if cache is still valid
        if (Date.now() - data.timestamp < window.YOUTUBE_CONFIG.CACHE_DURATION) {
            return data.stats;
        }
    }
    return null;
}

// Set stats cache in localStorage
function setCachedStats(stats) {
    localStorage.setItem('youtube_stats', JSON.stringify({
        stats: stats,
        timestamp: Date.now()
    }));
}

// Fetch YouTube channel statistics
async function fetchYouTubeStats() {
    const config = window.YOUTUBE_CONFIG;

    // Check cache first
    const cachedStats = getCachedStats();
    if (cachedStats) {
        updateYouTubeStats(cachedStats);
        return;
    }

    // If no API key, use fallback
    if (!config.API_KEY) {
        console.warn('YouTube API Key not configured. Using fallback values.');
        updateYouTubeStats({
            subscriberCount: '57000',
            viewCount: '11000000'
        });
        return;
    }

    try {
        const url = `https://www.googleapis.com/youtube/v3/channels?key=${config.API_KEY}&id=${config.CHANNEL_ID}&part=statistics`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`YouTube API error: ${response.status}`);
        }

        const data = await response.json();

        if (!data.items || data.items.length === 0) {
            throw new Error('Channel not found');
        }

        const stats = data.items[0].statistics;

        // Cache the results
        setCachedStats(stats);

        // Update the display
        updateYouTubeStats(stats);

    } catch (error) {
        console.error('Failed to fetch YouTube stats:', error);

        // Try to use cached data as fallback
        const cachedStats = localStorage.getItem('youtube_stats');
        if (cachedStats) {
            updateYouTubeStats(JSON.parse(cachedStats).stats);
        } else {
            // Use hardcoded fallback if no cache
            updateYouTubeStats({
                subscriberCount: '57000',
                viewCount: '11000000'
            });
        }
    }
}

// Update the DOM with YouTube stats
function updateYouTubeStats(stats) {
    const subscriberCount = parseInt(stats.subscriberCount) || 57000;
    const viewCount = parseInt(stats.viewCount) || 11000000;

    // Update subscriber count in text
    const subText = document.getElementById('yt-sub-text');
    if (subText) {
        subText.textContent = formatNumber(subscriberCount) + '+';
    }

    // Update subscriber counter
    const subCounter = document.getElementById('yt-subscribers');
    if (subCounter) {
        subCounter.dataset.count = subscriberCount;
        subCounter.textContent = formatNumber(subscriberCount);
    }

    // Update views counter
    const viewCounter = document.getElementById('yt-views');
    if (viewCounter) {
        viewCounter.dataset.count = viewCount;
        viewCounter.textContent = formatNumber(viewCount);
    }

    // Trigger counter animation if elements exist
    const counters = [subCounter, viewCounter].filter(el => el);
    if (counters.length > 0) {
        counters.forEach(counter => {
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    counter.classList.add('fade-in');
                    observer.unobserve(counter);
                }
            }, { threshold: 0.1 });
            observer.observe(counter);
        });
    }
}

// Initialize YouTube stats when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fetchYouTubeStats);
} else {
    fetchYouTubeStats();
}

