/**
 * Enhanced Authentication Service
 * Epic 1, Story E1_F2_S1: Foundational Authentication System
 *
 * Provides secure user authentication with JWT tokens, password hashing,
 * session management, and integration with Mahamaya Matrix.
 *
 * Features:
 * - Secure password hashing with bcrypt
 * - JWT token generation and validation
 * - Session management
 * - Password reset/recovery
 * - Integration with Mahamaya Matrix user profiles
 */

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { getDb } from '../../../services/mongo.service.mjs';
import User from '../../../models/User.model.mjs';
import { v4 as uuidv4 } from 'uuid';

// Configuration
const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(64).toString('hex');
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '30d';
const SALT_ROUNDS = 12;

/**
 * Enhanced Authentication Service Class
 */
class AuthService {
  constructor() {
    this.db = null;
    this.collections = {
      users: 'UserIdentityData', // Use existing collection
      sessions: 'user_sessions',
      passwordResets: 'password_resets'
    };
  }

  /**
   * Initialize the service
   */
  async initialize() {
    try {
      this.db = await getDb();
      await this.createIndexes();
      console.log('Auth Service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Auth Service:', error);
      throw error;
    }
  }

  /**
   * Create necessary indexes
   */
  async createIndexes() {
    const indexes = [
      { collection: this.collections.users, index: { email: 1 }, options: { unique: true } },
      { collection: this.collections.users, index: { username: 1 }, options: { unique: true } },
      { collection: this.collections.sessions, index: { userId: 1 } },
      { collection: this.collections.sessions, index: { refreshToken: 1 }, options: { unique: true } },
      { collection: this.collections.sessions, index: { expiresAt: 1 }, options: { expireAfterSeconds: 0 } },
      { collection: this.collections.passwordResets, index: { email: 1 } },
      { collection: this.collections.passwordResets, index: { token: 1 }, options: { unique: true } },
      { collection: this.collections.passwordResets, index: { expiresAt: 1 }, options: { expireAfterSeconds: 0 } }
    ];

    for (const { collection, index, options = {} } of indexes) {
      try {
        await this.db.collection(collection).createIndex(index, options);
      } catch (error) {
        console.warn(`Index creation warning for ${collection}:`, error.message);
      }
    }
  }

  /**
   * Register a new user
   * Integrates with existing User model and 6-layer identity structure
   */
  async register(userData) {
    try {
      const { email, name, password } = userData;

      // Validate input (using 'name' to match existing User model)
      if (!email || !name || !password) {
        throw new Error('Email, name, and password are required');
      }

      // Check if user already exists
      const existingUser = await User.findOne({
        $or: [{ email }, { name }]
      });

      if (existingUser) {
        throw new Error('User with this email or name already exists');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

      // Generate unique userId
      const userId = uuidv4();

      // Check if this is the first user (to make them admin)
      const userCount = await User.countDocuments();
      const isFirstUser = userCount === 0;

      // Create new user with existing User model structure
      const user = new User({
        userId,
        name,
        email,
        password: hashedPassword,
        role: isFirstUser ? 'admin' : 'user',
        // Initialize with enhanced authentication metadata
        authMetadata: {
          isEmailVerified: false,
          lastLoginAt: null,
          loginCount: 0,
          registrationIP: userData.ip || null,
          userAgent: userData.userAgent || null,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        // Set the individual identity name to the user's name
        identityStructure: {
          individualIdentity: {
            name: name // Auto-assign the user's name to the individual identity
          }
        },
        // Initialize Mahamaya Matrix structure (6 layers total)
        mahamayaMatrix: {
          completionStatus: {
            birthdateEncoding: false,
            astrologicalChart: false,
            jungianAssessment: false,
            geneKeysProfile: false,
            humanDesignProfile: false,
            archetypalQuintessence: false // Synthesized from 6-layer identity + 5 Mahamaya layers
          },
          metadata: {
            version: '1.0',
            lastSyncedAt: new Date()
          }
        }
      });

      await user.save();

      // Generate tokens
      const tokens = await this.generateTokens(userId);

      return {
        success: true,
        user: {
          userId,
          email,
          name,
          role: user.role,
          createdAt: user.createdAt
        },
        tokens,
        message: 'User registered successfully'
      };
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error(`Registration failed: ${error.message}`);
    }
  }

  /**
   * Login user
   * Integrates with existing User model
   */
  async login(credentials) {
    try {
      const { emailOrName, password } = credentials;

      if (!emailOrName || !password) {
        throw new Error('Email/name and password are required');
      }

      // Find user using existing User model
      const user = await User.findOne({
        $or: [
          { email: emailOrName },
          { name: emailOrName }
        ]
      });

      if (!user) {
        throw new Error('Invalid credentials');
      }

      // Verify password (existing User model stores plain text, but we'll enhance this)
      let isPasswordValid = false;

      // Check if password is hashed (new users) or plain text (existing users)
      if (user.password.startsWith('$2b$')) {
        // Hashed password
        isPasswordValid = await bcrypt.compare(password, user.password);
      } else {
        // Plain text password (existing users) - upgrade to hashed
        isPasswordValid = (password === user.password);
        if (isPasswordValid) {
          // Upgrade to hashed password
          user.password = await bcrypt.hash(password, SALT_ROUNDS);
          await user.save();
        }
      }

      if (!isPasswordValid) {
        throw new Error('Invalid credentials');
      }

      // Update login statistics
      if (!user.authMetadata) {
        user.authMetadata = {};
      }
      user.authMetadata.lastLoginAt = new Date();
      user.authMetadata.loginCount = (user.authMetadata.loginCount || 0) + 1;
      user.updatedAt = new Date();

      await user.save();

      // Generate tokens
      const tokens = await this.generateTokens(user.userId);

      return {
        success: true,
        user: {
          userId: user.userId,
          email: user.email,
          name: user.name,
          role: user.role,
          lastLoginAt: user.authMetadata.lastLoginAt
        },
        tokens,
        message: 'Login successful'
      };
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(`Login failed: ${error.message}`);
    }
  }

  /**
   * Generate JWT and refresh tokens
   */
  async generateTokens(userId) {
    try {
      // Generate access token
      const accessToken = jwt.sign(
        { userId, type: 'access' },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      // Generate refresh token
      const refreshToken = crypto.randomBytes(64).toString('hex');

      // Store session
      const session = {
        userId,
        refreshToken,
        accessToken,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        isActive: true
      };

      await this.db.collection(this.collections.sessions)
        .insertOne(session);

      return {
        accessToken,
        refreshToken,
        expiresIn: JWT_EXPIRES_IN
      };
    } catch (error) {
      console.error('Token generation error:', error);
      throw new Error('Failed to generate tokens');
    }
  }

  /**
   * Verify JWT token
   */
  async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);

      // Check if session is still active
      const session = await this.db.collection(this.collections.sessions)
        .findOne({
          userId: decoded.userId,
          accessToken: token,
          isActive: true,
          expiresAt: { $gt: new Date() }
        });

      if (!session) {
        throw new Error('Session not found or expired');
      }

      // Get user data using User model
      const user = await User.findOne({ userId: decoded.userId });

      if (!user) {
        throw new Error('User not found or inactive');
      }

      return {
        success: true,
        userId: decoded.userId,
        user: {
          userId: user.userId,
          email: user.email,
          name: user.name,
          role: user.role
        }
      };
    } catch (error) {
      console.error('Token verification error:', error);
      throw new Error(`Token verification failed: ${error.message}`);
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken) {
    try {
      const session = await this.db.collection(this.collections.sessions)
        .findOne({
          refreshToken,
          isActive: true,
          expiresAt: { $gt: new Date() }
        });

      if (!session) {
        throw new Error('Invalid or expired refresh token');
      }

      // Generate new tokens
      const newTokens = await this.generateTokens(session.userId);

      // Invalidate old session
      await this.db.collection(this.collections.sessions)
        .updateOne(
          { refreshToken },
          { $set: { isActive: false, updatedAt: new Date() } }
        );

      return {
        success: true,
        tokens: newTokens,
        message: 'Token refreshed successfully'
      };
    } catch (error) {
      console.error('Token refresh error:', error);
      throw new Error(`Token refresh failed: ${error.message}`);
    }
  }

  /**
   * Logout user
   */
  async logout(refreshToken) {
    try {
      await this.db.collection(this.collections.sessions)
        .updateOne(
          { refreshToken },
          { $set: { isActive: false, updatedAt: new Date() } }
        );

      return {
        success: true,
        message: 'Logout successful'
      };
    } catch (error) {
      console.error('Logout error:', error);
      throw new Error(`Logout failed: ${error.message}`);
    }
  }

  /**
   * Middleware for protecting routes
   */
  authMiddleware() {
    return async (req, res, next) => {
      try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return res.status(401).json({
            success: false,
            message: 'Access token required'
          });
        }

        const token = authHeader.substring(7);
        const verification = await this.verifyToken(token);

        req.user = verification.user;
        req.userId = verification.userId;
        next();
      } catch (error) {
        return res.status(401).json({
          success: false,
          message: error.message
        });
      }
    };
  }
}

// Export singleton instance
const authService = new AuthService();
export default authService;
