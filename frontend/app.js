// ============================================
// GLOBAL MILITARY INTELLIGENCE - MAIN APP
// ============================================

// Page Loader - Rotating status messages
(function () {
    const statusMessages = [
        'Loading Map Systems...',
        'Fetching Intelligence Data...',
        'Connecting to Global Networks...',
        'Processing Conflict Data...',
        'Analyzing Force Projections...',
        'Decrypting News Feeds...',
        'Systems Online'
    ];
    let msgIndex = 0;
    const statusEl = document.querySelector('.loader-status');
    if (statusEl) {
        const interval = setInterval(() => {
            msgIndex++;
            if (msgIndex < statusMessages.length) {
                statusEl.textContent = statusMessages[msgIndex];
            } else {
                clearInterval(interval);
            }
        }, 400);
    }
})();

// Fade out the loading screen when everything is loaded
window.addEventListener('load', function () {
    const loader = document.getElementById('page-loader');
    if (loader) {
        // Ensure a minimum display time of 1.5s for the animation to be visible
        const minTime = 1500;
        const elapsed = performance.now();
        const delay = Math.max(0, minTime - elapsed);
        setTimeout(() => {
            loader.classList.add('hidden');
            // Remove from DOM after transition completes
            setTimeout(() => loader.remove(), 700);
        }, delay);
    }
});

// Helper to dismiss section loaders
function dismissLoader(id, delay) {
    setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
            el.classList.add('hidden');
            setTimeout(() => el.remove(), 500);
        }
    }, delay || 300);
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function () {
    try { initAnimations(); } catch (e) { console.error('initAnimations error:', e); }
    try { initMap(); } catch (e) { console.error('initMap error:', e); }
    try { renderNationsGrid(); dismissLoader('nations-loader'); } catch (e) { console.error('renderNationsGrid error:', e); }
    try { initModalTabs(); } catch (e) { console.error('initModalTabs error:', e); }
    try { initScrollAnimations(); } catch (e) { console.error('initScrollAnimations error:', e); }
    try { animateCounters(); } catch (e) { console.error('animateCounters error:', e); }
    try { initCompare(); dismissLoader('compare-loader'); } catch (e) { console.error('initCompare error:', e); }
    try { initNews(); } catch (e) { console.error('initNews error:', e); }
    try { initConflicts(); } catch (e) { console.error('initConflicts error:', e); }
    try { initNavigation(); } catch (e) { console.error('initNavigation error:', e); }
    try { initSearch(); } catch (e) { console.error('initSearch error:', e); }
    try { initHistory(); dismissLoader('history-loader'); } catch (e) { console.error('initHistory error:', e); }
});

// ============================================
// NAVIGATION
// ============================================
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');

    if (mobileMenuBtn && nav) {
        mobileMenuBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            mobileMenuBtn.classList.toggle('active');
            nav.classList.toggle('active');
        });

        // Close mobile menu if clicked outside
        document.addEventListener('click', function (e) {
            if (!nav.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                mobileMenuBtn.classList.remove('active');
                nav.classList.remove('active');
            }
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            // Update active state
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            // Close mobile menu on link click
            if (mobileMenuBtn && nav) {
                mobileMenuBtn.classList.remove('active');
                nav.classList.remove('active');
            }
        });
    });

    // Update active link on scroll
    const sections = ['hero', 'map-section', 'compare-section', 'news-section', 'conflicts-section', 'history-section', 'footer'];

    window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY + 100;

        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;

                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === '#' + sectionId) {
                            link.classList.add('active');
                        }
                    });
                }
            }
        });
    });
}

// ============================================
// SEARCH FUNCTIONALITY
// ============================================
function initSearch() {
    const searchInput = document.getElementById('nation-search');
    const searchResults = document.getElementById('search-results');
    const searchClear = document.getElementById('search-clear');

    if (!searchInput || !searchResults) return;

    // Handle input changes
    searchInput.addEventListener('input', function () {
        const query = this.value.trim().toLowerCase();

        // Toggle clear button visibility
        if (searchClear) {
            searchClear.classList.toggle('visible', query.length > 0);
        }

        if (query.length === 0) {
            searchResults.classList.remove('active');
            searchResults.innerHTML = '';
            return;
        }

        // Filter nations based on query
        const results = Object.entries(nationsData).filter(([key, nation]) => {
            return nation.name.toLowerCase().includes(query) ||
                key.toLowerCase().includes(query);
        }).slice(0, 8); // Limit to 8 results

        if (results.length === 0) {
            searchResults.innerHTML = `
                <div class="search-no-results">
                    <p>No nations found for "${query}"</p>
                </div>
            `;
            searchResults.classList.add('active');
            return;
        }

        // Render search results
        searchResults.innerHTML = results.map(([key, nation]) => `
            <div class="search-result-item" data-nation="${key}">
                <img class="search-result-flag" 
                     src="https://flagcdn.com/w80/${nation.countryCode}.png" 
                     alt="${nation.name} flag"
                     onerror="this.style.display='none'">
                <div class="search-result-info">
                    <div class="search-result-name">${nation.name}</div>
                    <div class="search-result-meta">Budget: ${nation.budget} • Personnel: ${nation.personnel.active.toLocaleString()}</div>
                </div>
                <span class="search-result-rank">#${nation.rank}</span>
            </div>
        `).join('');

        searchResults.classList.add('active');

        // Add click handlers to results
        searchResults.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', function () {
                const nationKey = this.dataset.nation;
                openNationModal(nationKey);
                searchInput.value = '';
                searchResults.classList.remove('active');
                searchResults.innerHTML = '';
                if (searchClear) searchClear.classList.remove('visible');
            });
        });
    });

    // Handle clear button click
    if (searchClear) {
        searchClear.addEventListener('click', function () {
            searchInput.value = '';
            searchResults.classList.remove('active');
            searchResults.innerHTML = '';
            this.classList.remove('visible');
            searchInput.focus();
        });
    }

    // Close results when clicking outside
    document.addEventListener('click', function (e) {
        if (!e.target.closest('.search-container')) {
            searchResults.classList.remove('active');
        }
    });

    // Handle keyboard navigation
    searchInput.addEventListener('keydown', function (e) {
        const items = searchResults.querySelectorAll('.search-result-item');
        const activeItem = searchResults.querySelector('.search-result-item:hover, .search-result-item.active');

        if (e.key === 'Escape') {
            searchResults.classList.remove('active');
            searchInput.blur();
        }

        if (e.key === 'Enter' && activeItem) {
            activeItem.click();
        }
    });
}

// ============================================
// ANIMATIONS WITH GSAP
// ============================================
function initAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    // Hero animations
    gsap.from('.hero-title .title-line', {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out'
    });

    gsap.from('.hero-subtitle', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        delay: 0.5,
        ease: 'power3.out'
    });

    gsap.from('.hero-stats .stat-item', {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        delay: 0.8,
        ease: 'power3.out'
    });

    gsap.from('.hero-actions .btn', {
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        delay: 1.2,
        ease: 'power3.out'
    });
}

function initScrollAnimations() {
    // Section headers animation
    gsap.utils.toArray('.section-header').forEach(header => {
        gsap.from(header, {
            scrollTrigger: {
                trigger: header,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out'
        });
    });

    // Nation cards animation
    gsap.utils.toArray('.nation-card').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            y: 50,
            opacity: 0,
            duration: 0.6,
            delay: i * 0.1,
            ease: 'power3.out'
        });
    });

    // Branch cards animation
    gsap.utils.toArray('.branch-card').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            y: 50,
            opacity: 0,
            duration: 0.6,
            delay: i * 0.15,
            ease: 'power3.out'
        });
    });
}

// Animated counter for statistics
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number[data-target]');

    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const start = 0;
        const startTime = performance.now();

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.floor(start + (target - start) * easeProgress);

            counter.textContent = formatNumber(currentValue);

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        }

        requestAnimationFrame(updateCounter);
    });
}

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(0) + 'K';
    }
    return num.toString();
}

// ============================================
// INTERACTIVE MAP
// ============================================
let map;
let markers = [];

function initMap() {
    map = L.map('world-map', {
        center: [30, 0],
        zoom: 2,
        minZoom: 2,
        maxZoom: 6,
        worldCopyJump: true,
        maxBounds: [[-90, -180], [90, 180]]
    });

    const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
        className: 'dark-tiles'
    }).addTo(map);

    // Dismiss map loader when tiles finish loading
    tileLayer.on('load', function () {
        dismissLoader('map-loader', 200);
    });

    // Add markers for each nation
    Object.keys(nationsData).forEach(key => {
        const nation = nationsData[key];
        const coords = countryCoords[key];

        if (coords) {
            const color = getMarkerColor(nation.rank);

            const marker = L.circleMarker(coords, {
                radius: 12,
                fillColor: color,
                color: '#ffffff',
                weight: 2,
                opacity: 1,
                fillOpacity: 0.8
            }).addTo(map);

            // Add nuclear icon for nuclear weapon states
            if (nation.nuclear && nation.nuclear.status) {
                const nuclearIcon = L.divIcon({
                    className: 'nuclear-map-icon',
                    html: `<div class="nuclear-marker" title="Nuclear Weapon State">☢</div>`,
                    iconSize: [20, 20],
                    iconAnchor: [-8, 10]
                });
                L.marker(coords, { icon: nuclearIcon, interactive: false }).addTo(map);
            }

            const nuclearInfo = nation.nuclear && nation.nuclear.status
                ? `<div class="nhc-nuclear">☢ ${nation.nuclear.warheads.toLocaleString()} warheads</div>`
                : '';

            const budgetClean = nation.budget || 'N/A';

            marker.bindTooltip(`
                <div class="nation-hover-card">
                    <div class="nhc-header">
                        <img src="${getFlagUrl(nation.countryCode, 'w80')}" alt="${nation.name}" class="nhc-flag">
                        <div class="nhc-info">
                            <h4 class="nhc-name">${nation.name}</h4>
                            <span class="nhc-rank">Rank #${nation.rank}</span>
                        </div>
                    </div>
                    <div class="nhc-stats">
                        <div class="nhc-stat">
                            <span class="nhc-stat-label">Personnel</span>
                            <span class="nhc-stat-value">${nation.personnel.active.toLocaleString()}</span>
                        </div>
                        <div class="nhc-stat">
                            <span class="nhc-stat-label">Budget</span>
                            <span class="nhc-stat-value">${budgetClean}</span>
                        </div>
                    </div>
                    ${nuclearInfo}
                    <div class="nhc-hint">Click to view full profile →</div>
                </div>
            `, {
                className: 'nation-tooltip',
                direction: 'auto',
                offset: [0, -10],
                opacity: 1,
                sticky: false
            });

            marker.on('click', function () {
                openNationModal(key);
            });

            marker.on('mouseover', function () {
                this.setRadius(16);
                this.setStyle({ weight: 3, fillOpacity: 1 });
            });

            marker.on('mouseout', function () {
                this.setRadius(12);
                this.setStyle({ weight: 2, fillOpacity: 0.8 });
            });

            markers.push(marker);
        }
    });

    // Nuclear Proliferation Lines - showing where each nuclear nation got its weapons technology
    const nuclearProliferationRoutes = [
        {
            from: 'USA', to: 'UK',
            label: 'Manhattan Project Collaboration (1943)',
            description: 'UK scientists participated in the Manhattan Project; later received US nuclear sharing'
        },
        {
            from: 'USA', to: 'Russia',
            label: 'Nuclear Espionage (1945)',
            description: 'Soviet spies (Klaus Fuchs, etc.) obtained nuclear secrets from the Manhattan Project'
        },
        {
            from: 'Russia', to: 'China',
            label: 'Soviet Nuclear Assistance (1955)',
            description: 'USSR provided nuclear reactor technology and training to China in the 1950s'
        },
        {
            from: 'France', to: 'Israel',
            label: 'Dimona Reactor (1958)',
            description: 'France helped build the Dimona nuclear facility in the Negev desert'
        },
        {
            from: 'Russia', to: 'NorthKorea',
            label: 'Soviet-era Assistance (1960s)',
            description: 'USSR provided research reactor and nuclear training to North Korea'
        },
        {
            from: 'China', to: 'Pakistan',
            label: 'Nuclear & Missile Technology Transfer (1980s)',
            description: 'China provided weapon design (CHIC-4), highly enriched uranium, Khushab reactor assistance, and M-11 missile technology to Pakistan'
        }
    ];

    // Function to create curved line points between two coordinates
    function getCurvedPoints(from, to, numPoints = 30) {
        const points = [];
        const midLat = (from[0] + to[0]) / 2;
        const midLng = (from[1] + to[1]) / 2;

        // Calculate offset for curve based on distance
        const latDiff = Math.abs(from[0] - to[0]);
        const lngDiff = Math.abs(from[1] - to[1]);
        const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);
        const curveOffset = distance * 0.2;

        // Perpendicular offset for the curve
        const angle = Math.atan2(to[0] - from[0], to[1] - from[1]);
        const offsetLat = midLat + curveOffset * Math.cos(angle + Math.PI / 2);
        const offsetLng = midLng + curveOffset * Math.sin(angle + Math.PI / 2);

        for (let i = 0; i <= numPoints; i++) {
            const t = i / numPoints;
            // Quadratic Bezier curve
            const lat = (1 - t) * (1 - t) * from[0] + 2 * (1 - t) * t * offsetLat + t * t * to[0];
            const lng = (1 - t) * (1 - t) * from[1] + 2 * (1 - t) * t * offsetLng + t * t * to[1];
            points.push([lat, lng]);
        }
        return points;
    }

    // Draw proliferation lines
    const proliferationLines = [];

    nuclearProliferationRoutes.forEach(route => {
        const fromCoords = countryCoords[route.from];
        const toCoords = countryCoords[route.to];

        if (fromCoords && toCoords) {
            const curvedPoints = getCurvedPoints(fromCoords, toCoords);

            // Background glow line
            const glowLine = L.polyline(curvedPoints, {
                color: '#f59e0b',
                weight: 4,
                opacity: 0.15,
                smoothFactor: 1,
                className: 'proliferation-glow'
            }).addTo(map);

            // Main dashed line
            const line = L.polyline(curvedPoints, {
                color: '#f59e0b',
                weight: 2,
                opacity: 0.6,
                dashArray: '8, 6',
                smoothFactor: 1,
                className: 'proliferation-line'
            }).addTo(map);

            // Add arrow marker at the destination (midpoint of last segment)
            const arrowIdx = Math.floor(curvedPoints.length * 0.75);
            const arrowCoords = curvedPoints[arrowIdx];
            const arrowIcon = L.divIcon({
                className: 'proliferation-arrow-icon',
                html: `<div class="proliferation-arrow">▶</div>`,
                iconSize: [12, 12],
                iconAnchor: [6, 6]
            });
            const arrowMarker = L.marker(arrowCoords, { icon: arrowIcon, interactive: false }).addTo(map);

            // Tooltip on the line
            const fromName = nationsData[route.from].name;
            const toName = nationsData[route.to].name;
            line.bindTooltip(`
                <div style="text-align: center; max-width: 250px;">
                    <div style="font-weight: 700; color: #f59e0b; margin-bottom: 4px;">
                        ☢ ${route.label}
                    </div>
                    <div style="font-size: 0.85em; color: #ccc;">
                        ${fromName} → ${toName}
                    </div>
                    <div style="font-size: 0.8em; color: #999; margin-top: 4px;">
                        ${route.description}
                    </div>
                </div>
            `, { sticky: true, className: 'proliferation-tooltip' });

            proliferationLines.push(glowLine, line, arrowMarker);
        }
    });

    // Store proliferation lines for toggle
    window.proliferationLines = proliferationLines;
    window.proliferationVisible = true;
}

function getMarkerColor(rank) {
    if (rank <= 5) return '#22c55e';
    if (rank <= 10) return '#3b82f6';
    if (rank <= 20) return '#f59e0b';
    return '#6b7280';
}

function scrollToMap() {
    document.getElementById('map-section').scrollIntoView({
        behavior: 'smooth'
    });
}

// ============================================
// NATIONS GRID
// ============================================
function renderNationsGrid() {
    const grid = document.getElementById('nations-grid');
    const featuredNations = ['USA', 'Russia', 'China', 'India', 'UK', 'France', 'NorthKorea', 'Japan'];

    // Get all other nations not in featured list
    const otherNations = Object.keys(nationsData)
        .filter(key => !featuredNations.includes(key))
        .sort((a, b) => nationsData[a].rank - nationsData[b].rank);

    // Render featured nations
    const featuredHtml = featuredNations.map(key => renderNationCard(key)).join('');

    // Render other nations (hidden initially)
    const otherHtml = otherNations.map(key => renderNationCard(key)).join('');

    grid.innerHTML = featuredHtml + `
        <div class="show-more-nations-container">
            <button class="show-more-nations-btn" id="show-more-nations-btn" onclick="toggleOtherNations()">
                <span class="show-more-text">Click for Other Nations</span>
                <span class="show-more-icon">▼</span>
            </button>
        </div>
        <div class="other-nations-grid" id="other-nations-grid" style="display: none;">
            ${otherHtml}
        </div>
    `;
}

function renderNationCard(key) {
    const nation = nationsData[key];
    const nuclearBadge = nation.nuclear && nation.nuclear.status
        ? `<div class="nation-nuclear-badge">
                <span class="nuclear-icon">☢</span>
                <span>${nation.nuclear.warheads.toLocaleString()} Warheads</span>
                ${nation.nuclear.type === 'Undeclared' ? '<span class="nuclear-undeclared">(Undeclared)</span>' : ''}
           </div>`
        : '';
    return `
        <div class="nation-card" onclick="openNationModal('${key}')">
            ${getFollowBtnHtml('nation', key)}
            <div class="nation-card-header">
                <div class="nation-flag">
                    <img src="${getFlagUrl(nation.countryCode)}" alt="${nation.name} flag">
                </div>
                <div>
                    <h3 class="nation-name">${nation.name}</h3>
                    <p class="nation-rank">Rank #${nation.rank}</p>
                </div>
            </div>
            ${nuclearBadge}
            <div class="nation-stats">
                <div class="nation-stat">
                    <div class="nation-stat-value">${formatNumber(nation.personnel.active)}</div>
                    <div class="nation-stat-label">Personnel</div>
                </div>
                <div class="nation-stat">
                    <div class="nation-stat-value">${nation.budget}</div>
                    <div class="nation-stat-label">Budget</div>
                </div>
                <div class="nation-stat">
                    <div class="nation-stat-value">${formatNumber(nation.army.tanks)}</div>
                    <div class="nation-stat-label">Tanks</div>
                </div>
                <div class="nation-stat">
                    <div class="nation-stat-value">${formatNumber(nation.airforce.fighters)}</div>
                    <div class="nation-stat-label">Aircraft</div>
                </div>
            </div>
        </div>
    `;
}

let otherNationsVisible = false;

function toggleOtherNations() {
    const otherGrid = document.getElementById('other-nations-grid');
    const btn = document.getElementById('show-more-nations-btn');
    otherNationsVisible = !otherNationsVisible;

    if (otherNationsVisible) {
        otherGrid.style.display = '';
        btn.querySelector('.show-more-text').textContent = 'Show Less';
        btn.querySelector('.show-more-icon').textContent = '▲';
        btn.classList.add('active');

        // Animate cards in
        const cards = otherGrid.querySelectorAll('.nation-card');
        cards.forEach((card, i) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, i * 80);
        });
    } else {
        otherGrid.style.display = 'none';
        btn.querySelector('.show-more-text').textContent = 'Click for Other Nations';
        btn.querySelector('.show-more-icon').textContent = '▼';
        btn.classList.remove('active');
    }
}

// ============================================
// MODAL FUNCTIONALITY
// ============================================
let currentNation = null;
let currentTab = 'overview';

function openNationModal(nationKey) {
    currentNation = nationKey;
    const nation = nationsData[nationKey];
    const modal = document.getElementById('nation-modal');

    document.getElementById('modal-flag').innerHTML = `<img src="${getFlagUrl(nation.countryCode, 'w160')}" alt="${nation.name} flag" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">`;
    document.getElementById('modal-nation-name').textContent = nation.name;
    document.getElementById('modal-nation-rank').textContent = `Global Rank: #${nation.rank}`;

    // Add follow button to modal header
    const modalNationInfo = document.querySelector('#nation-modal .nation-info');
    let existingFollowBtn = document.getElementById('modal-follow-btn');
    if (existingFollowBtn) existingFollowBtn.remove();
    if (modalNationInfo) {
        const followBtn = document.createElement('button');
        followBtn.id = 'modal-follow-btn';
        const following = isFollowing('nation', nationKey);
        followBtn.className = 'modal-follow-btn' + (following ? ' active' : '');
        followBtn.innerHTML = following ? '★ Following' : '☆ Follow Nation';
        followBtn.title = following ? 'Unfollow this nation' : 'Add to Intel Watchlist';
        followBtn.onclick = function (e) { toggleWatchlistItem('nation', nationKey, e); };
        modalNationInfo.appendChild(followBtn);
    }

    // Set active tab
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector('.tab-btn[data-tab="overview"]').classList.add('active');

    currentTab = 'overview';
    renderModalContent();

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Show scroll indicator and set up scroll tracking
    const scrollIndicator = document.getElementById('modal-scroll-indicator');
    const modalContent = modal.querySelector('.modal-content');
    if (scrollIndicator) {
        scrollIndicator.classList.remove('hidden');
        // Scroll to top on open
        if (modalContent) modalContent.scrollTop = 0;
        // Track scrolling to hide indicator
        if (modalContent) {
            modalContent.onscroll = function () {
                const nearBottom = modalContent.scrollTop + modalContent.clientHeight >= modalContent.scrollHeight - 80;
                const hasScrolled = modalContent.scrollTop > 100;
                if (nearBottom || hasScrolled) {
                    scrollIndicator.classList.add('hidden');
                } else {
                    scrollIndicator.classList.remove('hidden');
                }
            };
        }
    }
}

function scrollModalDown() {
    const modal = document.getElementById('nation-modal');
    const modalContent = modal ? modal.querySelector('.modal-content') : null;
    if (modalContent) {
        modalContent.scrollBy({ top: 400, behavior: 'smooth' });
    }
}

function closeModal() {
    const modal = document.getElementById('nation-modal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

function initModalTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentTab = this.getAttribute('data-tab');
            renderModalContent();
            // Reset scroll indicator on tab change
            const scrollInd = document.getElementById('modal-scroll-indicator');
            const mc = document.querySelector('#nation-modal .modal-content');
            if (scrollInd) scrollInd.classList.remove('hidden');
            if (mc) mc.scrollTop = 0;
        });
    });
}

function renderModalContent() {
    const body = document.getElementById('modal-body');
    const nation = nationsData[currentNation];

    switch (currentTab) {
        case 'overview':
            body.innerHTML = renderOverview(nation);
            break;
        case 'army':
            body.innerHTML = renderArmy(nation);
            break;
        case 'navy':
            body.innerHTML = renderNavy(nation);
            break;
        case 'airforce':
            body.innerHTML = renderAirforce(nation);
            break;
    }

    // Animate content
    gsap.from(body.children, {
        y: 20,
        opacity: 0,
        duration: 0.4,
        stagger: 0.1,
        ease: 'power2.out'
    });
}

function renderOverview(nation) {
    const nationImage = nation.image || 'https://images.unsplash.com/photo-1569974507005-6dc61f97fb5c?w=800&h=400&fit=crop';
    const nationDescription = nation.description || `${nation.name} maintains a strong military force with comprehensive land, sea, and air capabilities, contributing to regional and global security.`;

    return `
        <div class="branch-hero">
            <img src="${nationImage}" alt="${nation.name} Armed Forces" onerror="this.style.display='none'">
            <div class="branch-hero-overlay">
                <h3>${nation.name} Armed Forces</h3>
            </div>
        </div>
        <div class="branch-description">
            <p>${nationDescription}</p>
        </div>
        <div class="overview-grid">
            <div class="overview-stat">
                <div class="overview-stat-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                        <circle cx="9" cy="7" r="4"/>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                </div>
                <div class="overview-stat-value">${nation.personnel.active.toLocaleString()}</div>
                <div class="overview-stat-label">Active Personnel</div>
            </div>
            <div class="overview-stat">
                <div class="overview-stat-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                        <circle cx="9" cy="7" r="4"/>
                    </svg>
                </div>
                <div class="overview-stat-value">${nation.personnel.reserve.toLocaleString()}</div>
                <div class="overview-stat-label">Reserve Personnel</div>
            </div>
            <div class="overview-stat">
                <div class="overview-stat-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                        <line x1="1" y1="10" x2="23" y2="10"/>
                    </svg>
                </div>
                <div class="overview-stat-value">${nation.budget}</div>
                <div class="overview-stat-label">Defense Budget</div>
            </div>
            <div class="overview-stat">
                <div class="overview-stat-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                </div>
                <div class="overview-stat-value">#${nation.rank}</div>
                <div class="overview-stat-label">Global Ranking</div>
            </div>
        </div>
        <div class="overview-grid">
            <div class="overview-stat">
                <div class="overview-stat-value">${nation.army.tanks.toLocaleString()}</div>
                <div class="overview-stat-label">Main Battle Tanks</div>
            </div>
            <div class="overview-stat">
                <div class="overview-stat-value">${nation.navy.carriers + nation.navy.submarines + nation.navy.destroyers + nation.navy.frigates}</div>
                <div class="overview-stat-label">Naval Vessels</div>
            </div>
            <div class="overview-stat">
                <div class="overview-stat-value">${nation.airforce.fighters.toLocaleString()}</div>
                <div class="overview-stat-label">Fighter Aircraft</div>
            </div>
            <div class="overview-stat">
                <div class="overview-stat-value">${nation.airforce.helicopters.toLocaleString()}</div>
                <div class="overview-stat-label">Helicopters</div>
            </div>
        </div>
    `;
}

function renderArmy(nation) {
    const armyImage = nation.army.image || 'https://images.unsplash.com/photo-1534996858221-380b92700493?w=800&h=400&fit=crop';
    const armyName = nation.army.name || `${nation.name} Army`;
    const armyFounded = nation.army.founded || 'N/A';
    const armyMotto = nation.army.motto || 'Land Forces';
    const armyDescription = nation.army.description || `The ground forces of ${nation.name}, responsible for land-based military operations.`;

    return `
        <div class="branch-hero">
            <img src="${armyImage}" alt="${armyName}" onerror="this.style.display='none'">
            <div class="branch-hero-overlay">
                <h3>${armyName}</h3>
            </div>
        </div>
        <div class="branch-info">
            <div class="branch-meta">
                <span class="branch-meta-item"><strong>Founded:</strong> ${armyFounded}</span>
                <span class="branch-meta-item"><strong>Motto:</strong> "${armyMotto}"</span>
            </div>
            <p class="branch-description">${armyDescription}</p>
        </div>
        <div class="equipment-section">
            <h3>🔢 Force Strength</h3>
            <div class="equipment-grid">
                <div class="equipment-item">
                    <span class="equipment-name">Main Battle Tanks</span>
                    <span class="equipment-count">${nation.army.tanks.toLocaleString()}</span>
                </div>
                <div class="equipment-item">
                    <span class="equipment-name">Armored Personnel Carriers</span>
                    <span class="equipment-count">${nation.army.apc.toLocaleString()}</span>
                </div>
                <div class="equipment-item">
                    <span class="equipment-name">Artillery Systems</span>
                    <span class="equipment-count">${nation.army.artillery.toLocaleString()}</span>
                </div>
                <div class="equipment-item">
                    <span class="equipment-name">MLRS Systems</span>
                    <span class="equipment-count">${nation.army.mlrs.toLocaleString()}</span>
                </div>
            </div>
        </div>
        <div class="equipment-section">
            <h3>🛡️ Key Equipment</h3>
            <div class="equipment-cards">
                ${nation.army.equipment.map((eq, i) => renderEquipmentCard(eq, i)).join('')}
            </div>
        </div>
    `;
}

function renderNavy(nation) {
    const navyImage = nation.navy.image || 'https://images.unsplash.com/photo-1614028674026-a65e31bfd27c?w=800&h=400&fit=crop';
    const navyName = nation.navy.name || `${nation.name} Navy`;
    const navyFounded = nation.navy.founded || 'N/A';
    const navyMotto = nation.navy.motto || 'Sea Power';
    const navyDescription = nation.navy.description || `The naval forces of ${nation.name}, responsible for maritime defense and power projection.`;

    return `
        <div class="branch-hero">
            <img src="${navyImage}" alt="${navyName}" onerror="this.style.display='none'">
            <div class="branch-hero-overlay">
                <h3>${navyName}</h3>
            </div>
        </div>
        <div class="branch-info">
            <div class="branch-meta">
                <span class="branch-meta-item"><strong>Founded:</strong> ${navyFounded}</span>
                <span class="branch-meta-item"><strong>Motto:</strong> "${navyMotto}"</span>
            </div>
            <p class="branch-description">${navyDescription}</p>
        </div>
        <div class="equipment-section">
            <h3>⚓ Fleet Composition</h3>
            <div class="equipment-grid">
                <div class="equipment-item">
                    <span class="equipment-name">Aircraft Carriers</span>
                    <span class="equipment-count">${nation.navy.carriers}</span>
                </div>
                <div class="equipment-item">
                    <span class="equipment-name">Submarines</span>
                    <span class="equipment-count">${nation.navy.submarines}</span>
                </div>
                <div class="equipment-item">
                    <span class="equipment-name">Destroyers</span>
                    <span class="equipment-count">${nation.navy.destroyers}</span>
                </div>
                <div class="equipment-item">
                    <span class="equipment-name">Frigates</span>
                    <span class="equipment-count">${nation.navy.frigates}</span>
                </div>
            </div>
        </div>
        <div class="equipment-section">
            <h3>🚢 Key Vessels</h3>
            <div class="equipment-cards">
                ${nation.navy.equipment.map((eq, i) => renderEquipmentCard(eq, i + 100)).join('')}
            </div>
        </div>
    `;
}

function renderAirforce(nation) {
    const airforceImage = nation.airforce.image || 'https://images.unsplash.com/photo-1559628233-100c798642d4?w=800&h=400&fit=crop';
    const airforceName = nation.airforce.name || `${nation.name} Air Force`;
    const airforceFounded = nation.airforce.founded || 'N/A';
    const airforceMotto = nation.airforce.motto || 'Air Superiority';
    const airforceDescription = nation.airforce.description || `The aerial warfare branch of ${nation.name}, providing air defense and strike capabilities.`;

    return `
        <div class="branch-hero">
            <img src="${airforceImage}" alt="${airforceName}" onerror="this.style.display='none'">
            <div class="branch-hero-overlay">
                <h3>${airforceName}</h3>
            </div>
        </div>
        <div class="branch-info">
            <div class="branch-meta">
                <span class="branch-meta-item"><strong>Founded:</strong> ${airforceFounded}</span>
                <span class="branch-meta-item"><strong>Motto:</strong> "${airforceMotto}"</span>
            </div>
            <p class="branch-description">${airforceDescription}</p>
        </div>
        <div class="equipment-section">
            <h3>✈️ Air Power</h3>
            <div class="equipment-grid">
                <div class="equipment-item">
                    <span class="equipment-name">Fighter Aircraft</span>
                    <span class="equipment-count">${nation.airforce.fighters.toLocaleString()}</span>
                </div>
                <div class="equipment-item">
                    <span class="equipment-name">Bombers</span>
                    <span class="equipment-count">${nation.airforce.bombers}</span>
                </div>
                <div class="equipment-item">
                    <span class="equipment-name">Transport Aircraft</span>
                    <span class="equipment-count">${nation.airforce.transport}</span>
                </div>
                <div class="equipment-item">
                    <span class="equipment-name">Helicopters</span>
                    <span class="equipment-count">${nation.airforce.helicopters.toLocaleString()}</span>
                </div>
            </div>
        </div>
        <div class="equipment-section">
            <h3>🎯 Key Aircraft</h3>
            <div class="equipment-cards">
                ${nation.airforce.equipment.map((eq, i) => renderEquipmentCard(eq, i + 200)).join('')}
            </div>
        </div>
    `;
}

// ============================================
// EQUIPMENT DETAIL RENDERING
// ============================================

// Map of equipment names to Wikipedia image URLs
const equipmentImages = {
    // USA Army
    "M1A2 Abrams": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Abrams-transparent.png/640px-Abrams-transparent.png",
    "M2 Bradley": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/M2a3-bradley.jpg/640px-M2a3-bradley.jpg",
    "Stryker": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Stryker_ICV_front_q.jpg/640px-Stryker_ICV_front_q.jpg",
    "M109 Paladin": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/M109A7_howitzer.jpg/640px-M109A7_howitzer.jpg",
    // USA Navy
    "Nimitz-class Carrier": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/USS_Carl_Vinson_%28CVN-70%29_underway_in_the_South_China_Sea_on_9_March_2017.JPG/640px-USS_Carl_Vinson_%28CVN-70%29_underway_in_the_South_China_Sea_on_9_March_2017.JPG",
    "Gerald R. Ford Carrier": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/USS_Gerald_R._Ford_%28CVN-78%29_underway_on_8_April_2017.jpg/640px-USS_Gerald_R._Ford_%28CVN-78%29_underway_on_8_April_2017.jpg",
    "Ohio-class SSBN": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/USS_Henry_M._Jackson_%28SSBN-730%29.jpg/640px-USS_Henry_M._Jackson_%28SSBN-730%29.jpg",
    "Virginia-class SSN": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/USS_Virginia_%28SSN-774%29.jpg/640px-USS_Virginia_%28SSN-774%29.jpg",
    // USA Air Force
    "F-35 Lightning II": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/F-35A_flight_%28cropped%29.jpg/640px-F-35A_flight_%28cropped%29.jpg",
    "F-22 Raptor": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Lockheed_Martin_F-22A_Raptor_JSOH.jpg/640px-Lockheed_Martin_F-22A_Raptor_JSOH.jpg",
    "F-16 Fighting Falcon": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/F-16_June_2008.jpg/640px-F-16_June_2008.jpg",
    "B-2 Spirit": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/B-2_Spirit_original.jpg/640px-B-2_Spirit_original.jpg",
    // Russia
    "T-90M": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/T-90A_-_Engineering_Technologies_2012_%281%29.jpg/640px-T-90A_-_Engineering_Technologies_2012_%281%29.jpg",
    "BMP-3": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/BMP-3_Khrizantema.jpg/640px-BMP-3_Khrizantema.jpg",
    "BTR-82A": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/BTR-82A_%283%29.jpg/640px-BTR-82A_%283%29.jpg",
    "2S19 Msta": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/2S19_Msta-S_of_the_Finnish_Army.jpg/640px-2S19_Msta-S_of_the_Finnish_Army.jpg",
    "Admiral Kuznetsov": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Admiral_Kuznetsov_aircraft_carrier.jpg/640px-Admiral_Kuznetsov_aircraft_carrier.jpg",
    "Borei-class SSBN": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Submarine_Yuri_Dolgorukiy.jpg/640px-Submarine_Yuri_Dolgorukiy.jpg",
    "Yasen-class SSN": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Yasen_class.jpg/640px-Yasen_class.jpg",
    "Kirov-class Battlecruiser": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Kirov-class_battlecruiser.jpg/640px-Kirov-class_battlecruiser.jpg",
    "Su-57 Felon": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Sukhoi_Su-57_at_MAKS_2019.jpg/640px-Sukhoi_Su-57_at_MAKS_2019.jpg",
    "Su-35 Flanker-E": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Su-35S_at_MAKS-2011.jpg/640px-Su-35S_at_MAKS-2011.jpg",
    "Su-34 Fullback": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Sukhoi_Su-34_at_MAKS-2007.jpg/640px-Sukhoi_Su-34_at_MAKS-2007.jpg",
    "Tu-160 Blackjack": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Tupolev_Tu-160_in_flight.jpg/640px-Tupolev_Tu-160_in_flight.jpg",
    // China
    "Type 99A": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/ZTZ-99A_MBT_20170716.jpg/640px-ZTZ-99A_MBT_20170716.jpg",
    "ZBD-04A": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/ZBD-04A_IFV_20170716.jpg/640px-ZBD-04A_IFV_20170716.jpg",
    "ZTL-11": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Chinese_assault_vehicle.jpg/640px-Chinese_assault_vehicle.jpg",
    "PLZ-05": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/PLZ-05_Self-propelled_Howitzer_20170919.jpg/640px-PLZ-05_Self-propelled_Howitzer_20170919.jpg",
    "Liaoning": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Aircraft_Carrier_Liaoning_CV-16.jpg/640px-Aircraft_Carrier_Liaoning_CV-16.jpg",
    "Type 094 SSBN": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Type_094_Jin_class.jpg/640px-Type_094_Jin_class.jpg",
    "Type 055 Destroyer": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Type_055_Destroyer.jpg/640px-Type_055_Destroyer.jpg",
    "Type 054A Frigate": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/CNS_Huangshan_%28FFG-570%29.jpg/640px-CNS_Huangshan_%28FFG-570%29.jpg",
    "J-20 Mighty Dragon": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/J-20_at_Airshow_China_2016.jpg/640px-J-20_at_Airshow_China_2016.jpg",
    "J-16": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/J-16_multirole_fighter.jpg/640px-J-16_multirole_fighter.jpg",
    "J-10C": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/J-10A_at_Airshow_China_2012.jpg/640px-J-10A_at_Airshow_China_2012.jpg",
    "H-6K": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Xian_H-6M.jpg/640px-Xian_H-6M.jpg",
    // India
    "Arjun Mk.II": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Arjun_MBT_bump_track.jpg/640px-Arjun_MBT_bump_track.jpg",
    "BMP-2 Sarath": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/BMP-2_in_Invasion_Day_Parade.jpg/640px-BMP-2_in_Invasion_Day_Parade.jpg",
    "K9 Vajra": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/2018.1.9_K-9_%EC%9E%90%EC%A3%BC%EB%B0%95%EA%B2%A9%ED%8F%AC_%EC%82%AC%EA%B2%A9%ED%9B%88%EB%A0%A8_%28Korea_Army_K-9_self-propelled_howitzer%29_%283%29.jpg/640px-2018.1.9_K-9_%EC%9E%90%EC%A3%BC%EB%B0%95%EA%B2%A9%ED%8F%AC_%EC%82%AC%EA%B2%A9%ED%9B%88%EB%A0%A8_%28Korea_Army_K-9_self-propelled_howitzer%29_%283%29.jpg",
    "Pinaka MLRS": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Pinaka_Multi_Barrel_Rocket_Launcher.jpg/640px-Pinaka_Multi_Barrel_Rocket_Launcher.jpg",
    "INS Vikramaditya": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/INS_Vikramaditya_%28R33%29_with_a_Sea_Harrier.jpg/640px-INS_Vikramaditya_%28R33%29_with_a_Sea_Harrier.jpg",
    "INS Arihant": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/INS_Arihant_SSBN.jpg/640px-INS_Arihant_SSBN.jpg",
    "Kolkata-class Destroyer": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/INS_Kolkata_%28D63%29.jpg/640px-INS_Kolkata_%28D63%29.jpg",
    "Shivalik-class Frigate": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/INS_Shivalik_%28F47%29.jpg/640px-INS_Shivalik_%28F47%29.jpg",
    "Rafale": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Rafale_-_RIAT_2009_%283751416421%29.jpg/640px-Rafale_-_RIAT_2009_%283751416421%29.jpg",
    "Su-30MKI": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Su-30MKI_at_Aero_India_2013.jpg/640px-Su-30MKI_at_Aero_India_2013.jpg",
    "HAL Tejas": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/HAL_Tejas_at_Aero_India_2013.jpg/640px-HAL_Tejas_at_Aero_India_2013.jpg",
    "AH-64 Apache": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/AH-64D_Apache_Longbow.jpg/640px-AH-64D_Apache_Longbow.jpg",
    // UK
    "Challenger 2": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Challenger_2_Main_Battle_Tank._MOD_45148007.jpg/640px-Challenger_2_Main_Battle_Tank._MOD_45148007.jpg",
    "Warrior IFV": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Warrior_infantry_fighting_vehicle.jpg/640px-Warrior_infantry_fighting_vehicle.jpg",
    "Boxer AFV": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Boxer_variant_GTK.jpg/640px-Boxer_variant_GTK.jpg",
    "AS90": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/AS90_self-propelled_gun.jpg/640px-AS90_self-propelled_gun.jpg",
    "HMS Queen Elizabeth": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/HMS_Queen_Elizabeth_in_Gibraltar_-_2018_%2828386226189%29.jpg/640px-HMS_Queen_Elizabeth_in_Gibraltar_-_2018_%2828386226189%29.jpg",
    "Vanguard-class SSBN": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Vanguard_at_Faslane_02.jpg/640px-Vanguard_at_Faslane_02.jpg",
    "Astute-class SSN": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/HMS_Astute_Arrives_at_Faslane_for_the_First_Time_MOD_45151270.jpg/640px-HMS_Astute_Arrives_at_Faslane_for_the_First_Time_MOD_45151270.jpg",
    "Type 45 Destroyer": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HMS_Diamond_2012.jpg/640px-HMS_Diamond_2012.jpg",
    "Eurofighter Typhoon": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Eurofighter_Typhoon_FGR4_3_%28cropped%29.jpg/640px-Eurofighter_Typhoon_FGR4_3_%28cropped%29.jpg",
    "F-35B Lightning": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/F-35B_Lightning_II_variants_%28cropped%29.jpg/640px-F-35B_Lightning_II_variants_%28cropped%29.jpg",
    "Boeing P-8 Poseidon": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/P-8A_Poseidon_of_VP-16_in_flight_2013.JPG/640px-P-8A_Poseidon_of_VP-16_in_flight_2013.JPG",
    "Chinook HC.6": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/CH-47_Chinook_helicopter_flyby.jpg/640px-CH-47_Chinook_helicopter_flyby.jpg",
    // France
    "Leclerc": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Leclerc-IMG_1744.jpg/640px-Leclerc-IMG_1744.jpg",
    "VBCI": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/VBCI_%28v%C3%A9hicule_blind%C3%A9_de_combat_d%27infanterie%29_%281%29.jpg/640px-VBCI_%28v%C3%A9hicule_blind%C3%A9_de_combat_d%27infanterie%29_%281%29.jpg",
    "CAESAR": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/CAESAR_-_self-propelled_howitzer.jpg/640px-CAESAR_-_self-propelled_howitzer.jpg",
    "VAB": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/VAB_armoured_personnel_carrier_DSC00846.jpg/640px-VAB_armoured_personnel_carrier_DSC00846.jpg",
    "Charles de Gaulle": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Charles_De_Gaulle_%28R91%29_underway_2009.jpg/640px-Charles_De_Gaulle_%28R91%29_underway_2009.jpg",
    "Triomphant-class SSBN": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Le_Triomphant.jpg/640px-Le_Triomphant.jpg",
    "Barracuda-class SSN": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Suffren_SSN.jpg/640px-Suffren_SSN.jpg",
    "FREMM Frigate": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Aquitaine-1.jpg/640px-Aquitaine-1.jpg",
    "Dassault Rafale": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Rafale_-_RIAT_2009_%283751416421%29.jpg/640px-Rafale_-_RIAT_2009_%283751416421%29.jpg",
    "Mirage 2000": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Mirage_2000C_in-flight_2_%28cropped%29.jpg/640px-Mirage_2000C_in-flight_2_%28cropped%29.jpg",
    "A400M Atlas": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/A400M-1969.jpg/640px-A400M-1969.jpg",
    "Tiger HAD": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Eurocopter_Tiger_2.jpg/640px-Eurocopter_Tiger_2.jpg"
};

// Generate a search-based image URL for equipment not in the map
function getEquipmentImageUrl(name) {
    if (equipmentImages[name]) {
        return equipmentImages[name];
    }
    // Fallback: use a placeholder with the equipment name
    return null;
}

// Render a clickable equipment card with expandable detail view
function renderEquipmentCard(eq, index) {
    const imageUrl = eq.image || getEquipmentImageUrl(eq.name);
    const cardId = `eq-${eq.name.replace(/[^a-zA-Z0-9]/g, '-')}-${index}`;

    const imageHtml = imageUrl
        ? `<div class="eq-detail-image">
               <img src="${imageUrl}" alt="${eq.name}" loading="lazy" 
                    onerror="this.parentElement.innerHTML='<div class=\\'eq-detail-placeholder\\'><svg width=\\'48\\' height=\\'48\\' viewBox=\\'0 0 24 24\\' fill=\\'none\\' stroke=\\'currentColor\\' stroke-width=\\'1.5\\'><rect x=\\'3\\' y=\\'3\\' width=\\'18\\' height=\\'18\\' rx=\\'2\\'/><circle cx=\\'8.5\\' cy=\\'8.5\\' r=\\'1.5\\'/><path d=\\'M21 15l-5-5L5 21\\'/></svg><p>${eq.name}</p></div>'">
           </div>`
        : `<div class="eq-detail-image">
               <div class="eq-detail-placeholder">
                   <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                       <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>
                   </svg>
                   <p>${eq.name}</p>
               </div>
           </div>`;

    return `
        <div class="equipment-card equipment-card-clickable" id="${cardId}" onclick="toggleEquipmentDetail('${cardId}')">
            <div class="equipment-card-header">
                <span class="equipment-card-name">${eq.name}</span>
                <span class="equipment-card-count">×${eq.count.toLocaleString()}</span>
            </div>
            ${eq.type ? `<span class="equipment-card-type">${eq.type}</span>` : ''}
            <div class="eq-click-hint">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="6 9 12 15 18 9"/>
                </svg>
                Click for details
            </div>
            <div class="eq-detail-panel" id="${cardId}-detail">
                ${imageHtml}
                <div class="eq-detail-info">
                    <div class="eq-detail-specs">
                        <div class="eq-spec-item">
                            <span class="eq-spec-label">Type</span>
                            <span class="eq-spec-value">${eq.type || 'Military Equipment'}</span>
                        </div>
                        <div class="eq-spec-item">
                            <span class="eq-spec-label">In Service</span>
                            <span class="eq-spec-value">${eq.count.toLocaleString()} units</span>
                        </div>
                    </div>
                    ${eq.description ? `<p class="eq-detail-desc">${eq.description}</p>` : ''}
                </div>
            </div>
        </div>
    `;
}

function toggleEquipmentDetail(cardId) {
    const card = document.getElementById(cardId);
    const detail = document.getElementById(cardId + '-detail');

    if (!card || !detail) return;

    // Only close other expanded cards within the SAME equipment section
    const parentContainer = card.closest('.equipment-cards');
    if (parentContainer) {
        parentContainer.querySelectorAll('.equipment-expanded').forEach(c => {
            if (c.id !== cardId) {
                c.classList.remove('equipment-expanded');
            }
        });
    }

    // Toggle this card
    card.classList.toggle('equipment-expanded');
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
function showPage(page) {
    if (page === 'compare') {
        document.getElementById('compare-section').scrollIntoView({ behavior: 'smooth' });
    }
    console.log('Switching to page:', page);
}

function showBranchInfo(branch) {
    console.log('Showing branch:', branch);
}

// Close modal on escape key
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// Close modal on outside click
document.querySelector('.modal-overlay')?.addEventListener('click', closeModal);

// ============================================
// COMPARE NATIONS FUNCTIONALITY
// ============================================
function initCompare() {
    const select1 = document.getElementById('nation1-select');
    const select2 = document.getElementById('nation2-select');

    if (!select1 || !select2) return;

    // Populate dropdowns with all nations sorted by rank
    const sortedNations = Object.keys(nationsData).sort((a, b) =>
        nationsData[a].rank - nationsData[b].rank
    );

    sortedNations.forEach(key => {
        const nation = nationsData[key];
        const option1 = document.createElement('option');
        option1.value = key;
        option1.textContent = `#${nation.rank} ${nation.name}`;
        select1.appendChild(option1);

        const option2 = option1.cloneNode(true);
        select2.appendChild(option2);
    });

    // Set default selections
    select1.value = 'USA';
    select2.value = 'Russia';
    updateComparison();
}

function updateComparison() {
    const select1 = document.getElementById('nation1-select');
    const select2 = document.getElementById('nation2-select');
    const nation1Key = select1.value;
    const nation2Key = select2.value;
    const resultsContainer = document.getElementById('compare-results');

    if (!nation1Key || !nation2Key) {
        resultsContainer.innerHTML = `
            <div class="compare-placeholder">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
                <p>Select two nations above to compare their military capabilities</p>
            </div>
        `;
        return;
    }

    // Prevent comparing the same nation
    if (nation1Key === nation2Key) {
        resultsContainer.innerHTML = `
            <div class="compare-placeholder compare-error">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ff4444" stroke-width="1.5">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="15" y1="9" x2="9" y2="15"/>
                    <line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
                <p style="color: #ff4444; font-weight: 600;">Cannot compare a nation with itself</p>
                <p style="color: var(--color-text-muted); font-size: 0.9rem;">Please select two different nations to compare their military capabilities</p>
            </div>
        `;
        // Reset the second dropdown
        select2.value = '';
        return;
    }

    const nation1 = nationsData[nation1Key];
    const nation2 = nationsData[nation2Key];

    resultsContainer.innerHTML = renderComparison(nation1, nation2);

    // Animate the bars
    setTimeout(() => {
        document.querySelectorAll('.compare-bar-fill').forEach(bar => {
            const width = bar.dataset.width;
            bar.style.width = width + '%';
        });
    }, 100);

    // Animate with GSAP
    gsap.from('.compare-header', {
        y: 20,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.out'
    });

    gsap.from('.compare-stats-section', {
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        delay: 0.2,
        ease: 'power2.out'
    });
}

function renderComparison(nation1, nation2) {
    const nuclearBadge1 = nation1.nuclear && nation1.nuclear.status
        ? `<span class="compare-nuclear-badge">☢ ${nation1.nuclear.warheads.toLocaleString()} Warheads</span>`
        : `<span class="compare-no-nuclear">No Nuclear Arsenal</span>`;
    const nuclearBadge2 = nation2.nuclear && nation2.nuclear.status
        ? `<span class="compare-nuclear-badge">☢ ${nation2.nuclear.warheads.toLocaleString()} Warheads</span>`
        : `<span class="compare-no-nuclear">No Nuclear Arsenal</span>`;

    const nuclearSection = (nation1.nuclear?.status || nation2.nuclear?.status) ? `
        <div class="compare-stats-section">
            <h3>☢️ Nuclear Arsenal</h3>
            ${renderCompareBar('Nuclear Warheads', nation1.nuclear?.warheads || 0, nation2.nuclear?.warheads || 0)}
        </div>
    ` : '';

    return `
        <div class="compare-header">
            <div class="compare-nation">
                <div class="compare-nation-flag">
                    <img src="${getFlagUrl(nation1.countryCode)}" alt="${nation1.name}">
                </div>
                <h3 class="compare-nation-name">${nation1.name}</h3>
                <p class="compare-nation-rank">Rank #${nation1.rank}</p>
                ${nuclearBadge1}
            </div>
            <div class="compare-vs">VS</div>
            <div class="compare-nation">
                <div class="compare-nation-flag">
                    <img src="${getFlagUrl(nation2.countryCode)}" alt="${nation2.name}">
                </div>
                <h3 class="compare-nation-name">${nation2.name}</h3>
                <p class="compare-nation-rank">Rank #${nation2.rank}</p>
                ${nuclearBadge2}
            </div>
        </div>
        
        <div class="compare-stats-section">
            <h3>📊 Overview</h3>
            ${renderCompareBar('Active Personnel', nation1.personnel.active, nation2.personnel.active)}
            ${renderCompareBar('Reserve Personnel', nation1.personnel.reserve, nation2.personnel.reserve)}
        </div>

        ${nuclearSection}
        
        <div class="compare-stats-section">
            <h3>🏔️ Army</h3>
            ${renderCompareBar('Main Battle Tanks', nation1.army.tanks, nation2.army.tanks)}
            ${renderCompareBar('Armored Vehicles', nation1.army.apc, nation2.army.apc)}
            ${renderCompareBar('Artillery Systems', nation1.army.artillery, nation2.army.artillery)}
            ${renderCompareBar('MLRS', nation1.army.mlrs, nation2.army.mlrs)}
        </div>
        
        <div class="compare-stats-section">
            <h3>⚓ Navy</h3>
            ${renderCompareBar('Aircraft Carriers', nation1.navy.carriers, nation2.navy.carriers)}
            ${renderCompareBar('Submarines', nation1.navy.submarines, nation2.navy.submarines)}
            ${renderCompareBar('Destroyers', nation1.navy.destroyers, nation2.navy.destroyers)}
            ${renderCompareBar('Frigates', nation1.navy.frigates, nation2.navy.frigates)}
        </div>
        
        <div class="compare-stats-section">
            <h3>✈️ Air Force</h3>
            ${renderCompareBar('Fighter Aircraft', nation1.airforce.fighters, nation2.airforce.fighters)}
            ${renderCompareBar('Bombers', nation1.airforce.bombers, nation2.airforce.bombers)}
            ${renderCompareBar('Transport', nation1.airforce.transport, nation2.airforce.transport)}
            ${renderCompareBar('Helicopters', nation1.airforce.helicopters, nation2.airforce.helicopters)}
        </div>
    `;
}

function renderCompareBar(label, value1, value2) {
    const max = Math.max(value1, value2, 1);
    const percent1 = (value1 / max) * 100;
    const percent2 = (value2 / max) * 100;

    const winner1 = value1 > value2;
    const winner2 = value2 > value1;

    return `
        <div class="compare-bar-row">
            <div class="compare-bar-left">
                <span class="compare-bar-value">
                    ${formatNumber(value1)}
                    ${winner1 ? '<span class="winner-badge">WIN</span>' : ''}
                </span>
                <div class="compare-bar-track">
                    <div class="compare-bar-fill nation1" data-width="${percent1}" style="width: 0%"></div>
                </div>
            </div>
            <div class="compare-bar-label">${label}</div>
            <div class="compare-bar-right">
                <div class="compare-bar-track">
                    <div class="compare-bar-fill nation2" data-width="${percent2}" style="width: 0%"></div>
                </div>
                <span class="compare-bar-value">
                    ${formatNumber(value2)}
                ${winner2 ? '<span class="winner-badge">WIN</span>' : ''}
                </span>
            </div>
        </div>
    `;
}

// ============================================
// LIVE NEWS FUNCTIONALITY
// ============================================
let currentNewsCategory = 'all';
let currentNewsDate = 'all';
let newsData = [];

// GNews API - Free tier: 100 requests/day (optional enhancement)
// Get your free API key at: https://gnews.io/
const GNEWS_API_KEY = 'YOUR_API_KEY_HERE'; // Replace with your GNews API key

function initNews() {
    // Initialize category buttons
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentNewsCategory = this.dataset.category;
            filterNews();
        });
    });

    // Load news on init
    fetchNews();
}

// Validate news article images — reject emojis, icons, tiny images, bad URLs
function isValidNewsImage(url) {
    if (!url || typeof url !== 'string') return false;
    const u = url.toLowerCase();

    // Reject data URIs and SVGs
    if (u.startsWith('data:') || u.endsWith('.svg')) return false;

    // Reject known bad domains (emojis, reactions, icons, avatars, placeholders)
    const badDomains = [
        'emoji', 'emojipedia', 'twemoji', 'abs.twimg.com/emoji',
        'gravatar.com', 'secure.gravatar',
        'wp.com/latex', 'placeholder.com', 'placehold.it', 'placekitten',
        'pixel.wp.com', 'stat.wordpress.com',
        'assets.rbl.ms', 's0.wp.com', 's1.wp.com', 's2.wp.com',
        'cdn.shortpixel.ai', 'i0.wp.com/s', 'feeds.feedburner',
        'feedburner.com', 'rss2json.com',
        'facebook.com/tr', 'facebook.com/sharer',
        'twitter.com/intent', 'platform.twitter.com',
        'b.scorecardresearch.com', 'pixel.quantserve.com'
    ];
    if (badDomains.some(d => u.includes(d))) return false;

    // Reject very small images (favicon, 1x1 tracking pixels, icons)
    const sizeMatch = u.match(/[?&](w|width|size)=(\d+)/i);
    if (sizeMatch && parseInt(sizeMatch[2]) < 100) return false;
    const dimMatch = u.match(/\/(\d+)x(\d+)\//);
    if (dimMatch && (parseInt(dimMatch[1]) < 100 || parseInt(dimMatch[2]) < 100)) return false;

    // Reject common icon/avatar patterns
    if (/favicon|icon[-_.]?\d|logo[-_.]?\d|avatar|badge|button|banner-ad/i.test(u)) return false;

    // Reject if URL contains typical reaction/emoji filename patterns
    if (/emoji|emoticon|smiley|reaction|sticker/i.test(u)) return false;

    return true;
}

// Live RSS feeds — STRICTLY military/defense sources only
const RSS_FEEDS = [
    { url: 'https://feeds.feedburner.com/defense-news/home', name: 'Defense News' },
    { url: 'https://breakingdefense.com/feed/', name: 'Breaking Defense' },
    { url: 'https://www.defensenews.com/arc/outboundfeeds/rss/?outputType=xml', name: 'Defense News' },
    { url: 'https://news.usni.org/feed', name: 'USNI News' },
    { url: 'https://www.janes.com/feeds/news', name: 'Janes' },
    { url: 'https://www.navalnews.com/feed/', name: 'Naval News' },
    { url: 'https://www.armytimes.com/arc/outboundfeeds/rss/?outputType=xml', name: 'Army Times' },
    { url: 'https://www.stripes.com/feeds/military.rss', name: 'Stars and Stripes' },
    { url: 'https://feeds.feedburner.com/IndianDefenceNews', name: 'Indian Defence News' },
    { url: 'https://idrw.org/feed/', name: 'Indian Defence Research Wing' },
    { url: 'https://www.livefistdefence.com/feed/', name: 'LiveFist Defence' }
];

const RSS2JSON_BASE = 'https://api.rss2json.com/v1/api.json?rss_url=';

// Strict military keyword filter — only articles matching these pass through
const MILITARY_KEYWORDS = [
    'military', 'defense', 'defence', 'armed forces', 'army', 'navy', 'air force',
    'marine', 'pentagon', 'nato', 'warfare', 'weapon', 'missile', 'fighter jet',
    'bomber', 'submarine', 'warship', 'destroyer', 'frigate', 'carrier', 'tank',
    'artillery', 'drone', 'uav', 'nuclear', 'warhead', 'troops', 'soldiers',
    'combat', 'strike', 'airstrike', 'airstrikes', 'deployment', 'battalion',
    'brigade', 'regiment', 'special forces', 'commando', 'sniper', 'infantry',
    'armor', 'armored', 'stealth', 'radar', 'anti-aircraft', 'anti-ship',
    'torpedo', 'munitions', 'ammunition', 'ballistic', 'hypersonic', 'icbm',
    'reconnaissance', 'espionage', 'cyber warfare',
    'f-35', 'f-16', 'f-22', 'b-21', 'su-57', 'rafale', 'eurofighter', 'typhoon',
    'himars', 'patriot', 'iron dome', 's-400', 's-500', 'abrams', 'leopard',
    'aircraft carrier', 'battleship', 'corvette', 'amphibious',
    'invasion', 'occupation', 'siege', 'ceasefire', 'deterrence',
    'conscription', 'mobilization',
    'lockheed', 'raytheon', 'northrop', 'boeing defense', 'bae systems',
    'rheinmetall', 'thales', 'saab defense',
    'drdo', 'hal tejas', 'tejas', 'brahmos', 'ins vikrant', 'ins vikramaditya',
    'indian army', 'indian navy', 'indian air force', 'iaf', 'arjun tank',
    'akash missile', 'agni missile', 'prithvi missile', 'pinaka', 'nirbhay',
    'rafale india', 'sukhoi india', 'su-30mki', 'mig-29', 'lca',
    'indian defence', 'indian defense',
    'lac standoff', 'line of actual control', 'siachen', 'galwan',
    'ins arihant', 'scorpene', 'kalvari',
    'hindustan aeronautics', 'bharat electronics', 'bharat dynamics'
];

// Blocklist — reject articles containing these non-military topics
const NON_MILITARY_BLOCKLIST = [
    // Entertainment
    'concert', 'music', 'album', 'rock band', 'metallica', 'tour dates', 'residency',
    'movie', 'film', 'hollywood', 'celebrity', 'actor', 'actress', 'grammy', 'oscar',
    'tv show', 'reality tv', 'streaming', 'netflix', 'hulu', 'disney+', 'spotify',
    // Sports
    'sports', 'football', 'basketball', 'baseball', 'soccer', 'nfl', 'nba', 'mlb',
    'cricket', 'tennis', 'golf', 'olympics', 'world cup', 'super bowl', 'playoffs',
    'hall of fame', 'hall of famers', 'touchdown', 'home run',
    // Science / Nature / Archaeology — NOT military
    'fossil', 'dinosaur', 'ancient creature', 'extinction', 'mass extinction',
    'archaeological', 'archaeology', 'excavation', 'ancient cave', 'lost world',
    'paleontolog', 'prehistoric', 'ice age', 'volcanic ash', 'quarry',
    'species discovered', 'new species', 'evolution', 'geological',
    'ocean floor', 'deep sea creature', 'coral reef', 'marine biology',
    'astronomy', 'black hole', 'exoplanet', 'nebula', 'milky way', 'telescope',
    'mars rover', 'james webb', 'hubble',
    // Health / Lifestyle
    'recipe', 'cooking', 'restaurant', 'food truck', 'weight loss', 'diet',
    'fitness routine', 'yoga', 'meditation', 'mental health tip',
    'dating', 'relationship', 'wedding', 'divorce',
    'fashion', 'clothing', 'beauty', 'skincare', 'hairstyle',
    'horoscope', 'zodiac', 'astrology',
    // Animals / Pets
    'pet', 'dog show', 'cat video', 'wildlife rescue', 'zoo',
    // Shopping / Finance
    'discount', 'sale', 'coupon', 'black friday', 'prime day',
    'lottery', 'casino', 'gambling', 'las vegas sphere',
    'real estate', 'mortgage', 'home decor', 'stock market', 'cryptocurrency',
    // Social Media
    'tiktok', 'instagram', 'influencer', 'viral video', 'youtube star',
    // Weather / environment (non-military)
    'weather forecast', 'hurricane season', 'tornado warning', 'heatwave',
    'climate change', 'global warming', 'carbon emission',
    // Pop culture / misc
    'comic book', 'manga', 'anime', 'video game', 'gaming',
    'travel destination', 'vacation', 'tourism', 'hotel review',
    'book review', 'novel', 'bestseller',
    'spiky creatures', 'ancient island', 'frozen for', 'lost ocean',
    'strange creatures', 'mysterious creature', 'bizarre animal'
];

function isMilitaryArticle(title, description) {
    const text = ((title || '') + ' ' + (description || '')).toLowerCase();

    // First check blocklist — reject immediately if non-military content
    const isBlocked = NON_MILITARY_BLOCKLIST.some(term => text.includes(term));
    if (isBlocked) return false;

    // Then check if it matches military keywords
    return MILITARY_KEYWORDS.some(keyword => text.includes(keyword));
}

async function fetchNews() {
    const newsGrid = document.getElementById('news-grid');
    const refreshBtn = document.querySelector('.refresh-btn');

    if (!newsGrid) return;

    try {
        const sampleNews = getSampleNews();

        if (refreshBtn) refreshBtn.classList.add('loading');

        // Show loading overlay in the news grid
        newsGrid.innerHTML = `
            <div class="news-loading-overlay">
                <div class="loading-spinner"></div>
                <p>Hold on while we gather the latest defense intelligence...</p>
            </div>
        `;

        let liveArticles = [];

        // 1. First try our backend proxy route which fetches direct from live defense RSS feeds
        try {
            const apiRes = await fetch('/api/news');
            if (apiRes.ok) {
                const apiData = await apiRes.json();
                if ((apiData.status === 'ok' || apiData.status === 'live' || apiData.status === 'cache' || apiData.status === 'stale-cache') && Array.isArray(apiData.articles) && apiData.articles.length > 0) {
                    liveArticles = apiData.articles;
                    console.log(`📡 Received ${liveArticles.length} defense articles from server news stream`);
                }
            }
        } catch (apiErr) {
            console.warn('Backend news endpoint error, attempting client-side feeds:', apiErr);
        }

        // 2. If backend had no articles, attempt client-side RSS feeds as secondary option
        if (liveArticles.length === 0) {
            try {
                const feedPromises = RSS_FEEDS.map(feed =>
                    fetch(`${RSS2JSON_BASE}${encodeURIComponent(feed.url)}`)
                        .then(res => res.json())
                        .then(data => {
                            if (data.status === 'ok' && data.items && data.items.length > 0) {
                                return data.items.map(item => ({
                                    title: item.title || '',
                                    description: item.description
                                        ? item.description.replace(/<[^>]*>/g, '').substring(0, 300)
                                        : '',
                                    fullContent: item.content || item.description || '',
                                    url: item.link || '',
                                    image: item.enclosure && item.enclosure.link
                                        ? item.enclosure.link
                                        : item.thumbnail
                                            ? item.thumbnail
                                            : extractImageFromContent(item.content || item.description || ''),
                                    source: feed.name || (item.author || 'Defense Source'),
                                    publishedAt: item.pubDate || new Date().toISOString(),
                                    category: categorizeArticle((item.title || '') + ' ' + (item.description || ''))
                                }));
                            }
                            return [];
                        })
                        .catch(() => [])
                );

                const results = await Promise.allSettled(feedPromises);
                results.forEach(result => {
                    if (result.status === 'fulfilled' && Array.isArray(result.value)) {
                        liveArticles = liveArticles.concat(result.value);
                    }
                });
            } catch (rssError) {
                console.warn('Client-side RSS fetch error:', rssError);
            }
        }

        // Also check GNews API if key configured
        if (GNEWS_API_KEY !== 'YOUR_API_KEY_HERE') {
            try {
                const response = await fetch(
                    `https://gnews.io/api/v4/search?q=military+OR+defense+OR+"armed+forces"+OR+warfare&lang=en&max=12&apikey=${GNEWS_API_KEY}`
                );
                const data = await response.json();
                if (data.articles && data.articles.length > 0) {
                    const apiNews = data.articles
                        .filter(a => isMilitaryArticle(a.title, a.description))
                        .map(article => ({
                            title: article.title,
                            description: article.description,
                            fullContent: article.content || article.description || '',
                            url: article.url,
                            image: article.image,
                            source: article.source.name,
                            publishedAt: article.publishedAt,
                            category: categorizeArticle(article.title + ' ' + article.description)
                        }));
                    liveArticles = [...apiNews, ...liveArticles];
                }
            } catch (apiError) {
                console.error('GNews API error:', apiError);
            }
        }

        // Filter military articles and deduplicate
        if (liveArticles.length > 0) {
            liveArticles = liveArticles.filter(article =>
                isMilitaryArticle(article.title, article.description)
            );

            const seen = new Set();
            liveArticles = liveArticles.filter(article => {
                const key = article.title.toLowerCase().substring(0, 60);
                if (seen.has(key) || !article.title) return false;
                seen.add(key);
                return true;
            });

            liveArticles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

            // Validate and fix images
            liveArticles.forEach((article, i) => {
                if (!article.image || !isValidNewsImage(article.image)) {
                    article.image = getRelevantImage(article.title, article.description, i);
                }
            });
        }

        // 3. Final population: use live articles if available, ALWAYS fallback to curated sampleNews
        if (liveArticles.length > 0) {
            newsData = liveArticles;
            console.log(`✅ Loaded ${liveArticles.length} live military articles`);
            showNewsNotification(liveArticles[0].title, liveArticles.length, liveArticles[0].url || liveArticles[0].link, liveArticles[0].description);
        } else {
            newsData = sampleNews;
            console.log(`ℹ️ Loaded ${newsData.length} curated military intel articles as reliable baseline`);
            if (newsData.length > 0) {
                showNewsNotification(newsData[0].title, newsData.length, newsData[0].url, newsData[0].description);
            }
        }

        renderNews();
        populateDateDropdown();
        updateTimestamp();
        if (refreshBtn) refreshBtn.classList.remove('loading');

    } catch (error) {
        console.error('fetchNews error:', error);
        // Resilient fallback: ensure news is rendered even if unexpected error happens
        try {
            newsData = getSampleNews();
            renderNews();
            populateDateDropdown();
            updateTimestamp();
        } catch (innerError) {
            if (newsGrid) {
                newsGrid.innerHTML = '<div class="news-error"><p>Error loading news. Please refresh the page.</p><button class="retry-btn" onclick="refreshNews()">Retry</button></div>';
            }
        }
        if (refreshBtn) refreshBtn.classList.remove('loading');
    }
}

// News Notification Bar
let notifyTimeout = null;
let notifyArticleLink = null;

function showNewsNotification(headline, count, link, description) {
    const bar = document.getElementById('news-notify-bar');
    const headlineEl = document.getElementById('notify-headline');
    const descEl = document.getElementById('notify-desc');
    console.log('📢 showNewsNotification called:', headline);
    if (!bar || !headlineEl) return;

    headlineEl.textContent = headline || 'New defense intel available';
    notifyArticleLink = link || null;

    // Show brief description (strip HTML, truncate)
    if (descEl && description) {
        const cleanDesc = description.replace(/<[^>]*>/g, '').trim();
        descEl.textContent = cleanDesc.length > 120 ? cleanDesc.substring(0, 120) + '...' : cleanDesc;
    }

    // Make the headline clickable
    headlineEl.style.cursor = 'pointer';
    headlineEl.onclick = function () { goToNotifyArticle(); };

    // Delay so page loader finishes fading out first
    setTimeout(() => {
        bar.classList.add('visible');
    }, 3000);

    // Auto-dismiss after 12 seconds
    if (notifyTimeout) clearTimeout(notifyTimeout);
    notifyTimeout = setTimeout(() => dismissNotifyBar(), 12000);
}

function goToNotifyArticle() {
    // Scroll to news section
    const newsSection = document.getElementById('news-section');
    if (newsSection) newsSection.scrollIntoView({ behavior: 'smooth' });

    // Open the article in a new tab if we have a link
    if (notifyArticleLink) {
        setTimeout(() => window.open(notifyArticleLink, '_blank'), 600);
    }
    dismissNotifyBar();
}

function dismissNotifyBar() {
    const bar = document.getElementById('news-notify-bar');
    if (bar) bar.classList.remove('visible');
    if (notifyTimeout) { clearTimeout(notifyTimeout); notifyTimeout = null; }
}

// Helper to extract image URLs from HTML content
function extractImageFromContent(html) {
    if (!html) return '';
    const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
    return match ? match[1] : '';
}

function categorizeArticle(text) {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('conflict') || lowerText.includes('war') || lowerText.includes('attack') || lowerText.includes('strike')) {
        return 'conflict';
    }
    if (lowerText.includes('technology') || lowerText.includes('drone') || lowerText.includes('missile') || lowerText.includes('aircraft') || lowerText.includes('stealth')) {
        return 'tech';
    }
    if (lowerText.includes('defense') || lowerText.includes('pentagon') || lowerText.includes('nato') || lowerText.includes('budget')) {
        return 'defense';
    }
    return 'all';
}

function filterNews() {
    renderNews();
}

// Populate the date dropdown with unique dates from newsData
function populateDateDropdown() {
    const dateSelect = document.getElementById('news-date-select');
    if (!dateSelect) return;

    // Extract unique dates from newsData
    const dateMap = new Map();
    newsData.forEach(article => {
        const d = new Date(article.publishedAt);
        if (isNaN(d.getTime())) return;

        // Use the exact same formatting as the cards
        const label = d.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });

        // Sort key: YYYY-MM-DD for correct chronological sorting
        const sortKey = d.getFullYear() + '-' +
            String(d.getMonth() + 1).padStart(2, '0') + '-' +
            String(d.getDate()).padStart(2, '0');

        if (!dateMap.has(label)) {
            dateMap.set(label, sortKey);
        }
    });

    // Sort by the YYYY-MM-DD key (newest first)
    const sortedDates = Array.from(dateMap.entries()).sort((a, b) => b[1].localeCompare(a[1]));

    // Rebuild options
    const prevValue = dateSelect.value;
    dateSelect.innerHTML = '<option value="all">All Dates</option>';
    sortedDates.forEach(([label, sortKey]) => {
        const opt = document.createElement('option');
        opt.value = label; // Use formatted label (e.g. "Jul 15, 2026") as the filter value
        opt.textContent = label;
        dateSelect.appendChild(opt);
    });

    // Restore previous selection if it still exists
    if (prevValue && dateSelect.querySelector('option[value="' + prevValue + '"]')) {
        dateSelect.value = prevValue;
    } else {
        dateSelect.value = 'all';
        currentNewsDate = 'all';
    }
}

// Handle date dropdown change
function filterNewsByDate() {
    const dateSelect = document.getElementById('news-date-select');
    if (!dateSelect) return;
    currentNewsDate = dateSelect.value;
    renderNews();
}

function renderNews() {
    const newsGrid = document.getElementById('news-grid');
    if (!newsGrid) return;

    // Reset image tracker so each render gets fresh distribution
    usedImageTracker.clear();

    try {
        let filteredNews = currentNewsCategory === 'all'
            ? newsData
            : newsData.filter(article => article.category === currentNewsCategory || article.category === 'all');

        // Apply date filter
        if (currentNewsDate !== 'all') {
            filteredNews = filteredNews.filter(article => {
                const articleDate = new Date(article.publishedAt);
                if (isNaN(articleDate.getTime())) return false;
                const dateStr = articleDate.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                });
                return dateStr === currentNewsDate;
            });
        }

        if (filteredNews.length === 0) {
            newsGrid.innerHTML = `
                <div class="news-error">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                    </svg>
                    <p>No news found for this category</p>
                    <button class="retry-btn" onclick="refreshNews()">Try All News</button>
                </div>
            `;
            return;
        }

        // Render each card individually with error handling
        let cardsHtml = '';
        for (let i = 0; i < filteredNews.length; i++) {
            try {
                cardsHtml += renderNewsCard(filteredNews[i], i);
            } catch (cardError) {
                console.error('Error rendering card ' + i + ':', cardError);
            }
        }

        newsGrid.innerHTML = cardsHtml;

        // Simple fade-in using CSS instead of GSAP (GSAP opacity:0 was making cards invisible)
        const cards = newsGrid.querySelectorAll('.news-card');
        cards.forEach((card, i) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, i * 50);
        });
    } catch (error) {
        console.error('renderNews error:', error);
        newsGrid.innerHTML = '<div class="news-error"><p>Error displaying news</p><button class="retry-btn" onclick="refreshNews()">Retry</button></div>';
    }
}

// Keyword-based image matching for news articles — large pool to avoid repeats
// Using verified Unsplash photo URLs with proper sizing parameters
const MILITARY_IMAGE_MAP = [
    {
        keywords: ['fighter', 'jet', 'f-35', 'f-16', 'f-22', 'su-57', 'rafale', 'eurofighter', 'typhoon', 'tejas', 'mig', 'su-30', 'air force', 'airforce', 'iaf', 'stealth', 'bomber', 'b-21', 'b-52', 'aircraft'],
        images: [
            'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1559583985-c80d8ad9b29f?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1599583863916-e06c29087f51?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1579912437766-7896df6d3cd3?w=600&h=400&fit=crop'
        ]
    },
    {
        keywords: ['navy', 'naval', 'warship', 'destroyer', 'frigate', 'carrier', 'aircraft carrier', 'submarine', 'ins ', 'uss ', 'hms ', 'corvette', 'amphibious', 'fleet'],
        images: [
            'https://images.unsplash.com/photo-1614028674026-a65e31bfd27c?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1548126032-079a0fb0099d?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1580130732478-4e339fb6836f?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1544890225-2f3faec4cd60?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=600&h=400&fit=crop'
        ]
    },
    {
        keywords: ['tank', 'armor', 'armored', 'abrams', 'leopard', 'arjun', 'artillery', 'howitzer', 'infantry', 'troops', 'soldiers', 'army', 'battalion', 'brigade', 'regiment', 'ground forces'],
        images: [
            'https://images.unsplash.com/photo-1534996858221-380b92700493?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1579912437766-7896df6d3cd3?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1560807707-8cc77767d783?w=600&h=400&fit=crop'
        ]
    },
    {
        keywords: ['missile', 'ballistic', 'icbm', 'hypersonic', 'brahmos', 'patriot', 'iron dome', 's-400', 'himars', 'rocket', 'launch', 'nuclear', 'warhead', 'deterrence'],
        images: [
            'https://images.unsplash.com/photo-1457364887197-9150188c107b?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1517976487492-5750f3195933?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1454789548928-9efd52dc4031?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1541185934-01b600ea069c?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1636819488524-1f019c4e1c44?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop'
        ]
    },
    {
        keywords: ['drone', 'uav', 'unmanned', 'reconnaissance', 'surveillance', 'radar', 'cyber', 'electronic warfare', 'intelligence'],
        images: [
            'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1579829366248-204fe8413f31?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=600&h=400&fit=crop'
        ]
    },
    {
        keywords: ['nato', 'alliance', 'summit', 'pentagon', 'defense budget', 'defence budget', 'military spending', 'contract', 'lockheed', 'raytheon', 'northrop', 'boeing', 'bae'],
        images: [
            'https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1555848962-6e79363ec58f?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop'
        ]
    },
    {
        keywords: ['special forces', 'commando', 'sniper', 'marine', 'seal', 'delta', 'sas', 'paratrooper', 'combat', 'operation', 'raid'],
        images: [
            'https://images.unsplash.com/photo-1579912437766-7896df6d3cd3?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1560807707-8cc77767d783?w=600&h=400&fit=crop'
        ]
    },
    {
        keywords: ['helicopter', 'apache', 'blackhawk', 'chinook', 'chopper'],
        images: [
            'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=600&h=400&fit=crop'
        ]
    },
    {
        keywords: ['war', 'conflict', 'strike', 'airstrike', 'invasion', 'siege', 'ceasefire', 'deployment'],
        images: [
            'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=600&h=400&fit=crop'
        ]
    },
    {
        keywords: ['india', 'indian', 'modi', 'delhi', 'drdo', 'hal ', 'isro'],
        images: [
            'https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1579912437766-7896df6d3cd3?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1534996858221-380b92700493?w=600&h=400&fit=crop'
        ]
    },
    {
        keywords: ['china', 'chinese', 'pla ', 'beijing', 'taiwan', 'south china sea'],
        images: [
            'https://images.unsplash.com/photo-1614028674026-a65e31bfd27c?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop'
        ]
    },
    {
        keywords: ['russia', 'russian', 'moscow', 'ukraine', 'kremlin', 'putin'],
        images: [
            'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1534996858221-380b92700493?w=600&h=400&fit=crop'
        ]
    },
    {
        keywords: ['israel', 'idf', 'iron dome', 'hamas', 'hezbollah', 'gaza', 'mossad'],
        images: [
            'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1457364887197-9150188c107b?w=600&h=400&fit=crop'
        ]
    }
];

// Large generic pool as final fallback — all verified working Unsplash URLs
const GENERIC_MILITARY_IMAGES = [
    'https://images.unsplash.com/photo-1534996858221-380b92700493?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1559628233-100c798642d4?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1560807707-8cc77767d783?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1559583985-c80d8ad9b29f?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1614028674026-a65e31bfd27c?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1457364887197-9150188c107b?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1579912437766-7896df6d3cd3?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=600&h=400&fit=crop'
];

// Track used images to prevent repeats across all rendered articles
const usedImageTracker = new Set();

function getRelevantImage(title, description, index) {
    const text = ((title || '') + ' ' + (description || '')).toLowerCase();

    // Hash the title for better distribution
    let hash = 0;
    for (let i = 0; i < (title || '').length; i++) {
        hash = ((hash << 5) - hash) + (title || '').charCodeAt(i);
        hash |= 0;
    }
    hash = Math.abs(hash);

    // Find matching category
    for (const category of MILITARY_IMAGE_MAP) {
        for (const keyword of category.keywords) {
            if (text.includes(keyword)) {
                // Try each image in category, starting from hash position
                for (let attempt = 0; attempt < category.images.length; attempt++) {
                    const img = category.images[(hash + attempt) % category.images.length];
                    if (!usedImageTracker.has(img)) {
                        usedImageTracker.add(img);
                        return img;
                    }
                }
                // All images in category used — return one based on hash anyway
                return category.images[hash % category.images.length];
            }
        }
    }

    // No keyword match — use generic pool with tracking
    for (let attempt = 0; attempt < GENERIC_MILITARY_IMAGES.length; attempt++) {
        const img = GENERIC_MILITARY_IMAGES[(hash + attempt) % GENERIC_MILITARY_IMAGES.length];
        if (!usedImageTracker.has(img)) {
            usedImageTracker.add(img);
            return img;
        }
    }
    return GENERIC_MILITARY_IMAGES[(index || 0) % GENERIC_MILITARY_IMAGES.length];
}

// Get multiple different fallback images for a card so onerror can cycle through them
function getImageFallbackChain(title, description, index) {
    const text = ((title || '') + ' ' + (description || '')).toLowerCase();
    const chain = [];

    // Hash the title
    let hash = 0;
    for (let i = 0; i < (title || '').length; i++) {
        hash = ((hash << 5) - hash) + (title || '').charCodeAt(i);
        hash |= 0;
    }
    hash = Math.abs(hash);

    // Collect images from matching categories
    for (const category of MILITARY_IMAGE_MAP) {
        for (const keyword of category.keywords) {
            if (text.includes(keyword)) {
                for (let a = 0; a < Math.min(3, category.images.length); a++) {
                    const img = category.images[(hash + a) % category.images.length];
                    if (!chain.includes(img)) chain.push(img);
                }
                break;
            }
        }
        if (chain.length >= 3) break;
    }

    // Fill remaining slots from generic pool
    for (let a = 0; chain.length < 4 && a < GENERIC_MILITARY_IMAGES.length; a++) {
        const img = GENERIC_MILITARY_IMAGES[(hash + index + a) % GENERIC_MILITARY_IMAGES.length];
        if (!chain.includes(img)) chain.push(img);
    }

    return chain;
}

// Robust onerror handler — cycles through fallback chain, then shows SVG placeholder
function newsImageError(img) {
    try {
        const fallbacks = JSON.parse(img.getAttribute('data-fallbacks') || '[]');
        let idx = parseInt(img.getAttribute('data-fallback-index') || '0', 10);

        if (idx < fallbacks.length) {
            img.setAttribute('data-fallback-index', idx + 1);
            img.src = fallbacks[idx];
            return;
        }

        // All fallbacks exhausted — replace with a styled SVG placeholder
        img.onerror = null;
        img.style.display = 'none';
        const parent = img.closest('.news-card-image');
        if (parent && !parent.querySelector('.news-img-placeholder')) {
            const placeholder = document.createElement('div');
            placeholder.className = 'news-img-placeholder';
            placeholder.innerHTML = `
                <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.5" style="width:48px;height:48px;color:rgba(212,175,55,0.4);">
                    <rect x="8" y="12" width="48" height="40" rx="4"/>
                    <circle cx="22" cy="28" r="6"/>
                    <path d="M8 44l14-12 10 8 12-10 12 10"/>
                </svg>`;
            placeholder.style.cssText = 'width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#1a2332,#0d1b2a);';
            parent.insertBefore(placeholder, parent.firstChild);
        }
    } catch (e) {
        img.onerror = null;
        img.style.display = 'none';
    }
}

function renderNewsCard(article, index) {
    const publishedDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
    const categoryLabel = getCategoryLabel(article.category);
    const fallbackImage = getRelevantImage(article.title, article.description, index);
    const imageUrl = (article.image && isValidNewsImage(article.image)) ? article.image : fallbackImage;
    const fallbackChain = getImageFallbackChain(article.title, article.description, index);

    return `
        <article class="news-card" onclick="openNewsModal(${index})">
            <div class="news-card-image" style="background:linear-gradient(135deg,#1a2332,#0d1b2a);">
                <img src="${imageUrl}" alt="${article.title}"
                     data-fallbacks='${JSON.stringify(fallbackChain)}'
                     data-fallback-index="0"
                     onerror="newsImageError(this)">
                <span class="news-card-category">${categoryLabel}</span>
            </div>
            <div class="news-card-content">
                <h3 class="news-card-title">${article.title}</h3>
                <p class="news-card-description">${article.description || ''}</p>
                <div class="news-card-meta">
                    <span class="news-card-source">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"/>
                            <line x1="2" y1="12" x2="22" y2="12"/>
                            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                        </svg>
                        ${article.source}
                    </span>
                    <span class="news-card-time">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                            <line x1="16" y1="2" x2="16" y2="6"/>
                            <line x1="8" y1="2" x2="8" y2="6"/>
                            <line x1="3" y1="10" x2="21" y2="10"/>
                        </svg>
                        ${publishedDate}
                    </span>
                </div>
            </div>
        </article>
    `;
}

function getCategoryLabel(category) {
    const labels = {
        'all': 'NEWS',
        'defense': 'DEFENSE',
        'conflict': 'CONFLICT',
        'tech': 'TECH'
    };
    return labels[category] || 'NEWS';
}

function updateTimestamp() {
    const timestamp = document.getElementById('news-timestamp');
    if (timestamp) {
        const now = new Date();
        timestamp.textContent = `Last updated: ${now.toLocaleTimeString()}`;
    }
}

function refreshNews() {
    currentNewsCategory = 'all';
    currentNewsDate = 'all';
    document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('.category-btn[data-category="all"]')?.classList.add('active');
    const dateSelect = document.getElementById('news-date-select');
    if (dateSelect) dateSelect.value = 'all';
    fetchNews();
}

// ============================================
// NEWS MODAL FUNCTIONALITY
// ============================================
function openNewsModal(index) {
    let filteredNews = currentNewsCategory === 'all'
        ? newsData
        : newsData.filter(article => article.category === currentNewsCategory || article.category === 'all');

    // Apply date filter (must match renderNews logic)
    if (currentNewsDate !== 'all') {
        filteredNews = filteredNews.filter(article => {
            const articleDate = new Date(article.publishedAt);
            if (isNaN(articleDate.getTime())) return false;
            const dateStr = articleDate.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
            return dateStr === currentNewsDate;
        });
    }

    const article = filteredNews[index];
    if (!article) return;

    const modal = document.getElementById('news-modal');
    const imageContainer = document.getElementById('news-modal-image');
    const categoryEl = document.getElementById('news-modal-category');
    const titleEl = document.getElementById('news-modal-title');
    const sourceEl = document.getElementById('news-modal-source');
    const dateEl = document.getElementById('news-modal-date');
    const textEl = document.getElementById('news-modal-text');
    const externalBtn = document.getElementById('news-modal-external');

    // Set image — use keyword-matched relevant image as fallback
    const mFallback = getRelevantImage(article.title, article.description, index);
    const mImgUrl = (article.image && isValidNewsImage(article.image)) ? article.image : mFallback;
    const mFallbackChain = getImageFallbackChain(article.title, article.description, index);
    imageContainer.style.background = 'linear-gradient(135deg,#1a2332,#0d1b2a)';
    imageContainer.innerHTML = '<img src="' + mImgUrl + '" alt="' + (article.title || '').replace(/"/g, '&quot;') + '" data-fallbacks=\'' + JSON.stringify(mFallbackChain) + '\' data-fallback-index="0" onerror="newsImageError(this)">';

    categoryEl.textContent = getCategoryLabel(article.category);
    titleEl.textContent = article.title;
    sourceEl.textContent = article.source;
    dateEl.textContent = new Date(article.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    // Set detailed content — strip embedded images so only the top image shows
    var stripImgs = function (h) {
        return (h || '').replace(/<img[^>]*\/?>/gi, '').replace(/<figure[^>]*>[\s\S]*?<\/figure>/gi, '').replace(/<picture[^>]*>[\s\S]*?<\/picture>/gi, '');
    };
    var cleanDesc = stripImgs(article.description);
    textEl.innerHTML = stripImgs(article.fullContent) || '<p>' + cleanDesc + '</p><p>This is a developing story. More details will be provided as information becomes available from official sources and on-the-ground reports.</p><p>Defense analysts and military experts continue to monitor the situation closely. The implications for regional security and international relations remain under assessment.</p>';

    // Set external link
    if (article.url && article.url !== '#') {
        externalBtn.href = article.url;
        externalBtn.style.display = 'inline-flex';
    } else {
        externalBtn.style.display = 'none';
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Animate modal
    gsap.from('.news-modal-content', {
        scale: 0.9,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.out'
    });
}


function closeNewsModal() {
    const modal = document.getElementById('news-modal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Close news modal on escape key
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        closeNewsModal();
    }
});

// Sample news data with detailed real-world military content
function getSampleNews() {
    const now = new Date();
    return [
        {
            title: "Ukraine Receives New Batch of F-16 Fighter Jets from NATO Allies",
            description: "Western coalition delivers advanced 4th generation fighter aircraft to bolster Ukrainian air defense capabilities amid ongoing conflict with Russia.",
            fullContent: `
                <p>Ukraine has received a new batch of F-16 Fighting Falcon jets from NATO allies, marking a significant enhancement to the country's air defense capabilities. The delivery includes aircraft from Denmark, the Netherlands, and Norway as part of the Western coalition's continued support.</p>
                
                <p>The F-16s, which represent a major upgrade from Ukraine's Soviet-era fleet, are now operational at several airbases across the country. Ukrainian pilots have completed extensive training programs in Europe and the United States over the past year, preparing them for combat operations with the Western aircraft.</p>
                
                <p>"These aircraft fundamentally change the calculus for our air defense," said a senior Ukrainian military official. "We can now engage enemy aircraft and missiles at greater distances with improved accuracy and survivability."</p>
                
                <p>The F-16s are equipped with advanced radar systems, precision-guided munitions, and electronic warfare capabilities. Military analysts note that the jets will be particularly effective against Russian cruise missiles and ground targets.</p>
                
                <p>Russia has condemned the delivery, calling it a "dangerous escalation" that will not change the outcome of the conflict. Moscow has threatened to consider the F-16s legitimate targets regardless of their location, including potentially on NATO territory if used to strike Russian assets.</p>
                
                <p>The United States has also approved the transfer of AIM-120 AMRAAM air-to-air missiles to accompany the F-16s, providing Ukraine with beyond-visual-range engagement capability for the first time.</p>
            `,
            url: "https://www.defensenews.com",
            image: "https://images.unsplash.com/photo-1559628233-100c798642d4?w=800&h=500&fit=crop",
            source: "Defense News",
            publishedAt: new Date(now - 2 * 3600000).toISOString(),
            category: "conflict"
        },
        {
            title: "China Launches Third Aircraft Carrier 'Fujian' for Sea Trials",
            description: "The PLAN's newest and most advanced carrier begins comprehensive testing of its electromagnetic catapult system and advanced combat systems.",
            fullContent: `
                <p>China's People's Liberation Army Navy (PLAN) has commenced sea trials for the Fujian, the nation's third aircraft carrier and the first to feature an electromagnetic aircraft launch system (EMALS). The 80,000-ton vessel represents a significant advancement in China's naval capabilities.</p>
                
                <p>Unlike its predecessors, the Liaoning and Shandong, which use ski-jump ramps for aircraft launches, the Fujian employs three electromagnetic catapults similar to those on the USS Gerald R. Ford. This system allows for faster sortie rates and the launch of heavier aircraft, including early warning planes and potentially stealth fighters.</p>
                
                <p>"The Fujian represents China's transition to a true blue-water navy," said a naval analyst at the Asia-Pacific Center for Security Studies. "It signals Beijing's intention to project power far beyond its immediate neighborhood."</p>
                
                <p>The carrier is expected to operate the J-35 stealth fighter, a carrier-based variant of China's fifth-generation combat aircraft. The ship also features advanced radar systems and vertical launch cells for anti-aircraft missiles.</p>
                
                <p>US Indo-Pacific Command is closely monitoring the sea trials, which are taking place in the Yellow Sea. American surveillance aircraft and submarines are believed to be tracking the carrier's movements and electronic signatures.</p>
                
                <p>The Pentagon has noted that China's rapid naval expansion presents a growing challenge to American maritime dominance in the Pacific. The US Navy is accelerating its own shipbuilding programs in response, including the construction of additional Ford-class carriers and Virginia-class submarines.</p>
                
                <p>Taiwan's Ministry of National Defense issued a statement expressing concern over the Fujian's capabilities, noting that the carrier could be used to enforce a naval blockade of the island in a conflict scenario.</p>
            `,
            url: "https://www.navaltechnology.com",
            image: "https://images.unsplash.com/photo-1513002749550-c59d786b8e6c?w=800&h=500&fit=crop",
            source: "Naval Technology",
            publishedAt: new Date(now - 4 * 3600000).toISOString(),
            category: "defense"
        },
        {
            title: "North Korea Tests New Hypersonic Missile Capable of Reaching US Bases",
            description: "Pyongyang claims successful test of Hwasong-19 hypersonic glide vehicle with range sufficient to strike American military installations across the Pacific.",
            fullContent: `
                <p>North Korea has conducted what it describes as a successful test of the Hwasong-19 hypersonic missile, a weapon Pyongyang claims can evade all existing missile defense systems, including those deployed by the United States in the Pacific region.</p>
                
                <p>According to the Korean Central News Agency (KCNA), the missile flew approximately 1,000 kilometers before landing in the Sea of Japan. The test reportedly demonstrated the weapon's ability to maneuver at speeds exceeding Mach 12, making interception extremely difficult.</p>
                
                <p>South Korean and Japanese military officials confirmed the launch, tracking the missile's trajectory with ground-based and ship-borne radar systems. Japan issued an emergency alert to residents of Hokkaido Prefecture, though the missile landed in international waters.</p>
                
                <p>"This test represents a significant advancement in North Korea's strategic capabilities," said a researcher at the James Martin Center for Nonproliferation Studies. "Hypersonic weapons pose a major challenge to our current missile defense architecture."</p>
                
                <p>The United Nations Security Council convened an emergency session following the launch, with the United States calling for additional sanctions against the Kim regime. China and Russia blocked the measures, citing the need for dialogue rather than pressure.</p>
                
                <p>US Forces Korea raised its alert level to WATCHCON 2 and conducted combined exercises with South Korean forces in response to the test. B-1B Lancer bombers were deployed from Guam to demonstrate American resolve and commitment to regional allies.</p>
                
                <p>Defense analysts note that North Korea's hypersonic program has progressed faster than anticipated, with the country conducting at least four tests in the past year. The Pentagon is accelerating development of the Glide Phase Interceptor program in response to the growing hypersonic threat.</p>
            `,
            url: "https://www.reuters.com",
            image: "https://images.unsplash.com/photo-1457364559154-aa2644600ebb?w=800&h=500&fit=crop",
            source: "Reuters",
            publishedAt: new Date(now - 6 * 3600000).toISOString(),
            category: "conflict"
        },
        {
            title: "US Army Deploys First AI-Controlled Drone Swarms in Combat Exercise",
            description: "Collaborative Combat Aircraft program demonstrates autonomous coordination between 20 drones and manned fighter jets in Pacific theater exercises.",
            fullContent: `
                <p>The US Army has successfully deployed its first operationally capable autonomous drone swarm during Exercise Pacific Sentry, marking a milestone in the military's adoption of artificial intelligence for combat operations. The exercise involved 20 AI-controlled drones operating in coordination with manned Apache helicopters and F-35 fighters.</p>
                
                <p>The Collaborative Combat Aircraft (CCA) demonstrated the ability to conduct reconnaissance, identify targets, and execute coordinated attacks without direct human control of individual drones. Human operators maintained supervisory control and made final decisions on weapons employment.</p>
                
                <p>"This is a game-changer for how we approach contested battlespaces," said General James Rainey, Commander of Army Futures Command. "These systems multiply our combat power while reducing risk to our soldiers."</p>
                
                <p>Each drone in the swarm is equipped with electro-optical sensors, electronic warfare packages, and small munitions. The AI system allows the swarm to autonomously adapt to changing conditions, reassign targets, and maintain formation integrity even when individual units are lost.</p>
                
                <p>The technology addresses a critical challenge in potential conflicts with near-peer adversaries like China and Russia, where maintaining air superiority could prove costly in terms of aircraft and pilot losses. Unmanned systems offer a way to achieve mass and persistence without proportional increases in risk.</p>
                
                <p>Critics have raised ethical concerns about the increasing autonomy of weapons systems, arguing that meaningful human control must be maintained over life-and-death decisions. The Defense Department maintains that its AI systems are designed with human-in-the-loop safeguards for lethal engagements.</p>
                
                <p>China and Russia are believed to be developing similar capabilities, with both nations investing heavily in autonomous weapons research. The race to deploy AI in military applications is widely seen as a new front in great-power competition.</p>
            `,
            url: "https://www.armytimes.com",
            image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&h=500&fit=crop",
            source: "Army Times",
            publishedAt: new Date(now - 8 * 3600000).toISOString(),
            category: "tech"
        },
        {
            title: "Israel Strikes Iranian Military Facilities in Syria Following Drone Attack",
            description: "IDF conducts extensive air campaign targeting IRGC positions and weapons depots near Damascus after Iranian drone swarm attacks Israeli defense installations.",
            fullContent: `
                <p>The Israeli Defense Forces conducted extensive airstrikes against Iranian military positions in Syria overnight, targeting Revolutionary Guard Corps facilities, weapons storage sites, and air defense systems. The strikes came in response to an Iranian drone swarm attack on Israeli territory earlier this week.</p>
                
                <p>According to Israeli military sources, more than 40 targets were struck across Syria, including near Damascus, Homs, and the coastal region. Syrian state media reported casualties among government forces and significant damage to infrastructure.</p>
                
                <p>"Iran's attempt to establish a permanent military presence on our northern border will not be tolerated," said IDF Chief of Staff Lt. Gen. Herzi Halevi. "We will act decisively to remove this threat."</p>
                
                <p>The initial Iranian attack involved approximately 30 drones launched from positions in Syria and Iraq. While most were intercepted by Israel's Iron Dome and David's Sling systems, several penetrated air defenses and struck a military installation in the Golan Heights, causing minor damage.</p>
                
                <p>The International Atomic Energy Agency has called for restraint, warning that further escalation could destabilize the region. The United States has moved additional assets to the Middle East, including the carrier strike group USS Dwight D. Eisenhower.</p>
                
                <p>Iran has denied direct responsibility for the drone attack, attributing it to allied militias operating independently. Tehran warned that any further Israeli strikes would be met with "overwhelming retaliation" targeting Israeli cities and military installations.</p>
                
                <p>Russia, which maintains forces in Syria, expressed concern over the escalation and called for diplomatic engagement. Moscow has largely avoided confrontation with Israeli operations that target Iranian assets while protecting its own personnel and Syrian government forces.</p>
                
                <p>Regional analysts warn that the cycle of attacks and reprisals could spiral into a broader conflict, particularly if civilian casualties mount or critical infrastructure is damaged. The situation remains highly fluid, with both sides signaling readiness for further military action.</p>
            `,
            url: "https://www.jpost.com",
            image: "https://images.unsplash.com/photo-1559583985-c80d8ad9b29f?w=800&h=500&fit=crop",
            source: "Jerusalem Post",
            publishedAt: new Date(now - 12 * 3600000).toISOString(),
            category: "conflict"
        },
        {
            title: "Germany Approves Historic €100 Billion Defense Modernization Plan",
            description: "Bundestag votes to transform German military with new tanks, aircraft, and naval vessels in largest defense investment since World War II.",
            fullContent: `
                <p>The German Bundestag has approved a landmark €100 billion defense modernization package, the largest military investment in the country's post-war history. The plan aims to transform the Bundeswehr into a force capable of leading NATO operations in Europe.</p>
                
                <p>Key acquisitions include 105 F-35A Lightning II stealth fighters to replace the aging Tornado fleet, 4 Type 212CD submarines, and over 200 Leopard 2A8 main battle tanks. The package also includes significant investments in cyber capabilities, space-based assets, and command and control systems.</p>
                
                <p>"Germany is assuming the responsibility that comes with being Europe's largest economy," said Defense Minister Boris Pistorius. "We will become the backbone of European conventional defense."</p>
                
                <p>The modernization plan represents a dramatic shift from decades of underinvestment that left the Bundeswehr with critical readiness gaps. Reports of pilots unable to log sufficient flight hours and tanks lacking spare parts had become a source of embarrassment for successive governments.</p>
                
                <p>The procurement timeline is aggressive, with the first F-35s expected to arrive by 2026 and the complete fleet operational by 2030. Germany will become the largest F-35 operator in Europe, providing the NATO alliance with significant stealth capability.</p>
                
                <p>Poland and the Baltic states have welcomed the German announcement, viewing it as a necessary response to Russian aggression in Ukraine. France has expressed some reservations about Germany's choice of American aircraft over European alternatives, highlighting ongoing tensions in EU defense cooperation.</p>
                
                <p>The package also includes substantial funding for NATO's eastern flank, where Germany will lead a permanent brigade-sized presence in Lithuania. This deployment represents a fundamental change in Germany's security posture, moving from reinforcement to forward defense.</p>
                
                <p>Industry analysts note that the German defense sector will undergo significant expansion to meet production demands, with major contractors like Rheinmetall and TKMS expecting to double their workforce over the next five years.</p>
            `,
            url: "https://www.dw.com",
            image: "https://images.unsplash.com/photo-1534996858221-380b92700493?w=800&h=500&fit=crop",
            source: "DW News",
            publishedAt: new Date(now - 18 * 3600000).toISOString(),
            category: "defense"
        },
        {
            title: "US Navy Christens First Columbia-Class Nuclear Submarine",
            description: "The USS District of Columbia represents the most advanced nuclear deterrent platform ever built, replacing aging Ohio-class ballistic missile submarines.",
            fullContent: `
                <p>The United States Navy has christened the USS District of Columbia (SSBN-826), the lead ship of the Columbia-class ballistic missile submarine fleet. The vessel represents the most expensive and technologically advanced submarine program in American naval history.</p>
                
                <p>At 560 feet long and displacing 21,000 tons submerged, the Columbia-class submarines are designed to carry 16 Trident II D5LE nuclear missiles, each capable of delivering multiple independently targetable warheads. The submarines will serve as the primary sea-based leg of America's nuclear triad.</p>
                
                <p>"The Columbia-class ensures our strategic deterrence remains credible and effective deep into the 21st century," said Secretary of the Navy Carlos Del Toro at the christening ceremony in Groton, Connecticut.</p>
                
                <p>The new submarines incorporate revolutionary propulsion technology, including an electric drive system that eliminates the need for the reactor to directly turn the propeller shaft, significantly reducing acoustic signatures. The ships are designed for 42-year service lives without requiring reactor refueling.</p>
                
                <p>Development of the Columbia-class has been fraught with challenges, including cost overruns and schedule delays that pushed the program over $130 billion. The Navy has prioritized the program above all other shipbuilding efforts, recognizing the urgent need to replace the aging Ohio-class fleet before it reaches the end of its service life.</p>
                
                <p>Russia and China have both expressed concern over America's submarine modernization, viewing it as part of a broader effort to maintain nuclear superiority. Moscow is developing its own next-generation strategic submarine, the Borei-B class, while Beijing is expanding its naval nuclear capabilities.</p>
                
                <p>The first Columbia-class submarine is scheduled to begin strategic deterrence patrols in 2031. A total of 12 boats will be built, ensuring continuous at-sea presence of American strategic forces for decades to come.</p>
            `,
            url: "https://www.navy.mil",
            image: "https://images.unsplash.com/photo-1544890225-2f3faec4cd60?w=800&h=500&fit=crop",
            source: "US Naval Institute",
            publishedAt: new Date(now - 24 * 3600000).toISOString(),
            category: "defense"
        },
        {
            title: "Russia Deploys S-500 Air Defense System to Protect Strategic Assets",
            description: "Moscow activates next-generation anti-aircraft and anti-ballistic missile system capable of engaging targets at altitudes up to 200 kilometers.",
            fullContent: `
                <p>Russia's Ministry of Defense has announced the operational deployment of the S-500 Prometheus air defense system, the country's most advanced surface-to-air missile platform. The system has been positioned to protect Moscow and key strategic installations.</p>
                
                <p>The S-500 represents a significant upgrade over the S-400, with capabilities specifically designed to counter hypersonic weapons, ballistic missiles, and low-orbit satellites. The system can engage up to 10 targets simultaneously at ranges exceeding 600 kilometers and altitudes up to 200 kilometers.</p>
                
                <p>"The S-500 provides an impenetrable shield over our most critical assets," said Defense Minister Sergei Shoigu during a briefing to Russian President Vladimir Putin. "No adversary missile system can penetrate this defense."</p>
                
                <p>Western military analysts have expressed skepticism about some of Russia's capability claims, noting that the system has not been tested in combat conditions. However, they acknowledge that the S-500 likely represents a genuine improvement in Russian air defense capabilities.</p>
                
                <p>The deployment comes amid ongoing tensions over Ukraine and NATO expansion. Russia has previously threatened to position advanced weapons systems in response to American missile defense installations in Poland and Romania.</p>
                
                <p>NATO intelligence services are working to understand the S-500's full capabilities, including its radar systems and engagement algorithms. This information is critical for developing tactics and technologies to overcome Russian air defenses in potential conflict scenarios.</p>
                
                <p>Several countries, including India and Turkey, have expressed interest in purchasing the S-500 despite potential US sanctions under the Countering America's Adversaries Through Sanctions Act (CAATSA). Russia sees arms sales as both a revenue source and a tool for building strategic relationships.</p>
                
                <p>The Pentagon has downplayed the S-500's impact on American operational planning, noting that stealth aircraft, electronic warfare capabilities, and long-range precision strike weapons provide multiple options for defeating integrated air defense systems.</p>
            `,
            url: "https://www.tass.com",
            image: "https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=800&h=500&fit=crop",
            source: "TASS",
            publishedAt: new Date(now - 36 * 3600000).toISOString(),
            category: "tech"
        },
        {
            title: "Indian Military Conducts Major Exercise Along Disputed Chinese Border",
            description: "Operation Himalayan Shield involves 50,000 troops practicing high-altitude warfare scenarios in Ladakh region amid ongoing standoff.",
            fullContent: `
                <p>The Indian Armed Forces have launched Operation Himalayan Shield, a major military exercise involving over 50,000 troops along the disputed Line of Actual Control with China. The exercise is the largest high-altitude military drill conducted by India in over a decade.</p>
                
                <p>The exercise simulates a multi-front conflict scenario, with Indian forces practicing defensive and offensive operations in terrain exceeding 15,000 feet elevation. Participating units include mechanized infantry, artillery, special forces, and aviation elements.</p>
                
                <p>"Our forces are fully prepared to defend every inch of Indian territory," said Army Chief General Manoj Pande during a visit to forward positions. "We have significantly enhanced our capabilities since 2020."</p>
                
                <p>The exercise comes amid continued tensions following the Galwan Valley clash in 2020, which resulted in the deaths of 20 Indian soldiers and an unknown number of Chinese casualties. Despite multiple rounds of diplomatic talks, both nations maintain enhanced military presences in the region.</p>
                
                <p>India has invested heavily in border infrastructure, building new roads, helipads, and forward operating bases that enable rapid deployment and sustainment of forces. The country has also procured additional artillery systems, drones, and high-altitude equipment.</p>
                
                <p>China's People's Liberation Army has responded with its own exercises on the Tibetan Plateau, demonstrating mobilization capabilities and practicing joint operations between ground and air forces. The PLA has similarly expanded its infrastructure in the region.</p>
                
                <p>The United States and other Western nations have expressed support for India's defensive posture, viewing New Delhi as a crucial partner in maintaining balance in the Indo-Pacific region. Washington has accelerated security cooperation with India, including intelligence sharing and joint training exercises.</p>
                
                <p>Regional analysts warn that the potential for accidental escalation remains high given the proximity of opposing forces and the challenging communication conditions in high-altitude terrain. Both nations have established protocols to prevent incidents, but implementation has been inconsistent.</p>
            `,
            url: "https://www.hindustantimes.com",
            image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=500&fit=crop",
            source: "Hindustan Times",
            publishedAt: new Date(now - 48 * 3600000).toISOString(),
            category: "defense"
        },
        {
            title: "Japan Unveils Next-Generation Stealth Fighter Program",
            description: "Tokyo reveals plans for indigenous F-X fighter jet with advanced AI capabilities and hypersonic weapon integration for 2035 deployment.",
            fullContent: `
                <p>The Japan Air Self-Defense Force has unveiled comprehensive plans for the F-X next-generation stealth fighter, a domestically developed aircraft designed to secure Japanese air superiority well into the mid-21st century. The program represents Japan's largest defense industrial undertaking in decades.</p>
                
                <p>The F-X will feature a twin-engine design with advanced stealth characteristics, artificial intelligence-assisted combat management, and the ability to launch hypersonic missiles. Development is being led by Mitsubishi Heavy Industries with support from British aerospace firm BAE Systems and Italian manufacturer Leonardo.</p>
                
                <p>"This aircraft will ensure Japan's technological edge in an increasingly contested regional security environment," said Defense Minister Minoru Kihara during the program announcement in Tokyo.</p>
                
                <p>The fighter is designed to counter advanced threats from China's J-20 and Russia's Su-57 stealth fighters. Japan's current F-2 fleet is approaching the end of its service life, and the F-X will provide a capability that cannot be obtained through foreign purchases alone.</p>
                
                <p>The program includes development of loyal wingman drones that will operate alongside the manned fighter, extending sensor coverage and weapons capacity. Japan has been testing autonomous UAV concepts in preparation for integration with the F-X.</p>
            `,
            url: "https://www.japantimes.co.jp",
            image: "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=800&h=500&fit=crop",
            source: "Japan Times",
            publishedAt: new Date(now - 56 * 3600000).toISOString(),
            category: "tech"
        },
        {
            title: "Australia Signs Historic AUKUS Submarine Deal with US and UK",
            description: "Canberra finalizes $368 billion agreement for nuclear-powered attack submarines as Pacific security concerns mount.",
            fullContent: `
                <p>Australia has finalized the largest defense procurement in its history, a $368 billion agreement with the United States and United Kingdom to acquire nuclear-powered attack submarines under the AUKUS security partnership. The deal represents a fundamental shift in Australian defense posture.</p>
                
                <p>Under the agreement, Australia will receive three to five Virginia-class submarines from the United States in the early 2030s, followed by a new SSN-AUKUS class designed jointly by all three nations. The submarines will be constructed in Adelaide, creating thousands of skilled jobs.</p>
                
                <p>"This capability is essential for Australia's security in an era of strategic competition," said Prime Minister Anthony Albanese. "These submarines will protect our nation and our interests for generations."</p>
                
                <p>China has strongly condemned the AUKUS agreement, calling it a destabilizing move that will intensify the regional arms race. Beijing has warned of unspecified countermeasures and questioned Australia's adherence to nuclear non-proliferation commitments.</p>
                
                <p>The submarines will operate with nuclear propulsion but carry only conventional weapons. Australia remains committed to its non-nuclear weapon status and has established comprehensive safeguards to ensure compliance with international obligations.</p>
            `,
            url: "https://www.abc.net.au",
            image: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=800&h=500&fit=crop",
            source: "ABC Australia",
            publishedAt: new Date(now - 64 * 3600000).toISOString(),
            category: "defense"
        },
        {
            title: "Turkey Deploys Bayraktar TB3 Drones to Mediterranean Fleet",
            description: "New carrier-capable armed UAVs join TCG Anadolu amphibious assault ship for enhanced power projection in contested waters.",
            fullContent: `
                <p>The Turkish Navy has deployed its first squadron of Bayraktar TB3 armed drones aboard the TCG Anadolu, marking a significant milestone in Ankara's maritime power projection capabilities. The combination creates the world's first drone carrier with indigenous aircraft.</p>
                
                <p>The TB3 is specifically designed for naval operations, featuring folding wings for carrier storage, reinforced landing gear, and extended range optimized for maritime patrol and strike missions. The drone can carry precision-guided munitions and remain airborne for over 24 hours.</p>
                
                <p>"Turkey has achieved a capability that few nations possess," said Defense Industry President Haluk Görüx. "We are now a leader in naval drone operations."</p>
                
                <p>Greece and Cyprus have expressed concern over the deployment, viewing it as an escalation of tensions in the Eastern Mediterranean. The region has been a source of friction over maritime boundaries, energy exploration rights, and territorial disputes.</p>
                
                <p>NATO allies have been closely watching Turkey's growing drone capabilities, which have proven effective in conflicts from Syria to Libya to Ukraine. The TB3 represents the latest evolution in unmanned combat aviation.</p>
            `,
            url: "https://www.dailysabah.com",
            image: "https://images.unsplash.com/photo-1527576539890-dfa815648363?w=800&h=500&fit=crop",
            source: "Daily Sabah",
            publishedAt: new Date(now - 72 * 3600000).toISOString(),
            category: "tech"
        },
        {
            title: "UK Royal Navy Tests Autonomous Mine-Hunting Vessels in Baltic Sea",
            description: "Royal Navy deploys unmanned surface vessels for NATO mine countermeasures exercise protecting critical undersea infrastructure.",
            fullContent: `
                <p>The Royal Navy has successfully tested a fleet of autonomous mine countermeasures vessels during NATO Exercise Baltic Protector, demonstrating capabilities essential for protecting undersea cables and pipelines from potential sabotage or conflict.</p>
                
                <p>The exercise involved six ARCIMS (Atlas Remote Combined Influence Minesweeping System) vessels operating without crew aboard, detecting and neutralizing simulated mines across a 500 square kilometer area. The systems used advanced sonar and AI-powered threat recognition.</p>
                
                <p>"These autonomous systems represent the future of mine warfare," said Rear Admiral Andrew Mayback-Sherlock. "They remove our sailors from danger while providing superior capability."</p>
                
                <p>The exercise takes place against a backdrop of heightened concern over Baltic Sea security following the Nord Stream pipeline explosions. NATO has increased surveillance and protection of critical underwater infrastructure.</p>
                
                <p>The autonomous vessels can operate for extended periods without support, making them ideal for sustained patrol and protection missions. They represent a significant capability for the Royal Navy's mine countermeasures force.</p>
            `,
            url: "https://www.royalnavy.mod.uk",
            image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=500&fit=crop",
            source: "Royal Navy",
            publishedAt: new Date(now - 78 * 3600000).toISOString(),
            category: "tech"
        },
        {
            title: "South Korea Successfully Tests Solid-Fuel Space Launch Vehicle",
            description: "Seoul advances military space capabilities with rocket technology applicable to rapid satellite deployment and long-range missiles.",
            fullContent: `
                <p>South Korea has successfully tested a solid-fueled space launch vehicle, a milestone that advances both civilian space ambitions and military reconnaissance capabilities. The technology enables rapid deployment of satellites during crisis situations.</p>
                
                <p>Unlike liquid-fueled rockets that require hours of preparation, solid-fuel vehicles can be launched on short notice, providing a significant advantage for responsive space access. The successful test places South Korea among a select group of nations with this capability.</p>
                
                <p>"This achievement demonstrates our technological advancement and commitment to independent space access," said Science Minister Lee Jong-ho. "It has significant implications for national security."</p>
                
                <p>The technology is closely related to ballistic missile development, and South Korea has been expanding its missile capabilities following the termination of range and payload restrictions in its agreement with the United States. The move is seen as a response to North Korea's nuclear and missile threats.</p>
                
                <p>North Korea has condemned the test as provocative, despite its own extensive missile and space programs. Pyongyang accused Seoul of pursuing military applications under the guise of space exploration.</p>
            `,
            url: "https://www.koreaherald.com",
            image: "https://images.unsplash.com/photo-1517976487492-5750f3195933?w=800&h=500&fit=crop",
            source: "Korea Herald",
            publishedAt: new Date(now - 84 * 3600000).toISOString(),
            category: "tech"
        },
        {
            title: "France Increases Military Presence in Indo-Pacific Region",
            description: "Paris deploys additional naval assets and strengthens defense ties with Australia, India, and Japan amid growing Chinese influence.",
            fullContent: `
                <p>France has announced a significant expansion of its military presence in the Indo-Pacific region, deploying additional naval vessels and strengthening bilateral defense partnerships with key regional allies. The move underscores Paris's commitment to maintaining freedom of navigation and regional stability.</p>
                
                <p>The deployment includes the nuclear-powered aircraft carrier Charles de Gaulle, accompanied by its strike group of destroyers and submarines. The carrier will conduct joint exercises with the navies of India, Japan, and Australia over a six-month deployment.</p>
                
                <p>"France is an Indo-Pacific nation with territories, citizens, and interests in the region," said Armed Forces Minister Sébastien Lecornu. "We will defend our values and our partners."</p>
                
                <p>The expanded presence comes as France seeks to rebuild defense relationships strained by the AUKUS submarine deal, which resulted in the cancellation of a major French submarine contract with Australia. Paris has refocused its regional strategy on like-minded partners.</p>
                
                <p>China has criticized France's increased military activity, calling it evidence of Western interference in Asian affairs. Beijing has warned against the formation of "mini-NATO" arrangements that it views as containment strategies.</p>
            `,
            url: "https://www.france24.com",
            image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=500&fit=crop",
            source: "France 24",
            publishedAt: new Date(now - 90 * 3600000).toISOString(),
            category: "defense"
        },
        {
            title: "Poland Orders 500 HIMARS Rocket Launchers in Record Defense Deal",
            description: "Warsaw signs largest-ever European arms purchase to fortify NATO's eastern flank against potential Russian aggression.",
            fullContent: `
                <p>Poland has signed a historic agreement with the United States for the purchase of 500 M142 HIMARS (High Mobility Artillery Rocket System) launchers, making it the largest single defense procurement deal in European history. The $10 billion contract will transform Poland into one of NATO's most heavily armed frontline states.</p>
                
                <p>The HIMARS systems have proven highly effective in Ukraine, where they have been used to devastating effect against Russian logistics, command centers, and ammunition depots. Poland's acquisition reflects the lessons learned from the ongoing conflict.</p>
                
                <p>"We are building a military that can deter any aggressor," said Polish Prime Minister Donald Tusk. "Poland will never again be caught unprepared."</p>
                
                <p>The systems will be delivered over a five-year period starting in 2025, and Polish troops are already undergoing training at US Army facilities in Oklahoma. The HIMARS will be complemented by ATACMS long-range missiles, giving Poland deep strike capability.</p>
                
                <p>Russia has warned that Poland's military buildup is destabilizing, but NATO officials view it as a necessary response to Moscow's demonstrated willingness to use force against its neighbors.</p>
            `,
            url: "https://www.defensenews.com",
            image: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&h=500&fit=crop",
            source: "Defense News",
            publishedAt: new Date(now - 96 * 3600000).toISOString(),
            category: "defense"
        },
        {
            title: "Brazil Launches Indigenous Nuclear Submarine Program",
            description: "South America's largest navy begins construction of its first nuclear-powered submarine to patrol vast Atlantic maritime territory.",
            fullContent: `
                <p>Brazil has officially commenced construction of its first nuclear-powered submarine, the Álvaro Alberto, at the Itaguaí Naval Complex near Rio de Janeiro. The program marks a major milestone for South America's most ambitious naval modernization effort.</p>
                
                <p>The submarine is being developed with French technical assistance from Naval Group, but the nuclear propulsion system is entirely Brazilian-designed. Brazil is one of the few nations to have developed indigenous uranium enrichment capability, providing the fuel for the reactor.</p>
                
                <p>"This submarine guarantees Brazil's sovereignty over the Blue Amazon — our vast maritime territory," said Brazilian Navy Commander Admiral Marcos Olsen.</p>
                
                <p>The Álvaro Alberto will displace approximately 6,000 tons submerged and carry conventional weapons including torpedoes and anti-ship missiles. Nuclear propulsion gives the vessel virtually unlimited range and the ability to remain submerged for extended periods.</p>
                
                <p>Construction is expected to take 8-10 years, with the submarine entering service in the early 2030s. The program has faced delays and budget constraints but remains a national priority for Brazil's defense establishment.</p>
            `,
            url: "https://www.naval-technology.com",
            image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=500&fit=crop",
            source: "Naval Technology",
            publishedAt: new Date(now - 100 * 3600000).toISOString(),
            category: "defense"
        },
        {
            title: "Taiwan Conducts Largest-Ever Han Kuang Military Exercise",
            description: "Island nation simulates full-scale Chinese invasion with live-fire drills involving all military branches amid heightened cross-strait tensions.",
            fullContent: `
                <p>Taiwan has completed its largest-ever Han Kuang military exercise, a five-day simulation of a full-scale Chinese amphibious invasion that involved over 150,000 military personnel and reservists across the island.</p>
                
                <p>The exercise tested Taiwan's defense plan for repelling a cross-strait attack, including beach defense operations, urban warfare scenarios, and critical infrastructure protection. Live-fire exercises were conducted along the eastern and western coasts.</p>
                
                <p>"We train for the worst-case scenario so we are prepared for any threat," said Taiwan's Defense Minister Wellington Koo. "Our military is ready and our resolve is unshakeable."</p>
                
                <p>The exercise featured the deployment of newly acquired M1A2T Abrams tanks, Harpoon coastal defense missiles, and Stinger anti-aircraft systems purchased from the United States. Taiwan's domestically built Hsiung Feng III supersonic anti-ship missiles were also prominently featured.</p>
                
                <p>China responded by deploying fighter jets and naval vessels near the Taiwan Strait median line, conducting what Beijing described as "combat readiness patrols." The PLA Eastern Theater Command issued a statement warning that "Taiwan independence means war."</p>
            `,
            url: "https://www.taiwannews.com",
            image: "https://images.unsplash.com/photo-1580130732478-4e339fb6836f?w=800&h=500&fit=crop",
            source: "Taiwan News",
            publishedAt: new Date(now - 108 * 3600000).toISOString(),
            category: "conflict"
        },
        {
            title: "NATO Baltic Air Policing Mission Intercepts Record Number of Russian Aircraft",
            description: "Allied fighter jets scrambled over 400 times in 2025 to intercept Russian military aircraft near Baltic airspace.",
            fullContent: `
                <p>NATO's Baltic Air Policing mission has reported a record number of intercepts of Russian military aircraft in 2025, with allied fighter jets scrambling more than 400 times to identify and escort Russian planes flying near the airspace of Estonia, Latvia, and Lithuania.</p>
                
                <p>The intercepts involved Su-27, Su-30, and Su-35 fighters, as well as Tu-22M3 bombers and Il-20 reconnaissance aircraft. Many Russian aircraft were flying without active transponders and had not filed flight plans, posing a risk to civil aviation.</p>
                
                <p>"The frequency and aggressive nature of Russian air activity has increased significantly," said NATO Allied Air Command spokesperson Colonel Hans Müller. "Our forces remain vigilant 24/7."</p>
                
                <p>Currently, German Eurofighter Typhoons and Spanish F/A-18 Hornets are deployed to the Baltic region, operating from air bases in Estonia and Lithuania. The rotational deployment ensures NATO allies have a continuous fighter presence in the region.</p>
            `,
            url: "https://www.nato.int",
            image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=500&fit=crop",
            source: "NATO",
            publishedAt: new Date(now - 115 * 3600000).toISOString(),
            category: "defense"
        },
        {
            title: "Saudi Arabia Reveals Its First Domestically Built Armed Drone",
            description: "Kingdom presents the Saqr-1 combat UAV as part of Vision 2030 defense industrialization goals.",
            fullContent: `
                <p>Saudi Arabia has unveiled the Saqr-1, its first domestically designed and manufactured armed unmanned aerial vehicle, at the World Defense Show in Riyadh. The medium-altitude, long-endurance drone is capable of carrying precision-guided munitions and performing ISR missions.</p>
                
                <p>The Saqr-1 is developed by the Saudi Arabian Military Industries (SAMI) corporation and represents a significant step in the Kingdom's push to localize 50% of its defense spending under Vision 2030.</p>
                
                <p>"We are no longer just buyers of military technology — we are now makers," said SAMI CEO Walid Abukhaled. "The Saqr-1 demonstrates our growing industrial capabilities."</p>
                
                <p>The drone features a 24-hour endurance, a payload capacity of 300 kg, and a satellite communication link for beyond-line-of-sight operations. It is designed for both reconnaissance and strike missions across Saudi Arabia's vast territory.</p>
                
                <p>Several Middle Eastern and African nations have expressed interest in purchasing the Saqr-1, which would make Saudi Arabia a new entrant in the increasingly competitive global drone market dominated by the US, China, Turkey, and Israel.</p>
            `,
            url: "https://www.arabnews.com",
            image: "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?w=800&h=500&fit=crop",
            source: "Arab News",
            publishedAt: new Date(now - 120 * 3600000).toISOString(),
            category: "tech"
        },
        {
            title: "Philippines Expands South China Sea Patrol With New Warships",
            description: "Manila commissions two new corvettes to strengthen maritime presence in disputed West Philippine Sea territories.",
            fullContent: `
                <p>The Philippine Navy has commissioned two new corvettes, the BRP José Rizal and BRP Antonio Luna, expanding its capability to patrol contested waters in the South China Sea. The ships were built in South Korea and equipped with modern weapons and sensors.</p>
                
                <p>The corvettes are armed with anti-ship missiles, a 76mm main gun, and torpedo launchers, making them the most capable warships in the Philippine fleet. They also carry a helicopter for extended surveillance operations.</p>
                
                <p>"These ships demonstrate our commitment to defending our sovereign rights in the West Philippine Sea," said Philippine Navy Flag Officer-in-Command Vice Admiral Toribio Adaci Jr.</p>
                
                <p>The commissioning comes amid escalating confrontations between Philippine and Chinese Coast Guard vessels near contested reefs and shoals. The Philippines has filed multiple diplomatic protests over Chinese water cannon attacks and dangerous maneuvers against its supply missions.</p>
            `,
            url: "https://www.philstar.com",
            image: "https://images.unsplash.com/photo-1589802829985-817e51171b92?w=800&h=500&fit=crop",
            source: "Philippine Star",
            publishedAt: new Date(now - 126 * 3600000).toISOString(),
            category: "defense"
        },
        {
            title: "US Space Force Launches New Missile Warning Satellite",
            description: "Next-generation infrared satellite enhances America's ability to detect ballistic missile launches worldwide in near real-time.",
            fullContent: `
                <p>The US Space Force has successfully launched a Next-Generation Overhead Persistent Infrared (Next-Gen OPIR) satellite from Cape Canaveral, Florida. The satellite is the first in a constellation designed to replace the aging Space Based Infrared System (SBIRS).</p>
                
                <p>The Next-Gen OPIR satellite features advanced infrared sensors capable of detecting missile launches from any location on Earth within seconds. The improved sensitivity allows it to track smaller, faster-burning rocket motors, including those used in hypersonic weapons.</p>
                
                <p>"This satellite is the cornerstone of our missile warning architecture," said General Chance Saltzman, Chief of Space Operations. "It gives our nation precious minutes to respond to incoming threats."</p>
                
                <p>The satellite was launched aboard a SpaceX Falcon Heavy rocket and will be positioned in geosynchronous orbit. Two additional satellites in the constellation are scheduled for launch over the next 18 months, providing global coverage with improved redundancy.</p>
            `,
            url: "https://www.spaceforce.mil",
            image: "https://images.unsplash.com/photo-1454789548928-9efd52dc4031?w=800&h=500&fit=crop",
            source: "US Space Force",
            publishedAt: new Date(now - 132 * 3600000).toISOString(),
            category: "tech"
        },
        {
            title: "Egypt Receives First Batch of Russian Su-35 Fighter Jets",
            description: "Cairo takes delivery of advanced Su-35SE Flanker-E multirole aircraft despite US sanctions concerns over Russian military purchases.",
            fullContent: `
                <p>The Egyptian Air Force has received the first batch of Su-35SE Flanker-E multirole fighters from Russia, completing a deal negotiated several years ago. The delivery has raised concerns in Washington about potential sanctions under CAATSA.</p>
                
                <p>The Su-35SE is considered one of Russia's most capable fighter aircraft, featuring thrust-vectoring engines, advanced radar, and a wide array of air-to-air and air-to-ground weapons. Egypt ordered approximately 24 aircraft in a deal worth over $2 billion.</p>
                
                <p>Egypt's decision to proceed with the purchase despite American objections highlights the complex balancing act Cairo performs between its relationships with Washington and Moscow. Egypt is one of the largest recipients of US military aid.</p>
                
                <p>Regional analysts note that the Su-35 gives Egypt a qualitative edge over many of its neighbors while diversifying its supplier base. Egypt already operates French Rafale fighters alongside older American F-16s, maintaining one of the most diverse air forces in the Middle East.</p>
            `,
            url: "https://www.aljazeera.com",
            image: "https://images.unsplash.com/photo-1593113616828-6f22bca04804?w=800&h=500&fit=crop",
            source: "Al Jazeera",
            publishedAt: new Date(now - 140 * 3600000).toISOString(),
            category: "defense"
        },
        {
            title: "Norway Discovers Russian Spy Ship Near Undersea Cable Routes",
            description: "Norwegian Coast Guard detains suspicious vessel found loitering near critical North Sea data cable and pipeline infrastructure.",
            fullContent: `
                <p>The Norwegian Coast Guard has intercepted and detained a Russian-flagged vessel suspected of conducting surveillance operations near critical undersea cable and pipeline infrastructure in the North Sea. The ship was found loitering in restricted waters without proper authorization.</p>
                
                <p>The vessel was equipped with communication intercept equipment and underwater survey capabilities inconsistent with its declared purpose as a research vessel. Norwegian intelligence services are investigating whether the ship was conducting espionage.</p>
                
                <p>"We take any threat to our critical infrastructure extremely seriously," said Norwegian Defence Minister Bjørn Arild Gram. "Our maritime surveillance has been significantly enhanced."</p>
                
                <p>The incident highlights growing concerns across Northern Europe about Russian hybrid warfare targeting undersea infrastructure. Similar incidents have been reported near cables and pipelines in the Baltic Sea, English Channel, and Irish Sea.</p>
            `,
            url: "https://www.nrk.no",
            image: "https://images.unsplash.com/photo-1504681869696-d977211a5f4c?w=800&h=500&fit=crop",
            source: "NRK",
            publishedAt: new Date(now - 148 * 3600000).toISOString(),
            category: "conflict"
        },
        {
            title: "Indonesia Orders 42 Dassault Rafale Fighter Jets from France",
            description: "Southeast Asian nation signs $8.1 billion deal to modernize aging air force fleet with 4.5-generation French combat aircraft.",
            fullContent: `
                <p>Indonesia has finalized a major defense deal with France for 42 Dassault Rafale multirole combat aircraft, worth approximately $8.1 billion. The agreement represents the largest defense acquisition in Indonesian history and a significant upgrade for the country's air capabilities.</p>
                
                <p>The Rafales will replace the aging fleet of F-5E Tiger IIs and supplement Indonesia's existing Su-27 and Su-30 fighters. The deal includes pilot training, logistics support, and technology transfer agreements.</p>
                
                <p>"The Rafale gives Indonesia a fighter that can credibly defend our vast archipelago," said Indonesian Defense Minister Prabowo Subianto. "This aircraft matches our strategic requirements perfectly."</p>
                
                <p>The deal marks France's growing influence in Southeast Asian defense markets, competing with American and Russian suppliers. Indonesia chose the Rafale after evaluating the F-15EX, Eurofighter Typhoon, and Su-35.</p>
            `,
            url: "https://www.thejakartapost.com",
            image: "https://images.unsplash.com/photo-1457364887197-9150188c107b?w=800&h=500&fit=crop",
            source: "Jakarta Post",
            publishedAt: new Date(now - 156 * 3600000).toISOString(),
            category: "defense"
        },
        {
            title: "Pentagon Tests AI System for Real-Time Battlefield Decision Support",
            description: "Project Maven's latest iteration uses machine learning to analyze satellite imagery and recommend tactical options to commanders.",
            fullContent: `
                <p>The US Department of Defense has completed successful testing of an advanced artificial intelligence system designed to provide real-time battlefield decision support to military commanders. The system, an evolution of Project Maven, can process satellite imagery, signals intelligence, and sensor data simultaneously.</p>
                
                <p>During a recent exercise at the National Training Center at Fort Irwin, California, the AI system analyzed thousands of data points in real-time, identifying enemy positions, predicting movements, and recommending course-of-action options to brigade commanders.</p>
                
                <p>"The AI reduced our decision cycle from hours to minutes," said Brigadier General Sarah Thompson, who oversaw the exercise. "It doesn't replace human judgment — it enhances it with speed and depth that humans alone cannot achieve."</p>
                
                <p>The system uses a combination of computer vision, natural language processing, and predictive analytics to synthesize information from multiple intelligence sources. It presents options to commanders through an intuitive interface, maintaining human control over all decisions.</p>
                
                <p>Critics have raised concerns about the reliability of AI recommendations in combat, where errors could have lethal consequences. The Pentagon emphasizes that all lethal decisions remain with human operators and the AI serves only as an advisory tool.</p>
            `,
            url: "https://www.defenseone.com",
            image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=500&fit=crop",
            source: "Defense One",
            publishedAt: new Date(now - 160 * 3600000).toISOString(),
            category: "tech"
        },
        {
            title: "NATO Conducts Largest Arctic Warfare Exercise Since Cold War",
            description: "Exercise Nordic Response involves 30,000 troops from 15 nations practicing cold-weather combat operations above the Arctic Circle.",
            fullContent: `
                <p>NATO has launched Exercise Nordic Response, its largest Arctic warfare drill since the Cold War, involving over 30,000 military personnel from 15 allied nations in the frozen terrain of northern Norway, Sweden, and Finland.</p>
                
                <p>The exercise tests NATO's ability to operate in extreme cold conditions, with temperatures regularly dropping below -30°C. Troops practice cross-country skiing with heavy equipment, building defensive positions in deep snow, and coordinating amphibious landings on frozen coastlines.</p>
                
                <p>"The Arctic is increasingly becoming a contested space," said NATO Supreme Allied Commander Europe General Christopher Cavoli. "Our adversaries are expanding their Arctic capabilities, and we must demonstrate our readiness to defend every inch of Allied territory."</p>
                
                <p>The exercise comes amid growing Russian military activity in the Arctic, where Moscow has been reopening Soviet-era bases and deploying new missile systems. Russia's Northern Fleet, based in Murmansk, represents one of the country's most capable naval formations.</p>
                
                <p>Finland and Sweden's recent accession to NATO has dramatically changed the alliance's posture in the region, adding 1,340 kilometers of border with Russia and extensive Arctic warfare expertise built over decades of Cold War readiness.</p>
                
                <p>The drills include submarine operations under ice, helicopter insertion of special forces teams, and coordination between land, sea, and air units in conditions where GPS signals can be unreliable and communication equipment can fail in extreme cold.</p>
            `,
            url: "https://www.nato.int",
            image: "https://images.unsplash.com/photo-1542401886-65d6c61db217?w=800&h=500&fit=crop",
            source: "NATO News",
            publishedAt: new Date(now - 168 * 3600000).toISOString(),
            category: "defense"
        },
        {
            title: "India Successfully Test-Fires Tejas Mk2 Advanced Fighter Jet",
            description: "HAL's next-generation indigenous combat aircraft completes maiden flight with GE F414 engine integration, marking a milestone for Indian aerospace.",
            fullContent: `
                <p>Hindustan Aeronautics Limited has successfully completed the maiden flight of the Tejas Mk2 Medium Weight Fighter, India's most advanced indigenous combat aircraft. The flight, conducted from the HAL Airport in Bengaluru, lasted approximately 50 minutes.</p>
                
                <p>The Tejas Mk2 features a General Electric F414-INS6 afterburning engine, providing significantly more thrust than the current Tejas Mk1A's GE F404 powerplant. The aircraft also incorporates a new AESA radar, advanced electronic warfare suite, and internal weapons bay for reduced radar signature.</p>
                
                <p>"This is a watershed moment for Indian aviation," said HAL Chairman and Managing Director C.B. Ananthakrishnan. "The Mk2 represents a generational leap in capability and puts India among the top fighter aircraft manufacturers globally."</p>
                
                <p>The Indian Air Force plans to procure approximately 100 Tejas Mk2 aircraft to replace its aging fleet of MiG-29 and Mirage 2000 fighters. Initial operational clearance is expected by 2028, with full-scale production beginning by 2030.</p>
                
                <p>The aircraft will carry a diverse armament including the Astra beyond-visual-range missile, SCALP cruise missiles, and precision-guided bombs. Integration of the BrahMos-NG supersonic missile is also planned for future variants.</p>
            `,
            url: "https://www.hindustantimes.com",
            image: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&h=500&fit=crop",
            source: "Hindustan Times",
            publishedAt: new Date(now - 174 * 3600000).toISOString(),
            category: "tech"
        },
        {
            title: "Ukraine Develops Autonomous Sea Drones That Threaten Russian Black Sea Fleet",
            description: "Kyiv's innovative naval drone program has forced Russian warships to retreat from Crimean ports, reshaping the Black Sea balance of power.",
            fullContent: `
                <p>Ukraine's innovative naval drone program has fundamentally altered the balance of power in the Black Sea, forcing Russia's Black Sea Fleet to relocate from its historic base in Sevastopol, Crimea, to ports further east in Novorossiysk.</p>
                
                <p>The unmanned surface vessels (USVs), including the Sea Baby and MAGURA V5 models, have successfully struck Russian warships, port infrastructure, and even the Kerch Bridge connecting Crimea to mainland Russia. The drones carry explosive payloads of up to 850 kilograms and can operate at ranges exceeding 800 kilometers.</p>
                
                <p>"We've created a new category of naval warfare," said a Ukrainian military intelligence official. "For the cost of one anti-ship missile, we can build dozens of sea drones capable of threatening billion-dollar warships."</p>
                
                <p>The success of Ukrainian naval drones has prompted navies worldwide to reassess their anti-surface warfare doctrines. The US Navy, Royal Navy, and several Asian navies have accelerated their own unmanned maritime programs in response to lessons from the conflict.</p>
                
                <p>Russia has attempted to counter the threat by deploying additional helicopter patrols, laying sea mines, and installing anti-drone barriers around key ports. However, the sheer volume and variety of Ukrainian USV attacks has overwhelmed many defensive measures.</p>
                
                <p>Military analysts describe Ukraine's drone warfare innovation as one of the most significant tactical developments in modern naval history, comparable to the introduction of torpedo boats in the 19th century.</p>
            `,
            url: "https://www.ukrinform.net",
            image: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=800&h=500&fit=crop",
            source: "Ukrinform",
            publishedAt: new Date(now - 182 * 3600000).toISOString(),
            category: "conflict"
        },
        {
            title: "Germany and France Unveil Next-Generation Main Battle Tank Concept",
            description: "The Main Ground Combat System (MGCS) prototype features active protection, AI-assisted targeting, and drone integration for 2040s deployment.",
            fullContent: `
                <p>Germany and France have jointly unveiled the conceptual design for the Main Ground Combat System (MGCS), the next-generation main battle tank that will replace both the Leopard 2 and Leclerc tanks in service with both nations and potentially other European allies.</p>
                
                <p>The MGCS concept features a revolutionary design with a crewless turret, active protection systems against anti-tank missiles, AI-assisted target identification, and integrated drone launch capability. The vehicle incorporates advanced composite and reactive armor, along with a new 130mm smoothbore gun.</p>
                
                <p>"This tank will define European armored warfare for the next fifty years," said Colonel Hans-Peter Dröll of the German Army's procurement office. "It combines the best of Franco-German engineering excellence."</p>
                
                <p>The joint program, managed by KNDS (a merger between KMW and Nexter), has overcome significant political and industrial hurdles. Work shares are split 50-50 between the two nations, with key subsystems developed by Rheinmetall, Thales, and MBDA.</p>
                
                <p>Initial prototypes are expected by 2030, with low-rate production beginning in 2035 and full operational capability targeted for 2040. Several NATO allies, including the Netherlands, Belgium, and Italy, have expressed interest in joining the program.</p>
            `,
            url: "https://www.janes.com",
            image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&h=500&fit=crop",
            source: "Janes Defence",
            publishedAt: new Date(now - 190 * 3600000).toISOString(),
            category: "tech"
        },
        {
            title: "Israel's Iron Beam Laser Defense System Completes Combat Trials",
            description: "Rafael's directed-energy weapon intercepts rockets, drones, and mortar rounds at a fraction of the cost of traditional missile defense systems.",
            fullContent: `
                <p>Israel's Ministry of Defense has announced the successful completion of operational combat trials for the Iron Beam laser defense system, a groundbreaking directed-energy weapon developed by Rafael Advanced Defense Systems. The system intercepted multiple incoming rockets, artillery shells, and drones during live tests.</p>
                
                <p>Iron Beam uses a high-energy laser to destroy airborne threats at the speed of light, with each engagement costing approximately $3.50 in electricity — compared to $40,000-$100,000 for a single Iron Dome interceptor missile.</p>
                
                <p>"This is a revolutionary change in the economics of defense," said Israeli Defense Minister Yoav Gallant. "The laser tilts the cost equation decisively in our favor. Our enemies can no longer overwhelm our defenses through sheer volume of fire."</p>
                
                <p>The system is particularly effective against short-range rockets and drone swarms, threats that have become increasingly common in Israel's security environment. Iron Beam is designed to complement, not replace, existing missile defense layers including Iron Dome, David's Sling, and Arrow.</p>
                
                <p>Several nations, including the United States, have expressed interest in the technology. The US Army has already been collaborating with Israel on high-energy laser development through the Iron Beam partnership program and its own Indirect Fires Protection Capability initiative.</p>
                
                <p>Initial deployment is planned for 2025 along Israel's borders with Gaza and Lebanon. A naval variant for warship protection is also under development.</p>
            `,
            url: "https://www.timesofisrael.com",
            image: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800&h=500&fit=crop",
            source: "Times of Israel",
            publishedAt: new Date(now - 196 * 3600000).toISOString(),
            category: "tech"
        },
        {
            title: "China Tests Anti-Satellite Weapon Causing International Concern",
            description: "PLA Strategic Support Force demonstrates ability to disable satellites in low-Earth orbit, threatening US military communication networks.",
            fullContent: `
                <p>The US Space Command has confirmed that China conducted a test of a ground-based anti-satellite (ASAT) weapon system, demonstrating the ability to threaten satellites critical to American military operations. The test targeted a defunct Chinese weather satellite in low-Earth orbit.</p>
                
                <p>The test generated a cloud of debris that poses risks to the International Space Station and commercial satellites. The US State Department condemned the test as "irresponsible" and called for immediate negotiations on space arms control.</p>
                
                <p>"China's ASAT capabilities represent a direct threat to the space-based systems that underpin our national security and modern way of life," said General Stephen Whiting, Commander of US Space Command.</p>
                
                <p>American military operations are heavily dependent on satellites for communication, navigation, intelligence gathering, and missile warning. A successful Chinese campaign against US space assets could significantly degrade military effectiveness in a conflict scenario.</p>
                
                <p>The Pentagon has responded by accelerating efforts to make space systems more resilient, including the development of satellite constellations that are harder to target and the deployment of counter-space capabilities of its own.</p>
                
                <p>Russia also possesses ASAT capabilities and has conducted previous tests. The growing militarization of space has prompted calls for a new international treaty governing space-based weapons, but negotiations have stalled over disagreements about verification mechanisms.</p>
            `,
            url: "https://www.spacenews.com",
            image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&h=500&fit=crop",
            source: "SpaceNews",
            publishedAt: new Date(now - 204 * 3600000).toISOString(),
            category: "conflict"
        },
        {
            title: "Houthi Attacks in Red Sea Force Global Shipping Reroutes",
            description: "Iran-backed Yemen militants strike commercial vessels with anti-ship missiles and drones, disrupting 15% of global maritime trade.",
            fullContent: `
                <p>Escalating Houthi attacks on commercial shipping in the Red Sea have forced major carriers to reroute vessels around the Cape of Good Hope, adding thousands of miles and billions of dollars in costs to global supply chains. The Iran-backed group has struck over 80 vessels since November.</p>
                
                <p>The Houthis are using a combination of anti-ship ballistic missiles, cruise missiles, and explosive-laden drones to target merchant ships. The attacks exploit the narrow chokepoint of the Bab el-Mandeb Strait, through which approximately 15% of global maritime trade normally passes.</p>
                
                <p>"These attacks represent the most significant disruption to international shipping since World War II," said Admiral Brad Cooper, Commander of US Naval Forces Central Command. "The scope and persistence of Houthi operations are unprecedented for a non-state actor."</p>
                
                <p>The US and UK have conducted strikes against Houthi missile launchers, drone facilities, and weapons storage sites in Yemen, but the group has demonstrated significant resilience and the ability to sustain operations despite damage to its infrastructure.</p>
                
                <p>Insurance rates for Red Sea transit have increased over 500%, and shipping times to Europe have extended by 10-14 days. The disruption has particularly impacted European energy imports, automotive supply chains, and consumer goods deliveries.</p>
                
                <p>Iran has denied direct involvement but continues to supply the Houthis with weapons technology, including anti-ship missile components and drone parts smuggled through Oman and across the Arabian Sea.</p>
            `,
            url: "https://www.reuters.com",
            image: "https://images.unsplash.com/photo-1494412651409-8963ce7935a7?w=800&h=500&fit=crop",
            source: "Reuters",
            publishedAt: new Date(now - 210 * 3600000).toISOString(),
            category: "conflict"
        },
        {
            title: "Japan and Philippines Sign Historic Mutual Defense Agreement",
            description: "Tokyo and Manila forge landmark security pact allowing Japanese military forces to operate from Philippine bases amid South China Sea tensions.",
            fullContent: `
                <p>Japan and the Philippines have signed a landmark Reciprocal Access Agreement (RAA), allowing Japanese Self-Defense Forces to conduct training exercises and operate from military bases in the Philippines. The pact represents Japan's most significant bilateral defense agreement in decades.</p>
                
                <p>The agreement comes amid escalating tensions in the South China Sea, where Chinese Coast Guard vessels have repeatedly confronted Philippine ships near contested reefs and shoals. Both nations view China's maritime expansion as a direct threat to their security.</p>
                
                <p>"This agreement strengthens the fabric of security across the Indo-Pacific," said Japanese Prime Minister. "Japan and the Philippines share a commitment to a free and open maritime order based on international law."</p>
                
                <p>Under the RAA, Japan will be able to deploy maritime patrol aircraft, naval vessels, and ground forces to the Philippines for joint exercises and humanitarian assistance operations. The agreement also facilitates intelligence sharing and logistics cooperation.</p>
                
                <p>The Philippines has also recently strengthened defense ties with Australia, South Korea, and India, building a network of security partnerships that complements its long-standing alliance with the United States. Analysts describe this web of agreements as an emerging "lattice" of deterrence against Chinese coercion.</p>
                
                <p>China has criticized the agreement as evidence of Japanese militarism and warned that external interference in South China Sea disputes will only increase tensions in the region.</p>
            `,
            url: "https://www.japantimes.co.jp",
            image: "https://images.unsplash.com/photo-1524522173746-f628baad3644?w=800&h=500&fit=crop",
            source: "Japan Times",
            publishedAt: new Date(now - 218 * 3600000).toISOString(),
            category: "defense"
        },
        {
            title: "US Army Awards Contract for Next-Generation Autonomous Combat Vehicle",
            description: "General Dynamics wins $4.6 billion contract for robotic fighting vehicle designed to operate alongside manned M1 Abrams tanks.",
            fullContent: `
                <p>The US Army has awarded General Dynamics Land Systems a $4.6 billion contract for the Robotic Combat Vehicle (RCV), an autonomous fighting machine designed to operate in concert with manned Abrams tanks and Bradley fighting vehicles on future battlefields.</p>
                
                <p>The RCV Medium variant weighs approximately 15 tons and carries a 30mm automatic cannon, anti-tank missiles, and advanced sensor suites. It can operate fully autonomously or under remote human supervision, depending on the mission profile and rules of engagement.</p>
                
                <p>"The RCV fundamentally changes how we think about armored warfare," said Army Chief of Staff General Randy George. "It allows us to put sensors and weapons forward in the most dangerous areas without risking the lives of our soldiers."</p>
                
                <p>The vehicle uses artificial intelligence to navigate complex terrain, identify potential threats, and recommend engagement options to human operators who maintain authority over all lethal decisions. The system is designed to learn and adapt through continuous operation.</p>
                
                <p>The Army plans to deploy the first RCV formations by 2030, initially pairing robotic vehicles with existing armored brigade combat teams. Eventually, entire formations of autonomous ground vehicles operating alongside unmanned aerial systems could transform the character of ground combat.</p>
                
                <p>The program addresses concerns about force size limitations, as the Army struggles to recruit sufficient personnel. Robotic systems offer a way to expand combat power without proportional increases in personnel.</p>
            `,
            url: "https://www.armytimes.com",
            image: "https://images.unsplash.com/photo-1579912437766-7896df6d3cd3?w=800&h=500&fit=crop",
            source: "Army Times",
            publishedAt: new Date(now - 226 * 3600000).toISOString(),
            category: "tech"
        },
        {
            title: "Finland Fortifies Eastern Border With Advanced Surveillance System",
            description: "Helsinki deploys AI-powered sensor network along 1,340km Russian border combining radar, cameras, and ground sensors for complete situational awareness.",
            fullContent: `
                <p>Finland has begun deploying a comprehensive AI-powered surveillance system along its 1,340-kilometer border with Russia, the longest of any NATO member state. The system combines ground-based radar, thermal cameras, acoustic sensors, and seismic detectors into an integrated monitoring network.</p>
                
                <p>The surveillance infrastructure, developed by Finnish defense technology companies Patria and Insta, uses machine learning algorithms to automatically classify border crossings, distinguish between animals and humans, and alert border guards to suspicious activities in real-time.</p>
                
                <p>"Our border is NATO's border, and we take this responsibility extremely seriously," said Finland's Interior Minister Mari Rantanen. "This system gives us unmatched awareness of what is happening along every meter of our frontier."</p>
                
                <p>The deployment follows a series of incidents in which Russia was accused of facilitating irregular migration across the Finnish border as a form of hybrid warfare. Finland temporarily closed all land border crossings with Russia in response.</p>
                
                <p>In addition to electronic surveillance, Finland has been expanding physical barriers, including fencing and obstacle systems, at key crossing points. The country has also increased military presence along the border, with regular patrols by both border guard units and Finnish Defence Forces.</p>
                
                <p>Finland's NATO membership, formalized in April 2023, brought the alliance's border with Russia to its greatest extent since the Cold War. The Finnish military, which maintained conscription throughout the post-Cold War period, provides NATO with an experienced force of 280,000 reservists trained in border defense and territorial warfare.</p>
            `,
            url: "https://www.yle.fi",
            image: "https://images.unsplash.com/photo-1551524559-8af4e6624178?w=800&h=500&fit=crop",
            source: "YLE News",
            publishedAt: new Date(now - 234 * 3600000).toISOString(),
            category: "defense"
        },
        {
            title: "India's HAL Tejas Mk2 Medium-Weight Fighter Rolls Out — DRDO Hails Breakthrough",
            description: "Hindustan Aeronautics Limited unveils the Tejas Mk2, India's most advanced indigenous fighter jet, with GE F414 engine, AESA radar, and internal weapons bay.",
            fullContent: `
                <p>Hindustan Aeronautics Limited (HAL) has officially rolled out the first prototype of the Tejas Mk2 medium-weight fighter at its Bengaluru facility, marking a major milestone in India's defence self-reliance journey. The aircraft is designed to replace the aging fleet of Mirage 2000 and MiG-29 fighters in the Indian Air Force.</p>
                
                <p>The Tejas Mk2 is significantly larger and more capable than the original LCA Tejas Mk1A, featuring a GE F414-INS6 engine producing 98 kN of thrust, an indigenous Uttam AESA radar developed by DRDO's LRDE laboratory, and a semi-recessed weapons bay for reduced radar cross-section.</p>
                
                <p>"This aircraft represents the pinnacle of Indian aerospace engineering," said DRDO Chairman Dr. Samir V. Kamat. "It incorporates over 60% indigenous content and positions India among a select group of nations capable of designing advanced fighter jets."</p>
                
                <p>The Mk2 variant features a lengthened fuselage, canard foreplanes for improved maneuverability, a digital fly-by-wire flight control system, and provisions for carrying the BrahMos-NG mini cruise missile and Astra Mk2 beyond-visual-range air-to-air missile. The aircraft is designed for a 6,500+ kg payload capacity.</p>
                
                <p>The Indian Air Force has committed to ordering 108 Tejas Mk2 aircraft, with deliveries expected to begin by 2028-29. The program is valued at approximately ₹67,000 crore ($8 billion), making it one of India's largest indigenous defence procurement projects.</p>
                
                <p>First flight is expected in late 2026, with the aircraft undergoing extensive flight testing at multiple test ranges across India. HAL is also developing a twin-engine deck-based variant for the Indian Navy's future aircraft carriers.</p>
            `,
            url: "https://www.livefistdefence.com",
            image: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&h=500&fit=crop",
            source: "LiveFist Defence",
            publishedAt: new Date(now - 3 * 3600000).toISOString(),
            category: "defense"
        },
        {
            title: "India Successfully Tests BrahMos-II Hypersonic Cruise Missile at Mach 7",
            description: "DRDO and BrahMos Aerospace achieve landmark hypersonic test, making India the fourth nation to operationally test a scramjet-powered cruise missile.",
            fullContent: `
                <p>India's Defence Research and Development Organisation (DRDO) and BrahMos Aerospace have successfully tested the BrahMos-II hypersonic cruise missile, achieving speeds exceeding Mach 7 during a flight from the Integrated Test Range at Chandipur, Odisha.</p>
                
                <p>The test marks India's entry into the elite club of nations possessing operational hypersonic cruise missile technology, alongside the United States, Russia, and China. The missile flew for over 300 kilometers, demonstrating its scramjet propulsion system and advanced guidance capabilities.</p>
                
                <p>"This is a game-changing achievement for Indian defence," said Defence Minister Rajnath Singh. "The BrahMos-II gives us a strategic edge with its ability to defeat any existing air defense system through sheer speed and maneuverability."</p>
                
                <p>The BrahMos-II uses a dual-mode ramjet/scramjet engine that transitions from supersonic to hypersonic speeds during flight. The missile's airframe is constructed using advanced titanium alloys and carbon-carbon composites to withstand extreme temperatures generated at hypersonic velocities.</p>
                
                <p>Unlike its predecessor, the BrahMos supersonic missile which caps at Mach 2.8, the BrahMos-II can perform evasive maneuvers at hypersonic speeds, making it virtually impossible to intercept with current air defense systems. The weapon can be launched from land, sea, and air platforms.</p>
                
                <p>The Indian Navy plans to integrate the BrahMos-II aboard its Visakhapatnam-class destroyers and next-generation Project 17B frigates. The IAF will deploy the missile on Su-30MKI fighters with a specially designed under-fuselage pylon.</p>
            `,
            url: "https://idrw.org",
            image: "https://images.unsplash.com/photo-1457364559154-aa2644600ebb?w=800&h=500&fit=crop",
            source: "IDRW",
            publishedAt: new Date(now - 8 * 3600000).toISOString(),
            category: "defense"
        },
        {
            title: "Indian Navy Commissions INS Arighat — India's Second Nuclear Ballistic Missile Submarine",
            description: "India strengthens its nuclear triad with the commissioning of the second Arihant-class SSBN, carrying K-4 submarine-launched ballistic missiles.",
            fullContent: `
                <p>The Indian Navy has officially commissioned INS Arighat (S81), the country's second nuclear-powered ballistic missile submarine, at a ceremony at the Ship Building Centre in Visakhapatnam. The submarine significantly enhances India's second-strike nuclear capability and completes the credible sea-based deterrent.</p>
                
                <p>INS Arighat is an improved variant of the lead ship INS Arihant, featuring enhanced reactor systems, improved stealth characteristics, and the ability to carry the K-4 submarine-launched ballistic missile with a range of 3,500 kilometers. The submarine can carry up to four K-4 missiles or twelve K-15 Sagarika short-range ballistic missiles.</p>
                
                <p>"With INS Arighat, India's nuclear triad is fully operationalized," said Admiral R. Hari Kumar, Chief of Naval Staff. "We can now maintain continuous at-sea deterrence, ensuring that India's nuclear deterrent remains survivable under any scenario."</p>
                
                <p>The 6,000-ton submarine is powered by an 83 MW pressurized light-water reactor, giving it the ability to remain submerged for months at a time. The vessel features advanced sonar systems, an anechoic tile coating for reduced acoustic signature, and integrated combat management systems developed by DRDO.</p>
                
                <p>India is already constructing two more advanced SSBNs — the S4 and S4* — which are significantly larger at approximately 13,500 tons and capable of carrying the intercontinental-range K-6 missile with a 6,000 km range. These next-generation submarines are expected to commission by 2032.</p>
                
                <p>The commissioning was attended by Prime Minister Narendra Modi and National Security Advisor Ajit Doval. Pakistan and China both issued statements expressing concern over the submarine's capabilities, while the United States welcomed it as contributing to strategic stability in the Indo-Pacific.</p>
            `,
            url: "https://www.indiandefencereview.com",
            image: "https://images.unsplash.com/photo-1544890225-2f3faec4cd60?w=800&h=500&fit=crop",
            source: "Indian Defence Review",
            publishedAt: new Date(now - 14 * 3600000).toISOString(),
            category: "defense"
        },
        {
            title: "DRDO Demonstrates AI-Powered Autonomous Drone Swarm with 150 UAVs",
            description: "Defence Research and Development Organisation successfully tests India's largest autonomous drone swarm capable of coordinated reconnaissance, jamming, and strike missions.",
            fullContent: `
                <p>DRDO has conducted a landmark demonstration of an AI-powered autonomous drone swarm involving 150 unmanned aerial vehicles at the Pokhran test range in Rajasthan. The swarm successfully executed coordinated reconnaissance, electronic jamming, and simulated precision strike missions without any human intervention during the flight.</p>
                
                <p>The demonstration, part of Project AURA (Autonomous Unmanned Research Aircraft), showcased India's growing capabilities in swarm robotics and artificial intelligence for military applications. The drones communicated through an indigenous mesh networking system, allowing them to reassign targets and reform formations in real-time.</p>
                
                <p>"This is a force multiplier unlike anything we've had before," said the DRDO project director. "A single operator can now control 150 drones that can autonomously identify targets, coordinate attacks, and evade threats. This technology will revolutionize how India conducts asymmetric warfare."</p>
                
                <p>The swarm included three types of drones: small quadcopters for close-range reconnaissance, fixed-wing UAVs carrying electronic warfare payloads, and loitering munitions capable of precision strikes. The AI algorithm was trained using deep reinforcement learning and can operate in GPS-denied environments using visual SLAM technology.</p>
                
                <p>The Indian Army's Northern Command has expressed strong interest in deploying the swarm technology along the Line of Actual Control for persistent surveillance. The Indian Navy is also evaluating a maritime variant for anti-submarine warfare and fleet defense.</p>
                
                <p>Industry partners include Bharat Electronics Limited (BEL), IIT Kanpur, and several Indian startups specializing in AI and robotics. The system is expected to be operationally deployed by 2027, initially with special forces units.</p>
            `,
            url: "https://www.ndtv.com/india-news",
            image: "https://images.unsplash.com/photo-1508444845599-5c89863b1c44?w=800&h=500&fit=crop",
            source: "NDTV Defence",
            publishedAt: new Date(now - 20 * 3600000).toISOString(),
            category: "defense"
        },
        {
            title: "India and France to Co-Develop 6th Generation Fighter Jet and Advanced Engine",
            description: "Historic defence pact signed between India's DRDO/HAL and France's Dassault/Safran for joint development of a next-generation stealth omnirole combat aircraft.",
            fullContent: `
                <p>India and France have signed a landmark defence cooperation agreement for the joint development of a 6th-generation fighter jet, making it the most ambitious bilateral military technology partnership in Indian history. The agreement was signed during French President's state visit to New Delhi.</p>
                
                <p>The Advanced Medium Combat Aircraft (AMCA) Phase 2 program, now dubbed "Team Tempête-Vajra," will combine DRDO's stealth airframe design expertise with Dassault Aviation's combat systems integration and Safran's advanced engine technology. The joint venture will develop both the airframe and a 125 kN class next-generation engine.</p>
                
                <p>"This partnership places India at the cutting edge of military aviation," said Defence Minister Rajnath Singh. "We are not just buying technology — we are co-creating the future of air combat with one of the world's most advanced aerospace nations."</p>
                
                <p>The 6th-generation concept incorporates artificial intelligence-driven combat management, optional manned/unmanned operation capability, directed energy weapons integration, advanced sensor fusion with 360-degree situational awareness, and supercruise capability. The aircraft is designed to operate with loyal wingman drones.</p>
                
                <p>Safran will work with GTRE (Gas Turbine Research Establishment) in Bengaluru to develop the next-gen engine, building on India's Kaveri engine program. The engine will feature variable cycle technology, allowing it to optimize performance across different flight regimes — from subsonic cruise to supersonic dash.</p>
                
                <p>The prototype is targeted for first flight by 2035, with initial operational capability expected by 2040. Total program investment is estimated at €25 billion ($28 billion) shared between both nations. The aircraft will be manufactured in India with HAL as the prime contractor, generating over 50,000 high-tech jobs.</p>
                
                <p>The partnership also includes technology transfer for advanced composite materials, gallium nitride (GaN) based AESA radar, and cyber-hardened flight control systems. Indian aerospace startups will be integrated into the supply chain through a dedicated innovation ecosystem.</p>
            `,
            url: "https://www.thehindu.com",
            image: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&h=500&fit=crop",
            source: "The Hindu",
            publishedAt: new Date(now - 30 * 3600000).toISOString(),
            category: "defense"
        }
    ];
}

// ============================================
// LIVE GLOBAL CONFLICTS SECTION
// ============================================
let currentConflictType = 'all';

const conflictsData = [
    {
        name: "Russia-Ukraine War",
        type: "war",
        status: "Active War",
        statusClass: "active-war",
        region: "Eastern Europe",
        regionIcon: "🇪🇺",
        startYear: 2022,
        parties: ["Russia", "Ukraine", "NATO (support)"],
        casualties: "500,000+ (est.)",
        intensity: "high",
        description: "Full-scale invasion launched by Russia in February 2022. Ukraine reclaimed 460 sq km of territory since the start of 2026, capturing more territory in February 2026 than Russia. Russia is losing approximately 35,000 troops per month. The war involves extensive trench warfare, FPV drone warfare, and long-range missile strikes on civilian infrastructure.",
        image: "Conflicts_section/Russia_ukraine_news.png",
        coords: [48.3, 35.0],
        news: [
            { title: "Ukraine reclaims 460 sq km of territory since January 2026", date: "Mar 3, 2026", source: "Kyiv Independent" },
            { title: "Russia losing 35,000 troops per month — Zelenskyy", date: "Mar 3, 2026", source: "United24 Media" },
            { title: "Ukrainian counterattacks destroy 419 pieces of Russian equipment since Jan 29", date: "Mar 2, 2026", source: "Ukrainian General Staff" }
        ]
    },
    {
        name: "Israel-Iran / Gaza War",
        type: "war",
        status: "Active War",
        statusClass: "active-war",
        region: "Middle East",
        regionIcon: "🌍",
        startYear: 2023,
        parties: ["Israel (IDF)", "Hamas", "Hezbollah", "Iran (IRGC)", "US Forces", "Iraqi Militias"],
        casualties: "45,000+ Palestinian, 1,200+ Israeli, 12 killed (Iran strikes), 31+ in Lebanon",
        intensity: "high",
        description: "What began with the October 7, 2023 Hamas attack has escalated into a full-scale multi-front regional war. Israel's October 2025 ceasefire with Hamas is fragile as a renewed Israeli offensive in Gaza is planned for March 2026. Hezbollah began launching strikes against Israel on March 2, 2026 in retaliation for the killing of Iran's Supreme Leader and 'repeated Israeli aggressions,' firing missiles and drones into northern Israel. Israel has responded with airstrikes in Beirut and southern Lebanon. Lebanon condemned Hezbollah's actions and demanded it hand over weapons.",
        image: "Conflicts_section/Israel_iran_news.png",
        coords: [31.4, 34.4],
        news: [
            { title: "Hezbollah launches strikes on Israel in retaliation for killing of Iranian Supreme Leader", date: "Mar 2, 2026", source: "Breaking Defense" },
            { title: "Lebanon condemns Hezbollah, demands it hand over weapons", date: "Mar 2, 2026", source: "L'Orient Le Jour" },
            { title: "Israel plans renewed Gaza offensive for March 2026", date: "Mar 1, 2026", source: "Middle East Eye" },
            { title: "Israel closes Gaza crossings, raising humanitarian fears", date: "Mar 1, 2026", source: "Al Jazeera" }
        ]
    },
    {
        name: "US-Israel vs Iran — Operation Roaring Lion",
        type: "war",
        status: "Active War",
        statusClass: "active-war",
        region: "Middle East / Iran",
        regionIcon: "🌍",
        startYear: 2026,
        parties: ["Israel (IDF / Mossad)", "United States", "Iran (IRGC)", "Iran Air Defense", "Houthi Forces", "Iraqi Militias"],
        casualties: "787+ Iranian killed, 12+ Israeli killed, 6 US service members killed, 31+ in Lebanon, Gulf state casualties",
        intensity: "high",
        description: "Israel ('Operation Roaring Lion') and the US ('Operation Epic Fury') launched coordinated strikes against Iran on February 28, 2026, targeting leadership, nuclear sites, and military infrastructure. Supreme Leader Ali Khamenei was assassinated in the initial strikes. IAEA confirmed damage to Natanz underground enrichment plant. On March 3, Israel struck Iran's presidential office and National Security Council building in Tehran. Iran retaliated with ballistic missile and drone barrages against Israel, US bases in Qatar/Kuwait/Bahrain/Jordan/Iraq, and the UAE. The US Embassy in Saudi Arabia was hit by two drones. A friendly fire incident saw Kuwait shoot down 3 US F-15s. Qatar halted LNG production. Trump indicated the war could last 4-5 weeks; ground troops not ruled out.",
        image: "Conflicts_section/US_iran_news.png",
        coords: [35.7, 51.4],
        news: [
            { title: "Israel strikes Iran's presidential office and NSC building in Tehran", date: "Mar 3, 2026", source: "The Hindu" },
            { title: "IAEA confirms damage to Natanz underground enrichment facility", date: "Mar 3, 2026", source: "Times of Israel" },
            { title: "787+ killed in US-Israeli strikes across 131 Iranian cities", date: "Mar 3, 2026", source: "Iranian Red Crescent" },
            { title: "US establishes air superiority over Iran — Joint Chiefs Chairman", date: "Mar 2, 2026", source: "CBS News" },
            { title: "Iran retaliates with ballistic missiles against Israel and US bases in Gulf", date: "Mar 2, 2026", source: "Al Jazeera" },
            { title: "US Embassy in Saudi Arabia hit by two drones", date: "Mar 3, 2026", source: "Understanding War" },
            { title: "Kuwait friendly fire: 3 US F-15 jets shot down, 2 Kuwaiti sailors killed", date: "Mar 2, 2026", source: "Wikipedia" },
            { title: "Trump: War could last 4-5 weeks, ground troops not ruled out", date: "Mar 3, 2026", source: "OPB / LA Times" }
        ]
    },
    {
        name: "Sudan Civil War",
        type: "civil-war",
        status: "Civil War",
        statusClass: "civil-war",
        region: "East Africa",
        regionIcon: "🌍",
        startYear: 2023,
        parties: ["Sudan Armed Forces (SAF)", "Rapid Support Forces (RSF)", "Ethiopia (alleged)"],
        casualties: "30,000+ killed, 11M+ displaced",
        intensity: "high",
        description: "The civil war enters its third year with intensified fighting and drone attacks in Kordofan and Blue Nile States. Sudan accused Ethiopia of conducting drone attacks 'from inside Ethiopian territory.' Over 11 million displaced — the world's largest displacement crisis. 30 million require humanitarian assistance. Mediation efforts have failed.",
        image: "Conflicts_section/Sudan_civil_war_news.png",
        coords: [15.5, 32.5],
        news: [
            { title: "Sudan accuses Ethiopia of conducting drone attacks from its territory", date: "Mar 3, 2026", source: "Al Arabiya" },
            { title: "Medical facility in El Obeid hit by drone strike, 12 injured", date: "Mar 1, 2026", source: "UN OCHA" },
            { title: "World's largest hunger crisis feared as 30M need aid", date: "Feb 2026", source: "CFR" }
        ]
    },
    {
        name: "Myanmar Civil War",
        type: "civil-war",
        status: "Civil War",
        statusClass: "civil-war",
        region: "Southeast Asia",
        regionIcon: "🌏",
        startYear: 2021,
        parties: ["Myanmar Military (Tatmadaw)", "People's Defence Forces", "Ethnic Armed Orgs", "Arakan Army"],
        casualties: "75,000+ killed, 3M+ displaced",
        intensity: "high",
        description: "Myanmar military government controls only 21% of the country while rebel forces hold 42%. Over 3 million displaced and 75,000+ deaths. Junta held sham elections in Dec 2025-Jan 2026. Military granted amnesty to thousands of prisoners on March 2. Arakan Army controls most of Rakhine State. 16 million projected to need humanitarian assistance in 2026.",
        image: "Conflicts_section/Myanmar_civil_war_news.png",
        coords: [19.8, 96.5],
        news: [
            { title: "Military junta controls only 21% of Myanmar — CFR report", date: "Mar 2026", source: "Council on Foreign Relations" },
            { title: "Junta grants amnesty to thousands of prisoners", date: "Mar 2, 2026", source: "Washington Post" },
            { title: "30,000+ arrested since coup, 2,200+ deaths in custody", date: "Feb 2026", source: "Human Rights Watch" }
        ]
    },
    {
        name: "Yemen Civil War / Houthi Red Sea Attacks",
        type: "war",
        status: "Active War",
        statusClass: "active-war",
        region: "Middle East / Red Sea",
        regionIcon: "🌍",
        startYear: 2014,
        parties: ["Houthi Forces", "Saudi-led Coalition", "US Navy", "UK Navy"],
        casualties: "150,000+ killed, 230,000+ (famine)",
        intensity: "high",
        description: "The Yemeni conflict ongoing since 2014. Houthis remain a substantive military force but have notably not yet resumed attacks on Red Sea shipping in direct response to the February-March 2026 US-Iran escalation. US and UK continue military strikes against Houthi positions. The humanitarian crisis remains severe with 230,000+ famine deaths.",
        image: "Conflicts_section/Houthi_news.png",
        coords: [15.3, 44.2],
        news: [
            { title: "Houthis have not resumed Red Sea attacks despite US-Iran war escalation", date: "Mar 3, 2026", source: "UK Parliament" },
            { title: "US Navy intercepts multiple Houthi anti-ship missiles", date: "Feb 2026", source: "USNI News" },
            { title: "Yemen humanitarian crisis deepens with 230,000+ famine deaths", date: "Feb 2026", source: "ACLED" }
        ]
    },
    {
        name: "Syrian Civil War",
        type: "civil-war",
        status: "Civil War",
        statusClass: "civil-war",
        region: "Middle East",
        regionIcon: "🌍",
        startYear: 2011,
        parties: ["Syrian Government", "HTS / Opposition", "SDF / Kurds", "Turkey", "Russia", "Iran"],
        casualties: "500,000+ killed",
        intensity: "medium",
        description: "The Syrian conflict continues with new territorial shifts. Multiple foreign powers remain involved including Russia, Turkey, Iran, and the US. The situation has grown more complex with the US-Iran conflict potentially affecting Iranian positions in Syria.",
        image: "Conflicts_section/Syrian_civil_war_news.png",
        coords: [35.0, 38.5],
        news: [
            { title: "Syrian conflict complicated by US-Iran strikes affecting Iranian positions", date: "Mar 2026", source: "Al Monitor" },
            { title: "Turkish operations continue against Kurdish forces in northern Syria", date: "Feb 2026", source: "Defense News" }
        ]
    },
    {
        name: "Ethiopia - Ongoing Instability",
        type: "insurgency",
        status: "Insurgency",
        statusClass: "insurgency",
        region: "East Africa",
        regionIcon: "🌍",
        startYear: 2020,
        parties: ["Ethiopian Government", "TPLF", "Fano Militia", "OLA"],
        casualties: "600,000+ (Tigray war est.)",
        intensity: "medium",
        description: "Despite the 2022 Tigray ceasefire, Ethiopia faces continued instability from Fano militia insurgency in Amhara region and Oromo Liberation Army operations. Sudan has accused Ethiopia of conducting cross-border drone strikes, adding a new dimension to regional tensions.",
        image: "Conflicts_section/Ethiopia_news.png",
        coords: [9.1, 40.5],
        news: [
            { title: "Sudan accuses Ethiopia of cross-border drone attacks", date: "Mar 3, 2026", source: "Al Arabiya" },
            { title: "Fano militia insurgency continues in Amhara region", date: "Feb 2026", source: "ACLED" }
        ]
    },
    {
        name: "Sahel Region Insurgency",
        type: "insurgency",
        status: "Insurgency",
        statusClass: "insurgency",
        region: "West Africa",
        regionIcon: "🌍",
        startYear: 2012,
        parties: ["Mali / Burkina Faso / Niger Juntas", "JNIM (al-Qaeda)", "ISIS Sahel", "Wagner Group / Africa Corps"],
        casualties: "Tens of thousands",
        intensity: "high",
        description: "Jihadist insurgencies continue to destabilize the Sahel. Military juntas in Mali, Burkina Faso, and Niger have expelled French and UN forces, instead relying on Russia's Africa Corps (formerly Wagner) mercenaries. Violence against civilians continues to rise.",
        image: "Conflicts_section/Sahel_insurgency_news.png",
        coords: [14.0, -1.5],
        news: [
            { title: "Russia's Africa Corps expands operations across Sahel states", date: "Feb 2026", source: "Breaking Defense" },
            { title: "Civilian casualties rise sharply in Burkina Faso amid junta operations", date: "Feb 2026", source: "HRW" }
        ]
    },
    {
        name: "DR Congo - M23 Conflict",
        type: "civil-war",
        status: "Civil War",
        statusClass: "civil-war",
        region: "Central Africa",
        regionIcon: "🌍",
        startYear: 2022,
        parties: ["DRC Armed Forces", "M23 Rebels", "Rwanda (alleged)", "MONUSCO"],
        casualties: "7M+ displaced",
        intensity: "medium",
        description: "The M23 rebel group, allegedly backed by Rwanda, has captured significant territory in eastern Congo including the city of Goma. The conflict has created one of the world's worst humanitarian crises with millions displaced.",
        image: "Conflicts_section/dr_m23_news.png",
        coords: [-1.7, 29.2],
        news: [
            { title: "M23 rebels continue advance in eastern DR Congo", date: "Feb 2026", source: "Reuters" },
            { title: "International calls mount for Rwanda to halt support for M23", date: "Feb 2026", source: "UN News" }
        ]
    },
    {
        name: "Somalia - Al-Shabaab Insurgency",
        type: "insurgency",
        status: "Insurgency",
        statusClass: "insurgency",
        region: "East Africa",
        regionIcon: "🌍",
        startYear: 2006,
        parties: ["Somali Government", "African Union (ATMIS)", "US Forces", "Al-Shabaab"],
        casualties: "Ongoing",
        intensity: "medium",
        description: "Al-Shabaab controls significant rural territory in southern Somalia and conducts regular attacks including complex assaults on hotels and military bases. The US conducts frequent drone strikes against the group.",
        image: "Conflicts_section/Somalia_news.png",
        coords: [2.0, 45.3],
        news: [
            { title: "Somali forces launch new offensive against Al-Shabaab strongholds", date: "Feb 2026", source: "Stars and Stripes" },
            { title: "US drone strikes target Al-Shabaab leadership in southern Somalia", date: "Feb 2026", source: "AFRICOM" }
        ]
    },
    {
        name: "Afghanistan - Taliban vs ISIS-K",
        type: "insurgency",
        status: "Insurgency",
        statusClass: "insurgency",
        region: "South Asia",
        regionIcon: "🌏",
        startYear: 2021,
        parties: ["Taliban Government", "ISIS-Khorasan", "NRF (resistance)"],
        casualties: "Ongoing attacks",
        intensity: "medium",
        description: "Since the Taliban takeover in 2021, ISIS-K has conducted a campaign of bombings against the Taliban government, Shia minorities, and foreign targets. Cross-border tensions with Pakistan have escalated sharply.",
        image: "Conflicts_section/Afghanistan_news.png",
        coords: [33.9, 67.7],
        news: [
            { title: "ISIS-K attacks increase in Kabul and eastern provinces", date: "Feb 2026", source: "Janes" },
            { title: "Taliban-Pakistan tensions escalate over TTP safe havens", date: "Feb 2026", source: "Defense News" }
        ]
    },
    {
        name: "Haiti Gang Violence Crisis",
        type: "civil-war",
        status: "Civil War",
        statusClass: "civil-war",
        region: "Caribbean",
        regionIcon: "🌎",
        startYear: 2021,
        parties: ["Haitian Government", "Gang Coalitions (G9, G-Pep)", "Kenyan-led MSS Force"],
        casualties: "Thousands killed",
        intensity: "medium",
        description: "Haiti has descended into gang-controlled chaos with armed groups controlling 80% of Port-au-Prince. A Kenyan-led multinational security support mission is attempting to restore order amid widespread violence.",
        image: "Conflicts_section/Haiti_gang_news.png",
        coords: [18.9, -72.1],
        news: [
            { title: "Kenyan-led multinational force struggles to contain gang violence", date: "Feb 2026", source: "AP News" },
            { title: "Armed gangs control 80% of Port-au-Prince — UN report", date: "Feb 2026", source: "UN News" }
        ]
    },
    {
        name: "Libya Instability",
        type: "civil-war",
        status: "Civil War",
        statusClass: "civil-war",
        region: "North Africa",
        regionIcon: "🌍",
        startYear: 2014,
        parties: ["GNU (Tripoli)", "LNA - Haftar (East)", "Turkey", "Russia/Wagner"],
        casualties: "Ongoing",
        intensity: "low",
        description: "Libya remains divided between the internationally recognized government in Tripoli and General Haftar's Libyan National Army in the east. Foreign mercenaries from Russia and Turkey remain deployed in the country.",
        image: "Conflicts_section/Libya_news.png",
        coords: [26.3, 17.2],
        news: [
            { title: "Libya's rival governments continue power struggle despite mediation", date: "Feb 2026", source: "Libya Herald" },
            { title: "Russian Africa Corps maintains presence in eastern Libya", date: "Feb 2026", source: "Breaking Defense" }
        ]
    },
    {
        name: "Colombia Armed Groups",
        type: "insurgency",
        status: "Insurgency",
        statusClass: "insurgency",
        region: "South America",
        regionIcon: "🌎",
        startYear: 1964,
        parties: ["Colombian Government", "ELN", "FARC Dissidents", "Drug Cartels"],
        casualties: "Ongoing",
        intensity: "low",
        description: "Despite the 2016 FARC peace deal, Colombia faces ongoing violence from ELN guerrillas, FARC dissident groups, and drug trafficking organizations. The government continues 'Total Peace' negotiations with armed groups.",
        image: "Conflicts_section/Colombia_news.png",
        coords: [4.6, -74.1],
        news: [
            { title: "ELN ceasefire negotiations stall amid continued attacks", date: "Feb 2026", source: "Reuters" },
            { title: "FARC dissidents expand operations in southern Colombia", date: "Feb 2026", source: "InSight Crime" }
        ]
    },
    {
        name: "Nagorno-Karabakh Aftermath",
        type: "territorial",
        status: "Territorial",
        statusClass: "territorial",
        region: "South Caucasus",
        regionIcon: "🌍",
        startYear: 1988,
        parties: ["Azerbaijan", "Armenia", "Ethnic Armenians (displaced)"],
        casualties: "30,000+ (all wars)",
        intensity: "low",
        description: "Azerbaijan recaptured Nagorno-Karabakh in September 2023, causing the exodus of 100,000+ ethnic Armenians. Tensions remain high along the border with periodic Azerbaijan military provocations.",
        image: "Conflicts_section/Nagorno_Karabakh_news.png",
        coords: [39.8, 46.8],
        news: [
            { title: "Armenia-Azerbaijan border demarcation talks continue", date: "Feb 2026", source: "Eurasianet" },
            { title: "100,000+ displaced Armenians still unable to return to Karabakh", date: "Feb 2026", source: "UNHCR" }
        ]
    },
    {
        name: "South China Sea Tensions",
        type: "territorial",
        status: "Territorial",
        statusClass: "territorial",
        region: "Indo-Pacific",
        regionIcon: "🌏",
        startYear: 2012,
        parties: ["China (PLA Navy)", "Philippines", "Vietnam", "Taiwan", "US Navy"],
        casualties: "Naval confrontations",
        intensity: "medium",
        description: "China's militarization of artificial islands and aggressive coast guard/militia actions have led to frequent confrontations with Philippine vessels. The US regularly conducts freedom of navigation operations in disputed waters.",
        image: "Conflicts_section/South_china_sea_news.png",
        coords: [12.0, 114.5],
        news: [
            { title: "Chinese coast guard increases aggressive actions against Philippine vessels", date: "Feb 2026", source: "USNI News" },
            { title: "US Navy conducts freedom of navigation operations in South China Sea", date: "Feb 2026", source: "Naval News" }
        ]
    },
    {
        name: "Pakistan-Afghanistan Border Conflict",
        type: "war",
        status: "Active War",
        statusClass: "active-war",
        region: "South Asia",
        regionIcon: "🌏",
        startYear: 2023,
        parties: ["Pakistan Military", "Taliban Government", "TTP (Tehrik-i-Taliban Pakistan)", "BLA"],
        casualties: "Hundreds killed in cross-border strikes",
        intensity: "high",
        description: "Pakistan launched military operations and airstrikes inside Afghan territory targeting TTP militants sheltered by the Taliban. Cross-border tensions escalated sharply in 2024-2026 with Pakistan conducting Operation Azm-e-Istehkam and retaliatory strikes after deadly TTP attacks.",
        image: "Conflicts_section/Porkistan_afghanistan_news.png",
        coords: [33.0, 69.5],
        news: [
            { title: "Pakistan conducts fresh airstrikes on TTP camps inside Afghanistan", date: "Feb 2026", source: "Dawn" },
            { title: "Taliban condemns Pakistani cross-border operations as sovereignty violations", date: "Feb 2026", source: "Al Jazeera" }
        ]
    },
    {
        name: "Taiwan Strait Tensions",
        type: "territorial",
        status: "Territorial",
        statusClass: "territorial",
        region: "East Asia",
        regionIcon: "🌏",
        startYear: 2022,
        parties: ["China (PLA)", "Taiwan", "United States", "Japan"],
        casualties: "Military standoff",
        intensity: "medium",
        description: "China has intensified military drills around Taiwan, sending record numbers of fighter jets and naval vessels across the median line. The US continues arms sales to Taiwan and freedom of navigation operations through the strait.",
        image: "Conflicts_section/Taiwan_news.png",
        coords: [24.0, 121.0],
        news: [
            { title: "PLA conducts large-scale military exercises near Taiwan", date: "Feb 2026", source: "Defense News" },
            { title: "US approves new arms package for Taiwan amid China tensions", date: "Feb 2026", source: "Breaking Defense" }
        ]
    },
    {
        name: "India-China LAC Standoff",
        type: "territorial",
        status: "Territorial",
        statusClass: "territorial",
        region: "South Asia",
        regionIcon: "🌏",
        startYear: 2020,
        parties: ["India (Indian Army)", "China (PLA)"],
        casualties: "20+ killed (Galwan 2020)",
        intensity: "low",
        description: "India and China remain in a military standoff along the Line of Actual Control (LAC) in eastern Ladakh despite partial disengagement. Both sides continue to build up infrastructure and deploy troops along the disputed border.",
        image: "Conflicts_section/India_china_LAC_news.png",
        coords: [34.5, 78.0],
        news: [
            { title: "India-China border talks continue without full resolution", date: "Feb 2026", source: "IDRW" },
            { title: "India reinforces infrastructure along LAC in Ladakh", date: "Feb 2026", source: "Indian Defence News" }
        ]
    },
    {
        name: "Mozambique - Cabo Delgado Insurgency",
        type: "insurgency",
        status: "Insurgency",
        statusClass: "insurgency",
        region: "Southern Africa",
        regionIcon: "🌍",
        startYear: 2017,
        parties: ["Mozambique Military", "ISIS-Mozambique (ASWJ)", "SADC Forces", "Rwanda Defence Force"],
        casualties: "5,000+ killed, 1M displaced",
        intensity: "medium",
        description: "ISIS-linked militants continue an insurgency in Cabo Delgado province, threatening major natural gas projects. Rwandan and SADC forces are assisting the Mozambican military.",
        image: "Conflicts_section/Mozambique_news.png",
        coords: [-12.5, 40.5],
        news: [
            { title: "Rwandan forces assist Mozambique in Cabo Delgado operations", date: "Feb 2026", source: "Defense Web" },
            { title: "ISIS-Mozambique attacks threaten LNG gas projects", date: "Feb 2026", source: "Janes" }
        ]
    },
    {
        name: "Iraq - ISIS Remnants",
        type: "insurgency",
        status: "Insurgency",
        statusClass: "insurgency",
        region: "Middle East",
        regionIcon: "🌍",
        startYear: 2017,
        parties: ["Iraqi Security Forces", "Kurdish Peshmerga", "US-led Coalition", "ISIS Cells"],
        casualties: "Ongoing attacks",
        intensity: "low",
        description: "Despite the territorial defeat of ISIS in 2017, sleeper cells continue guerrilla attacks and ambushes in rural Iraq. Iraqi military conducts regular clearance operations. US-Iran tensions complicate the security situation.",
        image: "Conflicts_section/Iraq_news.png",
        coords: [34.5, 43.5],
        news: [
            { title: "Iraqi forces conduct clearance operations against ISIS cells", date: "Feb 2026", source: "Stars and Stripes" },
            { title: "US-Iran conflict complicates Iraq security situation", date: "Mar 2026", source: "Al Monitor" }
        ]
    },
    {
        name: "Nigeria - Boko Haram / Banditry",
        type: "insurgency",
        status: "Insurgency",
        statusClass: "insurgency",
        region: "West Africa",
        regionIcon: "🌍",
        startYear: 2009,
        parties: ["Nigerian Military", "ISWAP", "Boko Haram", "Armed Bandits"],
        casualties: "350,000+ (est. total)",
        intensity: "high",
        description: "Nigeria faces a dual security crisis: Boko Haram/ISWAP insurgency in the northeast and mass banditry with kidnappings in the northwest. The military is stretched across multiple fronts.",
        image: "Conflicts_section/Nigeria_news.png",
        coords: [11.8, 13.1],
        news: [
            { title: "Nigerian military launches new offensive against ISWAP in Lake Chad", date: "Feb 2026", source: "Premium Times" },
            { title: "Mass kidnapping in northwest Nigeria as banditry surges", date: "Feb 2026", source: "Reuters" }
        ]
    }
];

let conflictMap = null;
let conflictMarkers = [];

function initConflicts() {
    // Render initial conflicts
    renderConflicts('all');
    updateConflictsTimestamp();
    initConflictMap();

    // Set up category filter buttons
    document.querySelectorAll('.conflict-cat-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.conflict-cat-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentConflictType = this.dataset.conflictType;
            renderConflicts(currentConflictType);
            updateConflictMapMarkers(currentConflictType);
        });
    });
}

function initConflictMap() {
    const mapEl = document.getElementById('conflict-map');
    if (!mapEl || conflictMap) return;

    conflictMap = L.map('conflict-map', {
        center: [20, 30],
        zoom: 2,
        minZoom: 2,
        maxZoom: 8,
        zoomControl: true,
        scrollWheelZoom: true,
        worldCopyJump: true,
        maxBounds: [[-85, -180], [85, 180]],
        maxBoundsViscosity: 1.0
    });

    // Dark tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
        className: 'dark-tiles'
    }).addTo(conflictMap);

    // Add markers for all conflicts
    addConflictMarkers('all');

    // Fix map rendering issue when initially hidden
    setTimeout(() => { if (conflictMap) conflictMap.invalidateSize(); }, 500);
}

function getIntensityColor(intensity) {
    switch (intensity) {
        case 'high': return '#ef4444';
        case 'medium': return '#f97316';
        case 'low': return '#eab308';
        default: return '#6b7280';
    }
}

function addConflictMarkers(type) {
    // Clear existing markers
    conflictMarkers.forEach(m => conflictMap.removeLayer(m));
    conflictMarkers = [];

    let filtered = conflictsData;
    if (type !== 'all') {
        filtered = conflictsData.filter(c => c.type === type);
    }

    filtered.forEach((conflict, idx) => {
        if (!conflict.coords) return;
        const color = getIntensityColor(conflict.intensity);
        const radius = conflict.intensity === 'high' ? 12 : conflict.intensity === 'medium' ? 9 : 6;

        // Pulsing circle marker
        const marker = L.circleMarker(conflict.coords, {
            radius: radius,
            fillColor: color,
            color: color,
            weight: 2,
            opacity: 0.9,
            fillOpacity: 0.5,
            className: 'conflict-map-marker'
        }).addTo(conflictMap);

        // Outer pulsing ring
        const pulse = L.circleMarker(conflict.coords, {
            radius: radius + 6,
            fillColor: 'transparent',
            color: color,
            weight: 1.5,
            opacity: 0.3,
            fillOpacity: 0,
            className: 'conflict-pulse-ring'
        }).addTo(conflictMap);

        // Popup with conflict info
        const popupContent = `
            <div style="font-family:'Rajdhani',sans-serif;min-width:200px;">
                <strong style="font-size:1rem;color:#fff;">${conflict.name}</strong><br>
                <span style="color:${color};font-weight:700;font-size:0.8rem;text-transform:uppercase;">${conflict.status}</span><br>
                <span style="color:#9ca3af;font-size:0.8rem;">Since ${conflict.startYear} &bull; ${conflict.casualties}</span><br>
                <span style="color:#6b7280;font-size:0.75rem;margin-top:4px;display:block;">${conflict.parties.join(' vs ')}</span>
            </div>
        `;

        marker.bindPopup(popupContent, {
            className: 'conflict-popup',
            maxWidth: 280
        });

        // Permanent label showing conflict name
        marker.bindTooltip(conflict.name, {
            permanent: true,
            direction: 'right',
            offset: [12, 0],
            className: 'conflict-label'
        });

        marker.on('click', function () {
            const origIdx = conflictsData.indexOf(conflict);
            setTimeout(() => openConflictDetail(origIdx), 300);
        });

        conflictMarkers.push(marker);
        conflictMarkers.push(pulse);
    });
}

function updateConflictMapMarkers(type) {
    if (!conflictMap) return;
    addConflictMarkers(type);
}

function renderConflicts(type) {
    const grid = document.getElementById('conflicts-grid');
    if (!grid) return;

    let filtered = conflictsData;
    if (type !== 'all') {
        filtered = conflictsData.filter(c => c.type === type);
    }

    if (filtered.length === 0) {
        grid.innerHTML = `<div class="conflicts-loading"><p>No conflicts found for this category.</p></div>`;
        return;
    }

    grid.innerHTML = filtered.map((conflict, idx) => {
        const liveUpdate = conflict._latestUpdate ? `
            <div class="conflict-live-update">
                <span class="conflict-live-badge">📡 LIVE UPDATE</span>
                <p class="conflict-live-headline">${conflict._latestUpdate}</p>
                ${conflict._updateDate ? `<span class="conflict-live-time">${getTimeAgo(conflict._updateDate)}</span>` : ''}
            </div>
        ` : '';

        return `
        <div class="conflict-card" style="animation-delay: ${idx * 0.08}s" onclick="openConflictDetail(${conflictsData.indexOf(conflict)})">
            ${getFollowBtnHtml('conflict', String(conflictsData.indexOf(conflict)))}
            <img class="conflict-card-image" src="${conflict.image}" alt="${conflict.name}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1580227974546-fbd48825d991?w=600&h=300&fit=crop'">
            <div class="conflict-card-body">
                <div class="conflict-card-header">
                    <h3 class="conflict-card-title">${conflict.name}</h3>
                    <span class="conflict-status-badge ${conflict.statusClass}">${conflict.status}</span>
                </div>
                <div class="conflict-region">
                    <span>${conflict.regionIcon}</span>
                    <span>${conflict.region} • Since ${conflict.startYear}</span>
                </div>
                ${liveUpdate}
                <p class="conflict-description">${conflict.description}</p>
                <div class="conflict-parties">
                    ${conflict.parties.map(p => `<span class="conflict-party-tag">${p}</span>`).join('')}
                </div>
                <div class="conflict-meta">
                    <div class="conflict-meta-item">
                        <span class="conflict-meta-label">Casualties</span>
                        <span class="conflict-meta-value">${conflict.casualties}</span>
                    </div>
                    <div class="conflict-meta-item">
                        <span class="conflict-meta-label">Intensity</span>
                        <div class="conflict-intensity">
                            <div class="conflict-intensity-bar">
                                <div class="conflict-intensity-fill ${conflict.intensity}"></div>
                            </div>
                            <span class="conflict-intensity-text ${conflict.intensity}">${conflict.intensity}</span>
                        </div>
                    </div>
                    <div class="conflict-meta-item">
                        <span class="conflict-meta-label">Year</span>
                        <span class="conflict-meta-value">${conflict.startYear}</span>
                    </div>
                </div>
            </div>
        </div>
    `}).join('');
}

function getTimeAgo(dateStr) {
    try {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        return `${diffDays}d ago`;
    } catch (e) { return ''; }
}

function updateConflictsTimestamp() {
    const ts = document.getElementById('conflicts-timestamp');
    if (ts) {
        const now = new Date();
        ts.textContent = `Last updated: ${now.toLocaleString()}`;
    }
}

// Keyword mapping for precise conflict matching
const conflictKeywords = {
    "Russia-Ukraine War": ["ukraine", "kyiv", "zelensky", "kremlin", "donbas", "kherson", "zaporizhzhia", "bakhmut", "russian forces", "kursk", "odesa"],
    "Israel-Iran / Gaza War": ["gaza", "hamas", "hezbollah", "idf", "netanyahu", "west bank", "palestine", "israeli", "lebanon strike", "beirut"],
    "US-Israel vs Iran — Operation Roaring Lion": ["iran strike", "iran military", "irgc", "natanz", "tehran", "iran nuclear", "iran attack", "israel iran", "operation roaring lion", "epic fury", "khamenei", "iran war", "iran retaliation", "iran missiles", "iran drone"],
    "Sudan Civil War": ["sudan", "khartoum", "rsf", "darfur", "sudanese"],
    "Myanmar Civil War": ["myanmar", "burma", "tatmadaw", "rohingya", "junta", "arakan army"],
    "Yemen Civil War / Houthi Red Sea Attacks": ["yemen", "houthi", "red sea", "aden", "sanaa"],
    "Syrian Civil War": ["syria", "aleppo", "damascus", "idlib", "assad", "syrian"],
    "Ethiopia - Ongoing Instability": ["ethiopia", "tigray", "amhara", "addis ababa", "fano"],
    "Sahel Region Insurgency": ["sahel", "mali", "burkina faso", "niger", "jnim", "wagner africa", "africa corps"],
    "DR Congo - M23 Conflict": ["congo", "m23", "goma", "drc", "kivu"],
    "Somalia - Al-Shabaab Insurgency": ["somalia", "shabaab", "mogadishu", "somali"],
    "Afghanistan - Taliban vs ISIS-K": ["afghanistan", "taliban", "kabul", "isis-k", "afghan"],
    "Haiti Gang Violence Crisis": ["haiti", "port-au-prince", "haitian"],
    "Libya Instability": ["libya", "tripoli", "haftar", "libyan"],
    "Colombia Armed Groups": ["colombia", "eln", "farc", "colombian", "bogota"],
    "Nagorno-Karabakh Aftermath": ["karabakh", "armenia", "azerbaijan", "baku", "yerevan"],
    "South China Sea Tensions": ["south china sea", "spratly", "philippines navy", "china coast guard"],
    "Pakistan-Afghanistan Border Conflict": ["pakistan", "ttp", "tehrik-i-taliban", "waziristan", "balochistan", "pakistan airstrikes", "afghan border", "quetta", "peshawar"],
    "Taiwan Strait Tensions": ["taiwan", "taipei", "china military drill", "taiwan strait", "pla", "lai ching-te"],
    "India-China LAC Standoff": ["ladakh", "galwan", "line of actual control", "india china border", "arunachal", "lac standoff"],
    "Mozambique - Cabo Delgado Insurgency": ["mozambique", "cabo delgado", "palma", "mocimboa"],
    "Iraq - ISIS Remnants": ["iraq isis", "iraqi forces", "kirkuk attack", "diyala", "iraqi militia"],
    "Nigeria - Boko Haram / Banditry": ["boko haram", "iswap", "nigeria attack", "maiduguri", "zamfara", "nigerian military", "bandits nigeria"]
};

async function refreshConflicts() {
    const grid = document.getElementById('conflicts-grid');
    const refreshBtn = document.querySelector('#conflicts-section .refresh-btn');
    if (!grid) return;

    // Show loading state on button and grid
    if (refreshBtn) refreshBtn.classList.add('loading');
    grid.innerHTML = `<div class="conflicts-loading"><div class="loading-spinner"></div><p>Fetching live conflict intel hold on while we proivide them for you...</p></div>`;

    // Clear previous live updates (keep hardcoded news)
    conflictsData.forEach(c => {
        delete c._latestUpdate;
        delete c._updateDate;
        delete c._updateSource;
        delete c._liveHeadlines;
    });

    try {
        // Combined RSS feeds: global news + military-specific defense feeds
        const CONFLICT_RSS_FEEDS = [
            // Global/conflict news sources
            { url: 'https://news.un.org/feed/subscribe/en/news/topic/peace-and-security/feed/rss.xml', name: 'UN News' },
            { url: 'https://reliefweb.int/updates/rss.xml', name: 'ReliefWeb' },
            { url: 'https://www.aljazeera.com/xml/rss/all.xml', name: 'Al Jazeera' },
            { url: 'http://feeds.bbci.co.uk/news/world/rss.xml', name: 'BBC World' },
            { url: 'https://acleddata.com/feed/', name: 'ACLED' },
            // Defense-specific feeds (same as News section)
            { url: 'https://feeds.feedburner.com/defense-news/home', name: 'Defense News' },
            { url: 'https://breakingdefense.com/feed/', name: 'Breaking Defense' },
            { url: 'https://news.usni.org/feed', name: 'USNI News' },
            { url: 'https://www.navalnews.com/feed/', name: 'Naval News' },
            { url: 'https://www.stripes.com/feeds/military.rss', name: 'Stars and Stripes' },
            { url: 'https://www.livefistdefence.com/feed/', name: 'LiveFist Defence' },
            { url: 'https://idrw.org/feed/', name: 'IDRW' }
        ];

        const responses = await Promise.allSettled(
            CONFLICT_RSS_FEEDS.map(feed =>
                fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed.url)}`, { signal: AbortSignal.timeout(10000) })
                    .then(r => r.json())
                    .then(data => ({ ...data, _feedName: feed.name }))
                    .catch(() => null)
            )
        );

        let allArticles = [];

        responses.forEach(res => {
            if (res.status === 'fulfilled' && res.value && res.value.items) {
                res.value.items.forEach(item => {
                    allArticles.push({
                        title: item.title || '',
                        description: (item.description || '').replace(/<[^>]*>/g, '').substring(0, 300),
                        pubDate: item.pubDate || '',
                        link: item.link || '',
                        source: res.value._feedName || (res.value.feed ? res.value.feed.title : 'News')
                    });
                });
            }
        });

        console.log(`[Conflicts] Fetched ${allArticles.length} articles from ${CONFLICT_RSS_FEEDS.length} live sources`);

        // Match articles to known conflicts using keyword mapping
        conflictsData.forEach(conflict => {
            const keywords = conflictKeywords[conflict.name] || conflict.name.toLowerCase().split(/[\s\-\/]+/).filter(w => w.length > 3);
            const matchedArticles = [];

            allArticles.forEach(article => {
                const text = (article.title + ' ' + article.description).toLowerCase();
                const isMatch = keywords.some(kw => {
                    const cleanKw = kw.toLowerCase().trim();
                    if (!cleanKw) return false;
                    const escaped = cleanKw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    const regex = new RegExp(`\\b${escaped}\\b`, 'i');
                    return regex.test(text);
                });
                if (isMatch) {
                    matchedArticles.push(article);
                }
            });

            if (matchedArticles.length > 0) {
                // Sort by date, newest first
                matchedArticles.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
                conflict._latestUpdate = matchedArticles[0].title;
                conflict._updateDate = matchedArticles[0].pubDate;
                conflict._updateSource = matchedArticles[0].source;
                conflict._liveHeadlines = matchedArticles.slice(0, 5).map(a => ({
                    title: a.title,
                    date: a.pubDate,
                    source: a.source,
                    link: a.link
                }));
            }
        });

        // Count how many conflicts got updates
        const updatedCount = conflictsData.filter(c => c._latestUpdate).length;
        console.log(`[Conflicts] Updated ${updatedCount}/${conflictsData.length} conflicts with live data`);

        // Show toast notification
        showConflictToast(updatedCount, allArticles.length);

    } catch (e) {
        console.log('Error fetching live conflict updates:', e);
        showConflictToast(0, 0, true);
    }

    // Re-render with live data
    setTimeout(() => {
        renderConflicts(currentConflictType);
        updateConflictsTimestamp();
        updateConflictMapMarkers(currentConflictType);
        if (refreshBtn) refreshBtn.classList.remove('loading');
    }, 600);
}

function showConflictToast(updatedCount, totalArticles, isError = false) {
    // Remove existing toast
    const existing = document.querySelector('.conflict-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'conflict-toast';
    if (isError) {
        toast.innerHTML = `<span>⚠️ Failed to fetch live updates. Showing cached data.</span>`;
        toast.classList.add('error');
    } else {
        toast.innerHTML = `<span>📡 ${updatedCount} conflicts updated with live news from ${totalArticles} articles</span>`;
    }
    document.body.appendChild(toast);

    // Auto-remove after 4 seconds
    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 500);
    }, 4000);
}

function openConflictDetail(index) {
    const conflict = conflictsData[index];
    if (!conflict) return;

    // Create and show modal
    let modal = document.getElementById('conflict-detail-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'conflict-detail-modal';
        modal.className = 'modal conflict-modal';
        document.body.appendChild(modal);
    }

    const latestUpdate = conflict._latestUpdate
        ? `<div class="conflict-modal-meta-item"><strong>📰 Latest:</strong> ${conflict._latestUpdate}</div>`
        : '';

    // Combine hardcoded news + live headlines
    let allNews = [];
    if (conflict.news && conflict.news.length > 0) {
        allNews = conflict.news.map(n => ({ ...n, isLive: false }));
    }
    if (conflict._liveHeadlines && conflict._liveHeadlines.length > 0) {
        conflict._liveHeadlines.forEach(lh => {
            // Avoid duplicates
            const exists = allNews.some(n => n.title.toLowerCase() === lh.title.toLowerCase());
            if (!exists) {
                allNews.unshift({ title: lh.title, date: lh.date ? new Date(lh.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent', source: lh.source, link: lh.link, isLive: true });
            }
        });
    }

    const newsHtml = allNews.length > 0
        ? `<h4 class="conflict-modal-parties-title" style="margin-top:20px;">📰 Related News</h4>
           <div class="conflict-news-list">
               ${allNews.map(n => `
                   <div class="conflict-news-item">
                       <div class="conflict-news-title">${n.link ? `<a href="${n.link}" target="_blank" rel="noopener">${n.title}</a>` : n.title}</div>
                       <div class="conflict-news-meta">
                           <span class="conflict-news-date">${n.date}</span>
                           <span class="conflict-news-source">${n.source}</span>
                           ${n.isLive ? '<span class="conflict-news-live">LIVE</span>' : ''}
                       </div>
                   </div>
               `).join('')}
           </div>`
        : '';

    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeConflictModal()"></div>
        <div class="modal-content">
            <button class="modal-close" onclick="closeConflictModal()">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                </svg>
            </button>
            <img class="conflict-modal-image" src="${conflict.image}" alt="${conflict.name}" onerror="this.src='https://images.unsplash.com/photo-1580227974546-fbd48825d991?w=600&h=300&fit=crop'">
            <div class="conflict-modal-body">
                <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;flex-wrap:wrap;">
                    <h2 class="conflict-modal-title" style="margin-bottom:0">${conflict.name}</h2>
                    <span class="conflict-status-badge ${conflict.statusClass}">${conflict.status}</span>
                </div>
                <div class="conflict-modal-meta">
                    <div class="conflict-modal-meta-item"><strong>${conflict.regionIcon} Region:</strong> ${conflict.region}</div>
                    <div class="conflict-modal-meta-item"><strong>📅 Since:</strong> ${conflict.startYear}</div>
                    <div class="conflict-modal-meta-item"><strong>💀 Casualties:</strong> ${conflict.casualties}</div>
                    <div class="conflict-modal-meta-item">
                        <strong>⚡ Intensity:</strong>
                        <span class="conflict-intensity-text ${conflict.intensity}">${conflict.intensity.toUpperCase()}</span>
                    </div>
                    ${latestUpdate}
                </div>
                <p class="conflict-modal-description">${conflict.description}</p>
                <h4 class="conflict-modal-parties-title">Parties Involved</h4>
                <div class="conflict-modal-parties">
                    ${conflict.parties.map(p => `<span class="conflict-modal-party">${p}</span>`).join('')}
                </div>
                ${newsHtml}
            </div>
        </div>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeConflictModal() {
    const modal = document.getElementById('conflict-detail-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ============================================
// WORLD WAR HISTORY SECTION
// ============================================

const worldWarData = {
    ww1: {
        title: "World War I",
        subtitle: "The Great War",
        period: "July 28, 1914 – November 11, 1918",
        duration: "4 years, 3 months, 14 days",
        totalCasualties: "~40 million (20M dead, 21M wounded)",
        overview: "World War I was one of the deadliest conflicts in history, originating in Europe after the assassination of Archduke Franz Ferdinand of Austria. It pitted the Central Powers against the Allied Powers (Entente), involving over 70 million military personnel. The war saw the introduction of modern warfare technologies including machine guns, poison gas, tanks, and aircraft. It led to the collapse of four empires — Russian, Ottoman, Austro-Hungarian, and German — and reshaped the political map of Europe and the Middle East.",
        image: "History_section/worldwar_1.png",
        alliances: {
            side1: {
                name: "Central Powers",
                color: "#ef4444",
                icon: "⚔️",
                description: "Military alliance led by the German Empire, seeking to expand territorial control and challenge the existing European balance of power.",
                nations: [
                    { name: "German Empire", flag: "de", role: "Leading military & industrial power", casualties: "2,050,897 dead", strength: "13,250,000 mobilized" },
                    { name: "Austria-Hungary", flag: "at", role: "Triggered war after archduke's assassination", casualties: "1,200,000 dead", strength: "7,800,000 mobilized" },
                    { name: "Ottoman Empire", flag: "tr", role: "Controlled Middle Eastern fronts", casualties: "771,844 dead", strength: "2,998,000 mobilized" },
                    { name: "Bulgaria", flag: "bg", role: "Joined 1915, fought in Balkans", casualties: "87,500 dead", strength: "1,200,000 mobilized" }
                ]
            },
            side2: {
                name: "Allied Powers (Entente)",
                color: "#3b82f6",
                icon: "🛡️",
                description: "Coalition of nations united against the Central Powers, initially formed from the Triple Entente of France, Russia, and the United Kingdom.",
                nations: [
                    { name: "France", flag: "fr", role: "Western Front main combatant", casualties: "1,397,800 dead", strength: "8,410,000 mobilized" },
                    { name: "British Empire", flag: "gb", role: "Naval superiority, Western Front", casualties: "886,000 dead", strength: "8,841,000 mobilized" },
                    { name: "Russian Empire", flag: "ru", role: "Eastern Front, collapsed in 1917", casualties: "1,811,000 dead", strength: "12,000,000 mobilized" },
                    { name: "United States", flag: "us", role: "Entered 1917, decisive reinforcements", casualties: "116,516 dead", strength: "4,355,000 mobilized" },
                    { name: "Italy", flag: "it", role: "Switched sides, fought Austria-Hungary", casualties: "651,000 dead", strength: "5,615,000 mobilized" },
                    { name: "Japan", flag: "jp", role: "Seized German Pacific territories", casualties: "415 dead", strength: "800,000 mobilized" },
                    { name: "Serbia", flag: "rs", role: "Initial trigger, fought fiercely", casualties: "275,000 dead", strength: "707,000 mobilized" },
                    { name: "Belgium", flag: "be", role: "Invaded by Germany, fierce resistance", casualties: "44,000 dead", strength: "267,000 mobilized" }
                ]
            }
        },
        battles: [
            { name: "Battle of the Marne", date: "Sep 5–12, 1914", description: "French & British halted the German advance on Paris, establishing trench warfare on the Western Front.", casualties: "~500,000 total" },
            { name: "Battle of Verdun", date: "Feb 21 – Dec 18, 1916", description: "Longest single battle of WWI. Germany attempted to bleed France white in a war of attrition.", casualties: "~714,000 total" },
            { name: "Battle of the Somme", date: "Jul 1 – Nov 18, 1916", description: "British-led offensive to relieve pressure on Verdun. First use of tanks in warfare.", casualties: "~1,100,000 total" },
            { name: "Battle of Gallipoli", date: "Feb 19, 1915 – Jan 9, 1916", description: "Failed Allied campaign to secure a sea route to Russia through the Ottoman Empire.", casualties: "~473,000 total" },
            { name: "Battle of Tannenberg", date: "Aug 26–30, 1914", description: "Decisive German victory over Russia on the Eastern Front early in the war.", casualties: "~182,000 total" },
            { name: "Hundred Days Offensive", date: "Aug 8 – Nov 11, 1918", description: "Final Allied push that broke through German lines and led to the Armistice.", casualties: "~1,855,000 total" }
        ]
    },
    ww2: {
        title: "World War II",
        subtitle: "The Deadliest Conflict in Human History",
        period: "September 1, 1939 – September 2, 1945",
        duration: "6 years and 1 day",
        totalCasualties: "~70–85 million dead (including civilians)",
        overview: "World War II was the deadliest and most widespread conflict in human history, involving more than 100 million personnel from over 30 countries. The war pitted the Axis powers — led by Nazi Germany, Imperial Japan, and Fascist Italy — against the Allied powers. It saw unprecedented destruction, the Holocaust, the strategic bombing of cities, and the only use of nuclear weapons in warfare. The war fundamentally reshaped the global order, leading to the United Nations, the Cold War, decolonization, and the emergence of the United States and Soviet Union as superpowers.",
        image: "History_section/worldwar_2.png",
        alliances: {
            side1: {
                name: "Axis Powers",
                color: "#ef4444",
                icon: "⚔️",
                description: "Militarist alliance seeking territorial expansion and ideological dominance. United by fascist and ultra-nationalist ideologies, they launched wars of conquest across Europe, Africa, and Asia-Pacific.",
                nations: [
                    { name: "Nazi Germany", flag: "de", role: "Invaded Europe, led the Holocaust", casualties: "6,900,000–7,400,000 dead", strength: "18,200,000 mobilized" },
                    { name: "Imperial Japan", flag: "jp", role: "Conquered East Asia & Pacific", casualties: "2,500,000–3,100,000 dead", strength: "9,100,000 mobilized" },
                    { name: "Fascist Italy", flag: "it", role: "Mediterranean & North Africa campaigns", casualties: "457,000 dead", strength: "4,500,000 mobilized" },
                    { name: "Hungary", flag: "hu", role: "Eastern Front with Germany", casualties: "300,000 dead", strength: "1,000,000 mobilized" },
                    { name: "Romania", flag: "ro", role: "Switched to Allies in Aug 1944", casualties: "300,000 dead", strength: "1,225,000 mobilized" },
                    { name: "Finland", flag: "fi", role: "Fought USSR in Continuation War", casualties: "95,000 dead", strength: "530,000 mobilized" }
                ]
            },
            side2: {
                name: "Allied Powers",
                color: "#3b82f6",
                icon: "🛡️",
                description: "Grand alliance of nations fighting against Axis aggression. Despite vast ideological differences between Western democracies and the Soviet Union, they united to defeat fascism.",
                nations: [
                    { name: "Soviet Union", flag: "ru", role: "Eastern Front, bore heaviest losses", casualties: "24,000,000 dead (military+civilian)", strength: "34,476,700 mobilized" },
                    { name: "United States", flag: "us", role: "Arsenal of Democracy, Pacific & European theaters", casualties: "418,500 dead", strength: "16,112,566 mobilized" },
                    { name: "United Kingdom", flag: "gb", role: "Fought from start to end, Battle of Britain", casualties: "450,700 dead", strength: "5,896,000 mobilized" },
                    { name: "China", flag: "cn", role: "Fought Japan since 1937, massive civilian losses", casualties: "15,000,000–20,000,000 dead", strength: "14,000,000 mobilized" },
                    { name: "France", flag: "fr", role: "Fell 1940, Free French fought on", casualties: "567,600 dead", strength: "5,000,000 mobilized" },
                    { name: "Poland", flag: "pl", role: "First nation invaded, fought underground", casualties: "5,820,000 dead", strength: "1,000,000 mobilized" },
                    { name: "Canada", flag: "ca", role: "D-Day, Atlantic convoys, Italy campaign", casualties: "45,400 dead", strength: "1,100,000 mobilized" },
                    { name: "Australia", flag: "au", role: "Pacific theater, North Africa", casualties: "39,800 dead", strength: "993,000 mobilized" },
                    { name: "India (British)", flag: "in", role: "Largest volunteer army in history", casualties: "87,000 dead", strength: "2,500,000 mobilized" },
                    { name: "Yugoslavia", flag: "rs", role: "Fierce partisan resistance", casualties: "1,000,000 dead", strength: "800,000 mobilized" }
                ]
            }
        },
        battles: [
            { name: "Invasion of Poland", date: "Sep 1–Oct 6, 1939", description: "Germany's Blitzkrieg conquered Poland in 5 weeks, starting WWII. First use of combined arms warfare at scale.", casualties: "~200,000 total" },
            { name: "Battle of Stalingrad", date: "Aug 23, 1942 – Feb 2, 1943", description: "Turning point of the Eastern Front. The Soviet Union encircled and destroyed the German 6th Army.", casualties: "~1,950,000 total" },
            { name: "D-Day (Normandy)", date: "June 6, 1944", description: "Largest amphibious invasion in history. Allied forces stormed five beaches in Nazi-occupied France.", casualties: "~425,000 total (by end of Normandy campaign)" },
            { name: "Battle of Midway", date: "June 4–7, 1942", description: "Decisive naval battle that turned the tide in the Pacific. US sank four Japanese carriers.", casualties: "~3,500 total" },
            { name: "Battle of Britain", date: "Jul 10 – Oct 31, 1940", description: "First major campaign fought entirely by air forces. RAF defended Britain against the Luftwaffe.", casualties: "~44,000 total" },
            { name: "Battle of Kursk", date: "Jul 5 – Aug 23, 1943", description: "Largest tank battle in history. Soviet victory ended Germany's offensive capability on the Eastern Front.", casualties: "~860,000 total" },
            { name: "Battle of Berlin", date: "Apr 16 – May 2, 1945", description: "Final major offensive in the European theatre. Soviet forces captured Berlin, ending the war in Europe.", casualties: "~1,298,000 total" },
            { name: "Hiroshima & Nagasaki", date: "Aug 6 & 9, 1945", description: "The only wartime use of nuclear weapons. The bombings led to Japan's unconditional surrender.", casualties: "~129,000–226,000 dead" }
        ]
    }
};

function initHistory() {
    switchWar('ww1');
}

function switchWar(war) {
    const data = worldWarData[war];
    if (!data) return;

    // Update tab states
    document.querySelectorAll('.history-tab').forEach(t => t.classList.remove('active'));
    document.getElementById(`tab-${war}`).classList.add('active');

    const container = document.getElementById('history-content');
    container.style.opacity = '0';

    setTimeout(() => {
        container.innerHTML = renderWarContent(data, war);
        container.style.opacity = '1';
    }, 200);
}

function renderWarContent(data, warId) {
    return `
        <!-- War Overview -->
        <div class="war-overview">
            <div class="war-overview-image">
                <img src="${data.image}" alt="${data.title}" loading="lazy">
                <div class="war-overview-overlay">
                    <h3>${data.title}</h3>
                    <p>${data.subtitle}</p>
                </div>
            </div>
            <div class="war-overview-info">
                <div class="war-stats-grid">
                    <div class="war-stat-box">
                        <span class="war-stat-label">Period</span>
                        <span class="war-stat-value">${data.period}</span>
                    </div>
                    <div class="war-stat-box">
                        <span class="war-stat-label">Duration</span>
                        <span class="war-stat-value">${data.duration}</span>
                    </div>
                    <div class="war-stat-box war-stat-casualties">
                        <span class="war-stat-label">Total Casualties</span>
                        <span class="war-stat-value">${data.totalCasualties}</span>
                    </div>
                </div>
                <p class="war-overview-text">${data.overview}</p>
            </div>
        </div>

        <!-- Alliances -->
        <div class="war-alliances">
            <h3 class="war-section-title">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                Opposing Alliances
            </h3>
            <div class="alliances-grid">
                ${renderAlliance(data.alliances.side1)}
                <div class="alliance-vs">
                    <span>VS</span>
                </div>
                ${renderAlliance(data.alliances.side2)}
            </div>
        </div>

        <!-- Key Battles Timeline -->
        <div class="war-battles">
            <h3 class="war-section-title">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                Key Battles & Events
            </h3>
            <div class="battles-timeline">
                ${data.battles.map((b, i) => `
                    <div class="battle-item ${i % 2 === 0 ? 'battle-left' : 'battle-right'}">
                        <div class="battle-marker"></div>
                        <div class="battle-card">
                            <div class="battle-date">${b.date}</div>
                            <h4 class="battle-name">${b.name}</h4>
                            <p class="battle-desc">${b.description}</p>
                            <span class="battle-casualties">⚔️ ${b.casualties}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function renderAlliance(alliance) {
    return `
        <div class="alliance-panel" style="--alliance-color: ${alliance.color}">
            <div class="alliance-header">
                <span class="alliance-icon">${alliance.icon}</span>
                <h4 class="alliance-name">${alliance.name}</h4>
            </div>
            <p class="alliance-desc">${alliance.description}</p>
            <div class="alliance-nations">
                ${alliance.nations.map(n => `
                    <div class="alliance-nation-card">
                        <div class="alliance-nation-header">
                            <img src="https://flagcdn.com/w40/${n.flag}.png" alt="${n.name}" class="alliance-nation-flag">
                            <div>
                                <h5 class="alliance-nation-name">${n.name}</h5>
                                <p class="alliance-nation-role">${n.role}</p>
                            </div>
                        </div>
                        <div class="alliance-nation-stats">
                            <div class="alliance-nation-stat">
                                <span class="alliance-stat-label">Casualties</span>
                                <span class="alliance-stat-value" style="color: #ef4444">${n.casualties}</span>
                            </div>
                            <div class="alliance-nation-stat">
                                <span class="alliance-stat-label">Strength</span>
                                <span class="alliance-stat-value">${n.strength}</span>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// ============================================
// CONQUEST INTERACTIVE MAP
// ============================================

let conquestMap = null;
let conquestLayers = [];
let currentConquestWar = 'ww1';
let currentAllianceFilter = 'all';

const conquestData = {
    ww1: {
        center: [48.5, 15],
        zoom: 4,
        side1Name: "Central Powers",
        side2Name: "Entente Powers",
        side1Emoji: "🔴",
        side2Emoji: "🔵",
        // Colored territory zones per side
        controlZones: {
            side1: [
                {
                    name: "German Empire",
                    color: "#ef4444",
                    coords: [
                        [55.05, 8.40], [54.90, 9.80], [54.60, 10.20], [54.38, 11.40], [54.10, 12.10], [53.90, 14.10],
                        [53.55, 14.60], [52.85, 14.55], [52.35, 14.65], [51.90, 14.95], [51.30, 15.03],
                        [51.05, 14.85], [50.90, 14.30], [50.80, 13.60], [50.65, 12.30], [50.35, 12.10],
                        [50.20, 12.50], [49.50, 12.10], [49.00, 11.60], [48.80, 13.00], [48.60, 13.80],
                        [47.60, 13.00], [47.50, 12.20], [47.55, 10.90], [47.50, 10.20], [47.60, 9.50],
                        [47.55, 8.60], [47.70, 7.70], [48.0, 7.50], [48.95, 8.20], [49.10, 6.85],
                        [49.45, 6.35], [49.80, 6.40], [50.30, 6.00], [50.80, 6.00], [51.10, 5.95],
                        [51.45, 6.80], [51.85, 6.70], [51.95, 7.05], [52.50, 7.10], [53.10, 7.20],
                        [53.70, 7.00], [53.90, 8.60], [54.30, 8.60], [54.78, 8.90]
                    ],
                    description: "German Empire — the dominant Central Power, including Alsace-Lorraine; strongest military and industrial capacity in continental Europe"
                },
                {
                    name: "Austria-Hungary",
                    color: "#f97316",
                    coords: [
                        [50.65, 12.30], [50.80, 13.60], [50.90, 14.30], [51.05, 14.85], [51.30, 15.03],
                        [51.90, 14.95], [52.35, 14.65], [52.85, 14.55], [53.55, 14.60], [53.90, 14.10],
                        [53.80, 15.80], [52.00, 16.55], [51.10, 16.90], [50.60, 17.60], [50.40, 18.00],
                        [50.10, 18.80], [49.55, 19.20], [49.50, 20.10], [49.10, 20.50], [48.90, 21.40],
                        [48.60, 22.20], [48.10, 22.60], [47.80, 22.90], [47.70, 24.00], [47.90, 24.90],
                        [46.85, 24.50], [46.20, 24.40], [45.80, 22.80], [45.15, 21.60], [44.80, 21.50],
                        [44.50, 20.70], [44.80, 19.90], [44.80, 18.80], [45.00, 18.50], [45.10, 17.50],
                        [44.80, 16.80], [44.40, 16.20], [44.10, 15.50], [43.90, 15.20], [44.20, 14.50],
                        [45.00, 14.20], [45.50, 14.50], [45.80, 14.10], [46.20, 14.60], [46.55, 13.70],
                        [46.70, 13.00], [46.50, 11.50], [46.80, 11.00], [47.00, 10.50], [47.50, 10.20],
                        [47.55, 10.90], [47.50, 12.20], [47.60, 13.00], [48.60, 13.80], [48.80, 13.00],
                        [49.00, 11.60], [49.50, 12.10], [50.20, 12.50], [50.35, 12.10]
                    ],
                    description: "Austria-Hungary — multi-ethnic empire spanning from Bohemia to Transylvania, including Galicia, Croatia, and Bosnia-Herzegovina"
                },
                {
                    name: "Ottoman Empire",
                    color: "#dc2626",
                    coords: [
                        [42.10, 26.30], [41.65, 26.60], [41.20, 28.00], [41.00, 29.00], [41.50, 30.60],
                        [41.30, 32.60], [41.85, 34.10], [42.00, 36.00], [41.20, 36.50], [40.60, 37.00],
                        [39.90, 38.80], [39.20, 40.20], [39.70, 43.50], [40.50, 44.00], [40.30, 44.50],
                        [39.50, 44.40], [38.80, 44.30], [37.10, 44.00], [36.30, 42.30], [35.80, 41.00],
                        [35.30, 40.00], [34.60, 38.80], [33.80, 38.00], [33.50, 36.10], [33.00, 35.90],
                        [32.50, 35.60], [31.50, 35.50], [30.50, 34.80], [29.70, 34.90], [29.30, 34.80],
                        [29.00, 35.00], [28.50, 34.60], [28.20, 33.50], [27.50, 33.80], [26.00, 36.50],
                        [24.50, 38.30], [22.00, 39.10], [20.70, 39.80], [18.50, 41.50], [17.40, 43.20],
                        [15.50, 43.50], [13.50, 44.40], [12.50, 45.20], [13.00, 44.80],
                        [30.50, 48.00], [31.00, 47.50], [32.50, 47.20], [33.50, 44.50],
                        [36.30, 42.30], [36.80, 40.20], [36.80, 36.20], [36.45, 35.80], [36.80, 34.70],
                        [36.20, 33.50], [35.70, 32.00], [35.80, 28.00], [37.00, 27.30], [38.50, 26.50]
                    ],
                    description: "Ottoman Empire — controlled Anatolia, Mesopotamia (Iraq), the Levant (Syria/Palestine), and the Hejaz (western Arabia)"
                },
                {
                    name: "Occupied Belgium",
                    color: "#b91c1c",
                    coords: [
                        [51.50, 2.55], [51.45, 3.40], [51.35, 4.30], [51.25, 5.00], [51.10, 5.80],
                        [50.75, 5.95], [50.50, 6.20], [50.20, 5.80], [49.90, 5.80], [49.55, 5.50],
                        [49.50, 4.80], [49.60, 4.00], [49.90, 3.40], [50.10, 2.90], [50.40, 2.60],
                        [50.70, 2.50], [50.90, 2.55], [51.10, 2.50], [51.30, 2.55]
                    ],
                    description: "Belgium — invaded and occupied by Germany in August 1914 despite its declared neutrality; only a small strip around Ypres remained under Allied control"
                },
                {
                    name: "Occupied NE France",
                    color: "#b91c1c",
                    coords: [
                        [51.10, 2.50], [50.40, 2.60], [50.10, 2.90], [49.90, 3.40], [49.60, 4.00],
                        [49.50, 4.80], [49.55, 5.50], [49.90, 5.80], [49.50, 6.35], [49.10, 6.85],
                        [48.95, 8.20], [48.00, 7.50], [47.70, 7.70], [47.55, 7.30], [47.50, 7.00],
                        [48.10, 5.70], [48.45, 5.40], [48.50, 4.80], [48.30, 4.15], [48.70, 3.50],
                        [48.90, 3.10], [49.25, 2.90], [49.50, 2.60], [49.65, 2.30],
                        [49.90, 2.10], [50.10, 1.70], [50.45, 1.55], [50.95, 1.60]
                    ],
                    description: "Occupied northeastern France — approximately 10 departments under German military administration, including most of Nord, Pas-de-Calais, Ardennes, and Meuse"
                },
                {
                    name: "Ober Ost (Baltic Territories)",
                    color: "#ef4444",
                    coords: [
                        [53.90, 14.10], [54.10, 16.00], [54.40, 18.60], [54.70, 19.80], [55.40, 21.00],
                        [56.00, 21.00], [56.80, 21.10], [57.50, 21.70], [57.70, 24.00], [57.50, 25.30],
                        [57.00, 26.50], [56.50, 27.50], [55.70, 27.80], [55.00, 26.50], [54.50, 25.00],
                        [54.00, 24.00], [53.20, 23.80], [52.10, 23.50], [51.80, 23.20], [51.30, 23.00],
                        [50.80, 22.80], [50.40, 24.10], [49.50, 23.00], [49.10, 20.50], [49.50, 20.10],
                        [49.55, 19.20], [50.10, 18.80], [50.40, 18.00], [50.60, 17.60], [51.10, 16.90],
                        [52.00, 16.55], [53.80, 15.80]
                    ],
                    description: "Ober Ost — German-occupied Russian territories including Congress Poland, Lithuania, Courland; formalized by Treaty of Brest-Litovsk 1918"
                },
                {
                    name: "Occupied Romania",
                    color: "#ef4444",
                    coords: [
                        [47.90, 24.90], [47.70, 24.00], [47.80, 22.90], [48.10, 22.60],
                        [47.50, 22.30], [47.20, 21.80], [46.60, 21.60], [46.20, 21.10],
                        [45.80, 21.40], [45.15, 21.60], [44.80, 21.50], [44.40, 22.60],
                        [44.10, 22.80], [43.80, 22.90], [43.60, 23.40], [43.70, 25.00],
                        [43.80, 25.60], [44.00, 26.50], [44.20, 27.00], [44.70, 27.00],
                        [44.80, 27.50], [44.50, 28.60], [44.10, 28.70], [43.80, 28.60],
                        [44.20, 28.70], [45.00, 29.60], [45.40, 28.80], [46.20, 28.20],
                        [46.90, 27.80], [47.30, 26.60], [47.70, 25.50]
                    ],
                    description: "Occupied Romania — two-thirds of the kingdom including Bucharest fell to Central Powers by January 1917"
                },
                {
                    name: "Bulgaria",
                    color: "#a855f7",
                    coords: [
                        [44.10, 22.80], [43.60, 22.40], [43.00, 22.80], [42.70, 22.50],
                        [42.10, 22.90], [41.70, 23.50], [41.30, 24.00], [41.20, 25.20],
                        [41.30, 26.00], [42.10, 26.30], [42.00, 27.50], [42.70, 28.00],
                        [43.20, 28.00], [43.60, 28.60], [43.80, 28.60], [44.10, 28.70],
                        [44.50, 28.60], [44.80, 27.50], [44.70, 27.00], [44.20, 27.00],
                        [44.00, 26.50], [43.80, 25.60], [43.70, 25.00], [43.60, 23.40]
                    ],
                    description: "Kingdom of Bulgaria — Central Power ally that annexed Serbian Macedonia and parts of Greek Thrace"
                }
            ],
            side2: [
                {
                    name: "France (unoccupied)",
                    color: "#3b82f6",
                    coords: [
                        [50.95, 1.60], [50.45, 1.55], [50.10, 1.70], [49.90, 2.10], [49.65, 2.30],
                        [49.50, 2.60], [49.25, 2.90], [48.90, 3.10], [48.70, 3.50], [48.30, 4.15],
                        [48.50, 4.80], [48.45, 5.40], [48.10, 5.70], [47.50, 7.00], [47.55, 7.30],
                        [46.20, 6.10], [46.45, 5.90], [46.10, 5.40], [45.80, 5.90], [45.20, 5.70],
                        [44.10, 6.20], [43.80, 7.50], [43.50, 6.90], [43.10, 5.80], [43.30, 3.50],
                        [43.00, 3.00], [42.65, 3.00], [42.50, 2.00], [42.40, 0.70], [43.30, 0.30],
                        [43.40, -1.50], [43.70, -1.80], [44.40, -1.20], [45.20, -1.10], [46.20, -1.20],
                        [46.90, -1.80], [47.30, -2.50], [47.70, -3.00], [48.00, -4.70], [48.50, -4.80],
                        [48.40, -3.00], [48.70, -1.60], [48.80, -1.20], [49.20, -1.80], [49.70, -1.90],
                        [49.50, -0.10], [49.80, 0.20], [50.10, 1.20]
                    ],
                    description: "France — fought to reclaim occupied northern departments; vast majority of the country remained under French control"
                },
                {
                    name: "British Isles",
                    color: "#2563eb",
                    coords: [
                        [49.95, -5.30], [50.10, -4.50], [50.30, -3.50], [50.60, -2.50], [50.70, -1.80],
                        [50.75, -1.10], [50.80, -0.20], [50.90, 0.30], [51.10, 1.40], [51.50, 1.50],
                        [51.90, 1.20], [52.00, 1.60], [52.60, 1.70], [52.95, 0.30], [53.20, 0.10],
                        [53.70, -0.30], [54.10, -0.10], [54.50, -1.20], [55.00, -1.40], [55.40, -1.60],
                        [55.90, -2.00], [56.40, -2.80], [57.00, -2.00], [57.50, -1.80], [57.70, -3.30],
                        [58.60, -3.00], [58.80, -5.00], [57.80, -5.30], [57.40, -5.70], [56.50, -5.30],
                        [55.80, -5.50], [55.30, -5.80], [54.60, -5.00], [54.00, -4.80], [53.30, -4.70],
                        [52.70, -4.10], [51.60, -4.90], [51.20, -5.10], [50.40, -5.00]
                    ],
                    description: "British Empire — the world's largest empire; its naval dominance and industrial resources were crucial to the Entente war effort"
                },
                {
                    name: "Russian Empire",
                    color: "#6366f1",
                    coords: [
                        [57.50, 25.30], [57.70, 27.50], [58.00, 28.50], [57.80, 30.00],
                        [59.90, 29.80], [60.20, 30.30], [61.00, 31.00], [62.00, 33.50],
                        [64.50, 34.00], [66.00, 33.50], [68.00, 35.00], [68.90, 33.00],
                        [69.50, 30.50], [70.00, 32.00], [71.00, 40.00], [71.00, 55.00],
                        [68.00, 65.00], [65.00, 72.00], [60.00, 70.00], [55.00, 65.00],
                        [52.00, 60.00], [50.00, 55.00], [47.00, 50.00], [45.00, 46.00],
                        [43.50, 42.00], [42.50, 41.00], [43.00, 40.00], [44.00, 39.50],
                        [45.00, 37.50], [46.00, 35.00], [46.50, 33.50], [47.00, 30.50],
                        [47.50, 27.00], [47.90, 24.90], [47.70, 25.50], [46.90, 27.80],
                        [46.20, 28.20], [45.40, 28.80], [45.00, 29.60],
                        [50.40, 24.10], [50.80, 22.80], [51.30, 23.00], [51.80, 23.20],
                        [52.10, 23.50], [53.20, 23.80], [54.00, 24.00], [54.50, 25.00],
                        [55.00, 26.50], [55.70, 27.80], [56.50, 27.50], [57.00, 26.50]
                    ],
                    description: "Russian Empire — fought on the Eastern Front until the 1917 Revolution; suffered massive casualties before withdrawing from the war"
                },
                {
                    name: "Italy (from 1915)",
                    color: "#3b82f6",
                    coords: [
                        [46.50, 6.70], [46.80, 7.60], [46.70, 8.50], [46.50, 9.50], [46.60, 10.50],
                        [46.80, 11.00], [46.50, 11.50], [46.70, 13.00], [46.55, 13.70], [46.20, 14.60],
                        [45.80, 14.10], [45.50, 14.50], [45.00, 14.20], [44.20, 14.50], [43.90, 15.20],
                        [42.80, 15.90], [42.10, 16.10], [41.30, 16.00], [40.60, 17.80], [40.10, 18.50],
                        [39.90, 18.50], [39.50, 16.50], [38.70, 16.10], [38.00, 15.70], [37.50, 15.10],
                        [37.70, 12.80], [38.10, 12.70], [38.50, 13.00], [39.20, 13.90], [40.50, 14.90],
                        [41.00, 13.90], [41.80, 13.00], [42.50, 11.80], [43.30, 11.20], [43.60, 10.30],
                        [44.10, 9.70], [44.40, 8.90], [44.30, 8.30], [44.50, 7.50], [43.80, 7.50]
                    ],
                    description: "Kingdom of Italy — joined the Entente in 1915 under the Treaty of London; fought Austria-Hungary along the Isonzo River and in the Alps"
                },
                {
                    name: "Egypt (British)",
                    color: "#2563eb",
                    coords: [
                        [31.50, 25.00], [31.60, 27.00], [31.50, 29.50], [31.30, 32.00],
                        [30.50, 32.30], [29.80, 32.60], [29.00, 33.00], [27.50, 34.00],
                        [24.50, 35.50], [22.00, 36.80], [22.00, 31.00], [22.00, 25.00],
                        [25.00, 25.00], [29.00, 25.00]
                    ],
                    description: "British Egypt — strategic control of the Suez Canal; defended against Ottoman offensives in the Sinai"
                },
                {
                    name: "United States",
                    color: "#1d4ed8",
                    coords: [
                        [49.00, -67.00], [47.00, -69.00], [44.50, -67.00], [43.00, -70.00],
                        [41.00, -72.00], [39.00, -75.00], [36.00, -76.00], [32.00, -81.00],
                        [30.00, -84.00], [29.00, -89.00], [29.50, -94.50], [26.00, -97.50],
                        [32.00, -117.00], [34.00, -120.50], [37.00, -122.50], [40.50, -124.50],
                        [46.00, -124.00], [48.50, -124.50], [49.00, -88.00], [49.00, -82.00]
                    ],
                    description: "United States — entered the war in April 1917; over 2 million troops deployed to France by war's end, tipping the balance decisively"
                }
            ]
        },
        invasions: [
            { name: "German Invasion of Belgium & France", year: "1914", from: [52.52, 13.41], to: [50.85, 4.35], then: [48.86, 2.35], color: "#ef4444", side: "side1", description: "Germany executed the Schlieffen Plan, invading neutral Belgium to outflank French defenses, driving toward Paris before being halted at the Marne." },
            { name: "German Advance into Russia", year: "1914–1915", from: [52.52, 13.41], to: [52.23, 21.01], then: [54.68, 25.32], color: "#ef4444", side: "side1", description: "Germany and Austria-Hungary launched offensives into Russian Poland and the Baltic states." },
            { name: "Austrian Invasion of Serbia", year: "1914", from: [48.21, 16.37], to: [44.78, 20.45], color: "#f97316", side: "side1", description: "Austria-Hungary invaded Serbia after the assassination of Archduke Franz Ferdinand." },
            { name: "Ottoman Campaign in Gallipoli", year: "1915", from: [41.01, 28.98], to: [40.38, 26.42], color: "#dc2626", side: "side1", description: "Ottoman forces defended the Gallipoli peninsula against a major Allied amphibious assault." },
            { name: "Allied Gallipoli Landing", year: "1915", from: [35.17, 24.47], to: [40.38, 26.42], color: "#3b82f6", side: "side2", description: "British, ANZAC forces attempted to seize the Dardanelles to open a sea route to Russia." },
            { name: "Italian Front Opens", year: "1915", from: [41.90, 12.50], to: [46.07, 11.12], then: [46.05, 13.80], color: "#3b82f6", side: "side2", description: "Italy declared war on Austria-Hungary and opened a front along the Isonzo River." },
            { name: "British Mesopotamia Campaign", year: "1916–1918", from: [30.51, 47.81], to: [33.31, 44.37], color: "#3b82f6", side: "side2", description: "British forces captured Baghdad and Mosul from the Ottomans." },
            { name: "Allied Palestine Campaign", year: "1917–1918", from: [30.04, 31.24], to: [31.77, 35.23], then: [33.51, 36.29], color: "#3b82f6", side: "side2", description: "British and Arab forces captured Jerusalem and Damascus." }
        ],
        events: [
            { year: "1914", title: "War Begins", desc: "Austria-Hungary invades Serbia; Germany invades Belgium and France" },
            { year: "1914", title: "Battle of the Marne", desc: "Allied victory halts German advance, beginning trench warfare" },
            { year: "1915", title: "Gallipoli Campaign", desc: "Failed Allied attempt to capture the Dardanelles" },
            { year: "1915", title: "Italy Joins Entente", desc: "Italy enters the war against Austria-Hungary" },
            { year: "1916", title: "Verdun & Somme", desc: "Two of the bloodiest battles in history on the Western Front" },
            { year: "1917", title: "US Enters War", desc: "America declares war on Germany, tipping the balance" },
            { year: "1917", title: "Russian Revolution", desc: "Russia exits the war after Bolshevik revolution" },
            { year: "1918", title: "Armistice", desc: "Germany signs armistice on November 11; war ends" }
        ]
    },
    ww2: {
        center: [40, 20],
        zoom: 3,
        side1Name: "Axis Powers",
        side2Name: "Allied Powers",
        side1Emoji: "🔴",
        side2Emoji: "🔵",
        controlZones: {
            side1: [
                {
                    name: "Greater Germany (incl. Austria & Sudetenland)",
                    color: "#ef4444",
                    coords: [
                        [55.05, 8.40], [54.90, 9.80], [54.60, 10.20], [54.38, 11.40], [54.10, 12.10],
                        [53.90, 14.10], [53.55, 14.60], [52.85, 14.55], [52.35, 14.65], [51.90, 14.95],
                        [51.30, 15.03], [51.05, 14.85], [50.90, 14.30], [50.80, 13.60],
                        [50.65, 12.30], [50.35, 12.10], [50.20, 12.50], [49.50, 12.10],
                        [49.00, 11.60], [48.80, 13.00], [48.60, 13.80], [48.30, 14.50],
                        [48.70, 16.00], [48.10, 17.00], [47.70, 16.10], [47.00, 15.00],
                        [46.80, 13.80], [46.70, 13.00], [46.80, 11.00], [47.00, 10.50],
                        [47.50, 10.20], [47.60, 9.50], [47.30, 9.60], [47.50, 8.60],
                        [47.70, 7.70], [48.00, 7.50], [48.95, 8.20], [49.10, 6.85],
                        [49.45, 6.35], [49.80, 6.40], [50.30, 6.00], [50.80, 6.00], [51.10, 5.95],
                        [51.45, 6.80], [51.85, 6.70], [51.95, 7.05], [52.50, 7.10], [53.10, 7.20],
                        [53.70, 7.00], [53.90, 8.60], [54.30, 8.60], [54.78, 8.90]
                    ],
                    description: "Greater Germany — the Third Reich including annexed Austria (1938), Sudetenland (1938), Memelland, and Alsace-Lorraine"
                },
                {
                    name: "Occupied France",
                    color: "#b91c1c",
                    coords: [
                        [50.95, 1.60], [50.45, 1.55], [50.10, 1.70], [49.70, -1.90],
                        [49.20, -1.80], [48.80, -1.20], [48.70, -1.60], [48.40, -3.00],
                        [48.50, -4.80], [48.00, -4.70], [47.70, -3.00], [47.30, -2.50],
                        [46.90, -1.80], [46.20, -1.20], [45.20, -1.10], [44.40, -1.20],
                        [43.70, -1.80], [43.40, -1.50], [43.30, 0.30], [42.40, 0.70],
                        [42.50, 2.00], [42.65, 3.00], [43.00, 3.00], [43.30, 3.50],
                        [43.10, 5.80], [43.50, 6.90], [43.80, 7.50], [44.10, 6.20],
                        [45.20, 5.70], [45.80, 5.90], [46.10, 5.40], [46.45, 5.90],
                        [46.20, 6.10], [47.55, 7.30], [47.50, 7.00], [48.10, 5.70],
                        [48.45, 5.40], [48.50, 4.80], [48.30, 4.15], [48.70, 3.50],
                        [48.90, 3.10], [49.25, 2.90], [49.50, 2.60], [49.65, 2.30],
                        [49.90, 2.10], [50.10, 1.70]
                    ],
                    description: "Occupied France — conquered in 6 weeks via Blitzkrieg through the Ardennes (May-June 1940); northern zone under direct German military administration, southern Vichy zone occupied from November 1942"
                },
                {
                    name: "Occupied Benelux",
                    color: "#b91c1c",
                    coords: [
                        [53.50, 5.00], [53.20, 7.00], [52.50, 7.10], [51.95, 7.05],
                        [51.85, 6.70], [51.45, 6.80], [51.10, 5.95], [50.80, 6.00],
                        [50.30, 6.00], [49.80, 6.40], [49.60, 6.10], [49.50, 5.50],
                        [49.50, 4.80], [49.60, 4.00], [49.90, 3.40], [50.10, 2.90],
                        [50.40, 2.60], [50.70, 2.50], [50.90, 2.55], [51.10, 2.50],
                        [51.30, 2.55], [51.50, 2.55], [51.45, 3.40], [51.35, 4.30],
                        [51.60, 3.80], [51.90, 4.40], [52.10, 4.30], [52.40, 4.80],
                        [52.70, 5.00], [53.10, 5.10]
                    ],
                    description: "Occupied Belgium, Netherlands & Luxembourg — invaded May 1940; the Netherlands surrendered after the bombing of Rotterdam"
                },
                {
                    name: "Occupied Poland",
                    color: "#ef4444",
                    coords: [
                        [53.90, 14.10], [54.10, 16.00], [54.40, 18.60], [54.70, 19.80],
                        [54.35, 19.40], [54.80, 18.50], [54.60, 17.80],
                        [54.40, 18.60], [54.50, 19.50], [54.80, 20.50], [54.40, 22.70],
                        [53.50, 23.50], [52.10, 23.80], [51.30, 23.50], [50.80, 22.80],
                        [50.00, 22.10], [49.50, 22.50], [49.00, 22.00], [48.90, 21.40],
                        [49.10, 20.50], [49.50, 20.10], [49.55, 19.20], [50.10, 18.80],
                        [50.40, 18.00], [50.60, 17.60], [51.10, 16.90], [52.00, 16.55],
                        [53.80, 15.80]
                    ],
                    description: "Occupied Poland — partitioned between Germany and USSR (1939), then fully occupied after Barbarossa (1941); site of major extermination camps"
                },
                {
                    name: "Occupied Denmark",
                    color: "#b91c1c",
                    coords: [
                        [54.78, 8.90], [55.05, 8.40], [55.30, 8.10], [55.70, 8.10],
                        [56.00, 8.10], [56.60, 8.20], [57.00, 8.60], [57.50, 10.00],
                        [57.75, 10.60], [57.10, 10.30], [57.00, 9.80], [56.50, 10.50],
                        [56.10, 10.30], [55.70, 10.80], [55.30, 10.70], [55.00, 9.60],
                        [54.80, 9.90], [54.60, 10.20]
                    ],
                    description: "Occupied Denmark — invaded April 9, 1940 (Operation Weserübung); surrendered within hours"
                },
                {
                    name: "Occupied Norway",
                    color: "#ef4444",
                    coords: [
                        [57.95, 7.20], [58.10, 6.60], [58.80, 5.70], [59.00, 5.50],
                        [59.90, 5.10], [60.50, 5.00], [61.00, 4.70], [62.10, 5.30],
                        [62.70, 6.10], [63.40, 7.50], [64.00, 9.50], [64.90, 11.00],
                        [66.30, 12.80], [67.30, 14.40], [68.20, 14.70], [68.40, 16.00],
                        [69.20, 16.00], [69.50, 18.00], [70.00, 20.00], [70.10, 23.50],
                        [70.00, 25.50], [69.90, 27.00], [69.80, 29.00], [69.20, 29.00],
                        [69.50, 25.50], [69.50, 23.00], [68.80, 18.00], [68.30, 16.50],
                        [67.80, 15.50], [66.30, 14.00], [65.00, 13.00], [63.90, 11.50],
                        [63.10, 10.00], [62.10, 8.00], [61.40, 7.00], [60.70, 6.40],
                        [59.80, 6.50], [59.60, 7.00], [59.00, 7.50], [58.50, 8.00]
                    ],
                    description: "Occupied Norway — invaded April 9, 1940; strategic importance for iron ore supply from Sweden and Atlantic U-boat bases"
                },
                {
                    name: "Occupied Balkans (Yugoslavia & Greece)",
                    color: "#f97316",
                    coords: [
                        [46.55, 13.70], [46.20, 14.60], [45.80, 14.10], [45.50, 14.50],
                        [45.00, 14.20], [44.20, 14.50], [43.90, 15.20], [44.10, 15.50],
                        [44.40, 16.20], [44.80, 16.80], [45.10, 17.50], [45.00, 18.50],
                        [44.80, 18.80], [44.80, 19.90], [44.50, 20.70], [44.80, 21.50],
                        [45.15, 21.60], [45.80, 22.80], [46.20, 24.40], [46.05, 25.10],
                        [44.40, 26.00], [43.80, 25.50], [43.60, 23.40], [43.00, 22.80],
                        [42.70, 22.50], [42.10, 22.90], [41.70, 23.50], [41.30, 24.00],
                        [41.20, 25.20], [41.30, 26.00], [40.60, 26.00], [40.00, 26.00],
                        [39.60, 24.00], [38.80, 24.00], [38.30, 23.70], [37.90, 23.70],
                        [37.50, 22.50], [36.70, 22.50], [36.40, 22.20], [36.40, 23.60],
                        [37.00, 24.50], [38.00, 24.50], [39.50, 23.30],
                        [40.00, 22.50], [40.60, 22.00], [41.10, 21.00], [41.30, 20.60],
                        [41.80, 19.50], [42.50, 17.00], [43.50, 16.00], [44.10, 15.50]
                    ],
                    description: "Occupied Yugoslavia & Greece — conquered in April 1941; Yugoslavia was divided among Axis powers, Greece endured brutal occupation and famine"
                },
                {
                    name: "Fascist Italy",
                    color: "#f97316",
                    coords: [
                        [46.50, 6.70], [46.80, 7.60], [46.70, 8.50], [46.50, 9.50],
                        [46.60, 10.50], [46.80, 11.00], [46.50, 11.50], [46.70, 13.00],
                        [46.55, 13.70], [45.80, 14.10], [45.50, 14.50], [45.00, 14.20],
                        [44.20, 14.50], [43.90, 15.20], [42.80, 15.90], [42.10, 16.10],
                        [41.30, 16.00], [40.60, 17.80], [40.10, 18.50], [39.90, 18.50],
                        [39.50, 16.50], [38.70, 16.10], [38.00, 15.70], [37.50, 15.10],
                        [37.70, 12.80], [38.10, 12.70], [38.50, 13.00], [39.20, 13.90],
                        [40.50, 14.90], [41.00, 13.90], [41.80, 13.00], [42.50, 11.80],
                        [43.30, 11.20], [43.60, 10.30], [44.10, 9.70], [44.40, 8.90],
                        [44.30, 8.30], [44.50, 7.50], [43.80, 7.50]
                    ],
                    description: "Fascist Italy — Axis co-belligerent under Mussolini until September 1943 armistice; northern Italy then occupied by Germany as the RSI puppet state"
                },
                {
                    name: "Axis North Africa (Libya & W. Egypt)",
                    color: "#dc2626",
                    coords: [
                        [33.20, 11.60], [33.00, 12.00], [32.80, 13.20], [32.30, 15.00],
                        [32.10, 17.00], [31.80, 20.00], [31.40, 23.00], [31.20, 25.80],
                        [31.10, 27.50], [31.00, 29.20], [30.80, 30.00], [30.40, 30.50],
                        [30.00, 29.00], [29.80, 25.00], [30.10, 22.00], [30.30, 18.00],
                        [30.50, 15.00], [31.00, 13.00], [31.50, 12.00], [32.50, 11.00]
                    ],
                    description: "Libya to El Alamein — Italian colony turned Axis battleground; Rommel's Afrika Korps pushed within 100km of Alexandria before defeat at El Alamein (1942)"
                },
                {
                    name: "Occupied USSR (Baltics, Belarus, Ukraine)",
                    color: "#ef4444",
                    coords: [
                        [54.40, 22.70], [55.40, 21.00], [56.00, 21.00], [56.80, 21.10],
                        [57.50, 21.70], [57.70, 24.00], [57.50, 25.30], [59.00, 25.00],
                        [59.50, 28.00], [59.90, 29.80], [60.20, 31.00], [59.50, 33.00],
                        [58.50, 36.00], [57.50, 38.50], [56.50, 40.00], [55.50, 41.00],
                        [54.50, 43.00], [53.50, 44.00], [52.00, 44.50], [50.50, 44.00],
                        [49.00, 43.00], [48.50, 42.50], [47.50, 40.50], [47.00, 39.50],
                        [46.50, 38.00], [46.00, 36.50], [45.50, 35.00], [45.00, 34.00],
                        [44.50, 33.70], [44.00, 34.00], [44.60, 33.80], [45.00, 33.50],
                        [45.50, 32.50], [46.00, 31.00], [46.50, 29.50], [47.00, 28.00],
                        [47.50, 27.00], [47.90, 25.50], [48.10, 24.00], [49.00, 23.50],
                        [50.00, 22.10], [50.80, 22.80], [51.30, 23.50], [52.10, 23.80],
                        [53.50, 23.50]
                    ],
                    description: "Occupied Soviet territory — at peak (1942): Baltics, Belarus, Ukraine, western Russia reaching the outskirts of Moscow and Stalingrad; the deadliest theater with 80% of Wehrmacht casualties"
                },
                {
                    name: "Japanese Empire & Conquests",
                    color: "#dc2626",
                    coords: [
                        [50.00, 130.00], [48.00, 135.00], [45.00, 138.00], [43.00, 142.00],
                        [40.00, 142.00], [36.00, 140.50], [34.00, 136.00], [33.50, 131.00],
                        [35.00, 129.00], [38.00, 125.00], [40.00, 124.00], [42.00, 124.50],
                        [42.00, 127.00], [40.00, 127.50], [38.00, 126.00], [35.00, 126.50],
                        [34.00, 127.50], [33.00, 130.00], [30.00, 130.50], [28.00, 129.00],
                        [25.00, 125.00], [22.00, 121.00], [18.00, 120.50], [15.00, 119.00],
                        [10.00, 118.00], [7.00, 117.00], [5.00, 115.00], [2.00, 110.00],
                        [0.00, 105.00], [-2.00, 106.00], [-5.00, 110.00], [-8.00, 115.00],
                        [-8.00, 120.00], [-5.00, 128.00], [-2.00, 135.00], [0.00, 140.00],
                        [5.00, 145.00], [10.00, 148.00], [15.00, 147.00], [20.00, 145.00],
                        [30.00, 142.00], [35.00, 141.00]
                    ],
                    description: "Japanese Empire at peak (1942) — Japan, Korea, Manchuria, coastal China, French Indochina, Thailand, Burma, Malaya, Singapore, Philippines, Dutch East Indies, and Pacific islands to the Solomons"
                }
            ],
            side2: [
                {
                    name: "Soviet Union (Unoccupied Core)",
                    color: "#6366f1",
                    coords: [
                        [60.20, 31.00], [62.00, 33.50], [64.50, 34.00], [66.00, 33.50],
                        [68.00, 35.00], [68.90, 33.00], [69.50, 30.50], [70.00, 32.00],
                        [71.00, 40.00], [71.00, 55.00], [68.00, 65.00], [65.00, 72.00],
                        [60.00, 75.00], [55.00, 73.00], [52.00, 65.00], [50.00, 58.00],
                        [48.00, 55.00], [45.00, 52.00], [43.00, 48.00], [42.00, 45.50],
                        [42.00, 43.00], [43.50, 42.00], [42.50, 41.00], [43.00, 40.00],
                        [44.00, 39.50], [44.50, 33.70], [45.00, 34.00], [45.50, 35.00],
                        [46.00, 36.50], [46.50, 38.00], [47.00, 39.50], [47.50, 40.50],
                        [48.50, 42.50], [49.00, 43.00], [50.50, 44.00], [52.00, 44.50],
                        [53.50, 44.00], [54.50, 43.00], [55.50, 41.00], [56.50, 40.00],
                        [57.50, 38.50], [58.50, 36.00], [59.50, 33.00]
                    ],
                    description: "Soviet Union — unoccupied heartland beyond the German advance; bore 27 million dead, turned the tide at Stalingrad (Feb 1943) and Kursk (Jul 1943)"
                },
                {
                    name: "United Kingdom",
                    color: "#3b82f6",
                    coords: [
                        [49.95, -5.30], [50.10, -4.50], [50.30, -3.50], [50.60, -2.50],
                        [50.70, -1.80], [50.75, -1.10], [50.80, -0.20], [50.90, 0.30],
                        [51.10, 1.40], [51.50, 1.50], [51.90, 1.20], [52.00, 1.60],
                        [52.60, 1.70], [52.95, 0.30], [53.20, 0.10], [53.70, -0.30],
                        [54.10, -0.10], [54.50, -1.20], [55.00, -1.40], [55.40, -1.60],
                        [55.90, -2.00], [56.40, -2.80], [57.00, -2.00], [57.50, -1.80],
                        [57.70, -3.30], [58.60, -3.00], [58.80, -5.00], [57.80, -5.30],
                        [57.40, -5.70], [56.50, -5.30], [55.80, -5.50], [55.30, -5.80],
                        [54.60, -5.00], [54.00, -4.80], [53.30, -4.70], [52.70, -4.10],
                        [51.60, -4.90], [51.20, -5.10], [50.40, -5.00]
                    ],
                    description: "United Kingdom — never invaded; survived the Blitz, launched the strategic bombing campaign, and served as the staging ground for D-Day"
                },
                {
                    name: "United States",
                    color: "#1d4ed8",
                    coords: [
                        [49.00, -67.00], [47.00, -69.00], [44.50, -67.00], [43.00, -70.00],
                        [41.00, -72.00], [39.00, -75.00], [36.00, -76.00], [32.00, -81.00],
                        [30.00, -84.00], [29.00, -89.00], [29.50, -94.50], [26.00, -97.50],
                        [32.00, -117.00], [34.00, -120.50], [37.00, -122.50], [40.50, -124.50],
                        [46.00, -124.00], [48.50, -124.50], [49.00, -88.00], [49.00, -82.00]
                    ],
                    description: "United States — entered the war after Pearl Harbor (Dec 1941); became the Arsenal of Democracy with massive industrial and military mobilization"
                },
                {
                    name: "Allied North Africa (Morocco to Egypt)",
                    color: "#3b82f6",
                    coords: [
                        [35.80, -5.80], [35.90, -2.00], [36.40, 0.00], [36.80, 3.00],
                        [36.90, 5.00], [37.00, 7.50], [36.80, 8.50], [37.30, 9.80],
                        [36.50, 10.60], [34.00, 10.00], [33.00, 11.50], [32.50, 11.00],
                        [31.50, 12.00], [31.00, 13.00], [30.50, 15.00], [30.30, 18.00],
                        [30.10, 22.00], [29.80, 25.00], [30.00, 29.00], [30.40, 30.50],
                        [30.80, 30.00], [31.10, 31.50], [31.30, 32.00], [30.50, 32.30],
                        [29.80, 32.60], [29.00, 33.00], [27.50, 34.00], [24.50, 35.50],
                        [22.00, 36.80], [22.00, 25.00], [27.00, 15.00], [30.00, 10.00],
                        [32.00, 5.00], [33.00, 0.00], [34.00, -1.80], [35.20, -4.00]
                    ],
                    description: "Allied North Africa — Operation Torch landings (Nov 1942) in Morocco and Algeria; victory at El Alamein; complete Axis surrender in Tunisia (May 1943)"
                },
                {
                    name: "Liberation of Western Europe (1944-45)",
                    color: "#3b82f6",
                    coords: [
                        [49.70, -1.90], [49.50, -0.10], [49.80, 0.20], [50.10, 1.20],
                        [50.95, 1.60], [50.45, 1.55], [50.10, 1.70], [49.90, 2.10],
                        [49.65, 2.30], [49.50, 2.60], [49.25, 2.90], [48.90, 3.10],
                        [48.70, 3.50], [48.30, 4.15], [48.50, 4.80], [48.45, 5.40],
                        [48.10, 5.70], [47.50, 7.00], [47.55, 7.30],
                        [46.20, 6.10], [46.45, 5.90], [46.10, 5.40], [45.80, 5.90],
                        [45.20, 5.70], [44.10, 6.20], [43.80, 7.50], [43.50, 6.90],
                        [43.10, 5.80], [43.30, 3.50], [43.00, 3.00], [42.65, 3.00],
                        [42.50, 2.00], [42.40, 0.70], [43.30, 0.30], [43.40, -1.50],
                        [43.70, -1.80], [44.40, -1.20], [45.20, -1.10], [46.20, -1.20],
                        [46.90, -1.80], [47.30, -2.50], [47.70, -3.00], [48.00, -4.70],
                        [48.50, -4.80], [48.40, -3.00], [48.70, -1.60], [48.80, -1.20],
                        [49.20, -1.80]
                    ],
                    description: "Allied liberation of France & Western Europe — D-Day (June 6, 1944) through the liberation of Paris, crossing of the Rhine, and advance into Germany"
                },
                {
                    name: "Soviet Counter-Offensive (1943-45)",
                    color: "#6366f1",
                    coords: [
                        [59.50, 33.00], [59.00, 25.00], [57.50, 25.30], [57.70, 24.00],
                        [57.50, 21.70], [56.80, 21.10], [56.00, 21.00], [55.40, 21.00],
                        [54.40, 22.70], [53.50, 23.50], [52.10, 23.80], [51.30, 23.50],
                        [50.80, 22.80], [50.00, 22.10], [49.50, 22.50], [49.00, 22.00],
                        [48.90, 21.40], [49.10, 20.50], [49.50, 20.10], [49.55, 19.20],
                        [50.10, 18.80], [50.40, 18.00], [50.60, 17.60], [51.10, 16.90],
                        [52.00, 16.55], [53.80, 15.80], [53.90, 14.10],
                        [52.52, 13.41], [52.00, 13.50], [51.50, 14.00], [50.10, 14.50],
                        [49.00, 15.00], [48.00, 16.00], [47.50, 18.00], [47.00, 20.00],
                        [46.80, 22.00], [46.50, 24.00], [46.00, 26.50], [45.50, 28.00],
                        [45.00, 29.60], [44.50, 33.70], [45.00, 34.00], [45.50, 35.00],
                        [46.00, 36.50], [47.00, 39.50], [48.50, 42.50], [50.50, 44.00],
                        [53.50, 44.00], [55.50, 41.00], [57.50, 38.50], [58.50, 36.00]
                    ],
                    description: "Soviet counter-offensive sweep — from Stalingrad to Berlin; liberated the Baltics, Poland, Czechoslovakia, Hungary, Romania, Bulgaria, and eastern Germany (1943-1945)"
                }
            ]
        },
        invasions: [
            { name: "German Invasion of Poland", year: "1939", from: [52.52, 13.41], to: [52.23, 21.01], color: "#ef4444", side: "side1", description: "Germany launched Blitzkrieg on Poland, starting WWII." },
            { name: "German Conquest of France", year: "1940", from: [50.85, 7.0], to: [50.85, 4.35], then: [48.86, 2.35], color: "#ef4444", side: "side1", description: "Germany bypassed the Maginot Line through the Ardennes, conquering France in 6 weeks." },
            { name: "Invasion of Norway", year: "1940", from: [54.32, 10.14], to: [55.68, 12.57], then: [59.91, 10.75], color: "#ef4444", side: "side1", description: "Germany seized Denmark and Norway to secure iron ore supply routes." },
            { name: "Operation Barbarossa", year: "1941", from: [52.23, 21.01], to: [55.75, 37.62], color: "#ef4444", side: "side1", description: "Largest invasion in history — 3.8M Axis troops invaded the Soviet Union." },
            { name: "Push to Stalingrad", year: "1942", from: [50.45, 30.52], to: [48.70, 44.52], color: "#ef4444", side: "side1", description: "Germany's deepest penetration into the Soviet Union." },
            { name: "Japan Attacks Pearl Harbor", year: "1941", from: [35.68, 139.69], to: [21.35, -157.95], color: "#dc2626", side: "side1", description: "Surprise attack drew America into the war." },
            { name: "Japan Conquers SE Asia", year: "1941–42", from: [14.60, 120.98], to: [1.35, 103.82], then: [-6.21, 106.85], color: "#dc2626", side: "side1", description: "Rapid conquest of Philippines, Malaya, Singapore, Burma, and Dutch East Indies." },
            { name: "Rommel in North Africa", year: "1940–42", from: [32.90, 13.18], to: [31.20, 29.92], color: "#ef4444", side: "side1", description: "Axis push across Libya toward Egypt." },
            { name: "D-Day: Normandy Invasion", year: "1944", from: [50.72, -1.15], to: [49.34, -0.88], color: "#3b82f6", side: "side2", description: "156,000 Allied troops landed on Normandy beaches, liberating France." },
            { name: "Soviet Counter-Offensive", year: "1943–45", from: [55.75, 37.62], to: [52.23, 21.01], then: [52.52, 13.41], color: "#6366f1", side: "side2", description: "Red Army drove westward from Stalingrad to Berlin." },
            { name: "Allied Invasion of Italy", year: "1943", from: [36.80, 14.60], to: [38.12, 15.65], then: [40.85, 14.27], color: "#3b82f6", side: "side2", description: "Allies invaded Sicily then mainland Italy." },
            { name: "US Island Hopping", year: "1943–45", from: [21.35, -157.95], to: [13.44, 144.79], then: [26.34, 127.77], color: "#2563eb", side: "side2", description: "US systematically captured Pacific islands toward Japan." }
        ],
        events: [
            { year: "1939", title: "Poland Invaded", desc: "Germany invades Poland; Britain & France declare war" },
            { year: "1940", title: "France Falls", desc: "Germany conquers France; Battle of Britain begins" },
            { year: "1941", title: "Operation Barbarossa", desc: "Germany invades Soviet Union; Japan attacks Pearl Harbor" },
            { year: "1942", title: "Axis Peak", desc: "Axis powers at maximum territorial extent" },
            { year: "1943", title: "Turning Point", desc: "Stalingrad & Kursk victories; Allies invade Italy" },
            { year: "1944", title: "Liberation Begins", desc: "D-Day landings; Soviets liberate Eastern Europe" },
            { year: "1945 (May)", title: "Germany Surrenders", desc: "Soviet forces capture Berlin; VE Day on May 8" },
            { year: "1945 (Aug)", title: "Japan Surrenders", desc: "Atomic bombs dropped; Japan surrenders September 2" }
        ]
    }
};

function initConquestMap() {
    const mapEl = document.getElementById('conquest-map');
    if (!mapEl || typeof L === 'undefined') return;

    conquestMap = L.map('conquest-map', {
        center: [48.5, 15],
        zoom: 4,
        minZoom: 3,
        maxZoom: 8,
        zoomControl: true,
        scrollWheelZoom: true,
        attributionControl: false,
        worldCopyJump: true,
        maxBounds: [[-85, -200], [85, 200]],
        maxBoundsViscosity: 0.8
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
        className: 'dark-tiles'
    }).addTo(conquestMap);

    loadConquestData('ww1', 'all');
}

function clearConquestLayers() {
    conquestLayers.forEach(layer => {
        if (conquestMap) conquestMap.removeLayer(layer);
    });
    conquestLayers = [];
}

function getCurvedPointsConquest(from, to, numPoints = 30) {
    const midLat = (from[0] + to[0]) / 2;
    const midLng = (from[1] + to[1]) / 2;
    const latDiff = Math.abs(from[0] - to[0]);
    const lngDiff = Math.abs(from[1] - to[1]);
    const offset = Math.max(latDiff, lngDiff) * 0.2;
    const controlLat = midLat + offset;
    const controlLng = midLng;
    const points = [];
    for (let i = 0; i <= numPoints; i++) {
        const t = i / numPoints;
        const lat = (1 - t) * (1 - t) * from[0] + 2 * (1 - t) * t * controlLat + t * t * to[0];
        const lng = (1 - t) * (1 - t) * from[1] + 2 * (1 - t) * t * controlLng + t * t * to[1];
        points.push([lat, lng]);
    }
    return points;
}

function loadConquestData(war, filter) {
    const data = conquestData[war];
    if (!data || !conquestMap) return;

    currentConquestWar = war;
    currentAllianceFilter = filter || 'all';

    clearConquestLayers();
    conquestMap.setView(data.center, data.zoom, { animate: true });

    // Draw colored territory control zones
    const drawZones = (sideKey) => {
        const zones = data.controlZones[sideKey];
        if (!zones) return;
        zones.forEach(zone => {
            const polygon = L.polygon(zone.coords, {
                color: zone.color,
                fillColor: zone.color,
                fillOpacity: 0.25,
                weight: 2,
                opacity: 0.7
            }).addTo(conquestMap);

            polygon.bindPopup(`
                <div style="font-family: 'Rajdhani', sans-serif; min-width: 220px;">
                    <h4 style="margin: 0 0 6px; color: ${zone.color}; font-size: 1.05rem; font-weight: 700;">${zone.name}</h4>
                    <div style="font-size: 0.72rem; padding: 2px 8px; border-radius: 4px; background: ${zone.color}20; color: ${zone.color}; font-weight: 600; display: inline-block; margin-bottom: 8px;">
                        ${sideKey === 'side1' ? data.side1Name : data.side2Name}
                    </div>
                    <p style="margin: 0; font-size: 0.85rem; color: #ccc; line-height: 1.5;">${zone.description}</p>
                </div>
            `);

            // Add label
            const center = polygon.getBounds().getCenter();
            const label = L.marker(center, {
                icon: L.divIcon({
                    className: 'conquest-zone-label',
                    html: `<span style="
                        font-family: 'Rajdhani', sans-serif;
                        font-size: 0.72rem;
                        font-weight: 700;
                        color: ${zone.color};
                        text-shadow: 0 0 6px rgba(0,0,0,0.8), 0 0 12px rgba(0,0,0,0.6);
                        white-space: nowrap;
                        letter-spacing: 0.03em;
                    ">${zone.name}</span>`,
                    iconSize: [0, 0],
                    iconAnchor: [0, 0]
                })
            }).addTo(conquestMap);

            conquestLayers.push(polygon);
            conquestLayers.push(label);
        });
    };

    if (filter === 'all' || filter === 'side1') {
        drawZones('side1');
    }
    if (filter === 'all' || filter === 'side2') {
        drawZones('side2');
    }

    // Draw invasion routes (filtered)
    const filteredInvasions = filter === 'all'
        ? data.invasions
        : data.invasions.filter(inv => inv.side === filter);

    filteredInvasions.forEach(inv => {
        const points = getCurvedPointsConquest(inv.from, inv.to);
        const line = L.polyline(points, {
            color: inv.color,
            weight: 3,
            opacity: 0.8,
            dashArray: '8 6',
            className: 'conquest-route-line'
        }).addTo(conquestMap);
        conquestLayers.push(line);

        if (inv.then) {
            const points2 = getCurvedPointsConquest(inv.to, inv.then);
            const line2 = L.polyline(points2, {
                color: inv.color,
                weight: 3,
                opacity: 0.6,
                dashArray: '8 6',
                className: 'conquest-route-line'
            }).addTo(conquestMap);
            conquestLayers.push(line2);
        }

        const destPoint = inv.then || inv.to;
        const markerIcon = L.divIcon({
            className: 'conquest-marker-icon',
            html: `<div style="width: 12px; height: 12px; background: ${inv.color}; border-radius: 50%; border: 2px solid #fff; box-shadow: 0 0 8px ${inv.color}80;"></div>`,
            iconSize: [12, 12],
            iconAnchor: [6, 6]
        });

        const marker = L.marker(destPoint, { icon: markerIcon }).addTo(conquestMap);
        marker.bindPopup(`
            <div style="font-family: 'Rajdhani', sans-serif; min-width: 250px; max-width: 300px;">
                <h4 style="margin: 0 0 8px; font-size: 1rem; color: #fff;">${inv.name}</h4>
                <div style="display: flex; gap: 8px; margin-bottom: 8px;">
                    <span style="font-size: 0.75rem; padding: 2px 8px; border-radius: 4px; background: ${inv.color}30; color: ${inv.color}; font-weight: 600;">${inv.side === 'side1' ? data.side1Name : data.side2Name}</span>
                    <span style="font-size: 0.75rem; padding: 2px 8px; border-radius: 4px; background: rgba(255,255,255,0.1); color: #f59e0b; font-weight: 600;">${inv.year}</span>
                </div>
                <p style="margin: 0; font-size: 0.85rem; color: #ccc; line-height: 1.5;">${inv.description}</p>
            </div>
        `);
        conquestLayers.push(marker);

        const originIcon = L.divIcon({
            className: 'conquest-origin-icon',
            html: `<div style="width: 8px; height: 8px; background: ${inv.color}; border-radius: 50%; opacity: 0.6;"></div>`,
            iconSize: [8, 8],
            iconAnchor: [4, 4]
        });
        const originMarker = L.marker(inv.from, { icon: originIcon }).addTo(conquestMap);
        conquestLayers.push(originMarker);
    });

    updateConquestLegend(data, filter);
    updateConquestTimeline(data);
    updateAllianceFilterLabels(data);
}

function updateAllianceFilterLabels(data) {
    const side1Btn = document.getElementById('filter-side1');
    const side2Btn = document.getElementById('filter-side2');
    if (side1Btn) side1Btn.innerHTML = `${data.side1Emoji} ${data.side1Name}`;
    if (side2Btn) side2Btn.innerHTML = `${data.side2Emoji} ${data.side2Name}`;
}

function toggleConquestLegend(event) {
    if (event) {
        event.stopPropagation();
    }
    const legend = document.getElementById('conquest-legend');
    const openBtn = document.getElementById('conquest-legend-open-btn');
    if (legend && openBtn) {
        legend.classList.toggle('hidden');
        openBtn.classList.toggle('hidden');
    }
}

function updateConquestLegend(data, filter) {
    const legend = document.getElementById('conquest-legend');
    if (!legend) return;

    const showSide1 = filter === 'all' || filter === 'side1';
    const showSide2 = filter === 'all' || filter === 'side2';

    let zonesHtml = '';
    if (showSide1 && data.controlZones.side1) {
        zonesHtml += `<h5 class="conquest-legend-subtitle">${data.side1Name} Territory</h5>`;
        zonesHtml += data.controlZones.side1.map(z => `
            <div class="conquest-legend-item">
                <span class="conquest-legend-dot" style="background: ${z.color};"></span>
                <span>${z.name}</span>
            </div>
        `).join('');
    }
    if (showSide2 && data.controlZones.side2) {
        zonesHtml += `<h5 class="conquest-legend-subtitle">${data.side2Name} Territory</h5>`;
        zonesHtml += data.controlZones.side2.map(z => `
            <div class="conquest-legend-item">
                <span class="conquest-legend-dot" style="background: ${z.color};"></span>
                <span>${z.name}</span>
            </div>
        `).join('');
    }

    legend.innerHTML = `
        <div class="conquest-legend-header">
            <h4 class="conquest-legend-title" style="margin: 0; padding: 0; border: none;">Map Legend</h4>
            <button class="conquest-legend-close-btn" onclick="toggleConquestLegend(event)" title="Hide Legend">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
        </div>
        <div class="conquest-legend-divider"></div>
        ${showSide1 ? `<div class="conquest-legend-item"><span class="conquest-legend-line" style="background: #ef4444;"></span><span>${data.side1Name} Zones</span></div>` : ''}
        ${showSide2 ? `<div class="conquest-legend-item"><span class="conquest-legend-line" style="background: #3b82f6;"></span><span>${data.side2Name} Zones</span></div>` : ''}
        <div class="conquest-legend-divider"></div>
        ${zonesHtml}
    `;
}

function updateConquestTimeline(data) {
    const timeline = document.getElementById('conquest-timeline');
    if (!timeline) return;

    timeline.innerHTML = `
        <h4 class="conquest-timeline-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            Timeline of Events
        </h4>
        <div class="conquest-timeline-track">
            ${data.events.map((e, i) => `
                <div class="conquest-event" style="--event-delay: ${i * 0.1}s">
                    <div class="conquest-event-dot"></div>
                    <div class="conquest-event-content">
                        <span class="conquest-event-year">${e.year}</span>
                        <strong class="conquest-event-title">${e.title}</strong>
                        <p class="conquest-event-desc">${e.desc}</p>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function filterConquestAlliance(filter) {
    document.querySelectorAll('.alliance-filter').forEach(b => b.classList.remove('active'));
    document.getElementById(`filter-${filter}`).classList.add('active');

    if (!conquestMap) {
        initConquestMap();
    }
    loadConquestData(currentConquestWar, filter);
}

function switchConquestMap(war) {
    document.querySelectorAll('.conquest-tab').forEach(t => t.classList.remove('active'));
    document.getElementById(`conquest-tab-${war}`).classList.add('active');

    // Reset filter to 'all' when switching wars
    document.querySelectorAll('.alliance-filter').forEach(b => b.classList.remove('active'));
    document.getElementById('filter-all').classList.add('active');
    currentAllianceFilter = 'all';

    if (!conquestMap) {
        initConquestMap();
    }
    loadConquestData(war, 'all');
}

function initConquestMapOnce() {
    const mapEl = document.getElementById('conquest-map');
    if (!mapEl) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !conquestMap) {
                initConquestMap();
                observer.disconnect();
            }
        });
    }, { threshold: 0.1 });

    observer.observe(mapEl);
}

const originalInitHistory = initHistory;
initHistory = function () {
    originalInitHistory();
    initConquestMapOnce();
};

// ==========================================
// NEWS SEARCH FUNCTIONALITY
// ==========================================
(function initNewsSearch() {
    const searchInput = document.getElementById('news-search-input');
    const clearBtn = document.getElementById('news-search-clear');
    if (!searchInput || !clearBtn) return;

    let searchTimeout = null;

    searchInput.addEventListener('input', function () {
        const query = this.value.trim();
        clearBtn.classList.toggle('visible', query.length > 0);

        // Debounce — wait 250ms after user stops typing
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(function () {
            filterNewsCards(query);
        }, 250);
    });

    clearBtn.addEventListener('click', function () {
        searchInput.value = '';
        clearBtn.classList.remove('visible');
        filterNewsCards('');
        searchInput.focus();
    });

    // Allow Enter key to search immediately
    searchInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            clearTimeout(searchTimeout);
            filterNewsCards(this.value.trim());
        }
    });
})();

function filterNewsCards(query) {
    const newsGrid = document.getElementById('news-grid');
    if (!newsGrid) return;

    const cards = newsGrid.querySelectorAll('.news-card');
    const noResultsEl = newsGrid.querySelector('.news-no-results');

    // Remove existing no-results message
    if (noResultsEl) noResultsEl.remove();

    // If empty query, show all
    if (!query) {
        cards.forEach(function (card) { card.classList.remove('search-hidden'); });
        return;
    }

    const terms = query.toLowerCase().split(/\s+/);
    let visibleCount = 0;

    cards.forEach(function (card) {
        const title = (card.querySelector('.news-card-title') || {}).textContent || '';
        const desc = (card.querySelector('.news-card-description') || {}).textContent || '';
        const source = (card.querySelector('.news-card-source') || {}).textContent || '';
        const category = (card.querySelector('.news-card-category') || {}).textContent || '';
        const searchText = (title + ' ' + desc + ' ' + source + ' ' + category).toLowerCase();

        // All terms must match (AND logic)
        const matches = terms.every(function (term) { return searchText.includes(term); });

        if (matches) {
            card.classList.remove('search-hidden');
            visibleCount++;
        } else {
            card.classList.add('search-hidden');
        }
    });

    // Show no-results message if nothing matches
    if (visibleCount === 0 && cards.length > 0) {
        const noResults = document.createElement('div');
        noResults.className = 'news-no-results';
        noResults.innerHTML = `
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
                <path d="M8 11h6"/>
            </svg>
            <h4>No articles found for "${query}"</h4>
            <p>Try different keywords — e.g. a country name, weapon system, or topic</p>
        `;
        newsGrid.appendChild(noResults);
    }
}



// ============================================
// WATCHLIST SYSTEM
// ============================================
let watchlistCache = [];

function isLoggedIn() {
    return !!localStorage.getItem('gmi_token');
}

function getAuthHeaders() {
    const token = localStorage.getItem('gmi_token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
}

async function loadWatchlist() {
    if (!isLoggedIn()) {
        watchlistCache = [];
        window.watchlistItems = [];
        refreshFollowButtons();
        return;
    }
    try {
        const res = await fetch('/api/watchlist', { headers: getAuthHeaders() });
        if (res.status === 401) {
            localStorage.removeItem('gmi_token');
            localStorage.removeItem('gmi_user');
            if (typeof updateAuthUI === 'function') updateAuthUI(null);
            watchlistCache = [];
            window.watchlistItems = [];
            refreshFollowButtons();
            return;
        }
        if (res.ok) {
            const data = await res.json();
            watchlistCache = data.items || [];
            window.watchlistItems = watchlistCache;
            refreshFollowButtons();

            // Process any pending follow saved before login
            const pending = sessionStorage.getItem('pending_follow');
            if (pending) {
                sessionStorage.removeItem('pending_follow');
                try {
                    const parsed = JSON.parse(pending);
                    if (parsed && parsed.targetType && parsed.targetId && !isFollowing(parsed.targetType, parsed.targetId)) {
                        toggleWatchlistItem(parsed.targetType, parsed.targetId);
                    }
                } catch (e) {
                    console.error('Error processing pending follow:', e);
                }
            }
        }
    } catch (err) {
        console.error('Failed to load watchlist:', err);
    }
}

function isFollowing(targetType, targetId) {
    return watchlistCache.some(item => item.targetType === targetType && String(item.targetId) === String(targetId));
}

async function toggleWatchlistItem(targetType, targetId, event) {
    if (event) {
        event.stopPropagation();
        event.preventDefault();
        if (event.stopImmediatePropagation) {
            event.stopImmediatePropagation();
        }
    }

    if (!isLoggedIn()) {
        sessionStorage.setItem('pending_follow', JSON.stringify({ targetType, targetId }));
        const name = getTargetDisplayName(targetType, targetId);
        showToast('Sign in or create an account to add ' + name + ' to your Intel Watchlist.', 'info');
        if (typeof openSignupModal === 'function') {
            openSignupModal();
        }
        return;
    }

    const alreadyFollowing = isFollowing(targetType, targetId);
    try {
        if (alreadyFollowing) {
            const res = await fetch('/api/watchlist/' + encodeURIComponent(targetType) + '/' + encodeURIComponent(targetId), {
                method: 'DELETE',
                headers: getAuthHeaders()
            });

            if (res.status === 401) {
                showToast('Session expired. Please log in again.', 'error');
                if (typeof logoutUser === 'function') logoutUser();
                if (typeof openLoginModal === 'function') openLoginModal();
                return;
            }

            if (res.ok) {
                watchlistCache = watchlistCache.filter(
                    item => !(item.targetType === targetType && String(item.targetId) === String(targetId))
                );
                window.watchlistItems = watchlistCache;
                const name = getTargetDisplayName(targetType, targetId);
                showToast('Removed ' + name + ' from watchlist', 'info');
            } else {
                const errData = await res.json().catch(() => ({}));
                showToast(errData.error || 'Failed to remove from watchlist.', 'error');
            }
        } else {
            const res = await fetch('/api/watchlist', {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ targetType, targetId: String(targetId) })
            });

            if (res.status === 401) {
                showToast('Session expired. Please log in again.', 'error');
                if (typeof logoutUser === 'function') logoutUser();
                if (typeof openLoginModal === 'function') openLoginModal();
                return;
            }

            if (res.status === 409) {
                if (!isFollowing(targetType, targetId)) {
                    watchlistCache.push({ targetType, targetId: String(targetId) });
                    window.watchlistItems = watchlistCache;
                }
                const name = getTargetDisplayName(targetType, targetId);
                showToast('Already following ' + name + ' ⭐', 'info');
            } else if (res.ok) {
                const data = await res.json();
                const newItem = data.item || { targetType, targetId: String(targetId) };
                if (!isFollowing(targetType, targetId)) {
                    watchlistCache.push(newItem);
                    window.watchlistItems = watchlistCache;
                }
                const name = getTargetDisplayName(targetType, targetId);
                showToast('Added ' + name + ' to Intel Watchlist ⭐', 'success');
            } else {
                const errData = await res.json().catch(() => ({}));
                showToast(errData.error || 'Failed to add to watchlist.', 'error');
            }
        }
        refreshFollowButtons();
    } catch (err) {
        console.error('Watchlist error:', err);
        showToast('Connection error. Please try again.', 'error');
    }
}

function getTargetDisplayName(targetType, targetId) {
    if (targetType === 'nation' && nationsData[targetId]) {
        return nationsData[targetId].name;
    }
    if (targetType === 'conflict' && conflictsData[parseInt(targetId)]) {
        return conflictsData[parseInt(targetId)].name;
    }
    return targetId;
}

function refreshFollowButtons() {
    document.querySelectorAll('.follow-btn').forEach(function (btn) {
        var type = btn.dataset.targetType;
        var id = btn.dataset.targetId;
        if (isFollowing(type, id)) {
            btn.classList.add('active');
            btn.innerHTML = '\u2605';
            btn.title = 'Remove from Intel Watchlist';
        } else {
            btn.classList.remove('active');
            btn.innerHTML = '\u2606';
            btn.title = 'Add to Intel Watchlist';
        }
    });

    var modalBtn = document.getElementById('modal-follow-btn');
    if (modalBtn && currentNation) {
        if (isFollowing('nation', currentNation)) {
            modalBtn.classList.add('active');
            modalBtn.innerHTML = '★ Following';
            modalBtn.title = 'Unfollow this nation';
        } else {
            modalBtn.classList.remove('active');
            modalBtn.innerHTML = '☆ Follow Nation';
            modalBtn.title = 'Add to Intel Watchlist';
        }
    }
}

function getFollowBtnHtml(targetType, targetId) {
    var active = isFollowing(targetType, targetId);
    return '<button type="button" class="follow-btn ' + (active ? 'active' : '') + '" data-target-type="' + targetType + '" data-target-id="' + targetId + '" onclick="toggleWatchlistItem(\'' + targetType + '\', \'' + targetId + '\', event)" title="' + (active ? 'Remove from Intel Watchlist' : 'Add to Intel Watchlist') + '">' + (active ? '\u2605' : '\u2606') + '</button>';
}

// ============================================
// WATCHLIST DASHBOARD
// ============================================
function openWatchlistDashboard() {
    var dashboard = document.getElementById('watchlist-dashboard');
    if (dashboard) {
        dashboard.classList.add('active');
        document.body.style.overflow = 'hidden';
        switchDashboardTab('watchlist');
        renderWatchlistDashboard();
    }
    var menu = document.getElementById('auth-user-menu');
    if (menu) menu.classList.remove('open');
}

let watchlistFilter = { type: null, id: null };

function toggleWatchlistFilter(type, id, event) {
    if (event) {
        event.stopPropagation();
    }
    if (watchlistFilter.type === type && watchlistFilter.id === id) {
        watchlistFilter = { type: null, id: null };
    } else {
        watchlistFilter = { type: type, id: id };
    }
    renderWatchlistDashboard();
}

function closeWatchlistDashboard() {
    var dashboard = document.getElementById('watchlist-dashboard');
    if (dashboard) {
        dashboard.classList.remove('active');
        document.body.style.overflow = '';
    }
    watchlistFilter = { type: null, id: null };
}

// Nation search keywords for personalized feed matching
const nationKeywords = {
    USA: ["usa", "u.s.", "united states", "american", "pentagon", "washington"],
    Russia: ["russia", "russian", "moscow", "kremlin"],
    China: ["china", "chinese", "beijing", "plan ", "pla "],
    India: ["india", "indian", "delhi"],
    UK: ["uk ", "u.k.", "britain", "british", "london", "royal navy"],
    France: ["france", "french", "paris"],
    NorthKorea: ["north korea", "pyongyang", "dprk"],
    Japan: ["japan", "japanese", "tokyo"],
    SouthKorea: ["south korea", "seoul"],
    Israel: ["israel", "israeli", "tel aviv", "idf", "mossad"],
    Iran: ["iran", "iranian", "tehran", "irgc"],
    Germany: ["germany", "german", "berlin"],
    Turkey: ["turkey", "turkish", "ankara"],
    Pakistan: ["pakistan", "pakistani", "islamabad"],
    SaudiArabia: ["saudi", "riyadh"],
    Egypt: ["egypt", "egyptian", "cairo"],
    Ukraine: ["ukraine", "ukrainian", "kyiv"],
    Taiwan: ["taiwan", "taiwanese", "taipei"],
    Canada: ["canada", "canadian", "ottawa"],
    Australia: ["australia", "australian", "canberra"],
    Brazil: ["brazil", "brazilian", "brasilia"]
};

function getPersonalizedIntelFeed(nations, conflicts) {
    var feed = [];
    var activeNations = nations;
    var activeConflicts = conflicts;

    // Filter feed items according to selected watchlist filter
    if (watchlistFilter.type === 'nation') {
        activeNations = nations.filter(function (n) { return n.targetId === watchlistFilter.id; });
        activeConflicts = [];
    } else if (watchlistFilter.type === 'conflict') {
        activeNations = [];
        activeConflicts = conflicts.filter(function (c) { return c.targetId === watchlistFilter.id; });
    }

    // 1. Match from global newsData
    if (typeof newsData !== 'undefined' && Array.isArray(newsData)) {
        newsData.forEach(function (article) {
            var title = (article.title || '').toLowerCase();
            var desc = (article.description || '').toLowerCase();

            // Match followed nations
            activeNations.forEach(function (n) {
                var keywords = nationKeywords[n.targetId] || [nationsData[n.targetId] ? nationsData[n.targetId].name.toLowerCase() : n.targetId.toLowerCase()];
                var matches = keywords.some(function (kw) { return title.includes(kw) || desc.includes(kw); });
                if (matches) {
                    feed.push({
                        type: 'news',
                        tag: '🌍 ' + (nationsData[n.targetId] ? nationsData[n.targetId].name : n.targetId),
                        title: article.title,
                        desc: article.description,
                        time: article.publishedAt ? new Date(article.publishedAt) : new Date(),
                        source: article.source || 'Intel Feed'
                    });
                }
            });

            // Match followed conflicts
            activeConflicts.forEach(function (c) {
                var conflictIndex = parseInt(c.targetId);
                var conflict = conflictsData[conflictIndex];
                if (conflict) {
                    var nameWords = conflict.name.toLowerCase().split(/[\s-]+/);
                    var matches = nameWords.some(function (word) {
                        if (['war', 'vs', 'and', 'the', 'of', 'in', 'crisis'].includes(word)) return false;
                        return title.includes(word) || desc.includes(word);
                    });
                    if (matches) {
                        feed.push({
                            type: 'news',
                            tag: '⚔️ ' + conflict.name,
                            title: article.title,
                            desc: article.description,
                            time: article.publishedAt ? new Date(article.publishedAt) : new Date(),
                            source: article.source || 'Intel Feed'
                        });
                    }
                }
            });
        });
    }

    // 2. Match specific updates embedded in conflict objects
    activeConflicts.forEach(function (c) {
        var conflictIndex = parseInt(c.targetId);
        var conflict = conflictsData[conflictIndex];
        if (conflict && Array.isArray(conflict.news)) {
            conflict.news.forEach(function (item) {
                feed.push({
                    type: 'update',
                    tag: '📡 ' + conflict.name + ' UPDATE',
                    title: item.title,
                    desc: 'Reported by ' + item.source,
                    time: item.date ? new Date(item.date) : new Date(),
                    source: item.source
                });
            });
        }
    });

    // 3. Dynamic force adjustment alerts for followed nations
    activeNations.forEach(function (n) {
        var nation = nationsData[n.targetId];
        if (nation) {
            feed.push({
                type: 'alert',
                tag: '📊 FORCE ASSIGNMENT',
                title: nation.name + ' Global Military Projection Report',
                desc: nation.name + ' maintains active military personnel count of ' + nation.personnel.active.toLocaleString() + ' with a total defense budget of ' + nation.budget + ', ranked #' + nation.rank + ' globally.',
                time: new Date(Date.now() - 3600000 * 6), // 6 hours ago
                source: 'GMI OSINT System'
            });
        }
    });

    // Sort feed items by time (newest first)
    feed.sort(function (a, b) { return b.time - a.time; });

    // Deduplicate
    var seen = new Set();
    return feed.filter(function (item) {
        var key = item.title.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
}

function getTargetDisplayName(type, id) {
    if (type === 'nation') {
        var nation = nationsData[id];
        return nation ? nation.name : id;
    } else if (type === 'conflict') {
        var conflict = conflictsData[parseInt(id)];
        return conflict ? conflict.name : 'Conflict #' + id;
    }
    return id;
}

function renderWatchlistDashboard() {
    var body = document.getElementById('watchlist-body');
    if (!body) return;
    var nations = watchlistCache.filter(function (item) { return item.targetType === 'nation'; });
    var conflicts = watchlistCache.filter(function (item) { return item.targetType === 'conflict'; });

    if (nations.length === 0 && conflicts.length === 0) {
        body.innerHTML = '<div class="watchlist-empty"><div class="watchlist-empty-icon">\uD83D\uDCE1</div><h3>No Intel Tracked Yet</h3><p>Use the \u2606 button on nation cards and conflict cards to add items to your watchlist. Your followed intelligence will appear here.</p></div>';
        return;
    }

    var assetsHtml = '';

    if (nations.length > 0) {
        assetsHtml += '<div class="watchlist-section"><div class="watchlist-section-title">\uD83C\uDF0D Followed Nations <span class="wl-count">' + nations.length + '</span></div><div class="watchlist-grid">';
        nations.forEach(function (item) {
            var nation = nationsData[item.targetId];
            if (nation) {
                var isSel = (watchlistFilter.type === 'nation' && watchlistFilter.id === item.targetId);
                assetsHtml += '<div class="watchlist-item' + (isSel ? ' selected' : '') + '" onclick="toggleWatchlistFilter(\'nation\', \'' + item.targetId + '\', event)"><img class="watchlist-item-flag" src="' + getFlagUrl(nation.countryCode, 'w80') + '" alt="' + nation.name + '" onerror="this.style.display=\'none\'"><div class="watchlist-item-info"><div class="watchlist-item-name">' + nation.name + '</div><div class="watchlist-item-meta">Rank #' + nation.rank + ' \u2022 ' + nation.budget + '</div></div><button class="watchlist-view-btn" onclick="event.stopPropagation(); closeWatchlistDashboard(); setTimeout(function() { openNationModal(\'' + item.targetId + '\'); }, 300);" title="View Full Profile">👁️</button><button class="watchlist-unfollow-btn" onclick="event.stopPropagation(); unfollowFromDashboard(\'nation\', \'' + item.targetId + '\')" title="Unfollow">\u2715</button></div>';
            }
        });
        assetsHtml += '</div></div>';
    }

    if (conflicts.length > 0) {
        assetsHtml += '<div class="watchlist-section"><div class="watchlist-section-title">\u2694\uFE0F Followed Conflicts <span class="wl-count">' + conflicts.length + '</span></div><div class="watchlist-grid">';
        conflicts.forEach(function (item) {
            var conflict = conflictsData[parseInt(item.targetId)];
            if (conflict) {
                var isSel = (watchlistFilter.type === 'conflict' && watchlistFilter.id === item.targetId);
                assetsHtml += '<div class="watchlist-item' + (isSel ? ' selected' : '') + '" onclick="toggleWatchlistFilter(\'conflict\', \'' + item.targetId + '\', event)"><div class="watchlist-item-icon">' + conflict.regionIcon + '</div><div class="watchlist-item-info"><div class="watchlist-item-name">' + conflict.name + '</div><div class="watchlist-item-meta">' + conflict.region + ' \u2022 ' + conflict.status + '</div></div><button class="watchlist-view-btn" onclick="event.stopPropagation(); closeWatchlistDashboard(); setTimeout(function() { openConflictDetail(' + parseInt(item.targetId) + '); }, 300);" title="View Conflict Details">👁️</button><button class="watchlist-unfollow-btn" onclick="event.stopPropagation(); unfollowFromDashboard(\'conflict\', \'' + item.targetId + '\')" title="Unfollow">\u2715</button></div>';
            }
        });
        assetsHtml += '</div></div>';
    }

    // Build the personalized feed HTML
    var feedData = getPersonalizedIntelFeed(nations, conflicts);

    var feedHeaderTitle = 'Personalized Intel Feed & Alerts';
    var showAllBtn = '';
    if (watchlistFilter.type) {
        var filterName = getTargetDisplayName(watchlistFilter.type, watchlistFilter.id);
        feedHeaderTitle = 'Intel Feed: ' + filterName;
        showAllBtn = '<button onclick="toggleWatchlistFilter(watchlistFilter.type, watchlistFilter.id, event)" style="background: rgba(212,175,55,0.1); border: 1px solid rgba(212,175,55,0.3); border-radius: 4px; color: var(--color-accent-gold); font-size: 0.72rem; padding: 3px 8px; cursor: pointer; transition: all 0.2s ease;">Show All</button>';
    }

    var feedHtml = '<div class="intel-feed-container">';
    feedHtml += '<div class="intel-feed-header"><div class="intel-feed-header-left"><div class="intel-feed-badge-pulse"></div><span>' + feedHeaderTitle + '</span></div>' + showAllBtn + '</div>';
    feedHtml += '<div class="intel-feed-list">';

    if (feedData.length === 0) {
        feedHtml += '<div style="color: var(--color-text-muted); font-size: 0.85rem; font-style: italic; padding: 20px 0; text-align: center;">No intelligence telemetry matches this item...</div>';
    } else {
        feedData.forEach(function (item) {
            var timeAgo = getTimeAgo(item.time);
            feedHtml += '<div class="intel-feed-item">';
            feedHtml += '<div class="intel-feed-item-header">';
            feedHtml += '<span class="intel-feed-tag">' + item.tag + '</span>';
            feedHtml += '<span class="intel-feed-time">' + (timeAgo || 'Recent') + '</span>';
            feedHtml += '</div>';
            feedHtml += '<div class="intel-feed-title">' + item.title + '</div>';
            feedHtml += '<div class="intel-feed-desc">' + item.desc + '</div>';
            feedHtml += '</div>';
        });
    }
    feedHtml += '</div></div>';

    // Output into a responsive two-column grid
    body.innerHTML = '<div class="watchlist-layout"><div class="watchlist-assets-col">' + assetsHtml + '</div><div class="watchlist-feed-col">' + feedHtml + '</div></div>';
}

async function unfollowFromDashboard(targetType, targetId) {
    await toggleWatchlistItem(targetType, targetId);
    renderWatchlistDashboard();
}

// ============================================
// DEFENSE ANALYST NOTEBOOK — Report Builder
// ============================================
let notebookReports = [];
let currentReportId = null;
let currentReportDirty = false;
let pendingWidgetType = null;

// ─── Dashboard Tab Switching ───
function switchDashboardTab(tab) {
    document.querySelectorAll('.notebook-tab').forEach(function (btn) {
        btn.classList.toggle('active', btn.getAttribute('data-tab') === tab);
    });
    document.querySelectorAll('.dashboard-tab-content').forEach(function (pane) {
        pane.classList.remove('active');
    });
    var target = document.getElementById('tab-' + tab);
    if (target) target.classList.add('active');

    if (tab === 'notebook') {
        loadReports();
    } else if (tab === 'community') {
        loadCommunityReports(1);
    } else if (tab === 'admin') {
        if (typeof initAdminTab === 'function') initAdminTab();
    }
}

// ─── Report CRUD ───
async function loadReports() {
    var token = localStorage.getItem('gmi_token');
    if (!token) return;

    try {
        var resp = await fetch('/api/reports', {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        var data = await resp.json();
        if (resp.ok) {
            notebookReports = data.reports || [];
            renderReportsList();
        }
    } catch (err) {
        console.error('Failed to load reports:', err);
    }
}

function renderReportsList() {
    var container = document.getElementById('notebook-reports-list');
    if (!container) return;

    if (notebookReports.length === 0) {
        container.innerHTML = '<div class="notebook-list-empty">No reports yet.<br>Click "New Report" to begin.</div>';
        return;
    }

    var html = '';
    notebookReports.forEach(function (r) {
        var isActive = currentReportId === r._id;
        var dateStr = new Date(r.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        html += '<div class="notebook-report-item' + (isActive ? ' active' : '') + '" onclick="openReport(\'' + r._id + '\')">';
        html += '<div class="notebook-report-item-title">' + escapeHtml(r.title) + '</div>';
        html += '<div class="notebook-report-item-meta">';
        html += '<span>' + dateStr + '</span>';
        if (r.isPublic) html += '<span class="nb-public-badge">Public</span>';
        html += '</div>';
        html += '</div>';
    });
    container.innerHTML = html;
}

function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

async function createNewReport() {
    var token = localStorage.getItem('gmi_token');
    if (!token) return;

    try {
        var resp = await fetch('/api/reports', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: 'Untitled Report',
                content: '# Strategic Analysis\n\nBegin your defense analysis here...\n'
            })
        });
        var data = await resp.json();
        if (resp.ok && data.report) {
            showToast('📝 New report created', 'success');
            await loadReports();
            openReport(data.report._id);
        }
    } catch (err) {
        console.error('Failed to create report:', err);
        showToast('Failed to create report', 'error');
    }
}

async function openReport(id) {
    var token = localStorage.getItem('gmi_token');
    if (!token) return;

    try {
        var resp = await fetch('/api/reports/' + id, {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        var data = await resp.json();
        if (resp.ok && data.report) {
            currentReportId = data.report._id;
            currentReportDirty = false;

            // Populate editor
            document.getElementById('notebook-title').value = data.report.title;
            document.getElementById('notebook-content').value = data.report.content;
            document.getElementById('notebook-public-toggle').checked = data.report.isPublic;

            // Show editor, hide empty state
            document.getElementById('notebook-empty-state').style.display = 'none';
            document.getElementById('notebook-editor-area').style.display = 'flex';

            updateNotebookPreview();
            renderReportsList();
        }
    } catch (err) {
        console.error('Failed to open report:', err);
    }
}

async function saveReport() {
    if (!currentReportId) return;
    var token = localStorage.getItem('gmi_token');
    if (!token) return;

    var title = document.getElementById('notebook-title').value.trim();
    var content = document.getElementById('notebook-content').value;
    var isPublic = document.getElementById('notebook-public-toggle').checked;

    if (!title) {
        showToast('Report title is required', 'error');
        return;
    }

    try {
        var resp = await fetch('/api/reports/' + currentReportId, {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title: title, content: content, isPublic: isPublic })
        });
        if (resp.ok) {
            currentReportDirty = false;
            showToast('✅ Report saved', 'success');
            loadReports();
        } else {
            showToast('Failed to save', 'error');
        }
    } catch (err) {
        console.error('Failed to save report:', err);
        showToast('Failed to save report', 'error');
    }
}

function toggleReportPublic() {
    currentReportDirty = true;
}

async function deleteCurrentReport() {
    if (!currentReportId) return;
    if (!confirm('Delete this report permanently?')) return;

    var token = localStorage.getItem('gmi_token');
    if (!token) return;

    try {
        var resp = await fetch('/api/reports/' + currentReportId, {
            method: 'DELETE',
            headers: { 'Authorization': 'Bearer ' + token }
        });
        if (resp.ok) {
            showToast('🗑️ Report deleted', 'success');
            currentReportId = null;
            document.getElementById('notebook-editor-area').style.display = 'none';
            document.getElementById('notebook-empty-state').style.display = 'flex';
            loadReports();
        }
    } catch (err) {
        console.error('Failed to delete report:', err);
    }
}

// ─── Markdown Toolbar Insertion ───
function nbInsertMd(type) {
    var ta = document.getElementById('notebook-content');
    if (!ta) return;
    var start = ta.selectionStart;
    var end = ta.selectionEnd;
    var selected = ta.value.substring(start, end);
    var before = ta.value.substring(0, start);
    var after = ta.value.substring(end);
    var insert = '';
    var cursorOffset = 0;

    switch (type) {
        case 'bold':
            insert = '**' + (selected || 'bold text') + '**';
            cursorOffset = selected ? insert.length : 2;
            break;
        case 'italic':
            insert = '_' + (selected || 'italic text') + '_';
            cursorOffset = selected ? insert.length : 1;
            break;
        case 'heading':
            insert = '\n## ' + (selected || 'Heading') + '\n';
            cursorOffset = selected ? insert.length : 4;
            break;
        case 'ul':
            insert = '\n- ' + (selected || 'List item') + '\n';
            cursorOffset = selected ? insert.length : 3;
            break;
        case 'ol':
            insert = '\n1. ' + (selected || 'List item') + '\n';
            cursorOffset = selected ? insert.length : 4;
            break;
        case 'code':
            insert = '\n```\n' + (selected || 'code') + '\n```\n';
            cursorOffset = selected ? insert.length : 5;
            break;
        case 'quote':
            insert = '\n> ' + (selected || 'Quote') + '\n';
            cursorOffset = selected ? insert.length : 3;
            break;
        case 'hr':
            insert = '\n---\n';
            cursorOffset = insert.length;
            break;
    }

    ta.value = before + insert + after;
    ta.focus();
    var newPos = start + cursorOffset;
    ta.setSelectionRange(newPos, newPos);
    updateNotebookPreview();
}

// ─── Lightweight Markdown Parser ───
function parseMarkdown(md) {
    if (!md) return '';

    // First: render widget tags before any escaping
    var html = md;

    // Escape HTML (but preserve our widget tags)
    html = html.replace(/\[widget:(comparison|pie-fleet|force-table)\|([^\]]+)\]/g, function (match) {
        return '%%WIDGET_' + btoa(match) + '%%';
    });

    // Escape angle brackets
    html = html.replace(/</g, '&lt;').replace(/>/g, '&gt;');

    // Restore widget placeholders
    html = html.replace(/%%WIDGET_([A-Za-z0-9+/=]+)%%/g, function (_, encoded) {
        var original = atob(encoded);
        return original; // will be processed below
    });

    // Code blocks (```)
    html = html.replace(/```([\s\S]*?)```/g, function (_, code) {
        return '<pre class="nb-code-block"><code>' + code.trim() + '</code></pre>';
    });

    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code class="nb-inline-code">$1</code>');

    // Headings
    html = html.replace(/^#### (.+)$/gm, '<h4>$1</h4>');
    html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

    // Horizontal rules
    html = html.replace(/^---$/gm, '<hr class="nb-hr">');

    // Blockquotes
    html = html.replace(/^&gt; (.+)$/gm, '<blockquote class="nb-blockquote">$1</blockquote>');

    // Bold and italic (matches across newlines)
    html = html.replace(/\*\*([\s\S]+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__([\s\S]+?)__/g, '<strong>$1</strong>');
    html = html.replace(/\*([\s\S]+?)\*/g, '<em>$1</em>');
    html = html.replace(/_([\s\S]+?)_/g, '<em>$1</em>');

    // Unordered lists (consecutive lines starting with - or *)
    html = html.replace(/(?:^[\-\*] .+(?:\r?\n|$))+/gm, function (match) {
        var items = match.trim().split(/\r?\n/).map(function (line) {
            return '<li>' + line.replace(/^[\-\*] /, '').trim() + '</li>';
        }).join('');
        return '<ul class="nb-list">' + items + '</ul>';
    });

    // Ordered lists (consecutive lines starting with a number and dot)
    html = html.replace(/(?:^\d+\. .+(?:\r?\n|$))+/gm, function (match) {
        var items = match.trim().split(/\r?\n/).map(function (line) {
            return '<li>' + line.replace(/^\d+\.\s+/, '').trim() + '</li>';
        }).join('');
        return '<ol class="nb-list-ordered">' + items + '</ol>';
    });

    // Paragraphs (double newline)
    html = html.replace(/\n\n+/g, '</p><p>');
    html = '<p>' + html + '</p>';

    // Clean up empty paragraphs
    html = html.replace(/<p>\s*<\/p>/g, '');
    html = html.replace(/<p>(<h[1-4]>)/g, '$1');
    html = html.replace(/(<\/h[1-4]>)<\/p>/g, '$1');
    html = html.replace(/<p>(<pre)/g, '$1');
    html = html.replace(/(<\/pre>)<\/p>/g, '$1');
    html = html.replace(/<p>(<hr[^>]*>)<\/p>/g, '$1');
    html = html.replace(/<p>(<ul)/g, '$1');
    html = html.replace(/(<\/ul>)<\/p>/g, '$1');
    html = html.replace(/<p>(<blockquote)/g, '$1');
    html = html.replace(/(<\/blockquote>)<\/p>/g, '$1');

    // Single newlines to <br>
    html = html.replace(/\n/g, '<br>');

    // Now render widget tags
    html = html.replace(/\[widget:comparison\|([^\]]+)\]/g, function (_, config) {
        return renderComparisonWidget(config);
    });
    html = html.replace(/\[widget:pie-fleet\|([^\]]+)\]/g, function (_, config) {
        return renderPieFleetWidget(config);
    });
    html = html.replace(/\[widget:force-table\|([^\]]+)\]/g, function (_, config) {
        return renderForceTableWidget(config);
    });

    return html;
}

function updateNotebookPreview() {
    var content = document.getElementById('notebook-content').value;
    var preview = document.getElementById('notebook-preview');
    if (!preview) return;

    if (!content.trim()) {
        preview.innerHTML = '<div class="notebook-preview-placeholder">Live preview will appear here...</div>';
        return;
    }

    preview.innerHTML = parseMarkdown(content);
    currentReportDirty = true;
}

// ─── Widget Rendering ───
function renderComparisonWidget(config) {
    var parts = config.split(',');
    if (parts.length < 2) return '<div class="nb-widget-error">⚠ Comparison requires 2 nations</div>';

    var n1 = nationsData[parts[0].trim()];
    var n2 = nationsData[parts[1].trim()];
    if (!n1 || !n2) return '<div class="nb-widget-error">⚠ Nation not found: ' + config + '</div>';

    var metrics = [
        { label: 'Active Personnel', v1: n1.personnel.active, v2: n2.personnel.active },
        { label: 'Reserve Personnel', v1: n1.personnel.reserve, v2: n2.personnel.reserve },
        { label: 'Tanks', v1: n1.army.tanks, v2: n2.army.tanks },
        { label: 'Aircraft', v1: n1.airforce.fighters + n1.airforce.bombers, v2: n2.airforce.fighters + n2.airforce.bombers },
        { label: 'Submarines', v1: n1.navy.submarines, v2: n2.navy.submarines },
        { label: 'Destroyers', v1: n1.navy.destroyers, v2: n2.navy.destroyers }
    ];

    var html = '<div class="nb-widget nb-widget-comparison">';
    html += '<div class="nb-widget-header"><span class="nb-widget-badge">📊 COMPARISON</span></div>';
    html += '<div class="nb-compare-nations">';
    html += '<div class="nb-compare-nation-label">' + n1.flag + ' ' + n1.name + '</div>';
    html += '<div class="nb-compare-vs">VS</div>';
    html += '<div class="nb-compare-nation-label">' + n2.flag + ' ' + n2.name + '</div>';
    html += '</div>';

    metrics.forEach(function (m) {
        var max = Math.max(m.v1, m.v2) || 1;
        var pct1 = Math.round((m.v1 / max) * 100);
        var pct2 = Math.round((m.v2 / max) * 100);
        html += '<div class="nb-compare-row">';
        html += '<div class="nb-compare-label">' + m.label + '</div>';
        html += '<div class="nb-compare-bars">';
        html += '<div class="nb-compare-bar-wrap left"><div class="nb-compare-bar left" style="width:' + pct1 + '%"></div><span class="nb-compare-val">' + m.v1.toLocaleString() + '</span></div>';
        html += '<div class="nb-compare-bar-wrap right"><div class="nb-compare-bar right" style="width:' + pct2 + '%"></div><span class="nb-compare-val">' + m.v2.toLocaleString() + '</span></div>';
        html += '</div>';
        html += '</div>';
    });

    html += '</div>';
    return html;
}

function renderPieFleetWidget(config) {
    var parts = config.split('|');
    var nationKey = parts[0].trim();
    var nation = nationsData[nationKey];
    if (!nation) return '<div class="nb-widget-error">⚠ Nation not found: ' + nationKey + '</div>';

    var navy = nation.navy;
    var segments = [
        { label: 'Carriers', value: navy.carriers, color: '#d4af37' },
        { label: 'Submarines', value: navy.submarines, color: '#4a9eff' },
        { label: 'Destroyers', value: navy.destroyers, color: '#ff6b6b' },
        { label: 'Frigates', value: navy.frigates, color: '#51cf66' }
    ].filter(function (s) { return s.value > 0; });

    var total = segments.reduce(function (sum, s) { return sum + s.value; }, 0);

    // Build CSS conic gradient
    var gradientParts = [];
    var currentDeg = 0;
    segments.forEach(function (s) {
        var degrees = (s.value / total) * 360;
        gradientParts.push(s.color + ' ' + currentDeg + 'deg ' + (currentDeg + degrees) + 'deg');
        currentDeg += degrees;
    });

    var html = '<div class="nb-widget nb-widget-pie">';
    html += '<div class="nb-widget-header"><span class="nb-widget-badge">🍩 FLEET DISTRIBUTION</span> ' + nation.flag + ' ' + nation.name + ' Navy</div>';
    html += '<div class="nb-pie-layout">';
    html += '<div class="nb-pie-chart" style="background: conic-gradient(' + gradientParts.join(', ') + ');"></div>';
    html += '<div class="nb-pie-legend">';
    segments.forEach(function (s) {
        var pct = Math.round((s.value / total) * 100);
        html += '<div class="nb-pie-legend-item"><span class="nb-pie-dot" style="background:' + s.color + '"></span>' + s.label + ': <strong>' + s.value + '</strong> (' + pct + '%)</div>';
    });
    html += '</div>';
    html += '</div>';
    html += '</div>';
    return html;
}

function renderForceTableWidget(config) {
    var keys = config.split(',').map(function (k) { return k.trim(); });
    var nations = keys.map(function (k) { return nationsData[k]; }).filter(Boolean);
    if (nations.length === 0) return '<div class="nb-widget-error">⚠ No valid nations found</div>';

    var html = '<div class="nb-widget nb-widget-table">';
    html += '<div class="nb-widget-header"><span class="nb-widget-badge">📋 FORCE SUMMARY</span></div>';
    html += '<div class="nb-table-scroll"><table class="nb-force-table">';
    html += '<thead><tr><th>Metric</th>';
    nations.forEach(function (n) {
        html += '<th>' + n.flag + ' ' + n.name + '</th>';
    });
    html += '</tr></thead><tbody>';

    var rows = [
        { label: 'Global Rank', fn: function (n) { return '#' + n.rank; } },
        { label: 'Defense Budget', fn: function (n) { return n.budget; } },
        { label: 'Active Personnel', fn: function (n) { return n.personnel.active.toLocaleString(); } },
        { label: 'Reserve Personnel', fn: function (n) { return n.personnel.reserve.toLocaleString(); } },
        { label: 'Nuclear Warheads', fn: function (n) { return n.nuclear.status ? n.nuclear.warheads.toLocaleString() : 'None'; } },
        { label: 'Tanks', fn: function (n) { return n.army.tanks.toLocaleString(); } },
        { label: 'Fighters', fn: function (n) { return n.airforce.fighters.toLocaleString(); } },
        { label: 'Submarines', fn: function (n) { return n.navy.submarines.toLocaleString(); } },
        { label: 'Carriers', fn: function (n) { return n.navy.carriers.toLocaleString(); } }
    ];

    rows.forEach(function (row) {
        html += '<tr><td class="nb-table-label">' + row.label + '</td>';
        nations.forEach(function (n) {
            html += '<td>' + row.fn(n) + '</td>';
        });
        html += '</tr>';
    });

    html += '</tbody></table></div></div>';
    return html;
}

// ─── Widget Insert Modal ───
function openWidgetInsertModal() {
    var modal = document.getElementById('widget-insert-modal');
    if (modal) {
        modal.style.display = 'flex';
        document.getElementById('widget-config-step').style.display = 'none';
        document.querySelector('.widget-modal-body').style.display = 'flex';
        pendingWidgetType = null;
    }
}

function closeWidgetInsertModal() {
    var modal = document.getElementById('widget-insert-modal');
    if (modal) modal.style.display = 'none';
    pendingWidgetType = null;
}

function selectWidgetType(type) {
    pendingWidgetType = type;
    document.querySelector('.widget-modal-body').style.display = 'none';
    document.getElementById('widget-config-step').style.display = 'block';

    var configBody = document.getElementById('widget-config-body');
    var nationOptions = Object.keys(nationsData).map(function (key) {
        return '<option value="' + key + '">' + nationsData[key].flag + ' ' + nationsData[key].name + '</option>';
    }).join('');

    switch (type) {
        case 'comparison':
            configBody.innerHTML = '<h4>📊 Nation Comparison Chart</h4><p>Select two nations to compare:</p>' +
                '<div class="widget-config-row"><label>Nation 1:</label><select id="widget-nation-1" class="widget-select">' + nationOptions + '</select></div>' +
                '<div class="widget-config-row"><label>Nation 2:</label><select id="widget-nation-2" class="widget-select"><option value="">— Select —</option>' + nationOptions + '</select></div>';
            // Default nation 2 to something different
            var sel2 = document.getElementById('widget-nation-2');
            if (sel2 && sel2.options.length > 2) sel2.selectedIndex = 2;
            break;
        case 'pie-fleet':
            configBody.innerHTML = '<h4>🍩 Fleet Distribution</h4><p>Select a nation to display naval fleet composition:</p>' +
                '<div class="widget-config-row"><label>Nation:</label><select id="widget-nation-1" class="widget-select">' + nationOptions + '</select></div>';
            break;
        case 'force-table':
            configBody.innerHTML = '<h4>📋 Force Summary Table</h4><p>Select nations to compare (hold Ctrl to select multiple):</p>' +
                '<div class="widget-config-row"><label>Nations:</label><select id="widget-nations-multi" class="widget-select widget-multi-select" multiple size="8">' + nationOptions + '</select></div>' +
                '<div class="widget-config-hint">Hold Ctrl/Cmd + Click to select multiple</div>';
            break;
    }
}

function widgetConfigBack() {
    document.getElementById('widget-config-step').style.display = 'none';
    document.querySelector('.widget-modal-body').style.display = 'flex';
    pendingWidgetType = null;
}

function insertWidgetTag() {
    var ta = document.getElementById('notebook-content');
    if (!ta || !pendingWidgetType) return;

    var tag = '';
    switch (pendingWidgetType) {
        case 'comparison':
            var n1 = document.getElementById('widget-nation-1').value;
            var n2 = document.getElementById('widget-nation-2').value;
            if (!n1 || !n2) { showToast('Please select both nations', 'error'); return; }
            if (n1 === n2) { showToast('Please select two different nations', 'error'); return; }
            tag = '[widget:comparison|' + n1 + ',' + n2 + ']';
            break;
        case 'pie-fleet':
            var n = document.getElementById('widget-nation-1').value;
            if (!n) { showToast('Please select a nation', 'error'); return; }
            tag = '[widget:pie-fleet|' + n + ']';
            break;
        case 'force-table':
            var select = document.getElementById('widget-nations-multi');
            var selected = Array.from(select.selectedOptions).map(function (opt) { return opt.value; });
            if (selected.length === 0) { showToast('Please select at least one nation', 'error'); return; }
            tag = '[widget:force-table|' + selected.join(',') + ']';
            break;
    }

    // Insert at cursor
    var start = ta.selectionStart;
    var before = ta.value.substring(0, start);
    var after = ta.value.substring(ta.selectionEnd);
    ta.value = before + '\n' + tag + '\n' + after;
    ta.focus();
    var newPos = start + tag.length + 2;
    ta.setSelectionRange(newPos, newPos);

    closeWidgetInsertModal();
    updateNotebookPreview();
    showToast('Widget inserted ✓', 'success');
}

// ─── PDF Export ───
function exportReportPDF() {
    var preview = document.getElementById('notebook-preview');
    var title = document.getElementById('notebook-title').value || 'Untitled Report';
    if (!preview) return;

    // Create a print-specific window
    var printWin = window.open('', '_blank', 'width=900,height=700');
    printWin.document.write('<!DOCTYPE html><html><head><title>' + escapeHtml(title) + '</title>');
    printWin.document.write('<style>');
    printWin.document.write('* { margin: 0; padding: 0; box-sizing: border-box; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }');
    printWin.document.write('body { font-family: "Segoe UI", "Helvetica Neue", Arial, sans-serif; color: #1a1a2e; padding: 40px 60px; line-height: 1.7; background: #fff; }');
    printWin.document.write('h1 { font-size: 28px; margin-bottom: 8px; color: #0a0a1a; border-bottom: 3px solid #d4af37; padding-bottom: 12px; }');
    printWin.document.write('h2 { font-size: 22px; margin: 28px 0 10px; color: #16213e; border-bottom: 1px solid #ddd; padding-bottom: 6px; }');
    printWin.document.write('h3 { font-size: 18px; margin: 20px 0 8px; color: #1a1a2e; }');
    printWin.document.write('h4 { font-size: 15px; margin: 16px 0 6px; color: #333; }');
    printWin.document.write('p { margin: 8px 0; font-size: 14px; }');
    printWin.document.write('strong { color: #16213e; }');
    printWin.document.write('blockquote { border-left: 4px solid #d4af37; padding: 8px 16px; margin: 12px 0; background: #f9f6ed; color: #444; font-style: italic; }');
    printWin.document.write('pre { background: #f4f4f4; padding: 14px; border-radius: 6px; font-size: 12px; overflow-x: auto; margin: 12px 0; }');
    printWin.document.write('code { font-family: "Consolas", monospace; background: #f0f0f0; padding: 2px 5px; border-radius: 3px; font-size: 13px; }');
    printWin.document.write('pre code { background: none; padding: 0; }');
    printWin.document.write('hr { border: none; border-top: 2px solid #d4af37; margin: 24px 0; }');
    printWin.document.write('ul, ol { margin: 8px 0 8px 24px; font-size: 14px; }');
    printWin.document.write('li { margin: 4px 0; }');
    printWin.document.write('table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 13px; }');
    printWin.document.write('th { background: #16213e; color: #fff; padding: 10px 12px; text-align: left; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; }');
    printWin.document.write('td { padding: 8px 12px; border-bottom: 1px solid #e0e0e0; }');
    printWin.document.write('tr:nth-child(even) td { background: #f8f8f8; }');
    printWin.document.write('.nb-widget { border: 1px solid #ddd; border-radius: 8px; padding: 16px; margin: 16px 0; page-break-inside: avoid; background: rgba(0, 0, 0, 0.02); }');
    printWin.document.write('.nb-widget-header { font-weight: 700; font-size: 13px; margin-bottom: 12px; color: #16213e; }');
    printWin.document.write('.nb-widget-badge { background: #16213e; color: #d4af37; padding: 3px 8px; border-radius: 4px; font-size: 11px; margin-right: 8px; }');
    printWin.document.write('.nb-compare-nations { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; font-weight: 700; font-size: 15px; }');
    printWin.document.write('.nb-compare-vs { color: #999; font-size: 12px; }');
    printWin.document.write('.nb-compare-row { margin: 6px 0; }');
    printWin.document.write('.nb-compare-label { font-size: 12px; color: #666; margin-bottom: 2px; }');
    printWin.document.write('.nb-compare-bars { display: flex; gap: 4px; }');
    printWin.document.write('.nb-compare-bar-wrap { flex: 1; background: #f0f0f0; border: 1px solid #ddd; border-radius: 4px; height: 22px; position: relative; overflow: hidden; }');
    printWin.document.write('.nb-compare-bar { height: 100%; border-radius: 4px; min-width: 2px; }');
    printWin.document.write('.nb-compare-bar.left { background: #4a9eff; float: right; }');
    printWin.document.write('.nb-compare-bar.right { background: #ff6b6b; float: left; }');
    printWin.document.write('.nb-compare-val { position: absolute; top: 2px; font-size: 11px; font-weight: 600; color: #333; }');
    printWin.document.write('.nb-compare-bar-wrap.left .nb-compare-val { left: 8px; }');
    printWin.document.write('.nb-compare-bar-wrap.right .nb-compare-val { right: 8px; }');
    printWin.document.write('.nb-pie-layout { display: flex; align-items: center; gap: 24px; }');
    printWin.document.write('.nb-pie-chart { width: 120px; height: 120px; border-radius: 50%; flex-shrink: 0; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }');
    printWin.document.write('.nb-pie-legend-item { font-size: 13px; margin: 4px 0; }');
    printWin.document.write('.nb-pie-dot { display: inline-block; width: 10px; height: 10px; border-radius: 50%; margin-right: 6px; }');
    printWin.document.write('.print-header { text-align: center; margin-bottom: 30px; }');
    printWin.document.write('.print-header h1 { border-bottom: 3px solid #d4af37; display: inline-block; padding: 0 20px 8px; }');
    printWin.document.write('.print-footer { text-align: center; margin-top: 40px; padding-top: 16px; border-top: 1px solid #ddd; font-size: 11px; color: #888; }');
    printWin.document.write('.nb-table-label { font-weight: 600; color: #16213e; }');
    printWin.document.write('@media print { body { padding: 20px 40px; } }');
    printWin.document.write('</style></head><body>');
    printWin.document.write('<div class="print-header"><h1>' + escapeHtml(title) + '</h1>');
    printWin.document.write('<p style="color:#888; font-size:12px; margin-top:6px;">Global Military Intelligence — Defense Analyst Report • ' + new Date().toLocaleDateString() + '</p></div>');
    printWin.document.write(preview.innerHTML);
    printWin.document.write('<div class="print-footer">Generated by Global Military Intelligence (GMI) Defense Analysis Platform</div>');
    printWin.document.write('</body></html>');
    printWin.document.close();

    setTimeout(function () {
        printWin.print();
    }, 400);
}

function clearWatchlistCache() {
    watchlistCache = [];
    watchlistFilter = { type: null, id: null };
    refreshFollowButtons();
}

// ═══════════════════════════════════════════════
// COMMUNITY HUB — Public Reports
// ═══════════════════════════════════════════════

var communityPage = 1;
var communitySearchTimer = null;
var communityLoaded = false;

function debounceCommunitySearch() {
    clearTimeout(communitySearchTimer);
    communitySearchTimer = setTimeout(function () {
        loadCommunityReports(1);
    }, 350);
}

async function loadCommunityReports(page) {
    communityPage = page || 1;
    var grid = document.getElementById('community-grid');
    var pagination = document.getElementById('community-pagination');
    var reader = document.getElementById('community-reader');
    if (!grid) return;

    // Hide reader, show grid
    if (reader) reader.style.display = 'none';
    grid.style.display = '';
    if (pagination) pagination.style.display = '';

    // Show loading state
    grid.innerHTML = '<div class="community-loading">Loading public reports...</div>';
    if (pagination) pagination.style.display = 'none';

    var searchVal = '';
    var searchInput = document.getElementById('community-search');
    if (searchInput) searchVal = searchInput.value.trim();

    var sortVal = 'newest';
    var sortSelect = document.getElementById('community-sort');
    if (sortSelect) sortVal = sortSelect.value;

    var params = 'page=' + communityPage + '&limit=12&sort=' + sortVal;
    if (searchVal) params += '&search=' + encodeURIComponent(searchVal);

    try {
        var resp = await fetch('/api/reports/public?' + params);
        var data = await resp.json();

        if (!resp.ok) {
            grid.innerHTML = '<div class="community-empty"><div class="community-empty-icon">⚠️</div><h3>Failed to Load</h3><p>' + (data.error || 'Server error') + '</p></div>';
            return;
        }

        communityLoaded = true;
        renderCommunityGrid(data.reports || [], data.total || 0, data.page || 1, data.totalPages || 1);
    } catch (err) {
        console.error('Community load error:', err);
        grid.innerHTML = '<div class="community-empty"><div class="community-empty-icon">📡</div><h3>Connection Error</h3><p>Unable to reach the server. Please try again.</p></div>';
    }
}

function renderCommunityGrid(reports, total, page, totalPages) {
    var grid = document.getElementById('community-grid');
    var pagination = document.getElementById('community-pagination');
    if (!grid) return;

    if (reports.length === 0) {
        var searchVal = '';
        var searchInput = document.getElementById('community-search');
        if (searchInput) searchVal = searchInput.value.trim();

        if (searchVal) {
            grid.innerHTML = '<div class="community-empty"><div class="community-empty-icon">🔍</div><h3>No Results</h3><p>No public reports match "' + escapeHtml(searchVal) + '". Try a different search term.</p></div>';
        } else {
            grid.innerHTML = '<div class="community-empty"><div class="community-empty-icon">📋</div><h3>No Public Reports Yet</h3><p>Be the first to share your strategic analysis with the community! Toggle "Public" in the Analyst Notebook to publish a report.</p></div>';
        }
        if (pagination) pagination.style.display = 'none';
        return;
    }

    var html = '';
    reports.forEach(function (r) {
        var dateStr = new Date(r.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        var initials = (r.author || 'U').substring(0, 2).toUpperCase();
        var excerpt = r.excerpt || 'No content preview available.';

        html += '<div class="community-card" onclick="openCommunityReport(\'' + r._id + '\')">';
        html += '<div class="community-card-title">' + escapeHtml(r.title) + '</div>';
        html += '<div class="community-card-excerpt">' + escapeHtml(excerpt) + '</div>';
        html += '<div class="community-card-footer">';
        html += '<div class="community-card-author">';
        html += '<div class="community-card-author-avatar">' + initials + '</div>';
        html += escapeHtml(r.author);
        html += '</div>';
        html += '<div class="community-card-date">' + dateStr + '</div>';
        html += '</div>';
        html += '</div>';
    });
    grid.innerHTML = html;

    // Pagination
    if (pagination) {
        if (totalPages <= 1) {
            pagination.style.display = 'none';
        } else {
            pagination.style.display = '';
            var pagHtml = '';

            // Previous button
            pagHtml += '<button class="community-page-btn" onclick="loadCommunityReports(' + (page - 1) + ')" ' + (page <= 1 ? 'disabled' : '') + '>← Prev</button>';

            // Page numbers
            var startP = Math.max(1, page - 2);
            var endP = Math.min(totalPages, page + 2);

            if (startP > 1) {
                pagHtml += '<button class="community-page-btn" onclick="loadCommunityReports(1)">1</button>';
                if (startP > 2) pagHtml += '<span class="community-page-info">…</span>';
            }

            for (var i = startP; i <= endP; i++) {
                pagHtml += '<button class="community-page-btn' + (i === page ? ' active' : '') + '" onclick="loadCommunityReports(' + i + ')">' + i + '</button>';
            }

            if (endP < totalPages) {
                if (endP < totalPages - 1) pagHtml += '<span class="community-page-info">…</span>';
                pagHtml += '<button class="community-page-btn" onclick="loadCommunityReports(' + totalPages + ')">' + totalPages + '</button>';
            }

            // Next button
            pagHtml += '<button class="community-page-btn" onclick="loadCommunityReports(' + (page + 1) + ')" ' + (page >= totalPages ? 'disabled' : '') + '>Next →</button>';

            pagination.innerHTML = pagHtml;
        }
    }
}

async function openCommunityReport(id) {
    var grid = document.getElementById('community-grid');
    var pagination = document.getElementById('community-pagination');
    var reader = document.getElementById('community-reader');
    if (!reader) return;

    // Hide grid, show reader
    if (grid) grid.style.display = 'none';
    if (pagination) pagination.style.display = 'none';
    reader.style.display = '';

    // Loading state
    document.getElementById('community-reader-title').textContent = 'Loading...';
    document.getElementById('community-reader-meta').innerHTML = '';
    document.getElementById('community-reader-body').innerHTML = '<div class="community-loading">Fetching report...</div>';

    try {
        var resp = await fetch('/api/reports/public/' + id);
        var data = await resp.json();

        if (!resp.ok || !data.report) {
            document.getElementById('community-reader-title').textContent = 'Error';
            document.getElementById('community-reader-body').innerHTML = '<p style="color:var(--color-text-muted);">' + (data.error || 'Failed to load report.') + '</p>';
            return;
        }

        var r = data.report;
        document.getElementById('community-reader-title').textContent = r.title;

        var createdStr = new Date(r.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        var updatedStr = new Date(r.updatedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

        var metaHtml = '<span class="reader-author">';
        metaHtml += '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';
        metaHtml += escapeHtml(r.author);
        metaHtml += '</span>';
        metaHtml += '<span class="reader-date">';
        metaHtml += '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>';
        metaHtml += 'Published ' + createdStr;
        if (updatedStr !== createdStr) metaHtml += ' • Updated ' + updatedStr;
        metaHtml += '</span>';
        document.getElementById('community-reader-meta').innerHTML = metaHtml;

        // Render markdown content
        var bodyHtml = renderCommunityMarkdown(r.content || '');
        document.getElementById('community-reader-body').innerHTML = bodyHtml;
    } catch (err) {
        console.error('Community report load error:', err);
        document.getElementById('community-reader-title').textContent = 'Error';
        document.getElementById('community-reader-body').innerHTML = '<p style="color:var(--color-text-muted);">Unable to connect to server.</p>';
    }
}

function closeCommunityReader() {
    var grid = document.getElementById('community-grid');
    var pagination = document.getElementById('community-pagination');
    var reader = document.getElementById('community-reader');

    if (reader) reader.style.display = 'none';
    if (grid) grid.style.display = '';
    // Re-show pagination if there were multiple pages
    if (pagination && pagination.innerHTML.trim()) pagination.style.display = '';
}

function renderCommunityMarkdown(md) {
    if (!md) return '<p style="color:var(--color-text-muted);">This report has no content yet.</p>';

    // Basic markdown → HTML conversion
    var html = md;

    // Code blocks (fenced)
    html = html.replace(/```([\s\S]*?)```/g, function (m, code) {
        return '<pre><code>' + escapeHtml(code.trim()) + '</code></pre>';
    });

    // Headings
    html = html.replace(/^#### (.+)$/gm, '<h4>$1</h4>');
    html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

    // Bold & italic
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Blockquotes
    html = html.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>');

    // Horizontal rules
    html = html.replace(/^---$/gm, '<hr>');

    // Unordered lists
    html = html.replace(/^[\-\*] (.+)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

    // Paragraphs — wrap loose lines
    html = html.replace(/^(?!<[hupblo]|<\/|<li|<code|<pre|<blockquote|<hr)(.+)$/gm, '<p>$1</p>');

    // Clean up multiple newlines
    html = html.replace(/\n{2,}/g, '');

    return html;
}
