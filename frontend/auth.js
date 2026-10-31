// ============================================
// AUTH SYSTEM - Global Military Intelligence
// ============================================
const AUTH_API = '/api/auth';

// Toast Notifications
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<span class="toast-icon">${type === 'success' ? '\u2705' : '\u274C'}</span><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('toast-out');
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

// Modal Functions
function openLoginModal() {
    const modal = document.getElementById('auth-login-modal');
    if (modal) {
        modal.classList.add('active');
        showRoleSelect();
        document.body.style.overflow = 'hidden';
    }
}

function closeLoginModal() {
    const modal = document.getElementById('auth-login-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        const form = document.getElementById('login-form');
        if (form) form.reset();
    }
}

function openSignupModal() {
    const modal = document.getElementById('auth-signup-modal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeSignupModal() {
    const modal = document.getElementById('auth-signup-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        const form = document.getElementById('signup-form');
        if (form) form.reset();
    }
}

function showRoleSelect() {
    const roleSelect = document.getElementById('auth-role-select');
    const loginForm = document.getElementById('auth-login-form');
    if (roleSelect) roleSelect.style.display = '';
    if (loginForm) loginForm.style.display = 'none';
}

function showLoginForm(role) {
    const roleSelect = document.getElementById('auth-role-select');
    const loginForm = document.getElementById('auth-login-form');
    const loginRole = document.getElementById('login-role');
    const loginTitle = document.getElementById('login-form-title');
    const switchText = document.getElementById('login-switch-text');

    if (roleSelect) roleSelect.style.display = 'none';
    if (loginForm) loginForm.style.display = '';
    if (loginRole) loginRole.value = role;
    if (loginTitle) loginTitle.textContent = role === 'admin' ? 'Admin Login' : 'User Login';
    if (switchText) switchText.style.display = role === 'admin' ? 'none' : '';
}

// User Dropdown
function toggleUserDropdown(e) {
    if (e && e.stopPropagation) e.stopPropagation();
    const menu = document.getElementById('auth-user-menu');
    if (menu) menu.classList.toggle('open');
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    const menu = document.getElementById('auth-user-menu');
    if (menu && !menu.contains(e.target)) {
        menu.classList.remove('open');
    }
});

// Handle Login
async function handleLogin(e) {
    e.preventDefault();
    const role = document.getElementById('login-role').value;
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;
    const submitBtn = document.getElementById('login-submit-btn');
    const spinner = submitBtn.querySelector('.auth-btn-spinner');
    const btnText = submitBtn.querySelector('span');

    submitBtn.disabled = true;
    spinner.style.display = '';
    btnText.textContent = 'Logging in...';

    try {
        const res = await fetch(`${AUTH_API}/${role}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await res.json();

        if (!res.ok) {
            showToast(data.error || 'Login failed.', 'error');
            return;
        }

        localStorage.setItem('gmi_token', data.token);
        localStorage.setItem('gmi_user', JSON.stringify(data.user));
        updateAuthUI(data.user);
        closeLoginModal();
        showToast(`Welcome back, ${data.user.displayName || data.user.username}!`);
        if (typeof loadWatchlist === 'function') loadWatchlist();
    } catch (err) {
        showToast('Connection error. Is the server running?', 'error');
    } finally {
        submitBtn.disabled = false;
        spinner.style.display = 'none';
        btnText.textContent = 'Login';
    }
}

// Handle Signup
async function handleSignup(e) {
    e.preventDefault();
    const username = document.getElementById('signup-username').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;
    const submitBtn = document.getElementById('signup-submit-btn');
    const spinner = submitBtn.querySelector('.auth-btn-spinner');
    const btnText = submitBtn.querySelector('span');

    submitBtn.disabled = true;
    spinner.style.display = '';
    btnText.textContent = 'Creating account...';

    try {
        const res = await fetch(`${AUTH_API}/user/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });
        const data = await res.json();

        if (!res.ok) {
            showToast(data.error || 'Registration failed.', 'error');
            return;
        }

        localStorage.setItem('gmi_token', data.token);
        localStorage.setItem('gmi_user', JSON.stringify(data.user));
        updateAuthUI(data.user);
        closeSignupModal();
        showToast(`Welcome to GMI, ${data.user.username}!`);
        if (typeof loadWatchlist === 'function') loadWatchlist();
    } catch (err) {
        showToast('Connection error. Is the server running?', 'error');
    } finally {
        submitBtn.disabled = false;
        spinner.style.display = 'none';
        btnText.textContent = 'Create Account';
    }
}

// Logout
function logoutUser() {
    localStorage.removeItem('gmi_token');
    localStorage.removeItem('gmi_user');
    updateAuthUI(null);
    if (typeof clearWatchlistCache === 'function') clearWatchlistCache();
    const menu = document.getElementById('auth-user-menu');
    if (menu) menu.classList.remove('open');
    showToast('You have been logged out.');
}

// Update header UI based on auth state
function updateAuthUI(user) {
    const guestBtns = document.getElementById('auth-buttons-guest');
    const userMenu = document.getElementById('auth-user-menu');
    const avatar = document.getElementById('auth-avatar');
    const usernameEl = document.getElementById('auth-username');
    const dropdownName = document.getElementById('auth-dropdown-name');
    const dropdownRole = document.getElementById('auth-dropdown-role');
    const adminDropdownBtn = document.getElementById('auth-dropdown-admin');
    const adminTabBtn = document.getElementById('admin-tab-btn');
    const authAdminDivider = document.getElementById('auth-admin-divider');
    const profileAdminShortcut = document.getElementById('profile-admin-shortcut-btn');
    const profileTabAdmin = document.getElementById('profile-tab-admin-btn');
    const profileAdminBanner = document.getElementById('profile-admin-banner');

    if (user) {
        if (guestBtns) guestBtns.style.display = 'none';
        if (userMenu) userMenu.style.display = '';
        const initial = (user.displayName || user.username || 'U').charAt(0).toUpperCase();
        if (avatar) avatar.textContent = initial;
        if (usernameEl) usernameEl.textContent = user.displayName || user.username;
        if (dropdownName) dropdownName.textContent = user.displayName || user.username;

        const roleStr = (user.role || 'user').toString().trim().toLowerCase();
        const isAdmin = roleStr === 'admin';

        if (dropdownRole) {
            dropdownRole.textContent = isAdmin ? 'Admin' : 'User';
            dropdownRole.style.background = isAdmin ? 'rgba(212, 175, 55, 0.15)' : 'rgba(59, 130, 246, 0.15)';
            dropdownRole.style.borderColor = isAdmin ? 'rgba(212, 175, 55, 0.3)' : 'rgba(59, 130, 246, 0.3)';
            dropdownRole.style.color = isAdmin ? '#d4af37' : '#3b82f6';
        }

        // Show/hide admin-only elements
        if (authAdminDivider) authAdminDivider.style.display = isAdmin ? 'block' : 'none';
        if (adminDropdownBtn) adminDropdownBtn.style.display = isAdmin ? 'flex' : 'none';
        if (adminTabBtn) adminTabBtn.style.display = isAdmin ? 'inline-flex' : 'none';
        if (profileAdminShortcut) profileAdminShortcut.style.display = isAdmin ? 'inline-flex' : 'none';
        if (profileTabAdmin) profileTabAdmin.style.display = isAdmin ? 'inline-flex' : 'none';
        if (profileAdminBanner) profileAdminBanner.style.display = isAdmin ? 'flex' : 'none';
    } else {
        if (guestBtns) guestBtns.style.display = '';
        if (userMenu) userMenu.style.display = 'none';
        if (authAdminDivider) authAdminDivider.style.display = 'none';
        if (adminDropdownBtn) adminDropdownBtn.style.display = 'none';
        if (adminTabBtn) adminTabBtn.style.display = 'none';
        if (profileAdminShortcut) profileAdminShortcut.style.display = 'none';
        if (profileTabAdmin) profileTabAdmin.style.display = 'none';
        if (profileAdminBanner) profileAdminBanner.style.display = 'none';
    }
}

// ============================================
// PROFILE MODAL & DEFENSE ANALYST COMMAND DASHBOARD SYSTEM
// ============================================

let dashZuluTimer = null;
let currentDashWatchlistFilter = 'all';
let userBriefingsCache = [];
let audioCtxInstance = null;

// Sound synthesizer disabled for clean professional interface
function playTacticalSound() {}

// Show Profile / Analyst Dashboard
function showProfile(targetTab = 'overview') {
    const menu = document.getElementById('auth-user-menu');
    if (menu) menu.classList.remove('open');
    openProfileModal(targetTab);
}

// Open Command Dashboard Modal
function openProfileModal(targetTab = 'overview') {
    const modal = document.getElementById('auth-profile-modal');
    if (!modal) return;

    // Map legacy alias tabs if passed
    if (targetTab === 'info') targetTab = 'overview';
    if (targetTab === 'edit') targetTab = 'dossier';

    // Activate Dashboard Window
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Switch to target tab
    switchProfileTab(targetTab);

    // Initialize Preferences & Tactical Theme
    initPreferencesUI();

    // Start Live Zulu Clock
    startDashZuluClock();

    // Play subtle tactical audio chime
    

    // Fetch fresh profile data and render workspace
    fetchProfileData();

    // Render components
    renderUserOverviewTelemetry();
    renderUserWatchlistTab();
    renderUserBriefingsTab();
}

// Close Command Dashboard Modal
function closeProfileModal() {
    const modal = document.getElementById('auth-profile-modal');
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';

    // Stop Zulu Clock Timer
    if (dashZuluTimer) {
        clearInterval(dashZuluTimer);
        dashZuluTimer = null;
    }

    // Reset password form
    const pwForm = document.getElementById('profile-password-form');
    if (pwForm) pwForm.reset();
    const meterFill = document.getElementById('dash-pw-bar-fill');
    if (meterFill) meterFill.style.width = '0%';
    const meterLabel = document.getElementById('dash-pw-strength-label');
    if (meterLabel) meterLabel.textContent = 'Password strength: None';
}

// Global Keyboard Shortcut: Esc to close modal
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const modal = document.getElementById('auth-profile-modal');
        if (modal && modal.classList.contains('active')) {
            closeProfileModal();
        }
    }
});

// Live Military Zulu Clock
function startDashZuluClock() {
    if (dashZuluTimer) clearInterval(dashZuluTimer);
    const updateTime = () => {
        const clockEl = document.getElementById('dash-zulu-clock-text');
        if (!clockEl) return;
        const now = new Date();
        const hrs = String(now.getUTCHours()).padStart(2, '0');
        const mins = String(now.getUTCMinutes()).padStart(2, '0');
        const secs = String(now.getUTCSeconds()).padStart(2, '0');
        clockEl.textContent = `${hrs}:${mins}:${secs} UTC`;
    };
    updateTime();
    dashZuluTimer = setInterval(updateTime, 1000);
}

// Switch Dashboard Navigation Tabs
function switchProfileTab(tabName) {
    // Alias mappings
    if (tabName === 'info') tabName = 'overview';
    if (tabName === 'edit') tabName = 'dossier';

    // Update Tab Buttons
    document.querySelectorAll('.profile-tab').forEach(btn => {
        const btnTab = btn.dataset.profileTab;
        const isMatch = (btnTab === tabName) || 
                        (tabName === 'overview' && btnTab === 'info') ||
                        (tabName === 'dossier' && btnTab === 'edit');
        btn.classList.toggle('active', isMatch);
    });

    // Update Content Panes
    document.querySelectorAll('.profile-tab-content').forEach(content => {
        content.classList.remove('active');
    });

    let target = document.getElementById(`profile-tab-${tabName}`);
    if (!target) {
        if (tabName === 'overview') target = document.getElementById('profile-tab-info');
        if (tabName === 'dossier') target = document.getElementById('profile-tab-edit');
    }
    if (target) target.classList.add('active');

    // Trigger specific tab refreshes
    if (tabName === 'overview') {
        renderUserOverviewTelemetry();
    } else if (tabName === 'watchlist') {
        renderUserWatchlistTab();
    } else if (tabName === 'briefings') {
        renderUserBriefingsTab();
    }

    // Play subtle tap sound
    
}

// Fetch Profile Data from API
async function fetchProfileData() {
    const token = localStorage.getItem('gmi_token');
    const user = JSON.parse(localStorage.getItem('gmi_user') || 'null');
    if (!token || !user) return;

    try {
        const res = await fetch(`${AUTH_API}/profile`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!res.ok) {
            populateProfileUI(user);
            return;
        }

        const data = await res.json();
        populateProfileUI(data);
    } catch (err) {
        console.error('Failed to fetch profile:', err);
        populateProfileUI(user);
    }
}

// Populate Dashboard UI Elements
function populateProfileUI(data) {
    if (!data) return;

    // Avatar
    const avatarEl = document.getElementById('profile-avatar-lg');
    const cardAvatar = document.getElementById('dossier-card-avatar');
    const initial = (data.displayName || data.username || 'U').charAt(0).toUpperCase();
    if (avatarEl) avatarEl.textContent = initial;
    if (cardAvatar) cardAvatar.textContent = initial;

    // Title & Display Name
    const titleEl = document.getElementById('profile-display-title');
    const cardName = document.getElementById('dossier-card-name');
    const dispName = data.displayName || data.username || 'Analyst';
    if (titleEl) titleEl.textContent = dispName;
    if (cardName) cardName.textContent = dispName.toUpperCase();

    // Role & Clearance State
    const roleStr = (data.role || 'user').toString().trim().toLowerCase();
    const isAdmin = roleStr === 'admin';
    const badgeEl = document.getElementById('profile-role-badge');
    const clearanceLabel = document.getElementById('profile-clearance-label');
    const cardRole = document.getElementById('dossier-card-role');

    if (badgeEl) {
        badgeEl.textContent = isAdmin ? 'ADMINISTRATOR' : 'ANALYST';
        badgeEl.style.color = isAdmin ? '#d4af37' : '#38bdf8';
        badgeEl.style.borderColor = isAdmin ? 'rgba(212, 175, 55, 0.4)' : 'rgba(56, 189, 248, 0.35)';
        badgeEl.style.background = isAdmin ? 'rgba(212, 175, 55, 0.15)' : 'rgba(56, 189, 248, 0.12)';
    }
    if (clearanceLabel) {
        clearanceLabel.textContent = isAdmin ? 'SYSTEM ADMINISTRATOR' : 'VERIFIED ANALYST';
    }
    if (cardRole) {
        cardRole.textContent = isAdmin ? 'System Administrator' : 'Verified Analyst';
    }

    // Specialty & Regional Focus
    const specialtyVal = data.specialty || 'Strategic Defense Intelligence';
    const regionVal = data.regionalFocus || 'Global Theater';
    const specChip = document.getElementById('profile-specialty-chip');
    const regChip = document.getElementById('profile-region-chip');
    const cardSpec = document.getElementById('dossier-card-specialty');
    const cardRegion = document.getElementById('dossier-card-region');
    const editSpec = document.getElementById('profile-edit-specialty');
    const editRegion = document.getElementById('profile-edit-region');
    const editBio = document.getElementById('profile-edit-bio');

    if (specChip) specChip.textContent = specialtyVal;
    if (regChip) regChip.textContent = regionVal;
    if (cardSpec) cardSpec.textContent = specialtyVal;
    if (cardRegion) cardRegion.textContent = regionVal;
    if (editSpec) editSpec.value = specialtyVal;
    if (editRegion) editRegion.value = regionVal;
    if (editBio && data.bio !== undefined) editBio.value = data.bio || '';

    // Standard Info Items
    const setInfo = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.textContent = value || '—';
    };

    setInfo('profile-info-username', data.username);
    setInfo('profile-info-email', data.email);
    setInfo('profile-info-role', isAdmin ? 'System Administrator' : 'Defense Analyst');

    // Dates
    if (data.createdAt) {
        const joined = new Date(data.createdAt);
        setInfo('profile-info-joined', joined.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
    }
    if (data.lastLogin) {
        const lastLogin = new Date(data.lastLogin);
        const now = new Date();
        const diffMs = now - lastLogin;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        let lastLoginText;
        if (diffMins < 1) lastLoginText = 'Just now';
        else if (diffMins < 60) lastLoginText = `${diffMins} min ago`;
        else if (diffHours < 24) lastLoginText = `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        else if (diffDays < 7) lastLoginText = `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        else lastLoginText = lastLogin.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

        setInfo('profile-info-lastlogin', lastLoginText);
    }

    // Pre-fill Edit Display Name
    const displayNameInput = document.getElementById('profile-edit-displayname');
    if (displayNameInput) displayNameInput.value = data.displayName || '';

    // Admin Shortcuts & Banners
    const profileAdminShortcut = document.getElementById('profile-admin-shortcut-btn');
    const profileTabAdmin = document.getElementById('profile-tab-admin-btn');
    const profileAdminBanner = document.getElementById('profile-admin-banner');
    if (profileAdminShortcut) profileAdminShortcut.style.display = isAdmin ? 'inline-flex' : 'none';
    if (profileTabAdmin) profileTabAdmin.style.display = isAdmin ? 'inline-flex' : 'none';
    if (profileAdminBanner) profileAdminBanner.style.display = isAdmin ? 'flex' : 'none';

    // Render Overview Telemetry
    renderUserOverviewTelemetry();
}

// Render Mission Overview Telemetry
function renderUserOverviewTelemetry() {
    const list = (typeof watchlistCache !== 'undefined' && Array.isArray(watchlistCache)) ? watchlistCache : [];
    const nations = list.filter(item => item.targetType === 'nation');
    const conflicts = list.filter(item => item.targetType === 'conflict');

    // Update Metric Badges
    const nEl = document.getElementById('dash-metric-nations');
    const cEl = document.getElementById('dash-metric-conflicts');
    const rEl = document.getElementById('dash-metric-reports');
    const totalWlEl = document.getElementById('dash-metric-total-wl');
    const totalWlInfoEl = document.getElementById('profile-info-watchlist');
    const badgeWl = document.getElementById('dash-badge-watchlist');
    const tabWl = document.getElementById('dash-tab-watchlist-count');

    if (nEl) nEl.textContent = nations.length;
    if (cEl) cEl.textContent = conflicts.length;
    if (totalWlEl) totalWlEl.textContent = list.length;
    if (totalWlInfoEl) totalWlInfoEl.textContent = list.length;
    if (badgeWl) badgeWl.textContent = list.length;
    if (tabWl) tabWl.textContent = list.length;

    // Populate Radar List
    const radarContainer = document.getElementById('dash-overview-radar-list');
    if (radarContainer) {
        if (nations.length === 0 && conflicts.length === 0) {
            radarContainer.innerHTML = `
                <div class="gmi-dash-radar-empty">
                    <div class="gmi-radar-empty-icon">📡</div>
                    <div class="gmi-radar-empty-title">No Targets Monitored</div>
                    <div class="gmi-radar-empty-desc">Quick-deploy superpowers or frontline hotspots to your active intelligence radar:</div>
                    <div class="gmi-quick-deploy-strip">
                        <button class="gmi-deploy-btn" onclick="quickAddSuperpower('USA')">+ 🇺🇸 USA</button>
                        <button class="gmi-deploy-btn" onclick="quickAddSuperpower('Russia')">+ 🇷🇺 Russia</button>
                        <button class="gmi-deploy-btn" onclick="quickAddSuperpower('China')">+ 🇨🇳 China</button>
                        <button class="gmi-deploy-btn" onclick="quickAddSuperpower('India')">+ 🇮🇳 India</button>
                        <button class="gmi-deploy-btn" onclick="quickAddSuperpower('UK')">+ 🇬🇧 UK</button>
                    </div>
                </div>
            `;
        } else {
            let html = '';
            // Display top 4 nations followed
            nations.slice(0, 4).forEach(item => {
                const nData = (typeof nationsData !== 'undefined') ? nationsData[item.targetId] : null;
                const flag = nData ? nData.flag : '🌐';
                const name = nData ? nData.name : item.targetId;
                const rank = nData ? `Rank #${nData.rank}` : 'Target';
                const budget = nData ? nData.budget : '—';
                const troops = nData && nData.personnel ? (nData.personnel.active ? nData.personnel.active.toLocaleString() : '—') : '—';

                html += `
                    <div class="gmi-dash-radar-card">
                        <div class="gmi-radar-meta">
                            <span class="gmi-radar-flag">${flag}</span>
                            <div class="gmi-radar-details">
                                <div class="gmi-radar-name-row">
                                    <span class="gmi-radar-name">${name}</span>
                                    <span class="gmi-radar-rank-pill">${rank}</span>
                                </div>
                                <div class="gmi-radar-submeta">
                                    <span>Budget: ${budget}</span>
                                    <span>•</span>
                                    <span>Active: ${troops}</span>
                                </div>
                            </div>
                        </div>
                        <div class="gmi-radar-actions">
                            <button class="gmi-radar-inspect-btn" onclick="closeProfileModal(); if(typeof openNationModal==='function') openNationModal('${item.targetId}');">Inspect →</button>
                        </div>
                    </div>
                `;
            });

            // Display conflicts followed
            conflicts.slice(0, 2).forEach(item => {
                html += `
                    <div class="gmi-dash-radar-card" style="border-left: 3px solid #ef4444;">
                        <div class="gmi-radar-meta">
                            <span class="gmi-radar-flag">⚔️</span>
                            <div class="gmi-radar-details">
                                <div class="gmi-radar-name-row">
                                    <span class="gmi-radar-name">${item.targetId}</span>
                                    <span class="gmi-radar-rank-pill" style="color:#ef4444;background:rgba(239,68,68,0.15);border-color:rgba(239,68,68,0.3);">COMBAT ZONE</span>
                                </div>
                                <div class="gmi-radar-submeta">
                                    <span>Active Conflict Theater</span>
                                </div>
                            </div>
                        </div>
                        <div class="gmi-radar-actions">
                            <button class="gmi-radar-inspect-btn" onclick="closeProfileModal(); showPage('conflicts');">Theater →</button>
                        </div>
                    </div>
                `;
            });

            radarContainer.innerHTML = html;
        }
    }

    // Populate Personalized Intel Preview
    const intelContainer = document.getElementById('dash-overview-intel-list');
    if (intelContainer) {
        if (typeof newsData !== 'undefined' && Array.isArray(newsData) && newsData.length > 0) {
            let stories = [];
            // Match against followed nations
            nations.forEach(n => {
                const kw = String(n.targetId).toLowerCase();
                const matched = newsData.filter(art => (art.title || '').toLowerCase().includes(kw));
                stories = stories.concat(matched);
            });
            if (stories.length === 0) {
                stories = newsData.slice(0, 3);
            } else {
                stories = stories.slice(0, 3);
            }

            let intelHtml = '';
            stories.forEach(art => {
                intelHtml += `
                    <div class="gmi-dash-intel-item" onclick="closeProfileModal(); showPage('news');">
                        <div class="gmi-intel-item-top">
                            <span class="gmi-intel-item-tag">${art.category || 'DEFENSE INTEL'}</span>
                            <span class="gmi-intel-item-time">${art.date || 'Recent Wire'}</span>
                        </div>
                        <div class="gmi-intel-item-title">${art.title || ''}</div>
                    </div>
                `;
            });
            intelContainer.innerHTML = intelHtml;
        } else {
            intelContainer.innerHTML = '<div style="color:#64748b;font-size:0.8rem;padding:8px 0;">Strategic wire feed synchronizing...</div>';
        }
    }
}

// 1-Click Quick Deploy Superpowers to Watchlist
async function quickAddSuperpower(nationKey) {
    if (typeof toggleWatchlistItem === 'function') {
        await toggleWatchlistItem('nation', nationKey);
        
        renderUserOverviewTelemetry();
        renderUserWatchlistTab();
    }
}

// Render Intel Watchlist Tab
function renderUserWatchlistTab() {
    const list = (typeof watchlistCache !== 'undefined' && Array.isArray(watchlistCache)) ? watchlistCache : [];
    const nations = list.filter(item => item.targetType === 'nation');
    const conflicts = list.filter(item => item.targetType === 'conflict');

    // Update Counts
    const cAll = document.getElementById('dash-wl-count-all');
    const cNat = document.getElementById('dash-wl-count-nations');
    const cConf = document.getElementById('dash-wl-count-conflicts');
    if (cAll) cAll.textContent = list.length;
    if (cNat) cNat.textContent = nations.length;
    if (cConf) cConf.textContent = conflicts.length;

    // Populate Quick Add Select dropdown if empty
    populateWatchlistSelectOptions();

    // Filter items
    let filtered = list;
    if (currentDashWatchlistFilter === 'nation') filtered = nations;
    if (currentDashWatchlistFilter === 'conflict') filtered = conflicts;

    const grid = document.getElementById('dash-watchlist-items-grid');
    if (!grid) return;

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px 20px; background: rgba(255,255,255,0.02); border: 1px dashed rgba(255,255,255,0.1); border-radius: 12px;">
                <div style="font-size: 2.2rem; margin-bottom: 10px;">🌐</div>
                <h4 style="font-family: var(--font-display); font-size: 1.15rem; color: #ffffff; margin-bottom: 6px;">No Monitored Targets in Filter</h4>
                <p style="color: #94a3b8; font-size: 0.85rem; max-width: 440px; margin: 0 auto 16px;">
                    Lock nations or combat theaters using the "+ Lock Target to Radar" dropdown above or browse the interactive world map.
                </p>
                <button class="gmi-btn-gold" onclick="closeProfileModal(); scrollToMap();" style="padding: 8px 18px; font-size: 0.82rem;">
                    Browse Interactive World Map →
                </button>
            </div>
        `;
        return;
    }

    let cardsHtml = '';
    filtered.forEach(item => {
        if (item.targetType === 'nation') {
            const nData = (typeof nationsData !== 'undefined') ? nationsData[item.targetId] : null;
            const flag = nData ? nData.flag : '🌐';
            const name = nData ? nData.name : item.targetId;
            const rank = nData ? `Rank #${nData.rank}` : 'Target';
            const budget = nData ? nData.budget : '—';
            const troops = nData && nData.personnel ? (nData.personnel.active ? (nData.personnel.active / 1000).toFixed(0) + 'K' : '—') : '—';
            const tanks = nData && nData.army ? (nData.army.tanks ? nData.army.tanks.toLocaleString() : '—') : '—';
            const aircraft = nData && nData.airforce ? (nData.airforce.fighters ? nData.airforce.fighters.toLocaleString() : '—') : '—';
            const nuclear = nData && nData.nuclear && nData.nuclear.status ? `☢️ ${nData.nuclear.warheads || 'Active'}` : 'Non-Nuclear';

            cardsHtml += `
                <div class="gmi-wl-card">
                    <div class="gmi-wl-card-top">
                        <div class="gmi-wl-identity">
                            <span class="gmi-wl-flag">${flag}</span>
                            <div class="gmi-wl-name-col">
                                <span class="gmi-wl-title">${name}</span>
                                <span class="gmi-wl-badge">${rank} • Defense Budget: ${budget}</span>
                            </div>
                        </div>
                    </div>
                    <div class="gmi-wl-stats-grid">
                        <div class="gmi-wl-stat-cell">
                            <span class="gmi-wl-stat-lbl">TROOPS</span>
                            <span class="gmi-wl-stat-val">${troops}</span>
                        </div>
                        <div class="gmi-wl-stat-cell">
                            <span class="gmi-wl-stat-lbl">TANKS</span>
                            <span class="gmi-wl-stat-val">${tanks}</span>
                        </div>
                        <div class="gmi-wl-stat-cell">
                            <span class="gmi-wl-stat-lbl">AIRCRAFT</span>
                            <span class="gmi-wl-stat-val">${aircraft}</span>
                        </div>
                    </div>
                    <div class="gmi-wl-actions-strip">
                        <button class="gmi-wl-btn-inspect" onclick="closeProfileModal(); if(typeof openNationModal==='function') openNationModal('${item.targetId}');">Inspect Nation Dossier →</button>
                        <button class="gmi-wl-btn-remove" onclick="removeWatchlistFromDash('nation', '${item.targetId}')" title="Remove from Watchlist">✕ Remove</button>
                    </div>
                </div>
            `;
        } else {
            cardsHtml += `
                <div class="gmi-wl-card" style="border-left: 3px solid #ef4444;">
                    <div class="gmi-wl-card-top">
                        <div class="gmi-wl-identity">
                            <span class="gmi-wl-flag">⚔️</span>
                            <div class="gmi-wl-name-col">
                                <span class="gmi-wl-title">${item.targetId}</span>
                                <span class="gmi-wl-badge" style="color:#f87171;">ACTIVE CONFLICT THEATER</span>
                            </div>
                        </div>
                    </div>
                    <div style="font-size:0.8rem; color:#94a3b8; line-height:1.4; padding: 4px 0;">
                        Real-time battlefront analysis, territorial control updates, and casualty statistics monitored around the clock.
                    </div>
                    <div class="gmi-wl-actions-strip">
                        <button class="gmi-wl-btn-inspect" onclick="closeProfileModal(); showPage('conflicts');">View Theater Report →</button>
                        <button class="gmi-wl-btn-remove" onclick="removeWatchlistFromDash('conflict', '${item.targetId}')" title="Remove from Watchlist">✕ Remove</button>
                    </div>
                </div>
            `;
        }
    });

    grid.innerHTML = cardsHtml;
}

// Populate Watchlist Add Dropdown Options
function populateWatchlistSelectOptions() {
    const spGroup = document.getElementById('dash-add-superpowers');
    const natGroup = document.getElementById('dash-add-nations');
    const confGroup = document.getElementById('dash-add-conflicts');

    if (spGroup && spGroup.children.length === 0 && typeof nationsData !== 'undefined') {
        const superpowers = ['USA', 'Russia', 'China', 'India', 'UK', 'France'];
        superpowers.forEach(k => {
            if (nationsData[k]) {
                const opt = document.createElement('option');
                opt.value = `nation:${k}`;
                opt.textContent = `${nationsData[k].flag} ${nationsData[k].name} (Rank #${nationsData[k].rank})`;
                spGroup.appendChild(opt);
            }
        });
    }

    if (natGroup && natGroup.children.length === 0 && typeof nationsData !== 'undefined') {
        const superpowers = ['USA', 'Russia', 'China', 'India', 'UK', 'France'];
        Object.keys(nationsData).sort().forEach(k => {
            if (!superpowers.includes(k)) {
                const opt = document.createElement('option');
                opt.value = `nation:${k}`;
                opt.textContent = `${nationsData[k].flag || ''} ${nationsData[k].name}`;
                natGroup.appendChild(opt);
            }
        });
    }

    if (confGroup && confGroup.children.length === 0) {
        const sampleConflicts = ['Russia-Ukraine War', 'Israel-Hamas Conflict', 'Taiwan Strait Tension', 'Red Sea Maritime Crisis', 'Korean Peninsula Confrontation'];
        sampleConflicts.forEach(c => {
            const opt = document.createElement('option');
            opt.value = `conflict:${c}`;
            opt.textContent = `⚔️ ${c}`;
            confGroup.appendChild(opt);
        });
    }
}

// Filter Watchlist tab
function filterDashWatchlist(type) {
    currentDashWatchlistFilter = type;
    document.querySelectorAll('.gmi-filter-chip').forEach(chip => {
        chip.classList.toggle('active', chip.dataset.filter === type);
    });
    renderUserWatchlistTab();
}

// Quick Add from Watchlist Select Dropdown
async function handleDashWatchlistQuickAdd(selectEl) {
    const val = selectEl.value;
    if (!val) return;
    const [targetType, targetId] = val.split(':');
    if (targetType && targetId && typeof toggleWatchlistItem === 'function') {
        await toggleWatchlistItem(targetType, targetId);
        
        selectEl.selectedIndex = 0;
        renderUserWatchlistTab();
        renderUserOverviewTelemetry();
    }
}

// Remove item from Watchlist directly inside dashboard
async function removeWatchlistFromDash(targetType, targetId) {
    if (typeof toggleWatchlistItem === 'function') {
        await toggleWatchlistItem(targetType, targetId);
        
        renderUserWatchlistTab();
        renderUserOverviewTelemetry();
    }
}

// Render Strategic Briefings Tab
async function renderUserBriefingsTab() {
    const token = localStorage.getItem('gmi_token');
    const container = document.getElementById('dash-briefings-list');
    if (!token || !container) return;

    try {
        const res = await fetch('/api/reports', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to load reports');
        const data = await res.json();
        userBriefingsCache = data.reports || [];

        const total = userBriefingsCache.length;
        const pub = userBriefingsCache.filter(r => r.isPublic).length;
        const priv = total - pub;

        const totEl = document.getElementById('dash-briefs-total');
        const pubEl = document.getElementById('dash-briefs-public');
        const privEl = document.getElementById('dash-briefs-private');
        const badgeRep = document.getElementById('dash-badge-reports');
        const tabRep = document.getElementById('dash-tab-reports-count');
        const metricRep = document.getElementById('dash-metric-reports');

        if (totEl) totEl.textContent = total;
        if (pubEl) pubEl.textContent = pub;
        if (privEl) privEl.textContent = priv;
        if (badgeRep) badgeRep.textContent = total;
        if (tabRep) tabRep.textContent = total;
        if (metricRep) metricRep.textContent = total;

        if (userBriefingsCache.length === 0) {
            container.innerHTML = `
                <div style="text-align:center; padding: 40px 20px; background: rgba(255,255,255,0.02); border: 1px dashed rgba(255,255,255,0.1); border-radius: 12px;">
                    <div style="font-size: 2.2rem; margin-bottom: 10px;">📝</div>
                    <h4 style="font-family: var(--font-display); font-size: 1.15rem; color: #ffffff; margin-bottom: 6px;">No Strategic Reports Authored Yet</h4>
                    <p style="color: #94a3b8; font-size: 0.85rem; max-width: 440px; margin: 0 auto 16px;">
                        Use the Defense Analyst Notebook to draft intelligence reports embedded with live database comparison charts and fleet statistics.
                    </p>
                    <button class="gmi-btn-gold" onclick="closeProfileModal(); openWatchlistDashboard(); switchDashboardTab('notebook'); if(typeof createNewReport==='function') createNewReport();">
                        + Initialize First Intelligence Report
                    </button>
                </div>
            `;
            return;
        }

        let html = '';
        userBriefingsCache.forEach(report => {
            const dateStr = report.updatedAt ? new Date(report.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
            const badgeClass = report.isPublic ? 'gmi-badge-public' : 'gmi-badge-private';
            const badgeLabel = report.isPublic ? 'PUBLIC INTEL' : 'CLASSIFIED DRAFT';

            html += `
                <div class="gmi-briefing-card">
                    <div class="gmi-briefing-info">
                        <div class="gmi-briefing-title-row">
                            <span class="gmi-briefing-title">${report.title || 'Untitled Strategic Analysis'}</span>
                            <span class="gmi-briefing-badge ${badgeClass}">${badgeLabel}</span>
                        </div>
                        <div style="font-size:0.72rem; color:#64748b;">Last Updated: ${dateStr}</div>
                    </div>
                    <div class="gmi-briefing-actions">
                        <button class="gmi-brief-act-btn" onclick="openReportInNotebook('${report._id}')">Edit in Notebook →</button>
                    </div>
                </div>
            `;
        });
        container.innerHTML = html;

    } catch (e) {
        container.innerHTML = '<div style="color:#ef4444;font-size:0.85rem;padding:12px;">Unable to fetch user briefings.</div>';
    }
}

// Open existing report directly in notebook
function openReportInNotebook(reportId) {
    closeProfileModal();
    openWatchlistDashboard();
    switchDashboardTab('notebook');
    if (typeof selectReport === 'function') {
        selectReport(reportId);
    }
}

// Interactive Password Strength Checker
function checkPasswordStrength(password) {
    const meterFill = document.getElementById('dash-pw-bar-fill');
    const meterLabel = document.getElementById('dash-pw-strength-label');
    if (!meterFill || !meterLabel) return;

    if (!password) {
        meterFill.style.width = '0%';
        meterLabel.textContent = 'Password strength: None';
        return;
    }

    let score = 0;
    if (password.length >= 6) score += 20;
    if (password.length >= 10) score += 25;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 20;
    if (/[0-9]/.test(password)) score += 20;
    if (/[^a-zA-Z0-9]/.test(password)) score += 15;

    let color = '#ef4444';
    let label = 'Weak';

    if (score >= 80) {
        color = '#10b981';
        label = 'Military-Grade / Top-Secret (Robust)';
    } else if (score >= 60) {
        color = '#38bdf8';
        label = 'Strong';
    } else if (score >= 40) {
        color = '#f59e0b';
        label = 'Fair (Add symbols/caps)';
    }

    meterFill.style.width = score + '%';
    meterFill.style.backgroundColor = color;
    meterLabel.textContent = `Password strength: ${label}`;
    meterLabel.style.color = color;
}

// Apply Interface Theme Accent (Gold, Cyan, Emerald, Crimson)
function applyTacticalTheme(themeName) {
    document.documentElement.setAttribute('data-user-theme', themeName);
    localStorage.setItem('gmi_user_theme', themeName);

    document.querySelectorAll('.gmi-theme-card').forEach(card => {
        card.classList.toggle('active', card.dataset.theme === themeName);
    });
}

// Preferences toggles
function toggleAutoNewsPref(val) {
    localStorage.setItem('gmi_pref_autonews', val ? 'true' : 'false');
}

function toggleRadarPref(val) {
    localStorage.setItem('gmi_pref_radar', val ? 'true' : 'false');
    document.querySelectorAll('.radar-sweep').forEach(el => {
        el.style.display = val ? '' : 'none';
    });
}

function initPreferencesUI() {
    const savedTheme = localStorage.getItem('gmi_user_theme') || 'gold';
    applyTacticalTheme(savedTheme);

    const autoNewsPref = localStorage.getItem('gmi_pref_autonews') !== 'false';
    const radarPref = localStorage.getItem('gmi_pref_radar') !== 'false';

    const anEl = document.getElementById('dash-pref-autonews');
    const rEl = document.getElementById('dash-pref-radar');

    if (anEl) anEl.checked = autoNewsPref;
    if (rEl) rEl.checked = radarPref;
}

// Handle Profile Updates (Display Name, Specialty, Region, Bio)
async function handleProfileUpdate(event) {
    event.preventDefault();

    const token = localStorage.getItem('gmi_token');
    if (!token) return showToast('Please log in first.', 'error');

    const btn = document.getElementById('profile-edit-btn');
    const spinner = btn?.querySelector('.auth-btn-spinner');
    const label = btn?.querySelector('span');

    if (spinner) spinner.style.display = 'block';
    if (label) label.textContent = 'Saving...';
    if (btn) btn.disabled = true;

    const displayName = document.getElementById('profile-edit-displayname')?.value.trim();
    const specialty = document.getElementById('profile-edit-specialty')?.value;
    const regionalFocus = document.getElementById('profile-edit-region')?.value;
    const bio = document.getElementById('profile-edit-bio')?.value.trim();

    try {
        const res = await fetch(`${AUTH_API}/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ displayName, specialty, regionalFocus, bio })
        });

        const data = await res.json();

        if (!res.ok) {
            showToast(data.error || 'Update failed.', 'error');
            return;
        }

        // Update local storage
        const user = JSON.parse(localStorage.getItem('gmi_user') || '{}');
        user.displayName = data.displayName;
        user.specialty = data.specialty;
        user.regionalFocus = data.regionalFocus;
        user.bio = data.bio;
        localStorage.setItem('gmi_user', JSON.stringify(user));

        // Refresh UI
        updateAuthUI(user);
        populateProfileUI(data);

        showToast('Profile updated successfully.', 'success');
    } catch (err) {
        console.error('Profile update error:', err);
        showToast('Network error while updating profile.', 'error');
    } finally {
        if (spinner) spinner.style.display = 'none';
        if (label) label.textContent = 'Save Profile Changes';
        if (btn) btn.disabled = false;
    }
}

// Handle Password Change
async function handlePasswordChange(event) {
    event.preventDefault();

    const token = localStorage.getItem('gmi_token');
    if (!token) return showToast('Please log in first.', 'error');

    const currentPassword = document.getElementById('profile-current-password')?.value;
    const newPassword = document.getElementById('profile-new-password')?.value;
    const confirmPassword = document.getElementById('profile-confirm-password')?.value;

    if (newPassword !== confirmPassword) {
        showToast('New passwords do not match.', 'error');
        return;
    }

    if (newPassword.length < 6) {
        showToast('Password must be at least 6 characters.', 'error');
        return;
    }

    if (currentPassword === newPassword) {
        showToast('New password must be different from current.', 'error');
        return;
    }

    const btn = document.getElementById('profile-password-btn');
    const spinner = btn?.querySelector('.auth-btn-spinner');
    const label = btn?.querySelector('span');

    if (spinner) spinner.style.display = 'block';
    if (label) label.textContent = 'Updating...';
    if (btn) btn.disabled = true;

    try {
        const res = await fetch(`${AUTH_API}/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ currentPassword, newPassword })
        });

        const data = await res.json();

        if (!res.ok) {
            showToast(data.error || 'Password change failed.', 'error');
            return;
        }

        document.getElementById('profile-password-form')?.reset();
        checkPasswordStrength('');
        
        showToast('Terminal access code updated successfully!', 'success');

    } catch (err) {
        console.error('Password change error:', err);
        showToast('Network error. Please try again.', 'error');
    } finally {
        if (spinner) spinner.style.display = 'none';
        if (label) label.textContent = 'Update Password';
        if (btn) btn.disabled = false;
    }
}

// Restore auth state on page load
function restoreAuthState() {
    const user = JSON.parse(localStorage.getItem('gmi_user') || 'null');
    const token = localStorage.getItem('gmi_token');
    if (user && token) {
        updateAuthUI(user);
        if (typeof loadWatchlist === 'function') loadWatchlist();
    }
}

// Initialize auth on DOM ready
document.addEventListener('DOMContentLoaded', restoreAuthState);
