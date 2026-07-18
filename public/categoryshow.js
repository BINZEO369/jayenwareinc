// ============================================================
// JAYENWARE HOME CATEGORY SHOWCASE COMPONENT (PRADA STYLE)
// Integrated with /api/home-showcase/complete API
// Fonts powered by JABIYEN_FONTS configuration
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
        
        // Ensure JABIYEN_FONTS CSS variables are injected first
        this.injectFontVariables();
        
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

        // 5. Inject Component Styles
        this.injectStyles();

        this.isLoaded = true;
        console.log('[CategoryShowcase] Rendered successfully');
    }

    /**
     * Inject JABIYEN_FONTS CSS variables into :root if not already present
     */
    injectFontVariables() {
        // Check if JABIYEN_FONTS exists globally
        if (typeof window.JABIYEN_FONTS !== 'undefined') {
            const root = document.documentElement;
            const vars = window.JABIYEN_FONTS.cssVariables;
            for (const [key, value] of Object.entries(vars)) {
                // Only set if not already defined
                if (!root.style.getPropertyValue(key)) {
                    root.style.setProperty(key, value);
                }
            }
        }
    }

    buildHeaderHTML() {
        const header = this.data.header;
        if (!header) return '';

        return `
        <div class="showcase-header">
            ${header.title ? `<h2 class="showcase-header-title">${header.title}</h2>` : ''}
            
            ${header.subtitle ? `<p class="showcase-header-subtitle">${header.subtitle}</p>` : ''}
        </div>`;
    }

    buildTabsHTML() {
        return `
        <div class="showcase-tabs">
            <button class="tab-btn" data-gender="women">Women</button>
            <button class="tab-btn" data-gender="men">Men</button>
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
            this.gridElement.innerHTML = `<div style="text-align:center; padding:40px; color:#86868b; font-family: var(--font-body, sans-serif);">No categories found</div>`;
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
        
        return `
        <a href="/category/${catSlug}" 
           class="showcase-category-card">
            
            <div class="card-image-wrapper">
                ${imgSrc ? `<img src="${imgSrc}" 
                     alt="${catName}" 
                     loading="${index < 4 ? 'eager' : 'lazy'}"
                     onerror="this.style.display='none'"
                     class="card-image">` : ''}
            </div>
            
            <div class="card-content">
                <h3 class="card-category-title">${catName}</h3>
            </div>
        </a>`;
    }

    injectStyles() {
        const existingStyles = document.getElementById('showcase-grid-styles');
        if (existingStyles) existingStyles.remove();

        const styles = `
        <style id="showcase-grid-styles">
            /* ============================================
               HEADER STYLES
               ============================================ */
            .showcase-header {
                text-align: center;
                padding: 40px 20px 20px;
                max-width: 800px;
                margin: 0 auto;
            }
            
            .showcase-header-title {
                font-family: var(--font-heading, 'Manrope', sans-serif);
                font-weight: 600;
                font-size: clamp(14px, 2vw, 16px);
                color: #1d1d1f;
                margin: 0 0 6px 0;
                letter-spacing: var(--tracking-tight, -0.5px);
            }
            
            .showcase-header-subtitle {
                font-family: var(--font-body, 'Inter', sans-serif);
                font-weight: 400;
                font-size: clamp(10px, 1.2vw, 11px);
                color: #86868b;
                margin: 0;
                line-height: 1.4;
            }
            
            /* ============================================
               TABS STYLES
               ============================================ */
            .showcase-tabs {
                display: flex;
                justify-content: center;
                gap: 30px;
                padding: 20px 0 30px;
                border-bottom: 1px solid #e5e5e5;
                margin: 0 20px 0;
            }
            
            .tab-btn {
                background: none;
                border: none;
                font-size: 16px;
                font-weight: 500;
                color: #86868b;
                cursor: pointer;
                padding: 0 0 8px 0;
                position: relative;
                font-family: var(--font-body, 'Inter', sans-serif);
                transition: color 0.3s ease;
                letter-spacing: var(--tracking-normal, 0);
            }
            
            /* ============================================
               GRID CONTAINER
               ============================================ */
            #categoryshow-dynamic-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 1px;
                max-width: 100%;
                margin: 0;
                background: #ffffff;
                padding: 0;
            }
            
            /* ============================================
               CARD STYLES
               ============================================ */
            .showcase-category-card {
                position: relative;
                display: flex;
                flex-direction: column;
                text-decoration: none;
                background: #ffffff;
                cursor: pointer;
                -webkit-tap-highlight-color: transparent;
                border: none;
                transition: opacity 0.3s ease;
            }
            
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
            }
            
            .card-content {
                padding: 16px 0 24px 0;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                text-align: center;
                background: #ffffff;
            }
            
            .card-category-title {
                font-family: var(--font-heading, 'Manrope', sans-serif);
                font-weight: 500;
                font-size: clamp(15px, 2vw, 18px);
                line-height: 1.2;
                margin: 0;
                color: #1d1d1f;
                letter-spacing: var(--tracking-tight, -0.5px);
                background: transparent;
                text-shadow: none;
            }
            
            /* ============================================
               RESPONSIVE STYLES
               ============================================ */
            @media (max-width: 767px) {
                .showcase-tabs {
                    gap: 20px;
                }
                
                .tab-btn {
                    font-size: 14px;
                }
                
                #categoryshow-dynamic-grid {
                    gap: 1px;
                }
                
                .card-content {
                    padding: 12px 0 20px 0;
                }
                
                .card-category-title {
                    font-size: clamp(13px, 3vw, 16px);
                }
            }
            
            /* ============================================
               HOVER & ACTIVE STATES
               ============================================ */
            @media (hover: hover) {
                .showcase-category-card:hover {
                    opacity: 0.9;
                }
                .showcase-category-card:hover .card-image {
                    transform: scale(1.02);
                    transition: transform 0.4s ease;
                }
            }
            
            .showcase-category-card:active {
                opacity: 0.8;
                transition: opacity 0.1s ease;
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
// JABIYEN FONTS CONFIGURATION
// Centralized font management for the entire website
// ============================================================

const JABIYEN_FONTS = {
    // Google Fonts Family Names (CSS value)
    families: {
        // Main heading font - Titles, hero text, section headers
        heading: "'Manrope', sans-serif",
        
        // Subtitle font - Secondary headings
        subtitle: "'Sora', sans-serif",
        
        // Body/Description font - Paragraphs, descriptions, buttons, prices
        body: "'Inter', sans-serif"
    },

    // Font weights mapping for each font family
    weights: {
        heading: {
            regular: 400,
            medium: 500,
            semibold: 600,
            bold: 700,
            extrabold: 800
        },
        subtitle: {
            regular: 400,
            medium: 500,
            semibold: 600,
            bold: 700,
            extrabold: 800
        },
        body: {
            light: 300,
            regular: 400,
            medium: 500,
            semibold: 600,
            bold: 700,
            extrabold: 800,
            black: 900
        }
    },

    // CSS Variables injected into :root
    cssVariables: {
        // Font families
        '--font-heading': "'Manrope', sans-serif",
        '--font-subtitle': "'Sora', sans-serif",
        '--font-body': "'Inter', sans-serif",
        '--font-accent': "'Inter', sans-serif",
        
        // Font size scale
        '--text-xs': '0.75rem',     // 12px
        '--text-sm': '0.875rem',    // 14px
        '--text-base': '1rem',       // 16px
        '--text-lg': '1.125rem',    // 18px
        '--text-xl': '1.25rem',     // 20px
        '--text-2xl': '1.5rem',     // 24px
        '--text-3xl': '1.875rem',   // 30px
        '--text-4xl': '2.25rem',    // 36px
        '--text-5xl': '3rem',       // 48px
        
        // Letter spacing
        '--tracking-tight': '-0.5px',
        '--tracking-normal': '0',
        '--tracking-wide': '0.5px',
        '--tracking-wider': '1px',
        '--tracking-widest': '1.5px'
    },

    // Tailwind CSS font configuration
    tailwindConfig: {
        fontFamily: {
            sans: ["'Inter', 'sans-serif'"],
            serif: ["'Manrope', 'sans-serif'"],
            mono: ["'Sora', 'sans-serif'"]
        }
    },

    // Google Fonts URL (auto-generated with all three fonts)
    get googleFontsURL() {
        const manrope = 'Manrope:wght@400;500;600;700;800';
        const sora = 'Sora:wght@400;500;600;700;800';
        const inter = 'Inter:wght@300;400;500;600;700;800;900';
        return `https://fonts.googleapis.com/css2?family=${manrope}&family=${sora}&family=${inter}&display=swap`;
    },

    // CSS text styles for consistent typography
    styles: {
        heroTitle: {
            fontFamily: 'var(--font-heading)',
            fontWeight: 800,
            fontSize: 'var(--text-5xl)',
            letterSpacing: 'var(--tracking-tight)'
        },
        sectionTitle: {
            fontFamily: 'var(--font-heading)',
            fontWeight: 700,
            fontSize: 'var(--text-3xl)',
            letterSpacing: 'var(--tracking-tight)'
        },
        sectionSubtitle: {
            fontFamily: 'var(--font-subtitle)',
            fontWeight: 600,
            fontSize: 'var(--text-xl)',
            letterSpacing: 'var(--tracking-normal)'
        },
        cardTitle: {
            fontFamily: 'var(--font-subtitle)',
            fontWeight: 500,
            fontSize: 'var(--text-sm)',
            letterSpacing: 'var(--tracking-normal)'
        },
        description: {
            fontFamily: 'var(--font-body)',
            fontWeight: 400,
            fontSize: 'var(--text-base)',
            letterSpacing: 'var(--tracking-normal)',
            lineHeight: '1.6'
        },
        smallText: {
            fontFamily: 'var(--font-body)',
            fontWeight: 500,
            fontSize: 'var(--text-xs)',
            letterSpacing: 'var(--tracking-wide)'
        },
        button: {
            fontFamily: 'var(--font-body)',
            fontWeight: 600,
            fontSize: 'var(--text-xs)',
            letterSpacing: 'var(--tracking-wider)',
            textTransform: 'uppercase'
        },
        price: {
            fontFamily: 'var(--font-body)',
            fontWeight: 600,
            fontSize: 'var(--text-sm)'
        },
        badge: {
            fontFamily: 'var(--font-subtitle)',
            fontWeight: 600,
            fontSize: '0.625rem',
            letterSpacing: 'var(--tracking-wide)',
            textTransform: 'uppercase'
        }
    }
};

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { HomeCategoryShowcase, JABIYEN_FONTS, initCategoryShowcase };
}

// Auto-initialize when loaded in browser
if (typeof window !== 'undefined') {
    window.JABIYEN_FONTS = JABIYEN_FONTS;
    
    // Apply CSS variables to :root
    document.addEventListener('DOMContentLoaded', () => {
        const root = document.documentElement;
        const vars = JABIYEN_FONTS.cssVariables;
        for (const [key, value] of Object.entries(vars)) {
            root.style.setProperty(key, value);
        }
        
        console.log('✅ JABIYEN Fonts Loaded:');
        console.log('  📝 Headings:', JABIYEN_FONTS.families.heading);
        console.log('  📝 Subtitles:', JABIYEN_FONTS.families.subtitle);
        console.log('  📝 Body/Description:', JABIYEN_FONTS.families.body);
    });
}

// ============================================================
// Initialize Function
// ============================================================
function initCategoryShowcase() {
    console.log('[CategoryShowcase] Initializing...');
    
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
    module.exports = { HomeCategoryShowcase, JABIYEN_FONTS, initCategoryShowcase };
}
