// backend/src/utils/totp.js
const speakeasy = require('speakeasy');
const QRCode    = require('qrcode');

// Générer un secret TOTP
const generateSecret = (userEmail) => {
  return speakeasy.generateSecret({
    name: `${process.env.TOTP_ISSUER || 'eWallet'}:${userEmail}`,
    length: 20,
  });
};

// Générer le QR Code base64
const generateQRCode = async (otpauthUrl) => {
  return QRCode.toDataURL(otpauthUrl);
};

// Vérifier un code TOTP
const verifyToken = (secret, token) => {
  return speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token,
    window: 1, // tolérance ±30 secondes
  });
};

module.exports = { generateSecret, generateQRCode, verifyToken };
