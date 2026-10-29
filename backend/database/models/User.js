const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
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
        default: 'Strategic Defense Intelligence'
    },
    regionalFocus: {
        type: String,
        default: 'Global Defense'
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
    timestamps: true // adds createdAt and updatedAt automatically
});

module.exports = mongoose.model('User', userSchema);
