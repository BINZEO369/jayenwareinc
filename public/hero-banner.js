// ============================================================
// hero-banner.js - JAYENWARE Hero Banner Component
// Rolex-Style Hero Banner with Auto-Sliding Images
// Version: 3.0.0 (Line Indicators + Smooth Scroll Fix + Typography Update)
// ============================================================

(function() {
    'use strict';

    // ==================== CSS STYLES ====================
    const HERO_CSS = `
        <style id="hero-banner-styles">
            /* ==================== ROLEX-STYLE HERO BANNER ==================== */
            .hero-container {
                position: relative;
                width: 100%;
                overflow: hidden;
                background: #000;
                display: block !important;
                visibility: visible !important;
                opacity: 1 !important;
                
                /* FIXED HEIGHTS */
                height: 900px; /* Default Desktop */
                
                /* Prevent scroll-jank / intersection observer issues */
                will-change: transform;
                transform: translateZ(0);
                -webkit-transform: translateZ(0);
                backface-visibility: hidden;
                -webkit-backface-visibility: hidden;
            }
            
            /* Tablet */
            @media (min-width: 769px) and (max-width: 1024px) {
                .hero-container {
                    height: 700px;
                }
            }
            
            /* Mobile (iPhone 15/16/17 Pro scale) */
            @media (max-width: 768px) {
                .hero-container {
                    height: 850px;
                }
            }
            
            /* Small Mobile */
            @media (max-width: 480px) {
                .hero-container {
                    height: 750px;
                }
            }
            
            .hero-slide-wrapper {
                position: absolute;
                inset: 0;
                transition: opacity 1.5s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .hero-slide-wrapper.fade-out {
                opacity: 0;
            }
            .hero-slide-img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                animation: heroZoom 20s ease-in-out infinite alternate;
            }
            @keyframes heroZoom {
                from { transform: scale(1); }
                to { transform: scale(1.05); }
            }
            
            .hero-overlay {
                position: absolute;
                inset: 0;
                background: linear-gradient(
                    to bottom,
                    rgba(0,0,0,0.0) 0%,
                    rgba(0,0,0,0.02) 40%,
                    rgba(0,0,0,0.15) 65%,
                    rgba(0,0,0,0.5) 85%,
                    rgba(0,0,0,0.7) 100%
                );
                z-index: 1;
            }
            
            .hero-content {
                position: absolute;
                bottom: clamp(50px, 12vh, 110px);
                left: 50%;
                transform: translateX(-50%);
                z-index: 2;
                text-align: center;
                width: 88%;
                max-width: 680px;
                padding: 0 16px;
            }
            
            /* ---------- JABIYEN_FONTS Integration ---------- */
            .hero-subtitle {
                display: inline-block;
                /* ✅ JABIYEN_FONTS: --font-accent (Inter) */
                font-family: var(--font-accent, 'Inter', sans-serif);
                font-size: clamp(6px, 0.85vw, 8px);
                font-weight: 400;
                letter-spacing: 0.35em;
                text-transform: uppercase;
                color: rgba(255, 255, 255, 0.55);
                margin-bottom: clamp(10px, 1.8vh, 18px);
                opacity: 0;
                transform: translateY(8px);
                animation: heroFadeInUp 0.9s cubic-bezier(0.22, 0.61, 0.36, 1) 0.15s forwards;
            }
            
            .hero-title {
                /* ✅ JABIYEN_FONTS: --font-heading (Manrope) */
                font-family: var(--font-heading, 'Manrope', sans-serif);
                font-size: clamp(18px, 3.5vw, 48px);
                font-weight: 700;
                line-height: 1.15;
                color: #ffffff;
                margin: 0 0 clamp(14px, 2vh, 22px) 0;
                letter-spacing: var(--tracking-tight, -0.3px);
                opacity: 0;
                transform: translateY(12px);
                animation: heroFadeInUp 0.9s cubic-bezier(0.22, 0.61, 0.36, 1) 0.3s forwards;
            }
            
            .hero-cta-wrap {
                opacity: 0;
                transform: translateY(8px);
                animation: heroFadeInUp 0.9s cubic-bezier(0.22, 0.61, 0.36, 1) 0.5s forwards;
            }
            .hero-cta {
                display: inline-flex;
                align-items: center;
                gap: 0;
                /* ✅ JABIYEN_FONTS: --font-body (Inter) */
                font-family: var(--font-body, 'Inter', sans-serif);
                font-size: clamp(7px, 0.85vw, 9px);
                font-weight: 500;
                letter-spacing: 0.2em;
                text-transform: uppercase;
                color: rgba(255, 255, 255, 0.8);
                text-decoration: none;
                transition: all 0.4s cubic-bezier(0.22, 0.61, 0.36, 1);
                padding: 0 0 4px 0;
                border: none;
                border-bottom: 1px solid rgba(255, 255, 255, 0.3);
                background: none;
                cursor: pointer;
                position: relative;
            }
            .hero-cta:hover {
                color: #ffffff;
                border-bottom-color: rgba(255, 255, 255, 0.8);
                padding: 0 20px 4px 0;
            }
            
            /* Underline expand effect on hover */
            .hero-cta::after {
                content: '';
                position: absolute;
                bottom: -1px;
                left: 0;
                width: 0%;
                height: 1px;
                background: #ffffff;
                transition: width 0.5s cubic-bezier(0.22, 0.61, 0.36, 1);
            }
            .hero-cta:hover::after {
                width: 100%;
            }
            
            @keyframes heroFadeInUp {
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            /* ==================== LINE INDICATORS (বিশ্ব বিখ্যাত ওয়েবসাইট স্টাইল) ==================== */
            .hero-nav-indicators {
                position: absolute;
                bottom: clamp(30px, 5vh, 50px);
                left: 50%;
                transform: translateX(-50%);
                z-index: 3;
                display: flex;
                gap: 6px;
                align-items: center;
            }
            .hero-nav-indicator {
                width: 40px;
                height: 2px;
                background: rgba(255, 255, 255, 0.25);
                cursor: pointer;
                transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                border: none;
                outline: none;
                padding: 0;
                position: relative;
                border-radius: 1px;
            }
            .hero-nav-indicator:hover {
                background: rgba(255, 255, 255, 0.5);
            }
            .hero-nav-indicator.active {
                background: #ffffff;
                width: 60px;
                box-shadow: 0 1px 6px rgba(255, 255, 255, 0.3);
            }
            
            /* Progress bar inside active indicator */
            .hero-nav-indicator.active::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                height: 100%;
                background: rgba(255, 255, 255, 0.6);
                border-radius: 1px;
                animation: heroIndicatorProgress 7s linear forwards;
            }
            
            @keyframes heroIndicatorProgress {
                from { width: 0%; }
                to { width: 100%; }
            }

            /* Hero Navigation Arrows */
            .hero-arrow {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                z-index: 3;
                width: 44px;
                height: 44px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.08);
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.15);
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                color: #ffffff;
                font-size: 14px;
                opacity: 0;
            }
            .hero-container:hover .hero-arrow {
                opacity: 1;
            }
            .hero-arrow:hover {
                background: rgba(255, 255, 255, 0.18);
                border-color: rgba(255, 255, 255, 0.35);
                transform: translateY(-50%) scale(1.08);
            }
            .hero-arrow:active {
                transform: translateY(-50%) scale(0.95);
            }
            .hero-arrow.prev { left: 20px; }
            .hero-arrow.next { right: 20px; }

            @media (max-width: 640px) {
                .hero-arrow {
                    width: 36px;
                    height: 36px;
                    font-size: 12px;
                }
                .hero-arrow.prev { left: 10px; }
                .hero-arrow.next { right: 10px; }
                .hero-nav-indicators { bottom: 25px; gap: 4px; }
                .hero-nav-indicator {
                    width: 30px;
                    height: 2px;
                }
                .hero-nav-indicator.active {
                    width: 45px;
                }
            }
        </style>
    `;

    // ==================== HTML TEMPLATE ====================
    function getHeroHTML() {
        return `
            <div id="hero-container" class="hero-container">
                <div id="hero-banner-slides"></div>
                <div class="hero-overlay"></div>
                <div class="hero-content">
                    <p id="hero-subtitle" class="hero-subtitle"></p>
                    <h1 id="hero-title" class="hero-title"></h1>
                    <div id="hero-cta-container" class="hero-cta-wrap"></div>
                </div>
                <button id="hero-prev-btn" class="hero-arrow prev" aria-label="Previous slide">
                    <i class="fa-solid fa-chevron-left"></i>
                </button>
                <button id="hero-next-btn" class="hero-arrow next" aria-label="Next slide">
                    <i class="fa-solid fa-chevron-right"></i>
                </button>
                <div id="hero-nav-indicators" class="hero-nav-indicators"></div>
            </div>
        `;
    }

    // ==================== JABIYEN_FONTS INTEGRATION ====================
    function ensureFontVariables() {
        const root = document.documentElement;
        const requiredVars = [
            '--font-heading',
            '--font-subtitle',
            '--font-body',
            '--font-accent',
            '--tracking-tight',
            '--tracking-normal',
            '--tracking-wide',
            '--tracking-wider'
        ];

        let needsInjection = false;
        requiredVars.forEach(varName => {
            if (!getComputedStyle(root).getPropertyValue(varName).trim()) {
                needsInjection = true;
            }
        });

        if (needsInjection) {
            console.log('[HeroBanner] 🔧 Injecting JABIYEN_FONTS CSS variables as fallback...');
            const fallbackVars = {
                '--font-heading': "'Manrope', sans-serif",
                '--font-subtitle': "'Sora', sans-serif",
                '--font-body': "'Inter', sans-serif",
                '--font-accent': "'Inter', sans-serif",
                '--tracking-tight': '-0.3px',
                '--tracking-normal': '0',
                '--tracking-wide': '0.5px',
                '--tracking-wider': '1px'
            };

            for (const [key, value] of Object.entries(fallbackVars)) {
                root.style.setProperty(key, value);
            }
            console.log('[HeroBanner] ✅ Font variables injected');
        } else {
            console.log('[HeroBanner] ✅ JABIYEN_FONTS variables already present');
        }
    }

    // ==================== COMPONENT LOGIC ====================
    class HeroBannerComponent {
        constructor() {
            this.currentSlide = 0;
            this.slideInterval = null;
            this.progressAnimation = null;
            this.heroData = [];
            this.isTransitioning = false;
            this.container = null;
            this.isInitialized = false;
            this.intersectionObserver = null;
        }

        init(data) {
            console.log('[HeroBanner] 🚀 Init called with', data?.length, 'slides');
            
            if (!data || data.length === 0) {
                console.warn('[HeroBanner] ⚠️ No hero data provided');
                return;
            }

            this.heroData = data;
            
            ensureFontVariables();
            
            this.container = document.getElementById('hero-container');
            console.log('[HeroBanner] 📦 Container found:', !!this.container);
            
            if (!this.container) {
                console.error('[HeroBanner] ❌ #hero-container not found in DOM');
                return;
            }

            if (!document.getElementById('hero-banner-slides')) {
                console.log('[HeroBanner] 🔧 Injecting inner HTML template...');
                this.container.outerHTML = getHeroHTML();
                this.container = document.getElementById('hero-container');
                console.log('[HeroBanner] ✅ HTML injected');
            }

            this.render();
            this.bindEvents();
            this.setupIntersectionObserver();
            this.startAutoSlide();
            this.isInitialized = true;
            
            console.log('[HeroBanner] ✅ Initialized with', this.heroData.length, 'slides - Line Indicators + Smooth Scroll');
        }

        /**
         * Setup Intersection Observer to handle scroll-jank
         * যখন ইউজার scroll করে ব্যানার সেকশনে পৌঁছায় তখন যাতে আটকে না যায়
         */
        setupIntersectionObserver() {
            if (!this.container) return;
            
            // Cleanup previous observer
            if (this.intersectionObserver) {
                this.intersectionObserver.disconnect();
            }

            this.intersectionObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Banner is in viewport - ensure smooth rendering
                        this.container.style.willChange = 'transform';
                        this.container.style.transform = 'translateZ(0)';
                    } else {
                        // Banner is out of viewport - release resources
                        this.container.style.willChange = 'auto';
                        this.container.style.transform = 'none';
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '50px 0px'
            });

            this.intersectionObserver.observe(this.container);
        }

        render() {
            const slidesContainer = document.getElementById('hero-banner-slides');
            if (!slidesContainer || !this.heroData.length) return;

            slidesContainer.innerHTML = this.heroData.map((slide, index) => `
                <div class="hero-slide-wrapper ${index !== 0 ? 'fade-out' : ''}" 
                     data-slide-index="${index}">
                    <img src="${slide.img}" 
                         alt="${slide.title || 'JAYENWARE Hero'}" 
                         class="hero-slide-img" 
                         loading="${index === 0 ? 'eager' : 'lazy'}"
                         onerror="this.style.display='none'">
                </div>
            `).join('');

            this.renderIndicators();
            this.updateContent(0);
        }

        /**
         * Render line indicators (dots-এর পরিবর্তে লম্বা দাগ)
         */
        renderIndicators() {
            const indicatorsContainer = document.getElementById('hero-nav-indicators');
            if (!indicatorsContainer || this.heroData.length <= 1) {
                if (indicatorsContainer) indicatorsContainer.style.display = 'none';
                return;
            }

            indicatorsContainer.style.display = 'flex';
            indicatorsContainer.innerHTML = this.heroData.map((_, index) => `
                <button class="hero-nav-indicator ${index === 0 ? 'active' : ''}" 
                        data-indicator-index="${index}"
                        aria-label="Go to slide ${index + 1}">
                </button>
            `).join('');
        }

        updateContent(index) {
            const slide = this.heroData[index];
            if (!slide) return;

            const titleEl = document.getElementById('hero-title');
            const subtitleEl = document.getElementById('hero-subtitle');
            const ctaContainer = document.getElementById('hero-cta-container');

            // Reset animations
            [titleEl, subtitleEl, ctaContainer].forEach(el => {
                if (el) {
                    el.style.animation = 'none';
                    el.offsetHeight;
                    el.style.animation = '';
                }
            });

            if (titleEl) {
                titleEl.textContent = slide.title || '';
                titleEl.style.display = slide.title ? 'block' : 'none';
            }

            if (subtitleEl) {
                subtitleEl.textContent = slide.subtitle || '';
                subtitleEl.style.display = slide.subtitle ? 'inline-block' : 'none';
            }

            if (ctaContainer) {
                if (slide.cta_text && slide.cta_link) {
                    ctaContainer.innerHTML = `
                        <a href="${slide.cta_link}" class="hero-cta">
                            ${slide.cta_text}
                        </a>
                    `;
                    ctaContainer.style.display = 'block';
                } else {
                    ctaContainer.innerHTML = '';
                    ctaContainer.style.display = 'none';
                }
            }
        }

        /**
         * Restart progress bar animation on active indicator
         */
        restartProgressAnimation() {
            const activeIndicator = document.querySelector('.hero-nav-indicator.active');
            if (!activeIndicator) return;

            // Remove and re-add the animation by resetting the pseudo-element
            activeIndicator.classList.remove('active');
            void activeIndicator.offsetWidth; // Force reflow
            activeIndicator.classList.add('active');
        }

        goToSlide(index) {
            if (this.isTransitioning) return;
            if (index < 0 || index >= this.heroData.length) return;
            if (index === this.currentSlide) return;

            this.isTransitioning = true;

            const slides = document.querySelectorAll('.hero-slide-wrapper');
            const indicators = document.querySelectorAll('.hero-nav-indicator');

            slides.forEach(slide => slide.classList.add('fade-out'));
            
            if (slides[index]) {
                slides[index].classList.remove('fade-out');
            }

            indicators.forEach((ind, i) => ind.classList.toggle('active', i === index));

            this.updateContent(index);
            this.currentSlide = index;

            // Restart progress bar
            this.restartProgressAnimation();

            setTimeout(() => {
                this.isTransitioning = false;
            }, 800);
        }

        nextSlide() {
            const next = (this.currentSlide + 1) % this.heroData.length;
            this.goToSlide(next);
        }

        prevSlide() {
            const prev = (this.currentSlide - 1 + this.heroData.length) % this.heroData.length;
            this.goToSlide(prev);
        }

        startAutoSlide() {
            this.stopAutoSlide();
            if (this.heroData.length > 1) {
                this.slideInterval = setInterval(() => {
                    this.nextSlide();
                }, 7000);
            }
        }

        stopAutoSlide() {
            if (this.slideInterval) {
                clearInterval(this.slideInterval);
                this.slideInterval = null;
            }
        }

        pauseAutoSlide() {
            this.stopAutoSlide();
            // Pause progress bar
            const activeIndicator = document.querySelector('.hero-nav-indicator.active');
            if (activeIndicator) {
                activeIndicator.style.animationPlayState = 'paused';
            }
        }

        resumeAutoSlide() {
            this.startAutoSlide();
            this.restartProgressAnimation();
        }

        bindEvents() {
            const prevBtn = document.getElementById('hero-prev-btn');
            const nextBtn = document.getElementById('hero-next-btn');
            
            if (prevBtn) {
                prevBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.prevSlide();
                    this.pauseAutoSlide();
                    setTimeout(() => this.resumeAutoSlide(), 5000);
                });
            }
            
            if (nextBtn) {
                nextBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.nextSlide();
                    this.pauseAutoSlide();
                    setTimeout(() => this.resumeAutoSlide(), 5000);
                });
            }

            // Line indicators - event delegation
            const indicatorsContainer = document.getElementById('hero-nav-indicators');
            if (indicatorsContainer) {
                indicatorsContainer.addEventListener('click', (e) => {
                    const indicator = e.target.closest('.hero-nav-indicator');
                    if (!indicator) return;
                    
                    const index = parseInt(indicator.getAttribute('data-indicator-index'));
                    if (!isNaN(index)) {
                        this.goToSlide(index);
                        this.pauseAutoSlide();
                        setTimeout(() => this.resumeAutoSlide(), 5000);
                    }
                });
            }

            // Pause on hover
            if (this.container) {
                this.container.addEventListener('mouseenter', () => this.pauseAutoSlide());
                this.container.addEventListener('mouseleave', () => this.resumeAutoSlide());
                
                // Touch events - pause on touch
                this.container.addEventListener('touchstart', () => this.pauseAutoSlide(), { passive: true });
                this.container.addEventListener('touchend', () => {
                    setTimeout(() => this.resumeAutoSlide(), 3000);
                }, { passive: true });
            }

            this.bindTouchEvents();
            this.bindKeyboardEvents();
        }

        bindKeyboardEvents() {
            document.addEventListener('keydown', (e) => {
                if (!this.container || !this.container.offsetParent) return;
                
                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    this.prevSlide();
                    this.pauseAutoSlide();
                    setTimeout(() => this.resumeAutoSlide(), 5000);
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    this.nextSlide();
                    this.pauseAutoSlide();
                    setTimeout(() => this.resumeAutoSlide(), 5000);
                }
            });
        }

        bindTouchEvents() {
            if (!this.container) return;

            let touchStartX = 0;
            let touchEndX = 0;
            const SWIPE_THRESHOLD = 50;

            this.container.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });

            this.container.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                const diff = touchStartX - touchEndX;

                if (Math.abs(diff) > SWIPE_THRESHOLD) {
                    if (diff > 0) {
                        this.nextSlide();
                    } else {
                        this.prevSlide();
                    }
                    this.pauseAutoSlide();
                    setTimeout(() => this.resumeAutoSlide(), 5000);
                }
            }, { passive: true });
        }

        refresh(newData) {
            this.stopAutoSlide();
            this.currentSlide = 0;
            this.isTransitioning = false;
            this.init(newData);
        }

        destroy() {
            this.stopAutoSlide();
            if (this.intersectionObserver) {
                this.intersectionObserver.disconnect();
                this.intersectionObserver = null;
            }
            this.isInitialized = false;
            console.log('[HeroBanner] 💀 Destroyed');
        }
    }

    // ==================== GLOBAL API ====================
    const heroBanner = new HeroBannerComponent();

    window.JAYENWARE = window.JAYENWARE || {};
    window.JAYENWARE.heroBanner = heroBanner;

    // ==================== AUTO-INITIALIZATION ====================
    if (!document.getElementById('hero-banner-styles')) {
        document.head.insertAdjacentHTML('beforeend', HERO_CSS);
        console.log('[HeroBanner] 🎨 Styles injected');
    }

    function injectHTML() {
        let container = document.getElementById('hero-container');
        if (container) {
            console.log('[HeroBanner] 📦 Container already exists in DOM');
            return;
        }

        console.log('[HeroBanner] 🔧 Creating and injecting container...');
        
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = getHeroHTML();
        const bannerElement = tempDiv.firstElementChild;

        const homeSection = document.getElementById('home');
        const categoryShowContainer = document.getElementById('categoryshow-container');

        if (homeSection) {
            if (categoryShowContainer && categoryShowContainer.nextSibling) {
                categoryShowContainer.parentNode.insertBefore(bannerElement, categoryShowContainer.nextSibling);
                console.log('[HeroBanner] ✅ Inserted AFTER categoryshow-container');
            } else if (categoryShowContainer) {
                homeSection.appendChild(bannerElement);
                console.log('[HeroBanner] ✅ Appended after categoryshow-container');
            } else {
                homeSection.insertBefore(bannerElement, homeSection.firstChild);
                console.log('[HeroBanner] ⚠️ Inserted at beginning of #home (categoryshow not found)');
            }
        } else {
            const firstCarousel = document.querySelector('.carousel-section');
            if (firstCarousel) {
                firstCarousel.parentNode.insertBefore(bannerElement, firstCarousel);
                console.log('[HeroBanner] ⚠️ Inserted before first carousel (fallback)');
            } else {
                document.body.insertBefore(bannerElement, document.body.firstChild);
                console.log('[HeroBanner] ⚠️ Inserted at body start (ultimate fallback)');
            }
        }
    }

    function tryInit() {
        injectHTML();
        
        const data = (window.currentData && window.currentData.hero) || null;
        
        if (data && data.length > 0) {
            console.log('[HeroBanner] 📊 Data found in window.currentData');
            heroBanner.init(data);
        } else {
            console.log('[HeroBanner] ⏳ No data yet, will wait for event or retry...');
        }
    }

    async function fetchHeroData() {
        try {
            console.log('[HeroBanner] 🌐 Fetching from /api/hero...');
            const response = await fetch('/api/hero');
            if (!response.ok) throw new Error('HTTP ' + response.status);
            const data = await response.json();
            if (data && data.length > 0) {
                heroBanner.init(data);
            } else {
                console.warn('[HeroBanner] ⚠️ No hero data from API');
            }
        } catch (error) {
            console.error('[HeroBanner] ❌ Fetch error:', error.message);
        }
    }

    window.addEventListener('jayenware:dataLoaded', (e) => {
        console.log('[HeroBanner] 📡 Received jayenware:dataLoaded event');
        if (e.detail && e.detail.hero && e.detail.hero.length > 0) {
            heroBanner.init(e.detail.hero);
        }
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(tryInit, 50);
        });
    } else {
        setTimeout(tryInit, 50);
    }

    setTimeout(() => {
        if (!heroBanner.isInitialized) {
            console.log('[HeroBanner] 🔄 Retry - fetching directly...');
            fetchHeroData();
        }
    }, 3000);

    console.log('[HeroBanner] 📄 Component script loaded (v3.0.0 - Line Indicators + Smooth Scroll + Updated Typography)');
})();
