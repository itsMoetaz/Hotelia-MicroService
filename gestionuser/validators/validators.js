// validators/validators.js
const Joi = require('joi');

// Define the Joi schema for user validation
const userSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(50)
        .required()
        .messages({
            'string.min': 'Name must be at least 2 characters long',
            'string.max': 'Name cannot exceed 50 characters',
            'any.required': 'Name is required',
        }),

    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Invalid email format',
            'any.required': 'Email is required',
        }),

    password: Joi.string()
        .min(8)
        .required()
        .pattern(
            /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/,
            'password must contain at least one number and one special character'
        )
        .messages({
            'string.min': 'Password must be at least 8 characters long',
            'string.pattern.base': 'Password must contain at least one number and one special character',
            'any.required': 'Password is required',
        }),

    authentication_method: Joi.string()
        .valid('local', 'google', 'github')
        .default('local')
        .messages({
            'any.only': 'Invalid authentication method',
        }),

    role: Joi.string()
        .valid('user', 'admin')
        .default('user')
        .messages({
            'any.only': 'Invalid role',
        }),

    two_factor_enabled: Joi.boolean()
        .default(false),

    last_login: Joi.date()
        .optional(),

    profile_picture: Joi.string()
        .allow('') // Allow empty string
        .optional(),

    phone_number: Joi.string()
        .allow('') // Allow empty string
        .optional(),

    bio: Joi.string()
        .allow('') // Allow empty string
        .optional(),
});