// backend/src/controllers/auth.controller.js
const AuthService = require('../services/auth.service');

class AuthController {
  static async register(req, res, next) {
    try {
      const { email, password, firstName, lastName } = req.body;
      const result = await AuthService.register({
        email,
        password,
        firstName,
        lastName,
        ip: req.ip,
        userAgent: req.headers['user-agent'],
      });
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login({
        email,
        password,
        ip: req.ip,
        userAgent: req.headers['user-agent'],
      });
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }

  static async verifyMfa(req, res, next) {
    try {
      const { userId, otpCode } = req.body;
      const result = await AuthService.verifyMfa({
        userId,
        otpCode,
        ip: req.ip,
        userAgent: req.headers['user-agent'],
      });
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }

  static async setupMfa(req, res, next) {
    try {
      const result = await AuthService.setupMfa(req.user.userId);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }

  static async confirmMfa(req, res, next) {
    try {
      const { otpCode } = req.body;
      const result = await AuthService.confirmMfa({
        userId: req.user.userId,
        otpCode,
      });
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }

  static async getMe(req, res, next) {
    try {
      const user = await AuthService.getUserById(req.user.userId);
      res.status(200).json({ user });
    } catch (err) {
      next(err);
    }
  }

  static async updateMe(req, res, next) {
    try {
      const { email, firstName, lastName } = req.body;
      const result = await AuthService.updateProfile(req.user.userId, {
        email,
        firstName,
        lastName,
      });
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }

  static async listUsers(req, res, next) {
    try {
      const { search = '', limit = 50, offset = 0 } = req.query;
      const result = await AuthService.listUsers({
        search,
        limit,
        offset,
      });
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }

  static async getUser(req, res, next) {
    try {
      const user = await AuthService.getUserById(req.params.id);
      res.status(200).json({ user });
    } catch (err) {
      next(err);
    }
  }

  static async updateUser(req, res, next) {
    try {
      const updatedUser = await AuthService.updateUser(req.params.id, req.body);
      res.status(200).json({ message: 'Utilisateur mis à jour avec succès.', user: updatedUser });
    } catch (err) {
      next(err);
    }
  }

  static async deleteUser(req, res, next) {
    try {
      const result = await AuthService.deleteUser(req.params.id);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
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
    } catch (err) {
      next(err);
    }
  }
}

module.exports = AuthController;
