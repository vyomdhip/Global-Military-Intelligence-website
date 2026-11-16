const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const jwt = require('jsonwebtoken');
const { connectDB } = require('./database/connection');
const { seedAdmin } = require('./database/seed');
const { maintenanceMiddleware } = require('./middleware/maintenance');
const authRoutes = require('./routes/auth');
const watchlistRoutes = require('./routes/watchlist');
const reportRoutes = require('./routes/reports');
const adminRoutes = require('./routes/admin');
const newsRoutes = require('./routes/news');

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// MIDDLEWARE
// ============================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================
// MAINTENANCE ROUTE GATE
// When maintenance mode is OFF, any direct attempt to access /maintenance
// or /maintenance.html (whether signed in or not) immediately redirects to /404
// ============================================
app.use((req, res, next) => {
    const cleanPath = req.path.toLowerCase().replace(/\/+$/, '');
    const isMaintenanceActive = (process.env.MAINTENANCE_MODE || '').toLowerCase() === 'true';
    if (!isMaintenanceActive && (cleanPath === '/maintenance' || cleanPath === '/maintenance.html')) {
        return res.redirect(302, '/404');
    }
    next();
});

// ============================================
// MAINTENANCE MODE GATE
// ============================================
app.use(maintenanceMiddleware);

// Helper: Check if incoming request carries valid admin authorization
function isReqAdmin(req) {
    function getCookie(name) {
        const raw = req.headers.cookie;
        if (!raw) return null;
        const match = raw.match(new RegExp('(?:^|;\\s*)' + name + '=([^;]*)'));
        return match ? decodeURIComponent(match[1]).replace(/^"(.*)"$/, '$1') : null;
    }

    const secret = process.env.JWT_SECRET || 'gmi-ultra-secret-defense-key-2026';

    // 1. Authorization: Bearer <token>
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        try {
            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, secret);
            if (decoded && decoded.role === 'admin') return true;
        } catch (err) {}
    }

    // 2. Cookie: gmi_admin_token
    const cookieToken = getCookie('gmi_admin_token');
    if (cookieToken) {
        try {
            const decoded = jwt.verify(cookieToken, secret);
            if (decoded && decoded.role === 'admin') return true;
        } catch (err) {}
    }

    // 3. Query Param: ?admin_token=
    if (req.query && req.query.admin_token) {
        try {
            const decoded = jwt.verify(req.query.admin_token, secret);
            if (decoded && decoded.role === 'admin') return true;
        } catch (err) {}
    }

    return false;
}

// ============================================
// 404 ERROR PAGE ROUTE
// Direct visits to /404 or /404.html immediately serve the dedicated 404 error page
// ============================================
app.get(['/404', '/404.html'], (req, res) => {
    res.status(404).sendFile(path.join(__dirname, '../frontend/404.html'));
});

// ============================================
// ADMIN ROUTE GATE
// When a non-admin attempts to access the admin dashboard (/admin, /admin-dashboard, /admin-panel),
// immediately serve the 404 error page directly with HTTP 404 status (zero loading screen).
// Valid admins are granted access and served index.html.
// ============================================
const adminPageRoutes = [
    '/admin',
    '/admin.html',
    '/admin/*',
    '/admin-dashboard',
    '/admin-dashboard.html',
    '/admin-dashboard/*',
    '/admin-panel',
    '/admin-panel.html',
    '/admin-panel/*'
];

app.get(adminPageRoutes, (req, res, next) => {
    if (req.path.startsWith('/api')) {
        return next();
    }
    if (!isReqAdmin(req)) {
        return res.status(404).sendFile(path.join(__dirname, '../frontend/404.html'));
    }
    if (req.query && req.query.admin_token) {
        res.setHeader('Set-Cookie', `gmi_admin_token=${encodeURIComponent(req.query.admin_token)}; Path=/; Max-Age=604800; SameSite=Lax`);
    }
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// ============================================
// STATIC FILES — serve the existing frontend
// ============================================
app.use(express.static(path.join(__dirname, '../frontend'), {
    extensions: ['html'],
    index: 'index.html'
}));

// ============================================
// API ROUTES
// ============================================
app.use('/api/auth', authRoutes);
app.use('/api/watchlist', watchlistRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/news', newsRoutes);

// ============================================
// ROUTE REDIRECTS (LEGACY TO CANONICAL)
// ============================================
app.get('/privacy', (req, res) => {
    res.redirect(301, '/privacy-policy');
});

app.get('/terms', (req, res) => {
    res.redirect(301, '/terms-conditions');
});

app.get('/maintenance.html', (req, res) => {
    const isMaintenanceActive = (process.env.MAINTENANCE_MODE || '').toLowerCase() === 'true';
    if (!isMaintenanceActive) {
        return res.redirect(302, '/404');
    }
    res.redirect(301, '/maintenance');
});

app.get('/maintenance', (req, res) => {
    const isMaintenanceActive = (process.env.MAINTENANCE_MODE || '').toLowerCase() === 'true';
    if (!isMaintenanceActive) {
        return res.redirect(302, '/404');
    }
    res.sendFile(path.join(__dirname, '../frontend/maintenance.html'));
});

// ============================================
// CATCH-ALL — serve index.html for any non-API route
// ============================================
app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(__dirname, '../frontend/index.html'));
    }
});

// 404 handler for unknown API routes
app.all('/api/*', (req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// ============================================
// START SERVER
// ============================================
async function startServer() {
    // Connect to MongoDB Atlas
    await connectDB();

    // Seed admin account
    await seedAdmin();

    app.listen(PORT, () => {
        const maintActive = (process.env.MAINTENANCE_MODE || '').toLowerCase() === 'true';
        console.log('');
        console.log('╔════════════════════════════════════════════╗');
        console.log('║   GLOBAL MILITARY INTELLIGENCE SERVER      ║');
        console.log('╠════════════════════════════════════════════╣');
        console.log(`║   🌐 Server:  http://localhost:${PORT}     ║`);
        console.log('║   🍃 Database: MongoDB Atlas               ║');
        console.log('║   🛡️  Admin:   Pre-seeded from .env        ║');
        console.log(`║   🔧 Maintenance: ${maintActive ? 'ACTIVE ⚠️' : 'OFF'}${maintActive ? '              ' : '                  '}║`);
        console.log('╚════════════════════════════════════════════╝');
        console.log('');
    });
}

startServer().catch(err => {
    console.error('🔴 Failed to start server:', err.message);
    process.exit(1);
});
