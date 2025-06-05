import mongoose from 'mongoose';

/**
 * User Schema
 *
 * Incorporates the 6 identities structure from #5-0-X as a template for user data fields.
 * This structure allows for a comprehensive representation of user identity that can be
 * easily integrated with the LightRAG system.
 */
const userSchema = new mongoose.Schema({
  userId: { // This could be an external ID (e.g., from auth provider) or generated
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  // Identity structure based on the 6 identities at #5-0-X
  identityStructure: {
    // #5-0-0: Transcendent Foundation - The implicit "I Am" or "Aham"
    transcendentFoundation: {
      type: Object,
      default: {
        coreValues: [], // Core values that define the user's fundamental identity
        lifePhilosophy: '', // User's overarching life philosophy or worldview
        spiritualOrientation: '', // User's spiritual or existential orientation
      }
    },
    // #5-0-1: Individual Identity - Personal or ego dimension
    individualIdentity: {
      type: Object,
      default: {
        name: '', // Archetypal name for individual identity
        personalTraits: [], // Key personality traits
        strengths: [], // Personal strengths
        challenges: [], // Personal challenges or growth areas
        interests: [], // Personal interests and hobbies
      }
    },
    // #5-0-2: Collective Identity - Universal dimension
    collectiveIdentity: {
      type: Object,
      default: {
        name: '', // Archetypal name for collective identity
        culturalBackground: '', // Cultural or ethnic background
        communities: [], // Communities the user identifies with
        socialRoles: [], // Social roles the user plays
      }
    },
    // #5-0-3: Soul Identity - Personal identity oriented toward the collective
    soulIdentity: {
      type: Object,
      default: {
        name: '', // Archetypal name for soul identity
        purpose: '', // Sense of purpose or calling
        values: [], // Core values that guide actions
        aspirations: [], // Long-term aspirations
      }
    },
    // #5-0-4: Self Identity - Conjunction of collective and personal
    selfIdentity: {
      type: Object,
      default: {
        name: '', // Archetypal name for self identity
        selfPerception: '', // How the user sees themselves
        growthAreas: [], // Areas for personal growth
        lifeStory: '', // Narrative of key life experiences
      }
    },
    // #5-0-5: Integral Identity - Integration that creates recursive twist
    integralIdentity: {
      type: Object,
      default: {
        vision: '', // Vision for personal and collective future
        integration: '', // How the user integrates different aspects of identity
        evolution: '', // How the user's identity has evolved over time
      }
    }
  },
  // Additional profile data not covered by the identity structure
  profileData: {
    type: Object,
    default: {
      birthdate: null, // For birthdate encoding
      location: '',
      bio: '',
      avatarUrl: '',
      socialLinks: {},
    }
  },

  // Enhanced authentication metadata
  authMetadata: {
    type: Object,
    default: {
      isEmailVerified: false,
      lastLoginAt: null,
      loginCount: 0,
      registrationIP: null,
      userAgent: null,
      createdAt: null,
      updatedAt: null
    }
  },

  // Mahamaya Matrix integration (6 layers total) - flexible schema
  mahamayaMatrix: {
    type: mongoose.Schema.Types.Mixed,
    default: {
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
        lastSyncedAt: null
      }
      // Additional fields will be added dynamically:
      // birthdateEncoding: { ... }
      // astrologicalChart: { ... }
      // jungianAssessment: { ... }
      // geneKeysProfile: { ... }
      // humanDesignProfile: { ... }
      // archetypalQuintessence: { ... }
    }
  },
  // User preferences for system interaction
  preferences: {
    type: Object,
    default: {
      theme: 'dark', // UI theme preference
      language: 'en', // Language preference
      notifications: true, // Notification preferences
      privacySettings: {
        shareData: false, // Whether to share data for system improvement
        analyticsConsent: false, // Consent for analytics
      },
      agentPreferences: {
        responseStyle: 'balanced', // balanced, concise, detailed
        creativityLevel: 'balanced', // analytical, balanced, creative
        expertiseLevel: 'intermediate', // beginner, intermediate, advanced
      }
    }
  },
  // System usage data
  systemUsage: {
    type: Object,
    default: {
      lastLogin: null,
      loginCount: 0,
      documentsAnalyzed: 0,
      queriesSubmitted: 0,
    }
  },
  // Timestamps are managed automatically by the timestamps option
}, { timestamps: true });

// Add virtual for full name if needed later
userSchema.virtual('fullName').get(function() {
  return this.name;
});

// Method to safely return user data without sensitive information
userSchema.methods.toSafeObject = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

// Create the model with specific collection name "UserIdentityData"
const User = mongoose.model('User', userSchema, 'UserIdentityData');

export default User;
