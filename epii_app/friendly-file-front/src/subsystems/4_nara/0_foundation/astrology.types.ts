/**
 * Astrological Data Types - Epic 2, Story E2_F1_S2
 * 
 * TypeScript interfaces for real-time astrological data integration.
 * Supports daily caching and future Nara agent processing.
 */

export interface Planet {
  name: string;
  sign: string;
  degrees: number;
  motion: 'direct' | 'retrograde';
  house?: number; // For natal chart context
}

export interface Aspect {
  planet1: string;
  planet2: string;
  aspect: 'Conjunction' | 'Opposition' | 'Trine' | 'Square' | 'Sextile' | 'Quincunx';
  orb: number;
  applying: boolean;
  exact?: boolean;
}

export interface MoonPhase {
  phase: 'New Moon' | 'Waxing Crescent' | 'First Quarter' | 'Waxing Gibbous' | 
         'Full Moon' | 'Waning Gibbous' | 'Last Quarter' | 'Waning Crescent';
  illumination: number; // Percentage 0-100
  nextPhase: string;
  nextPhaseDate: string;
}

export interface PlanetaryHour {
  currentRuler: string;
  startTime: string;
  endTime: string;
  nextRuler: string;
  nextStartTime: string;
}

export interface AstrologicalData {
  timestamp: string;
  location: {
    latitude: number;
    longitude: number;
    timezone: string;
  };
  planets: Planet[];
  aspects: Aspect[];
  moonPhase: MoonPhase;
  planetaryHour: PlanetaryHour;
  houses: number[]; // House cusps in degrees
  ascendant: number;
  midheaven: number;
}

export interface AstrologicalCache {
  data: AstrologicalData | null;
  lastUpdated: Date | null;
  isLoading: boolean;
  error: string | null;
  cacheExpiry: number; // 24 hours in milliseconds
}

export interface AstrologicalContextSummary {
  sunSign: string;
  moonSign: string;
  majorAspects: Aspect[];
  currentPhase: string;
  planetaryHour: string;
  significantTransits: string[];
}

// Error types
export class AstrologicalError extends Error {
  constructor(
    message: string,
    public code: 'FETCH_ERROR' | 'PARSE_ERROR' | 'CACHE_ERROR' | 'API_ERROR',
    public statusCode?: number
  ) {
    super(message);
    this.name = 'AstrologicalError';
  }
}

// API Result wrapper
export interface AstroApiResult<T> {
  data: T | null;
  error: AstrologicalError | null;
}

// Configuration for astrological calculations
export interface AstroConfig {
  defaultLocation: {
    latitude: number;
    longitude: number;
    timezone: string;
  };
  cacheExpiry: number;
  refreshInterval: number;
  apiEndpoint: string;
}
