const express = require('express');
const mongoose = require('mongoose');
const os = require('os');
const bcrypt = require('bcryptjs');
const User = require('../database/models/User');
const Admin = require('../database/models/Admin');
const Report = require('../database/models/Report');
const Watchlist = require('../database/models/Watchlist');
const { authMiddleware, adminOnly } = require('../middleware/auth');

const router = express.Router();

// All admin routes require authentication + admin role
router.use(authMiddleware);
router.use(adminOnly);

// Helper: Format uptime into human-readable string
function formatUptime(seconds) {
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    const parts = [];
    if (d > 0) parts.push(`${d}d`);
    if (h > 0 || d > 0) parts.push(`${h}h`);
    if (m > 0 || h > 0 || d > 0) parts.push(`${m}m`);
    parts.push(`${s}s`);
    return parts.join(' ');
}

// ============================================
// DASHBOARD STATISTICS
// ============================================
router.get('/stats', async (req, res) => {
    try {
        const [
            totalUsers,
            totalAdmins,
            totalReports,
            publicReports,
            totalWatchlistItems
        ] = await Promise.all([
            User.countDocuments(),
            Admin.countDocuments(),
            Report.countDocuments(),
            Report.countDocuments({ isPublic: true }),
            Watchlist.countDocuments()
        ]);

        // Recent activity — last 7 days
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const [newUsersThisWeek, newReportsThisWeek] = await Promise.all([
            User.countDocuments({ createdAt: { $gte: weekAgo } }),
            Report.countDocuments({ createdAt: { $gte: weekAgo } })
        ]);

        res.json({
            totalUsers,
            totalAdmins,
            totalReports,
            publicReports,
            privateReports: totalReports - publicReports,
            totalWatchlistItems,
            newUsersThisWeek,
            newReportsThisWeek
        });
    } catch (err) {
        console.error('Admin stats error:', err);
        res.status(500).json({ error: 'Server error loading statistics.' });
    }
});

// ============================================
// SYSTEM & DATABASE HEALTH
// ============================================
router.get('/system-health', async (req, res) => {
    try {
        // Measure real MongoDB Ping Latency
        let dbPingMs = null;
        let dbError = null;
        try {
            const start = Date.now();
            await mongoose.connection.db.admin().ping();
            dbPingMs = Date.now() - start;
        } catch (err) {
            dbError = err.message;
        }

        const stateNames = ['Disconnected', 'Connected', 'Connecting', 'Disconnecting'];
        const readyState = mongoose.connection.readyState;

        // Process & Memory Metrics
        const memUsage = process.memoryUsage();
        const heapUsedMB = (memUsage.heapUsed / 1024 / 1024).toFixed(1);
        const heapTotalMB = (memUsage.heapTotal / 1024 / 1024).toFixed(1);
        const rssMB = (memUsage.rss / 1024 / 1024).toFixed(1);
        const heapPercent = Math.round((memUsage.heapUsed / memUsage.heapTotal) * 100);

        // Host / OS Metrics
        const totalSysMemMB = Math.round(os.totalmem() / 1024 / 1024);
        const freeSysMemMB = Math.round(os.freemem() / 1024 / 1024);
        const usedSysMemMB = totalSysMemMB - freeSysMemMB;
        const sysMemPercent = Math.round((usedSysMemMB / (totalSysMemMB || 1)) * 100);

        // Collection Counts
        const [userCount, adminCount, reportCount, watchlistCount] = await Promise.all([
            User.countDocuments(),
            Admin.countDocuments(),
            Report.countDocuments(),
            Watchlist.countDocuments()
        ]);

        const uptimeSec = Math.floor(process.uptime());

        res.json({
            status: readyState === 1 ? 'healthy' : 'degraded',
            timestamp: new Date().toISOString(),
            database: {
                status: readyState === 1 ? 'Connected' : stateNames[readyState] || 'Unknown',
                readyState,
                pingLatencyMs: dbPingMs,
                name: mongoose.connection.name || 'gmi',
                host: (mongoose.connection.host || '').replace(/:.*@/, '@'), // sanitize if any
                error: dbError,
                collections: {
                    users: userCount,
                    admins: adminCount,
                    reports: reportCount,
                    watchlists: watchlistCount
                }
            },
            server: {
                uptimeSeconds: uptimeSec,
                uptimeFormatted: formatUptime(uptimeSec),
                nodeVersion: process.version,
                pid: process.pid,
                platform: process.platform,
                arch: process.arch,
                environment: process.env.NODE_ENV || 'development'
            },
            memory: {
                heapUsedMB: Number(heapUsedMB),
                heapTotalMB: Number(heapTotalMB),
                heapPercent,
                rssMB: Number(rssMB),
                systemTotalMemMB: totalSysMemMB,
                systemFreeMemMB: freeSysMemMB,
                systemMemPercent: Math.round(((totalSysMemMB - freeSysMemMB) / totalSysMemMB) * 100)
            },
            os: {
                cpuCount: os.cpus().length,
                cpuModel: os.cpus()[0]?.model || 'Standard CPU',
                loadAvg: os.loadavg()
            }
        });
    } catch (err) {
        console.error('System health error:', err);
        res.status(500).json({ error: 'Failed to inspect system health.' });
    }
});

// ============================================
// REAL RECENT ACTIVITY AUDIT TRAIL
// ============================================
router.get('/activity', async (req, res) => {
    try {
        const [
            recentUsers,
            recentLogins,
            recentAdminLogins,
            recentReports
        ] = await Promise.all([
            User.find()
                .sort({ createdAt: -1 })
                .limit(10)
                .select('username email displayName createdAt')
                .lean(),
            User.find({ lastLogin: { $ne: null } })
                .sort({ lastLogin: -1 })
                .limit(10)
                .select('username displayName lastLogin')
                .lean(),
            Admin.find({ lastLogin: { $ne: null } })
                .sort({ lastLogin: -1 })
                .limit(5)
                .select('username displayName lastLogin')
                .lean(),
            Report.find()
                .sort({ updatedAt: -1 })
                .limit(12)
                .populate('userId', 'username displayName')
                .select('title isPublic createdAt updatedAt userId')
                .lean()
        ]);

        const events = [];

        // 1. User Registrations
        recentUsers.forEach(u => {
            if (u.createdAt) {
                events.push({
                    id: `reg-${u._id}`,
                    type: 'user_register',
                    category: 'User',
                    title: 'New Analyst Enrolled',
                    description: `Account created for "${u.displayName || u.username}" (@${u.username}) with email ${u.email}`,
                    timestamp: u.createdAt,
                    badge: 'REGISTRATION',
                    badgeColor: 'blue',
                    meta: { userId: u._id, username: u.username }
                });
            }
        });

        // 2. User Logins
        recentLogins.forEach(u => {
            if (u.lastLogin) {
                events.push({
                    id: `login-${u._id}-${new Date(u.lastLogin).getTime()}`,
                    type: 'user_login',
                    category: 'Auth',
                    title: 'Analyst Session Active',
                    description: `Analyst "${u.displayName || u.username}" authenticated into intel workspace`,
                    timestamp: u.lastLogin,
                    badge: 'SESSION',
                    badgeColor: 'cyan',
                    meta: { userId: u._id, username: u.username }
                });
            }
        });

        // 3. Admin Logins
        recentAdminLogins.forEach(a => {
            if (a.lastLogin) {
                events.push({
                    id: `admin-login-${a._id}-${new Date(a.lastLogin).getTime()}`,
                    type: 'admin_login',
                    category: 'Security',
                    title: 'Command Center Access',
                    description: `Administrator "${a.displayName || a.username}" authenticated with elevated privileges`,
                    timestamp: a.lastLogin,
                    badge: 'ADMIN',
                    badgeColor: 'gold',
                    meta: { adminId: a._id, username: a.username }
                });
            }
        });

        // 4. Reports Created / Updated
        recentReports.forEach(r => {
            const authorName = r.userId ? (r.userId.displayName || r.userId.username) : 'System';
            const isCreation = r.createdAt && r.updatedAt && Math.abs(new Date(r.createdAt) - new Date(r.updatedAt)) < 2000;
            events.push({
                id: `report-${r._id}-${new Date(r.updatedAt || r.createdAt).getTime()}`,
                type: isCreation ? 'report_created' : 'report_updated',
                category: 'Intelligence',
                title: isCreation ? 'Intel Report Published' : 'Intel Report Modified',
                description: `"${r.title}" by ${authorName} (${r.isPublic ? 'Public' : 'Private Archive'})`,
                timestamp: r.updatedAt || r.createdAt,
                badge: r.isPublic ? 'PUBLIC' : 'INTERNAL',
                badgeColor: r.isPublic ? 'green' : 'gray',
                meta: { reportId: r._id, title: r.title, isPublic: r.isPublic }
            });
        });

        // Sort chronologically (newest first)
        events.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        // Return up to 25 events
        res.json({
            activities: events.slice(0, 25),
            total: events.length
        });

    } catch (err) {
        console.error('Admin activity audit error:', err);
        res.status(500).json({ error: 'Server error querying activity log.' });
    }
});

// ============================================
// LIST ALL USERS (paginated, searchable, sortable, filterable)
// ============================================
router.get('/users', async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 15));
        const skip = (page - 1) * limit;
        const search = req.query.search || '';
        const sort = req.query.sort || 'newest';
        const status = req.query.status || 'all';

        const query = {};

        // Search matching
        if (search.trim()) {
            query.$or = [
                { username: { $regex: search.trim(), $options: 'i' } },
                { email: { $regex: search.trim(), $options: 'i' } },
                { displayName: { $regex: search.trim(), $options: 'i' } }
            ];
        }

        // Status filtering
        if (status === 'active') {
            const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
            query.lastLogin = { $gte: thirtyDaysAgo };
        } else if (status === 'inactive') {
            const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
            query.$or = [
                { lastLogin: null },
                { lastLogin: { $lt: thirtyDaysAgo } }
            ];
        }

        let sortObj;
        switch (sort) {
            case 'oldest': sortObj = { createdAt: 1 }; break;
            case 'username': sortObj = { username: 1 }; break;
            case 'activity': sortObj = { lastLogin: -1 }; break;
            default: sortObj = { createdAt: -1 };
        }

        const [users, total] = await Promise.all([
            User.find(query)
                .select('username email displayName createdAt lastLogin')
                .sort(sortObj)
                .skip(skip)
                .limit(limit)
                .lean(),
            User.countDocuments(query)
        ]);

        // Enrich with real report counts and watchlist counts
        const userIds = users.map(u => u._id);
        const [reportCounts, watchlistCounts] = await Promise.all([
            Report.aggregate([
                { $match: { userId: { $in: userIds } } },
                { $group: { _id: '$userId', count: { $sum: 1 } } }
            ]),
            Watchlist.aggregate([
                { $match: { userId: { $in: userIds } } },
                { $group: { _id: '$userId', count: { $sum: 1 } } }
            ])
        ]);

        const reportMap = {};
        reportCounts.forEach(r => { reportMap[r._id.toString()] = r.count; });
        const watchlistMap = {};
        watchlistCounts.forEach(w => { watchlistMap[w._id.toString()] = w.count; });

        const enriched = users.map(u => ({
            ...u,
            reportCount: reportMap[u._id.toString()] || 0,
            watchlistCount: watchlistMap[u._id.toString()] || 0
        }));

        res.json({
            users: enriched,
            total,
            page,
            totalPages: Math.ceil(total / limit) || 1
        });
    } catch (err) {
        console.error('Admin users list error:', err);
        res.status(500).json({ error: 'Server error querying users.' });
    }
});

// ============================================
// GET SINGLE USER DETAIL WITH REPORTS
// ============================================
router.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select('username email displayName createdAt lastLogin')
            .lean();

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        const [reportCount, watchlistCount, userReports] = await Promise.all([
            Report.countDocuments({ userId: user._id }),
            Watchlist.countDocuments({ userId: user._id }),
            Report.find({ userId: user._id })
                .select('title isPublic createdAt updatedAt')
                .sort({ updatedAt: -1 })
                .limit(10)
                .lean()
        ]);

        res.json({
            ...user,
            reportCount,
            watchlistCount,
            reports: userReports
        });
    } catch (err) {
        console.error('Admin user detail error:', err);
        res.status(500).json({ error: 'Server error querying user detail.' });
    }
});

// ============================================
// UPDATE USER PROFILE OR PASSWORD (ADMIN ACTION)
// ============================================
router.put('/users/:id', async (req, res) => {
    try {
        const { displayName, password } = req.body;
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        if (displayName !== undefined) {
            user.displayName = displayName.trim();
        }

        if (password) {
            if (password.length < 6) {
                return res.status(400).json({ error: 'Password must be at least 6 characters.' });
            }
            user.password = bcrypt.hashSync(password, 12);
        }

        await user.save();
        console.log(`🛡️ Admin ${req.user.username} updated profile for user "${user.username}"`);

        res.json({
            message: `User "${user.username}" updated successfully.`,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                displayName: user.displayName,
                lastLogin: user.lastLogin
            }
        });
    } catch (err) {
        console.error('Admin update user error:', err);
        res.status(500).json({ error: 'Server error updating user.' });
    }
});

// ============================================
// DELETE USER (cascade: reports + watchlist)
// ============================================
router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // Cascade delete
        const [deletedReports, deletedWatchlist] = await Promise.all([
            Report.deleteMany({ userId: user._id }),
            Watchlist.deleteMany({ userId: user._id })
        ]);

        await User.findByIdAndDelete(user._id);

        console.log(`🛡️ Admin ${req.user.username} deleted user "${user.username}" (reports: ${deletedReports.deletedCount}, watchlist: ${deletedWatchlist.deletedCount})`);

        res.json({
            message: `User "${user.username}" deleted successfully.`,
            deletedReports: deletedReports.deletedCount,
            deletedWatchlist: deletedWatchlist.deletedCount
        });
    } catch (err) {
        console.error('Admin user delete error:', err);
        res.status(500).json({ error: 'Server error deleting user.' });
    }
});

// ============================================
// LIST ALL REPORTS (paginated, searchable, filtered)
// ============================================
router.get('/reports', async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 15));
        const skip = (page - 1) * limit;
        const search = req.query.search || '';
        const filter = req.query.filter || 'all'; // all, public, private
        const sort = req.query.sort || 'updated';

        const query = {};
        if (search.trim()) {
            query.title = { $regex: search.trim(), $options: 'i' };
        }
        if (filter === 'public') query.isPublic = true;
        if (filter === 'private') query.isPublic = false;

        let sortObj = { updatedAt: -1 };
        if (sort === 'oldest') sortObj = { createdAt: 1 };
        if (sort === 'title') sortObj = { title: 1 };

        const [reports, total] = await Promise.all([
            Report.find(query)
                .select('title content userId isPublic createdAt updatedAt widgets')
                .sort(sortObj)
                .skip(skip)
                .limit(limit)
                .lean(),
            Report.countDocuments(query)
        ]);

        // Resolve author names
        const userIds = [...new Set(reports.map(r => r.userId.toString()))];
        const [users, admins] = await Promise.all([
            User.find({ _id: { $in: userIds } }).select('username displayName').lean(),
            Admin.find({ _id: { $in: userIds } }).select('username displayName').lean()
        ]);
        const authorMap = {};
        [...users, ...admins].forEach(u => {
            authorMap[u._id.toString()] = {
                name: u.displayName || u.username,
                username: u.username
            };
        });

        const enriched = reports.map(r => {
            const authorInfo = authorMap[r.userId.toString()] || { name: 'Unknown Analyst', username: 'unknown' };
            return {
                _id: r._id,
                title: r.title,
                excerpt: (r.content || '').replace(/[#*_`>\-\[\]()!]/g, '').substring(0, 140).trim() || 'No text summary provided.',
                author: authorInfo.name,
                authorUsername: authorInfo.username,
                authorId: r.userId,
                isPublic: r.isPublic,
                widgetCount: (r.widgets || []).length,
                createdAt: r.createdAt,
                updatedAt: r.updatedAt
            };
        });

        res.json({
            reports: enriched,
            total,
            page,
            totalPages: Math.ceil(total / limit) || 1
        });
    } catch (err) {
        console.error('Admin reports list error:', err);
        res.status(500).json({ error: 'Server error querying reports.' });
    }
});

// ============================================
// GET SINGLE REPORT DETAIL (FOR PREVIEW MODAL)
// ============================================
router.get('/reports/:id', async (req, res) => {
    try {
        const report = await Report.findById(req.params.id).lean();
        if (!report) {
            return res.status(404).json({ error: 'Report not found.' });
        }

        // Author details
        const [user, admin] = await Promise.all([
            User.findById(report.userId).select('username displayName email').lean(),
            Admin.findById(report.userId).select('username displayName email').lean()
        ]);
        const author = user || admin || { username: 'Unknown', displayName: 'Unknown' };

        res.json({
            ...report,
            authorName: author.displayName || author.username,
            authorUsername: author.username,
            authorEmail: author.email
        });
    } catch (err) {
        console.error('Admin report detail error:', err);
        res.status(500).json({ error: 'Server error querying report detail.' });
    }
});

// ============================================
// TOGGLE REPORT VISIBILITY
// ============================================
router.put('/reports/:id/visibility', async (req, res) => {
    try {
        const report = await Report.findById(req.params.id);
        if (!report) {
            return res.status(404).json({ error: 'Report not found.' });
        }

        // If explicit value passed in body, use it; else toggle
        if (typeof req.body.isPublic === 'boolean') {
            report.isPublic = req.body.isPublic;
        } else {
            report.isPublic = !report.isPublic;
        }
        await report.save();

        console.log(`🛡️ Admin ${req.user.username} set report "${report.title}" to ${report.isPublic ? 'public' : 'private'}`);

        res.json({
            message: `Report visibility updated to ${report.isPublic ? 'Public' : 'Private'}.`,
            isPublic: report.isPublic
        });
    } catch (err) {
        console.error('Admin report visibility error:', err);
        res.status(500).json({ error: 'Server error updating visibility.' });
    }
});

// ============================================
// DELETE ANY REPORT
// ============================================
router.delete('/reports/:id', async (req, res) => {
    try {
        const report = await Report.findByIdAndDelete(req.params.id);
        if (!report) {
            return res.status(404).json({ error: 'Report not found.' });
        }

        console.log(`🛡️ Admin ${req.user.username} deleted report "${report.title}"`);
        res.json({ message: `Report "${report.title}" deleted.` });
    } catch (err) {
        console.error('Admin report delete error:', err);
        res.status(500).json({ error: 'Server error deleting report.' });
    }
});

module.exports = router;
