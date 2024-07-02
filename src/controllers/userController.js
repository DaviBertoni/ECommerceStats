const { body, validationResult } = require('express-validator');
const User = require('../models/userModel');
const cache = require('../utils/cache');

exports.validateUser = [
    body('username').not().isEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Email must be valid'),
    body('email').custom(async (value, { req }) => {
        const existingUser = await User.findOne({ where: { email: value } });
        if (existingUser) {
            throw new Error('Email already in use');
        }
        return true;
    }),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

exports.getAllUsers = async (req, res) => {
    try {
        const cachedUsers = cache.get('users');
        if (cachedUsers) {
            return res.status(200).json(cachedUsers);
        }

        const users = await User.findAll();
        cache.set('users', users);

        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.createUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already in use' });
        }

        const newUser = await User.create({ username, email, password });
        res.status(201).json(newUser);
        cache.del('users');
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, password } = req.body;
        const user = await User.findByPk(id);
        if (user) {
            if (email !== user.email) {
                const existingUser = await User.findOne({ where: { email } });
                if (existingUser) {
                    return res.status(400).json({ error: 'Email already in use' });
                }
            }

            user.username = username;
            user.email = email;
            user.password = password;
            await user.save();

            cache.del('users');

            res.status(200).json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await User.destroy({ where: { id } });
        if (result) {
            cache.del('users');
            res.status(204).end();
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
