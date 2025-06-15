/**
 * Mahamaya Matrix API Routes
 * Epic 1, Story E1_F2_S1: RESTful API routes for Mahamaya Matrix
 *
 * Defines all API routes for the Mahamaya Matrix system with proper
 * authentication middleware and error handling.
 */

import express from 'express';
import mahamayaMatrixController from '../../4_controllers/mahamaya-matrix.controller.mjs';
import authController from '../../4_controllers/auth.controller.mjs';

const router = express.Router();

/**
 * Initialize routes
 */
async function initializeRoutes() {
  try {
    await mahamayaMatrixController.initialize();
    await authController.initialize();
    console.log('Mahamaya routes initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Mahamaya routes:', error);
    throw error;
  }
}

// Authentication middleware
const authMiddleware = authController.getAuthMiddleware();

// Authentication routes (no auth required)
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.post('/auth/refresh', authController.refreshToken);
router.post('/auth/logout', authController.logout);
router.post('/auth/verify', authController.verifyToken);

// Protected authentication routes
router.get('/auth/profile', authMiddleware, authController.getProfile);

// Mahamaya Matrix routes (all require authentication)
router.use('/mahamaya', authMiddleware);

/**
 * User Profile Management
 */
// Create or update user profile
router.post('/mahamaya/profile', mahamayaMatrixController.createUserProfile);

// Get complete Mahamaya Matrix for user
router.get('/mahamaya/matrix', mahamayaMatrixController.getUserMatrix);

/**
 * Mahamaya Ground Layer Data Storage
 */
// Store Birthdate Encoding data
router.post('/mahamaya/birthdate-encoding', mahamayaMatrixController.storeBirthdateEncoding);

// Reset Birthdate Encoding data
router.delete('/mahamaya/birthdate-encoding/reset', mahamayaMatrixController.resetBirthdateEncoding);

// Store Astrological Chart data
router.post('/mahamaya/astrological-chart', mahamayaMatrixController.storeAstrologicalChart);

// Store Jungian Assessment results
router.post('/mahamaya/jungian-assessment', mahamayaMatrixController.storeJungianAssessment);

// Store Gene Keys Profile data
router.post('/mahamaya/gene-keys-profile', mahamayaMatrixController.storeGeneKeysProfile);

// Store Human Design Profile data
router.post('/mahamaya/human-design-profile', mahamayaMatrixController.storeHumanDesignProfile);

// Store Archetypal Quintessence data
router.post('/mahamaya/archetypal-quintessence', mahamayaMatrixController.storeArchetypalQuintessence);

/**
 * Individual Layer Data Retrieval
 */
// Get specific layer data
router.get('/mahamaya/layer/:layerType', mahamayaMatrixController.getSpecificLayer);

/**
 * Data Management
 */
// Delete user data (soft delete by default, hard delete with query param)
router.delete('/mahamaya/user-data', mahamayaMatrixController.deleteUserData);

/**
 * Health check endpoint
 */
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    service: 'Mahamaya Matrix API',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

/**
 * API documentation endpoint
 */
router.get('/docs', (req, res) => {
  res.status(200).json({
    success: true,
    service: 'Mahamaya Matrix API',
    version: '1.0.0',
    documentation: {
      authentication: {
        'POST /api/auth/register': 'Register a new user',
        'POST /api/auth/login': 'Login user',
        'POST /api/auth/refresh': 'Refresh access token',
        'POST /api/auth/logout': 'Logout user',
        'POST /api/auth/verify': 'Verify token',
        'GET /api/auth/profile': 'Get user profile (protected)'
      },
      mahamayaMatrix: {
        'POST /api/mahamaya/profile': 'Create/update user profile (protected)',
        'GET /api/mahamaya/matrix': 'Get complete Mahamaya Matrix (protected)',
        'POST /api/mahamaya/birthdate-encoding': 'Store birthdate encoding (protected)',
        'POST /api/mahamaya/astrological-chart': 'Store astrological chart (protected)',
        'POST /api/mahamaya/jungian-assessment': 'Store Jungian assessment (protected)',
        'POST /api/mahamaya/gene-keys-profile': 'Store Gene Keys profile (protected)',
        'POST /api/mahamaya/human-design-profile': 'Store Human Design profile (protected)',
        'POST /api/mahamaya/archetypal-quintessence': 'Store archetypal quintessence (protected)',
        'GET /api/mahamaya/layer/:layerType': 'Get specific layer data (protected)',
        'DELETE /api/mahamaya/user-data': 'Delete user data (protected)'
      },
      layerTypes: [
        'birthdate-encoding',
        'astrological-charts',
        'jungian-assessments',
        'gene-keys-profile',
        'human-design-profile',
        'archetypal-quintessence'
      ],
      authentication_header: 'Authorization: Bearer <access_token>',
      example_requests: {
        register: {
          method: 'POST',
          url: '/api/auth/register',
          body: {
            email: 'user@example.com',
            username: 'username',
            password: 'password123',
            firstName: 'John',
            lastName: 'Doe'
          }
        },
        login: {
          method: 'POST',
          url: '/api/auth/login',
          body: {
            emailOrUsername: 'user@example.com',
            password: 'password123'
          }
        },
        storeBirthdateEncoding: {
          method: 'POST',
          url: '/api/mahamaya/birthdate-encoding',
          headers: {
            'Authorization': 'Bearer <access_token>',
            'Content-Type': 'application/json'
          },
          body: {
            birthDate: '1990-01-01',
            birthTime: '12:00:00',
            birthLocation: {
              city: 'New York',
              country: 'USA',
              latitude: 40.7128,
              longitude: -74.0060
            },
            numerologicalProfile: {
              lifePathNumber: 5,
              destinyNumber: 8
            },
            encodingMetadata: {
              calculationMethod: 'standard',
              version: '1.0'
            }
          }
        }
      }
    }
  });
});

/**
 * Error handling middleware
 */
router.use((error, req, res, next) => {
  console.error('Mahamaya API Error:', error);

  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.stack : 'An error occurred'
  });
});

/**
 * 404 handler for undefined routes
 */
router.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    availableRoutes: [
      'GET /api/health',
      'GET /api/docs',
      'POST /api/auth/register',
      'POST /api/auth/login',
      'POST /api/auth/refresh',
      'POST /api/auth/logout',
      'POST /api/auth/verify',
      'GET /api/auth/profile',
      'POST /api/mahamaya/profile',
      'GET /api/mahamaya/matrix',
      'POST /api/mahamaya/birthdate-encoding',
      'POST /api/mahamaya/astrological-chart',
      'POST /api/mahamaya/jungian-assessment',
      'POST /api/mahamaya/gene-keys-profile',
      'POST /api/mahamaya/human-design-profile',
      'POST /api/mahamaya/i-ching-hexagram',
      'POST /api/mahamaya/archetypal-quintessence',
      'GET /api/mahamaya/layer/:layerType',
      'DELETE /api/mahamaya/user-data'
    ]
  });
});

export { router as mahamayaRoutes, initializeRoutes };
export default router;
