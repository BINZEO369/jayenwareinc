// ============================================================================
// footer.js - Professional Premium Footer Component
// Version: 2.1 (Fully Synchronized with 11-Table Database Architecture)
// Brand: JABIYEN (Premium Apparel)
// ============================================================================

function injectFooterStyles() {
    if (document.getElementById("footer-components-style")) return;

    const styles = `
    <style id="footer-components-style">
        /* ==================== BASE FOOTER STYLES ==================== */
        #main-footer {
            font-family: var(--font-body, 'Inter', sans-serif);
            border-top: 1px solid rgba(255, 255, 255, 0.08);
            position: relative;
            z-index: 10;
            background-color: var(--footer-bg, #121212);
            color: var(--footer-text, #e0e0e0);
            line-height: 1.6;
            width: 100%;
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
            max-width: 140px;
            margin-bottom: 20px;
            border-radius: 4px;
            display: block;
        }
        
        .footer-brand-title {
            font-family: var(--font-heading, 'Manrope', sans-serif);
            font-size: 1.5rem;
            font-weight: 800;
            letter-spacing: 0.05em;
            margin-bottom: 12px;
            text-transform: uppercase;
            color: #ffffff;
        }
        
        .footer-brand-desc {
            font-size: 0.875rem;
            opacity: 0.75;
            margin-bottom: 24px;
            max-width: 320px;
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
            width: 38px;
            height: 38px;
            border-radius: 8px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: inherit;
            transition: all 0.3s ease;
        }
        
        .social-icon-link:hover {
            background: rgba(255, 255, 255, 0.15);
            transform: translateY(-3px);
            border-color: rgba(255, 255, 255, 0.3);
        }
        
        .social-icon-link svg, .social-icon-link img {
            width: 18px;
            height: 18px;
            object-fit: contain;
        }

        /* ==================== 3 & 4. MENUS ==================== */
        .footer-section-title {
            font-family: var(--font-heading, 'Manrope', sans-serif);
            font-size: 0.9rem;
            font-weight: 700;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            margin-bottom: 20px;
            color: #ffffff;
            position: relative;
            padding-bottom: 8px;
        }
        
        .footer-section-title::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 30px;
            height: 2px;
            background: #ffffff;
            opacity: 0.3;
        }

        .footer-links-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        
        .footer-links-list > li {
            margin-bottom: 14px;
            font-size: 0.875rem;
            opacity: 0.8;
        }
        
        .footer-link-desc {
            display: block;
            font-size: 0.75rem;
            opacity: 0.6;
            margin-top: 4px;
            font-style: italic;
        }

        .footer-nested-links {
            list-style: none;
            padding-left: 16px;
            margin-top: 10px;
            border-left: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .footer-nested-links > li {
            margin-bottom: 8px;
            font-size: 0.8125rem;
        }

        /* ==================== 5. PAYMENT METHODS ==================== */
        .footer-payment-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
            gap: 10px;
            margin-bottom: 20px;
        }
        
        .footer-payment-item {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.08);
            padding: 10px;
            border-radius: 8px;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            position: relative;
            cursor: pointer;
            transition: background 0.3s;
        }
        
        .footer-payment-item:hover {
            background: rgba(255, 255, 255, 0.08);
        }
        
        .footer-payment-icon { height: 24px; margin-bottom: 6px; object-fit: contain; }
        .footer-payment-name { font-size: 0.75rem; font-weight: 600; }
        .footer-payment-account { font-size: 0.65rem; opacity: 0.6; margin-top: 4px; }
        
        .footer-qr-tooltip {
            position: absolute;
            bottom: 110%;
            left: 50%;
            transform: translateX(-50%);
            background: #fff;
            padding: 4px;
            border-radius: 8px;
            display: none;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 20;
        }
        .footer-payment-item:hover .footer-qr-tooltip { display: block; }
        .footer-qr-tooltip img { width: 80px; height: 80px; }

        /* ==================== 6, 7 & 10. BADGES ==================== */
        .footer-mini-grid {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-bottom: 24px;
        }
        
        .footer-badge-box {
            background: rgba(255, 255, 255, 0.05);
            padding: 8px 12px;
            border-radius: 6px;
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 0.75rem;
        }
        
        .footer-badge-box img { max-height: 24px; }
        .badge-text-wrapper { display: flex; flex-direction: column; }
        .badge-subtitle { font-size: 0.65rem; opacity: 0.6; }

        /* ==================== 8. APP LINKS ==================== */
        .footer-app-grid {
            display: flex;
            flex-direction: column;
            gap: 10px;
            margin-bottom: 24px;
        }
        
        .footer-app-btn {
            display: inline-flex;
            align-items: center;
            gap: 12px;
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.15);
            padding: 10px 16px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 0.8125rem;
            width: fit-content;
        }
        
        .footer-app-btn:hover { background: rgba(255, 255, 255, 0.15); }

        /* ==================== 9. COUNTRY SELECTOR (UPDATED) ==================== */
        .footer-country-wrapper {
            background: rgba(0, 0, 0, 0.3);
            padding: 12px;
            border-radius: 8px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            margin-top: 20px;
            display: block; /* Ensure it takes full width of container */
            width: 100%;
            max-width: 320px;
        }
        
        .footer-country-select {
            width: 100%;
            background: rgba(255, 255, 255, 0.05);
            color: #ffffff;
            border: 1px solid rgba(255, 255, 255, 0.2);
            padding: 10px 12px;
            border-radius: 6px;
            font-size: 0.875rem;
            outline: none;
            margin-bottom: 8px;
            cursor: pointer;
        }
        
        .footer-country-select:focus {
            border-color: rgba(255, 255, 255, 0.5);
        }
        
        .footer-country-select option { 
            background: #1a1a1a; 
            color: #ffffff; 
            padding: 10px;
        }
        
        .footer-exchange-rate { 
            font-size: 0.75rem; 
            opacity: 0.8; 
            color: #a0a0a0;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        /* ==================== CONTACT INFO ==================== */
        .footer-contact-item {
            display: flex;
            align-items: flex-start;
            gap: 12px;
            margin-bottom: 14px;
            font-size: 0.875rem;
            opacity: 0.85;
        }

        /* ==================== 11. BOTTOM BAR ==================== */
        .footer-bottom-bar {
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            padding-top: 24px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            font-size: 0.75rem;
            opacity: 0.6;
        }
        
        @media (min-width: 768px) {
            .footer-bottom-bar { flex-direction: row; }
        }

        .footer-layout-centered .footer-grid { text-align: center; }
        .footer-layout-centered .footer-section-title::after { left: 50%; transform: translateX(-50%); }
        .footer-layout-centered .footer-country-wrapper { margin: 20px auto 0; }
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
        'linkedin': `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 9H2V21H6V9Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M22 12V21H18V12C18 10.5 17.5 9 16 9C14.5 9 14 10.5 14 12V21H10V9H14V11C14 11 14.5 9.5 16.5 9.5C18.5 9.5 22 10.5 22 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="4" cy="4" r="2" stroke="currentColor" stroke-width="2"/></svg>`
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
        const bgColor = settings.background_color || '#121212';
        const textColor = settings.text_color || '#e0e0e0';
        const layoutStyle = settings.layout_style || 'standard';
        const customCSS = settings.custom_css || '';
        
        // --- Table 4: Content Processing ---
        const brand = content.find(c => c.section_name === 'brand') || {};
        const info = content.find(c => c.section_name === 'info') || {};
        const contact = content.find(c => c.section_name === 'contact') || {};

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
                    const icon = app.icon_url ? `<img src="${app.icon_url}" style="width:20px;">` : '📱';
                    if(app.app_store_url) btnHTML += `<a href="${app.app_store_url}" class="footer-app-btn" target="_blank">${icon} App Store</a>`;
                    if(app.play_store_url) btnHTML += `<a href="${app.play_store_url}" class="footer-app-btn" target="_blank">${icon} Play Store</a>`;
                    return btnHTML;
                }).join('') + `</div>`;
        }

        // --- Table 9: Country Selector (UPDATED ROBUST LOGIC) ---
        let countryHTML = '';
        let dirAttribute = 'ltr';
        
        // 'settings.show_country_selector' এর কন্ডিশন বাধ্যবাধকতা সরিয়ে সরাসরি ডাটা চেক করা হলো
        if (countries && countries.length > 0) {
            const defaultCountry = countries.find(c => c.is_default) || countries[0];
            if (defaultCountry && defaultCountry.is_rtl) dirAttribute = 'rtl';
            
            // Exchange rate check (To avoid showing undefined)
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
                            ${c.country_name || 'Unknown'} - ${c.currency_code || ''} (${c.currency_symbol || ''}) ${c.language_name ? `| ${c.language_name}` : ''}
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
                                    ${children.map(child => `<li><a href="${child.link_url || '#'}" ${child.open_in_new_tab ? 'target="_blank"' : ''}>${child.icon_class ? `<i class="${child.icon_class}"></i> ` : ''}${child.title}</a>${child.description ? `<span class="footer-link-desc">${child.description}</span>` : ''}</li>`).join('')}
                                </ul>`;
                            }
                            return `<li>
                                <a href="${parent.link_url || '#'}" ${target}>${parent.icon_class ? `<i class="${parent.icon_class}"></i> ` : ''}${parent.title}</a>
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
            <div class="footer-section">
                <h5 class="footer-section-title">Payments</h5>
                <div class="footer-payment-grid">
                    ${paymentMethods.sort((a, b) => a.sort_order - b.sort_order).map(pm => `
                        <div class="footer-payment-item" title="${pm.name}">
                            ${pm.icon_url ? `<img src="${pm.icon_url}" alt="${pm.name}" class="footer-payment-icon">` : `<span class="footer-payment-name">${pm.name}</span>`}
                            ${pm.account_number ? `<span class="footer-payment-account">${pm.account_number}</span>` : ''}
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
                    ${cert.badge_url ? `<img src="${cert.badge_url}" alt="${cert.name}">` : `<strong>${cert.name}</strong>`}
                    ${cert.link_url ? `</a>` : ''}
                </div>
            `).join('');
        }

        let shippingHTML = '';
        if (shippingPartners && shippingPartners.length > 0) {
            shippingHTML += shippingPartners.sort((a, b) => a.sort_order - b.sort_order).map(ship => `
                <div class="footer-badge-box" title="${ship.name}">
                    ${ship.icon_url ? `<img src="${ship.icon_url}" alt="${ship.name}">` : `<span>${ship.name}</span>`}
                </div>
            `).join('');
        }

        // --- Build Final HTML ---
        const layoutClass = layoutStyle === 'centered' ? 'footer-layout-centered' : '';
        
        const footerHTML = `
        <footer id="main-footer" class="pt-12 pb-6 ${layoutClass}" style="--footer-bg: ${bgColor}; --footer-text: ${textColor}; padding: 40px 20px 20px;" dir="${dirAttribute}">
            ${customCSS ? `<style>${customCSS}</style>` : ''}
            <div style="width: 100%; max-width: 1280px; margin: 0 auto;">
                <div class="footer-grid">
                    
                    <div>
                        ${brand.logo_url ? `<img src="${brand.logo_url}" alt="${brand.title || 'Brand'}" class="footer-brand-logo">` : ''}
                        ${brand.title ? `<h4 class="footer-brand-title">${brand.title}</h4>` : ''}
                        <p class="footer-brand-desc">${brand.description || info.description || ''}</p>
                        
                        ${socialsHTML}
                        ${appsHTML}
                        ${countryHTML} <!-- Country HTML Injected Here -->
                    </div>
                    
                    ${menusHTML}
                    
                    <div>
                        <h5 class="footer-section-title">Contact & Trust</h5>
                        <div style="margin-bottom: 24px;">
                            ${contact.address ? `<div class="footer-contact-item">📍 <span>${contact.address}</span></div>` : ''}
                            ${contact.phone ? `<div class="footer-contact-item">☎ <span><a href="tel:${contact.phone}">${contact.phone}</a></span></div>` : ''}
                            ${contact.email ? `<div class="footer-contact-item">✉ <span><a href="mailto:${contact.email}">${contact.email}</a></span></div>` : ''}
                            ${contact.working_hours ? `<div class="footer-contact-item">🕐 <span>${contact.working_hours}</span></div>` : ''}
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
                    <p>Powered by <a href="https://binzeo.vercel.app" target="_blank" style="color: #fff; font-weight: bold;">BINZEO Infrastructure</a> v${settings.version || '2.1'}</p>
                    <p>${settings.copyright_text || brand.copyright_text || '© JayenWare. All Rights Reserved.'}</p>
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
