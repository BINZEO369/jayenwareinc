// ============================================================
// JAYENWARE HOME CATEGORY SHOWCASE COMPONENT (LUXURY EDITION)
// World-class design inspired by Gucci, Prada, Louis Vuitton
// ============================================================

class HomeCategoryShowcase {
    constructor() {
        this.config = {
            apiEndpoint: '/api/home-showcase/complete',
            containerId: 'categoryshow-container',
            skeletonId: 'categoryshow-skeleton',
            gridClass: 'showcase-grid-luxury',
        };
        
        this.data = {
            header: null,
            menCategories: [],
            womenCategories: []
        };
        
        this.isLoaded = false;
        this.gridElement = null;
        this.currentGender = 'women';
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
        
        // Build Components
        if (this.data.header) {
            const headerHTML = this.buildHeaderHTML();
            container.insertAdjacentHTML('beforeend', headerHTML);
        }

        const tabsHTML = this.buildTabsHTML();
        container.insertAdjacentHTML('beforeend', tabsHTML);

        this.gridElement = document.createElement('div');
        this.gridElement.className = this.config.gridClass;
        this.gridElement.id = 'categoryshow-dynamic-grid';
        container.appendChild(this.gridElement);

        this.renderGrid('women');
        this.injectStyles();
        this.setupAnimations();

        this.isLoaded = true;
        console.log('[CategoryShowcase] Rendered successfully');
    }

    buildHeaderHTML() {
        const header = this.data.header;
        if (!header) return '';

        return `
        <div class="showcase-header">
            <div class="header-decoration"></div>
            ${header.title ? `<h2 class="header-title">${header.title}</h2>` : ''}
            ${header.subtitle ? `<p class="header-subtitle">${header.subtitle}</p>` : ''}
        </div>`;
    }

    buildTabsHTML() {
        return `
        <div class="showcase-tabs">
            <div class="tabs-container">
                <button class="tab-btn active" data-gender="women">
                    <span class="tab-text">Women</span>
                    <span class="tab-indicator"></span>
                </button>
                <button class="tab-btn" data-gender="men">
                    <span class="tab-text">Men</span>
                    <span class="tab-indicator"></span>
                </button>
            </div>
        </div>`;
    }

    setupTabs() {
        const tabs = document.querySelectorAll('.tab-btn');
        const self = this;

        const initialTab = document.querySelector('.tab-btn[data-gender="women"]');
        if (initialTab) initialTab.classList.add('active');

        tabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const gender = this.getAttribute('data-gender');
                self.currentGender = gender;
                
                // Remove active class from all tabs
                tabs.forEach(t => t.classList.remove('active'));
                // Add active class to clicked tab
                this.classList.add('active');
                
                // Animate grid transition
                self.gridElement.style.opacity = '0';
                self.gridElement.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    self.renderGrid(gender);
                    self.gridElement.style.opacity = '1';
                    self.gridElement.style.transform = 'translateY(0)';
                }, 300);
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
            this.gridElement.innerHTML = `
                <div class="empty-state">
                    <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                    </svg>
                    <p>Coming Soon</p>
                </div>`;
            return;
        }

        const cardsHTML = categories.map((item, index) => this.buildCardHTML(item, index)).join('');
        this.gridElement.innerHTML = cardsHTML;
    }

    buildCardHTML(item, index) {
        const cat = item.categories;
        if (!cat) return '';
        
        const catName = cat.name || 'Category';
        const catSlug = cat.slug || this.createSlug(catName);
        const imgSrc = cat.image_url || cat.image || '';
        const description = cat.description || '';
        
        return `
        <a href="/category/${catSlug}" 
           class="luxury-card"
           style="animation-delay: ${index * 0.1}s">
            
            <div class="card-image-container">
                ${imgSrc ? `
                <img src="${imgSrc}" 
                     alt="${catName}" 
                     loading="${index < 4 ? 'eager' : 'lazy'}"
                     onerror="this.parentElement.classList.add('image-error')"
                     class="card-image">
                ` : `
                <div class="image-placeholder">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21,15 16,10 5,21"/>
                    </svg>
                </div>`}
                
                <div class="image-overlay"></div>
                <div class="card-badge">New Season</div>
            </div>
            
            <div class="card-info">
                <h3 class="card-title">${catName}</h3>
                ${description ? `<p class="card-description">${description}</p>` : ''}
                <span class="card-cta">
                    Explore Collection
                    <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                </span>
            </div>
        </a>`;
    }

    setupAnimations() {
        // Intersection Observer for scroll animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });

        document.querySelectorAll('.luxury-card').forEach(card => {
            observer.observe(card);
        });
    }

    injectStyles() {
        const existingStyles = document.getElementById('showcase-grid-styles');
        if (existingStyles) existingStyles.remove();

        const styles = `
        <style id="showcase-grid-styles">
            /* ============ HEADER STYLES ============ */
            .showcase-header {
                text-align: center;
                padding: 80px 20px 60px;
                max-width: 600px;
                margin: 0 auto;
            }
            
            .header-decoration {
                width: 40px;
                height: 2px;
                background: #1a1a1a;
                margin: 0 auto 24px;
            }
            
            .header-title {
                font-size: clamp(24px, 4vw, 36px);
                font-weight: 300;
                color: #1a1a1a;
                margin: 0 0 16px 0;
                font-family: 'Georgia', 'Times New Roman', serif;
                letter-spacing: 2px;
                text-transform: uppercase;
            }
            
            .header-subtitle {
                font-size: clamp(13px, 1.5vw, 15px);
                color: #666;
                margin: 0;
                line-height: 1.6;
                font-family: 'Helvetica Neue', Arial, sans-serif;
                font-weight: 300;
                letter-spacing: 0.5px;
            }
            
            /* ============ TABS STYLES ============ */
            .showcase-tabs {
                padding: 0 0 40px;
                margin: 0;
            }
            
            .tabs-container {
                display: flex;
                justify-content: center;
                gap: 0;
                border-bottom: 1px solid #e0e0e0;
                margin: 0 40px;
            }
            
            .tab-btn {
                background: none;
                border: none;
                padding: 16px 32px;
                cursor: pointer;
                position: relative;
                font-family: 'Helvetica Neue', Arial, sans-serif;
                font-size: 13px;
                font-weight: 500;
                color: #999;
                letter-spacing: 2px;
                text-transform: uppercase;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            .tab-btn:hover {
                color: #666;
            }
            
            .tab-btn.active {
                color: #1a1a1a;
            }
            
            .tab-indicator {
                position: absolute;
                bottom: 0;
                left: 50%;
                transform: translateX(-50%) scaleX(0);
                width: 100%;
                height: 2px;
                background: #1a1a1a;
                transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            .tab-btn.active .tab-indicator {
                transform: translateX(-50%) scaleX(1);
            }
            
            /* ============ GRID STYLES ============ */
            #categoryshow-dynamic-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 1px;
                background: #f5f5f5;
                padding: 0;
                max-width: 1400px;
                margin: 0 auto;
                transition: opacity 0.3s ease, transform 0.3s ease;
            }
            
            @media (min-width: 1024px) {
                #categoryshow-dynamic-grid {
                    grid-template-columns: repeat(3, 1fr);
                }
            }
            
            /* ============ CARD STYLES ============ */
            .luxury-card {
                position: relative;
                display: flex;
                flex-direction: column;
                text-decoration: none;
                background: #ffffff;
                cursor: pointer;
                opacity: 0;
                transform: translateY(30px);
                transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                overflow: hidden;
            }
            
            .luxury-card.visible {
                opacity: 1;
                transform: translateY(0);
            }
            
            .card-image-container {
                position: relative;
                width: 100%;
                aspect-ratio: 3/4;
                overflow: hidden;
                background: #fafafa;
            }
            
            .card-image {
                width: 100%;
                height: 100%;
                object-fit: cover;
                transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            .luxury-card:hover .card-image {
                transform: scale(1.05);
            }
            
            .image-overlay {
                position: absolute;
                inset: 0;
                background: linear-gradient(to top, rgba(0,0,0,0.1) 0%, transparent 50%);
                opacity: 0;
                transition: opacity 0.4s ease;
            }
            
            .luxury-card:hover .image-overlay {
                opacity: 1;
            }
            
            .image-placeholder {
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                background: #f5f5f5;
            }
            
            .image-placeholder svg {
                width: 48px;
                height: 48px;
                color: #ccc;
            }
            
            .image-error .card-image {
                display: none;
            }
            
            .card-badge {
                position: absolute;
                top: 16px;
                left: 16px;
                background: rgba(255,255,255,0.95);
                backdrop-filter: blur(10px);
                padding: 6px 12px;
                font-size: 10px;
                font-weight: 500;
                letter-spacing: 1px;
                text-transform: uppercase;
                color: #1a1a1a;
                border-radius: 2px;
            }
            
            /* ============ CARD INFO STYLES ============ */
            .card-info {
                padding: 24px 20px 32px;
                display: flex;
                flex-direction: column;
                align-items: center;
                text-align: center;
            }
            
            .card-title {
                font-size: clamp(14px, 2vw, 16px);
                font-weight: 500;
                color: #1a1a1a;
                margin: 0 0 8px 0;
                font-family: 'Helvetica Neue', Arial, sans-serif;
                letter-spacing: 1px;
                text-transform: uppercase;
            }
            
            .card-description {
                font-size: 12px;
                color: #999;
                margin: 0 0 16px 0;
                line-height: 1.5;
                font-weight: 300;
            }
            
            .card-cta {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                font-size: 11px;
                font-weight: 500;
                color: #1a1a1a;
                letter-spacing: 1.5px;
                text-transform: uppercase;
                border-bottom: 1px solid #1a1a1a;
                padding-bottom: 4px;
                transition: all 0.3s ease;
            }
            
            .arrow-icon {
                width: 14px;
                height: 14px;
                transition: transform 0.3s ease;
            }
            
            .luxury-card:hover .arrow-icon {
                transform: translateX(4px);
            }
            
            .luxury-card:hover .card-cta {
                gap: 12px;
            }
            
            /* ============ EMPTY STATE ============ */
            .empty-state {
                grid-column: 1 / -1;
                text-align: center;
                padding: 80px 20px;
                color: #ccc;
            }
            
            .empty-icon {
                width: 48px;
                height: 48px;
                margin-bottom: 16px;
            }
            
            .empty-state p {
                font-size: 14px;
                letter-spacing: 1px;
                text-transform: uppercase;
            }
            
            /* ============ RESPONSIVE ============ */
            @media (max-width: 768px) {
                .showcase-header {
                    padding: 60px 20px 40px;
                }
                
                .showcase-tabs {
                    padding-bottom: 30px;
                }
                
                .tabs-container {
                    margin: 0 20px;
                }
                
                .tab-btn {
                    padding: 12px 24px;
                    font-size: 12px;
                }
                
                .card-info {
                    padding: 16px 12px 24px;
                }
                
                .card-badge {
                    top: 8px;
                    left: 8px;
                    padding: 4px 8px;
                    font-size: 9px;
                }
            }
            
            @media (max-width: 480px) {
                #categoryshow-dynamic-grid {
                    grid-template-columns: repeat(2, 1fr);
                }
                
                .header-title {
                    font-size: 20px;
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
// Initialize
// ============================================================
function initCategoryShowcase() {
    console.log('[CategoryShowcase] Initializing luxury showcase...');
    
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
        window.addEventListener('jayenware:dataLoaded', () => {
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
