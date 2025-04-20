const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: function () {
                return this.authentication_method !== 'google';
            },
        },
        passwordChangedAt: {
            type: Date,
        },
        passwordResetToken: {
            type: String,
        },
        passwordResetExpires: {
            type: Date,
        },
        passwordResetVerified: {
            type: Boolean,
            default: false,
        },

        role: {
            type: String,
            enum: ['user', 'admin'], // Add more roles if needed
            default: 'user',
        },

        last_login: {
            type: Date,
        },

        phone_number: {
            type: String,
            default: '',
        },

        isVerified: {
            type: Boolean,
            default: false
        },

        emailVerificationToken: String,
        emailVerificationExpires: Date,
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('User', userSchema);