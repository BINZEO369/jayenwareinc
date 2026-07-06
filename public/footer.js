// ============================================================================
// footer.js - Ultimate Database-Driven Premium Footer Component
// Version: 3.0 (Full 11 Tables & All Columns Integrated)
// ============================================================================

function injectFooterStyles() {
    if (document.getElementById("footer-components-style")) return;

    const styles = `
    <style id="footer-components-style">
        /* ==================== BASE STYLES & TYPOGRAPHY ==================== */
        #main-footer {
            font-family: var(--font-body, 'Inter', system-ui, sans-serif);
            border-top: 1px solid rgba(255, 255, 255, 0.08);
            position: relative;
            z-index: 10;
            line-height: 1.5;
        }
        
        #main-footer a {
            color: inherit;
            text-decoration: none;
            transition: all 0.3s ease;
        }
        
        #main-footer a:hover {
            opacity: 0.7;
        }

        /* ==================== LAYOUT GRIDS ==================== */
        .footer-main-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 40px;
            margin-bottom: 40px;
        }
        
        @media (min-width: 768px) {
            .footer-main-grid {
                grid-template-columns: repeat(2, 1fr);
            }
        }
        
        @media (min-width: 1024px) {
            .footer-main-grid {
                grid-template-columns: 2fr 1.2fr 1.2fr 1.5fr;
                gap: 50px;
            }
        }

        /* ==================== BRANDING (Content Table) ==================== */
        .footer-brand-logo {
            max-width: 140px;
            max-height: 60px;
            margin-bottom: 16px;
            object-fit: contain;
        }
        
        .footer-brand-title {
            font-family: var(--font-heading, 'Manrope', sans-serif);
            font-size: 1.5rem;
            font-weight: 800;
            letter-spacing: 0.05em;
            margin-bottom: 12px;
            text-transform: uppercase;
        }
        
        .footer-brand-desc {
            font-size: 0.9rem;
            opacity: 0.75;
            margin-bottom: 24px;
            max-width: 320px;
        }

        /* ==================== SECTIONS ==================== */
        .footer-section {
            margin-bottom: 32px;
        }
        .footer-section:last-child {
            margin-bottom: 0;
        }
        .footer-section-title {
            font-family: var(--font-heading, 'Manrope', sans-serif);
            font-size: 0.9rem;
            font-weight: 700;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            margin-bottom: 20px;
            opacity: 0.9;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        /* ==================== SOCIAL LINKS ==================== */
        .social-icons-wrapper {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            margin-bottom: 24px;
        }
        
        .social-icon-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 38px;
            height: 38px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            transition: all 0.3s ease;
        }
        
        .social-icon-btn:hover {
            background: rgba(255, 255, 255, 0.15);
            transform: translateY(-3px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            opacity: 1 !important;
        }
        
        .social-icon-btn svg, .social-icon-btn img {
            width: 18px;
            height: 18px;
            object-fit: contain;
        }

        /* ==================== APP LINKS ==================== */
        .app-links-grid {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        
        .app-store-btn {
            display: inline-flex;
            align-items: center;
            gap: 12px;
            background: rgba(255, 255, 255, 0.06);
            border: 1px solid rgba(255, 255, 255, 0.12);
            padding: 10px 16px;
            border-radius: 12px;
            font-weight: 600;
            font-size: 0.85rem;
            width: fit-content;
            transition: all 0.3s ease;
        }
        
        .app-store-btn:hover {
            background: rgba(255, 255, 255, 0.12);
            transform: translateY(-2px);
        }
        
        .app-store-btn img {
            width: 20px;
            height: 20px;
            border-radius: 4px;
        }

        /* ==================== COUNTRY SELECTOR ==================== */
        .country-selector-box {
            display: flex;
            align-items: center;
            gap: 12px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 8px;
            padding: 6px 14px;
            width: 100%;
            max-width: 280px;
            transition: border-color 0.3s ease;
        }
        .country-selector-box:focus-within {
            border-color: rgba(255, 255, 255, 0.4);
        }
        
        .active-flag-icon {
            width: 24px;
            height: 16px;
            object-fit: cover;
            border-radius: 2px;
            box-shadow: 0 0 2px rgba(0,0,0,0.3);
        }
        
        .country-dropdown {
            width: 100%;
            background: transparent;
            color: inherit;
            border: none;
            padding: 8px 0;
            font-size: 0.85rem;
            font-weight: 500;
            cursor: pointer;
            outline: none;
            appearance: none;
        }
        
        .country-dropdown option {
            background: #1a1a1a;
            color: #ffffff;
            padding: 10px;
        }
        
        .exchange-rate-text {
            font-size: 0.75rem;
            opacity: 0.6;
            margin-top: 8px;
            padding-left: 4px;
            display: block;
        }

        /* ==================== QUICK LINKS & MENUS ==================== */
        .quick-links-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        
        .quick-links-list > li {
            margin-bottom: 14px;
        }
        
        .link-title-wrap {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 0.9rem;
            opacity: 0.85;
        }
        .link-title-wrap i {
            opacity: 0.7;
        }
        
        .link-desc {
            display: block;
            font-size: 0.75rem;
            opacity: 0.5;
            margin-top: 4px;
            padding-left: 20px; /* Space for icon */
        }
        
        .nested-links-list {
            list-style: none;
            padding-left: 20px;
            margin-top: 10px;
            border-left: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .nested-links-list li {
            margin-bottom: 10px;
            font-size: 0.85rem;
            opacity: 0.75;
        }

        /* ==================== CONTACT INFO ==================== */
        .contact-item {
            display: flex;
            align-items: flex-start;
            gap: 12px;
            margin-bottom: 16px;
            font-size: 0.9rem;
            opacity: 0.85;
            line-height: 1.4;
        }
        .contact-icon {
            font-size: 1.2em;
            opacity: 0.7;
            margin-top: 2px;
        }

        /* ==================== DATA GRIDS (Payments, Shipping, Certs, Badges) ==================== */
        .data-grid-container {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
            gap: 12px;
        }
        
        .data-grid-card {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 8px;
            padding: 12px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            transition: all 0.3s ease;
            position: relative;
        }
        
        .data-grid-card:hover {
            background: rgba(255, 255, 255, 0.06);
            border-color: rgba(255, 255, 255, 0.15);
        }
        
        .data-card-img {
            height: 28px;
            width: auto;
            max-width: 100%;
            object-fit: contain;
            margin-bottom: 8px;
        }
        
        .data-card-title {
            font-size: 0.75rem;
            font-weight: 600;
            line-height: 1.2;
            margin-bottom: 4px;
        }
        
        .data-card-subtitle {
            font-size: 0.65rem;
            opacity: 0.6;
            line-height: 1.2;
        }
        
        .data-card-account {
            font-size: 0.7rem;
            font-family: monospace;
            background: rgba(255,255,255,0.1);
            padding: 2px 6px;
            border-radius: 4px;
            margin-top: 6px;
        }
        
        .data-card-qr {
            width: 32px;
            height: 32px;
            margin-top: 8px;
            border-radius: 4px;
            cursor: zoom-in;
            border: 1px solid rgba(255,255,255,0.2);
        }

        /* ==================== BOTTOM BAR ==================== */
        .footer-bottom-bar {
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            padding-top: 24px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;
            gap: 16px;
            font-size: 0.8rem;
            opacity: 0.7;
            text-align: center;
        }
        
        @media (min-width: 768px) {
            .footer-bottom-bar {
                flex-direction: row;
                text-align: left;
            }
        }

        /* ==================== LAYOUT OVERRIDES ==================== */
        .layout-centered .footer-main-grid { text-align: center; }
        .layout-centered .social-icons-wrapper, 
        .layout-centered .contact-item, 
        .layout-centered .country-selector-box,
        .layout-centered .footer-section-title { justify-content: center; }
        .layout-centered .app-store-btn { margin: 0 auto; }
        .layout-minimal .footer-brand-desc, .layout-minimal .app-links-grid, .layout-minimal .data-grid-container { display: none; }
    </style>
    `;
    document.head.insertAdjacentHTML('beforeend', styles);
}

// ============================================================================
// SVG ICONS DICTIONARY (Fallback for Social Links)
// ============================================================================
function getSVGIcon(platform) {
    const p = platform.toLowerCase().replace(/\s+/g, '');
    const svgs = {
        'facebook': `<svg viewBox="0 0 24 24" fill="none"><path d="M18 2H15C13.67 2 12.4 2.53 11.46 3.46C10.53 4.4 10 5.67 10 7V10H7V14H10V22H14V14H17L18 10H14V7C14 6.73 14.11 6.48 14.29 6.29C14.48 6.11 14.73 6 15 6H18V2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
        'instagram': `<svg viewBox="0 0 24 24" fill="none"><path d="M17 2H7C4.24 2 2 4.24 2 7V17C2 19.76 4.24 22 7 22H17C19.76 22 22 19.76 22 17V7C22 4.24 19.76 2 17 2Z" stroke="currentColor" stroke-width="2"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" stroke="currentColor" stroke-width="2"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor"/></svg>`,
        'youtube': `<svg viewBox="0 0 24 24" fill="none"><path d="M22.54 6.42C22.42 5.95 22.18 5.51 21.84 5.16C21.5 4.81 21.07 4.56 20.6 4.43C18.88 4 12 4 12 4C12 4 5.12 4 3.4 4.46C2.93 4.59 2.5 4.84 2.16 5.19C1.82 5.54 1.58 5.98 1.46 6.45C1.15 8.17 0.99 9.93 1 11.68C0.99 13.43 1.15 15.19 1.46 16.91C1.58 17.38 1.82 17.82 2.16 18.17C2.5 18.52 2.93 18.77 3.4 18.9C5.12 19.36 12 19.36 12 19.36C12 19.36 18.88 19.36 20.6 18.9C21.07 18.77 21.5 18.52 21.84 18.17C22.18 17.82 22.42 17.38 22.54 16.91C22.85 15.19 23.01 13.43 23 11.68C23.01 9.93 22.85 8.17 22.54 6.42Z" stroke="currentColor" stroke-width="2"/><path d="M9.75 15.02L15.5 11.68L9.75 8.34V15.02Z" stroke="currentColor" stroke-width="2"/></svg>`,
        'tiktok': `<svg viewBox="0 0 24 24" fill="none"><path d="M9 12V8.5C9 6.01 11.01 4 13.5 4H16M9 20C7.34 20 6 18.66 6 17C6 15.34 7.34 14 9 14C10.66 14 12 15.34 12 17V4M20 8V12C18.34 12 17 10.66 17 9V8H20Z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
        'x': `<svg viewBox="0 0 24 24" fill="none"><path d="M18.24 2.25H21.55L14.33 10.51L22.83 21.75H16.17L10.96 14.93L4.99 21.75H1.68L9.41 12.92L1.25 2.25H8.08L12.79 8.48L18.24 2.25ZM17.08 19.77H18.92L7.08 4.13H5.12L17.08 19.77Z" fill="currentColor"/></svg>`,
        'linkedin': `<svg viewBox="0 0 24 24" fill="none"><path d="M6 9H2V21H6V9Z" stroke="currentColor" stroke-width="2"/><path d="M22 12V21H18V12C18 10.5 17.5 9 16 9C14.5 9 14 10.5 14 12V21H10V9H14V11C14 11 14.5 9.5 16.5 9.5C18.5 9.5 22 10.5 22 12Z" stroke="currentColor" stroke-width="2"/><circle cx="4" cy="4" r="2" stroke="currentColor" stroke-width="2"/></svg>`
    };
    return svgs[p] || `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>`;
}

// ============================================================================
// MAIN RENDER ENGINE
// ============================================================================
async function renderFooter() {
    if (document.getElementById('main-footer')) return;
    injectFooterStyles();

    try {
        const response = await fetch('/api/footer/complete');
        if (!response.ok) throw new Error('API Request Failed');
        const data = await response.json();
        
        // Extract All 11 Data Arrays/Objects
        const content = data.content || [];
        const socialLinks = data.socialLinks || [];
        const menus = data.menus || [];
        const payments = data.paymentMethods || [];
        const shipping = data.shippingPartners || [];
        const certs = data.certifications || [];
        const apps = data.appLinks || [];
        const countries = data.countries || [];
        const badges = data.trustBadges || [];
        const settings = data.settings || {};

        // 1. Footer Settings Map
        const bgColor = settings.background_color || '#0a0a0a';
        const textColor = settings.text_color || '#ffffff';
        const cssClass = settings.layout_style ? `layout-${settings.layout_style}` : '';
        const customCss = settings.custom_css ? `<style>${settings.custom_css}</style>` : '';
        const versionLabel = settings.version ? `v${settings.version}` : '';
        
        // 2. Content Map (Logo, Brand Info, Contact)
        let brandObj = { title: '', desc: '', logo: '', copyright: settings.copyright_text || '' };
        let contactObj = { email: '', phone: '', address: '', hours: '' };
        
        content.forEach(c => {
            if (c.title) brandObj.title = c.title;
            if (c.description) brandObj.desc = c.description;
            if (c.logo_url) brandObj.logo = c.logo_url;
            if (c.copyright_text) brandObj.copyright = c.copyright_text;
            if (c.email) contactObj.email = c.email;
            if (c.phone) contactObj.phone = c.phone;
            if (c.address) contactObj.address = c.address;
            if (c.working_hours) contactObj.hours = c.working_hours;
        });

        // 3. Social Links Generator
        let socialHTML = '';
        if (settings.show_social_links !== false && socialLinks.length > 0) {
            const sortedSocial = [...socialLinks].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
            socialHTML = `<div class="social-icons-wrapper">` + sortedSocial.map(link => {
                const title = link.hover_title || link.platform_name || '';
                const icon = (link.platform_icon && link.platform_icon.trim() !== '') 
                    ? `<img src="${link.platform_icon}" alt="${link.platform_name}">` 
                    : getSVGIcon(link.platform_name);
                return `<a href="${link.link_url}" target="_blank" rel="noopener noreferrer" class="social-icon-btn" aria-label="${link.platform_name}" title="${title}">${icon}</a>`;
            }).join('') + `</div>`;
        }

        // 4. App Links Generator
        let appHTML = '';
        if (settings.show_app_links !== false && apps.length > 0) {
            const sortedApps = [...apps].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
            const appBtns = sortedApps.map(app => {
                let html = '';
                const img = app.icon_url ? `<img src="${app.icon_url}" alt="Icon">` : '';
                if (app.app_store_url) html += `<a href="${app.app_store_url}" target="_blank" class="app-store-btn" title="Download on App Store">${img} App Store</a>`;
                if (app.play_store_url) html += `<a href="${app.play_store_url}" target="_blank" class="app-store-btn" title="Get it on Google Play">${img} Play Store</a>`;
                return html;
            }).join('');
            if (appBtns) {
                appHTML = `<div class="footer-section"><h5 class="footer-section-title">Download App</h5><div class="app-links-grid">${appBtns}</div></div>`;
            }
        }

        // 5. Country Selector Generator
        let countryHTML = '';
        if (settings.show_country_selector !== false && countries.length > 0) {
            const sortedCountries = [...countries].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
            const activeCountry = sortedCountries.find(c => c.is_default) || sortedCountries[0];
            
            const options = sortedCountries.map(c => {
                const name = c.country_name || '';
                const curr = c.currency_code ? `- ${c.currency_code} (${c.currency_symbol || ''})` : '';
                const lang = c.language_name ? `| ${c.language_name}` : '';
                const isSel = (c.country_code === activeCountry.country_code) ? 'selected' : '';
                return `<option value="?country=${c.country_code}&lang=${c.language_code || ''}" ${isSel}>${name} ${curr} ${lang}</option>`;
            }).join('');

            const flagImg = activeCountry.flag_url ? `<img src="${activeCountry.flag_url}" class="active-flag-icon" alt="${activeCountry.country_code}">` : '';
            const exRate = (activeCountry.exchange_rate && activeCountry.exchange_rate != 1) 
                ? `<span class="exchange-rate-text">1 USD = ${activeCountry.currency_symbol || ''} ${activeCountry.exchange_rate}</span>` : '';

            countryHTML = `
            <div class="footer-section">
                <h5 class="footer-section-title">Region & Language</h5>
                <div class="country-selector-box">
                    ${flagImg}
                    <select class="country-dropdown" onchange="if(this.value) window.location.href=this.value">
                        ${options}
                    </select>
                </div>
                ${exRate}
            </div>`;
        }

        // 6. Generic Data Grid Builder (For Payments, Shipping, Certs, Badges)
        const buildGrid = (dataArray, showSetting, sectionTitle, extraFields = {}) => {
            if (showSetting === false || !dataArray || dataArray.length === 0) return '';
            const sorted = [...dataArray].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
            
            const cardsHTML = sorted.map(item => {
                const title = item.name || item.title || '';
                const imgUrl = item.icon_url || item.badge_url || '';
                
                // Elements
                const imgEl = imgUrl ? `<img src="${imgUrl}" alt="${title}" class="data-card-img">` : '';
                const titleEl = title ? `<span class="data-card-title">${title}</span>` : '';
                const subEl = item.subtitle ? `<span class="data-card-subtitle">${item.subtitle}</span>` : '';
                const accEl = (extraFields.account && item.account_number) ? `<span class="data-card-account">${item.account_number}</span>` : '';
                const qrEl = (extraFields.qr && item.qr_code_url) ? `<img src="${item.qr_code_url}" class="data-card-qr" title="Scan QR Code" onclick="window.open('${item.qr_code_url}')">` : '';
                
                const inner = `${imgEl}${titleEl}${subEl}${accEl}${qrEl}`;
                
                // Wrapper Link or Div
                if (extraFields.link && item.link_url) {
                    return `<a href="${item.link_url}" target="_blank" rel="noopener noreferrer" class="data-grid-card" title="${title}">${inner}</a>`;
                }
                return `<div class="data-grid-card" title="${title}">${inner}</div>`;
            }).join('');

            return `
            <div class="footer-section">
                <h5 class="footer-section-title">${sectionTitle}</h5>
                <div class="data-grid-container">${cardsHTML}</div>
            </div>`;
        };

        const paymentHTML = buildGrid(payments, settings.show_payment_methods, 'Payment Methods', { account: true, qr: true });
        const shippingHTML = buildGrid(shipping, true, 'Shipping Partners', {});
        const certHTML = buildGrid(certs, true, 'Certifications', { link: true });
        const badgesHTML = buildGrid(badges, true, 'Trust & Security', {});

        // 7. Dynamic Menus & Nested Quick Links
        let menusHTML = '';
        if (menus && menus.length > 0) {
            const sortedMenus = [...menus].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
            
            menusHTML = sortedMenus.map(menu => {
                const links = menu.links || [];
                const sortedLinks = [...links].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
                
                const parents = sortedLinks.filter(l => !l.parent_id);
                const children = sortedLinks.filter(l => l.parent_id);
                
                if (parents.length === 0) return '';
                
                const listHTML = parents.map(pLink => {
                    const icon = pLink.icon_class ? `<i class="${pLink.icon_class}"></i>` : '';
                    const target = pLink.open_in_new_tab ? 'target="_blank" rel="noopener"' : '';
                    const desc = pLink.description ? `<span class="link-desc">${pLink.description}</span>` : '';
                    
                    const myChildren = children.filter(c => c.parent_id === pLink.id);
                    let childHTML = '';
                    if (myChildren.length > 0) {
                        childHTML = `<ul class="nested-links-list">` + myChildren.map(cLink => {
                            const cIcon = cLink.icon_class ? `<i class="${cLink.icon_class}" style="margin-right:6px"></i>` : '';
                            const cTarget = cLink.open_in_new_tab ? 'target="_blank" rel="noopener"' : '';
                            const cDesc = cLink.description ? `<span class="link-desc" style="padding-left:0; margin-top:2px;">${cLink.description}</span>` : '';
                            return `<li><a href="${cLink.link_url || '#'}" ${cTarget}>${cIcon}${cLink.title}</a>${cDesc}</li>`;
                        }).join('') + `</ul>`;
                    }
                    
                    return `
                    <li>
                        <a href="${pLink.link_url || '#'}" ${target} class="link-title-wrap">
                            ${icon}<span>${pLink.title}</span>
                        </a>
                        ${desc}
                        ${childHTML}
                    </li>`;
                }).join('');

                return `
                <div class="footer-section">
                    <h5 class="footer-section-title">${menu.title}</h5>
                    <ul class="quick-links-list">${listHTML}</ul>
                </div>`;
            }).join('');
        }

        // 8. Contact Details Block
        let contactHTML = '';
        if (contactObj.email || contactObj.phone || contactObj.address || contactObj.hours) {
            contactHTML = `<div class="footer-section"><h5 class="footer-section-title">Contact Us</h5>`;
            if (contactObj.address) contactHTML += `<div class="contact-item"><span class="contact-icon">📍</span><div>${contactObj.address}</div></div>`;
            if (contactObj.phone) contactHTML += `<div class="contact-item"><span class="contact-icon">☎</span><div><a href="tel:${contactObj.phone}">${contactObj.phone}</a></div></div>`;
            if (contactObj.email) contactHTML += `<div class="contact-item"><span class="contact-icon">✉</span><div><a href="mailto:${contactObj.email}">${contactObj.email}</a></div></div>`;
            if (contactObj.hours) contactHTML += `<div class="contact-item"><span class="contact-icon">🕒</span><div>${contactObj.hours}</div></div>`;
            contactHTML += `</div>`;
        }

        // =====================================================================
        // RENDER FINAL HTML TO DOM
        // =====================================================================
        const fullHTML = `
        <footer class="pt-16 pb-8 ${cssClass}" id="main-footer" style="background: ${bgColor} !important; color: ${textColor} !important;">
            ${customCss}
            <div class="w-full px-6 lg:px-14 max-w-[1600px] mx-auto">
                <div class="footer-main-grid">
                    
                    <!-- COLUMN 1: Brand, Social, Apps, Country -->
                    <div>
                        ${brandObj.logo ? `<img src="${brandObj.logo}" alt="${brandObj.title}" class="footer-brand-logo">` : ''}
                        ${brandObj.title ? `<h4 class="footer-brand-title">${brandObj.title}</h4>` : ''}
                        ${brandObj.desc ? `<p class="footer-brand-desc">${brandObj.desc}</p>` : ''}
                        
                        ${socialHTML}
                        ${appHTML}
                        ${countryHTML}
                    </div>
                    
                    <!-- COLUMN 2 & 3: Dynamic Menus -->
                    ${menusHTML}
                    
                    <!-- COLUMN 4: Contact & Data Grids (Payments, Shipping, etc.) -->
                    <div>
                        ${contactHTML}
                        ${paymentHTML}
                        ${shippingHTML}
                        ${certHTML}
                        ${badgesHTML}
                    </div>
                    
                </div>
                
                <!-- BOTTOM BAR: Copyright & Attribution -->
                <div class="footer-bottom-bar">
                    <p>Powered by <a href="https://binzeo.vercel.app" target="_blank" rel="noopener" style="font-weight:600">BINZEO Infrastructure</a> ${versionLabel}</p>
                    <p>${brandObj.copyright}</p>
                </div>
            </div>
        </footer>
        `;
        
        document.body.insertAdjacentHTML('beforeend', fullHTML);
        
        // Handle RTL specific to Country Selection
        const defaultC = countries.find(c => c.is_default) || countries[0];
        if (defaultC && defaultC.is_rtl) {
            document.getElementById('main-footer').setAttribute('dir', 'rtl');
        }
        
    } catch (error) {
        console.error('Ultimate Footer Render Failed:', error);
    }
}

// Ensure execution when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderFooter);
} else {
    setTimeout(renderFooter, 100);
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { renderFooter };
}
