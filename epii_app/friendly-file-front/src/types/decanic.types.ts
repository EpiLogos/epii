/**
 * TypeScript types for Decanic system - Epic 2, Story E2_F1_S1
 * 
 * Defines interfaces for Tarot card to Hermetic decan associations
 * and archetypal information from the #2-3 branch of the Bimba map.
 */

export interface DecanicAspect {
  theme: string;
  description: string;
  guidance: string;
}

export interface DecanicAssociation {
  cardName: string;
  decanAssociation: string;
  decanName: string;
  archetypeDescription: string;
  keywords: string[];
  bodyPart: string;
  egyptianDeity: string;
  iconography: string;
  reflectivePrompt: string;
  degrees: string;
  zodiacSign: string;
  traditionalRuler: string;
  lightAspect: DecanicAspect;
  shadowAspect: DecanicAspect;
  activeAspect?: DecanicAspect;
  cardOrientation?: 'upright' | 'reversed';
}

export interface Decan {
  id: string;
  name: string;
  zodiacSign: string;
  degrees: string;
  traditionalRuler: string;
  tarotCard: string;
  bodyPart: string;
  egyptianDeity: string;
  iconography: string;
  description: string;
  bimbaCoordinate: string;
  archetypeDescription: string;
  keywords: string[];
  reflectivePrompt: string;
}

export interface DecanicApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  error?: string;
}

export interface TarotCard {
  name: string;
  suit?: string;
  number?: number;
  arcana?: 'major' | 'minor';
  reversed?: boolean;
  imageUrl?: string;
  description?: string;
}

export interface OracleReading {
  id: string;
  cards: TarotCard[];
  spread: string;
  timestamp: Date;
  decanicAssociations?: DecanicAssociation[];
}

export interface DecanicDisplayProps {
  cardName: string;
  reversed?: boolean;
  showDetails?: boolean;
  onDetailsToggle?: (show: boolean) => void;
  className?: string;
}

export interface DecanicModalProps {
  decanicData: DecanicAssociation;
  isOpen: boolean;
  onClose: () => void;
}

export interface DecanicServiceState {
  decanicData: DecanicAssociation | null;
  loading: boolean;
  error: string | null;
}

// Zustand store interface for decanic state management
export interface DecanicStore {
  // State
  decanicCache: Map<string, DecanicAssociation>;
  allDecans: Decan[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;

  // Actions
  getDecanicAssociation: (cardName: string, reversed?: boolean) => Promise<DecanicAssociation | null>;
  getAllDecans: () => Promise<Decan[]>;
  refreshCache: () => Promise<void>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

// API endpoint types
export type DecanicEndpoints = {
  getCardAssociation: (cardName: string, reversed?: boolean) => string;
  getAllDecans: () => string;
  getDecanByName: (decanName: string) => string;
  getDecansBySign: (zodiacSign: string) => string;
  refreshCache: () => string;
  getMappings: () => string;
};

// Constants for zodiac signs and planetary rulers
export const ZODIAC_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
] as const;

export const PLANETARY_RULERS = [
  'Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Jupiter', 'Saturn'
] as const;

export type ZodiacSign = typeof ZODIAC_SIGNS[number];
export type PlanetaryRuler = typeof PLANETARY_RULERS[number];

// Tarot deck types
export const TAROT_SUITS = ['Wands', 'Cups', 'Swords', 'Pentacles'] as const;
export const MAJOR_ARCANA = [
  'The Fool', 'The Magician', 'The High Priestess', 'The Empress', 'The Emperor',
  'The Hierophant', 'The Lovers', 'The Chariot', 'Strength', 'The Hermit',
  'Wheel of Fortune', 'Justice', 'The Hanged Man', 'Death', 'Temperance',
  'The Devil', 'The Tower', 'The Star', 'The Moon', 'The Sun',
  'Judgement', 'The World'
] as const;

export type TarotSuit = typeof TAROT_SUITS[number];
export type MajorArcana = typeof MAJOR_ARCANA[number];

// Error types
export class DecanicError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'DecanicError';
  }
}

// Utility type for API responses
export type ApiResult<T> = {
  data: T;
  error: null;
} | {
  data: null;
  error: DecanicError;
};

// Component state types
export interface UseDecanicAssociationResult {
  decanicData: DecanicAssociation | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export interface UseAllDecansResult {
  decans: Decan[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}
