// Enhanced Volcano intro sequence with performance optimizations and additional features
class VolcanoIntroManager {
    constructor() {
        this.isIntroComplete = false;
        this.animationFrameId = null;
        this.particles = [];
        this.jets = [];
        this.observers = new Set();
        
        // Configuration
        this.config = {
            lavaParticles: {
                count: 75,
                baseSpeed: 80,
                speedVariation: 120,
                duration: { min: 1800, max: 3500 },
                colors: ['#ff4500', '#ff6b35', '#ff8c00', '#ffa500', '#dc143c']
            },
            groundJets: {
                positions: [8, 18, 32, 45, 58, 72, 85, 92],
                delayMultiplier: 0.15,
                burstCount: 3
            },
            timing: {
                introDuration: 12000,
                fadeTransition: 1500
            }
        };
        
        this.bindEvents();
    }

    // Initialize volcano intro sequence
    async initVolcanoIntro() {
        if (this.isIntroComplete) return;
        
        const elements = this.getElements();
        if (!elements.volcanoIntro) {
            console.warn('Volcano intro element not found');
            return this.skipToMainSite();
        }

        try {
            // Preload and setup
            await this.preloadAssets();
            this.setupIntersectionObserver();
            
            // Create animated elements
            await Promise.all([
                this.createEnhancedLavaParticles(elements.lavaExplosion),
                this.createDynamicGroundJets(elements.groundJets),
                this.createBackgroundEffects(elements.volcanoIntro)
            ]);

            // Start main sequence
            this.startIntroSequence(elements);
            
        } catch (error) {
            console.error('Volcano intro failed:', error);
            this.skipToMainSite();
        }
    }

    // Get DOM elements with error handling
    getElements() {
        return {
            volcanoIntro: document.getElementById('volcanoIntro'),
            mainSite: document.getElementById('mainSite'),
            lavaExplosion: document.getElementById('lavaExplosion'),
            groundJets: document.getElementById('groundJets')
        };
    }

    // Preload any assets if needed
    async preloadAssets() {
        return new Promise(resolve => {
            // Simulate asset loading - replace with actual asset loading if needed
            setTimeout(resolve, 100);
        });
    }

    // Enhanced lava particle system with physics
    async createEnhancedLavaParticles(container) {
        if (!container) return;
        
        const fragment = document.createDocumentFragment();
        const { count, baseSpeed, speedVariation, duration, colors } = this.config.lavaParticles;
        
        for (let i = 0; i < count; i++) {
            const particle = this.createLavaParticle(i, colors);
            const physics = this.calculateParticlePhysics(i, count, baseSpeed, speedVariation);
            
            this.animateParticleWithPhysics(particle, physics, duration);
            this.particles.push({ element: particle, physics });
            fragment.appendChild(particle);
        }
        
        container.appendChild(fragment);
    }

    // Create individual lava particle with enhanced properties
    createLavaParticle(index, colors) {
        const particle = document.createElement('div');
        particle.className = 'lava-particle';
        
        // Random color and size
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = Math.random() * 8 + 4;
        const glow = Math.random() * 10 + 5;
        
        Object.assign(particle.style, {
            left: '50%',
            top: '50%',
            backgroundColor: color,
            width: `${size}px`,
            height: `${size}px`,
            boxShadow: `0 0 ${glow}px ${color}`,
            animationDelay: `${Math.random() * 0.8}s`,
            zIndex: Math.floor(Math.random() * 10) + 1
        });
        
        return particle;
    }

    // Calculate realistic particle physics
    calculateParticlePhysics(index, total, baseSpeed, speedVariation) {
        const angle = (Math.PI * 2 * index) / total + (Math.random() - 0.5) * 0.5;
        const speed = baseSpeed + Math.random() * speedVariation;
        const gravity = Math.random() * 50 + 30;
        const wind = (Math.random() - 0.5) * 40;
        
        return {
            angle,
            speed,
            gravity,
            wind,
            initialVelocity: {
                x: Math.cos(angle) * speed,
                y: Math.sin(angle) * speed
            }
        };
    }

    // Animate particle with realistic physics
    animateParticleWithPhysics(particle, physics, durationConfig) {
        const duration = durationConfig.min + Math.random() * (durationConfig.max - durationConfig.min);
        const { initialVelocity, gravity, wind } = physics;
        
        // Calculate trajectory with gravity and wind
        const finalX = initialVelocity.x + wind;
        const finalY = initialVelocity.y + gravity;
        
        const animation = particle.animate([
            { 
                transform: 'translate(-50%, -50%) translate(0px, 0px) rotate(0deg)', 
                opacity: 1,
                filter: 'brightness(1.5) saturate(1.2)'
            },
            { 
                transform: `translate(-50%, -50%) translate(${finalX * 0.3}px, ${finalY * 0.3}px) rotate(180deg)`, 
                opacity: 0.8,
                filter: 'brightness(1.2) saturate(1)',
                offset: 0.3
            },
            { 
                transform: `translate(-50%, -50%) translate(${finalX}px, ${finalY}px) rotate(360deg)`, 
                opacity: 0,
                filter: 'brightness(0.8) saturate(0.8)'
            }
        ], {
            duration,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            fill: 'forwards'
        });
        
        // Cleanup after animation
        animation.addEventListener('finish', () => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        });
        
        return animation;
    }

    // Dynamic ground jets with burst effects
    async createDynamicGroundJets(container) {
        if (!container) return;
        
        const { positions, delayMultiplier, burstCount } = this.config.groundJets;
        const fragment = document.createDocumentFragment();
        
        positions.forEach((pos, index) => {
            for (let burst = 0; burst < burstCount; burst++) {
                const jet = document.createElement('div');
                jet.className = `jet jet-${index}`;
                
                const offset = (Math.random() - 0.5) * 8;
                const height = 60 + Math.random() * 40;
                const delay = (index * delayMultiplier) + (burst * 0.1);
                
                Object.assign(jet.style, {
                    left: `${pos + offset}%`,
                    height: `${height}px`,
                    animationDelay: `${delay}s`,
                    animationDuration: `${1.5 + Math.random() * 0.8}s`
                });
                
                this.jets.push(jet);
                fragment.appendChild(jet);
            }
        });
        
        container.appendChild(fragment);
    }

    // Create additional background effects
    async createBackgroundEffects(container) {
        if (!container) return;
        
        // Create heat shimmer effect
        const shimmer = document.createElement('div');
        shimmer.className = 'heat-shimmer';
        container.appendChild(shimmer);
        
        // Create smoke particles
        this.createSmokeParticles(container);
    }

    // Create smoke particle effects
    createSmokeParticles(container) {
        const smokeCount = 20;
        const fragment = document.createDocumentFragment();
        
        for (let i = 0; i < smokeCount; i++) {
            const smoke = document.createElement('div');
            smoke.className = 'smoke-particle';
            
            Object.assign(smoke.style, {
                left: `${20 + Math.random() * 60}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${8 + Math.random() * 4}s`
            });
            
            fragment.appendChild(smoke);
        }
        
        container.appendChild(fragment);
    }

    // Setup intersection observer for performance
    setupIntersectionObserver() {
        if (!('IntersectionObserver' in window)) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });
        
        this.observers.add(observer);
    }

    // Start the main intro sequence
    startIntroSequence(elements) {
        const { introDuration, fadeTransition } = this.config.timing;
        
        // Add screen shake effect
        this.addScreenShake(elements.volcanoIntro);
        
        // Progressive audio cues (if audio elements exist)
        this.triggerAudioCues();
        
        // Main transition
        setTimeout(() => {
            this.transitionToMainSite(elements, fadeTransition);
        }, introDuration);
    }

    // Add screen shake effect
    addScreenShake(element) {
        if (!element) return;
        
        const shakeKeyframes = [
            { transform: 'translate(0)' },
            { transform: 'translate(-2px, 1px)' },
            { transform: 'translate(2px, -1px)' },
            { transform: 'translate(-1px, 2px)' },
            { transform: 'translate(1px, -2px)' },
            { transform: 'translate(0)' }
        ];
        
        // Trigger shake at key moments
        setTimeout(() => {
            element.animate(shakeKeyframes, {
                duration: 500,
                iterations: 3
            });
        }, 2000);
        
        setTimeout(() => {
            element.animate(shakeKeyframes, {
                duration: 300,
                iterations: 2
            });
        }, 5000);
    }

    // Trigger audio cues if audio elements exist
    triggerAudioCues() {
        const audioElements = {
            rumble: document.getElementById('rumbleSound'),
            explosion: document.getElementById('explosionSound'),
            jets: document.getElementById('jetSound')
        };
        
        // Play rumble
        if (audioElements.rumble) {
            setTimeout(() => this.playAudio(audioElements.rumble), 500);
        }
        
        // Play explosion
        if (audioElements.explosion) {
            setTimeout(() => this.playAudio(audioElements.explosion), 2000);
        }
        
        // Play jets
        if (audioElements.jets) {
            setTimeout(() => this.playAudio(audioElements.jets), 3000);
        }
    }

    // Safely play audio
    playAudio(audioElement) {
        try {
            audioElement.currentTime = 0;
            audioElement.play().catch(e => console.log('Audio play prevented:', e));
        } catch (error) {
            console.log('Audio error:', error);
        }
    }

    // Enhanced transition to main site
    transitionToMainSite(elements, fadeTransition) {
        const { volcanoIntro, mainSite } = elements;
        
        if (volcanoIntro) {
            volcanoIntro.style.transition = `opacity ${fadeTransition}ms ease-out`;
            volcanoIntro.classList.add('hidden');
        }
        
        if (mainSite) {
            setTimeout(() => {
                mainSite.classList.add('visible');
                this.initMainSiteAnimations();
            }, fadeTransition / 2);
        }
        
        this.isIntroComplete = true;
        this.cleanup();
    }

    // Skip intro functionality
    skipToMainSite() {
        const elements = this.getElements();
        elements.volcanoIntro?.classList.add('hidden');
        elements.mainSite?.classList.add('visible');
        
        setTimeout(() => {
            this.initMainSiteAnimations();
        }, 500);
        
        this.isIntroComplete = true;
        this.cleanup();
    }

    // Enhanced main site animations
    initMainSiteAnimations() {
        try {
            this.createAdvancedFlameParticles();
            this.initSmoothScrolling();
            this.initResponsiveHeaderScroll();
            this.initEnhancedCardEffects();
            this.initAdvancedTypingEffect();
            this.initScrollAnimations();
            this.initParallaxEffects();
        } catch (error) {
            console.error('Main site animation error:', error);
        }
    }

    // Advanced flame particles with better performance
    createAdvancedFlameParticles() {
        const bgAnimation = document.getElementById('bgAnimation');
        if (!bgAnimation) return;
        
        const particleCount = Math.min(30, Math.floor(window.innerWidth / 40));
        const fragment = document.createDocumentFragment();
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'flame-particle';
            
            const size = Math.random() * 6 + 2;
            const hue = Math.random() * 60 + 10; // Orange to red range
            
            Object.assign(particle.style, {
                left: Math.random() * 100 + '%',
                width: `${size}px`,
                height: `${size}px`,
                background: `hsl(${hue}, 100%, 60%)`,
                animationDelay: Math.random() * 8 + 's',
                animationDuration: (Math.random() * 6 + 6) + 's'
            });
            
            fragment.appendChild(particle);
        }
        
        bgAnimation.appendChild(fragment);
    }

    // Enhanced smooth scrolling with easing
    initSmoothScrolling() {
        const navLinks = document.querySelectorAll('a[href^="#"]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', this.handleSmoothScroll.bind(this));
        });
    }

    // Smooth scroll handler with custom easing
    handleSmoothScroll(e) {
        e.preventDefault();
        const targetId = e.currentTarget.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            const headerHeight = document.querySelector('header')?.offsetHeight || 0;
            const targetPosition = targetElement.offsetTop - headerHeight - 20;
            
            this.smoothScrollTo(targetPosition, 800);
        }
    }

    // Custom smooth scroll implementation
    smoothScrollTo(targetPosition, duration) {
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;
        
        const animation = (currentTime) => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            
            // Easing function (ease-in-out-cubic)
            const ease = progress < 0.5 
                ? 4 * progress * progress * progress 
                : (progress - 1) * (2 * progress - 2) * (2 * progress - 2) + 1;
            
            window.scrollTo(0, startPosition + distance * ease);
            
            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        };
        
        requestAnimationFrame(animation);
    }

    // Responsive header scroll with throttling
    initResponsiveHeaderScroll() {
        const header = document.querySelector('header');
        if (!header) return;
        
        let ticking = false;
        
        const updateHeader = () => {
            const scrolled = window.scrollY > 100;
            const opacity = scrolled ? 0.98 : 0.9;
            const blur = scrolled ? 10 : 0;
            
            header.style.background = `rgba(0, 0, 0, ${opacity})`;
            header.style.backdropFilter = `blur(${blur}px)`;
            header.style.transform = scrolled ? 'translateY(-2px)' : 'translateY(0)';
            
            ticking = false;
        };
        
        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(updateHeader);
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', handleScroll, { passive: true });
    }

    // Enhanced card effects with 3D transforms
    initEnhancedCardEffects() {
        const cards = document.querySelectorAll('.feature-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', this.handleCardHover.bind(this));
            card.addEventListener('mouseleave', this.handleCardLeave.bind(this));
            card.addEventListener('mousemove', this.handleCardMouseMove.bind(this));
        });
    }

    // Card hover effect
    handleCardHover(e) {
        e.currentTarget.style.transform = 'translateY(-15px) scale(1.03) rotateX(5deg)';
        e.currentTarget.style.boxShadow = '0 25px 50px rgba(255, 69, 0, 0.3)';
        e.currentTarget.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    }

    // Card leave effect
    handleCardLeave(e) {
        e.currentTarget.style.transform = 'translateY(0) scale(1) rotateX(0deg)';
        e.currentTarget.style.boxShadow = '';
    }

    // Card mouse move for tilt effect
    handleCardMouseMove(e) {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `translateY(-15px) scale(1.03) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }

    // Advanced typing effect with cursor
    initAdvancedTypingEffect() {
        const heroTitle = document.querySelector('.hero-content h1');
        if (!heroTitle) return;
        
        const originalText = heroTitle.textContent;
        const cursor = '<span class="typing-cursor">|</span>';
        
        this.advancedTypeWriter(heroTitle, originalText, 100, cursor);
    }

    // Advanced typewriter with more realistic typing
    advancedTypeWriter(element, text, baseSpeed, cursor) {
        let i = 0;
        element.innerHTML = cursor;
        
        const type = () => {
            if (i < text.length) {
                // Variable typing speed for more natural feel
                const char = text.charAt(i);
                const speed = baseSpeed + (Math.random() * 50);
                const pauseChars = ['.', '!', '?', ','];
                const extraPause = pauseChars.includes(char) ? 200 : 0;
                
                element.innerHTML = text.substring(0, i + 1) + cursor;
                i++;
                
                setTimeout(type, speed + extraPause);
            } else {
                // Remove cursor after typing is complete
                setTimeout(() => {
                    element.innerHTML = text;
                }, 1000);
            }
        };
        
        // Start typing after a brief delay
        setTimeout(type, 500);
    }

    // Initialize scroll-triggered animations
    initScrollAnimations() {
        const animatedElements = document.querySelectorAll('[data-animate]');
        
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1, rootMargin: '50px' });
            
            animatedElements.forEach(el => observer.observe(el));
            this.observers.add(observer);
        }
    }

    // Initialize parallax effects
    initParallaxEffects() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        if (parallaxElements.length === 0) return;
        
        let ticking = false;
        
        const updateParallax = () => {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const speed = element.dataset.parallax || 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
            
            ticking = false;
        };
        
        const handleParallaxScroll = () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', handleParallaxScroll, { passive: true });
    }

    // Bind events for intro control
    bindEvents() {
        document.addEventListener('DOMContentLoaded', () => {
            this.initVolcanoIntro();
        });
        
        // Skip intro on click/touch with debouncing
        let skipTimeout;
        const handleSkip = () => {
            if (this.isIntroComplete) return;
            
            clearTimeout(skipTimeout);
            skipTimeout = setTimeout(() => {
                this.skipToMainSite();
            }, 100);
        };
        
        // Bind skip events when intro element exists
        setTimeout(() => {
            const volcanoIntro = document.getElementById('volcanoIntro');
            if (volcanoIntro) {
                volcanoIntro.addEventListener('click', handleSkip);
                volcanoIntro.addEventListener('touchstart', handleSkip, { passive: true });
                
                // Keyboard skip (Space or Enter)
                document.addEventListener('keydown', (e) => {
                    if ((e.code === 'Space' || e.code === 'Enter') && !this.isIntroComplete) {
                        e.preventDefault();
                        handleSkip();
                    }
                });
            }
        }, 100);
        
        // Handle page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && !this.isIntroComplete) {
                this.pauseAnimations();
            } else if (!document.hidden && !this.isIntroComplete) {
                this.resumeAnimations();
            }
        });
        
        // Handle window resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 250);
        });
    }

    // Pause animations when page is hidden
    pauseAnimations() {
        this.particles.forEach(particle => {
            particle.element.style.animationPlayState = 'paused';
        });
        this.jets.forEach(jet => {
            jet.style.animationPlayState = 'paused';
        });
    }

    // Resume animations when page is visible
    resumeAnimations() {
        this.particles.forEach(particle => {
            particle.element.style.animationPlayState = 'running';
        });
        this.jets.forEach(jet => {
            jet.style.animationPlayState = 'running';
        });
    }

    // Handle window resize
    handleResize() {
        if (this.isIntroComplete) {
            // Recreate flame particles for new window size
            const bgAnimation = document.getElementById('bgAnimation');
            if (bgAnimation) {
                bgAnimation.innerHTML = '';
                this.createAdvancedFlameParticles();
            }
        }
    }

    // Cleanup resources
    cleanup() {
        // Cancel any ongoing animations
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        
        // Disconnect observers
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
        
        // Clear particle references
        this.particles = [];
        this.jets = [];
    }
}

// Initialize the volcano intro manager
const volcanoManager = new VolcanoIntroManager();