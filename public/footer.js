// ============================================================================
// footer.js - Professional Premium Footer Component
// Version: 2.2 (Enhanced UI/UX & Visibility Fixes)
// Brand: JABIYEN (Premium Apparel)
// ============================================================================

function injectFooterStyles() {
    if (document.getElementById("footer-components-style")) return;

    const styles = `
    <style id="footer-components-style">
        /* ==================== BASE FOOTER STYLES ==================== */
        #main-footer {
            font-family: var(--font-body, 'Inter', system-ui, sans-serif);
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            position: relative;
            z-index: 9999; /* Ensure it stays on top */
            background-color: var(--footer-bg, #0a0a0a);
            color: var(--footer-text, #f0f0f0);
            line-height: 1.6;
            width: 100%;
            box-sizing: border-box;
        }
        
        #main-footer * {
            box-sizing: border-box;
        }
        
        #main-footer a {
            color: inherit;
            text-decoration: none;
            transition: color 0.3s ease, opacity 0.3s ease;
        }
        
        #main-footer a:hover {
            color: #ffffff;
            opacity: 1;
        }

        /* ==================== MAIN GRID ==================== */
        .footer-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 40px;
            padding-bottom: 40px;
        }
        
        @media (min-width: 768px) {
            .footer-grid {
                grid-template-columns: repeat(2, 1fr);
            }
        }
        
        @media (min-width: 1024px) {
            .footer-grid {
                grid-template-columns: 2fr 1.5fr 1.5fr 2fr;
                gap: 50px;
            }
        }

        /* ==================== 1. BRAND & CONTENT ==================== */
        .footer-brand-logo {
            max-width: 150px;
            margin-bottom: 20px;
            border-radius: 4px;
            display: block;
            background: rgba(255,255,255,0.05);
            padding: 5px;
        }
        
        .footer-brand-title {
            font-family: var(--font-heading, 'Manrope', sans-serif);
            font-size: 1.6rem;
            font-weight: 800;
            letter-spacing: 0.05em;
            margin-bottom: 12px;
            text-transform: uppercase;
            color: #ffffff;
        }
        
        .footer-brand-desc {
            font-size: 0.9rem;
            opacity: 0.8;
            margin-bottom: 24px;
            max-width: 320px;
            line-height: 1.7;
        }

        /* ==================== 2. SOCIAL LINKS ==================== */
        .social-icons-grid {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            margin-bottom: 24px;
        }
        
        .social-icon-link {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 42px;
            height: 42px;
            border-radius: 10px;
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.15);
            color: #ffffff;
            transition: all 0.3s ease;
        }
        
        .social-icon-link:hover {
            background: rgba(255, 255, 255, 0.2);
            transform: translateY(-3px);
            border-color: rgba(255, 255, 255, 0.4);
        }
        
        .social-icon-link svg, .social-icon-link img {
            width: 20px;
            height: 20px;
            object-fit: contain;
        }

        /* ==================== 3 & 4. MENUS ==================== */
        .footer-section-title {
            font-family: var(--font-heading, 'Manrope', sans-serif);
            font-size: 1rem;
            font-weight: 700;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            margin-bottom: 24px;
            color: #ffffff;
            position: relative;
            padding-bottom: 8px;
        }
        
        .footer-section-title::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 40px;
            height: 3px;
            background: #ffffff;
            opacity: 0.5;
            border-radius: 2px;
        }

        .footer-links-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        
        .footer-links-list > li {
            margin-bottom: 16px;
            font-size: 0.95rem;
            opacity: 0.85;
        }
        
        .footer-link-desc {
            display: block;
            font-size: 0.8rem;
            opacity: 0.6;
            margin-top: 4px;
            font-style: italic;
        }

        /* ==================== 8. APP LINKS ==================== */
        .footer-app-grid {
            display: flex;
            flex-direction: column;
            gap: 12px;
            margin-bottom: 24px;
        }
        
        .footer-app-btn {
            display: inline-flex;
            align-items: center;
            gap: 12px;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            padding: 12px 20px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 0.9rem;
            width: fit-content;
            color: #fff;
        }
        
        .footer-app-btn:hover { background: rgba(255, 255, 255, 0.2); }

        /* ==================== 9. COUNTRY SELECTOR (REDESIGNED) ==================== */
        .footer-country-wrapper {
            background: rgba(255, 255, 255, 0.03);
            padding: 16px;
            border-radius: 12px;
            border: 1px solid rgba(255, 255, 255, 0.15);
            margin-top: 24px;
            display: block;
            width: 100%;
            max-width: 100%;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .footer-country-label {
            display: block;
            font-size: 0.85rem;
            font-weight: 600;
            color: #aaaaaa;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        
        .footer-country-select {
            width: 100%;
            appearance: none; /* Removes default browser styling */
            -webkit-appearance: none;
            -moz-appearance: none;
            background-color: rgba(0, 0, 0, 0.5);
            color: #ffffff;
            border: 1px solid rgba(255, 255, 255, 0.3);
            padding: 12px 16px;
            padding-right: 40px;
            border-radius: 8px;
            font-size: 0.95rem;
            font-weight: 500;
            outline: none;
            margin-bottom: 12px;
            cursor: pointer;
            /* Custom dropdown arrow */
            background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23FFFFFF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
            background-repeat: no-repeat;
            background-position: right 16px top 50%;
            background-size: 12px auto;
            transition: border-color 0.3s;
        }
        
        .footer-country-select:focus, .footer-country-select:hover {
            border-color: #ffffff;
            background-color: rgba(0, 0, 0, 0.8);
        }
        
        .footer-country-select option { 
            background-color: #1a1a1a; 
            color: #ffffff; 
            padding: 12px;
            font-size: 1rem;
        }
        
        .footer-exchange-rate { 
            font-size: 0.85rem; 
            color: #4ade80; /* Light green for better visibility */
            display: flex;
            align-items: center;
            gap: 8px;
            background: rgba(74, 222, 128, 0.1);
            padding: 8px 12px;
            border-radius: 6px;
            border: 1px solid rgba(74, 222, 128, 0.2);
        }

        /* ==================== 11. BOTTOM BAR ==================== */
        .footer-bottom-bar {
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            padding-top: 24px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;
            gap: 16px;
            font-size: 0.85rem;
            opacity: 0.7;
        }
        
        @media (min-width: 768px) {
            .footer-bottom-bar { flex-direction: row; }
        }
    </style>
    `;
    document.head.insertAdjacentHTML('beforeend', styles);
}

function getSocialIconHTML(platform, link) {
    // [Keep the same SVG functions you already have here]
    const icons = {
        'facebook': `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 2H15C13.6739 2 12.4021 2.52678 11.4645 3.46447C10.5268 4.40215 10 5.67392 10 7V10H7V14H10V22H14V14H17L18 10H14V7C14 6.73478 14.1054 6.48043 14.2929 6.29289C14.4804 6.10536 14.7348 6 15 6H18V2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
        // ... (other icons omitted for brevity, use your existing ones) ...
    };
    return icons[platform] || '🌐';
}

async function renderFooter() {
    if (document.getElementById('main-footer')) return;
    
    injectFooterStyles();

    try {
        const response = await fetch('/api/footer/complete');
        if (!response.ok) throw new Error('Footer API response failed');
        const footerData = await response.json();
        
        const { 
            content = [], socialLinks = [], menus = [], paymentMethods = [], 
            shippingPartners = [], certifications = [], appLinks = [], 
            countries = [], trustBadges = [], settings = {} 
        } = footerData;
        
        const bgColor = settings.background_color || '#0a0a0a';
        const textColor = settings.text_color || '#f0f0f0';
        
        const brand = content.find(c => c.section_name === 'brand') || {};

        // --- Table 9: Country Selector (HIGH VISIBILITY LOGIC) ---
        let countryHTML = '';
        let dirAttribute = 'ltr';
        
        if (countries && Array.isArray(countries) && countries.length > 0) {
            const defaultCountry = countries.find(c => c.is_default) || countries[0];
            if (defaultCountry && defaultCountry.is_rtl) dirAttribute = 'rtl';
            
            let exchangeRateHTML = '';
            if (defaultCountry && defaultCountry.exchange_rate && defaultCountry.exchange_rate != 1) {
                const symbol = defaultCountry.currency_symbol || defaultCountry.currency_code || '';
                exchangeRateHTML = `<div class="footer-exchange-rate"><span>💱</span> 1 USD = ${symbol}${defaultCountry.exchange_rate}</div>`;
            }
            
            // Build the select box with explicit visible styling
            countryHTML = `
            <div class="footer-country-wrapper">
                <span class="footer-country-label">Regional Settings</span>
                <select class="footer-country-select" onchange="window.location.href=this.value">
                    ${countries.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)).map(c => {
                        const code = c.country_code || '';
                        const name = c.country_name || 'Unknown Region';
                        const currency = c.currency_code || '';
                        const symbol = c.currency_symbol || '';
                        const lang = c.language_name ? ` | ${c.language_name}` : '';
                        
                        return `
                        <option value="?country=${code}&lang=${c.language_code || ''}" ${c.is_default ? 'selected' : ''}>
                            ${name} - ${currency} (${symbol})${lang}
                        </option>`;
                    }).join('')}
                </select>
                ${exchangeRateHTML}
            </div>`;
        } else {
            console.warn("Country data is empty or not in the expected array format.", countries);
        }

        // --- Other Sections (Menus, Apps, Socials) ---
        // (Build menusHTML, socialsHTML, appsHTML exactly like before)
        
        const footerHTML = `
        <footer id="main-footer" style="--footer-bg: ${bgColor}; --footer-text: ${textColor}; padding: 60px 5% 30px;" dir="${dirAttribute}">
            <div style="width: 100%; max-width: 1400px; margin: 0 auto;">
                <div class="footer-grid">
                    
                    <!-- Column 1: Brand & Country -->
                    <div>
                        ${brand.title ? `<h4 class="footer-brand-title">${brand.title}</h4>` : ''}
                        <p class="footer-brand-desc">${brand.description || 'Welcome to our platform.'}</p>
                        ${countryHTML} <!-- COUNTRY SELECTOR INJECTED HERE -->
                    </div>
                    
                    <!-- Other columns omitted for focus, add your menu generators here -->
                    
                </div>
                
                <div class="footer-bottom-bar">
                    <p>Powered by <a href="https://binzeo.vercel.app" target="_blank" style="color: #fff; font-weight: bold;">BINZEO Infrastructure</a></p>
                    <p>© JayenWare. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
        `;
        
        document.body.insertAdjacentHTML('beforeend', footerHTML);
        
    } catch (error) {
        console.error('Footer API Error:', error);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderFooter);
} else {
    setTimeout(renderFooter, 100);
}
