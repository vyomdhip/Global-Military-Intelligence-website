const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    displayName: {
        type: String,
        default: ''
    },
    callsign: {
        type: String,
        default: ''
    },
    specialty: {
        type: String,
        default: 'High Command & Administration'
    },
    regionalFocus: {
        type: String,
        default: 'Global Theater'
    },
    bio: {
        type: String,
        default: ''
    },
    preferences: {
        type: Object,
        default: {}
    },
    lastLogin: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Admin', adminSchema);
