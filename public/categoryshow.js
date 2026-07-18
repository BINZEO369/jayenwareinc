// ============================================================
// JAYENWARE HOME CATEGORY SHOWCASE COMPONENT
// Premium Minimalist Design (Prada Style)
// Integrated with /api/home-showcase/complete API
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
                desktop: 4
            }
        };
        
        this.data = {
            header: null,
            menCategories: [],
            womenCategories: []
        };
        
        this.isLoaded = false;
        this.gridElement = null;
        this.currentFilter = 'women'; // Default tab based on the image
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
                women: this.data.womenCategories.length
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
        container.innerHTML = headerHTML;

        // Create and append grid
        this.gridElement = document.createElement('div');
        this.gridElement.className = this.config.gridClass;
        this.gridElement.id = 'categoryshow-dynamic-grid';
        container.appendChild(this.gridElement);

        const allCategories = [...this.data.menCategories, ...this.data.womenCategories];
        allCategories.sort((a, b) => (a.sort_order || 999) - (b.sort_order || 999));

        if (allCategories.length === 0) {
            this.hide();
            return;
        }

        const cardsHTML = allCategories.map((item, index) => this.buildCardHTML(item, index)).join('');
        this.gridElement.innerHTML = cardsHTML;

        this.injectStyles();
        this.attachTabListeners();
        
        // Apply initial filter based on available data
        if (this.data.womenCategories.length > 0) {
            this.filterByGender('women');
        } else {
            this.filterByGender('men');
            this.updateTabStyles('men');
        }

        this.isLoaded = true;
    }

    buildHeaderHTML() {
        const header = this.data.header || { 
            subtitle: "Essential volumes, natural materials and functional details define the new season, reinterpreting the codes of summer style." 
        };

        return `
        <div class="showcase-header" style="
            text-align: center;
            padding: 30px 20px 20px;
            max-width: 600px;
            margin: 0 auto;
        ">
            ${header.subtitle ? `<p style="
                font-size: 15px;
                color: #000;
                margin: 0 0 30px 0;
                line-height: 1.5;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            ">${header.subtitle}</p>` : ''}
            
            <div class="category-tabs" style="
                display: flex;
                justify-content: center;
                gap: 30px;
                margin-bottom: 20px;
            ">
                <button class="cat-tab active" data-target="women" style="
                    background: none;
                    border: none;
                    font-size: 15px;
                    font-weight: 600;
                    color: #000;
                    padding: 5px 0;
                    border-bottom: 2px solid #000;
                    cursor: pointer;
                    font-family: inherit;
                ">Women</button>
                <button class="cat-tab" data-target="men" style="
                    background: none;
                    border: none;
                    font-size: 15px;
                    font-weight: 400;
                    color: #666;
                    padding: 5px 0;
                    border-bottom: 2px solid transparent;
                    cursor: pointer;
                    font-family: inherit;
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
           data-index="${index}">
            
            <div class="card-image-wrapper">
                ${imgSrc ? `<img src="${imgSrc}" 
                     alt="${catName}" 
                     loading="${index < 4 ? 'eager' : 'lazy'}">` : ''}
            </div>
            
            <div class="card-title">
                <h3>${catName}</h3>
            </div>
        </a>`;
    }

    injectStyles() {
        const existingStyles = document.getElementById('showcase-grid-styles');
        if (existingStyles) existingStyles.remove();

        const styles = `
        <style id="showcase-grid-styles">
            #categoryshow-dynamic-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 2px;
                max-width: 100%;
                margin: 0;
                background: #fff; /* Creates the white lines between items */
            }
            
            .showcase-category-card {
                text-decoration: none;
                display: block;
                background: #fff;
                -webkit-tap-highlight-color: transparent;
            }
            
            .card-image-wrapper {
                background-color: #f2f2f2; /* Light grey background from screenshot */
                aspect-ratio: 4/5;
                position: relative;
                overflow: hidden;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .card-image-wrapper img {
                width: 100%;
                height: 100%;
                object-fit: cover; /* Change to contain if you want full product visible without cropping */
                object-position: center;
                transition: transform 0.5s ease;
            }
            
            .card-title {
                padding: 18px 10px 24px;
                text-align: center;
            }
            
            .card-title h3 {
                font-size: 14px;
                margin: 0;
                color: #000;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                font-weight: 700;
                letter-spacing: 0.2px;
            }

            @media (min-width: 768px) {
                #categoryshow-dynamic-grid {
                    grid-template-columns: repeat(3, 1fr);
                }
                .card-title h3 {
                    font-size: 16px;
                }
            }
            
            @media (min-width: 1024px) {
                #categoryshow-dynamic-grid {
                    grid-template-columns: repeat(4, 1fr);
                }
            }
            
            @media (hover: hover) {
                .showcase-category-card:hover .card-image-wrapper img {
                    transform: scale(1.03);
                }
            }
        </style>`;

        document.head.insertAdjacentHTML('beforeend', styles);
    }

    attachTabListeners() {
        const tabs = document.querySelectorAll('.cat-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const targetGender = e.target.getAttribute('data-target');
                this.updateTabStyles(targetGender);
                this.filterByGender(targetGender);
            });
        });
    }

    updateTabStyles(activeGender) {
        const tabs = document.querySelectorAll('.cat-tab');
        tabs.forEach(tab => {
            if (tab.getAttribute('data-target') === activeGender) {
                tab.style.fontWeight = '600';
                tab.style.color = '#000';
                tab.style.borderBottom = '2px solid #000';
            } else {
                tab.style.fontWeight = '400';
                tab.style.color = '#666';
                tab.style.borderBottom = '2px solid transparent';
            }
        });
    }

    createSlug(text) {
        if (!text) return '';
        return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-').replace(/^-+|-+$/g, '');
    }

    async refresh() {
        await this.fetchData();
        if (this.hasData()) {
            this.render();
        } else {
            this.hide();
        }
    }

    filterByGender(gender) {
        if (!this.isLoaded || !this.gridElement) return;
        
        const cards = this.gridElement.querySelectorAll('.showcase-category-card');
        
        cards.forEach(card => {
            const cardGender = card.getAttribute('data-gender');
            if (cardGender === gender.toLowerCase()) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
}

// ============================================================
// Initialize Function
// ============================================================
function initCategoryShowcase() {
    const tryInit = () => {
        if (typeof window.currentData !== 'undefined' && window.currentData.products && window.currentData.products.length > 0) {
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
