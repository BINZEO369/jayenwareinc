// ============================================================
// JAYENWARE HOME CATEGORY SHOWCASE COMPONENT
// Prada-style Minimalist Layout Implementation
// ============================================================

class HomeCategoryShowcase {
    constructor() {
        this.config = {
            apiEndpoint: '/api/home-showcase/complete',
            containerId: 'categoryshow-container',
            skeletonId: 'categoryshow-skeleton',
            gridClass: 'showcase-grid',
            itemsPerRow: {
                mobile: 2,
                tablet: 2,
                desktop: 4 // Changed to 4 for desktop to match clean layout
            }
        };
        
        this.data = {
            header: null,
            menCategories: [],
            womenCategories: []
        };
        
        this.isLoaded = false;
        this.gridElement = null;
        this.init();
    }

    async init() {
        try {
            await this.fetchData();
            if (this.hasData()) {
                this.render();
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
            
            console.log('[CategoryShowcase] Data loaded:', {
                men: this.data.menCategories.length,
                women: this.data.womenCategories.length,
                header: !!this.data.header
            });
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
        
        if (container) {
            container.style.display = 'none';
        }
        if (skeleton) {
            skeleton.classList.add('skeleton-hidden');
            skeleton.classList.remove('skeleton-visible');
        }
    }

    createGridElement() {
        const container = document.getElementById(this.config.containerId);
        if (!container) return null;

        container.innerHTML = '';
        
        const grid = document.createElement('div');
        grid.className = this.config.gridClass;
        grid.id = 'categoryshow-dynamic-grid';
        container.appendChild(grid);
        
        return grid;
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

        // Build header with Tabs
        const headerHTML = this.buildHeaderHTML();
        container.insertAdjacentHTML('afterbegin', headerHTML);

        this.gridElement = this.createGridElement();
        if (!this.gridElement) return;

        const allCategories = [...this.data.menCategories, ...this.data.womenCategories];
        allCategories.sort((a, b) => (a.sort_order || 999) - (b.sort_order || 999));

        if (allCategories.length === 0) {
            this.hide();
            return;
        }

        const cardsHTML = allCategories.map((item, index) => this.buildCardHTML(item, index)).join('');
        this.gridElement.innerHTML = cardsHTML;

        this.injectStyles();
        this.setupTabs();

        // Default filter set to 'women' as seen in the screenshot
        this.filterByGender('women');

        this.isLoaded = true;
    }

    buildHeaderHTML() {
        const header = this.data.header || {};
        const title = header.title || '';
        // Using a default text if subtitle is not provided from API, just like the image
        const subtitle = header.subtitle || 'Essential volumes, natural materials and functional details define the new season, reinterpreting the codes of summer style.';

        return `
        <div class="showcase-header" style="
            text-align: center;
            padding: 30px 15px 10px;
            max-width: 800px;
            margin: 0 auto;
        ">
            ${title ? `<h2 style="font-size: 24px; font-weight: 700; color: #000; margin: 0 0 15px 0;">${title}</h2>` : ''}
            
            <p style="
                font-size: 14px;
                color: #222;
                margin: 0 0 25px 0;
                line-height: 1.5;
                font-family: var(--font-body, 'Inter', sans-serif);
            ">${subtitle}</p>
            
            <!-- Gender Tabs -->
            <div class="gender-tabs" style="display: flex; justify-content: center; gap: 24px; margin-bottom: 20px;">
                <button class="gender-tab active" data-target="women" style="
                    background: none; border: none; border-bottom: 2px solid #000; 
                    padding: 0 0 6px 0; font-size: 14px; font-weight: 600; 
                    color: #000; cursor: pointer; transition: all 0.3s;
                ">Women</button>
                <button class="gender-tab" data-target="men" style="
                    background: none; border: none; border-bottom: 2px solid transparent; 
                    padding: 0 0 6px 0; font-size: 14px; font-weight: 400; 
                    color: #555; cursor: pointer; transition: all 0.3s;
                ">Men</button>
            </div>
        </div>`;
    }

    buildCardHTML(item, index) {
        const cat = item.categories;
        if (!cat) return '';
        
        const catName = cat.name || 'Category';
        const catSlug = cat.slug || this.createSlug(catName);
        const imgSrc = cat.image_url || cat.image || '';
        const gender = item.gender || '';
        
        return `
        <a href="/category/${catSlug}" 
           class="showcase-category-card" 
           data-gender="${gender.toLowerCase()}"
           style="
            display: flex;
            flex-direction: column;
            text-decoration: none;
            -webkit-tap-highlight-color: transparent;
           ">
            
            <div class="image-wrapper" style="
                position: relative;
                aspect-ratio: 4/5;
                background: #f4f4f4; /* Light gray background to match the product backdrop */
                overflow: hidden;
            ">
                ${imgSrc ? `<img src="${imgSrc}" 
                     alt="${catName}" 
                     loading="${index < 4 ? 'eager' : 'lazy'}"
                     onerror="this.style.opacity='0'"
                     style="
                        width: 100%;
                        height: 100%;
                        object-fit: cover; /* Change to 'contain' if products are transparent PNGs */
                        transition: transform 0.5s ease;
                     ">` : ''}
            </div>
            
            <div class="card-content" style="
                padding: 16px 8px;
                text-align: center;
            ">
                <h3 style="
                    font-size: 13px; /* Small font size matching screenshot */
                    font-weight: 700;
                    color: #000;
                    margin: 0;
                    font-family: var(--font-heading, 'Inter', sans-serif);
                    letter-spacing: 0.3px;
                ">${catName}</h3>
                
                ${cat.subtitle ? `<span style="
                    display: block;
                    font-size: 11px;
                    color: #666;
                    margin-top: 4px;
                ">${cat.subtitle}</span>` : ''}
            </div>
        </a>`;
    }

    setupTabs() {
        const tabs = document.querySelectorAll('.gender-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                // Reset all tabs
                tabs.forEach(t => {
                    t.classList.remove('active');
                    t.style.borderBottomColor = 'transparent';
                    t.style.fontWeight = '400';
                    t.style.color = '#555';
                });

                // Activate clicked tab
                const target = e.currentTarget;
                target.classList.add('active');
                target.style.borderBottomColor = '#000';
                target.style.fontWeight = '600';
                target.style.color = '#000';

                // Filter items
                const gender = target.getAttribute('data-target');
                this.filterByGender(gender);
            });
        });
    }

    filterByGender(gender) {
        if (!this.isLoaded || !this.gridElement) return;
        
        const cards = this.gridElement.querySelectorAll('.showcase-category-card');
        let visibleCount = 0;
        
        cards.forEach(card => {
            const cardGender = card.getAttribute('data-gender');
            if (cardGender === gender.toLowerCase()) {
                card.style.display = 'flex';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        // Hide container if no items found for this tab
        const container = document.getElementById(this.config.containerId);
        if (visibleCount === 0) {
            this.gridElement.style.display = 'none';
        } else {
            this.gridElement.style.display = 'grid'; // ensure it's grid, not just visible
        }
    }

    injectStyles() {
        const existingStyles = document.getElementById('showcase-grid-styles');
        if (existingStyles) existingStyles.remove();

        const styles = `
        <style id="showcase-grid-styles">
            #categoryshow-dynamic-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 2px; /* Thin white gap between images like screenshot */
                max-width: 100%;
                margin: 0;
                background: #fff; /* Ensures gap looks white */
            }
            
            @media (min-width: 768px) {
                #categoryshow-dynamic-grid {
                    grid-template-columns: repeat(4, 1fr);
                    gap: 15px; /* Larger gap on desktop for cleaner look */
                    padding: 0 20px;
                }
            }
            
            /* Hover effects */
            @media (hover: hover) {
                #categoryshow-dynamic-grid .showcase-category-card:hover img {
                    transform: scale(1.03);
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
