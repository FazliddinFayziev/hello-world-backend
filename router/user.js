const express = require('express')
const router = express.Router();
const jwt = require('jsonwebtoken')
const { User } = require('../schemas/user');
const { isAdmin, verifyToken } = require('../middleware/user');
const { validateUser } = require('../functions/validate');

// =================================================>
// User INFO. Is user still present or no (GET)
// =================================================>

router.get('/userinfo', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        res.status(200).json({
            success: true,
            data: {
                userId: user.id,
                userName: user.userName,
                admin: user.admin,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error.' });
    }
});

// ===========================>
// Get All User (GET)
// ===========================>

router.get('/users', verifyToken, isAdmin, async (req, res, next) => {
    try {
        const users = await User.find();
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        next(error);
    }
});

// ===========================>
// Register New User (POST)
// ===========================>

router.post('/signup', verifyToken, isAdmin, async (req, res, next) => {
    try {
        const { userName, password } = req.body;

        // check validation of user
        const { error } = validateUser(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const newUser = await User.create({ userName, password });

        const token = jwt.sign(
            { userId: newUser.id, userName: newUser.userName },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.status(201).json({
            success: true,
            data: {
                userId: newUser.id,
                userName: newUser.userName,
                token: token,
            },
        });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ error: 'Username is already in use' });
        } else {
            next(err);
        }
    }
});

// ===========================>
// Login User (POST)
// ===========================>

router.post('/login', async (req, res, next) => {
    try {
        const { userName, password } = req.body;

        const user = await User.findOne({ userName: userName });

        // If user not found or password doesn't match, return an error
        if (!user || user.password !== password) {
            return res.status(401).json({
                success: false,
                message: 'Wrong details. Please check your credentials.',
            });
        }

        // If the user and password match, create and send the JWT token
        const token = jwt.sign(
            { userId: user.id, userName: user.userName, admin: user.admin },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.status(200).json({
            success: true,
            data: {
                userId: user.id,
                userName: user.userName,
                admin: user.admin,
                token: token,
            },
        });
    } catch (err) {
        next(err);
    }
});

// ===========================>
//  Edit USERS (PUT)
// ===========================>

router.put('/users/:userId', verifyToken, isAdmin, async (req, res, next) => {
    try {
        const { userId } = req.params;

        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found.',
            });
        }

        // Update the user's role to admin if admin is true, else set to regular user
        user.admin = !user.admin;
        await user.save();

        res.status(200).json({
            success: true,
            data: {
                userId: user.id,
                userName: user.userName,
                admin: user.admin,
            },
        });
    } catch (err) {
        next(err);
    }
});

// ===========================>
//  Delete USER (DELETE)
// ===========================>
router.delete('/users/:userId', verifyToken, isAdmin, async (req, res, next) => {
    try {
        const { userId } = req.params;

        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found.',
            });
        }

        // delete user
        const deletedUser = await User.findByIdAndDelete({ _id: userId });
        res.status(200).send(deletedUser);

    } catch (err) {
        next(err);
    }
});

module.exports = router;


