const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../database/models/User');
const Admin = require('../database/models/Admin');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// ============================================
// USER REGISTRATION
// ============================================
router.post('/user/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validation
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'All fields are required.' });
        }
        if (username.length < 3) {
            return res.status(400).json({ error: 'Username must be at least 3 characters.' });
        }
        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters.' });
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ error: 'Invalid email format.' });
        }

        // Check if username or email already exists
        const existingUser = await User.findOne({
            $or: [{ username }, { email }]
        });
        if (existingUser) {
            return res.status(409).json({ error: 'Username or email already taken.' });
        }

        // Hash password and create user
        const hashedPassword = bcrypt.hashSync(password, 12);
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            displayName: username
        });

        // Generate JWT
        const token = jwt.sign(
            { id: newUser._id, username, role: 'user' },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        console.log(`✅ New user registered: ${username}`);
        res.status(201).json({
            message: 'Account created successfully.',
            token,
            user: { id: newUser._id, username, email, role: 'user', displayName: username }
        });

    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ error: 'Server error. Please try again.' });
    }
});

// ============================================
// USER LOGIN
// ============================================
router.post('/user/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required.' });
        }

        const user = await User.findOne({
            $or: [{ username }, { email: username }]
        });

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }

        const validPassword = bcrypt.compareSync(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Generate JWT
        const token = jwt.sign(
            { id: user._id, username: user.username, role: 'user' },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        console.log(`✅ User logged in: ${user.username}`);
        res.json({
            message: 'Login successful.',
            token,
            user: { id: user._id, username: user.username, email: user.email, role: 'user', displayName: user.displayName }
        });

    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Server error. Please try again.' });
    }
});

// ============================================
// ADMIN LOGIN
// ============================================
router.post('/admin/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required.' });
        }

        const admin = await Admin.findOne({
            $or: [{ username }, { email: username }]
        });

        if (!admin) {
            return res.status(401).json({ error: 'Invalid admin credentials.' });
        }

        const validPassword = bcrypt.compareSync(password, admin.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid admin credentials.' });
        }

        // Update last login
        admin.lastLogin = new Date();
        await admin.save();

        // Generate JWT
        const token = jwt.sign(
            { id: admin._id, username: admin.username, role: 'admin' },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        console.log(`🛡️ Admin logged in: ${admin.username}`);
        res.json({
            message: 'Admin login successful.',
            token,
            user: { id: admin._id, username: admin.username, email: admin.email, role: 'admin', displayName: admin.displayName }
        });

    } catch (err) {
        console.error('Admin login error:', err);
        res.status(500).json({ error: 'Server error. Please try again.' });
    }
});

// ============================================
// GET PROFILE (requires auth)
// ============================================
router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const Model = req.user.role === 'admin' ? Admin : User;
        const user = await Model.findById(req.user.id).select('username email displayName callsign specialty regionalFocus bio preferences createdAt lastLogin');

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        res.json({
            id: user._id,
            username: user.username,
            email: user.email,
            displayName: user.displayName,
            callsign: user.callsign || '',
            specialty: user.specialty || 'Strategic Defense Intelligence',
            regionalFocus: user.regionalFocus || 'Global Theater',
            bio: user.bio || '',
            preferences: user.preferences || {},
            createdAt: user.createdAt,
            lastLogin: user.lastLogin,
            role: req.user.role
        });

    } catch (err) {
        console.error('Profile error:', err);
        res.status(500).json({ error: 'Server error.' });
    }
});

// ============================================
// UPDATE PROFILE (requires auth)
// ============================================
router.put('/profile', authMiddleware, async (req, res) => {
    try {
        const { displayName, callsign, specialty, regionalFocus, bio, preferences, currentPassword, newPassword } = req.body;
        const Model = req.user.role === 'admin' ? Admin : User;

        const updateData = {};
        if (displayName !== undefined) updateData.displayName = displayName;
        if (callsign !== undefined) updateData.callsign = callsign;
        if (specialty !== undefined) updateData.specialty = specialty;
        if (regionalFocus !== undefined) updateData.regionalFocus = regionalFocus;
        if (bio !== undefined) updateData.bio = bio;
        if (preferences !== undefined) updateData.preferences = preferences;

        if (Object.keys(updateData).length > 0) {
            await Model.findByIdAndUpdate(req.user.id, updateData);
        }

        // Handle password change if requested
        if (currentPassword && newPassword) {
            if (newPassword.length < 6) {
                return res.status(400).json({ error: 'New password must be at least 6 characters.' });
            }

            const user = await Model.findById(req.user.id);
            const validPassword = bcrypt.compareSync(currentPassword, user.password);
            if (!validPassword) {
                return res.status(401).json({ error: 'Current password is incorrect.' });
            }

            const hashedPassword = bcrypt.hashSync(newPassword, 12);
            await Model.findByIdAndUpdate(req.user.id, { password: hashedPassword });
            console.log(`🔐 User ${req.user.username} changed their password`);
        }

        const user = await Model.findById(req.user.id).select('username email displayName callsign specialty regionalFocus bio preferences createdAt lastLogin');

        res.json({
            id: user._id,
            username: user.username,
            email: user.email,
            displayName: user.displayName,
            callsign: user.callsign || '',
            specialty: user.specialty || 'Strategic Defense Intelligence',
            regionalFocus: user.regionalFocus || 'Global Theater',
            bio: user.bio || '',
            preferences: user.preferences || {},
            createdAt: user.createdAt,
            lastLogin: user.lastLogin,
            role: req.user.role,
            message: 'Profile updated successfully.'
        });

    } catch (err) {
        console.error('Update profile error:', err);
        res.status(500).json({ error: 'Server error.' });
    }
});

module.exports = router;
