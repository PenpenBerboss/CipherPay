const crypto = require('crypto');
const pool = require('../config/db');
const ActivityLog = require('../models/ActivityLog');
const NotificationService = require('./notification.service');

const SIGNING_SECRET = process.env.TRANSACTION_SIGNING_SECRET || process.env.JWT_SECRET || 'cipherpay-transaction-secret';
const MAX_AMOUNT = 999999999999999;

const normalizeAmount = (amount) => {
  const numericAmount = Number(amount);
  if (!Number.isFinite(numericAmount) || numericAmount <= 0 || numericAmount > MAX_AMOUNT) {
    throw { status: 422, message: 'Montant invalide.' };
  }
  return Math.round(numericAmount * 100) / 100;
};

const buildTransactionHash = ({ transactionId, senderId, receiverId, amount, description, createdAt, kind }) => {
  const payload = [
    transactionId,
    senderId,
    receiverId,
    String(amount),
    'XOF',
    kind,
    description || '',
    createdAt,
  ].join('|');

  return crypto.createHash('sha256').update(payload).digest('hex');
};

const buildTransactionSignature = ({ hash, senderId, receiverId, amount, createdAt, kind }) => {
  return crypto
    .createHmac('sha256', SIGNING_SECRET)
    .update(`${hash}|${senderId}|${receiverId}|${amount}|${kind}|${createdAt}`)
    .digest('hex');
};

const buildParticipant = (user) => ({
  id: user.id,
  email: user.email,
  firstName: user.first_name,
  lastName: user.last_name,
});

const buildTransactionResponse = (transaction, userId) => {
  const direction = transaction.sender_id === userId ? 'sent' : 'received';
  const isDeposit = transaction.transaction_kind === 'deposit';
  const counterparty = isDeposit
    ? buildParticipant({
        id: transaction.sender_id,
        email: transaction.sender_email,
        first_name: transaction.sender_first_name,
        last_name: transaction.sender_last_name,
      })
    : direction === 'sent'
      ? buildParticipant({
          id: transaction.receiver_id,
          email: transaction.receiver_email,
          first_name: transaction.receiver_first_name,
          last_name: transaction.receiver_last_name,
        })
      : buildParticipant({
          id: transaction.sender_id,
          email: transaction.sender_email,
          first_name: transaction.sender_first_name,
          last_name: transaction.sender_last_name,
        });

  return {
    id: transaction.id,
    senderId: transaction.sender_id,
    receiverId: transaction.receiver_id,
    amount: Number(transaction.amount),
    description: transaction.description,
    status: transaction.status,
    transactionKind: transaction.transaction_kind,
    hash: transaction.hash,
    signature: transaction.signature,
    createdAt: transaction.created_at,
    sender: buildParticipant({
      id: transaction.sender_id,
      email: transaction.sender_email,
      first_name: transaction.sender_first_name,
      last_name: transaction.sender_last_name,
    }),
    receiver: buildParticipant({
      id: transaction.receiver_id,
      email: transaction.receiver_email,
      first_name: transaction.receiver_first_name,
      last_name: transaction.receiver_last_name,
    }),
    direction: isDeposit ? 'received' : direction,
    counterparty,
  };
};

class TransactionService {
  static async createTransfer({ senderId, receiverEmail, amount, description, ipAddress = null, userAgent = null }) {
    const normalizedAmount = normalizeAmount(amount);
    const cleanDescription = description ? String(description).trim().slice(0, 200) : null;

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const [senderRows] = await connection.execute(
        `SELECT id, email, balance, first_name, last_name
         FROM users
         WHERE id = ?
         FOR UPDATE`,
        [senderId]
      );

      const sender = senderRows[0];
      if (!sender) {
        throw { status: 404, message: 'Compte expéditeur introuvable.' };
      }

      const [receiverRows] = await connection.execute(
        `SELECT id, email, balance, first_name, last_name
         FROM users
         WHERE email = ?
         FOR UPDATE`,
        [receiverEmail]
      );

      const receiver = receiverRows[0];
      if (!receiver) {
        throw { status: 404, message: 'Destinataire introuvable.' };
      }

      if (receiver.id === sender.id) {
        throw { status: 400, message: 'Le transfert vers le même compte est interdit.' };
      }

      const senderBalance = Number(sender.balance || 0);
      if (senderBalance < normalizedAmount) {
        throw { status: 400, message: 'Solde insuffisant.' };
      }

      const transactionId = crypto.randomUUID();
      const createdAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
      const hash = buildTransactionHash({
        transactionId,
        senderId: sender.id,
        receiverId: receiver.id,
        amount: normalizedAmount,
        description: cleanDescription,
        createdAt,
        kind: 'transfer',
      });
      const signature = buildTransactionSignature({
        hash,
        senderId: sender.id,
        receiverId: receiver.id,
        amount: normalizedAmount,
        createdAt,
        kind: 'transfer',
      });

      await connection.execute(
        `INSERT INTO transactions (id, sender_id, receiver_id, amount, description, status, transaction_kind, hash, signature, created_at)
         VALUES (?, ?, ?, ?, ?, 'completed', 'transfer', ?, ?, ?)`,
        [
          transactionId,
          sender.id,
          receiver.id,
          normalizedAmount,
          cleanDescription,
          hash,
          signature,
          createdAt,
        ]
      );

      await connection.execute(
        `UPDATE users
         SET balance = balance - ?
         WHERE id = ?`,
        [normalizedAmount, sender.id]
      );

      await connection.execute(
        `UPDATE users
         SET balance = balance + ?
         WHERE id = ?`,
        [normalizedAmount, receiver.id]
      );

      await connection.execute(
        `INSERT INTO activity_logs (user_id, action, ip_address, user_agent, details)
         VALUES (?, ?, ?, ?, ?)`,
        [
          sender.id,
          'TRANSFER_SENT',
          ipAddress,
          userAgent,
          JSON.stringify({
            transactionId,
            receiverId: receiver.id,
            receiverEmail: receiver.email,
            amount: normalizedAmount,
          }),
        ]
      );

      await connection.execute(
        `INSERT INTO activity_logs (user_id, action, ip_address, user_agent, details)
         VALUES (?, ?, ?, ?, ?)`,
        [
          receiver.id,
          'TRANSFER_RECEIVED',
          ipAddress,
          userAgent,
          JSON.stringify({
            transactionId,
            senderId: sender.id,
            senderEmail: sender.email,
            amount: normalizedAmount,
          }),
        ]
      );

      await NotificationService.create({
        userId: sender.id,
        type: 'transaction',
        title: 'Transfert envoyé',
        message: `Votre transfert de ${normalizedAmount.toLocaleString()} FCFA vers ${receiver.email} a été confirmé.`,
      });

      await NotificationService.create({
        userId: receiver.id,
        type: 'transaction',
        title: 'Transfert reçu',
        message: `Vous avez reçu ${normalizedAmount.toLocaleString()} FCFA de ${sender.email}.`,
      });

      await connection.commit();

      const senderAfter = senderBalance - normalizedAmount;
      const receiverAfter = Number(receiver.balance || 0) + normalizedAmount;

      return {
        message: 'Transfert effectué avec succès.',
        transaction: {
          id: transactionId,
          senderId: sender.id,
          receiverId: receiver.id,
          amount: normalizedAmount,
          currency: 'XOF',
          description: cleanDescription,
          status: 'completed',
          transactionKind: 'transfer',
          hash,
          signature,
          createdAt,
          sender: buildParticipant(sender),
          receiver: buildParticipant(receiver),
          direction: 'sent',
          counterparty: buildParticipant(receiver),
        },
        balances: {
          sender: senderAfter,
          receiver: receiverAfter,
        },
        recipient: buildParticipant(receiver),
      };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async createDeposit({ userId, amount, source = 'recharge', description = null, ipAddress = null, userAgent = null }) {
    const normalizedAmount = normalizeAmount(amount);
    const cleanDescription = description ? String(description).trim().slice(0, 200) : `Dépôt ${source}`.slice(0, 200);

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const [userRows] = await connection.execute(
        `SELECT id, email, balance, first_name, last_name, totp_enabled
         FROM users
         WHERE id = ?
         FOR UPDATE`,
        [userId]
      );

      const user = userRows[0];
      if (!user) {
        throw { status: 404, message: 'Compte utilisateur introuvable.' };
      }

      const transactionId = crypto.randomUUID();
      const createdAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
      const hash = buildTransactionHash({
        transactionId,
        senderId: user.id,
        receiverId: user.id,
        amount: normalizedAmount,
        description: cleanDescription,
        createdAt,
        kind: 'deposit',
      });
      const signature = buildTransactionSignature({
        hash,
        senderId: user.id,
        receiverId: user.id,
        amount: normalizedAmount,
        createdAt,
        kind: 'deposit',
      });

      await connection.execute(
        `INSERT INTO transactions (id, sender_id, receiver_id, amount, description, status, transaction_kind, hash, signature, created_at)
         VALUES (?, ?, ?, ?, ?, 'completed', 'deposit', ?, ?, ?)`,
        [
          transactionId,
          user.id,
          user.id,
          normalizedAmount,
          cleanDescription,
          hash,
          signature,
          createdAt,
        ]
      );

      await connection.execute(
        `UPDATE users
         SET balance = balance + ?
         WHERE id = ?`,
        [normalizedAmount, user.id]
      );

      await ActivityLog.log({
        userId: user.id,
        action: 'DEPOSIT_COMPLETED',
        ipAddress,
        userAgent,
        details: {
          transactionId,
          amount: normalizedAmount,
          source,
        },
      });

      await NotificationService.create({
        userId: user.id,
        type: 'security',
        title: 'Dépôt confirmé',
        message: `Votre compte a été rechargé de ${normalizedAmount.toLocaleString()} FCFA.`,
      });

      if (!user.totp_enabled) {
        await NotificationService.create({
          userId: user.id,
          type: 'security',
          title: 'Sécurité recommandée',
          message: 'Activez la vérification multifacteur pour sécuriser votre compte.',
        });
      }

      await connection.commit();

      const balanceAfter = Number(user.balance || 0) + normalizedAmount;

      return {
        message: 'Dépôt effectué avec succès.',
        transaction: {
          id: transactionId,
          senderId: user.id,
          receiverId: user.id,
          amount: normalizedAmount,
          currency: 'XOF',
          description: cleanDescription,
          status: 'completed',
          transactionKind: 'deposit',
          hash,
          signature,
          createdAt,
          sender: buildParticipant(user),
          receiver: buildParticipant(user),
          direction: 'received',
          counterparty: buildParticipant(user),
        },
        balances: {
          user: balanceAfter,
        },
      };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async listForUser(userId, limit = 50) {
    const safeLimit = Math.min(Math.max(Number(limit) || 50, 1), 200);
    const [rows] = await pool.execute(
      `SELECT
         t.id,
         t.sender_id,
         t.receiver_id,
         t.amount,
         t.description,
         t.status,
         t.transaction_kind,
         t.hash,
         t.signature,
         t.created_at,
         sender.email AS sender_email,
         sender.first_name AS sender_first_name,
         sender.last_name AS sender_last_name,
         receiver.email AS receiver_email,
         receiver.first_name AS receiver_first_name,
         receiver.last_name AS receiver_last_name
       FROM transactions t
       INNER JOIN users sender ON sender.id = t.sender_id
       INNER JOIN users receiver ON receiver.id = t.receiver_id
       WHERE t.sender_id = ? OR t.receiver_id = ?
       ORDER BY t.created_at DESC
       LIMIT ?`,
      [userId, userId, safeLimit]
    );

    return rows.map((transaction) => buildTransactionResponse(transaction, userId));
  }

  static async findByIdForUser(userId, transactionId) {
    const [rows] = await pool.execute(
      `SELECT
         t.id,
         t.sender_id,
         t.receiver_id,
         t.amount,
         t.description,
         t.status,
         t.transaction_kind,
         t.hash,
         t.signature,
         t.created_at,
         sender.email AS sender_email,
         sender.first_name AS sender_first_name,
         sender.last_name AS sender_last_name,
         receiver.email AS receiver_email,
         receiver.first_name AS receiver_first_name,
         receiver.last_name AS receiver_last_name
       FROM transactions t
       INNER JOIN users sender ON sender.id = t.sender_id
       INNER JOIN users receiver ON receiver.id = t.receiver_id
       WHERE t.id = ? AND (t.sender_id = ? OR t.receiver_id = ?)
       LIMIT 1`,
      [transactionId, userId, userId]
    );

    const transaction = rows[0];
    if (!transaction) return null;

    return buildTransactionResponse(transaction, userId);
  }
}

module.exports = TransactionService;
