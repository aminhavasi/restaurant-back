const jwt = require('jsonwebtoken');
const sk = process.env.SECRET_KEY;
const auth = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).send('Access denied.No token provided.');
    try {
        const decoded = jwt.verify(token, sk);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(400).send('Invalid token.');
    }
};

module.exports = auth;
