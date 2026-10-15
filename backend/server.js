const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const { connectDB } = require('./database/connection');
const { seedAdmin } = require('./database/seed');
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
// CATCH-ALL — serve index.html for any non-API route
// ============================================
app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(__dirname, '../frontend/index.html'));
    }
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
        console.log('');
        console.log('╔════════════════════════════════════════════╗');
        console.log('║   GLOBAL MILITARY INTELLIGENCE SERVER      ║');
        console.log('╠════════════════════════════════════════════╣');
        console.log(`║   🌐 Server:  http://localhost:${PORT}     ║`);
        console.log('║   🍃 Database: MongoDB Atlas               ║');
        console.log('║   🛡️  Admin:   Pre-seeded from .env        ║');
        console.log('╚════════════════════════════════════════════╝');
        console.log('');
    });
}

startServer().catch(err => {
    console.error('🔴 Failed to start server:', err.message);
    process.exit(1);
});
