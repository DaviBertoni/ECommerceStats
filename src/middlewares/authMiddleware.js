const { verifyToken } = require('../utils/token');

module.exports = (roles = []) => {
    return (req, res, next) => {
        const authHeader = req.header('Authorization');
        if (!authHeader) {
            return res.status(401).json({ error: 'Access Denied - Missing Authorization Header' });
        }

        const token = authHeader.split(' ')[1]; 

        if (!token) {
            return res.status(401).json({ error: 'Access Denied - Missing Token' });
        }

        const verified = verifyToken(token);
        if (!verified) {
            return res.status(400).json({ error: 'Invalid Token' });
        }

        if (roles.length && !roles.includes(verified.role)) {
            return res.status(403).json({ error: 'Forbidden - Role not allowed' });
        }

        req.user = verified; 
        next();
    };
};
