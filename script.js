// AstralCore Hyperdrive - Advanced JavaScript Functionality

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 AstralCore Hyperdrive System Initialized');
    
    // Initialize all components
    initParticleSystem();
    initScrollEffects();
    initButtonInteractions();
    initThemeToggle();
    initAnimationObserver();
    initStatusIndicators();
    
    // Add loading complete class
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 500);
});

// Enhanced Particle System
function initParticleSystem() {
    const particleContainer = document.querySelector('.particle-container');
    const particleCount = 80;
    
    // Create particles with different types and behaviors
    for (let i = 0; i < particleCount; i++) {
        createParticle(particleContainer, i);
    }
    
    // Animate particles
    animateParticles();
}

function createParticle(container, index) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Assign particle type based on index
    const types = ['particle-blue', 'particle-purple', 'particle-cyan', 'particle-violet'];
    const typeClass = types[index % 4];
    particle.classList.add(typeClass);
    
    // Set random size
    const sizes = ['w-1 h-1', 'w-0.5 h-0.5', 'w-1.5 h-1.5'];
    const sizeIndex = index % 3;
    const sizeClass = sizes[sizeIndex];
    
    // Apply size styles directly since we don't have Tailwind classes
    switch(sizeIndex) {
        case 0:
            particle.style.width = '4px';
            particle.style.height = '4px';
            break;
        case 1:
            particle.style.width = '2px';
            particle.style.height = '2px';
            break;
        case 2:
            particle.style.width = '6px';
            particle.style.height = '6px';
            break;
    }
    
    // Set random position
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    
    // Set animation properties
    particle.style.animationDelay = Math.random() * 8 + 's';
    particle.style.animationDuration = (4 + Math.random() * 6) + 's';
    particle.style.filter = 'drop-shadow(0 0 3px rgba(59,130,246,0.8))';
    
    // Apply animation type
    if (index % 2 === 0) {
        particle.style.animation = `hyperdriveFloat ${4 + Math.random() * 6}s ease-in-out infinite`;
    } else {
        particle.style.animation = `hologramFlicker ${6}s ease-in-out infinite`;
    }
    
    container.appendChild(particle);
}

function animateParticles() {
    const particles = document.querySelectorAll('.particle');
    
    particles.forEach((particle, index) => {
        // Add random movement on mouse interaction
        particle.addEventListener('mouseenter', function() {
            this.style.transform = `scale(1.5) rotate(${Math.random() * 360}deg)`;
            this.style.transition = 'transform 0.3s ease';
        });
        
        particle.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
        });
    });
}

// Scroll Effects and Parallax
function initScrollEffects() {
    let ticking = false;
    
    function updateScrollEffects() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        // Parallax effect for background elements
        const backgroundContainer = document.querySelector('.background-container');
        if (backgroundContainer) {
            backgroundContainer.style.transform = `translate3d(0, ${rate}px, 0)`;
        }
        
        // Update neural network animation based on scroll
        const neuralPaths = document.querySelectorAll('[class*="neural-path"]');
        neuralPaths.forEach((path, index) => {
            const offset = scrolled * (0.1 + index * 0.05);
            path.style.strokeDashoffset = offset;
        });
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
}

// Enhanced Button Interactions
function initButtonInteractions() {
    const ctaButtons = document.querySelectorAll('.cta-primary, .cta-secondary');
    
    ctaButtons.forEach(button => {
        // Add ripple effect
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            // Add ripple styles
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(255, 255, 255, 0.6)';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'ripple 0.6s linear';
            ripple.style.pointerEvents = 'none';
            
            this.appendChild(ripple);
            
            // Remove ripple after animation
            setTimeout(() => {
                if (ripple.parentNode) {
                    ripple.parentNode.removeChild(ripple);
                }
            }, 600);
        });
        
        // Add hover sound effect (visual feedback)
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.02)';
            this.style.boxShadow = '0 20px 40px rgba(99, 102, 241, 0.4)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '';
        });
    });
    
    // Feature badge interactions
    const featureBadges = document.querySelectorAll('.feature-badge');
    featureBadges.forEach(badge => {
        badge.addEventListener('click', function() {
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1.05)';
            }, 100);
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);
        });
    });
}

// Theme Toggle Functionality
function initThemeToggle() {
    const themeToggle = document.querySelector('.theme-switcher');
    let isDark = true; // Default to dark theme
    
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            isDark = !isDark;
            
            if (isDark) {
                document.body.style.background = '#000000';
                this.textContent = '🌙';
                // Update other dark theme properties
                updateThemeColors('dark');
            } else {
                document.body.style.background = '#0f172a';
                this.textContent = '☀️';
                // Update other light theme properties
                updateThemeColors('light');
            }
            
            // Add transition effect
            document.body.style.transition = 'background 0.5s ease';
        });
    }
}

function updateThemeColors(theme) {
    const root = document.documentElement;
    
    if (theme === 'light') {
        // Update CSS custom properties for light theme
        root.style.setProperty('--bg-opacity', '0.1');
        root.style.setProperty('--text-opacity', '0.9');
    } else {
        // Reset to dark theme
        root.style.setProperty('--bg-opacity', '0.05');
        root.style.setProperty('--text-opacity', '1');
    }
}

// Animation Observer for Performance
function initAnimationObserver() {
    if ('IntersectionObserver' in window) {
        const animatedElements = document.querySelectorAll('.feature-card, .grid-feature, .metric-card');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });
        
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(50px)';
            observer.observe(el);
        });
    }
}

// Status Indicators
function initStatusIndicators() {
    const statusIndicators = document.querySelectorAll('.status-indicator');
    
    statusIndicators.forEach(indicator => {
        // Simulate real-time status updates
        setInterval(() => {
            const dot = indicator.querySelector('.status-dot-inner');
            if (dot) {
                dot.style.animation = 'none';
                setTimeout(() => {
                    dot.style.animation = 'statusPulse 2s ease-in-out infinite';
                }, 10);
            }
        }, 5000);
    });
    
    // Update performance metrics with real-time data simulation
    updateMetrics();
}

function updateMetrics() {
    const metrics = {
        uptime: document.querySelector('.metric-uptime .metric-value'),
        returns: document.querySelector('.metric-return .metric-value'),
        speed: document.querySelector('.metric-speed .metric-value'),
        users: document.querySelector('.metric-users .metric-value')
    };
    
    // Simulate real-time metric updates
    setInterval(() => {
        if (metrics.uptime) {
            const uptime = (99.9 + Math.random() * 0.09).toFixed(2);
            metrics.uptime.innerHTML = `<span class="metric-icon">⚡</span>${uptime}%`;
        }
        
        if (metrics.returns) {
            const returns = (8.5 + Math.random() * 0.4).toFixed(1);
            metrics.returns.innerHTML = `<span class="metric-icon">📈</span>${returns}%`;
        }
        
        if (metrics.speed) {
            const speed = (0.2 + Math.random() * 0.2).toFixed(1);
            metrics.speed.innerHTML = `<span class="metric-icon">🚀</span>${speed}ms`;
        }
    }, 3000);
}

// Add CSS animations for ripple effect
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes hologramFlicker {
        0%, 100% { opacity: 1; filter: hue-rotate(0deg); }
        25% { opacity: 0.8; filter: hue-rotate(90deg); }
        50% { opacity: 0.9; filter: hue-rotate(180deg); }
        75% { opacity: 0.85; filter: hue-rotate(270deg); }
    }
    
    .loaded {
        opacity: 1 !important;
    }
    
    .loaded .hero-section {
        animation: fadeInUp 1s ease-out;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Error Handling
window.addEventListener('error', function(e) {
    console.error('AstralCore System Error:', e.error);
});

// Performance Monitoring
if ('performance' in window) {
    window.addEventListener('load', function() {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('🎯 AstralCore Performance:', {
                loadTime: perfData.loadEventEnd - perfData.loadEventStart,
                domReady: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                totalTime: perfData.loadEventEnd - perfData.fetchStart
            });
        }, 0);
    });
}

// Accessibility Enhancements
document.addEventListener('keydown', function(e) {
    // ESC key to remove focus from elements
    if (e.key === 'Escape') {
        document.activeElement.blur();
    }
    
    // Enter key for button activation
    if (e.key === 'Enter' && e.target.classList.contains('feature-badge')) {
        e.target.click();
    }
});

// Console Easter Egg
console.log(`
    ⭐ AstralCore Hyperdrive v5.0 ⭐
    
    🚀 Advanced AI-Powered Trading Platform
    🧠 Neural Network Architecture: Online
    ⚡ Hyperdrive Engine: Active
    🛡️ Security Matrix: Operational
    ∞ Market Analysis: Infinite Dimensions
    
    Welcome to the future of trading!
    
    Status: All systems operational
    Performance: Optimized for light speed
    Ready for hyperdrive deployment! 🌟
`);
