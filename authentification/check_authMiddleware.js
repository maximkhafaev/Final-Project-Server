const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
    if (!req.headers.authorization?.startsWith('Bearer ')) return res.status(401).json({
        error: 'No authentication token was provided'
    });
    const token = req.headers.authorization.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userData = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            error: 'Authentication failed!'
        });
    }
}