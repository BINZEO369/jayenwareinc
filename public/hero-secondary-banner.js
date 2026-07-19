// ============================================================
// hero-secondary-banner.js - JAYENWARE Secondary Banner Component
// Hero Secondary Banner with Auto-Sliding Images
// Version: 2.0.2 (Fixed Image Loading Issue + All Previous Features)
// ============================================================

(function() {
    'use strict';

    // ==================== CSS STYLES ====================
    const HERO_SECONDARY_CSS = `
        <style id="hero-secondary-banner-styles">
            /* ==================== ROLEX-STYLE HERO SECONDARY BANNER ==================== */
            .hero-secondary-container {
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
                .hero-secondary-container {
                    height: 700px;
                }
            }
            
            /* Mobile (iPhone 15/16/17 Pro scale) */
            @media (max-width: 768px) {
                .hero-secondary-container {
                    height: 850px;
                }
            }
            
            /* Small Mobile */
            @media (max-width: 480px) {
                .hero-secondary-container {
                    height: 750px;
                }
            }
            
            .hero-secondary-slide-wrapper {
                position: absolute;
                inset: 0;
                transition: opacity 1.5s cubic-bezier(0.4, 0, 0.2, 1);
                /* ✅ Ensure all slides are visible initially for loading */
                opacity: 1;
            }
            .hero-secondary-slide-wrapper.fade-out {
                opacity: 0;
                pointer-events: none;
            }
            .hero-secondary-slide-img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                animation: heroSecondaryZoom 20s ease-in-out infinite alternate;
                /* ✅ Force hardware acceleration for smoother loading */
                transform: translateZ(0);
                -webkit-transform: translateZ(0);
            }
            @keyframes heroSecondaryZoom {
                from { transform: scale(1) translateZ(0); }
                to { transform: scale(1.05) translateZ(0); }
            }
            
            .hero-secondary-overlay {
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
            
            .hero-secondary-content {
                position: absolute;
                bottom: clamp(50px, 12vh, 110px);
                left: 50%;
                transform: translateX(-50%);
                z-index: 2;
                text-align: center;
                width: 88%;
                max-width: 680px;
                padding: 0 16px;
                display: flex;
                flex-direction: column;
                align-items: center;
            }
            
            /* ---------- JABIYEN_FONTS Integration ---------- */
            
            /* ✅ SUBTITLE NOW BELOW TITLE */
            .hero-secondary-subtitle {
                display: inline-block;
                /* ✅ JABIYEN_FONTS: --font-accent (Inter) */
                font-family: var(--font-accent, 'Inter', sans-serif);
                font-size: clamp(6px, 0.85vw, 8px);
                font-weight: 400;
                letter-spacing: 0.35em;
                text-transform: uppercase;
                color: rgba(255, 255, 255, 0.55);
                margin-top: clamp(10px, 1.8vh, 18px);
                margin-bottom: 0;
                opacity: 0;
                transform: translateY(8px);
                animation: heroSecondaryFadeInUp 0.9s cubic-bezier(0.22, 0.61, 0.36, 1) 0.3s forwards;
                order: 2;
            }
            
            .hero-secondary-title {
                /* ✅ JABIYEN_FONTS: --font-heading (Manrope) */
                font-family: var(--font-heading, 'Manrope', sans-serif);
                font-size: clamp(18px, 3.5vw, 48px);
                font-weight: 700;
                line-height: 1.15;
                color: #ffffff;
                margin: 0 0 0 0;
                letter-spacing: var(--tracking-tight, -0.3px);
                opacity: 0;
                transform: translateY(12px);
                animation: heroSecondaryFadeInUp 0.9s cubic-bezier(0.22, 0.61, 0.36, 1) 0.15s forwards;
                order: 1;
            }
            
            .hero-secondary-cta-wrap {
                opacity: 0;
                transform: translateY(8px);
                animation: heroSecondaryFadeInUp 0.9s cubic-bezier(0.22, 0.61, 0.36, 1) 0.45s forwards;
                margin-top: clamp(14px, 2.2vh, 24px);
                order: 3;
            }
            .hero-secondary-cta {
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
            .hero-secondary-cta:hover {
                color: #ffffff;
                border-bottom-color: rgba(255, 255, 255, 0.8);
                padding: 0 20px 4px 0;
            }
            
            /* Underline expand effect on hover */
            .hero-secondary-cta::after {
                content: '';
                position: absolute;
                bottom: -1px;
                left: 0;
                width: 0%;
                height: 1px;
                background: #ffffff;
                transition: width 0.5s cubic-bezier(0.22, 0.61, 0.36, 1);
            }
            .hero-secondary-cta:hover::after {
                width: 100%;
            }
            
            @keyframes heroSecondaryFadeInUp {
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            /* ==================== LINE INDICATORS (বিশ্ব বিখ্যাত ওয়েবসাইট স্টাইল) ==================== */
            .hero-secondary-nav-indicators {
                position: absolute;
                bottom: clamp(30px, 5vh, 50px);
                left: 50%;
                transform: translateX(-50%);
                z-index: 3;
                display: flex;
                gap: 6px;
                align-items: center;
            }
            .hero-secondary-nav-indicator {
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
            .hero-secondary-nav-indicator:hover {
                background: rgba(255, 255, 255, 0.5);
            }
            .hero-secondary-nav-indicator.active {
                background: #ffffff;
                width: 60px;
                box-shadow: 0 1px 6px rgba(255, 255, 255, 0.3);
            }
            
            /* Progress bar inside active indicator */
            .hero-secondary-nav-indicator.active::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                height: 100%;
                background: rgba(255, 255, 255, 0.6);
                border-radius: 1px;
                animation: heroSecondaryIndicatorProgress 7s linear forwards;
            }
            
            @keyframes heroSecondaryIndicatorProgress {
                from { width: 0%; }
                to { width: 100%; }
            }

            /* Hero Secondary Navigation Arrows */
            .hero-secondary-arrow {
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
            .hero-secondary-container:hover .hero-secondary-arrow {
                opacity: 1;
            }
            .hero-secondary-arrow:hover {
                background: rgba(255, 255, 255, 0.18);
                border-color: rgba(255, 255, 255, 0.35);
                transform: translateY(-50%) scale(1.08);
            }
            .hero-secondary-arrow:active {
                transform: translateY(-50%) scale(0.95);
            }
            .hero-secondary-arrow.prev { left: 20px; }
            .hero-secondary-arrow.next { right: 20px; }

            @media (max-width: 640px) {
                .hero-secondary-arrow {
                    width: 36px;
                    height: 36px;
                    font-size: 12px;
                }
                .hero-secondary-arrow.prev { left: 10px; }
                .hero-secondary-arrow.next { right: 10px; }
                .hero-secondary-nav-indicators { bottom: 25px; gap: 4px; }
                .hero-secondary-nav-indicator {
                    width: 30px;
                    height: 2px;
                }
                .hero-secondary-nav-indicator.active {
                    width: 45px;
                }
            }
        </style>
    `;

    // ==================== HTML TEMPLATE ====================
    function getHeroSecondaryHTML() {
        return `
            <div id="hero-secondary-container" class="hero-secondary-container">
                <div id="hero-secondary-banner-slides"></div>
                <div class="hero-secondary-overlay"></div>
                <div class="hero-secondary-content">
                    <h1 id="hero-secondary-title" class="hero-secondary-title"></h1>
                    <p id="hero-secondary-subtitle" class="hero-secondary-subtitle"></p>
                    <div id="hero-secondary-cta-container" class="hero-secondary-cta-wrap"></div>
                </div>
                <button id="hero-secondary-prev-btn" class="hero-secondary-arrow prev" aria-label="Previous slide">
                    <i class="fa-solid fa-chevron-left"></i>
                </button>
                <button id="hero-secondary-next-btn" class="hero-secondary-arrow next" aria-label="Next slide">
                    <i class="fa-solid fa-chevron-right"></i>
                </button>
                <div id="hero-secondary-nav-indicators" class="hero-secondary-nav-indicators"></div>
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
            console.log('[HeroSecondaryBanner] 🔧 Injecting JABIYEN_FONTS CSS variables as fallback...');
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
            console.log('[HeroSecondaryBanner] ✅ Font variables injected');
        } else {
            console.log('[HeroSecondaryBanner] ✅ JABIYEN_FONTS variables already present');
        }
    }

    // ==================== COMPONENT LOGIC ====================
    class HeroSecondaryBannerComponent {
        constructor() {
            this.currentSlide = 0;
            this.slideInterval = null;
            this.heroSecondaryData = [];
            this.isTransitioning = false;
            this.container = null;
            this.isInitialized = false;
            this.intersectionObserver = null;
            this.loadedImages = new Set(); // ✅ Track loaded images
        }

        init(data) {
            console.log('[HeroSecondaryBanner] 🚀 Init called with', data?.length, 'slides');
            
            if (!data || data.length === 0) {
                console.warn('[HeroSecondaryBanner] ⚠️ No hero secondary data provided');
                return;
            }

            this.heroSecondaryData = data;
            
            ensureFontVariables();
            
            this.container = document.getElementById('hero-secondary-container');
            console.log('[HeroSecondaryBanner] 📦 Container found:', !!this.container);
            
            if (!this.container) {
                console.error('[HeroSecondaryBanner] ❌ #hero-secondary-container not found in DOM');
                return;
            }

            if (!document.getElementById('hero-secondary-banner-slides')) {
                console.log('[HeroSecondaryBanner] 🔧 Injecting inner HTML template...');
                this.container.outerHTML = getHeroSecondaryHTML();
                this.container = document.getElementById('hero-secondary-container');
                console.log('[HeroSecondaryBanner] ✅ HTML injected');
            }

            this.render();
            this.preloadAllImages(); // ✅ Preload all images
            this.bindEvents();
            this.setupIntersectionObserver();
            this.startAutoSlide();
            this.isInitialized = true;
            
            console.log('[HeroSecondaryBanner] ✅ Initialized with', this.heroSecondaryData.length, 'slides - Image Loading Fixed');
        }

        /**
         * ✅ PRELOAD ALL IMAGES to prevent black screens
         */
        preloadAllImages() {
            console.log('[HeroSecondaryBanner] 🖼️ Preloading all images...');
            
            this.heroSecondaryData.forEach((slide, index) => {
                const img = new Image();
                
                img.onload = () => {
                    this.loadedImages.add(index);
                    console.log(`[HeroSecondaryBanner] ✅ Image ${index + 1}/${this.heroSecondaryData.length} loaded: ${slide.img}`);
                    
                    // Update the actual slide image source if it was a placeholder
                    const slideImg = document.querySelector(`.hero-secondary-slide-wrapper[data-slide-index="${index}"] .hero-secondary-slide-img`);
                    if (slideImg && slideImg.src !== slide.img) {
                        slideImg.src = slide.img;
                    }
                };
                
                img.onerror = () => {
                    console.error(`[HeroSecondaryBanner] ❌ Failed to load image ${index + 1}: ${slide.img}`);
                    // Keep the slide visible even if image fails
                    const slideWrapper = document.querySelector(`.hero-secondary-slide-wrapper[data-slide-index="${index}"]`);
                    if (slideWrapper) {
                        slideWrapper.style.backgroundColor = '#1a1a1a';
                    }
                };
                
                // Start loading
                img.src = slide.img;
            });
        }

        /**
         * Setup Intersection Observer to handle scroll-jank
         */
        setupIntersectionObserver() {
            if (!this.container) return;
            
            if (this.intersectionObserver) {
                this.intersectionObserver.disconnect();
            }

            this.intersectionObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.container.style.willChange = 'transform';
                        this.container.style.transform = 'translateZ(0)';
                    } else {
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
            const slidesContainer = document.getElementById('hero-secondary-banner-slides');
            if (!slidesContainer || !this.heroSecondaryData.length) return;

            // ✅ Render all slides with eager loading for first 2, lazy for rest
            slidesContainer.innerHTML = this.heroSecondaryData.map((slide, index) => `
                <div class="hero-secondary-slide-wrapper ${index !== 0 ? 'fade-out' : ''}" 
                     data-slide-index="${index}"
                     style="opacity: ${index === 0 ? 1 : 0};">
                    <img src="${slide.img}" 
                         alt="${slide.title || 'JAYENWARE Secondary Hero'}" 
                         class="hero-secondary-slide-img" 
                         loading="${index < 2 ? 'eager' : 'lazy'}"
                         decoding="async"
                         onload="console.log('[HeroSecondaryBanner] 🖼️ Slide ${index + 1} image loaded successfully')"
                         onerror="this.parentElement.style.backgroundColor='#1a1a1a'; console.error('[HeroSecondaryBanner] ❌ Slide ${index + 1} image failed to load')">
                </div>
            `).join('');

            this.renderIndicators();
            this.updateContent(0);
            
            // ✅ Force visibility check after render
            setTimeout(() => this.verifySlidesVisibility(), 100);
        }

        /**
         * ✅ Verify all slides are properly visible
         */
        verifySlidesVisibility() {
            const slides = document.querySelectorAll('.hero-secondary-slide-wrapper');
            slides.forEach((slide, index) => {
                const img = slide.querySelector('.hero-secondary-slide-img');
                if (img && img.complete && img.naturalWidth > 0) {
                    console.log(`[HeroSecondaryBanner] ✅ Slide ${index + 1} verified: ${img.naturalWidth}x${img.naturalHeight}`);
                } else if (img && !img.complete) {
                    console.log(`[HeroSecondaryBanner] ⏳ Slide ${index + 1} still loading...`);
                }
            });
        }

        /**
         * Render line indicators (dots-এর পরিবর্তে লম্বা দাগ)
         */
        renderIndicators() {
            const indicatorsContainer = document.getElementById('hero-secondary-nav-indicators');
            if (!indicatorsContainer || this.heroSecondaryData.length <= 1) {
                if (indicatorsContainer) indicatorsContainer.style.display = 'none';
                return;
            }

            indicatorsContainer.style.display = 'flex';
            indicatorsContainer.innerHTML = this.heroSecondaryData.map((_, index) => `
                <button class="hero-secondary-nav-indicator ${index === 0 ? 'active' : ''}" 
                        data-indicator-index="${index}"
                        aria-label="Go to slide ${index + 1}">
                </button>
            `).join('');
        }

        updateContent(index) {
            const slide = this.heroSecondaryData[index];
            if (!slide) return;

            const titleEl = document.getElementById('hero-secondary-title');
            const subtitleEl = document.getElementById('hero-secondary-subtitle');
            const ctaContainer = document.getElementById('hero-secondary-cta-container');

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
                        <a href="${slide.cta_link}" class="hero-secondary-cta">
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
            const activeIndicator = document.querySelector('.hero-secondary-nav-indicator.active');
            if (!activeIndicator) return;

            activeIndicator.classList.remove('active');
            void activeIndicator.offsetWidth;
            activeIndicator.classList.add('active');
        }

        goToSlide(index) {
            if (this.isTransitioning) return;
            if (index < 0 || index >= this.heroSecondaryData.length) return;
            if (index === this.currentSlide) return;

            this.isTransitioning = true;

            const slides = document.querySelectorAll('.hero-secondary-slide-wrapper');
            const indicators = document.querySelectorAll('.hero-secondary-nav-indicator');

            // ✅ Fade management with proper opacity
            slides.forEach((slide, i) => {
                if (i === index) {
                    // Target slide - make visible
                    slide.style.opacity = '1';
                    slide.classList.remove('fade-out');
                } else {
                    // Other slides - hide
                    slide.style.opacity = '0';
                    slide.classList.add('fade-out');
                }
            });

            indicators.forEach((ind, i) => ind.classList.toggle('active', i === index));

            this.updateContent(index);
            this.currentSlide = index;

            this.restartProgressAnimation();

            setTimeout(() => {
                this.isTransitioning = false;
            }, 800);
        }

        nextSlide() {
            const next = (this.currentSlide + 1) % this.heroSecondaryData.length;
            this.goToSlide(next);
        }

        prevSlide() {
            const prev = (this.currentSlide - 1 + this.heroSecondaryData.length) % this.heroSecondaryData.length;
            this.goToSlide(prev);
        }

        startAutoSlide() {
            this.stopAutoSlide();
            if (this.heroSecondaryData.length > 1) {
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
            const activeIndicator = document.querySelector('.hero-secondary-nav-indicator.active');
            if (activeIndicator) {
                activeIndicator.style.animationPlayState = 'paused';
            }
        }

        resumeAutoSlide() {
            this.startAutoSlide();
            this.restartProgressAnimation();
        }

        bindEvents() {
            const prevBtn = document.getElementById('hero-secondary-prev-btn');
            const nextBtn = document.getElementById('hero-secondary-next-btn');
            
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

            const indicatorsContainer = document.getElementById('hero-secondary-nav-indicators');
            if (indicatorsContainer) {
                indicatorsContainer.addEventListener('click', (e) => {
                    const indicator = e.target.closest('.hero-secondary-nav-indicator');
                    if (!indicator) return;
                    
                    const index = parseInt(indicator.getAttribute('data-indicator-index'));
                    if (!isNaN(index)) {
                        this.goToSlide(index);
                        this.pauseAutoSlide();
                        setTimeout(() => this.resumeAutoSlide(), 5000);
                    }
                });
            }

            if (this.container) {
                this.container.addEventListener('mouseenter', () => this.pauseAutoSlide());
                this.container.addEventListener('mouseleave', () => this.resumeAutoSlide());
                
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
            this.loadedImages.clear();
            this.init(newData);
        }

        destroy() {
            this.stopAutoSlide();
            if (this.intersectionObserver) {
                this.intersectionObserver.disconnect();
                this.intersectionObserver = null;
            }
            this.loadedImages.clear();
            this.isInitialized = false;
            console.log('[HeroSecondaryBanner] 💀 Destroyed');
        }
    }

    // ==================== GLOBAL API ====================
    const heroSecondaryBanner = new HeroSecondaryBannerComponent();

    window.JAYENWARE = window.JAYENWARE || {};
    window.JAYENWARE.heroSecondaryBanner = heroSecondaryBanner;

    // ==================== AUTO-INITIALIZATION ====================
    if (!document.getElementById('hero-secondary-banner-styles')) {
        document.head.insertAdjacentHTML('beforeend', HERO_SECONDARY_CSS);
        console.log('[HeroSecondaryBanner] 🎨 Styles injected');
    }

    function injectHTML() {
        let container = document.getElementById('hero-secondary-container');
        if (container) {
            console.log('[HeroSecondaryBanner] 📦 Container already exists in DOM');
            return;
        }

        console.log('[HeroSecondaryBanner] 🔧 Creating and injecting container...');
        
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = getHeroSecondaryHTML();
        const bannerElement = tempDiv.firstElementChild;

        const hotProductsSection = document.getElementById('hot-products-section');

        if (hotProductsSection && hotProductsSection.parentNode) {
            hotProductsSection.parentNode.insertBefore(bannerElement, hotProductsSection.nextSibling);
            console.log('[HeroSecondaryBanner] ✅ Inserted AFTER hot-products-section');
        } else {
            const heroContainer = document.getElementById('hero-container');
            if (heroContainer && heroContainer.parentNode) {
                heroContainer.parentNode.insertBefore(bannerElement, heroContainer.nextSibling);
                console.log('[HeroSecondaryBanner] ⚠️ Inserted AFTER hero-container (fallback)');
            } else {
                document.body.insertBefore(bannerElement, document.body.firstChild);
                console.log('[HeroSecondaryBanner] ⚠️ Inserted at body start (ultimate fallback)');
            }
        }
    }

    function tryInit() {
        injectHTML();
        
        const data = (window.currentData && window.currentData.hero_secondary) || null;
        
        if (data && data.length > 0) {
            console.log('[HeroSecondaryBanner] 📊 Data found in window.currentData');
            heroSecondaryBanner.init(data);
        } else {
            console.log('[HeroSecondaryBanner] ⏳ No data yet, will wait for event or retry...');
        }
    }

    async function fetchHeroSecondaryData() {
        try {
            console.log('[HeroSecondaryBanner] 🌐 Fetching from /api/hero-secondary...');
            const response = await fetch('/api/hero-secondary');
            if (!response.ok) throw new Error('HTTP ' + response.status);
            const data = await response.json();
            if (data && data.length > 0) {
                heroSecondaryBanner.init(data);
            } else {
                console.warn('[HeroSecondaryBanner] ⚠️ No hero secondary data from API');
            }
        } catch (error) {
            console.error('[HeroSecondaryBanner] ❌ Fetch error:', error.message);
        }
    }

    window.addEventListener('jayenware:dataLoaded', (e) => {
        console.log('[HeroSecondaryBanner] 📡 Received jayenware:dataLoaded event');
        if (e.detail && e.detail.hero_secondary && e.detail.hero_secondary.length > 0) {
            heroSecondaryBanner.init(e.detail.hero_secondary);
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
        if (!heroSecondaryBanner.isInitialized) {
            console.log('[HeroSecondaryBanner] 🔄 Retry - fetching directly...');
            fetchHeroSecondaryData();
        }
    }, 3000);

    console.log('[HeroSecondaryBanner] 📄 Component script loaded (v2.0.2 - Fixed Image Loading)');
})();
