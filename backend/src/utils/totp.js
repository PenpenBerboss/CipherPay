const speakeasy = require('speakeasy');
const qrcode = require('qrcode');

exports.generateSecret = () => {
    return speakeasy.generateSecret({ name: 'NeuroVault' });
};

exports.verifyToken = (secret, token) => {
    return speakeasy.totp.verify({
        secret: secret,
        encoding: 'base32',
        token: token,
        window: 1
    });
};

exports.generateQRCode = async (otpauth_url) => {
    return await qrcode.toDataURL(otpauth_url);
};
