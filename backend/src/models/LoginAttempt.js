const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const LoginAttempt = sequelize.define('LoginAttempt', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING, allowNull: false },
    ip_address: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.STRING, allowNull: false }, // 'success' or 'failed'
});

module.exports = LoginAttempt;
