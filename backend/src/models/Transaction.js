const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

// Modèle de Transaction pour l'E-Wallet
// Tous les montants sont en Francs CFA (FCFA)
const Transaction = sequelize.define('Transaction', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    uuid: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, allowNull: false, unique: true },
    
    // Le montant stocké est un entier (nombre entier) car le FCFA n'a pas de sous-unité quotidienne.
    // Utiliser DECIMAL(15,0) assure une précision financière parfaite en base de données.
    amount: { type: DataTypes.DECIMAL(15, 0), allowNull: false }, 
    currency: { type: DataTypes.STRING, defaultValue: 'XOF' }, // Code ISO pour le FCFA
    
    type: { type: DataTypes.STRING, allowNull: false }, // 'deposit', 'withdrawal', 'transfer'
    status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'pending' }, // 'pending', 'completed', 'failed'
    
    recipient_id: { type: DataTypes.UUID, allowNull: true }, // UUID du destinataire
    description: { type: DataTypes.STRING, allowNull: true },
});

User.hasMany(Transaction, { foreignKey: 'user_id' });
Transaction.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Transaction;
