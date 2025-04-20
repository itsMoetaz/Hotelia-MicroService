const express = require('express');
const router = express.Router();
const { profilePictureUpload, getBasicUserInfo, getMe, getAllUsers, addUser, updateUser, dropUser, getUserById, changePassword, getLoggedUser, updateLoggedUserPassword, UpdateLoggeduserData, deleteLoggedUser,getUserProfile } = require('../controllers/UserController');
const { protection, allowTo } =require('../controllers/AuthController');
const User = require('../models/User');

// admin
router.get('/', protection, allowTo('admin'), getAllUsers);
router.post('/addUser', protection, allowTo('admin'), addUser);
router.put('/updateUser/:id', protection, allowTo('admin'), updateUser);
router.get('/getUser/:id', protection, allowTo('admin'), getUserById);
router.delete('/dropUser/:id', protection, allowTo('admin'), dropUser);
router.put('/changePassword/:id', protection, allowTo('admin'), changePassword);

// user
router.post('/upload-profile-picture', protection, profilePictureUpload);
router.get('/basic/:id', protection, getBasicUserInfo);
router.get('/getMe',protection, getMe );
router.put('/updateMyPassword', protection, updateLoggedUserPassword);
router.put('/updateMe', protection, UpdateLoggeduserData);
router.put('/deleteMe', protection, deleteLoggedUser);



router.get('/:userId/profile', protection, getUserProfile);

router.get('/verified', protection, async (req, res) => {
    try {
        const search = req.query.search || '';
        const excludeUser = req.query.excludeUser; // Get the user ID to exclude

        const query = {
            isVerified: true,
            $or: [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ]
        };

        // If we have a user to exclude, add it to the query
        if (excludeUser) {
            query._id = { $ne: excludeUser }; // $ne means "not equal"
        }

        const users = await User.find(query)
            .select('name email profile_picture')
            .limit(10);

        res.json(users);
    } catch (error) {
        console.error('Error fetching verified users:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router