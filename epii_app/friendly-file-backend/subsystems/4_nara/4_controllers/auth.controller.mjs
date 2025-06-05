/**
 * Authentication Controller
 * Epic 1, Story E1_F2_S1: Authentication API endpoints
 *
 * Provides secure authentication endpoints for user registration, login,
 * token refresh, and session management.
 */

import authService from '../2_services/auth.service.mjs';
import User from '../../../models/User.model.mjs';

/**
 * Authentication Controller Class
 */
class AuthController {
  constructor() {
    // Bind methods to preserve context
    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
    this.refreshToken = this.refreshToken.bind(this);
    this.logout = this.logout.bind(this);
    this.getProfile = this.getProfile.bind(this);
    this.verifyToken = this.verifyToken.bind(this);
  }

  /**
   * Initialize the controller
   */
  async initialize() {
    try {
      await authService.initialize();
      console.log('Auth Controller initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Auth Controller:', error);
      throw error;
    }
  }

  /**
   * Register a new user
   * POST /api/auth/register
   */
  async register(req, res) {
    try {
      const userData = {
        ...req.body,
        ip: req.ip,
        userAgent: req.get('User-Agent')
      };

      // Validate required fields
      const { email, username, password } = userData;
      if (!email || !username || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email, username, and password are required'
        });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid email format'
        });
      }

      // Validate password strength
      if (password.length < 8) {
        return res.status(400).json({
          success: false,
          message: 'Password must be at least 8 characters long'
        });
      }

      const result = await authService.register(userData);

      // Set refresh token as httpOnly cookie
      res.cookie('refreshToken', result.tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
      });

      res.status(201).json({
        success: true,
        user: result.user,
        accessToken: result.tokens.accessToken,
        expiresIn: result.tokens.expiresIn,
        message: result.message
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(400).json({
        success: false,
        message: error.message,
        error: 'Registration failed'
      });
    }
  }

  /**
   * Login user
   * POST /api/auth/login
   */
  async login(req, res) {
    try {
      const { emailOrName, password } = req.body;

      // Validate required fields
      if (!emailOrName || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email/name and password are required'
        });
      }

      const result = await authService.login({ emailOrName, password });

      // Set refresh token as httpOnly cookie
      res.cookie('refreshToken', result.tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
      });

      res.status(200).json({
        success: true,
        user: result.user,
        accessToken: result.tokens.accessToken,
        expiresIn: result.tokens.expiresIn,
        message: result.message
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(401).json({
        success: false,
        message: error.message,
        error: 'Login failed'
      });
    }
  }

  /**
   * Refresh access token
   * POST /api/auth/refresh
   */
  async refreshToken(req, res) {
    try {
      const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

      if (!refreshToken) {
        return res.status(401).json({
          success: false,
          message: 'Refresh token required'
        });
      }

      const result = await authService.refreshToken(refreshToken);

      // Set new refresh token as httpOnly cookie
      res.cookie('refreshToken', result.tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
      });

      res.status(200).json({
        success: true,
        accessToken: result.tokens.accessToken,
        expiresIn: result.tokens.expiresIn,
        message: result.message
      });
    } catch (error) {
      console.error('Token refresh error:', error);
      res.status(401).json({
        success: false,
        message: error.message,
        error: 'Token refresh failed'
      });
    }
  }

  /**
   * Logout user
   * POST /api/auth/logout
   */
  async logout(req, res) {
    try {
      const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

      if (refreshToken) {
        await authService.logout(refreshToken);
      }

      // Clear refresh token cookie
      res.clearCookie('refreshToken');

      res.status(200).json({
        success: true,
        message: 'Logout successful'
      });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
        success: false,
        message: error.message,
        error: 'Logout failed'
      });
    }
  }

  /**
   * Get user profile (protected route)
   * GET /api/auth/profile
   */
  async getProfile(req, res) {
    try {
      const { userId } = req;

      // Get complete user data including Mahamaya Matrix
      const user = await User.findOne({ userId });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.status(200).json({
        success: true,
        user: {
          userId: user.userId,
          name: user.name,
          email: user.email,
          role: user.role,
          identityStructure: user.identityStructure || {},
          profileData: user.profileData || {},
          preferences: user.preferences || {},
          systemUsage: user.systemUsage || {},
          mahamayaMatrix: user.mahamayaMatrix || {
            completionStatus: {
              birthdateEncoding: false,
              astrologicalChart: false,
              jungianAssessment: false,
              geneKeysProfile: false,
              humanDesignProfile: false,
              archetypalQuintessence: false
            }
          }
        }
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        message: error.message,
        error: 'Failed to get user profile'
      });
    }
  }

  /**
   * Verify token endpoint
   * POST /api/auth/verify
   */
  async verifyToken(req, res) {
    try {
      const { token } = req.body;

      if (!token) {
        return res.status(400).json({
          success: false,
          message: 'Token required'
        });
      }

      const result = await authService.verifyToken(token);

      res.status(200).json({
        success: true,
        valid: true,
        user: result.user,
        message: 'Token is valid'
      });
    } catch (error) {
      console.error('Token verification error:', error);
      res.status(401).json({
        success: false,
        valid: false,
        message: error.message,
        error: 'Token verification failed'
      });
    }
  }

  /**
   * Get authentication middleware
   */
  getAuthMiddleware() {
    return authService.authMiddleware();
  }
}

// Export singleton instance
const authController = new AuthController();
export default authController;
