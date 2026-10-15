const express = require('express');
const Watchlist = require('../database/models/Watchlist');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// All watchlist routes require authentication
router.use(authMiddleware);

// ============================================
// GET ALL WATCHLIST ITEMS
// ============================================
router.get('/', async (req, res) => {
    try {
        const items = await Watchlist.find({ userId: req.user.id })
            .sort({ createdAt: -1 });

        res.json({ items });
    } catch (err) {
        console.error('Watchlist fetch error:', err);
        res.status(500).json({ error: 'Server error.' });
    }
});

// ============================================
// ADD TO WATCHLIST
// ============================================
router.post('/', async (req, res) => {
    try {
        const { targetType, targetId } = req.body;

        if (!targetType || !targetId) {
            return res.status(400).json({ error: 'targetType and targetId are required.' });
        }

        if (!['nation', 'conflict'].includes(targetType)) {
            return res.status(400).json({ error: 'targetType must be "nation" or "conflict".' });
        }

        // Check if already following
        const existing = await Watchlist.findOne({
            userId: req.user.id,
            targetType,
            targetId
        });

        if (existing) {
            return res.status(200).json({ message: 'Already following this item.', item: existing, alreadyFollowing: true });
        }

        const item = await Watchlist.create({
            userId: req.user.id,
            targetType,
            targetId
        });

        console.log(`⭐ User ${req.user.username} followed ${targetType}: ${targetId}`);
        res.status(201).json({ message: 'Added to watchlist.', item });
    } catch (err) {
        console.error('Watchlist add error:', err);
        res.status(500).json({ error: 'Server error.' });
    }
});

// ============================================
// REMOVE FROM WATCHLIST
// ============================================
router.delete('/:targetType/:targetId', async (req, res) => {
    try {
        const { targetType, targetId } = req.params;

        const result = await Watchlist.findOneAndDelete({
            userId: req.user.id,
            targetType,
            targetId
        });

        if (!result) {
            return res.json({ message: 'Item already removed from watchlist.' });
        }

        console.log(`💫 User ${req.user.username} unfollowed ${targetType}: ${targetId}`);
        res.json({ message: 'Removed from watchlist.' });
    } catch (err) {
        console.error('Watchlist remove error:', err);
        res.status(500).json({ error: 'Server error.' });
    }
});

module.exports = router;
