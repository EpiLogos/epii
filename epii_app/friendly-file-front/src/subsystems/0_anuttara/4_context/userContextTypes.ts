/**
 * User Context Types
 *
 * Defines TypeScript interfaces for the user context system.
 * These types are used throughout the application to ensure type safety
 * when working with user data.
 */

// Identity structure based on the 6 identities at #5-0-X
export interface IdentityStructure {
  // #5-0-0: Transcendent Foundation
  transcendentFoundation: {
    coreValues: string[];
    lifePhilosophy: string;
    spiritualOrientation: string;
  };

  // #5-0-1: Individual Identity
  individualIdentity: {
    personalTraits: string[];
    strengths: string[];
    challenges: string[];
    interests: string[];
  };

  // #5-0-2: Collective Identity
  collectiveIdentity: {
    culturalBackground: string;
    communities: string[];
    socialRoles: string[];
  };

  // #5-0-3: Soul Identity
  soulIdentity: {
    purpose: string;
    values: string[];
    aspirations: string[];
  };

  // #5-0-4: Self Identity
  selfIdentity: {
    selfPerception: string;
    growthAreas: string[];
    lifeStory: string;
  };

  // #5-0-5: Integral Identity
  integralIdentity: {
    vision: string;
    integration: string;
    evolution: string;
  };
}

// Profile data not covered by identity structure
export interface ProfileData {
  birthdate: string | null;
  location: string;
  bio: string;
  avatarUrl: string;
  socialLinks: Record<string, string>;
}

// User preferences for system interaction
export interface UserPreferences {
  theme: 'light' | 'dark';
  language: string;
  notifications: boolean;
  privacySettings: {
    shareData: boolean;
    analyticsConsent: boolean;
  };
  agentPreferences: {
    responseStyle: 'concise' | 'balanced' | 'detailed';
    creativityLevel: 'analytical' | 'balanced' | 'creative';
    expertiseLevel: 'beginner' | 'intermediate' | 'advanced';
  };
}

// System usage data
export interface SystemUsage {
  lastLogin: string | null;
  loginCount: number;
  documentsAnalyzed: number;
  queriesSubmitted: number;
}

// Complete user data
export interface UserData {
  userId: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  identityStructure: IdentityStructure;
  profileData: ProfileData;
  preferences: UserPreferences;
  systemUsage: SystemUsage;
  mahamayaMatrix?: {
    completionStatus: {
      birthdateEncoding: boolean;
      astrologicalChart: boolean;
      jungianAssessment: boolean;
      geneKeysProfile: boolean;
      humanDesignProfile: boolean;
      archetypalQuintessence: boolean;
    };
    birthdateEncoding?: any;
    astrologicalChart?: any;
    jungianAssessment?: any;
    geneKeysProfile?: any;
    humanDesignProfile?: any;
    archetypalQuintessence?: any;
    metadata?: {
      version: string;
      lastSyncedAt: string;
    };
  };
}

// User context state
export interface UserContextState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  userData: UserData | null;
}

// User context actions
export type UserContextAction =
  | { type: 'LOGIN_SUCCESS'; payload: UserData }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_PREFERENCES'; payload: Partial<UserPreferences> }
  | { type: 'UPDATE_PROFILE'; payload: Partial<ProfileData> }
  | { type: 'UPDATE_IDENTITY'; payload: Partial<IdentityStructure> }
  | { type: 'SET_LOADING'; payload: boolean };

// User context value provided to consumers
export interface UserContextValue {
  state: UserContextState;
  login: (userData: UserData) => Promise<void>;
  logout: () => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  updateProfile: (profile: Partial<ProfileData>) => void;
  updateIdentity: (identity: Partial<IdentityStructure>) => void;
}
