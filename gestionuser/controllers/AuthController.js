const jwt = require("jsonwebtoken");
const crypto = require('crypto');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const { validateUser } = require('../validators/validators');
const sendEmail = require('../utils/sendEmail');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const axios = require('axios');



exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: "Email ou mot de passe incorrect" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Email ou mot de passe incorrect" });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            {expiresIn: process.env.JWT_EXPIRE_TIME}
        );
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            domain: process.env.COOKIE_DOMAIN || 'localhost',
            path: '/',
        }).json({ message: "Connexion réussie",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,

            }
        });

    } catch (error) {
        res.status(500).json({ error: "Erreur serveur", details: error });
    }
};

exports.register = async (req, res) => {
    try {
        const { error, value } = validateUser(req.body);
        if (error) {
            return res.status(400).json({ errors: error.details.map(err => err.message) });
        }

        const { name, email, password, authentication_method, role, phone_number, bio } = value;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email déjà utilisé.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate verification token (6-digit code)
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedVerificationToken = crypto.createHash('sha256').update(verificationToken).digest('hex');

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            authentication_method: authentication_method || 'local',
            role: role || 'user',
            phone_number: phone_number || '',
            bio: bio ? bio.trim() : '',
            emailVerificationToken: hashedVerificationToken,
            emailVerificationExpires: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
            isVerified: false
        });

        await newUser.save();

        // Send verification email
        await sendEmail({
            email: newUser.email,
            name: newUser.name,
            subject: '[Planify] Vérification de votre adresse email',
            verificationToken: verificationToken,
            type: 'verification'
        });

        res.status(201).json({
            message: 'Utilisateur créé avec succès. Veuillez vérifier votre adresse email pour activer votre compte.',
            userId: newUser._id
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.logout = (req, res) => {
    res.clearCookie('token', {
        domain: process.env.COOKIE_DOMAIN || 'localhost',
        path: '/',
    }).json({ message: 'Déconnexion réussie' });
};

// exports.protection = async (req, res, next) => {
//     const token = req.cookies.token;
//     if (!token) {
//         return res.status(401).json({ error: 'Non authentifiéee. Veuillez vous connecter.' });
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         const user = await User.findById(decoded.id);

//         if (!user) {
//             return res.status(401).json({ error: 'Utilisateur non trouvé. Veuillez vous connecter.' });
//         }

//         if (user.passwordChangedAt) {
//             const passwordChangedTimestamp = parseInt(user.passwordChangedAt.getTime() / 1000, 10);
//             if (decoded.iat < passwordChangedTimestamp) {
//                 return res.status(401).json({ error: 'Mot de passe récemment changé. Veuillez vous reconnecter.' });
//             }
//         }

//         req.user = user;
//         next();
//     } catch (error) {
//         res.status(401).json({ error: 'Non authentifié. Veuillez vous connecter.' });
//     }
// }

exports.protection = async (req, res, next) => {
    console.log('En-têtes reçus :', req.headers);

    let token;
    // Vérifie l'en-tête Authorization
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
        console.log('Token extrait de l\'en-tête :', token);
    }
    // Vérifie le cookie comme fallback
    else if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
        console.log('Token extrait du cookie :', token);
    } else {
        console.log('Aucun token trouvé dans les en-têtes ou les cookies');
        return res.status(401).json({ error: 'Non authentifiéee. Veuillez vous connecter.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Token décodé :', decoded);
        const user = await User.findById(decoded.id);

        if (!user) {
            console.log('Utilisateur non trouvé pour ID :', decoded.id);
            return res.status(401).json({ error: 'Utilisateur non trouvé. Veuillez vous connecter.' });
        }

        if (user.passwordChangedAt) {
            const passwordChangedTimestamp = parseInt(user.passwordChangedAt.getTime() / 1000, 10);
            if (decoded.iat < passwordChangedTimestamp) {
                return res.status(401).json({ error: 'Mot de passe récemment changé. Veuillez vous reconnecter.' });
            }
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Erreur lors de la vérification du token :', error.message);
        res.status(401).json({ error: 'Non authentifié. Veuillez vous connecter.' });
    }
};

exports.allowTo = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Non authentifié. Veuillez vous connecter.' });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Non autorisé.' });
        }
        next();
    }
}

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé.' });
        }

        const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.passwordResetToken = hashedToken;
        user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

        await user.save();

        await sendEmail({
            email: user.email,
            name: user.name,
            subject: '[Planify] Réinitialisation du mot de passe',
            resetToken
        });

        res.status(200).json({ status:'succes', message: 'Code de réinitialisation envoyé à votre adresse email.' });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.verifyResetToken = async (req, res) => {
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.body.resetToken)
        .digest('hex');

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
        return res.status(400).json({ error: 'Token invalide ou expiré.' });
    }

    user.passwordResetVerified = true;
    await user.save();

    res.status(200).json({ status: 'success', message: 'Token vérifié avec succès.' });

};

exports.resetPassword = async (req, res) => {
    try {
        const { email, newPassword, resetToken } = req.body;

        console.log("Request body:", {
            emailProvided: !!email,
            passwordProvided: !!newPassword,
            tokenProvided: !!resetToken
        });

        // Validate inputs
        if (!email || !newPassword || !resetToken) {
            return res.status(400).json({
                error: "Tous les champs sont requis (email, newPassword, resetToken)."
            });
        }

        // Hash the token for comparison
        const hashedToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        const user = await User.findOne({
            email,
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(404).json({ error: "Utilisateur non trouvé ou token invalide." });
        }

        // Additional verification
        if (!user.passwordResetVerified) {
            return res.status(401).json({ error: "Le token n'a pas été vérifié." });
        }

        // Make sure password is valid before hashing
        if (typeof newPassword !== 'string' || newPassword.length < 6) {
            return res.status(400).json({
                error: "Le nouveau mot de passe doit contenir au moins 6 caractères."
            });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update user fields
        user.password = hashedPassword;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        user.passwordResetVerified = false;
        user.passwordChangedAt = new Date();

        await user.save();

        res.status(200).json({ status: "success", message: "Mot de passe réinitialisé avec succès." });
    } catch (error) {
        console.error("Reset password error:", error);
        res.status(500).json({ error: "Erreur lors de la réinitialisation du mot de passe." });
    }
};




exports.verifyEmail = async (req, res) => {
    try {
        const { userId, verificationToken } = req.body;

        // Hash the token for comparison
        const hashedToken = crypto
            .createHash('sha256')
            .update(verificationToken)
            .digest('hex');

        // Find the user with this token and check expiration
        const user = await User.findOne({
            _id: userId,
            emailVerificationToken: hashedToken,
            emailVerificationExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ error: 'Token invalide ou expiré.' });
        }

        // Update the user
        user.isVerified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationExpires = undefined;
        await user.save();

        // Generate and set JWT token
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            {expiresIn: process.env.JWT_EXPIRE_TIME}
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            domain: process.env.COOKIE_DOMAIN || 'localhost',
            path: '/',
        }).status(200).json({
            message: 'Adresse email vérifiée avec succès.',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};