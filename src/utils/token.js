const jwt = require('jsonwebtoken');
require("dotenv").config()

function generateToken(userId, email, role) {
    const payload = {
        userId: userId,
        email: email,
        role: role,
    };

    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
}

function verifyToken(token) {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        return null;
    }
}

module.exports = { generateToken, verifyToken };
