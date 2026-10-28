// ============================================================================
// GLOBAL MILITARY INTELLIGENCE (GMI) - PRODUCTION ADMIN COMMAND CENTER
// ============================================================================
const ADMIN_API = '/api/admin';

// Admin Panel State
let currentAdminTab = 'overview';
let adminUsersPage = 1;
let adminUsersSearch = '';
let adminUsersSort = 'newest';
let adminUsersStatus = 'all';

let adminReportsPage = 1;
let adminReportsSearch = '';
let adminReportsFilter = 'all';
let adminReportsSort = 'updated';

let adminActivityFilter = 'all';
let adminActivityCache = [];

let adminZuluTimer = null;
let adminSyncTimer = null;
let adminPendingConfirm = null;
let currentPreviewReport = null;

// Debounce timer references
let adminUsersSearchTimer = null;
let adminReportsSearchTimer = null;

// ============================================================================
// AUTHORIZATION & HEADERS
// ============================================================================
function checkAdminAccess() {
    const token = localStorage.getItem('gmi_token');
    const user = JSON.parse(localStorage.getItem('gmi_user') || 'null');
    const roleStr = (user && user.role) ? String(user.role).trim().toLowerCase() : '';
    return Boolean(token && roleStr === 'admin');
}

function adminHeaders() {
    const token = localStorage.getItem('gmi_token');
    return {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + (token || '')
    };
}

// Escape HTML for safe rendering
function adminEscape(str) {
    if (str === null || str === undefined) return '';
    const div = document.createElement('div');
    div.textContent = String(str);
    return div.innerHTML;
}

// Date Formatters
function adminFormatDate(dateStr) {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function adminFormatDateTime(dateStr) {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' ' +
        d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
}

function adminRelativeTime(dateStr) {
    if (!dateStr) return 'Never';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return 'Never';
    const now = new Date();
    const diffMs = now - d;
    const mins = Math.floor(diffMs / 60000);
    const hours = Math.floor(diffMs / 3600000);
    const days = Math.floor(diffMs / 86400000);

    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return adminFormatDate(dateStr);
}

// ============================================================================
// OPEN & CLOSE COMMAND CENTER
// ============================================================================
function openAdminPanel(targetTab = 'overview') {
    if (!checkAdminAccess()) {
        if (typeof showToast === 'function') {
            showToast('Access Denied: Administrator clearance required.', 'error');
        }
        return;
    }

    // Close any open dropdown menu
    const menu = document.getElementById('auth-user-menu');
    if (menu) menu.classList.remove('open');

    // Close user profile modal or analyst workspace if open
    const profileModal = document.getElementById('auth-profile-modal');
    if (profileModal) profileModal.classList.remove('active');
    const watchlistDashboard = document.getElementById('watchlist-dashboard');
    if (watchlistDashboard) watchlistDashboard.classList.remove('active');

    const panel = document.getElementById('gmi-admin-panel');
    if (!panel) return;

    panel.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    // Populate Sidebar Admin Profile
    const user = JSON.parse(localStorage.getItem('gmi_user') || '{}');
    const adminAvatar = document.getElementById('gmi-admin-avatar');
    const adminName = document.getElementById('gmi-admin-name');
    const initial = (user.displayName || user.username || 'A').charAt(0).toUpperCase();

    if (adminAvatar) adminAvatar.textContent = initial;
    if (adminName) adminName.textContent = user.displayName || user.username || 'Administrator';

    // Start Zulu Military Clock
    startAdminZuluClock();

    // Setup periodic sync (every 60s)
    clearInterval(adminSyncTimer);
    adminSyncTimer = setInterval(() => {
        if (panel.style.display !== 'none') {
            refreshAdminData(true);
        }
    }, 60000);

    // Switch to target tab
    switchAdminTab(targetTab);

    // Reset sidebar state on open
    const sidebar = document.getElementById('gmi-admin-sidebar');
    const toggleBtn = document.querySelector('.gmi-menu-toggle-btn');
    if (sidebar) {
        sidebar.classList.remove('open');
        sidebar.classList.remove('collapsed');
        if (toggleBtn) {
            toggleBtn.classList.remove('is-collapsed');
            toggleBtn.title = "Collapse Sidebar (Slide Left)";
        }
    }
}

function closeAdminPanel() {
    const panel = document.getElementById('gmi-admin-panel');
    if (panel) {
        panel.style.display = 'none';
        document.body.style.overflow = '';
    }

    // Clear timers
    if (adminZuluTimer) clearInterval(adminZuluTimer);
    if (adminSyncTimer) clearInterval(adminSyncTimer);

    // Close any open submodals
    closeConfirmModal(false);
    closeUserDossierModal();
    closeReportPreviewModal();
}

// Mobile & Desktop Sidebar Slide / Collapse Toggle
function toggleAdminSidebar(forceState) {
    const sidebar = document.getElementById('gmi-admin-sidebar');
    const toggleBtn = document.querySelector('.gmi-menu-toggle-btn');
    if (!sidebar) return;

    const isMobile = window.innerWidth <= 991;
    if (isMobile) {
        if (typeof forceState === 'boolean') {
            sidebar.classList.toggle('open', forceState);
        } else {
            sidebar.classList.toggle('open');
        }
    } else {
        let isCollapsed;
        if (typeof forceState === 'boolean') {
            isCollapsed = !forceState;
            sidebar.classList.toggle('collapsed', isCollapsed);
        } else {
            isCollapsed = sidebar.classList.toggle('collapsed');
        }
        if (toggleBtn) {
            toggleBtn.classList.toggle('is-collapsed', isCollapsed);
            toggleBtn.title = isCollapsed ? 'Expand Sidebar (Slide Right)' : 'Collapse Sidebar (Slide Left)';
        }
    }
}

function closeAdminSidebar() {
    toggleAdminSidebar(false);
}

// Military / Zulu Clock
function startAdminZuluClock() {
    const clockEl = document.getElementById('gmi-zulu-clock');
    if (!clockEl) return;

    const updateClock = () => {
        const now = new Date();
        const hrs = String(now.getUTCHours()).padStart(2, '0');
        const mins = String(now.getUTCMinutes()).padStart(2, '0');
        const secs = String(now.getUTCSeconds()).padStart(2, '0');
        const timeSpan = clockEl.querySelector('.gmi-clock-time');
        if (timeSpan) timeSpan.textContent = `${hrs}:${mins}:${secs} UTC`;
    };

    updateClock();
    if (adminZuluTimer) clearInterval(adminZuluTimer);
    adminZuluTimer = setInterval(updateClock, 1000);
}

// ============================================================================
// TAB NAVIGATION
// ============================================================================
function switchAdminTab(tab) {
    currentAdminTab = tab;

    // Update Sidebar Navigation state
    document.querySelectorAll('.gmi-nav-item').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tab);
    });

    // Update Topbar Breadcrumb
    const crumbEl = document.getElementById('gmi-current-crumb');
    const tabTitles = {
        overview: 'Mission Control',
        users: 'User Directory & Management',
        reports: 'Intelligence Reports Moderation',
        health: 'System & Database Telemetry',
        activity: 'Recent Activity Audit Trail',
        security: 'Admin Profile & Security'
    };
    if (crumbEl) crumbEl.textContent = tabTitles[tab] || 'Admin';

    // Auto-close sidebar on mobile
    if (window.innerWidth < 992) {
        toggleAdminSidebar(false);
    }

    // Load active tab content
    switch (tab) {
        case 'overview':
            loadMissionControl();
            break;
        case 'users':
            loadAdminUsers(adminUsersPage || 1);
            break;
        case 'reports':
            loadAdminReports(adminReportsPage || 1);
            break;
        case 'health':
            loadSystemHealth();
            break;
        case 'activity':
            loadActivityAudit();
            break;
        case 'security':
            loadAdminSecurity();
            break;
        default:
            loadMissionControl();
    }
}

// Refresh / Sync Current Tab
function refreshAdminData(silent = false) {
    const syncBtn = document.getElementById('gmi-btn-refresh-all');
    if (syncBtn && !silent) {
        syncBtn.classList.add('gmi-spin');
        setTimeout(() => syncBtn.classList.remove('gmi-spin'), 650);
    }

    switch (currentAdminTab) {
        case 'overview': loadMissionControl(); break;
        case 'users': loadAdminUsers(adminUsersPage); break;
        case 'reports': loadAdminReports(adminReportsPage); break;
        case 'health': loadSystemHealth(); break;
        case 'activity': loadActivityAudit(); break;
        case 'security': loadAdminSecurity(); break;
    }
}

// ============================================================================
// TAB 1: MISSION CONTROL (OVERVIEW)
// ============================================================================
async function loadMissionControl() {
    const container = document.getElementById('gmi-admin-view-body');
    if (!container) return;

    container.innerHTML = `
        <div class="gmi-loading-state">
            <div class="gmi-radar-spinner"></div>
            <p>Gathering defense telemetry & database statistics...</p>
        </div>
    `;

    try {
        const [statsRes, healthRes, activityRes] = await Promise.all([
            fetch(ADMIN_API + '/stats', { headers: adminHeaders() }),
            fetch(ADMIN_API + '/system-health', { headers: adminHeaders() }),
            fetch(ADMIN_API + '/activity', { headers: adminHeaders() })
        ]);

        if (!statsRes.ok) throw new Error('Failed to load dashboard metrics');
        const stats = await statsRes.json();
        const health = healthRes.ok ? await healthRes.json() : null;
        const activity = activityRes.ok ? await activityRes.json() : { activities: [] };

        // Update sidebar status & counters
        const pingPill = document.getElementById('gmi-sidebar-ping');
        const statusText = document.getElementById('gmi-sidebar-status-text');
        if (health && health.database) {
            if (pingPill) pingPill.textContent = health.database.pingLatencyMs !== null ? `${health.database.pingLatencyMs}ms` : 'Online';
            if (statusText) statusText.textContent = health.database.status === 'Connected' ? 'ATLAS CONNECTED' : health.database.status.toUpperCase();
        }

        const navUsersPill = document.getElementById('nav-pill-users');
        const navReportsPill = document.getElementById('nav-pill-reports');
        if (navUsersPill) navUsersPill.textContent = stats.totalUsers || 0;
        if (navReportsPill) navReportsPill.textContent = stats.totalReports || 0;

        const uptime = health?.server?.uptimeFormatted || 'Active';
        const heapUsed = health?.memory?.heapUsedMB || 0;
        const heapTotal = health?.memory?.heapTotalMB || 1;
        const heapPct = Math.round((heapUsed / heapTotal) * 100) || 0;
        const dbLatency = health?.database?.pingLatencyMs !== null ? `${health.database.pingLatencyMs}ms` : 'Healthy';

        let html = `
            <div class="gmi-overview-view">
                <!-- Welcome Banner -->
                <div class="gmi-overview-banner">
                    <div class="gmi-banner-left">
                        <div class="gmi-banner-badge">RESTRICTED ACCESS • LEVEL 4</div>
                        <h2 class="gmi-banner-title">Global Military Intelligence Command Center</h2>
                        <p class="gmi-banner-desc">Real-time operational monitoring, analyst management, defense dossier moderation, and database infrastructure telemetry.</p>
                    </div>
                    <div class="gmi-banner-right">
                        <button class="gmi-banner-action-btn" onclick="switchAdminTab('users')">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                            Manage Users
                        </button>
                        <button class="gmi-banner-action-btn" onclick="switchAdminTab('reports')">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg>
                            Moderate Reports
                        </button>
                    </div>
                </div>

                <!-- 6 KPI Metric Cards -->
                <div class="gmi-kpi-grid">
                    <!-- KPI 1: Total Users -->
                    <div class="gmi-kpi-card gmi-kpi-blue" onclick="switchAdminTab('users')">
                        <div class="gmi-kpi-top">
                            <span class="gmi-kpi-label">Registered Analysts</span>
                            <div class="gmi-kpi-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                            </div>
                        </div>
                        <div class="gmi-kpi-val">${stats.totalUsers}</div>
                        <div class="gmi-kpi-foot">
                            <span class="gmi-kpi-trend positive">+${stats.newUsersThisWeek} this week</span>
                            <span class="gmi-kpi-sub">${stats.totalAdmins} admin accounts</span>
                        </div>
                    </div>

                    <!-- KPI 2: Total Reports -->
                    <div class="gmi-kpi-card gmi-kpi-green" onclick="switchAdminTab('reports')">
                        <div class="gmi-kpi-top">
                            <span class="gmi-kpi-label">Strategic Reports</span>
                            <div class="gmi-kpi-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                            </div>
                        </div>
                        <div class="gmi-kpi-val">${stats.totalReports}</div>
                        <div class="gmi-kpi-foot">
                            <span class="gmi-kpi-pill-public">${stats.publicReports} Public</span>
                            <span class="gmi-kpi-sub">${stats.privateReports} Internal</span>
                        </div>
                    </div>

                    <!-- KPI 3: Watchlist -->
                    <div class="gmi-kpi-card gmi-kpi-gold">
                        <div class="gmi-kpi-top">
                            <span class="gmi-kpi-label">Tracked Watchlists</span>
                            <div class="gmi-kpi-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                            </div>
                        </div>
                        <div class="gmi-kpi-val">${stats.totalWatchlistItems}</div>
                        <div class="gmi-kpi-foot">
                            <span class="gmi-kpi-sub">Across all analyst dossiers</span>
                        </div>
                    </div>

                    <!-- KPI 4: MongoDB Atlas -->
                    <div class="gmi-kpi-card gmi-kpi-emerald" onclick="switchAdminTab('health')">
                        <div class="gmi-kpi-top">
                            <span class="gmi-kpi-label">MongoDB Atlas</span>
                            <div class="gmi-kpi-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                            </div>
                        </div>
                        <div class="gmi-kpi-val">${dbLatency}</div>
                        <div class="gmi-kpi-foot">
                            <span class="gmi-kpi-trend positive">● ReplicaSet Online</span>
                            <span class="gmi-kpi-sub">${health?.database?.name || 'gmi'} DB</span>
                        </div>
                    </div>

                    <!-- KPI 5: Server Uptime -->
                    <div class="gmi-kpi-card gmi-kpi-purple" onclick="switchAdminTab('health')">
                        <div class="gmi-kpi-top">
                            <span class="gmi-kpi-label">System Uptime</span>
                            <div class="gmi-kpi-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                            </div>
                        </div>
                        <div class="gmi-kpi-val gmi-kpi-sm">${uptime}</div>
                        <div class="gmi-kpi-foot">
                            <span class="gmi-kpi-sub">Node ${health?.server?.nodeVersion || 'v18+'} • PID ${health?.server?.pid || '—'}</span>
                        </div>
                    </div>

                    <!-- KPI 6: Memory Utilization -->
                    <div class="gmi-kpi-card gmi-kpi-cyan" onclick="switchAdminTab('health')">
                        <div class="gmi-kpi-top">
                            <span class="gmi-kpi-label">Heap Memory</span>
                            <div class="gmi-kpi-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>
                            </div>
                        </div>
                        <div class="gmi-kpi-val">${heapUsed} <span class="gmi-kpi-unit">MB</span></div>
                        <div class="gmi-kpi-foot">
                            <div class="gmi-kpi-bar-wrap">
                                <div class="gmi-kpi-bar" style="width: ${Math.min(100, heapPct)}%;"></div>
                            </div>
                            <span class="gmi-kpi-sub">${heapPct}% of ${heapTotal}MB</span>
                        </div>
                    </div>
                </div>

                <!-- Split Grid: Activity Feed & Quick Panels -->
                <div class="gmi-overview-split">
                    <!-- Left: Recent Real Database Activity -->
                    <div class="gmi-overview-panel">
                        <div class="gmi-panel-header">
                            <div class="gmi-panel-title">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                <span>Recent Platform Telemetry</span>
                            </div>
                            <button class="gmi-panel-link-btn" onclick="switchAdminTab('activity')">View Full Audit →</button>
                        </div>
                        <div class="gmi-panel-body">
        `;

        const recentActs = (activity.activities || []).slice(0, 6);
        if (recentActs.length === 0) {
            html += `<div class="gmi-panel-empty">No logged activity events yet.</div>`;
        } else {
            html += `<div class="gmi-activity-mini-list">`;
            recentActs.forEach(ev => {
                const badgeColor = ev.badgeColor || 'blue';
                html += `
                    <div class="gmi-activity-mini-item">
                        <div class="gmi-act-badge gmi-act-badge-${badgeColor}">${adminEscape(ev.badge || 'EVENT')}</div>
                        <div class="gmi-act-content">
                            <div class="gmi-act-desc">${adminEscape(ev.description)}</div>
                            <div class="gmi-act-time">${adminRelativeTime(ev.timestamp)}</div>
                        </div>
                    </div>
                `;
            });
            html += `</div>`;
        }

        html += `
                        </div>
                    </div>

                    <!-- Right: Quick Diagnostics & Database Inventory -->
                    <div class="gmi-overview-panel">
                        <div class="gmi-panel-header">
                            <div class="gmi-panel-title">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                                <span>System Health & Collections</span>
                            </div>
                            <button class="gmi-panel-link-btn" onclick="switchAdminTab('health')">Diagnostics →</button>
                        </div>
                        <div class="gmi-panel-body">
                            <div class="gmi-inventory-grid">
                                <div class="gmi-inv-item">
                                    <span class="gmi-inv-label">Database Name</span>
                                    <span class="gmi-inv-val">${adminEscape(health?.database?.name || 'test')}</span>
                                </div>
                                <div class="gmi-inv-item">
                                    <span class="gmi-inv-label">Connection Status</span>
                                    <span class="gmi-inv-val gmi-color-green">${adminEscape(health?.database?.status || 'Connected')}</span>
                                </div>
                                <div class="gmi-inv-item">
                                    <span class="gmi-inv-label">Users Collection</span>
                                    <span class="gmi-inv-val">${stats.totalUsers} records</span>
                                </div>
                                <div class="gmi-inv-item">
                                    <span class="gmi-inv-label">Reports Collection</span>
                                    <span class="gmi-inv-val">${stats.totalReports} records</span>
                                </div>
                                <div class="gmi-inv-item">
                                    <span class="gmi-inv-label">Watchlist Collection</span>
                                    <span class="gmi-inv-val">${stats.totalWatchlistItems} records</span>
                                </div>
                                <div class="gmi-inv-item">
                                    <span class="gmi-inv-label">Host CPUs</span>
                                    <span class="gmi-inv-val">${health?.os?.cpuCount || '—'} Cores</span>
                                </div>
                            </div>

                            <div class="gmi-quick-actions-bar">
                                <button class="gmi-btn-sm gmi-btn-outline" onclick="switchAdminTab('security')">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                                    Security Settings
                                </button>
                                <button class="gmi-btn-sm gmi-btn-gold" onclick="refreshAdminData()">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
                                    Sync Telemetry
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = html;

    } catch (err) {
        console.error('Mission control load error:', err);
        container.innerHTML = `
            <div class="gmi-error-state">
                <div class="gmi-error-icon">⚠️</div>
                <h3>Failed to load Mission Control</h3>
                <p>${adminEscape(err.message || 'Server error communicating with database.')}</p>
                <button class="gmi-btn-retry" onclick="loadMissionControl()">Retry Connection</button>
            </div>
        `;
    }
}

// ============================================
// TAB 2: USER MANAGEMENT
// ============================================
async function loadAdminUsers(page = 1) {
    adminUsersPage = page;
    const container = document.getElementById('gmi-admin-view-body');
    if (!container) return;

    // Preserve toolbar state if re-rendering
    let toolbarHtml = `
        <div class="gmi-view-header">
            <div>
                <h2 class="gmi-view-title">User Directory & Authorization</h2>
                <p class="gmi-view-sub">Manage registered military intelligence analysts, account dossiers, and access controls.</p>
            </div>
            <button class="gmi-btn-gold" onclick="loadAdminUsers(1)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
                Refresh
            </button>
        </div>

        <div class="gmi-toolbar-wrap">
            <div class="gmi-search-field">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input type="text" id="gmi-users-search-input" placeholder="Search by username, display name, or email..." value="${adminEscape(adminUsersSearch)}" oninput="handleAdminUserSearch(this.value)">
                ${adminUsersSearch ? `<button class="gmi-search-clear" onclick="clearAdminUserSearch()">✕</button>` : ''}
            </div>

            <div class="gmi-filter-controls">
                <select class="gmi-select" id="gmi-users-status-select" onchange="handleAdminUserStatus(this.value)">
                    <option value="all" ${adminUsersStatus === 'all' ? 'selected' : ''}>All Statuses</option>
                    <option value="active" ${adminUsersStatus === 'active' ? 'selected' : ''}>Active (Last 30d)</option>
                    <option value="inactive" ${adminUsersStatus === 'inactive' ? 'selected' : ''}>Inactive</option>
                </select>

                <select class="gmi-select" id="gmi-users-sort-select" onchange="handleAdminUserSort(this.value)">
                    <option value="newest" ${adminUsersSort === 'newest' ? 'selected' : ''}>Joined: Newest First</option>
                    <option value="oldest" ${adminUsersSort === 'oldest' ? 'selected' : ''}>Joined: Oldest First</option>
                    <option value="username" ${adminUsersSort === 'username' ? 'selected' : ''}>Username (A-Z)</option>
                    <option value="activity" ${adminUsersSort === 'activity' ? 'selected' : ''}>Last Session Active</option>
                </select>
            </div>
        </div>

        <div id="gmi-users-table-container">
            <div class="gmi-loading-state">
                <div class="gmi-radar-spinner"></div>
                <p>Retrieving user profiles...</p>
            </div>
        </div>
    `;

    container.innerHTML = toolbarHtml;

    try {
        const params = new URLSearchParams({
            page: adminUsersPage,
            limit: 12,
            search: adminUsersSearch,
            sort: adminUsersSort,
            status: adminUsersStatus
        });

        const res = await fetch(`${ADMIN_API}/users?${params}`, { headers: adminHeaders() });
        if (!res.ok) throw new Error('Failed to query users from database');
        const data = await res.json();

        const tableContainer = document.getElementById('gmi-users-table-container');
        if (!tableContainer) return;

        if (data.users.length === 0) {
            tableContainer.innerHTML = `
                <div class="gmi-empty-state">
                    <div class="gmi-empty-icon">👥</div>
                    <h3>No analysts match your search</h3>
                    <p>Try modifying your search criteria or resetting filters.</p>
                    <button class="gmi-btn-sm gmi-btn-gold" onclick="clearAdminUserSearch()">Reset Filter</button>
                </div>
            `;
            return;
        }

        let tableHtml = `
            <div class="gmi-table-wrapper">
                <table class="gmi-table">
                    <thead>
                        <tr>
                            <th>Analyst</th>
                            <th>Email Address</th>
                            <th>Enrolled</th>
                            <th>Last Active</th>
                            <th>Reports</th>
                            <th>Watchlist</th>
                            <th>Status</th>
                            <th style="text-align: right;">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        data.users.forEach(u => {
            const initial = (u.displayName || u.username || 'U').charAt(0).toUpperCase();
            const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
            const isActive = u.lastLogin && new Date(u.lastLogin) >= thirtyDaysAgo;

            tableHtml += `
                <tr>
                    <td>
                        <div class="gmi-user-profile-cell">
                            <div class="gmi-avatar-circle">${initial}</div>
                            <div class="gmi-user-names">
                                <span class="gmi-user-display">${adminEscape(u.displayName || u.username)}</span>
                                <span class="gmi-user-handle">@${adminEscape(u.username)}</span>
                            </div>
                        </div>
                    </td>
                    <td class="gmi-td-mono">${adminEscape(u.email)}</td>
                    <td>${adminFormatDate(u.createdAt)}</td>
                    <td>
                        <span class="gmi-time-pill" title="${adminFormatDateTime(u.lastLogin)}">
                            ${adminRelativeTime(u.lastLogin)}
                        </span>
                    </td>
                    <td><span class="gmi-count-badge">${u.reportCount || 0}</span></td>
                    <td><span class="gmi-count-badge gmi-badge-gold">${u.watchlistCount || 0}</span></td>
                    <td>
                        <span class="gmi-status-pill ${isActive ? 'active' : 'inactive'}">
                            ${isActive ? 'Active' : 'Dormant'}
                        </span>
                    </td>
                    <td>
                        <div class="gmi-row-actions">
                            <button class="gmi-action-btn" onclick="openUserDossier('${u._id}')" title="View Full Dossier">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                            </button>
                            <button class="gmi-action-btn gmi-btn-danger" onclick="confirmDeleteUser('${u._id}', '${adminEscape(u.username)}', ${u.reportCount || 0}, ${u.watchlistCount || 0})" title="Terminate Account">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        });

        tableHtml += `
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            <div class="gmi-pagination-bar">
                <span class="gmi-page-info">
                    Page <b>${data.page}</b> of <b>${data.totalPages}</b> (${data.total} total accounts)
                </span>
                <div class="gmi-page-btns">
                    <button class="gmi-page-btn" ${data.page <= 1 ? 'disabled' : ''} onclick="loadAdminUsers(${data.page - 1})">
                        ← Previous
                    </button>
                    <span class="gmi-page-number-active">${data.page}</span>
                    <button class="gmi-page-btn" ${data.page >= data.totalPages ? 'disabled' : ''} onclick="loadAdminUsers(${data.page + 1})">
                        Next →
                    </button>
                </div>
            </div>
        `;

        tableContainer.innerHTML = tableHtml;

    } catch (err) {
        console.error('Admin users load error:', err);
        const tableContainer = document.getElementById('gmi-users-table-container');
        if (tableContainer) {
            tableContainer.innerHTML = `
                <div class="gmi-error-state">
                    <h3>Error Loading Users</h3>
                    <p>${adminEscape(err.message)}</p>
                    <button class="gmi-btn-retry" onclick="loadAdminUsers(adminUsersPage)">Retry</button>
                </div>
            `;
        }
    }
}

function handleAdminUserSearch(val) {
    adminUsersSearch = val.trim();
    clearTimeout(adminUsersSearchTimer);
    adminUsersSearchTimer = setTimeout(() => {
        loadAdminUsers(1);
    }, 350);
}

function clearAdminUserSearch() {
    adminUsersSearch = '';
    const input = document.getElementById('gmi-users-search-input');
    if (input) input.value = '';
    loadAdminUsers(1);
}

function handleAdminUserSort(val) {
    adminUsersSort = val;
    loadAdminUsers(1);
}

function handleAdminUserStatus(val) {
    adminUsersStatus = val;
    loadAdminUsers(1);
}

// USER DOSSIER MODAL
async function openUserDossier(userId) {
    const modal = document.getElementById('gmi-user-dossier-modal');
    const body = document.getElementById('dossier-body');
    const title = document.getElementById('dossier-name');
    if (!modal || !body) return;

    modal.style.display = 'flex';
    body.innerHTML = `
        <div class="gmi-loading-state">
            <div class="gmi-radar-spinner"></div>
            <p>Accessing analyst dossier record...</p>
        </div>
    `;

    try {
        const res = await fetch(`${ADMIN_API}/users/${userId}`, { headers: adminHeaders() });
        if (!res.ok) throw new Error('User record not found');
        const user = await res.json();

        if (title) title.textContent = user.displayName || user.username;

        let reportsListHtml = '<p class="gmi-text-muted">No submitted reports on file.</p>';
        if (user.reports && user.reports.length > 0) {
            reportsListHtml = '<div class="gmi-dossier-reports-list">';
            user.reports.forEach(r => {
                reportsListHtml += `
                    <div class="gmi-dossier-report-item">
                        <div class="gmi-dossier-report-title">${adminEscape(r.title)}</div>
                        <div class="gmi-dossier-report-meta">
                            <span class="${r.isPublic ? 'gmi-color-green' : 'gmi-color-muted'}">${r.isPublic ? 'Public' : 'Private'}</span>
                            • Updated ${adminRelativeTime(r.updatedAt)}
                        </div>
                    </div>
                `;
            });
            reportsListHtml += '</div>';
        }

        body.innerHTML = `
            <div class="gmi-dossier-content">
                <div class="gmi-dossier-header-card">
                    <div class="gmi-dossier-avatar">${(user.displayName || user.username || 'U').charAt(0).toUpperCase()}</div>
                    <div class="gmi-dossier-header-info">
                        <h3>${adminEscape(user.displayName || user.username)}</h3>
                        <span class="gmi-dossier-handle">@${adminEscape(user.username)}</span>
                        <div class="gmi-dossier-tags">
                            <span class="gmi-pill-badge">ID: ${user._id}</span>
                            <span class="gmi-pill-badge gmi-badge-gold">Watchlist: ${user.watchlistCount || 0}</span>
                            <span class="gmi-pill-badge gmi-badge-blue">Reports: ${user.reportCount || 0}</span>
                        </div>
                    </div>
                </div>

                <div class="gmi-dossier-grid">
                    <div class="gmi-dossier-field">
                        <label>Email Address</label>
                        <div>${adminEscape(user.email)}</div>
                    </div>
                    <div class="gmi-dossier-field">
                        <label>Account Created</label>
                        <div>${adminFormatDateTime(user.createdAt)}</div>
                    </div>
                    <div class="gmi-dossier-field">
                        <label>Last Session Login</label>
                        <div>${adminFormatDateTime(user.lastLogin)}</div>
                    </div>
                    <div class="gmi-dossier-field">
                        <label>Role Clearance</label>
                        <div>Standard Intelligence Analyst</div>
                    </div>
                </div>

                <div class="gmi-dossier-section">
                    <h4>Submitted Intelligence Briefings</h4>
                    ${reportsListHtml}
                </div>

                <!-- Admin Action: Update Display Name or Reset Password -->
                <div class="gmi-dossier-section gmi-dossier-edit-box">
                    <h4>Update Analyst Record</h4>
                    <form onsubmit="handleUpdateUserDossier(event, '${user._id}')">
                        <div class="gmi-form-group">
                            <label>Display Name</label>
                            <input type="text" id="dossier-input-name" class="gmi-input" value="${adminEscape(user.displayName || '')}" placeholder="Update display name">
                        </div>
                        <div class="gmi-form-group">
                            <label>Reset Password (leave empty to keep unchanged)</label>
                            <input type="password" id="dossier-input-password" class="gmi-input" placeholder="New password (min 6 characters)" minlength="6">
                        </div>
                        <div class="gmi-form-actions">
                            <button type="submit" class="gmi-btn-gold">Save Changes</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

    } catch (err) {
        body.innerHTML = `<div class="gmi-error-state"><p>${adminEscape(err.message)}</p></div>`;
    }
}

function closeUserDossierModal() {
    const modal = document.getElementById('gmi-user-dossier-modal');
    if (modal) modal.style.display = 'none';
}

async function handleUpdateUserDossier(e, userId) {
    e.preventDefault();
    const displayName = document.getElementById('dossier-input-name')?.value.trim();
    const password = document.getElementById('dossier-input-password')?.value;

    const payload = {};
    if (displayName !== undefined) payload.displayName = displayName;
    if (password) payload.password = password;

    try {
        const res = await fetch(`${ADMIN_API}/users/${userId}`, {
            method: 'PUT',
            headers: adminHeaders(),
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to update user');

        showToast(data.message || 'Analyst record updated.', 'success');
        closeUserDossierModal();
        loadAdminUsers(adminUsersPage);
    } catch (err) {
        showToast(err.message, 'error');
    }
}

// DELETE USER ACTION WITH CONFIRMATION
function confirmDeleteUser(id, username, reportCount, watchlistCount) {
    openConfirmModal({
        title: `Terminate Analyst Account?`,
        message: `Are you sure you want to permanently delete user "${username}"?`,
        warning: `This action will permanently purge their account, all ${reportCount} associated report dossiers, and all ${watchlistCount} watchlist tracking items from the database. This cannot be undone.`,
        confirmText: 'Terminate User',
        isDanger: true,
        onConfirm: async () => {
            try {
                const res = await fetch(`${ADMIN_API}/users/${id}`, {
                    method: 'DELETE',
                    headers: adminHeaders()
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Deletion failed');

                showToast(`User "${username}" terminated. Purged ${data.deletedReports || 0} reports.`, 'success');
                loadAdminUsers(adminUsersPage);
            } catch (err) {
                showToast(err.message || 'Failed to delete user.', 'error');
            }
        }
    });
}

// ============================================
// TAB 3: REPORTS MODERATION
// ============================================
async function loadAdminReports(page = 1) {
    adminReportsPage = page;
    const container = document.getElementById('gmi-admin-view-body');
    if (!container) return;

    container.innerHTML = `
        <div class="gmi-view-header">
            <div>
                <h2 class="gmi-view-title">Strategic Reports & Intelligence Briefings</h2>
                <p class="gmi-view-sub">Review, moderate visibility, inspect tactical widgets, or remove user-generated defense analysis.</p>
            </div>
            <button class="gmi-btn-gold" onclick="loadAdminReports(1)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
                Refresh
            </button>
        </div>

        <div class="gmi-toolbar-wrap">
            <div class="gmi-search-field">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input type="text" id="gmi-reports-search-input" placeholder="Search by report title or topic..." value="${adminEscape(adminReportsSearch)}" oninput="handleAdminReportSearch(this.value)">
                ${adminReportsSearch ? `<button class="gmi-search-clear" onclick="clearAdminReportSearch()">✕</button>` : ''}
            </div>

            <div class="gmi-filter-controls">
                <div class="gmi-filter-tabs">
                    <button class="gmi-filter-tab ${adminReportsFilter === 'all' ? 'active' : ''}" onclick="handleAdminReportFilter('all')">All</button>
                    <button class="gmi-filter-tab ${adminReportsFilter === 'public' ? 'active' : ''}" onclick="handleAdminReportFilter('public')">Public</button>
                    <button class="gmi-filter-tab ${adminReportsFilter === 'private' ? 'active' : ''}" onclick="handleAdminReportFilter('private')">Private</button>
                </div>

                <select class="gmi-select" id="gmi-reports-sort-select" onchange="handleAdminReportSort(this.value)">
                    <option value="updated" ${adminReportsSort === 'updated' ? 'selected' : ''}>Modified: Newest First</option>
                    <option value="oldest" ${adminReportsSort === 'oldest' ? 'selected' : ''}>Created: Oldest First</option>
                    <option value="title" ${adminReportsSort === 'title' ? 'selected' : ''}>Title (A-Z)</option>
                </select>
            </div>
        </div>

        <div id="gmi-reports-table-container">
            <div class="gmi-loading-state">
                <div class="gmi-radar-spinner"></div>
                <p>Retrieving defense reports from database...</p>
            </div>
        </div>
    `;

    try {
        const params = new URLSearchParams({
            page: adminReportsPage,
            limit: 12,
            search: adminReportsSearch,
            filter: adminReportsFilter,
            sort: adminReportsSort
        });

        const res = await fetch(`${ADMIN_API}/reports?${params}`, { headers: adminHeaders() });
        if (!res.ok) throw new Error('Failed to query reports from database');
        const data = await res.json();

        const tableContainer = document.getElementById('gmi-reports-table-container');
        if (!tableContainer) return;

        if (data.reports.length === 0) {
            tableContainer.innerHTML = `
                <div class="gmi-empty-state">
                    <div class="gmi-empty-icon">📑</div>
                    <h3>No reports found</h3>
                    <p>No intelligence briefings match your search or filter.</p>
                    <button class="gmi-btn-sm gmi-btn-gold" onclick="clearAdminReportSearch()">Reset Filter</button>
                </div>
            `;
            return;
        }

        let tableHtml = `
            <div class="gmi-table-wrapper">
                <table class="gmi-table">
                    <thead>
                        <tr>
                            <th style="width: 38%;">Report Title & Excerpt</th>
                            <th>Author / Analyst</th>
                            <th>Visibility</th>
                            <th>Widgets</th>
                            <th>Last Modified</th>
                            <th style="text-align: right;">Moderation</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        data.reports.forEach(r => {
            const isPub = Boolean(r.isPublic);
            tableHtml += `
                <tr>
                    <td>
                        <div class="gmi-report-cell">
                            <span class="gmi-report-title" onclick="openReportPreview('${r._id}')">${adminEscape(r.title)}</span>
                            <span class="gmi-report-snippet">${adminEscape(r.excerpt)}</span>
                        </div>
                    </td>
                    <td>
                        <div class="gmi-author-cell">
                            <span class="gmi-author-name">${adminEscape(r.author)}</span>
                            <span class="gmi-author-handle">@${adminEscape(r.authorUsername || 'analyst')}</span>
                        </div>
                    </td>
                    <td>
                        <button class="gmi-vis-pill ${isPub ? 'public' : 'private'}" onclick="adminToggleReportVisibility('${r._id}', ${isPub})" title="Click to toggle visibility">
                            <span class="gmi-vis-dot"></span>
                            <span>${isPub ? 'Public' : 'Private'}</span>
                        </button>
                    </td>
                    <td>
                        <span class="gmi-count-badge ${r.widgetCount > 0 ? 'gmi-badge-blue' : ''}">${r.widgetCount || 0}</span>
                    </td>
                    <td>${adminRelativeTime(r.updatedAt || r.createdAt)}</td>
                    <td>
                        <div class="gmi-row-actions">
                            <button class="gmi-action-btn" onclick="openReportPreview('${r._id}')" title="Preview Dossier">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                            </button>
                            <button class="gmi-action-btn ${isPub ? 'gmi-btn-gold-subtle' : ''}" onclick="adminToggleReportVisibility('${r._id}', ${isPub})" title="Toggle Public / Private">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                            </button>
                            <button class="gmi-action-btn gmi-btn-danger" onclick="confirmDeleteReport('${r._id}', '${adminEscape(r.title).replace(/'/g, "\\'")}')" title="Delete Report">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        });

        tableHtml += `
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            <div class="gmi-pagination-bar">
                <span class="gmi-page-info">
                    Page <b>${data.page}</b> of <b>${data.totalPages}</b> (${data.total} total reports)
                </span>
                <div class="gmi-page-btns">
                    <button class="gmi-page-btn" ${data.page <= 1 ? 'disabled' : ''} onclick="loadAdminReports(${data.page - 1})">
                        ← Previous
                    </button>
                    <span class="gmi-page-number-active">${data.page}</span>
                    <button class="gmi-page-btn" ${data.page >= data.totalPages ? 'disabled' : ''} onclick="loadAdminReports(${data.page + 1})">
                        Next →
                    </button>
                </div>
            </div>
        `;

        tableContainer.innerHTML = tableHtml;

    } catch (err) {
        console.error('Admin reports load error:', err);
        const tableContainer = document.getElementById('gmi-reports-table-container');
        if (tableContainer) {
            tableContainer.innerHTML = `
                <div class="gmi-error-state">
                    <h3>Error Loading Reports</h3>
                    <p>${adminEscape(err.message)}</p>
                    <button class="gmi-btn-retry" onclick="loadAdminReports(adminReportsPage)">Retry</button>
                </div>
            `;
        }
    }
}

function handleAdminReportSearch(val) {
    adminReportsSearch = val.trim();
    clearTimeout(adminReportsSearchTimer);
    adminReportsSearchTimer = setTimeout(() => {
        loadAdminReports(1);
    }, 350);
}

function clearAdminReportSearch() {
    adminReportsSearch = '';
    const input = document.getElementById('gmi-reports-search-input');
    if (input) input.value = '';
    loadAdminReports(1);
}

function handleAdminReportFilter(filter) {
    adminReportsFilter = filter;
    loadAdminReports(1);
}

function handleAdminReportSort(sort) {
    adminReportsSort = sort;
    loadAdminReports(1);
}

async function adminToggleReportVisibility(id, currentIsPublic) {
    try {
        const res = await fetch(`${ADMIN_API}/reports/${id}/visibility`, {
            method: 'PUT',
            headers: adminHeaders(),
            body: JSON.stringify({ isPublic: !currentIsPublic })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to toggle visibility');

        showToast(data.message || 'Visibility updated.', 'success');
        loadAdminReports(adminReportsPage);
    } catch (err) {
        showToast(err.message, 'error');
    }
}

function confirmDeleteReport(id, title) {
    openConfirmModal({
        title: 'Delete Intelligence Report?',
        message: `Are you sure you want to delete report "${title}"?`,
        warning: 'This action cannot be undone. All report data and configurations will be removed permanently.',
        confirmText: 'Delete Report',
        isDanger: true,
        onConfirm: async () => {
            try {
                const res = await fetch(`${ADMIN_API}/reports/${id}`, {
                    method: 'DELETE',
                    headers: adminHeaders()
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Deletion failed');

                showToast(`Report "${title}" deleted.`, 'success');
                loadAdminReports(adminReportsPage);
            } catch (err) {
                showToast(err.message || 'Failed to delete report.', 'error');
            }
        }
    });
}

// REPORT PREVIEW READER MODAL
async function openReportPreview(reportId) {
    const modal = document.getElementById('gmi-report-preview-modal');
    const body = document.getElementById('report-preview-body');
    const title = document.getElementById('report-preview-title');
    const badge = document.getElementById('report-preview-badge');
    const toggleBtn = document.getElementById('report-preview-toggle-btn');
    if (!modal || !body) return;

    modal.style.display = 'flex';
    body.innerHTML = `
        <div class="gmi-loading-state">
            <div class="gmi-radar-spinner"></div>
            <p>Deciphering intelligence briefing...</p>
        </div>
    `;

    try {
        const res = await fetch(`${ADMIN_API}/reports/${reportId}`, { headers: adminHeaders() });
        if (!res.ok) throw new Error('Report not found');
        const report = await res.json();
        currentPreviewReport = report;

        if (title) title.textContent = report.title || 'Untitled Report';
        if (badge) {
            badge.textContent = report.isPublic ? 'PUBLIC BRIEFING' : 'CLASSIFIED INTERNAL';
            badge.className = `gmi-modal-badge ${report.isPublic ? 'gmi-badge-green' : 'gmi-badge-gold'}`;
        }
        if (toggleBtn) {
            toggleBtn.textContent = report.isPublic ? 'Make Private' : 'Make Public';
        }

        // Render Report Content (simple markdown parser)
        const renderedContent = formatReportMarkdown(report.content || '*(No textual briefing content)*');

        let widgetsHtml = '';
        if (report.widgets && report.widgets.length > 0) {
            widgetsHtml = `
                <div class="gmi-preview-widgets-box">
                    <h4>Attached Data Widgets (${report.widgets.length})</h4>
                    <div class="gmi-preview-widgets-grid">
            `;
            report.widgets.forEach((w, idx) => {
                widgetsHtml += `
                    <div class="gmi-preview-widget-card">
                        <span class="gmi-pw-type">Widget #${idx + 1}: ${adminEscape(w.type || 'Custom')}</span>
                        <pre class="gmi-pw-json">${adminEscape(JSON.stringify(w.config || {}, null, 2))}</pre>
                    </div>
                `;
            });
            widgetsHtml += `</div></div>`;
        }

        body.innerHTML = `
            <div class="gmi-preview-container">
                <div class="gmi-preview-meta-row">
                    <span><b>Analyst:</b> ${adminEscape(report.authorName)} (@${adminEscape(report.authorUsername)})</span>
                    <span><b>Created:</b> ${adminFormatDateTime(report.createdAt)}</span>
                    <span><b>Updated:</b> ${adminFormatDateTime(report.updatedAt)}</span>
                </div>

                <div class="gmi-preview-rendered-body">
                    ${renderedContent}
                </div>

                ${widgetsHtml}
            </div>
        `;

    } catch (err) {
        body.innerHTML = `<div class="gmi-error-state"><p>${adminEscape(err.message)}</p></div>`;
    }
}

function closeReportPreviewModal() {
    const modal = document.getElementById('gmi-report-preview-modal');
    if (modal) modal.style.display = 'none';
    currentPreviewReport = null;
}

async function previewToggleVisibility() {
    if (!currentPreviewReport) return;
    await adminToggleReportVisibility(currentPreviewReport._id, currentPreviewReport.isPublic);
    openReportPreview(currentPreviewReport._id);
}

// Lightweight safe Markdown renderer for reader
function formatReportMarkdown(md) {
    if (!md) return '';
    let html = adminEscape(md);

    // Headings
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // Bold & Italic
    html = html.replace(/\*\*(.*?)\*\*/gim, '<b>$1</b>');
    html = html.replace(/\*(.*?)\*/gim, '<i>$1</i>');

    // Blockquote
    html = html.replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>');

    // Lists
    html = html.replace(/^\- (.*$)/gim, '<li>$1</li>');

    // Newlines
    html = html.replace(/\n\n/g, '<br><br>');

    return html;
}

// ============================================
// TAB 4: SYSTEM & DATABASE TELEMETRY
// ============================================
async function loadSystemHealth() {
    const container = document.getElementById('gmi-admin-view-body');
    if (!container) return;

    container.innerHTML = `
        <div class="gmi-view-header">
            <div>
                <h2 class="gmi-view-title">Infrastructure Health & Telemetry</h2>
                <p class="gmi-view-sub">Live metrics directly queried from MongoDB Atlas, Node.js process runtime, and operating host.</p>
            </div>
            <button class="gmi-btn-gold" onclick="loadSystemHealth()">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
                Run Diagnostics
            </button>
        </div>

        <div class="gmi-loading-state">
            <div class="gmi-radar-spinner"></div>
            <p>Pinging MongoDB cluster & measuring system memory...</p>
        </div>
    `;

    try {
        const res = await fetch(`${ADMIN_API}/system-health`, { headers: adminHeaders() });
        if (!res.ok) throw new Error('Failed to retrieve system health metrics');
        const data = await res.json();

        const pingMs = data.database?.pingLatencyMs;
        let pingColor = 'green';
        if (pingMs !== null && pingMs > 100) pingColor = 'yellow';
        if (pingMs !== null && pingMs > 250) pingColor = 'red';

        const heapUsed = data.memory?.heapUsedMB || 0;
        const heapTotal = data.memory?.heapTotalMB || 1;
        const heapPct = data.memory?.heapPercent || 0;

        const sysTotalMB = data.memory?.systemTotalMemMB || 1;
        const sysFreeMB = data.memory?.systemFreeMemMB || 0;
        const sysUsedMB = sysTotalMB - sysFreeMB;
        const sysPct = data.memory?.systemMemPercent || 0;

        let html = `
            <div class="gmi-view-header">
                <div>
                    <h2 class="gmi-view-title">Infrastructure Health & Telemetry</h2>
                    <p class="gmi-view-sub">Live telemetry queried from MongoDB Atlas, Node.js process runtime, and operating host.</p>
                </div>
                <button class="gmi-btn-gold" onclick="loadSystemHealth()">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
                    Refresh Status
                </button>
            </div>

            <div class="gmi-health-grid">
                <!-- Card 1: MongoDB Database -->
                <div class="gmi-health-card">
                    <div class="gmi-health-card-head">
                        <div class="gmi-hcard-icon gmi-color-green">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                        </div>
                        <div>
                            <h3>MongoDB Atlas Cluster</h3>
                            <span class="gmi-sub-tag">Primary Document Store</span>
                        </div>
                        <span class="gmi-badge-status ${data.database?.status === 'Connected' ? 'green' : 'red'}">
                            ${adminEscape(data.database?.status || 'Unknown')}
                        </span>
                    </div>

                    <div class="gmi-health-stats-list">
                        <div class="gmi-hstat-row">
                            <span>Database Ping Latency</span>
                            <span class="gmi-ping-tag ${pingColor}">${pingMs !== null ? `${pingMs} ms` : 'N/A'}</span>
                        </div>
                        <div class="gmi-hstat-row">
                            <span>Database Name</span>
                            <span class="gmi-hval-mono">${adminEscape(data.database?.name || 'test')}</span>
                        </div>
                        <div class="gmi-hstat-row">
                            <span>Connection Host</span>
                            <span class="gmi-hval-mono gmi-ellipsis" style="max-width: 220px;">${adminEscape(data.database?.host || 'atlas.mongodb.net')}</span>
                        </div>
                    </div>

                    <div class="gmi-collections-summary">
                        <h4>Live Collection Counts</h4>
                        <div class="gmi-coll-chips">
                            <div class="gmi-coll-chip"><b>Users:</b> ${data.database?.collections?.users || 0}</div>
                            <div class="gmi-coll-chip"><b>Admins:</b> ${data.database?.collections?.admins || 0}</div>
                            <div class="gmi-coll-chip"><b>Reports:</b> ${data.database?.collections?.reports || 0}</div>
                            <div class="gmi-coll-chip"><b>Watchlists:</b> ${data.database?.collections?.watchlists || 0}</div>
                        </div>
                    </div>
                </div>

                <!-- Card 2: Node.js Engine -->
                <div class="gmi-health-card">
                    <div class="gmi-health-card-head">
                        <div class="gmi-hcard-icon gmi-color-gold">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>
                        </div>
                        <div>
                            <h3>Node.js Backend Runtime</h3>
                            <span class="gmi-sub-tag">Express Application Server</span>
                        </div>
                        <span class="gmi-badge-status green">OPERATIONAL</span>
                    </div>

                    <div class="gmi-health-stats-list">
                        <div class="gmi-hstat-row">
                            <span>Server Process Uptime</span>
                            <span class="gmi-hval-bold">${data.server?.uptimeFormatted || '—'}</span>
                        </div>
                        <div class="gmi-hstat-row">
                            <span>Runtime Engine</span>
                            <span class="gmi-hval-mono">Node ${data.server?.nodeVersion || 'v18+'}</span>
                        </div>
                        <div class="gmi-hstat-row">
                            <span>Process ID (PID)</span>
                            <span class="gmi-hval-mono">${data.server?.pid || '—'}</span>
                        </div>
                        <div class="gmi-hstat-row">
                            <span>Execution Environment</span>
                            <span class="gmi-hval-mono">${adminEscape(data.server?.environment || 'development')}</span>
                        </div>
                    </div>

                    <div class="gmi-memory-meter-box">
                        <div class="gmi-meter-header">
                            <span>V8 Heap Allocation</span>
                            <span>${heapUsed} MB / ${heapTotal} MB (${heapPct}%)</span>
                        </div>
                        <div class="gmi-meter-track">
                            <div class="gmi-meter-fill ${heapPct > 80 ? 'warn' : ''}" style="width: ${Math.min(100, heapPct)}%;"></div>
                        </div>
                    </div>
                </div>

                <!-- Card 3: Host Environment -->
                <div class="gmi-health-card">
                    <div class="gmi-health-card-head">
                        <div class="gmi-hcard-icon gmi-color-blue">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>
                        </div>
                        <div>
                            <h3>Host & OS Infrastructure</h3>
                            <span class="gmi-sub-tag">Hardware Resources</span>
                        </div>
                        <span class="gmi-badge-status blue">${adminEscape(data.server?.platform || 'win32')}</span>
                    </div>

                    <div class="gmi-health-stats-list">
                        <div class="gmi-hstat-row">
                            <span>Architecture</span>
                            <span class="gmi-hval-mono">${adminEscape(data.server?.arch || 'x64')}</span>
                        </div>
                        <div class="gmi-hstat-row">
                            <span>Logical CPU Cores</span>
                            <span class="gmi-hval-bold">${data.os?.cpuCount || '—'} Cores</span>
                        </div>
                        <div class="gmi-hstat-row">
                            <span>Processor Model</span>
                            <span class="gmi-hval-mono gmi-ellipsis" style="max-width: 220px;" title="${adminEscape(data.os?.cpuModel || 'CPU')}">${adminEscape(data.os?.cpuModel || 'AMD / Intel')}</span>
                        </div>
                    </div>

                    <div class="gmi-memory-meter-box">
                        <div class="gmi-meter-header">
                            <span>System Physical RAM</span>
                            <span>${sysUsedMB} MB / ${sysTotalMB} MB (${sysPct}%)</span>
                        </div>
                        <div class="gmi-meter-track">
                            <div class="gmi-meter-fill ${sysPct > 85 ? 'warn' : ''}" style="width: ${Math.min(100, sysPct)}%;"></div>
                        </div>
                    </div>
                </div>

                <!-- Card 4: Live API Endpoint Diagnostics -->
                <div class="gmi-health-card gmi-health-card-wide">
                    <div class="gmi-health-card-head">
                        <div class="gmi-hcard-icon gmi-color-cyan">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                        </div>
                        <div>
                            <h3>Active API Route Verification</h3>
                            <span class="gmi-sub-tag">Live Roundtrip Latency Tester</span>
                        </div>
                        <button class="gmi-btn-sm gmi-btn-gold" onclick="testAllEndpointsLive()">Ping All Routes</button>
                    </div>

                    <div class="gmi-api-routes-table" id="gmi-api-routes-table">
                        <!-- Populated by testAllEndpointsLive() -->
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = html;
        testAllEndpointsLive();

    } catch (err) {
        console.error('System health load error:', err);
        container.innerHTML = `
            <div class="gmi-error-state">
                <h3>Error Retrieving Infrastructure Health</h3>
                <p>${adminEscape(err.message)}</p>
                <button class="gmi-btn-retry" onclick="loadSystemHealth()">Retry Diagnostics</button>
            </div>
        `;
    }
}

// Live Endpoint Verification Tool
async function testAllEndpointsLive() {
    const tableEl = document.getElementById('gmi-api-routes-table');
    if (!tableEl) return;

    tableEl.innerHTML = '<div class="gmi-ping-measuring">Measuring live endpoint responses...</div>';

    const routes = [
        { name: 'Admin Stats', url: '/api/admin/stats', method: 'GET', auth: true },
        { name: 'Admin Health', url: '/api/admin/system-health', method: 'GET', auth: true },
        { name: 'Admin Activity', url: '/api/admin/activity', method: 'GET', auth: true },
        { name: 'User Profile', url: '/api/auth/profile', method: 'GET', auth: true },
        { name: 'Reports Index', url: '/api/reports/community', method: 'GET', auth: false },
        { name: 'Defense News', url: '/api/news', method: 'GET', auth: false }
    ];

    let html = `
        <table class="gmi-table gmi-table-sm">
            <thead>
                <tr>
                    <th>Endpoint Name</th>
                    <th>Route URI</th>
                    <th>Method</th>
                    <th>HTTP Status</th>
                    <th>Roundtrip Latency</th>
                </tr>
            </thead>
            <tbody>
    `;

    for (const r of routes) {
        const t0 = performance.now();
        let status = 'Error';
        let latency = '--';
        let isSuccess = false;

        try {
            const headers = r.auth ? adminHeaders() : {};
            const res = await fetch(r.url, { method: r.method, headers });
            const t1 = performance.now();
            latency = Math.round(t1 - t0) + ' ms';
            status = `${res.status} ${res.statusText}`;
            isSuccess = res.ok;
        } catch (e) {
            status = 'Connection Failed';
        }

        html += `
            <tr>
                <td><b>${adminEscape(r.name)}</b></td>
                <td class="gmi-td-mono">${adminEscape(r.url)}</td>
                <td><span class="gmi-method-tag">${r.method}</span></td>
                <td><span class="gmi-status-pill ${isSuccess ? 'active' : 'inactive'}">${status}</span></td>
                <td><span class="gmi-ping-tag ${isSuccess ? 'green' : 'red'}">${latency}</span></td>
            </tr>
        `;
    }

    html += `</tbody></table>`;
    tableEl.innerHTML = html;
}

// ============================================
// TAB 5: RECENT ACTIVITY AUDIT TRAIL
// ============================================
async function loadActivityAudit() {
    const container = document.getElementById('gmi-admin-view-body');
    if (!container) return;

    container.innerHTML = `
        <div class="gmi-view-header">
            <div>
                <h2 class="gmi-view-title">Platform Activity & Audit Trail</h2>
                <p class="gmi-view-sub">Chronological timeline of analyst enrollments, active sessions, and intelligence briefing updates.</p>
            </div>
            <button class="gmi-btn-gold" onclick="loadActivityAudit()">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
                Refresh Log
            </button>
        </div>

        <div class="gmi-filter-chips-bar">
            <button class="gmi-filter-chip ${adminActivityFilter === 'all' ? 'active' : ''}" onclick="filterActivityLog('all')">All Events</button>
            <button class="gmi-filter-chip ${adminActivityFilter === 'user_register' ? 'active' : ''}" onclick="filterActivityLog('user_register')">Registrations</button>
            <button class="gmi-filter-chip ${adminActivityFilter === 'user_login' ? 'active' : ''}" onclick="filterActivityLog('user_login')">Analyst Sessions</button>
            <button class="gmi-filter-chip ${adminActivityFilter === 'report' ? 'active' : ''}" onclick="filterActivityLog('report')">Reports</button>
            <button class="gmi-filter-chip ${adminActivityFilter === 'admin_login' ? 'active' : ''}" onclick="filterActivityLog('admin_login')">Admin Access</button>
        </div>

        <div id="gmi-activity-timeline-container">
            <div class="gmi-loading-state">
                <div class="gmi-radar-spinner"></div>
                <p>Gathering audit events from database...</p>
            </div>
        </div>
    `;

    try {
        const res = await fetch(`${ADMIN_API}/activity`, { headers: adminHeaders() });
        if (!res.ok) throw new Error('Failed to retrieve activity log');
        const data = await res.json();
        adminActivityCache = data.activities || [];

        renderActivityTimeline();
    } catch (err) {
        console.error('Activity audit error:', err);
        const timelineContainer = document.getElementById('gmi-activity-timeline-container');
        if (timelineContainer) {
            timelineContainer.innerHTML = `
                <div class="gmi-error-state">
                    <h3>Error Loading Activity Log</h3>
                    <p>${adminEscape(err.message)}</p>
                    <button class="gmi-btn-retry" onclick="loadActivityAudit()">Retry</button>
                </div>
            `;
        }
    }
}

function filterActivityLog(filter) {
    adminActivityFilter = filter;
    document.querySelectorAll('.gmi-filter-chip').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('onclick').includes(`'${filter}'`));
    });
    renderActivityTimeline();
}

function renderActivityTimeline() {
    const container = document.getElementById('gmi-activity-timeline-container');
    if (!container) return;

    let filtered = adminActivityCache;
    if (adminActivityFilter === 'report') {
        filtered = adminActivityCache.filter(ev => ev.type.startsWith('report_'));
    } else if (adminActivityFilter !== 'all') {
        filtered = adminActivityCache.filter(ev => ev.type === adminActivityFilter);
    }

    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="gmi-empty-state">
                <div class="gmi-empty-icon">⚡</div>
                <h3>No events found for this filter</h3>
                <p>Select another category or view all events.</p>
                <button class="gmi-btn-sm gmi-btn-gold" onclick="filterActivityLog('all')">View All</button>
            </div>
        `;
        return;
    }

    let html = `<div class="gmi-timeline-list">`;
    filtered.forEach(ev => {
        const badgeColor = ev.badgeColor || 'blue';
        html += `
            <div class="gmi-timeline-item">
                <div class="gmi-tl-badge-col">
                    <span class="gmi-act-badge gmi-act-badge-${badgeColor}">${adminEscape(ev.badge || 'EVENT')}</span>
                </div>
                <div class="gmi-tl-body">
                    <div class="gmi-tl-title">${adminEscape(ev.title)}</div>
                    <div class="gmi-tl-desc">${adminEscape(ev.description)}</div>
                    <div class="gmi-tl-time">
                        <span>${adminRelativeTime(ev.timestamp)}</span>
                        <span>•</span>
                        <span>${adminFormatDateTime(ev.timestamp)}</span>
                    </div>
                </div>
            </div>
        `;
    });
    html += `</div>`;

    container.innerHTML = html;
}

// ============================================
// TAB 6: ADMIN SECURITY & SETTINGS
// (Directly replaces and elevates the old basic profile modal!)
// ============================================
async function loadAdminSecurity() {
    const container = document.getElementById('gmi-admin-view-body');
    if (!container) return;

    container.innerHTML = `
        <div class="gmi-view-header">
            <div>
                <h2 class="gmi-view-title">Admin Profile & Master Security</h2>
                <p class="gmi-view-sub">Manage system administrator credentials, security keys, and privileged session configuration.</p>
            </div>
        </div>

        <div class="gmi-loading-state">
            <div class="gmi-radar-spinner"></div>
            <p>Accessing administrative credentials dossier...</p>
        </div>
    `;

    try {
        const token = localStorage.getItem('gmi_token');
        const res = await fetch('/api/auth/profile', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!res.ok) throw new Error('Failed to retrieve admin profile');
        const adminData = await res.json();

        const initial = (adminData.displayName || adminData.username || 'A').charAt(0).toUpperCase();

        let html = `
            <div class="gmi-view-header">
                <div>
                    <h2 class="gmi-view-title">Admin Profile & Master Security</h2>
                    <p class="gmi-view-sub">Manage system administrator credentials, security keys, and privileged session configuration.</p>
                </div>
            </div>

            <!-- Profile Dossier Header -->
            <div class="gmi-admin-dossier-card">
                <div class="gmi-admin-dossier-avatar">${initial}</div>
                <div class="gmi-admin-dossier-info">
                    <div class="gmi-admin-dossier-title-row">
                        <h3>${adminEscape(adminData.displayName || adminData.username)}</h3>
                        <span class="gmi-role-badge-gold">SYSTEM ADMINISTRATOR</span>
                    </div>
                    <div class="gmi-admin-dossier-meta">
                        <span><b>Username:</b> ${adminEscape(adminData.username)}</span>
                        <span>•</span>
                        <span><b>Email:</b> ${adminEscape(adminData.email)}</span>
                        <span>•</span>
                        <span><b>Enrolled:</b> ${adminFormatDate(adminData.createdAt)}</span>
                        <span>•</span>
                        <span><b>Active Session:</b> ${adminRelativeTime(adminData.lastLogin)}</span>
                    </div>
                </div>
            </div>

            <div class="gmi-security-grid">
                <!-- Section 1: Update Display Name -->
                <div class="gmi-security-card">
                    <div class="gmi-scard-header">
                        <div class="gmi-scard-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        </div>
                        <div>
                            <h4>Administrator Identity</h4>
                            <p>Configure public analyst handle and callsign.</p>
                        </div>
                    </div>
                    <form onsubmit="handleAdminProfileUpdate(event)">
                        <div class="gmi-form-group">
                            <label for="admin-setting-displayname">Display Name</label>
                            <input type="text" id="admin-setting-displayname" class="gmi-input" value="${adminEscape(adminData.displayName || '')}" placeholder="Administrator Name" required>
                        </div>
                        <div class="gmi-form-note">
                            Note: Admin username (${adminEscape(adminData.username)}) and official email (${adminEscape(adminData.email)}) are bound to configuration.
                        </div>
                        <button type="submit" class="gmi-btn-gold" id="btn-save-admin-profile">
                            <span>Save Identity</span>
                            <div class="gmi-btn-spinner" style="display:none;"></div>
                        </button>
                    </form>
                </div>

                <!-- Section 2: Master Password Change -->
                <div class="gmi-security-card">
                    <div class="gmi-scard-header">
                        <div class="gmi-scard-icon gmi-color-gold">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                        </div>
                        <div>
                            <h4>Master Password Rotation</h4>
                            <p>Update privileged account password authentication.</p>
                        </div>
                    </div>
                    <form onsubmit="handleAdminPasswordChange(event)" id="admin-password-change-form">
                        <div class="gmi-form-group">
                            <label for="admin-setting-curpw">Current Password</label>
                            <input type="password" id="admin-setting-curpw" class="gmi-input" placeholder="Current master password" required minlength="6">
                        </div>
                        <div class="gmi-form-group">
                            <label for="admin-setting-newpw">New Password</label>
                            <input type="password" id="admin-setting-newpw" class="gmi-input" placeholder="New master password (min 6 characters)" required minlength="6">
                        </div>
                        <div class="gmi-form-group">
                            <label for="admin-setting-confirmpw">Confirm New Password</label>
                            <input type="password" id="admin-setting-confirmpw" class="gmi-input" placeholder="Repeat new master password" required minlength="6">
                        </div>
                        <button type="submit" class="gmi-btn-gold" id="btn-save-admin-pw">
                            <span>Update Master Password</span>
                            <div class="gmi-btn-spinner" style="display:none;"></div>
                        </button>
                    </form>
                </div>

                <!-- Section 3: Session Security Specs -->
                <div class="gmi-security-card gmi-security-card-wide">
                    <div class="gmi-scard-header">
                        <div class="gmi-scard-icon gmi-color-green">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                        </div>
                        <div>
                            <h4>Active Session Clearance</h4>
                            <p>Cryptographic JWT token telemetry & role enforcement.</p>
                        </div>
                    </div>
                    <div class="gmi-session-info-grid">
                        <div class="gmi-sess-item">
                            <span class="gmi-sess-label">Cryptographic Algorithm</span>
                            <span class="gmi-sess-val">HMAC-SHA256 (JWT)</span>
                        </div>
                        <div class="gmi-sess-item">
                            <span class="gmi-sess-label">Token Authorization Role</span>
                            <span class="gmi-sess-val gmi-color-gold">ADMINISTRATOR (Full Access)</span>
                        </div>
                        <div class="gmi-sess-item">
                            <span class="gmi-sess-label">Session Duration</span>
                            <span class="gmi-sess-val">7 Days Continuous Clearance</span>
                        </div>
                        <div class="gmi-sess-item">
                            <span class="gmi-sess-label">Storage Target</span>
                            <span class="gmi-sess-val">Encrypted Local Storage</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = html;

    } catch (err) {
        console.error('Admin security load error:', err);
        container.innerHTML = `
            <div class="gmi-error-state">
                <h3>Error Loading Security Settings</h3>
                <p>${adminEscape(err.message)}</p>
                <button class="gmi-btn-retry" onclick="loadAdminSecurity()">Retry</button>
            </div>
        `;
    }
}

async function handleAdminProfileUpdate(e) {
    e.preventDefault();
    const token = localStorage.getItem('gmi_token');
    const displayName = document.getElementById('admin-setting-displayname')?.value.trim();
    const btn = document.getElementById('btn-save-admin-profile');
    const spinner = btn?.querySelector('.gmi-btn-spinner');
    const label = btn?.querySelector('span');

    if (spinner) spinner.style.display = 'inline-block';
    if (label) label.textContent = 'Saving...';
    if (btn) btn.disabled = true;

    try {
        const res = await fetch('/api/auth/profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ displayName })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Update failed');

        // Update local storage and UI
        const user = JSON.parse(localStorage.getItem('gmi_user') || '{}');
        user.displayName = data.displayName;
        localStorage.setItem('gmi_user', JSON.stringify(user));

        const adminName = document.getElementById('gmi-admin-name');
        if (adminName) adminName.textContent = data.displayName;
        if (typeof updateAuthUI === 'function') updateAuthUI(user);

        showToast('Administrator identity updated.', 'success');
        loadAdminSecurity();
    } catch (err) {
        showToast(err.message, 'error');
    } finally {
        if (spinner) spinner.style.display = 'none';
        if (label) label.textContent = 'Save Identity';
        if (btn) btn.disabled = false;
    }
}

async function handleAdminPasswordChange(e) {
    e.preventDefault();
    const token = localStorage.getItem('gmi_token');
    const currentPassword = document.getElementById('admin-setting-curpw')?.value;
    const newPassword = document.getElementById('admin-setting-newpw')?.value;
    const confirmPassword = document.getElementById('admin-setting-confirmpw')?.value;

    if (newPassword !== confirmPassword) {
        showToast('New passwords do not match.', 'error');
        return;
    }
    if (newPassword.length < 6) {
        showToast('Password must be at least 6 characters.', 'error');
        return;
    }
    if (currentPassword === newPassword) {
        showToast('New password must differ from current password.', 'error');
        return;
    }

    const btn = document.getElementById('btn-save-admin-pw');
    const spinner = btn?.querySelector('.gmi-btn-spinner');
    const label = btn?.querySelector('span');

    if (spinner) spinner.style.display = 'inline-block';
    if (label) label.textContent = 'Updating...';
    if (btn) btn.disabled = true;

    try {
        const res = await fetch('/api/auth/profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ currentPassword, newPassword })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Password update failed');

        document.getElementById('admin-password-change-form')?.reset();
        showToast('Master password updated successfully.', 'success');
    } catch (err) {
        showToast(err.message, 'error');
    } finally {
        if (spinner) spinner.style.display = 'none';
        if (label) label.textContent = 'Update Master Password';
        if (btn) btn.disabled = false;
    }
}

// ============================================
// CUSTOM CONFIRMATION MODAL ENGINE
// ============================================
function openConfirmModal({ title, message, warning, confirmText = 'Confirm', isDanger = true, onConfirm }) {
    const modal = document.getElementById('gmi-confirm-modal');
    const titleEl = document.getElementById('gmi-confirm-title');
    const msgEl = document.getElementById('gmi-confirm-message');
    const warnEl = document.getElementById('gmi-confirm-warning');
    const confirmBtn = document.getElementById('gmi-confirm-action-btn');

    if (!modal) {
        if (confirm(message)) onConfirm();
        return;
    }

    if (titleEl) titleEl.textContent = title;
    if (msgEl) msgEl.textContent = message;

    if (warnEl) {
        if (warning) {
            warnEl.textContent = warning;
            warnEl.style.display = 'block';
        } else {
            warnEl.style.display = 'none';
        }
    }

    if (confirmBtn) {
        confirmBtn.textContent = confirmText;
        confirmBtn.className = isDanger ? 'gmi-confirm-action-btn danger' : 'gmi-confirm-action-btn';
    }

    adminPendingConfirm = onConfirm;
    modal.style.display = 'flex';
}

function closeConfirmModal(confirmed = false) {
    const modal = document.getElementById('gmi-confirm-modal');
    if (modal) modal.style.display = 'none';

    if (confirmed && typeof adminPendingConfirm === 'function') {
        const cb = adminPendingConfirm;
        adminPendingConfirm = null;
        cb();
    } else {
        adminPendingConfirm = null;
    }
}

// ============================================
// KEYBOARD & ACCESSIBILITY SHORTCUTS
// ============================================
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Priority close for top-most open modal
        const confirmModal = document.getElementById('gmi-confirm-modal');
        if (confirmModal && confirmModal.style.display !== 'none') {
            closeConfirmModal(false);
            return;
        }

        const previewModal = document.getElementById('gmi-report-preview-modal');
        if (previewModal && previewModal.style.display !== 'none') {
            closeReportPreviewModal();
            return;
        }

        const dossierModal = document.getElementById('gmi-user-dossier-modal');
        if (dossierModal && dossierModal.style.display !== 'none') {
            closeUserDossierModal();
            return;
        }

        const adminPanel = document.getElementById('gmi-admin-panel');
        if (adminPanel && adminPanel.style.display !== 'none') {
            closeAdminPanel();
            return;
        }
    }
});

// Legacy backward-compatibility hook
function initAdminTab() {
    if (checkAdminAccess()) {
        openAdminPanel('overview');
    }
}

// Explicit window bindings
if (typeof window !== 'undefined') {
    window.openAdminPanel = openAdminPanel;
    window.closeAdminPanel = closeAdminPanel;
    window.switchAdminTab = switchAdminTab;
    window.refreshAdminData = refreshAdminData;
    window.toggleAdminSidebar = toggleAdminSidebar;
    window.closeAdminSidebar = closeAdminSidebar;
    window.openUserDossier = openUserDossier;
    window.closeUserDossierModal = closeUserDossierModal;
    window.previewAdminReport = previewAdminReport;
    window.closeReportPreviewModal = closeReportPreviewModal;
    window.closeConfirmModal = closeConfirmModal;
    window.runRouteDiagnostics = runRouteDiagnostics;
    window.initAdminTab = initAdminTab;
}
