// ============================================================================
// footer.js - Professional Premium Footer Component
// Version: 2.3 (World-Class Global Design & Measurement Architecture)
// Brand: JABIYEN (Premium Apparel)
// ============================================================================

function injectFooterStyles() {
    if (document.getElementById("footer-components-style")) return;

    const styles = `
    <style id="footer-components-style">
        /* ==================== GLOBAL DESIGN SYSTEM ==================== */
        #main-footer {
            font-family: var(--font-body, 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif);
            border-top: 1px solid rgba(255, 255, 255, 0.06);
            position: relative;
            z-index: 10;
            background-color: var(--footer-bg, #0d0d0d);
            color: var(--footer-text, #a3a3a3);
            line-height: 1.6;
            width: 100%;
            -webkit-font-smoothing: antialiased;
            box-sizing: border-box;
        }

        #main-footer *, #main-footer *::before, #main-footer *::after {
            box-sizing: border-box;
        }
        
        #main-footer a {
            color: inherit;
            text-decoration: none;
            transition: color 0.25s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease;
            display: inline-block;
        }
        
        #main-footer a:hover {
            color: #ffffff;
            opacity: 1;
        }

        .footer-container {
            width: 100%;
            max-width: 1320px;
            margin: 0 auto;
            padding: 80px 24px 32px 24px;
        }

        @media (max-width: 768px) {
            .footer-container {
                padding: 48px 20px 24px 20px;
            }
        }

        /* ==================== RESPONSIVE GLOBAL GRID ==================== */
        .footer-grid {
            display: grid;
            grid-template-columns: 1.2fr 0.8fr 0.8fr 1.2fr;
            gap: 40px;
            padding-bottom: 60px;
        }
        
        @media (max-width: 1024px) {
            .footer-grid {
                grid-template-columns: repeat(2, 1fr);
                gap: 40px;
            }
        }
        
        @media (max-width: 576px) {
            .footer-grid {
                grid-template-columns: 1fr;
                gap: 36px;
            }
        }

        /* ==================== 1. BRAND IDENTITY & MEASUREMENTS ==================== */
        .footer-brand-container {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }

        .footer-brand-logo {
            /* গ্লোবাল স্ট্যান্ডার্ড ব্র্যান্ড লোগো সাইজ */
            width: 160px; 
            height: auto;
            max-height: 50px;
            display: block;
            object-fit: contain;
            filter: brightness(1);
        }
        
        .footer-brand-title {
            font-family: var(--font-heading, 'Manrope', sans-serif);
            font-size: 1.5rem;
            font-weight: 800;
            letter-spacing: 0.06em;
            margin: 0;
            text-transform: uppercase;
            color: #ffffff;
        }
        
        .footer-brand-desc {
            font-size: 0.9rem;
            color: #8e8e93;
            margin: 0;
            max-width: 280px;
            line-height: 1.6;
        }

        /* ==================== 2. PREMIUM SOCIAL LINKS ==================== */
        .social-icons-grid {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-top: 8px;
        }
        
        .social-icon-link {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            /* গ্লোবাল টাচ টার্গেট সাইজ (40x40px) মোবাইল ফ্রেন্ডলি */
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.08);
            color: #e5e5e7;
            transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .social-icon-link:hover {
            background: #ffffff;
            color: #000000;
            transform: translateY(-2px);
            border-color: #ffffff;
        }
        
        .social-icon-link svg, .social-icon-link img {
            /* প্রিমিয়াম আইকন অপটিমাইজড সাইজ */
            width: 18px;
            height: 18px;
            object-fit: contain;
        }

        /* ==================== 3 & 4. MENUS & TYPOGRAPHY ==================== */
        .footer-section-title {
            font-family: var(--font-heading, 'Manrope', sans-serif);
            font-size: 0.85rem;
            font-weight: 600;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            margin: 0 0 24px 0;
            color: #ffffff;
            position: relative;
        }

        .footer-links-list {
            list-style: none;
            padding: 0;
            margin: 0;
            display: flex;
            flex-direction: column;
            gap: 14px;
        }
        
        .footer-links-list > li {
            font-size: 0.9rem;
            color: #a1a1aa;
        }

        .footer-links-list a {
            position: relative;
        }
        /* মিনিমালিস্টি আন্ডারলাইন অ্যানিমেশন */
        .footer-links-list a::after {
            content: '';
            position: absolute;
            width: 100%;
            transform: scaleX(0);
            height: 1px;
            bottom: -2px;
            left: 0;
            background-color: #ffffff;
            transform-origin: bottom right;
            transition: transform 0.25s ease-out;
        }
        .footer-links-list a:hover::after {
            transform: scaleX(1);
            transform-origin: bottom left;
        }
        
        .footer-link-desc {
            display: block;
            font-size: 0.75rem;
            color: #71717a;
            margin-top: 4px;
        }

        .footer-nested-links {
            list-style: none;
            padding-left: 12px;
            margin: 8px 0 0 0;
            border-left: 1px solid rgba(255, 255, 255, 0.08);
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
        
        .footer-nested-links > li {
            font-size: 0.85rem;
        }

        /* ==================== 5. INTERNATIONAL PAYMENT GRID ==================== */
        .footer-payment-section {
            margin-top: 28px;
        }

        .footer-payment-grid {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 12px;
        }
        
        .footer-payment-item {
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid rgba(255, 255, 255, 0.06);
            /* বিশ্ববিখ্যাত স্ট্যান্ডার্ড কার্ড গেটওয়ে ডাইমেনশন */
            width: 54px;
            height: 34px;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            cursor: pointer;
            transition: all 0.25s ease;
        }
        
        .footer-payment-item:hover {
            background: rgba(255, 255, 255, 0.08);
            border-color: rgba(255, 255, 255, 0.2);
        }
        
        .footer-payment-icon { 
            width: 100%;
            height: 100%; 
            object-fit: contain; 
            padding: 4px;
        }
        
        .footer-qr-tooltip {
            position: absolute;
            bottom: 125%;
            left: 50%;
            transform: translateX(-50%);
            background: #ffffff;
            padding: 6px;
            border-radius: 6px;
            display: none;
            box-shadow: 0 10px 25px rgba(0,0,0,0.5);
            z-index: 20;
        }
        .footer-payment-item:hover .footer-qr-tooltip { display: block; }
        .footer-qr-tooltip img { width: 90px; height: 90px; display: block; }

        /* ==================== 6, 7 & 10. PREMIUM BADGES ==================== */
        .footer-mini-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
            margin-bottom: 28px;
        }

        @media (max-width: 480px) {
            .footer-mini-grid {
                grid-template-columns: 1fr;
            }
        }
        
        .footer-badge-box {
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid rgba(255, 255, 255, 0.05);
            padding: 12px;
            border-radius: 6px;
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .footer-badge-box img { 
            /* গ্লোবাল ট্রাস্ট ব্যাজ অপটিমাইজড সাইজ */
            width: 32px; 
            height: 32px; 
            object-fit: contain; 
        }

        .badge-text-wrapper { 
            display: flex; 
            flex-direction: column; 
            gap: 2px;
        }
        .badge-text-wrapper strong {
            color: #ffffff;
            font-size: 0.8rem;
            font-weight: 600;
        }
        .badge-subtitle { 
            font-size: 0.7rem; 
            color: #71717a; 
        }

        /* ==================== 8. ECOMMERCE APP STORE BUTTONS ==================== */
        .footer-app-grid {
            display: flex;
            flex-direction: column;
            gap: 10px;
            margin-top: 10px;
        }
        
        .footer-app-btn {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            background: #000000;
            border: 1px solid #27272a;
            /* অ্যাপলের অফিসিয়াল ডাউনলোড ব্যাজ মেজারমেন্ট রেশিও */
            width: 140px;
            height: 42px;
            padding: 0 12px;
            border-radius: 6px;
            transition: all 0.25s ease;
        }

        .footer-app-btn img {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
        
        .footer-app-btn:hover { 
            border-color: #52525b;
            background: #18181b;
        }

        /* ==================== 9. MODERN COUNTRY SELECTOR ==================== */
        .footer-country-wrapper {
            background: rgba(255, 255, 255, 0.02);
            padding: 16px;
            border-radius: 8px;
            border: 1px solid rgba(255, 255, 255, 0.06);
            margin-top: 12px;
            width: 100%;
            max-width: 280px;
        }
        
        .footer-country-select {
            width: 100%;
            background: #18181b;
            color: #ffffff;
            border: 1px solid #27272a;
            padding: 10px 12px;
            border-radius: 6px;
            font-size: 0.85rem;
            outline: none;
            cursor: pointer;
            font-family: inherit;
            transition: border-color 0.2s ease;
            appearance: none;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23ffffff'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E");
            background-repeat: no-repeat;
            background-position: right 12px center;
            background-size: 14px;
        }
        
        .footer-country-select:focus {
            border-color: #52525b;
        }
        
        .footer-country-select option { 
            background: #09090b; 
            color: #ffffff; 
        }
        
        .footer-exchange-rate { 
            font-size: 0.75rem; 
            color: #71717a;
            display: flex;
            align-items: center;
            gap: 6px;
            margin-top: 10px;
        }

        /* ==================== CONTACT METRICS ==================== */
        .footer-contact-list {
            display: flex;
            flex-direction: column;
            gap: 14px;
            margin-bottom: 28px;
        }

        .footer-contact-item {
            display: flex;
            align-items: flex-start;
            gap: 12px;
            font-size: 0.9rem;
            color: #e4e4e7;
        }
        .footer-contact-item a {
            display: inline;
        }
        .footer-contact-icon {
            font-size: 1rem;
            color: #a1a1aa;
            flex-shrink: 0;
            line-height: 1.4;
        }

        /* ==================== 11. LUXURY BOTTOM BAR ==================== */
        .footer-bottom-bar {
            border-top: 1px solid rgba(255, 255, 255, 0.06);
            padding-top: 32px;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            gap: 20px;
            font-size: 0.8rem;
            color: #71717a;
        }
        
        @media (max-width: 768px) {
            .footer-bottom-bar { 
                flex-direction: column; 
                text-align: center;
                gap: 16px;
            }
        }

        /* Center Layout Alignment */
        .footer-layout-centered .footer-grid { text-align: center; }
        .footer-layout-centered .footer-brand-container { align-items: center; }
        .footer-layout-centered .footer-brand-desc { margin: 0 auto; }
        .footer-layout-centered .social-icons-grid { justify-content: center; }
        .footer-layout-centered .footer-app-grid { align-items: center; }
        .footer-layout-centered .footer-country-wrapper { margin: 12px auto 0; }
        .footer-layout-centered .footer-contact-list { align-items: center; }
        .footer-layout-centered .footer-contact-item { justify-content: center; }
        .footer-layout-centered .footer-mini-grid { justify-content: center; }
        .footer-layout-centered .footer-payment-grid { justify-content: center; }
    </style>
    `;
    document.head.insertAdjacentHTML('beforeend', styles);
}

function getSocialIconHTML(platform, link) {
    const icons = {
        'facebook': `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 2H15C13.6739 2 12.4021 2.52678 11.4645 3.46447C10.5268 4.40215 10 5.67392 10 7V10H7V14H10V22H14V14H17L18 10H14V7C14 6.73478 14.1054 6.48043 14.2929 6.29289C14.4804 6.10536 14.7348 6 15 6H18V2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
        'instagram': `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17 2H7C4.23858 2 2 4.23858 2 7V17C2 19.7614 4.23858 22 7 22H17C19.7614 22 22 19.7614 22 17V7C22 4.23858 19.7614 2 17 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 11.37C16.1234 12.2022 15.9812 13.0522 15.5937 13.799C15.2062 14.5458 14.5931 15.1514 13.8416 15.5297C13.0901 15.908 12.2384 16.0396 11.4077 15.9059C10.5771 15.7722 9.80971 15.3801 9.21479 14.7851C8.61987 14.1902 8.2278 13.4228 8.09412 12.5922C7.96044 11.7615 8.092 10.9098 8.47026 10.1583C8.84852 9.40678 9.45418 8.7937 10.2009 8.4062C10.9477 8.0187 11.7978 7.87652 12.63 8C13.4789 8.12583 14.2648 8.52151 14.8716 9.12836C15.4785 9.73521 15.8742 10.5211 16 11.37Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor"/></svg>`,
        'youtube': `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22.54 6.42C22.4212 5.94541 22.1792 5.51057 21.8387 5.15941C21.4982 4.80824 21.0708 4.55518 20.6 4.43C18.88 4 12 4 12 4C12 4 5.12 4 3.4 4.46C2.92916 4.58518 2.50178 4.83824 2.16132 5.18941C1.82085 5.54057 1.57882 5.97541 1.46 6.45C1.14521 8.17418 0.991095 9.92534 1 11.68C0.991095 13.4347 1.14521 15.1858 1.46 16.91C1.57882 17.3846 1.82085 17.8194 2.16132 18.1706C2.50178 18.5218 2.92916 18.7748 3.4 18.9C5.12 19.36 12 19.36 12 19.36C12 19.36 18.88 19.36 20.6 18.9C21.0708 18.7748 21.4982 18.5218 21.8387 18.1706C22.1792 17.8194 22.4212 17.3846 22.54 16.91C22.8548 15.1858 23.0089 13.4347 23 11.68C23.0089 9.92534 22.8548 8.17418 22.54 6.42Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M9.75 15.02L15.5 11.68L9.75 8.34V15.02Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
        'x': `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18.244 2.25H21.552L14.325 10.51L22.827 21.75H16.17L10.956 14.933L4.99 21.75H1.68L9.41 12.915L1.254 2.25H8.08L12.793 8.481L18.244 2.25ZM17.083 19.77H18.916L7.084 4.126H5.117L17.083 19.77Z" fill="currentColor"/></svg>`,
        'linkedin': `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 9H2V21H6V9Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M22 12V21H18V12C18 10.5 17.5 9 16 9C14.5 9 14 10.5 14 12V21H10V9H14V11C14 11 14.5 9.5 16.5 9.5C18.5 9.5 22 10.5 22 12Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><circle cx="4" cy="4" r="2" stroke="currentColor" stroke-width="2"/></svg>`
    };
    return icons[platform] || '';
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
        
        // --- Table 11: Settings ---
        const bgColor = settings.background_color || '#0d0d0d';
        const textColor = settings.text_color || '#a3a3a3';
        const layoutStyle = settings.layout_style || 'standard';
        const customCSS = settings.custom_css || '';
        
        // --- Table 4: Robust Content Processing ---
        let mergedContent = {};
        if (Array.isArray(content) && content.length > 0) {
            content.forEach(item => {
                mergedContent = { ...mergedContent, ...item };
            });
        }
        
        const logoUrl = mergedContent.logo_url || '';
        const brandTitle = mergedContent.title || '';
        const brandDesc = mergedContent.description || '';
        const address = mergedContent.address || '';
        const phone = mergedContent.phone || '';
        const email = mergedContent.email || '';
        const workingHours = mergedContent.working_hours || '';
        const defaultCopyright = settings.copyright_text || mergedContent.copyright_text || '© JayenWare. All Rights Reserved.';

        // --- Table 1: Social Links ---
        let socialsHTML = '';
        if (socialLinks && socialLinks.length > 0) {
            socialsHTML = `<div class="social-icons-grid">` + 
                socialLinks.sort((a, b) => a.sort_order - b.sort_order).map(link => {
                    const platform = (link.platform_name || '').toLowerCase();
                    const iconContent = link.platform_icon ? `<img src="${link.platform_icon}" alt="${link.platform_name}">` : getSocialIconHTML(platform, link.link_url);
                    return `<a href="${link.link_url}" target="_blank" rel="noopener noreferrer" class="social-icon-link" title="${link.hover_title || link.platform_name}">
                                ${iconContent}
                            </a>`;
                }).join('') + `</div>`;
        }

        // --- Table 8: App Links ---
        let appsHTML = '';
        if (appLinks && appLinks.length > 0) {
            appsHTML = `<div class="footer-app-grid">` + 
                appLinks.sort((a, b) => a.sort_order - b.sort_order).map(app => {
                    let btnHTML = '';
                    const icon = app.icon_url ? `<img src="${app.icon_url}" alt="App Icon">` : '';
                    if(app.app_store_url) btnHTML += `<a href="${app.app_store_url}" class="footer-app-btn" target="_blank">${icon}</a>`;
                    if(app.play_store_url) btnHTML += `<a href="${app.play_store_url}" class="footer-app-btn" target="_blank">${icon}</a>`;
                    return btnHTML;
                }).join('') + `</div>`;
        }

        // --- Table 9: Country Selector ---
        let countryHTML = '';
        let dirAttribute = 'ltr';
        
        if (countries && countries.length > 0) {
            const defaultCountry = countries.find(c => c.is_default) || countries[0];
            if (defaultCountry && defaultCountry.is_rtl) dirAttribute = 'rtl';
            
            let exchangeRateHTML = '';
            if (defaultCountry && defaultCountry.exchange_rate && defaultCountry.exchange_rate !== 1) {
                const symbol = defaultCountry.currency_symbol || defaultCountry.currency_code || '';
                exchangeRateHTML = `<div class="footer-exchange-rate"><span>💱</span> Exchange: 1 USD = ${symbol}${defaultCountry.exchange_rate}</div>`;
            }
            
            countryHTML = `
            <div class="footer-country-wrapper">
                <select class="footer-country-select" onchange="window.location.href=this.value">
                    ${countries.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)).map(c => `
                        <option value="?country=${c.country_code || ''}&lang=${c.language_code || ''}" ${c.is_default ? 'selected' : ''}>
                            ${c.country_name || 'Unknown'} - ${c.currency_code || ''} (${c.currency_symbol || ''})
                        </option>
                    `).join('')}
                </select>
                ${exchangeRateHTML}
            </div>`;
        }

        // --- Table 2 & 3: Menus and Quick Links ---
        let menusHTML = '';
        if (menus && menus.length > 0) {
            menus.sort((a, b) => a.sort_order - b.sort_order).forEach(menu => {
                const links = menu.links || [];
                const parents = links.filter(l => !l.parent_id).sort((a, b) => a.sort_order - b.sort_order);
                
                menusHTML += `
                <div>
                    <h5 class="footer-section-title">${menu.title}</h5>
                    <ul class="footer-links-list">
                        ${parents.map(parent => {
                            const target = parent.open_in_new_tab ? 'target="_blank"' : '';
                            const children = links.filter(l => l.parent_id === parent.id).sort((a, b) => a.sort_order - b.sort_order);
                            
                            let childHTML = '';
                            if(children.length > 0) {
                                childHTML = `<ul class="footer-nested-links">
                                    ${children.map(child => `<li><a href="${child.link_url || '#'}" ${child.open_in_new_tab ? 'target="_blank"' : ''}>${child.title}</a>${child.description ? `<span class="footer-link-desc">${child.description}</span>` : ''}</li>`).join('')}
                                </ul>`;
                            }
                            return `<li>
                                <a href="${parent.link_url || '#'}" ${target}>${parent.title}</a>
                                ${parent.description ? `<span class="footer-link-desc">${parent.description}</span>` : ''}
                                ${childHTML}
                            </li>`;
                        }).join('')}
                    </ul>
                </div>`;
            });
        }

        // --- Table 5: Payment Methods ---
        let paymentsHTML = '';
        if (paymentMethods && paymentMethods.length > 0) {
            paymentsHTML = `
            <div class="footer-payment-section">
                <h5 class="footer-section-title" style="margin-bottom:12px; font-size:0.75rem;">Accepted Payments</h5>
                <div class="footer-payment-grid">
                    ${paymentMethods.sort((a, b) => a.sort_order - b.sort_order).map(pm => `
                        <div class="footer-payment-item" title="${pm.name}">
                            ${pm.icon_url ? `<img src="${pm.icon_url}" alt="${pm.name}" class="footer-payment-icon">` : `<span style="font-size:0.6rem; font-weight:600;">${pm.name}</span>`}
                            ${pm.qr_code_url ? `<div class="footer-qr-tooltip"><img src="${pm.qr_code_url}" alt="QR Code"></div>` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>`;
        }

        // --- Table 6, 7 & 10: Trust Badges, Certs, Shipping ---
        let trustHTML = '';
        if (trustBadges && trustBadges.length > 0) {
            trustHTML += trustBadges.sort((a, b) => a.sort_order - b.sort_order).map(badge => `
                <div class="footer-badge-box">
                    ${badge.badge_url ? `<img src="${badge.badge_url}" alt="${badge.title}">` : ''}
                    <div class="badge-text-wrapper">
                        <strong>${badge.title}</strong>
                        ${badge.subtitle ? `<span class="badge-subtitle">${badge.subtitle}</span>` : ''}
                    </div>
                </div>
            `).join('');
        }
        
        let certsHTML = '';
        if (certifications && certifications.length > 0) {
            certsHTML += certifications.sort((a, b) => a.sort_order - b.sort_order).map(cert => `
                <div class="footer-badge-box">
                    ${cert.link_url ? `<a href="${cert.link_url}" target="_blank">` : ''}
                    ${cert.badge_url ? `<img src="${cert.badge_url}" alt="${cert.name}">` : '<strong>' + cert.name + '</strong>'}
                    ${cert.link_url ? `</a>` : ''}
                </div>
            `).join('');
        }

        let shippingHTML = '';
        if (shippingPartners && shippingPartners.length > 0) {
            shippingHTML += shippingPartners.sort((a, b) => a.sort_order - b.sort_order).map(ship => `
                <div class="footer-badge-box" title="${ship.name}">
                    ${ship.icon_url ? `<img src="${ship.icon_url}" alt="${ship.name}">` : `<strong>${ship.name}</strong>`}
                </div>
            `).join('');
        }

        // --- Build Final HTML ---
        const layoutClass = layoutStyle === 'centered' ? 'footer-layout-centered' : '';
        
        const footerHTML = `
        <footer id="main-footer" class="${layoutClass}" style="--footer-bg: ${bgColor}; --footer-text: ${textColor};" dir="${dirAttribute}">
            ${customCSS ? `<style>${customCSS}</style>` : ''}
            <div class="footer-container">
                <div class="footer-grid">
                    
                    <div class="footer-brand-container">
                        ${logoUrl ? `<img src="${logoUrl}" alt="${brandTitle || 'Brand'}" class="footer-brand-logo">` : ''}
                        ${brandTitle ? `<h4 class="footer-brand-title">${brandTitle}</h4>` : ''}
                        ${brandDesc ? `<p class="footer-brand-desc">${brandDesc}</p>` : ''}
                        
                        ${socialsHTML}
                        ${appsHTML}
                        ${countryHTML}
                    </div>
                    
                    ${menusHTML}
                    
                    <div>
                        <h5 class="footer-section-title">Contact & Trust</h5>
                        <div class="footer-contact-list">
                            ${address ? `<div class="footer-contact-item"><span class="footer-contact-icon"></span> <span>${address}</span></div>` : ''}
                            ${phone ? `<div class="footer-contact-item"><span class="footer-contact-icon"></span> <span><a href="tel:${phone}">${phone}</a></span></div>` : ''}
                            ${email ? `<div class="footer-contact-item"><span class="footer-contact-icon"></span> <span><a href="mailto:${email}">${email}</a></span></div>` : ''}
                            ${workingHours ? `<div class="footer-contact-item"><span class="footer-contact-icon"></span> <span>${workingHours}</span></div>` : ''}
                        </div>
                        
                        ${(trustHTML || certsHTML || shippingHTML) ? `
                        <div class="footer-mini-grid">
                            ${trustHTML}
                            ${certsHTML}
                            ${shippingHTML}
                        </div>` : ''}
                        
                        ${paymentsHTML}
                    </div>
                </div>
                
                <div class="footer-bottom-bar">
                    <p>${defaultCopyright}</p>
                    <p>Powered by <a href="https://binzeo.vercel.app" target="_blank" style="color: #ffffff; font-weight: 500;">BINZEO Infrastructure</a> v${settings.version || '2.3'}</p>
                </div>
            </div>
        </footer>
        `;
        
        document.body.insertAdjacentHTML('beforeend', footerHTML);
        
    } catch (error) {
        console.error('Footer DB synchronization failed:', error);
    }
}

// Ensure execution
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderFooter);
} else {
    setTimeout(renderFooter, 50);
}

// Module export logic
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { renderFooter, getSocialIconHTML };
}
