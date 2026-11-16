const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
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
// MAINTENANCE MODE GATE
// ============================================
app.use(maintenanceMiddleware);

// If maintenance mode is OFF, block direct access to /maintenance and redirect to 404
app.use((req, res, next) => {
    const isMaintenanceActive = (process.env.MAINTENANCE_MODE || '').toLowerCase() === 'true';
    if (!isMaintenanceActive && (req.path === '/maintenance' || req.path === '/maintenance.html')) {
        return res.redirect(302, '/404');
    }
    next();
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
