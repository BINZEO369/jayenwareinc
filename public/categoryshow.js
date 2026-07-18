// ============================================================
// JAYENWARE HOME CATEGORY SHOWCASE COMPONENT (PRADA STYLE)
// Integrated with /api/home-showcase/complete API
// Updated with JABIYEN FONTS configuration
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
        this.gridElement = null;
        this.currentGender = 'women'; // Default to Women tab
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

        // Show container, hide skeleton
        container.style.display = 'block';
        if (skeleton) {
            skeleton.classList.add('skeleton-hidden');
            skeleton.classList.remove('skeleton-visible');
        }

        container.innerHTML = '';
        
        // 1. Build Header
        if (this.data.header) {
            const headerHTML = this.buildHeaderHTML();
            container.insertAdjacentHTML('beforeend', headerHTML);
        }

        // 2. Build Tabs (Men / Women)
        const tabsHTML = this.buildTabsHTML();
        container.insertAdjacentHTML('beforeend', tabsHTML);

        // 3. Create Grid
        this.gridElement = document.createElement('div');
        this.gridElement.className = this.config.gridClass;
        this.gridElement.id = 'categoryshow-dynamic-grid';
        container.appendChild(this.gridElement);

        // 4. Render initial grid (Women by default)
        this.renderGrid('women');

        // 5. Inject Styles
        this.injectStyles();

        this.isLoaded = true;
        console.log('[CategoryShowcase] Rendered successfully');
    }

    buildHeaderHTML() {
        const header = this.data.header;
        if (!header) return '';

        // Using JABIYEN_FONTS configuration
        const fonts = window.JABIYEN_FONTS;
        
        return `
        <div class="showcase-header" style="
            text-align: center;
            padding: 40px 20px 20px;
            max-width: 800px;
            margin: 0 auto;
        ">
            ${header.title ? `<h2 style="
                font-family: ${fonts ? fonts.families.heading : 'var(--font-heading, sans-serif)'};
                font-weight: ${fonts ? fonts.weights.heading.medium : '500'};
                font-size: clamp(14px, 2vw, 16px);
                color: #1d1d1f;
                margin: 0 0 6px 0;
                letter-spacing: var(--tracking-tight, -0.5px);
            ">${header.title}</h2>` : ''}
            
            ${header.subtitle ? `<p style="
                font-family: ${fonts ? fonts.families.body : 'var(--font-body, sans-serif)'};
                font-weight: ${fonts ? fonts.weights.body.regular : '400'};
                font-size: clamp(10px, 1.2vw, 11px);
                color: #86868b;
                margin: 0;
                line-height: 1.4;
            ">${header.subtitle}</p>` : ''}
        </div>`;
    }

    buildTabsHTML() {
        const fonts = window.JABIYEN_FONTS;
        
        return `
        <div class="showcase-tabs" style="
            display: flex;
            justify-content: center;
            gap: 30px;
            padding: 20px 0 30px;
            border-bottom: 1px solid #e5e5e5;
            margin: 0 20px 0;
        ">
            <button class="tab-btn" data-gender="women" style="
                background: none;
                border: none;
                font-family: ${fonts ? fonts.families.body : 'var(--font-body, sans-serif)'};
                font-weight: ${fonts ? fonts.weights.body.medium : '500'};
                font-size: 16px;
                color: #86868b;
                cursor: pointer;
                padding: 0 0 8px 0;
                position: relative;
                transition: color 0.3s ease;
            ">Women</button>
            <button class="tab-btn" data-gender="men" style="
                background: none;
                border: none;
                font-family: ${fonts ? fonts.families.body : 'var(--font-body, sans-serif)'};
                font-weight: ${fonts ? fonts.weights.body.medium : '500'};
                font-size: 16px;
                color: #86868b;
                cursor: pointer;
                padding: 0 0 8px 0;
                position: relative;
                transition: color 0.3s ease;
            ">Men</button>
        </div>`;
    }

    setupTabs() {
        const tabs = document.querySelectorAll('.tab-btn');
        const self = this;

        // Set initial active state (Women)
        const initialTab = document.querySelector('.tab-btn[data-gender="women"]');
        if (initialTab) self.setActiveTab(initialTab);

        tabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const gender = this.getAttribute('data-gender');
                self.currentGender = gender;
                self.renderGrid(gender);
                self.setActiveTab(this);
            });
        });
    }

    setActiveTab(activeTab) {
        const tabs = document.querySelectorAll('.tab-btn');
        tabs.forEach(t => {
            t.style.color = '#86868b';
            t.style.borderBottom = 'none';
        });
        
        activeTab.style.color = '#1d1d1f';
        activeTab.style.borderBottom = '2px solid #1d1d1f';
    }

    renderGrid(gender) {
        if (!this.gridElement) return;
        
        let categories = [];
        if (gender === 'men') {
            categories = this.data.menCategories || [];
        } else {
            categories = this.data.womenCategories || [];
        }

        // Sort by sort_order
        categories.sort((a, b) => (a.sort_order || 999) - (b.sort_order || 999));

        if (categories.length === 0) {
            this.gridElement.innerHTML = `<div style="text-align:center; padding:40px; color:#86868b;">No categories found</div>`;
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
        const fonts = window.JABIYEN_FONTS;
        
        return `
        <a href="/category/${catSlug}" 
           class="showcase-category-card"
           style="
            position: relative;
            display: flex;
            flex-direction: column;
            text-decoration: none;
            background: #ffffff;
            cursor: pointer;
            -webkit-tap-highlight-color: transparent;
           ">
            
            <div class="card-image-wrapper" style="
                position: relative;
                width: 100%;
                aspect-ratio: 3/4;
                overflow: hidden;
                background: #f5f5f7;
            ">
                ${imgSrc ? `<img src="${imgSrc}" 
                     alt="${catName}" 
                     loading="${index < 4 ? 'eager' : 'lazy'}"
                     onerror="this.style.display='none'"
                     style="
                        position: absolute;
                        inset: 0;
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                     ">` : ''}
            </div>
            
            <div class="card-content" style="
                padding: 16px 0 24px 0;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                text-align: center;
                background: #ffffff;
            ">
                
                <h3 style="
                    font-family: ${fonts ? fonts.families.heading : 'var(--font-heading, sans-serif)'};
                    font-weight: ${fonts ? fonts.weights.heading.medium : '500'};
                    font-size: clamp(15px, 2vw, 18px);
                    line-height: 1.2;
                    margin: 0;
                    color: #1d1d1f;
                    letter-spacing: var(--tracking-tight, -0.5px);
                ">${catName}</h3>
                
            </div>
        </a>`;
    }

    injectStyles() {
        const existingStyles = document.getElementById('showcase-grid-styles');
        if (existingStyles) existingStyles.remove();

        const fonts = window.JABIYEN_FONTS;
        
        const styles = `
        <style id="showcase-grid-styles">
            /* CSS Variables from JABIYEN FONTS */
            :root {
                ${fonts ? Object.entries(fonts.cssVariables).map(([key, value]) => `${key}: ${value};`).join('\n                ') : ''}
            }
            
            /* Grid Container - White background with gap showing through */
            #categoryshow-dynamic-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 1px; /* Very thin gap between images */
                max-width: 100%;
                margin: 0;
                background: #ffffff; /* White background shows through the thin gap */
                padding: 0; /* No padding on sides */
            }
            
            /* Individual Card Styling */
            .showcase-category-card {
                border: none;
                transition: opacity 0.3s ease;
                background: #ffffff;
                font-family: ${fonts ? fonts.families.body : 'var(--font-body, sans-serif)'};
            }
            
            /* Card Text Styling */
            .showcase-category-card h3 {
                background: transparent;
                text-shadow: none;
                font-family: ${fonts ? fonts.families.heading : 'var(--font-heading, sans-serif)'} !important;
            }
            
            /* Image wrapper - image stays within its boundaries */
            .card-image-wrapper {
                background: #f5f5f7;
            }
            
            /* Typography Classes */
            .text-heading {
                font-family: ${fonts ? fonts.families.heading : 'var(--font-heading, sans-serif)'};
            }
            
            .text-subtitle {
                font-family: ${fonts ? fonts.families.subtitle : 'var(--font-subtitle, sans-serif)'};
            }
            
            .text-body {
                font-family: ${fonts ? fonts.families.body : 'var(--font-body, sans-serif)'};
            }

            /* Responsive adjustments */
            @media (max-width: 767px) {
                .showcase-tabs {
                    gap: 20px !important;
                }
                .tab-btn {
                    font-size: 14px !important;
                }
                #categoryshow-dynamic-grid {
                    gap: 1px; /* Same thin gap on mobile */
                }
                .card-content {
                    padding: 12px 0 20px 0 !important;
                }
            }

            /* Hover effect - Subtle opacity only (Prada style) */
            @media (hover: hover) {
                .showcase-category-card:hover {
                    opacity: 0.9;
                }
                .showcase-category-card:hover .card-image-wrapper img {
                    transform: scale(1.02);
                    transition: transform 0.4s ease;
                }
            }
            
            /* Active/Tap effect */
            .showcase-category-card:active {
                opacity: 0.8;
                transition: opacity 0.1s ease;
            }
            
            /* Font Awesome Icons (if used) */
            .fas, .far, .fab {
                font-family: "Font Awesome 6 Free" !important;
            }
        </style>`;

        document.head.insertAdjacentHTML('beforeend', styles);
        
        // Apply CSS variables to :root if not already done
        if (fonts) {
            const root = document.documentElement;
            const vars = fonts.cssVariables;
            for (const [key, value] of Object.entries(vars)) {
                if (!root.style.getPropertyValue(key)) {
                    root.style.setProperty(key, value);
                }
            }
        }
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
// Initialize Function with Font Loading
// ============================================================
function initCategoryShowcase() {
    console.log('[CategoryShowcase] Initializing...');
    
    // Load Google Fonts if JABIYEN_FONTS exists
    if (window.JABIYEN_FONTS && window.JABIYEN_FONTS.googleFontsURL) {
        const linkElement = document.createElement('link');
        linkElement.rel = 'stylesheet';
        linkElement.href = window.JABIYEN_FONTS.googleFontsURL;
        linkElement.media = 'print';
        linkElement.onload = function() {
            this.media = 'all';
            console.log('✅ Google Fonts loaded via CategoryShowcase');
        };
        document.head.appendChild(linkElement);
    }
    
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
// Font Configuration Integration
// ============================================================
if (typeof window !== 'undefined' && window.JABIYEN_FONTS) {
    // Add font loading observer
    if ('fonts' in document) {
        Promise.all([
            document.fonts.load('1em Manrope'),
            document.fonts.load('1em Sora'),
            document.fonts.load('1em Inter')
        ]).then(() => {
            console.log(' All JABIYEN Fonts loaded and ready');
        }).catch(err => {
            console.warn(' Font loading issue:', err);
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
