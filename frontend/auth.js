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
function toggleUserDropdown() {
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

    if (user) {
        if (guestBtns) guestBtns.style.display = 'none';
        if (userMenu) userMenu.style.display = '';
        const initial = (user.displayName || user.username || 'U').charAt(0).toUpperCase();
        if (avatar) avatar.textContent = initial;
        if (usernameEl) usernameEl.textContent = user.displayName || user.username;
        if (dropdownName) dropdownName.textContent = user.displayName || user.username;
        if (dropdownRole) {
            dropdownRole.textContent = user.role === 'admin' ? 'Admin' : 'User';
            dropdownRole.style.background = user.role === 'admin' ? 'rgba(212, 175, 55, 0.15)' : 'rgba(59, 130, 246, 0.15)';
            dropdownRole.style.borderColor = user.role === 'admin' ? 'rgba(212, 175, 55, 0.3)' : 'rgba(59, 130, 246, 0.3)';
            dropdownRole.style.color = user.role === 'admin' ? '#d4af37' : '#3b82f6';
        }

        // Show/hide admin-only elements
        const isAdmin = user.role === 'admin';
        if (adminDropdownBtn) adminDropdownBtn.style.display = isAdmin ? '' : 'none';
        if (adminTabBtn) adminTabBtn.style.display = isAdmin ? '' : 'none';
    } else {
        if (guestBtns) guestBtns.style.display = '';
        if (userMenu) userMenu.style.display = 'none';
        if (adminDropdownBtn) adminDropdownBtn.style.display = 'none';
        if (adminTabBtn) adminTabBtn.style.display = 'none';
    }
}

// ============================================
// PROFILE MODAL SYSTEM
// ============================================

function showProfile() {
    // Close the dropdown menu
    const menu = document.getElementById('auth-user-menu');
    if (menu) menu.classList.remove('open');

    const user = JSON.parse(localStorage.getItem('gmi_user') || 'null');
    if (user && user.role === 'admin') {
        if (typeof openAdminPanel === 'function') {
            openAdminPanel('security');
            return;
        }
    }

    openProfileModal();
}

function openProfileModal() {
    const modal = document.getElementById('auth-profile-modal');
    if (!modal) return;

    // Reset to info tab
    switchProfileTab('info');

    // Show the modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Fetch fresh profile data from the API
    fetchProfileData();
}

function closeProfileModal() {
    const modal = document.getElementById('auth-profile-modal');
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';

    // Clear password form on close
    const pwForm = document.getElementById('profile-password-form');
    if (pwForm) pwForm.reset();
}

function switchProfileTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.profile-tab').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.profileTab === tabName);
    });

    // Update tab content
    document.querySelectorAll('.profile-tab-content').forEach(content => {
        content.classList.remove('active');
    });
    const target = document.getElementById(`profile-tab-${tabName}`);
    if (target) target.classList.add('active');
}

async function fetchProfileData() {
    const token = localStorage.getItem('gmi_token');
    const user = JSON.parse(localStorage.getItem('gmi_user') || 'null');
    if (!token || !user) return;

    try {
        const res = await fetch(`${AUTH_API}/profile`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!res.ok) {
            // Fallback to locally stored data if API fails
            populateProfileUI(user);
            return;
        }

        const data = await res.json();
        populateProfileUI(data);
    } catch (err) {
        console.error('Failed to fetch profile:', err);
        // Fallback to local storage data
        populateProfileUI(user);
    }
}

function populateProfileUI(data) {
    // Avatar initial
    const avatarEl = document.getElementById('profile-avatar-lg');
    const initial = (data.displayName || data.username || 'U').charAt(0);
    if (avatarEl) avatarEl.textContent = initial;

    // Header
    const titleEl = document.getElementById('profile-display-title');
    if (titleEl) titleEl.textContent = data.displayName || data.username || 'User';

    const badgeEl = document.getElementById('profile-role-badge');
    if (badgeEl) badgeEl.textContent = data.role || 'User';

    // Info Tab
    const setInfo = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.textContent = value || '—';
    };

    setInfo('profile-info-username', data.username);
    setInfo('profile-info-email', data.email);
    setInfo('profile-info-role', (data.role || 'user').charAt(0).toUpperCase() + (data.role || 'user').slice(1));

    // Format dates nicely
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

    // Watchlist count (from in-memory state if available)
    const watchlistCount = (typeof window.watchlistItems !== 'undefined' && Array.isArray(window.watchlistItems))
        ? window.watchlistItems.length
        : (typeof watchlistCache !== 'undefined' && Array.isArray(watchlistCache) ? watchlistCache.length : 0);
    setInfo('profile-info-watchlist', watchlistCount.toString());

    // Pre-fill the edit form
    const displayNameInput = document.getElementById('profile-edit-displayname');
    if (displayNameInput) displayNameInput.value = data.displayName || '';
}

async function handleProfileUpdate(event) {
    event.preventDefault();

    const token = localStorage.getItem('gmi_token');
    if (!token) return showToast('Please log in first.', 'error');

    const btn = document.getElementById('profile-edit-btn');
    const spinner = btn?.querySelector('.auth-btn-spinner');
    const label = btn?.querySelector('span');

    // Loading state
    if (spinner) spinner.style.display = 'block';
    if (label) label.textContent = 'Saving...';
    if (btn) btn.disabled = true;

    const displayName = document.getElementById('profile-edit-displayname')?.value.trim();

    try {
        const res = await fetch(`${AUTH_API}/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ displayName })
        });

        const data = await res.json();

        if (!res.ok) {
            showToast(data.error || 'Update failed.', 'error');
            return;
        }

        // Update local storage
        const user = JSON.parse(localStorage.getItem('gmi_user') || '{}');
        user.displayName = data.displayName;
        localStorage.setItem('gmi_user', JSON.stringify(user));

        // Refresh UI everywhere
        updateAuthUI(user);
        populateProfileUI(data);

        showToast('Profile updated successfully!', 'success');

    } catch (err) {
        console.error('Profile update error:', err);
        showToast('Network error. Please try again.', 'error');
    } finally {
        if (spinner) spinner.style.display = 'none';
        if (label) label.textContent = 'Save Changes';
        if (btn) btn.disabled = false;
    }
}

async function handlePasswordChange(event) {
    event.preventDefault();

    const token = localStorage.getItem('gmi_token');
    if (!token) return showToast('Please log in first.', 'error');

    const currentPassword = document.getElementById('profile-current-password')?.value;
    const newPassword = document.getElementById('profile-new-password')?.value;
    const confirmPassword = document.getElementById('profile-confirm-password')?.value;

    // Validate
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

    // Loading state
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

        // Clear form and show success
        document.getElementById('profile-password-form')?.reset();
        showToast('Password changed successfully!', 'success');

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
