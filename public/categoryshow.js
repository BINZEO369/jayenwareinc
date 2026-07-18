// ============================================================
// JAYENWARE HOME CATEGORY SHOWCASE COMPONENT (PRADA STYLE)
// Integrated with /api/home-showcase/complete API
// JABIYEN FONTS INTEGRATED - PREMIUM LUXURY ANIMATIONS
// ============================================================

class HomeCategoryShowcase {
    constructor() {
        this.config = {
            apiEndpoint: '/api/home-showcase/complete',
            containerId: 'categoryshow-container',
            skeletonId: 'categoryshow-skeleton',
            gridClass: 'showcase-grid-prada',
            itemsPerRow: {
                mobile: 2,
                tablet: 2,
                desktop: 2
            }
        };
        
        this.data = {
            header: null,
            menCategories: [],
            womenCategories: []
        };
        
        this.isLoaded = false;
        this.gridWrapper = null;
        this.gridElement = null;
        this.currentGender = 'women';
        this.isAnimating = false;
        this.animationQueue = [];
        this.init();
    }

    async init() {
        try {
            await this.fetchData();
            if (this.hasData()) {
                this.render();
                this.setupTabs();
            } else {
                this.hide();
            }
        } catch (error) {
            console.error('[CategoryShowcase] Initialization error:', error);
            this.hide();
        }
    }

    async fetchData() {
        try {
            const response = await fetch(this.config.apiEndpoint);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const data = await response.json();
            this.data = {
                header: data.header || null,
                menCategories: data.menCategories || [],
                womenCategories: data.womenCategories || []
            };
        } catch (error) {
            console.error('[CategoryShowcase] Fetch error:', error);
            this.data = { header: null, menCategories: [], womenCategories: [] };
            throw error;
        }
    }

    hasData() {
        return this.data.menCategories.length > 0 || this.data.womenCategories.length > 0;
    }

    hide() {
        const container = document.getElementById(this.config.containerId);
        const skeleton = document.getElementById(this.config.skeletonId);
        
        if (container) container.style.display = 'none';
        if (skeleton) {
            skeleton.classList.add('skeleton-hidden');
            skeleton.classList.remove('skeleton-visible');
        }
    }

    render() {
        const container = document.getElementById(this.config.containerId);
        const skeleton = document.getElementById(this.config.skeletonId);

        if (!container) return;

        container.style.display = 'block';
        if (skeleton) {
            skeleton.classList.add('skeleton-hidden');
            skeleton.classList.remove('skeleton-visible');
        }

        container.innerHTML = '';
        
        if (this.data.header) {
            const headerHTML = this.buildHeaderHTML();
            container.insertAdjacentHTML('beforeend', headerHTML);
        }

        const tabsHTML = this.buildTabsHTML();
        container.insertAdjacentHTML('beforeend', tabsHTML);

        this.gridWrapper = document.createElement('div');
        this.gridWrapper.className = 'showcase-grid-wrapper';
        container.appendChild(this.gridWrapper);

        this.gridElement = document.createElement('div');
        this.gridElement.className = this.config.gridClass;
        this.gridElement.id = 'categoryshow-dynamic-grid';
        this.gridWrapper.appendChild(this.gridElement);

        this.renderGrid(this.currentGender);
        this.injectStyles();

        this.isLoaded = true;
        console.log('[CategoryShowcase] Rendered successfully');
    }

    buildHeaderHTML() {
        const header = this.data.header;
        if (!header) return '';

        return `
        <div class="showcase-header" style="
            text-align: center;
            padding: 40px 20px 20px;
            max-width: 800px;
            margin: 0 auto;
        ">
            ${header.title ? `<h2 style="
                font-size: clamp(14px, 2vw, 16px);
                font-weight: 500;
                color: #1d1d1f;
                margin: 0 0 6px 0;
                font-family: 'Manrope', sans-serif;
                letter-spacing: -0.02em;
            ">${header.title}</h2>` : ''}
            
            ${header.subtitle ? `<p style="
                font-size: clamp(10px, 1.2vw, 11px);
                color: #86868b;
                margin: 0;
                line-height: 1.4;
                font-family: 'Inter', sans-serif;
            ">${header.subtitle}</p>` : ''}
        </div>`;
    }

    buildTabsHTML() {
        return `
        <div class="showcase-tabs" style="
            display: flex;
            justify-content: center;
            gap: 40px;
            padding: 10px 0 25px;
            border-bottom: 1px solid rgba(0,0,0,0.08);
            margin: 0 20px 0;
        ">
            <button class="tab-btn active" data-gender="women">Women</button>
            <button class="tab-btn" data-gender="men">Men</button>
        </div>`;
    }

    setupTabs() {
        const tabs = document.querySelectorAll('.tab-btn');
        const self = this;

        tabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const gender = this.getAttribute('data-gender');
                if (self.isAnimating || self.currentGender === gender) return;
                
                self.currentGender = gender;
                self.renderGridWithAnimation(gender);
                self.setActiveTab(this);
            });
        });
    }

    setActiveTab(activeTab) {
        document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
        activeTab.classList.add('active');
    }

    renderGridWithAnimation(gender) {
        if (!this.gridElement || !this.gridWrapper || this.isAnimating) return;
        
        this.isAnimating = true;
        
        const isMovingToMen = gender === 'men';
        
        let categories = [];
        if (gender === 'men') {
            categories = this.data.menCategories || [];
        } else {
            categories = this.data.womenCategories || [];
        }
        
        categories.sort((a, b) => (a.sort_order || 999) - (b.sort_order || 999));
        
        if (categories.length === 0) {
            this.gridElement.innerHTML = `<div class="empty-state">No categories found</div>`;
            this.isAnimating = false;
            return;
        }

        const newCardsHTML = categories.map((item, index) => this.buildCardHTML(item, index, true)).join('');
        
        const currentGrid = this.gridElement.querySelector('.showcase-grid-inner');
        
        // Create new grid with staggered entrance
        const newGrid = document.createElement('div');
        newGrid.className = 'showcase-grid-inner entering';
        newGrid.innerHTML = newCardsHTML;
        
        // Initial state based on direction
        const startX = isMovingToMen ? 80 : -80;
        newGrid.style.transform = `translateX(${startX}px)`;
        newGrid.style.opacity = '0';
        newGrid.style.filter = 'blur(8px)';
        
        // Animate current grid out
        if (currentGrid) {
            currentGrid.classList.add('exiting');
            const exitX = isMovingToMen ? -80 : 80;
            currentGrid.style.transform = `translateX(${exitX}px)`;
            currentGrid.style.opacity = '0';
            currentGrid.style.filter = 'blur(8px)';
        }
        
        // Append new grid
        this.gridElement.appendChild(newGrid);
        
        // Use requestAnimationFrame for smooth animation trigger
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                // Animate new grid in
                newGrid.style.transform = 'translateX(0)';
                newGrid.style.opacity = '1';
                newGrid.style.filter = 'blur(0)';
                
                // Trigger staggered card animations
                const cards = newGrid.querySelectorAll('.showcase-category-card');
                cards.forEach((card, index) => {
                    card.style.animationDelay = `${0.15 + index * 0.07}s`;
                    card.style.animationPlayState = 'running';
                });
                
                // Clean up after animation
                const onTransitionEnd = (e) => {
                    if (e.target === newGrid && e.propertyName === 'transform') {
                        newGrid.removeEventListener('transitionend', onTransitionEnd);
                        cleanup();
                    }
                };
                
                const cleanup = () => {
                    if (currentGrid && currentGrid.parentNode) {
                        currentGrid.remove();
                    }
                    newGrid.classList.remove('entering');
                    if (currentGrid) currentGrid.classList.remove('exiting');
                    this.isAnimating = false;
                };
                
                newGrid.addEventListener('transitionend', onTransitionEnd);
                
                // Fallback cleanup
                setTimeout(() => {
                    if (this.isAnimating) {
                        cleanup();
                    }
                }, 900);
            });
        });
    }

    renderGrid(gender) {
        if (!this.gridElement) return;
        
        let categories = [];
        if (gender === 'men') {
            categories = this.data.menCategories || [];
        } else {
            categories = this.data.womenCategories || [];
        }

        categories.sort((a, b) => (a.sort_order || 999) - (b.sort_order || 999));

        if (categories.length === 0) {
            this.gridElement.innerHTML = `<div class="empty-state">No categories found</div>`;
            return;
        }

        const cardsHTML = categories.map((item, index) => this.buildCardHTML(item, index, false)).join('');
        this.gridElement.innerHTML = `<div class="showcase-grid-inner">${cardsHTML}</div>`;
        
        // Animate cards on initial load
        setTimeout(() => {
            const cards = this.gridElement.querySelectorAll('.showcase-category-card');
            cards.forEach((card, index) => {
                card.style.animationPlayState = 'running';
            });
        }, 50);
    }

    buildCardHTML(item, index, isAnimated = false) {
        const cat = item.categories;
        if (!cat) return '';
        
        const catName = cat.name || 'Category';
        const catSlug = cat.slug || this.createSlug(catName);
        const imgSrc = cat.image_url || cat.image || '';
        
        const delay = isAnimated ? `style="animation-delay: ${0.15 + index * 0.07}s; animation-play-state: paused;"` : `style="animation-delay: ${0.1 + index * 0.06}s; animation-play-state: paused;"`;
        
        return `
        <a href="/category/${catSlug}" 
           class="showcase-category-card"
           ${delay}>
            
            <div class="card-image-wrapper">
                ${imgSrc ? `<img src="${imgSrc}" 
                     alt="${catName}" 
                     loading="${index < 4 ? 'eager' : 'lazy'}"
                     onerror="this.parentElement.classList.add('no-image')"
                     class="card-image">` : '<div class="image-placeholder"></div>'}
                <div class="card-image-overlay"></div>
                <div class="card-shimmer"></div>
            </div>
            
            <div class="card-content">
                <h3 class="card-title">${catName}</h3>
                <span class="card-explore">Explore Collection</span>
            </div>
        </a>`;
    }

    injectStyles() {
        const existingStyles = document.getElementById('showcase-grid-styles');
        if (existingStyles) existingStyles.remove();

        const styles = `
        <style id="showcase-grid-styles">
            /* ===== GRID WRAPPER ===== */
            .showcase-grid-wrapper {
                overflow: hidden;
                position: relative;
                background: #ffffff;
                padding: 0;
                margin: 0;
            }
            
            /* ===== MAIN GRID CONTAINER ===== */
            #categoryshow-dynamic-grid {
                position: relative;
                min-height: 200px;
                background: #ffffff;
            }
            
            /* ===== INNER GRID ===== */
            .showcase-grid-inner {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 1px;
                width: 100%;
                background: #ebebed;
                transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), 
                            opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1),
                            filter 0.6s cubic-bezier(0.16, 1, 0.3, 1);
                will-change: transform, opacity, filter;
            }
            
            .showcase-grid-inner.entering {
                position: absolute;
                top: 0;
                left: 0;
                z-index: 2;
            }
            
            .showcase-grid-inner.exiting {
                position: relative;
                z-index: 1;
                transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), 
                            opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1),
                            filter 0.5s cubic-bezier(0.16, 1, 0.3, 1);
            }
            
            /* ===== TAB BUTTONS ===== */
            .tab-btn {
                background: none;
                border: none;
                font-size: 15px;
                font-weight: 400;
                color: #86868b;
                cursor: pointer;
                padding: 8px 4px;
                position: relative;
                font-family: 'Inter', -apple-system, sans-serif;
                letter-spacing: -0.01em;
                transition: color 0.4s ease;
                outline: none;
                -webkit-tap-highlight-color: transparent;
                user-select: none;
            }
            
            .tab-btn::after {
                content: '';
                position: absolute;
                bottom: -1px;
                left: 50%;
                width: 0;
                height: 1.5px;
                background: #1d1d1f;
                transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1), left 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                transform: translateX(-50%);
            }
            
            .tab-btn.active {
                color: #1d1d1f;
                font-weight: 500;
            }
            
            .tab-btn.active::after {
                width: 100%;
                left: 50%;
            }
            
            .tab-btn:hover:not(.active) {
                color: #6e6e73;
            }
            
            /* ===== CATEGORY CARD ===== */
            .showcase-category-card {
                position: relative;
                display: flex;
                flex-direction: column;
                text-decoration: none;
                background: #ffffff;
                cursor: pointer;
                -webkit-tap-highlight-color: transparent;
                overflow: hidden;
                opacity: 0;
                animation: cardReveal 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
            
            @keyframes cardReveal {
                0% {
                    opacity: 0;
                    transform: translateY(40px) scale(0.95);
                }
                100% {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }
            
            /* ===== IMAGE WRAPPER ===== */
            .card-image-wrapper {
                position: relative;
                width: 100%;
                aspect-ratio: 3/4;
                overflow: hidden;
                background: #f5f5f7;
            }
            
            .card-image {
                position: absolute;
                inset: 0;
                width: 100%;
                height: 100%;
                object-fit: cover;
                transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
                transform-origin: center center;
            }
            
            .card-image-overlay {
                position: absolute;
                inset: 0;
                background: rgba(0,0,0,0);
                transition: background 0.6s ease;
                z-index: 1;
                pointer-events: none;
            }
            
            /* Shimmer effect on load */
            .card-shimmer {
                position: absolute;
                inset: 0;
                background: linear-gradient(
                    90deg,
                    transparent 0%,
                    rgba(255,255,255,0.4) 50%,
                    transparent 100%
                );
                transform: translateX(-100%);
                z-index: 2;
                pointer-events: none;
            }
            
            .entering .card-shimmer {
                animation: shimmer 1.5s ease-in-out forwards;
            }
            
            @keyframes shimmer {
                0% {
                    transform: translateX(-100%);
                }
                100% {
                    transform: translateX(200%);
                }
            }
            
            .image-placeholder {
                position: absolute;
                inset: 0;
                background: linear-gradient(135deg, #f5f5f7 0%, #e8e8ed 100%);
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .image-placeholder::after {
                content: '';
                width: 40px;
                height: 40px;
                border: 2px solid #c7c7cc;
                border-radius: 50%;
                opacity: 0.4;
            }
            
            .no-image .image-placeholder {
                background: linear-gradient(135deg, #fafafa 0%, #f0f0f5 100%);
            }
            
            /* ===== CARD CONTENT ===== */
            .card-content {
                padding: 24px 16px 32px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                text-align: center;
                background: #ffffff;
                position: relative;
                z-index: 2;
            }
            
            .card-title {
                font-size: clamp(15px, 2vw, 17px);
                line-height: 1.2;
                margin: 0;
                color: #1d1d1f;
                font-family: 'Sora', -apple-system, sans-serif;
                font-weight: 500;
                letter-spacing: -0.01em;
                transition: color 0.4s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            }
            
            .card-explore {
                display: inline-block;
                margin-top: 10px;
                font-size: 11px;
                font-family: 'Inter', -apple-system, sans-serif;
                color: #86868b;
                letter-spacing: 0.04em;
                text-transform: uppercase;
                position: relative;
                opacity: 0;
                transform: translateY(8px);
                transition: opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), 
                            transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), 
                            color 0.4s ease;
            }
            
            .card-explore::after {
                content: '';
                position: absolute;
                bottom: -2px;
                left: 0;
                width: 0;
                height: 1px;
                background: currentColor;
                transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            }
            
            /* ===== HOVER EFFECTS ===== */
            @media (hover: hover) {
                .showcase-category-card:hover .card-image {
                    transform: scale(1.04);
                }
                
                .showcase-category-card:hover .card-image-overlay {
                    background: rgba(0,0,0,0.02);
                }
                
                .showcase-category-card:hover .card-title {
                    color: #000000;
                    transform: translateY(-2px);
                }
                
                .showcase-category-card:hover .card-explore {
                    opacity: 1;
                    transform: translateY(0);
                    color: #6e6e73;
                }
                
                .showcase-category-card:hover .card-explore::after {
                    width: 100%;
                }
            }
            
            /* ===== ACTIVE/TAP EFFECT ===== */
            .showcase-category-card:active .card-image {
                transform: scale(0.97);
                transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
            }
            
            .showcase-category-card:active .card-image-overlay {
                background: rgba(0,0,0,0.05);
                transition: background 0.2s ease;
            }
            
            /* ===== EMPTY STATE ===== */
            .empty-state {
                text-align: center;
                padding: 60px 20px;
                color: #86868b;
                font-family: 'Inter', -apple-system, sans-serif;
                font-size: 14px;
                grid-column: 1 / -1;
            }
            
            /* ===== RESPONSIVE ===== */
            @media (max-width: 767px) {
                .showcase-tabs {
                    gap: 30px !important;
                    padding: 8px 0 20px !important;
                }
                
                .tab-btn {
                    font-size: 14px !important;
                }
                
                .showcase-grid-inner {
                    gap: 1px;
                }
                
                .card-content {
                    padding: 18px 12px 24px !important;
                }
                
                .card-title {
                    font-size: 14px !important;
                }
                
                .card-explore {
                    font-size: 10px !important;
                    margin-top: 8px !important;
                }
                
                @keyframes cardReveal {
                    0% {
                        opacity: 0;
                        transform: translateY(30px) scale(0.96);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
            }
            
            @media (max-width: 380px) {
                .showcase-grid-inner {
                    gap: 1px;
                }
                
                .card-content {
                    padding: 14px 8px 20px !important;
                }
                
                .card-title {
                    font-size: 13px !important;
                }
                
                .card-explore {
                    font-size: 9px !important;
                    margin-top: 6px !important;
                }
            }
            
            /* ===== HEADER FONTS ===== */
            .showcase-header h2 {
                font-family: 'Manrope', -apple-system, sans-serif !important;
            }
            
            .showcase-header p {
                font-family: 'Inter', -apple-system, sans-serif !important;
            }
            
            /* ===== REDUCED MOTION ===== */
            @media (prefers-reduced-motion: reduce) {
                .showcase-grid-inner,
                .showcase-grid-inner.exiting,
                .showcase-category-card,
                .card-image,
                .card-shimmer {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                }
            }
        </style>`;

        document.head.insertAdjacentHTML('beforeend', styles);
    }

    createSlug(text) {
        if (!text) return '';
        return text
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    async refresh() {
        await this.fetchData();
        if (this.hasData()) {
            this.render();
        } else {
            this.hide();
        }
    }
}

// ============================================================
// Initialize Function
// ============================================================
function initCategoryShowcase() {
    console.log('[CategoryShowcase] Initializing premium luxury animations...');
    
    const tryInit = () => {
        if (typeof window.currentData !== 'undefined' && 
            window.currentData.products && 
            window.currentData.products.length > 0) {
            window.categoryShowcase = new HomeCategoryShowcase();
            return true;
        }
        return false;
    };

    if (!tryInit()) {
        window.addEventListener('jayenware:dataLoaded', (event) => {
            setTimeout(() => {
                if (!window.categoryShowcase) {
                    window.categoryShowcase = new HomeCategoryShowcase();
                } else {
                    window.categoryShowcase.refresh();
                }
            }, 100);
        }, { once: true });
        
        setTimeout(() => {
            if (!window.categoryShowcase) {
                window.categoryShowcase = new HomeCategoryShowcase();
            }
        }, 3000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            if (!window.categoryShowcase) {
                window.categoryShowcase = new HomeCategoryShowcase();
            }
        });
    }
}

// ============================================================
// Start
// ============================================================
if (typeof window !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCategoryShowcase);
    } else {
        setTimeout(initCategoryShowcase, 0);
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { HomeCategoryShowcase, initCategoryShowcase };
}
