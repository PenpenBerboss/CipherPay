const User = require('../models/User');
const bcrypt = require('bcryptjs');
const totp = require('../utils/totp');
const { Op } = require('sequelize');

exports.register = async (userData) => {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    return await User.create({
        ...userData,
        password_hash: hashedPassword
    });
};

exports.findByEmail = async (email) => {
    return await User.findOne({ where: { email } });
};

exports.updateUser = async (user, data) => {
    return await user.update(data);
};
