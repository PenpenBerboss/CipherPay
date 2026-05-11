const jwt = require('jsonwebtoken');

exports.generateToken = (user) => {
    return jwt.sign(
        { id: user.id, uuid: user.uuid },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );
};

exports.verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};
