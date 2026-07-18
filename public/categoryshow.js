// ============================================================
// JAYENWARE HOME CATEGORY SHOWCASE COMPONENT (PRADA STYLE)
// Integrated with /api/home-showcase/complete API
// JABIYEN FONTS INTEGRATED - ULTRA SMOOTH WORLD-CLASS ANIMATIONS
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

        this.renderGridInitial(this.currentGender);
        this.injectStyles();

        this.isLoaded = true;
        console.log('[CategoryShowcase] Rendered successfully with ultra-smooth animations');
    }

    buildHeaderHTML() {
        const header = this.data.header;
        if (!header) return '';

        return `
        <div class="showcase-header">
            ${header.title ? `<h2>${header.title}</h2>` : ''}
            ${header.subtitle ? `<p>${header.subtitle}</p>` : ''}
        </div>`;
    }

    buildTabsHTML() {
        return `
        <div class="showcase-tabs">
            <button class="tab-btn active" data-gender="women">
                <span class="tab-text">Women</span>
                <span class="tab-indicator"></span>
            </button>
            <button class="tab-btn" data-gender="men">
                <span class="tab-text">Men</span>
                <span class="tab-indicator"></span>
            </button>
        </div>`;
    }

    setupTabs() {
        const tabs = document.querySelectorAll('.tab-btn');
        const self = this;

        tabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const gender = this.getAttribute('data-gender');
                if (self.isAnimating || self.currentGender === gender) return;
                
                const previousGender = self.currentGender;
                self.currentGender = gender;
                self.performSmoothTransition(gender, previousGender);
                self.setActiveTab(this);
            });
        });
    }

    setActiveTab(activeTab) {
        document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
        activeTab.classList.add('active');
    }

    performSmoothTransition(newGender, oldGender) {
        if (!this.gridElement || !this.gridWrapper || this.isAnimating) return;
        
        this.isAnimating = true;
        
        let categories = [];
        if (newGender === 'men') {
            categories = this.data.menCategories || [];
        } else {
            categories = this.data.womenCategories || [];
        }
        
        categories.sort((a, b) => (a.sort_order || 999) - (b.sort_order || 999));
        
        if (categories.length === 0) {
            this.gridElement.innerHTML = '<div class="empty-state">No categories found</div>';
            this.isAnimating = false;
            return;
        }

        const isMovingForward = newGender === 'men';
        const currentInner = this.gridElement.querySelector('.showcase-grid-inner');
        
        // Build new content
        const newInner = document.createElement('div');
        newInner.className = 'showcase-grid-inner showcase-grid-inner-new';
        categories.forEach((item, index) => {
            const cardHTML = this.buildCardHTML(item, index);
            newInner.insertAdjacentHTML('beforeend', cardHTML);
        });

        // Set initial positions
        if (currentInner) {
            currentInner.style.transition = 'transform 0.7s cubic-bezier(0.25, 0.1, 0.25, 1), opacity 0.5s cubic-bezier(0.25, 0.1, 0.25, 1)';
            currentInner.style.willChange = 'transform, opacity';
        }

        const startOffset = isMovingForward ? '80px' : '-80px';
        newInner.style.transform = `translateX(${startOffset})`;
        newInner.style.opacity = '0';
        newInner.style.transition = 'transform 0.7s cubic-bezier(0.25, 0.1, 0.25, 1), opacity 0.5s cubic-bezier(0.25, 0.1, 0.25, 1)';
        newInner.style.willChange = 'transform, opacity';
        newInner.style.position = 'absolute';
        newInner.style.top = '0';
        newInner.style.left = '0';
        newInner.style.width = '100%';
        newInner.style.zIndex = '2';

        // Append new grid
        this.gridElement.appendChild(newInner);

        // Force reflow
        newInner.offsetHeight;

        // Animate out current content
        if (currentInner) {
            const exitOffset = isMovingForward ? '-80px' : '80px';
            currentInner.style.transform = `translateX(${exitOffset})`;
            currentInner.style.opacity = '0';
            currentInner.style.position = 'relative';
            currentInner.style.zIndex = '1';
        }

        // Animate in new content
        requestAnimationFrame(() => {
            newInner.style.transform = 'translateX(0)';
            newInner.style.opacity = '1';
        });

        // Cleanup after animation
        const cleanup = () => {
            if (currentInner && currentInner.parentNode) {
                currentInner.remove();
            }
            newInner.classList.remove('showcase-grid-inner-new');
            newInner.style.position = 'relative';
            newInner.style.zIndex = '1';
            newInner.style.willChange = 'auto';
            
            // Staggered card reveal
            const cards = newInner.querySelectorAll('.showcase-category-card');
            cards.forEach((card, index) => {
                card.style.animation = 'none';
                card.offsetHeight;
                card.style.animation = `cardRevealStaggered 0.5s cubic-bezier(0.25, 0.1, 0.25, 1) ${index * 0.06}s both`;
            });
            
            this.isAnimating = false;
        };

        // Listen for transition end on newInner
        const transitionEndHandler = (e) => {
            if (e.target === newInner && e.propertyName === 'transform') {
                newInner.removeEventListener('transitionend', transitionEndHandler);
                cleanup();
            }
        };
        newInner.addEventListener('transitionend', transitionEndHandler);

        // Fallback cleanup
        setTimeout(() => {
            if (this.isAnimating) {
                newInner.removeEventListener('transitionend', transitionEndHandler);
                cleanup();
            }
        }, 900);
    }

    renderGridInitial(gender) {
        if (!this.gridElement) return;
        
        let categories = [];
        if (gender === 'men') {
            categories = this.data.menCategories || [];
        } else {
            categories = this.data.womenCategories || [];
        }

        categories.sort((a, b) => (a.sort_order || 999) - (b.sort_order || 999));

        if (categories.length === 0) {
            this.gridElement.innerHTML = '<div class="empty-state">No categories found</div>';
            return;
        }

        const innerGrid = document.createElement('div');
        innerGrid.className = 'showcase-grid-inner';
        
        categories.forEach((item, index) => {
            const cardHTML = this.buildCardHTML(item, index);
            innerGrid.insertAdjacentHTML('beforeend', cardHTML);
        });

        this.gridElement.innerHTML = '';
        this.gridElement.appendChild(innerGrid);
    }

    buildCardHTML(item, index) {
        const cat = item.categories;
        if (!cat) return '';
        
        const catName = cat.name || 'Category';
        const catSlug = cat.slug || this.createSlug(catName);
        const imgSrc = cat.image_url || cat.image || '';
        
        return `
        <a href="/category/${catSlug}" 
           class="showcase-category-card"
           style="animation: cardRevealStaggered 0.5s cubic-bezier(0.25, 0.1, 0.25, 1) ${index * 0.06}s both;">
            
            <div class="card-image-wrapper">
                ${imgSrc ? `<img src="${imgSrc}" 
                     alt="${catName}" 
                     loading="${index < 4 ? 'eager' : 'lazy'}"
                     onerror="this.parentElement.classList.add('no-image')"
                     class="card-image">` : '<div class="image-placeholder"></div>'}
                <div class="card-image-overlay"></div>
            </div>
            
            <div class="card-content">
                <h3 class="card-title">${catName}</h3>
                <span class="card-explore">Explore</span>
            </div>
        </a>`;
    }

    injectStyles() {
        const existingStyles = document.getElementById('showcase-grid-styles');
        if (existingStyles) existingStyles.remove();

        const styles = `
        <style id="showcase-grid-styles">
            /* ===== CSS Variables ===== */
            :root {
                --transition-smooth: cubic-bezier(0.25, 0.1, 0.25, 1);
                --transition-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
                --color-bg: #ffffff;
                --color-gap: #f5f5f7;
                --color-text: #1d1d1f;
                --color-text-secondary: #86868b;
                --color-border: rgba(0,0,0,0.06);
            }

            /* ===== HEADER ===== */
            .showcase-header {
                text-align: center;
                padding: 40px 20px 20px;
                max-width: 800px;
                margin: 0 auto;
            }
            
            .showcase-header h2 {
                font-size: clamp(14px, 2vw, 16px);
                font-weight: 500;
                color: var(--color-text);
                margin: 0 0 6px 0;
                font-family: 'Manrope', -apple-system, sans-serif;
                letter-spacing: -0.02em;
            }
            
            .showcase-header p {
                font-size: clamp(10px, 1.2vw, 11px);
                color: var(--color-text-secondary);
                margin: 0;
                line-height: 1.4;
                font-family: 'Inter', -apple-system, sans-serif;
            }

            /* ===== GRID WRAPPER ===== */
            .showcase-grid-wrapper {
                overflow: hidden;
                position: relative;
                background: var(--color-bg);
                padding: 0;
                margin: 0;
                min-height: 200px;
            }
            
            /* ===== MAIN GRID CONTAINER ===== */
            #categoryshow-dynamic-grid {
                position: relative;
                min-height: 200px;
                background: var(--color-bg);
            }
            
            /* ===== INNER GRID ===== */
            .showcase-grid-inner {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 1px;
                width: 100%;
                background: var(--color-gap);
                position: relative;
                z-index: 1;
                backface-visibility: hidden;
                -webkit-backface-visibility: hidden;
                perspective: 1000px;
                -webkit-perspective: 1000px;
            }
            
            /* ===== TAB BUTTONS ===== */
            .showcase-tabs {
                display: flex;
                justify-content: center;
                gap: 40px;
                padding: 10px 0 25px;
                border-bottom: 1px solid var(--color-border);
                margin: 0 20px 0;
            }
            
            .tab-btn {
                background: none;
                border: none;
                font-size: 15px;
                font-weight: 400;
                color: var(--color-text-secondary);
                cursor: pointer;
                padding: 8px 4px;
                position: relative;
                font-family: 'Inter', -apple-system, sans-serif;
                letter-spacing: -0.01em;
                transition: color 0.35s var(--transition-smooth);
                outline: none;
                -webkit-tap-highlight-color: transparent;
                user-select: none;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 4px;
            }
            
            .tab-indicator {
                display: block;
                width: 0;
                height: 1.5px;
                background: var(--color-text);
                transition: width 0.35s var(--transition-smooth);
                border-radius: 1px;
            }
            
            .tab-btn.active {
                color: var(--color-text);
                font-weight: 500;
            }
            
            .tab-btn.active .tab-indicator {
                width: 100%;
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
                background: var(--color-bg);
                cursor: pointer;
                -webkit-tap-highlight-color: transparent;
                overflow: hidden;
                opacity: 0;
                backface-visibility: hidden;
                -webkit-backface-visibility: hidden;
            }
            
            @keyframes cardRevealStaggered {
                0% {
                    opacity: 0;
                    transform: translateY(24px) scale(0.97);
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
                background: var(--color-gap);
                transform: translateZ(0);
                -webkit-transform: translateZ(0);
            }
            
            .card-image {
                position: absolute;
                inset: 0;
                width: 100%;
                height: 100%;
                object-fit: cover;
                transition: transform 0.8s var(--transition-smooth);
                transform: translateZ(0);
                -webkit-transform: translateZ(0);
            }
            
            .card-image-overlay {
                position: absolute;
                inset: 0;
                background: rgba(0,0,0,0);
                transition: background 0.6s var(--transition-smooth);
                z-index: 1;
                pointer-events: none;
            }
            
            .image-placeholder {
                position: absolute;
                inset: 0;
                background: linear-gradient(135deg, #f5f5f7 0%, #e8e8ed 50%, #f5f5f7 100%);
                background-size: 200% 200%;
                animation: shimmer 2s ease-in-out infinite;
            }
            
            @keyframes shimmer {
                0%, 100% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
            }
            
            .no-image .image-placeholder::after {
                content: '';
                position: absolute;
                inset: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
                color: #c7c7cc;
                opacity: 0.5;
                font-family: 'Inter', sans-serif;
            }
            
            /* ===== CARD CONTENT ===== */
            .card-content {
                padding: 20px 16px 28px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                text-align: center;
                background: var(--color-bg);
                position: relative;
                z-index: 2;
            }
            
            .card-title {
                font-size: clamp(15px, 2vw, 17px);
                line-height: 1.2;
                margin: 0;
                color: var(--color-text);
                font-family: 'Sora', -apple-system, sans-serif;
                font-weight: 500;
                letter-spacing: -0.01em;
                transition: color 0.35s var(--transition-smooth);
            }
            
            .card-explore {
                display: inline-block;
                margin-top: 8px;
                font-size: 11px;
                font-family: 'Inter', -apple-system, sans-serif;
                color: var(--color-text-secondary);
                letter-spacing: 0.04em;
                text-transform: uppercase;
                font-weight: 500;
                opacity: 0;
                transform: translateY(6px);
                transition: opacity 0.4s var(--transition-smooth), 
                            transform 0.4s var(--transition-smooth), 
                            color 0.35s var(--transition-smooth);
            }
            
            /* ===== EMPTY STATE ===== */
            .empty-state {
                text-align: center;
                padding: 60px 20px;
                color: var(--color-text-secondary);
                font-family: 'Inter', -apple-system, sans-serif;
                font-size: 14px;
                grid-column: 1 / -1;
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
                }
                
                .showcase-category-card:hover .card-explore {
                    opacity: 1;
                    transform: translateY(0);
                    color: #6e6e73;
                }
            }
            
            /* ===== ACTIVE/TAP EFFECT ===== */
            .showcase-category-card:active .card-image {
                transform: scale(0.97);
                transition: transform 0.25s var(--transition-smooth);
            }
            
            .showcase-category-card:active .card-image-overlay {
                background: rgba(0,0,0,0.04);
                transition: background 0.2s var(--transition-smooth);
            }
            
            /* ===== RESPONSIVE ===== */
            @media (max-width: 767px) {
                .showcase-tabs {
                    gap: 30px;
                    padding: 8px 0 20px;
                }
                
                .tab-btn {
                    font-size: 14px;
                }
                
                .showcase-grid-inner {
                    gap: 1px;
                }
                
                .card-content {
                    padding: 16px 12px 22px;
                }
                
                .card-title {
                    font-size: 14px;
                }
                
                .card-explore {
                    font-size: 10px;
                    margin-top: 6px;
                }
                
                @keyframes cardRevealStaggered {
                    0% {
                        opacity: 0;
                        transform: translateY(18px) scale(0.97);
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
                    padding: 12px 8px 18px;
                }
                
                .card-title {
                    font-size: 13px;
                }
                
                @keyframes cardRevealStaggered {
                    0% {
                        opacity: 0;
                        transform: translateY(12px) scale(0.97);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
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
    console.log('[CategoryShowcase] Initializing with ultra-smooth world-class animations...');
    
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
