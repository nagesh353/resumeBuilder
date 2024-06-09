const jwt = require('jsonwebtoken');
const config = require('../config.json')


module.exports.generateToken = (id) => {
    return jwt.sign({ id }, config.secretKey, { expiresIn: '8h' });
};
