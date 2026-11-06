const jwt = require('jsonwebtoken');
const path = require('path');

/**
 * Maintenance Mode Middleware
 * 
 * When MAINTENANCE_MODE=true in .env:
 * - API requests return 503 JSON with Retry-After header
 * - HTML page requests serve the maintenance page with 503 status
 * - Admin users with a valid JWT are allowed through completely
 * - Auth login endpoints remain accessible so admins can authenticate
 */
function maintenanceMiddleware(req, res, next) {
    // Check if maintenance mode is active (re-read env each time for live toggling)
    const isMaintenanceActive = (process.env.MAINTENANCE_MODE || '').toLowerCase() === 'true';

    if (!isMaintenanceActive) {
        return next();
    }

    // Always allow admin auth login endpoint (so admins can log in during maintenance)
    if (req.path === '/api/auth/admin/login' && req.method === 'POST') {
        return next();
    }

    // Helper: extract cookie by name from req.headers.cookie
    function getCookie(name) {
        const raw = req.headers.cookie;
        if (!raw) return null;
        const match = raw.match(new RegExp('(?:^|;\\s*)' + name + '=([^;]*)'));
        return match ? decodeURIComponent(match[1]) : null;
    }

    // 1. Check Authorization: Bearer <token> (used by API fetch calls)
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        try {
            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            if (decoded && decoded.role === 'admin') {
                return next(); // Admin bypasses maintenance
            }
        } catch (err) {
            // Token invalid or expired — fall through
        }
    }

    // 2. Check Cookie: gmi_admin_token (used by browser page navigation/refreshes)
    const cookieToken = getCookie('gmi_admin_token');
    if (cookieToken) {
        try {
            const decoded = jwt.verify(cookieToken, process.env.JWT_SECRET);
            if (decoded && decoded.role === 'admin') {
                return next(); // Admin with cookie bypasses maintenance
            }
        } catch (err) {
            // Invalid or expired cookie
        }
    }

    // 3. Check query param: ?admin_token=... (used when logging in from maintenance page)
    if (req.query.admin_token) {
        try {
            const decoded = jwt.verify(req.query.admin_token, process.env.JWT_SECRET);
            if (decoded && decoded.role === 'admin') {
                // Set cookie so subsequent navigations don't need ?admin_token=
                res.setHeader('Set-Cookie', `gmi_admin_token=${encodeURIComponent(req.query.admin_token)}; Path=/; Max-Age=604800; SameSite=Lax`);
                return next();
            }
        } catch (err) {
            // Invalid token — fall through
        }
    }

    // Build maintenance info payload
    const maintenanceInfo = {
        maintenance: true,
        message: process.env.MAINTENANCE_MESSAGE || 'We are performing scheduled maintenance. Please check back soon.',
        eta: process.env.MAINTENANCE_ETA || null,
        contact: 'vyomdhip1132003@gmail.com'
    };

    // Set standard maintenance headers
    res.set('Retry-After', '3600');
    res.set('X-Maintenance-Mode', 'active');

    // API requests get JSON 503
    if (req.path.startsWith('/api/')) {
        return res.status(503).json(maintenanceInfo);
    }

    // Static asset requests (CSS, JS, images, fonts) — serve normally during maintenance
    // so the maintenance page itself can load its assets
    const ext = path.extname(req.path).toLowerCase();
    const staticExts = ['.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.woff', '.woff2', '.ttf', '.eot', '.map'];
    if (staticExts.includes(ext)) {
        return next();
    }

    // HTML page requests — serve the maintenance page
    return res.status(503).sendFile(path.join(__dirname, '../../frontend/maintenance.html'));
}

module.exports = { maintenanceMiddleware };

