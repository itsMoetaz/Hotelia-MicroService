const User = require('../models/User');
const bcrypt = require('bcrypt');
const { validateUser, validateUpdateUser } = require('../validators/validators');
const mongoose = require('mongoose'); // Add this import



const getAllUsers = async (req, res) => {
    await User.find()
        .then(data => res.json(data))
        .catch(err => res.status(500).json({ error: "Failed to retrieve users", details: err }));
};
const getMe = async (req, res) => {
    try {
        // Make sure to populate workspaces field
        const user = await User.findById(req.user._id)
            .select('-password')
            .exec();

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(user);
    } catch (err) {
        console.error("getMe error details:", {
            message: err.message,
            stack: err.stack,
            user: req.user
        });
        return res.status(500).json({
            error: "Failed to retrieve user",
            details: err.message
        });
    }
};
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id)


        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(user);
    } catch (err) {
        res.status(500).json({ error: "Failed to retrieve user", details: err.message });
    }
};
const addUser = async (req, res) => {
    try {
        // Log the incoming request data to see what we're getting
        console.log('Request Body:', req.body);

        const { error, value } = validateUser(req.body);

        // Log the result of validation
        if (error) {
            console.log('Validation Errors:', error.details);
            return res.status(400).json({ errors: error.details.map(err => err.message) });
        }

        // Log the validated user data
        console.log('Validated User Data:', value);

        const { name, email, password, authentication_method, role, phone_number } = value;

        // Check if the email already exists in the database
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('Email already in use:', email);
            return res.status(400).json({ error: 'Email already in use.' });
        }

        // Log before hashing the password
        console.log('Hashing password for user:', email);

        const hashedPassword = await bcrypt.hash(password, 10);

        // Log the hashed password (avoid logging actual password in production)
        console.log('Password hashed successfully.');

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            authentication_method: authentication_method || 'local',
            role: role || 'user',
            phone_number: phone_number || '',
        });

        // Log the new user object before saving
        console.log('New User Object:', newUser);

        await newUser.save();

        // Log the successful user creation
        console.log('User created successfully:', newUser);

        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        // Log any error that occurs during the process
        console.error('Error occurred during user creation:', error);
        res.status(500).json({ error: error.message });
    }
};


const updateUser = async (req, res) => {
    try {


        const { id } = req.params;
        const { error, value } = validateUser(req.body);
        if (error) {
            return res.status(400).json({ errors: error.details.map(err => err.message) });
        }
        const { name, email, password, authentication_method, role, phone_number } = req.body;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.name = name || user.name;
        user.email = email || user.email;
        if (password) {
            user.password = await bcrypt.hash(password, 10);
            user.passwordChangedAt = Date.now();
        }
        user.authentication_method = authentication_method || user.authentication_method;
        user.role = role || user.role;
        user.phone_number = phone_number || user.phone_number;

        await user.save();
        res.status(200).json({ message: 'User updated successfully', user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const dropUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const changePassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { oldPassword, newPassword } = req.body;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        user.passwordChangedAt = Date.now();
        await user.save();
        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getLoggedUser = async (req, res, next) => {
    req.params.id = req.user._id;
    next();
};

const updateLoggedUserPassword = async (req, res, next) => {
    const user = await User.findByIdAndUpdate(
        req.user._id,
        { password: await bcrypt.hash(req.body.password, 10),
            passwordChangedAt: Date.now() },
        { new: true }
    );

    const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE_TIME }
    );

    res.json({ status: 'success' , message: 'Password updated successfully', token });

};

const UpdateLoggeduserData = async (req, res) => {
    try {
        const { error, value } = validateUpdateUser(req.body);
        if (error) {
            return res.status(400).json({ errors: error.details.map(err => err.message) });
        }

        const user = await User.findByIdAndUpdate(
            req.user._id,
            {
                name: value.name,
                email: value.email,
                phone_number: value.phone_number,
                bio: value.bio,
                profile_picture: value.profile_picture
            },
            { new: true }
        );

        res.json({ status: 'success', message: 'User updated successfully', user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteLoggedUser = async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.user._id, { isActive: false });
        res.status(200).json({ status: 'success', message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const getBasicUserInfo = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id)
            .select('name email profile_picture')
            .exec();

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(user);
    } catch (err) {
        return res.status(500).json({
            error: "Failed to retrieve user",
            details: err.message
        });
    }
};

const profilePictureUpload = async (req, res) => {
    try {
        if (!req.files || !req.files.profileImage) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const file = req.files.profileImage;

        // Upload to local storage or cloud service like AWS S3, Cloudinary, etc.
        // For example, with cloudinary:
        const result = await cloudinary.uploader.upload(file.tempFilePath, {
            folder: 'profile_pictures',
            public_id: `user_${req.user._id}`
        });

        // Update user profile in database
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { profile_picture: result.secure_url },
            { new: true }
        );

        res.json({
            success: true,
            profileUrl: result.secure_url,
            user: updatedUser
        });
    } catch (error) {
        console.error('Profile picture upload error:', error);
        res.status(500).json({ message: 'Error uploading profile picture' });
    }
};

const getUserProfile = async (req, res) => {
    try {
        const { userId } = req.params;

        // Default profile to return in case of errors
        const defaultProfile = {
            profile: {
                _id: userId,
                name: "User",
                email: "",
                bio: 'No bio available',
                profile_picture: null,
                createdAt: new Date().toISOString()
            }
        };

        try {
            // Find the user
            const user = await User.findById(userId).select('name email bio profile_picture createdAt');

            if (!user) {
                return res.status(200).json(defaultProfile);
            }

            // Just return the user profile without trying to count workspaces/projects/tasks
            return res.status(200).json({
                profile: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    bio: user.bio || 'No bio available',
                    profile_picture: user.profile_picture,
                    createdAt: user.createdAt
                }
            });

        } catch (userError) {
            console.error('Error fetching user:', userError);
            return res.status(200).json(defaultProfile);
        }

    } catch (error) {
        console.error('Error fetching user profile:', error);
        // Return default profile instead of error
        return res.status(200).json({
            profile: {
                _id: userId,
                name: "User",
                email: "",
                bio: 'No bio available',
                profile_picture: null,
                createdAt: new Date().toISOString()
            }
        });
    }
};

const getUserCount = async (req, res) => {
    try {
        const count = await User.countDocuments();
        res.status(200).json({ count });
    } catch (err) {
        res.status(500).json({ error: "Failed to retrieve user count", details: err });
    }
};


module.exports = {  getUserProfile, profilePictureUpload, getBasicUserInfo, getAllUsers, addUser, updateUser, dropUser, getUserById, changePassword, getLoggedUser, updateLoggedUserPassword, UpdateLoggeduserData, deleteLoggedUser,getMe ,getUserCount};

