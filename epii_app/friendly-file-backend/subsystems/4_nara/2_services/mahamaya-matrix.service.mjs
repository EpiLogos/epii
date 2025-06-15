/**
 * Mahamaya Matrix Service
 * Epic 1, Story E1_F2_S1: Backend System for Mahamaya Matrix
 *
 * This service manages the six Mahamaya Ground layers and Archetypal Quintessence:
 * 1. Birthdate Encoding Data
 * 2. Astrological Chart Data (Natal, Progressed, Transit)
 * 3. Jungian Archetype Assessment Results
 * 4. Gene Keys Profile Data
 * 5. Human Design Profile Data
 * 6. I Ching Hexagram Data
 * 7. Archetypal Quintessence Data
 *
 * Provides secure CRUD operations with field-level encryption for PII.
 */

import mongoose from 'mongoose';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { getDb } from '../../../databases/mongodb/mongo.service.mjs';
import User from '../../../databases/shared/models/User.model.mjs';

// Encryption configuration
const ENCRYPTION_KEY = process.env.MAHAMAYA_ENCRYPTION_KEY
  ? Buffer.from(process.env.MAHAMAYA_ENCRYPTION_KEY, 'hex')
  : crypto.randomBytes(32);
const ALGORITHM = 'aes-256-gcm';

/**
 * Encrypt sensitive data
 */
function encrypt(text) {
  if (!text) return null;
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag();
  return {
    encrypted,
    iv: iv.toString('hex'),
    authTag: authTag.toString('hex')
  };
}

/**
 * Decrypt sensitive data
 */
function decrypt(encryptedData) {
  if (!encryptedData || !encryptedData.encrypted) return null;
  try {
    const iv = Buffer.from(encryptedData.iv, 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
    decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'));
    let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
}

/**
 * Mahamaya Matrix Service Class
 */
class MahamayaMatrixService {
  constructor() {
    this.db = null;
    // All data is stored in the UserIdentityData collection as metadata
    this.collections = {
      userProfiles: 'UserIdentityData' // Only collection we use
    };
  }

  /**
   * Initialize the service and ensure database connection
   */
  async initialize() {
    try {
      this.db = await getDb();
      await this.createIndexes();
      console.log('Mahamaya Matrix Service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Mahamaya Matrix Service:', error);
      throw error;
    }
  }

  /**
   * Create necessary indexes for performance
   */
  async createIndexes() {
    // Only need indexes for the UserIdentityData collection
    const indexes = [
      { collection: this.collections.userProfiles, index: { userId: 1 }, options: { unique: true } }
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
   * Create or update user profile in Mahamaya Matrix
   * Integrates with existing UserIdentityData collection
   */
  async createUserProfile(userId, profileData) {
    try {
      // Check if user already exists in UserIdentityData
      const existingUser = await User.findOne({ userId });

      if (existingUser) {
        // Update existing user with Mahamaya completion status
        existingUser.mahamayaMatrix = {
          completionStatus: {
            birthdateEncoding: false,
            astrologicalChart: false,
            jungianAssessment: false,
            geneKeysProfile: false,
            humanDesignProfile: false,
            archetypalQuintessence: false
          },
          metadata: {
            version: '1.0',
            lastSyncedAt: new Date()
          }
        };

        await existingUser.save();

        return {
          success: true,
          userId,
          profileId: existingUser._id,
          message: 'User profile updated with Mahamaya Matrix successfully'
        };
      } else {
        throw new Error('User not found in UserIdentityData. Please ensure user is registered first.');
      }
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw new Error(`Failed to create user profile: ${error.message}`);
    }
  }

  /**
   * Store Birthdate Encoding data
   */
  async storeBirthdateEncoding(userId, birthdateData) {
    try {
      // Find the existing user
      const user = await User.findOne({ userId });
      if (!user) {
        throw new Error('User not found');
      }

      // Encrypt sensitive birth information
      const encryptedBirthdateData = {
        birthDate: encrypt(birthdateData.birthDate),
        birthTime: encrypt(birthdateData.birthTime),
        birthLocation: encrypt(JSON.stringify(birthdateData.birthLocation)),
        numerologicalProfile: birthdateData.numerologicalProfile,
        encodingMetadata: birthdateData.encodingMetadata,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Initialize Mahamaya Matrix if it doesn't exist
      if (!user.mahamayaMatrix) {
        user.mahamayaMatrix = {
          completionStatus: {
            birthdateEncoding: false,
            astrologicalChart: false,
            jungianAssessment: false,
            geneKeysProfile: false,
            humanDesignProfile: false,
            archetypalQuintessence: false
          },
          metadata: {
            version: '1.0',
            lastSyncedAt: new Date()
          }
        };
      }

      // Store the birthdate encoding data in the user document
      user.mahamayaMatrix.birthdateEncoding = encryptedBirthdateData;
      user.mahamayaMatrix.completionStatus.birthdateEncoding = true;
      user.mahamayaMatrix.metadata.lastSyncedAt = new Date();

      // Also update the profileData.birthdate for compatibility with existing system
      if (!user.profileData) {
        user.profileData = {};
      }
      user.profileData.birthdate = birthdateData.birthDate;

      // Mark the Mixed field as modified so Mongoose saves it
      user.markModified('mahamayaMatrix');
      user.markModified('profileData');

      await user.save();

      return {
        success: true,
        userId,
        message: 'Birthdate encoding data stored successfully'
      };
    } catch (error) {
      console.error('Error storing birthdate encoding:', error);
      throw new Error(`Failed to store birthdate encoding: ${error.message}`);
    }
  }

  /**
   * Store Astrological Chart data in user document
   */
  async storeAstrologicalChart(userId, chartData) {
    try {
      const user = await User.findOne({ userId });
      if (!user) {
        throw new Error('User not found');
      }

      const astroData = {
        chartType: chartData.chartType, // 'natal', 'progressed', 'transit'
        chartData: chartData.chartData,
        planetaryPositions: chartData.planetaryPositions,
        houses: chartData.houses,
        aspects: chartData.aspects,
        interpretations: chartData.interpretations,
        calculationDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Initialize Mahamaya Matrix if needed
      if (!user.mahamayaMatrix) {
        user.mahamayaMatrix = {
          completionStatus: {
            birthdateEncoding: false,
            astrologicalChart: false,
            jungianAssessment: false,
            geneKeysProfile: false,
            humanDesignProfile: false,
            archetypalQuintessence: false
          },
          metadata: { version: '1.0', lastSyncedAt: new Date() }
        };
      }

      // Store in user document
      user.mahamayaMatrix.astrologicalChart = astroData;
      user.mahamayaMatrix.completionStatus.astrologicalChart = true;
      user.mahamayaMatrix.metadata.lastSyncedAt = new Date();

      await user.save();

      return {
        success: true,
        userId,
        chartType: chartData.chartType,
        message: 'Astrological chart data stored successfully'
      };
    } catch (error) {
      console.error('Error storing astrological chart:', error);
      throw new Error(`Failed to store astrological chart: ${error.message}`);
    }
  }

  /**
   * Store Jungian Assessment results in user document
   */
  async storeJungianAssessment(userId, assessmentData) {
    try {
      const user = await User.findOne({ userId });
      if (!user) {
        throw new Error('User not found');
      }

      const jungianData = {
        assessmentType: assessmentData.assessmentType,
        personalityType: assessmentData.personalityType,
        cognitiveFunction: assessmentData.cognitiveFunction,
        archetypeProfile: assessmentData.archetypeProfile,
        shadowWork: assessmentData.shadowWork,
        individuationStage: assessmentData.individuationStage,
        assessmentDate: new Date(),
        assessmentVersion: assessmentData.version || '1.0',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Initialize Mahamaya Matrix if needed
      if (!user.mahamayaMatrix) {
        user.mahamayaMatrix = {
          completionStatus: {
            birthdateEncoding: false,
            astrologicalChart: false,
            jungianAssessment: false,
            geneKeysProfile: false,
            humanDesignProfile: false,
            archetypalQuintessence: false
          },
          metadata: { version: '1.0', lastSyncedAt: new Date() }
        };
      }

      // Store in user document
      user.mahamayaMatrix.jungianAssessment = jungianData;
      user.mahamayaMatrix.completionStatus.jungianAssessment = true;
      user.mahamayaMatrix.metadata.lastSyncedAt = new Date();

      await user.save();

      return {
        success: true,
        userId,
        message: 'Jungian assessment data stored successfully'
      };
    } catch (error) {
      console.error('Error storing Jungian assessment:', error);
      throw new Error(`Failed to store Jungian assessment: ${error.message}`);
    }
  }

  /**
   * Store Gene Keys Profile data in user document
   */
  async storeGeneKeysProfile(userId, geneKeysData) {
    try {
      const user = await User.findOne({ userId });
      if (!user) {
        throw new Error('User not found');
      }

      const profileData = {
        lifeWork: geneKeysData.lifeWork,
        evolution: geneKeysData.evolution,
        radiance: geneKeysData.radiance,
        purpose: geneKeysData.purpose,
        geneKeys: geneKeysData.geneKeys,
        activationSequence: geneKeysData.activationSequence,
        contemplations: geneKeysData.contemplations,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Initialize Mahamaya Matrix if needed
      if (!user.mahamayaMatrix) {
        user.mahamayaMatrix = {
          completionStatus: {
            birthdateEncoding: false,
            astrologicalChart: false,
            jungianAssessment: false,
            geneKeysProfile: false,
            humanDesignProfile: false,
            archetypalQuintessence: false
          },
          metadata: { version: '1.0', lastSyncedAt: new Date() }
        };
      }

      // Store in user document
      user.mahamayaMatrix.geneKeysProfile = profileData;
      user.mahamayaMatrix.completionStatus.geneKeysProfile = true;
      user.mahamayaMatrix.metadata.lastSyncedAt = new Date();

      await user.save();

      return {
        success: true,
        userId,
        message: 'Gene Keys profile stored successfully'
      };
    } catch (error) {
      console.error('Error storing Gene Keys profile:', error);
      throw new Error(`Failed to store Gene Keys profile: ${error.message}`);
    }
  }

  /**
   * Update completion status for a specific layer (deprecated - now handled in store methods)
   */
  async updateCompletionStatus(userId, layer, completed) {
    // This method is deprecated - completion status is now updated directly in store methods
    console.warn('updateCompletionStatus is deprecated - completion status is handled in store methods');
  }

  /**
   * Get complete Mahamaya Matrix for a user
   */
  async getUserMatrix(userId) {
    try {
      const matrix = {};

      // Get user profile from existing UserIdentityData
      const userProfile = await User.findOne({ userId });

      if (!userProfile) {
        throw new Error('User profile not found');
      }

      // Include existing 6-layer identity structure as foundation for archetypal quintessence
      matrix.profile = {
        userId: userProfile.userId,
        name: userProfile.name,
        email: userProfile.email,
        identityStructure: userProfile.identityStructure, // Existing 6-layer structure
        mahamayaMatrix: userProfile.mahamayaMatrix || {
          completionStatus: {
            birthdateEncoding: false,
            astrologicalChart: false,
            jungianAssessment: false,
            geneKeysProfile: false,
            humanDesignProfile: false,
            archetypalQuintessence: false
          }
        }
      };

      // Get all Mahamaya layer data from the user document (6 layers total)
      matrix.birthdateEncoding = userProfile.mahamayaMatrix?.birthdateEncoding || null;
      matrix.astrologicalChart = userProfile.mahamayaMatrix?.astrologicalChart || null;
      matrix.jungianAssessment = userProfile.mahamayaMatrix?.jungianAssessment || null;
      matrix.geneKeysProfile = userProfile.mahamayaMatrix?.geneKeysProfile || null;
      matrix.humanDesignProfile = userProfile.mahamayaMatrix?.humanDesignProfile || null;
      matrix.archetypalQuintessence = userProfile.mahamayaMatrix?.archetypalQuintessence || null;

      // Add completion status at the matrix level for frontend access
      matrix.completionStatus = userProfile.mahamayaMatrix?.completionStatus || {
        birthdateEncoding: false,
        astrologicalChart: false,
        jungianAssessment: false,
        geneKeysProfile: false,
        humanDesignProfile: false,
        archetypalQuintessence: false
      };

      return {
        success: true,
        userId,
        matrix,
        completionPercentage: this.calculateCompletionPercentage(
          matrix.completionStatus
        )
      };
    } catch (error) {
      console.error('Error getting user matrix:', error);
      throw new Error(`Failed to get user matrix: ${error.message}`);
    }
  }

  /**
   * Get Birthdate Encoding data (with decryption) from user document
   */
  async getBirthdateEncoding(userId) {
    try {
      const user = await User.findOne({ userId });
      if (!user?.mahamayaMatrix?.birthdateEncoding) return null;

      const data = user.mahamayaMatrix.birthdateEncoding;

      // Decrypt sensitive fields
      return {
        ...data,
        birthDate: decrypt(data.birthDate),
        birthTime: decrypt(data.birthTime),
        birthLocation: JSON.parse(decrypt(data.birthLocation) || '{}')
      };
    } catch (error) {
      console.error('Error getting birthdate encoding:', error);
      return null;
    }
  }

  /**
   * Reset Birthdate Encoding data
   */
  async resetBirthdateEncoding(userId) {
    try {
      const user = await User.findOne({ userId });
      if (!user) {
        throw new Error('User not found');
      }

      // Clear birthdate encoding data and completion status
      if (user.mahamayaMatrix) {
        user.mahamayaMatrix.birthdateEncoding = null;
        user.mahamayaMatrix.completionStatus.birthdateEncoding = false;
        user.mahamayaMatrix.metadata.lastSyncedAt = new Date();

        // Mark as modified and save
        user.markModified('mahamayaMatrix.birthdateEncoding');
        user.markModified('mahamayaMatrix.completionStatus');
        user.markModified('mahamayaMatrix.metadata');
        await user.save();
      }

      // Also clear profileData.birthdate
      if (user.profileData) {
        user.profileData.birthdate = null;
        user.markModified('profileData');
        await user.save();
      }

      return {
        success: true,
        userId,
        message: 'Birthdate encoding data reset successfully'
      };
    } catch (error) {
      console.error('Error resetting birthdate encoding:', error);
      throw new Error(`Failed to reset birthdate encoding: ${error.message}`);
    }
  }

  /**
   * Store Human Design Profile data in user document
   */
  async storeHumanDesignProfile(userId, humanDesignData) {
    try {
      const user = await User.findOne({ userId });
      if (!user) {
        throw new Error('User not found');
      }

      const profileData = {
        type: humanDesignData.type,
        strategy: humanDesignData.strategy,
        authority: humanDesignData.authority,
        profile: humanDesignData.profile,
        centers: humanDesignData.centers,
        channels: humanDesignData.channels,
        gates: humanDesignData.gates,
        incarnationCross: humanDesignData.incarnationCross,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Initialize Mahamaya Matrix if needed
      if (!user.mahamayaMatrix) {
        user.mahamayaMatrix = {
          completionStatus: {
            birthdateEncoding: false,
            astrologicalChart: false,
            jungianAssessment: false,
            geneKeysProfile: false,
            humanDesignProfile: false,
            archetypalQuintessence: false
          },
          metadata: { version: '1.0', lastSyncedAt: new Date() }
        };
      }

      // Store in user document
      user.mahamayaMatrix.humanDesignProfile = profileData;
      user.mahamayaMatrix.completionStatus.humanDesignProfile = true;
      user.mahamayaMatrix.metadata.lastSyncedAt = new Date();

      await user.save();

      return {
        success: true,
        userId,
        message: 'Human Design profile stored successfully'
      };
    } catch (error) {
      console.error('Error storing Human Design profile:', error);
      throw new Error(`Failed to store Human Design profile: ${error.message}`);
    }
  }



  /**
   * Store Archetypal Quintessence data in user document
   * Synthesized from the 6-layer identity structure + 5 Mahamaya Ground layers
   */
  async storeArchetypalQuintessence(userId, quintessenceData) {
    try {
      const user = await User.findOne({ userId });
      if (!user) {
        throw new Error('User not found');
      }

      const quintessence = {
        // Core archetypal synthesis
        synthesizedArchetype: quintessenceData.synthesizedArchetype,
        personalityQuintessence: quintessenceData.personalityQuintessence, // Replaces I-Ching

        // Integration of 6-layer identity structure
        identityLayerSynthesis: {
          transcendentFoundation: quintessenceData.transcendentFoundation || {},
          individualIdentity: quintessenceData.individualIdentity || {},
          collectiveIdentity: quintessenceData.collectiveIdentity || {},
          soulIdentity: quintessenceData.soulIdentity || {},
          selfIdentity: quintessenceData.selfIdentity || {},
          integralIdentity: quintessenceData.integralIdentity || {}
        },

        // Mahamaya Ground layer synthesis
        mahamayaLayerSynthesis: {
          birthdateNumerology: quintessenceData.birthdateNumerology || {},
          astrologicalEssence: quintessenceData.astrologicalEssence || {},
          jungianArchetype: quintessenceData.jungianArchetype || {},
          geneKeysActivation: quintessenceData.geneKeysActivation || {},
          humanDesignType: quintessenceData.humanDesignType || {}
        },

        // Synthesized insights
        coreThemes: quintessenceData.coreThemes,
        shadowIntegration: quintessenceData.shadowIntegration,
        individuationPath: quintessenceData.individuationPath,
        symbolicResonance: quintessenceData.symbolicResonance,
        transformationalGuidance: quintessenceData.transformationalGuidance,

        synthesisDate: new Date(),
        version: quintessenceData.version || '1.0',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Initialize Mahamaya Matrix if needed
      if (!user.mahamayaMatrix) {
        user.mahamayaMatrix = {
          completionStatus: {
            birthdateEncoding: false,
            astrologicalChart: false,
            jungianAssessment: false,
            geneKeysProfile: false,
            humanDesignProfile: false,
            archetypalQuintessence: false
          },
          metadata: { version: '1.0', lastSyncedAt: new Date() }
        };
      }

      // Store in user document
      user.mahamayaMatrix.archetypalQuintessence = quintessence;
      user.mahamayaMatrix.completionStatus.archetypalQuintessence = true;
      user.mahamayaMatrix.metadata.lastSyncedAt = new Date();

      await user.save();

      return {
        success: true,
        userId,
        message: 'Archetypal quintessence stored successfully'
      };
    } catch (error) {
      console.error('Error storing archetypal quintessence:', error);
      throw new Error(`Failed to store archetypal quintessence: ${error.message}`);
    }
  }

  /**
   * Delete user data (soft delete)
   */
  async deleteUserData(userId, hardDelete = false) {
    try {
      if (hardDelete) {
        // Hard delete - remove all data
        const collections = Object.values(this.collections);
        for (const collection of collections) {
          await this.db.collection(collection).deleteMany({ userId });
        }
      } else {
        // Soft delete - mark as inactive
        await this.db.collection(this.collections.userProfiles)
          .updateOne({ userId }, {
            $set: {
              isActive: false,
              deletedAt: new Date(),
              updatedAt: new Date()
            }
          });
      }

      return {
        success: true,
        userId,
        message: `User data ${hardDelete ? 'permanently deleted' : 'deactivated'} successfully`
      };
    } catch (error) {
      console.error('Error deleting user data:', error);
      throw new Error(`Failed to delete user data: ${error.message}`);
    }
  }

  /**
   * Calculate completion percentage
   */
  calculateCompletionPercentage(completionStatus) {
    const total = Object.keys(completionStatus).length;
    const completed = Object.values(completionStatus).filter(Boolean).length;
    return Math.round((completed / total) * 100);
  }
}

// Export singleton instance
const mahamayaMatrixService = new MahamayaMatrixService();
export default mahamayaMatrixService;
