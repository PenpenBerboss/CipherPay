// backend/src/controllers/auth.controller.js
const AuthService = require('../services/auth.service');
const User        = require('../models/User');

class AuthController {

  static async register(req, res, next) {
    try {
      const { email, password, firstName, lastName } = req.body;
      const result = await AuthService.register({
        email, password, firstName, lastName,
        ip: req.ip,
        userAgent: req.headers['user-agent'],
      });
      res.status(201).json(result);
    } catch (err) { next(err); }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login({
        email, password,
        ip: req.ip,
        userAgent: req.headers['user-agent'],
      });
      res.status(200).json(result);
    } catch (err) { next(err); }
  }

  static async verifyMfa(req, res, next) {
    try {
      const { userId, otpCode } = req.body;
      const result = await AuthService.verifyMfa({
        userId, otpCode,
        ip: req.ip,
        userAgent: req.headers['user-agent'],
      });
      res.status(200).json(result);
    } catch (err) { next(err); }
  }

  static async setupMfa(req, res, next) {
    try {
      const result = await AuthService.setupMfa(req.user.userId);
      res.status(200).json(result);
    } catch (err) { next(err); }
  }

  static async confirmMfa(req, res, next) {
    try {
      const { otpCode } = req.body;
      const result = await AuthService.confirmMfa({
        userId: req.user.userId,
        otpCode,
      });
      res.status(200).json(result);
    } catch (err) { next(err); }
  }

  static async getMe(req, res, next) {
    try {
      const user = await User.findById(req.user.userId);
      if (!user) return res.status(404).json({ message: 'Utilisateur introuvable.' });
      res.status(200).json({ user });
    } catch (err) { next(err); }
  }

  static async logout(req, res, next) {
  try {
    const ActivityLog = require('../models/ActivityLog');
    await ActivityLog.log({
      userId: req.user.userId,
      action: 'LOGOUT',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });
    res.status(200).json({ message: 'Déconnexion réussie.' });
  } catch (err) { next(err); }
}
}

module.exports = AuthController;
