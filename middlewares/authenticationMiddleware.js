const jwt = require('jsonwebtoken');
const config = require('../config.json')

module.exports = (req, res, next) => {
    const token = req.headers?.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Please provide Token' });
    }
    try {
        const decoded = jwt.verify(token,config.secretKey);
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: 'Token has expired' });
        }
        return res.status(401).json({ message: 'Invalid token' });
    }
};
