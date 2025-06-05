/**
 * Mahamaya Matrix Controller
 * Epic 1, Story E1_F2_S1: RESTful API endpoints for Mahamaya Matrix
 *
 * Provides secure CRUD API endpoints for managing user data within the Mahamaya Matrix.
 * All endpoints require authentication and implement proper error handling.
 */

import mahamayaMatrixService from '../2_services/mahamaya-matrix.service.mjs';
import authService from '../2_services/auth.service.mjs';

/**
 * Mahamaya Matrix Controller Class
 */
class MahamayaMatrixController {
  constructor() {
    // Bind methods to preserve context
    this.createUserProfile = this.createUserProfile.bind(this);
    this.getUserMatrix = this.getUserMatrix.bind(this);
    this.storeBirthdateEncoding = this.storeBirthdateEncoding.bind(this);
    this.storeAstrologicalChart = this.storeAstrologicalChart.bind(this);
    this.storeJungianAssessment = this.storeJungianAssessment.bind(this);
    this.storeGeneKeysProfile = this.storeGeneKeysProfile.bind(this);
    this.storeHumanDesignProfile = this.storeHumanDesignProfile.bind(this);
    this.storeArchetypalQuintessence = this.storeArchetypalQuintessence.bind(this);
    this.getSpecificLayer = this.getSpecificLayer.bind(this);
    this.deleteUserData = this.deleteUserData.bind(this);
  }

  /**
   * Initialize the controller
   */
  async initialize() {
    try {
      await mahamayaMatrixService.initialize();
      await authService.initialize();
      console.log('Mahamaya Matrix Controller initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Mahamaya Matrix Controller:', error);
      throw error;
    }
  }

  /**
   * Create or update user profile
   * POST /api/mahamaya/profile
   */
  async createUserProfile(req, res) {
    try {
      const { userId } = req;
      const profileData = req.body;

      const result = await mahamayaMatrixService.createUserProfile(userId, profileData);

      res.status(200).json(result);
    } catch (error) {
      console.error('Error creating user profile:', error);
      res.status(500).json({
        success: false,
        message: error.message,
        error: 'Failed to create user profile'
      });
    }
  }

  /**
   * Get complete Mahamaya Matrix for user
   * GET /api/mahamaya/matrix
   */
  async getUserMatrix(req, res) {
    try {
      const { userId } = req;

      const result = await mahamayaMatrixService.getUserMatrix(userId);

      res.status(200).json(result);
    } catch (error) {
      console.error('Error getting user matrix:', error);
      res.status(500).json({
        success: false,
        message: error.message,
        error: 'Failed to get user matrix'
      });
    }
  }

  /**
   * Store Birthdate Encoding data
   * POST /api/mahamaya/birthdate-encoding
   */
  async storeBirthdateEncoding(req, res) {
    try {
      const { userId } = req;
      const birthdateData = req.body;

      // Validate required fields
      if (!birthdateData.birthDate) {
        return res.status(400).json({
          success: false,
          message: 'Birth date is required'
        });
      }

      const result = await mahamayaMatrixService.storeBirthdateEncoding(userId, birthdateData);

      res.status(200).json(result);
    } catch (error) {
      console.error('Error storing birthdate encoding:', error);
      res.status(500).json({
        success: false,
        message: error.message,
        error: 'Failed to store birthdate encoding'
      });
    }
  }

  /**
   * Reset Birthdate Encoding data
   * DELETE /api/mahamaya/birthdate-encoding/reset
   */
  async resetBirthdateEncoding(req, res) {
    try {
      const { userId } = req;

      const result = await mahamayaMatrixService.resetBirthdateEncoding(userId);

      res.status(200).json(result);
    } catch (error) {
      console.error('Error resetting birthdate encoding:', error);
      res.status(500).json({
        success: false,
        message: error.message,
        error: 'Failed to reset birthdate encoding'
      });
    }
  }

  /**
   * Store Astrological Chart data
   * POST /api/mahamaya/astrological-chart
   */
  async storeAstrologicalChart(req, res) {
    try {
      const { userId } = req;
      const chartData = req.body;

      // Validate required fields
      if (!chartData.chartType || !chartData.chartData) {
        return res.status(400).json({
          success: false,
          message: 'Chart type and chart data are required'
        });
      }

      const result = await mahamayaMatrixService.storeAstrologicalChart(userId, chartData);

      res.status(200).json(result);
    } catch (error) {
      console.error('Error storing astrological chart:', error);
      res.status(500).json({
        success: false,
        message: error.message,
        error: 'Failed to store astrological chart'
      });
    }
  }

  /**
   * Store Jungian Assessment results
   * POST /api/mahamaya/jungian-assessment
   */
  async storeJungianAssessment(req, res) {
    try {
      const { userId } = req;
      const assessmentData = req.body;

      // Validate required fields
      if (!assessmentData.assessmentType || !assessmentData.personalityType) {
        return res.status(400).json({
          success: false,
          message: 'Assessment type and personality type are required'
        });
      }

      const result = await mahamayaMatrixService.storeJungianAssessment(userId, assessmentData);

      res.status(200).json(result);
    } catch (error) {
      console.error('Error storing Jungian assessment:', error);
      res.status(500).json({
        success: false,
        message: error.message,
        error: 'Failed to store Jungian assessment'
      });
    }
  }

  /**
   * Store Gene Keys Profile data
   * POST /api/mahamaya/gene-keys-profile
   */
  async storeGeneKeysProfile(req, res) {
    try {
      const { userId } = req;
      const geneKeysData = req.body;

      const result = await mahamayaMatrixService.storeGeneKeysProfile(userId, geneKeysData);

      res.status(200).json(result);
    } catch (error) {
      console.error('Error storing Gene Keys profile:', error);
      res.status(500).json({
        success: false,
        message: error.message,
        error: 'Failed to store Gene Keys profile'
      });
    }
  }

  /**
   * Store Human Design Profile data
   * POST /api/mahamaya/human-design-profile
   */
  async storeHumanDesignProfile(req, res) {
    try {
      const { userId } = req;
      const humanDesignData = req.body;

      // Validate required fields
      if (!humanDesignData.type || !humanDesignData.strategy) {
        return res.status(400).json({
          success: false,
          message: 'Type and strategy are required'
        });
      }

      const result = await mahamayaMatrixService.storeHumanDesignProfile(userId, humanDesignData);

      res.status(200).json(result);
    } catch (error) {
      console.error('Error storing Human Design profile:', error);
      res.status(500).json({
        success: false,
        message: error.message,
        error: 'Failed to store Human Design profile'
      });
    }
  }



  /**
   * Store Archetypal Quintessence data
   * POST /api/mahamaya/archetypal-quintessence
   */
  async storeArchetypalQuintessence(req, res) {
    try {
      const { userId } = req;
      const quintessenceData = req.body;

      // Validate required fields
      if (!quintessenceData.synthesizedArchetype) {
        return res.status(400).json({
          success: false,
          message: 'Synthesized archetype is required'
        });
      }

      const result = await mahamayaMatrixService.storeArchetypalQuintessence(userId, quintessenceData);

      res.status(200).json(result);
    } catch (error) {
      console.error('Error storing archetypal quintessence:', error);
      res.status(500).json({
        success: false,
        message: error.message,
        error: 'Failed to store archetypal quintessence'
      });
    }
  }

  /**
   * Get specific layer data
   * GET /api/mahamaya/layer/:layerType
   */
  async getSpecificLayer(req, res) {
    try {
      const { userId } = req;
      const { layerType } = req.params;

      let result;
      switch (layerType) {
        case 'birthdate-encoding':
          result = await mahamayaMatrixService.getBirthdateEncoding(userId);
          break;
        case 'astrological-charts':
          result = await mahamayaMatrixService.getAstrologicalCharts(userId);
          break;
        case 'jungian-assessments':
          result = await mahamayaMatrixService.getJungianAssessments(userId);
          break;
        case 'gene-keys-profile':
          result = await mahamayaMatrixService.getGeneKeysProfile(userId);
          break;
        case 'human-design-profile':
          result = await mahamayaMatrixService.getHumanDesignProfile(userId);
          break;
        case 'archetypal-quintessence':
          result = await mahamayaMatrixService.getArchetypalQuintessence(userId);
          break;
        default:
          return res.status(400).json({
            success: false,
            message: 'Invalid layer type'
          });
      }

      res.status(200).json({
        success: true,
        userId,
        layerType,
        data: result
      });
    } catch (error) {
      console.error('Error getting specific layer:', error);
      res.status(500).json({
        success: false,
        message: error.message,
        error: 'Failed to get layer data'
      });
    }
  }

  /**
   * Delete user data
   * DELETE /api/mahamaya/user-data
   */
  async deleteUserData(req, res) {
    try {
      const { userId } = req;
      const { hardDelete = false } = req.query;

      const result = await mahamayaMatrixService.deleteUserData(userId, hardDelete === 'true');

      res.status(200).json(result);
    } catch (error) {
      console.error('Error deleting user data:', error);
      res.status(500).json({
        success: false,
        message: error.message,
        error: 'Failed to delete user data'
      });
    }
  }
}

// Export singleton instance
const mahamayaMatrixController = new MahamayaMatrixController();
export default mahamayaMatrixController;
