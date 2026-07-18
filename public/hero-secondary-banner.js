// ============================================================
// hero-secondary-banner.js - JAYENWARE Secondary Banner Component
// Hero Secondary Banner with Auto-Sliding Images
// Version: 1.0.0 (Secondary Banner positioned AFTER Hero Banner)
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
                height: 100vh;
                min-height: 500px;
                overflow: hidden;
                background: #000;
                display: block !important;
                visibility: visible !important;
                opacity: 1 !important;
            }
            @media (max-width: 640px) {
                .hero-secondary-container { height: 80vh; min-height: 450px; }
            }
            .hero-secondary-slide-wrapper {
                position: absolute;
                inset: 0;
                transition: opacity 1.5s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .hero-secondary-slide-wrapper.fade-out {
                opacity: 0;
            }
            .hero-secondary-slide-img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                animation: heroSecondaryZoom 20s ease-in-out infinite alternate;
            }
            @keyframes heroSecondaryZoom {
                from { transform: scale(1); }
                to { transform: scale(1.05); }
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
            }
            
            .hero-secondary-subtitle {
                display: inline-block;
                font-family: 'Inter', sans-serif;
                font-size: clamp(7px, 1vw, 9px);
                font-weight: 500;
                letter-spacing: 0.45em;
                text-transform: uppercase;
                color: rgba(255, 255, 255, 0.6);
                margin-bottom: clamp(12px, 2vh, 20px);
                opacity: 0;
                transform: translateY(8px);
                animation: heroSecondaryFadeInUp 0.9s cubic-bezier(0.22, 0.61, 0.36, 1) 0.15s forwards;
            }
            
            .hero-secondary-title {
                font-family: 'Playfair Display', serif;
                font-size: clamp(22px, 4.5vw, 60px);
                font-weight: 900;
                line-height: 1.1;
                color: #ffffff;
                margin: 0 0 clamp(16px, 2.5vh, 28px) 0;
                letter-spacing: -0.01em;
                opacity: 0;
                transform: translateY(12px);
                animation: heroSecondaryFadeInUp 0.9s cubic-bezier(0.22, 0.61, 0.36, 1) 0.3s forwards;
            }
            
            .hero-secondary-cta-wrap {
                opacity: 0;
                transform: translateY(8px);
                animation: heroSecondaryFadeInUp 0.9s cubic-bezier(0.22, 0.61, 0.36, 1) 0.5s forwards;
            }
            .hero-secondary-cta {
                display: inline-flex;
                align-items: center;
                gap: 4px;
                font-family: 'Inter', sans-serif;
                font-size: clamp(8px, 1vw, 10px);
                font-weight: 500;
                letter-spacing: 0.25em;
                text-transform: uppercase;
                color: #ffffff;
                text-decoration: none;
                transition: all 0.4s cubic-bezier(0.22, 0.61, 0.36, 1);
                padding: 0;
                border: none;
                background: none;
            }
            .hero-secondary-cta:hover {
                gap: 8px;
                color: rgba(255, 255, 255, 0.85);
            }
            
            .hero-secondary-cta .cta-arrow {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 28px;
                height: 14px;
                position: relative;
                transition: all 0.4s cubic-bezier(0.22, 0.61, 0.36, 1);
            }
            
            .hero-secondary-cta .cta-arrow::after {
                content: '';
                position: absolute;
                top: 50%;
                right: 0;
                width: 6px;
                height: 6px;
                border-top: 1px solid #ffffff;
                border-right: 1px solid #ffffff;
                transform: translateY(-50%) rotate(45deg);
                transition: all 0.4s cubic-bezier(0.22, 0.61, 0.36, 1);
            }
            
            .hero-secondary-cta:hover .cta-arrow::after {
                right: -2px;
                opacity: 0.8;
            }
            
            @keyframes heroSecondaryFadeInUp {
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            /* Hero Secondary Navigation Dots */
            .hero-secondary-nav-dots {
                position: absolute;
                bottom: clamp(30px, 5vh, 50px);
                left: 50%;
                transform: translateX(-50%);
                z-index: 3;
                display: flex;
                gap: 10px;
                align-items: center;
            }
            .hero-secondary-nav-dot {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                cursor: pointer;
                transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                border: none;
                outline: none;
                padding: 0;
            }
            .hero-secondary-nav-dot:hover {
                background: rgba(255, 255, 255, 0.6);
                transform: scale(1.3);
            }
            .hero-secondary-nav-dot.active {
                background: #ffffff;
                width: 28px;
                border-radius: 5px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
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
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.2);
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                color: #ffffff;
                font-size: 14px;
                opacity: 0;
            }
            .hero-secondary-container:hover .hero-secondary-arrow {
                opacity: 1;
            }
            .hero-secondary-arrow:hover {
                background: rgba(255, 255, 255, 0.2);
                border-color: rgba(255, 255, 255, 0.4);
                transform: translateY(-50%) scale(1.1);
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
                .hero-secondary-nav-dots { bottom: 25px; }
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
                    <p id="hero-secondary-subtitle" class="hero-secondary-subtitle"></p>
                    <h1 id="hero-secondary-title" class="hero-secondary-title"></h1>
                    <div id="hero-secondary-cta-container" class="hero-secondary-cta-wrap"></div>
                </div>
                <button id="hero-secondary-prev-btn" class="hero-secondary-arrow prev" aria-label="Previous slide">
                    <i class="fa-solid fa-chevron-left"></i>
                </button>
                <button id="hero-secondary-next-btn" class="hero-secondary-arrow next" aria-label="Next slide">
                    <i class="fa-solid fa-chevron-right"></i>
                </button>
                <div id="hero-secondary-nav-dots" class="hero-secondary-nav-dots"></div>
            </div>
        `;
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
        }

        /**
         * Initialize the hero secondary banner component
         * @param {Array} data - Array of hero secondary slide objects [{img, title, subtitle, cta_text, cta_link}]
         */
        init(data) {
            console.log('[HeroSecondaryBanner] 🚀 Init called with', data?.length, 'slides');
            
            if (!data || data.length === 0) {
                console.warn('[HeroSecondaryBanner] ⚠️ No hero secondary data provided');
                return;
            }

            this.heroSecondaryData = data;
            
            // Find container
            this.container = document.getElementById('hero-secondary-container');
            console.log('[HeroSecondaryBanner] 📦 Container found:', !!this.container);
            
            if (!this.container) {
                console.error('[HeroSecondaryBanner] ❌ #hero-secondary-container not found in DOM');
                return;
            }

            // Inject inner HTML if needed
            if (!document.getElementById('hero-secondary-banner-slides')) {
                console.log('[HeroSecondaryBanner] 🔧 Injecting inner HTML template...');
                this.container.outerHTML = getHeroSecondaryHTML();
                this.container = document.getElementById('hero-secondary-container');
                console.log('[HeroSecondaryBanner] ✅ HTML injected');
            }

            this.render();
            this.bindEvents();
            this.startAutoSlide();
            this.isInitialized = true;
            
            console.log('[HeroSecondaryBanner] ✅ Initialized with', this.heroSecondaryData.length, 'slides');
        }

        /**
         * Render all slides
         */
        render() {
            const slidesContainer = document.getElementById('hero-secondary-banner-slides');
            if (!slidesContainer || !this.heroSecondaryData.length) return;

            slidesContainer.innerHTML = this.heroSecondaryData.map((slide, index) => `
                <div class="hero-secondary-slide-wrapper ${index !== 0 ? 'fade-out' : ''}" 
                     data-slide-index="${index}">
                    <img src="${slide.img}" 
                         alt="${slide.title || 'JAYENWARE Secondary Hero'}" 
                         class="hero-secondary-slide-img" 
                         loading="${index === 0 ? 'eager' : 'lazy'}"
                         onerror="this.style.display='none'">
                </div>
            `).join('');

            this.renderDots();
            this.updateContent(0);
        }

        /**
         * Render navigation dots
         */
        renderDots() {
            const dotsContainer = document.getElementById('hero-secondary-nav-dots');
            if (!dotsContainer || this.heroSecondaryData.length <= 1) {
                if (dotsContainer) dotsContainer.style.display = 'none';
                return;
            }

            dotsContainer.style.display = 'flex';
            dotsContainer.innerHTML = this.heroSecondaryData.map((_, index) => `
                <button class="hero-secondary-nav-dot ${index === 0 ? 'active' : ''}" 
                        data-dot-index="${index}"
                        aria-label="Go to slide ${index + 1}">
                </button>
            `).join('');
        }

        /**
         * Update active slide content (title, subtitle, CTA)
         */
        updateContent(index) {
            const slide = this.heroSecondaryData[index];
            if (!slide) return;

            const titleEl = document.getElementById('hero-secondary-title');
            const subtitleEl = document.getElementById('hero-secondary-subtitle');
            const ctaContainer = document.getElementById('hero-secondary-cta-container');

            // Reset animations
            [titleEl, subtitleEl, ctaContainer].forEach(el => {
                if (el) {
                    el.style.animation = 'none';
                    el.offsetHeight; // Force reflow
                    el.style.animation = '';
                }
            });

            // Update title
            if (titleEl) {
                titleEl.textContent = slide.title || '';
                titleEl.style.display = slide.title ? 'block' : 'none';
            }

            // Update subtitle
            if (subtitleEl) {
                subtitleEl.textContent = slide.subtitle || '';
                subtitleEl.style.display = slide.subtitle ? 'inline-block' : 'none';
            }

            // Update CTA
            if (ctaContainer) {
                if (slide.cta_text && slide.cta_link) {
                    ctaContainer.innerHTML = `
                        <a href="${slide.cta_link}" class="hero-secondary-cta">
                            ${slide.cta_text} <span class="cta-arrow"></span>
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
         * Switch to a specific slide
         */
        goToSlide(index) {
            if (this.isTransitioning) return;
            if (index < 0 || index >= this.heroSecondaryData.length) return;
            if (index === this.currentSlide) return;

            this.isTransitioning = true;

            const slides = document.querySelectorAll('.hero-secondary-slide-wrapper');
            const dots = document.querySelectorAll('.hero-secondary-nav-dot');

            // Fade out all slides
            slides.forEach(slide => slide.classList.add('fade-out'));
            
            // Fade in target slide
            if (slides[index]) {
                slides[index].classList.remove('fade-out');
            }

            // Update active dot
            dots.forEach((dot, i) => dot.classList.toggle('active', i === index));

            // Update content with animation
            this.updateContent(index);
            this.currentSlide = index;

            // Reset transition lock after animation completes
            setTimeout(() => {
                this.isTransitioning = false;
            }, 800);
        }

        /**
         * Go to next slide
         */
        nextSlide() {
            const next = (this.currentSlide + 1) % this.heroSecondaryData.length;
            this.goToSlide(next);
        }

        /**
         * Go to previous slide
         */
        prevSlide() {
            const prev = (this.currentSlide - 1 + this.heroSecondaryData.length) % this.heroSecondaryData.length;
            this.goToSlide(prev);
        }

        /**
         * Start auto-sliding
         */
        startAutoSlide() {
            this.stopAutoSlide();
            if (this.heroSecondaryData.length > 1) {
                this.slideInterval = setInterval(() => {
                    this.nextSlide();
                }, 7000); // 7 seconds per slide
            }
        }

        /**
         * Stop auto-sliding
         */
        stopAutoSlide() {
            if (this.slideInterval) {
                clearInterval(this.slideInterval);
                this.slideInterval = null;
            }
        }

        /**
         * Pause auto-slide temporarily (e.g., on hover)
         */
        pauseAutoSlide() {
            this.stopAutoSlide();
        }

        /**
         * Resume auto-slide after pause
         */
        resumeAutoSlide() {
            this.startAutoSlide();
        }

        /**
         * Bind all event listeners
         */
        bindEvents() {
            // Arrow buttons
            const prevBtn = document.getElementById('hero-secondary-prev-btn');
            const nextBtn = document.getElementById('hero-secondary-next-btn');
            
            if (prevBtn) {
                prevBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.prevSlide();
                });
            }
            
            if (nextBtn) {
                nextBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.nextSlide();
                });
            }

            // Navigation dots - event delegation
            const dotsContainer = document.getElementById('hero-secondary-nav-dots');
            if (dotsContainer) {
                dotsContainer.addEventListener('click', (e) => {
                    const dot = e.target.closest('.hero-secondary-nav-dot');
                    if (!dot) return;
                    
                    const index = parseInt(dot.getAttribute('data-dot-index'));
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
            }

            // Touch swipe support
            this.bindTouchEvents();

            // Keyboard navigation
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

        /**
         * Bind touch/swipe events for mobile
         */
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

        /**
         * Refresh the banner with new data
         */
        refresh(newData) {
            this.stopAutoSlide();
            this.currentSlide = 0;
            this.isTransitioning = false;
            this.init(newData);
        }

        /**
         * Destroy the component (cleanup)
         */
        destroy() {
            this.stopAutoSlide();
            this.isInitialized = false;
            console.log('[HeroSecondaryBanner] 💀 Destroyed');
        }
    }

    // ==================== GLOBAL API ====================
    // Create singleton instance
    const heroSecondaryBanner = new HeroSecondaryBannerComponent();

    /**
     * Initialize Hero Secondary Banner - Called from external scripts
     * @param {Array} heroSecondaryData - Array of hero secondary slide objects
     * 
     * Usage: window.JAYENWARE.heroSecondaryBanner.init(heroSecondaryArray);
     */
    window.JAYENWARE = window.JAYENWARE || {};
    window.JAYENWARE.heroSecondaryBanner = heroSecondaryBanner;

    // ==================== AUTO-INITIALIZATION ====================
    // Inject styles
    if (!document.getElementById('hero-secondary-banner-styles')) {
        document.head.insertAdjacentHTML('beforeend', HERO_SECONDARY_CSS);
        console.log('[HeroSecondaryBanner] 🎨 Styles injected');
    }

    /**
     * Inject HTML into DOM at the correct position
     * Position: AFTER #hero-container (Hero Banner এর পরে)
     */
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

    // 🔥 Hot Products সেকশনের পরে বসবে
    const hotProductsSection = document.getElementById('hot-products-section');

    if (hotProductsSection && hotProductsSection.parentNode) {
        // ✅ PRIMARY: Insert AFTER hot-products-section
        hotProductsSection.parentNode.insertBefore(bannerElement, hotProductsSection.nextSibling);
        console.log('[HeroSecondaryBanner] ✅ Inserted AFTER hot-products-section');
    } else {
        // Fallback 1: hero-container এর পরে
        const heroContainer = document.getElementById('hero-container');
        if (heroContainer && heroContainer.parentNode) {
            heroContainer.parentNode.insertBefore(bannerElement, heroContainer.nextSibling);
            console.log('[HeroSecondaryBanner] ⚠️ Inserted AFTER hero-container (fallback)');
        } else {
            // Fallback 2: body এর শুরুতে
            document.body.insertBefore(bannerElement, document.body.firstChild);
            console.log('[HeroSecondaryBanner] ⚠️ Inserted at body start (ultimate fallback)');
        }
    }
}

    /**
     * Try to initialize with available data
     */
    function tryInit() {
        // First ensure HTML is injected
        injectHTML();
        
        // Check for data in window.currentData
        const data = (window.currentData && window.currentData.hero_secondary) || null;
        
        if (data && data.length > 0) {
            console.log('[HeroSecondaryBanner] 📊 Data found in window.currentData');
            heroSecondaryBanner.init(data);
        } else {
            console.log('[HeroSecondaryBanner] ⏳ No data yet, will wait for event or retry...');
        }
    }

    /**
     * Fetch hero secondary data directly from API
     */
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

    // Listen for data loaded event from main app
    window.addEventListener('jayenware:dataLoaded', (e) => {
        console.log('[HeroSecondaryBanner] 📡 Received jayenware:dataLoaded event');
        if (e.detail && e.detail.hero_secondary && e.detail.hero_secondary.length > 0) {
            heroSecondaryBanner.init(e.detail.hero_secondary);
        }
    });

    // Bootstrap - start the initialization process
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(tryInit, 50);
        });
    } else {
        setTimeout(tryInit, 50);
    }

    // Retry mechanism - if data doesn't arrive via event, fetch directly after 3 seconds
    setTimeout(() => {
        if (!heroSecondaryBanner.isInitialized) {
            console.log('[HeroSecondaryBanner] 🔄 Retry - fetching directly...');
            fetchHeroSecondaryData();
        }
    }, 3000);

    console.log('[HeroSecondaryBanner] 📄 Component script loaded (v1.0.0 - Secondary Banner after Hero Banner)');
})();
