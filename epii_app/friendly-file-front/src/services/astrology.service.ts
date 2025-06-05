/**
 * Astrological Service - Epic 2, Story E2_F1_S2
 * 
 * Service for fetching and caching real-time astrological data.
 * Updates daily and provides foundation for future Nara agent processing.
 */

import {
  AstrologicalData,
  AstrologicalCache,
  AstrologicalContextSummary,
  AstrologicalError,
  AstroApiResult,
  AstroConfig,
  Planet,
  Aspect,
  MoonPhase,
  PlanetaryHour
} from '../types/astrology.types';

class AstrologicalService {
  private baseUrl: string;
  private cache: AstrologicalCache;
  private config: AstroConfig;

  constructor() {
    this.baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
    
    this.config = {
      defaultLocation: {
        latitude: 40.7128, // NYC default
        longitude: -74.0060,
        timezone: 'America/New_York'
      },
      cacheExpiry: 24 * 60 * 60 * 1000, // 24 hours
      refreshInterval: 60 * 60 * 1000, // 1 hour check interval
      apiEndpoint: '/api/bpmcp/astrology/current'
    };

    this.cache = {
      data: null,
      lastUpdated: null,
      isLoading: false,
      error: null,
      cacheExpiry: this.config.cacheExpiry
    };

    // Load cached data from localStorage on initialization
    this.loadCacheFromStorage();
  }

  /**
   * Get current astrological data with caching
   */
  async getCurrentAstrologicalData(forceRefresh: boolean = false): Promise<AstroApiResult<AstrologicalData>> {
    try {
      // Check if cache is valid and not forcing refresh
      if (!forceRefresh && this.isCacheValid()) {
        console.log('[Astrology Service] Using cached data');
        return { data: this.cache.data, error: null };
      }

      // Fetch fresh data
      console.log('[Astrology Service] Fetching fresh astrological data...');
      this.cache.isLoading = true;
      this.cache.error = null;

      const response = await fetch(`${this.baseUrl}${this.config.apiEndpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          toolName: 'getAstrologicalData',
          args: {
            location: this.config.defaultLocation,
            timestamp: new Date().toISOString()
          }
        })
      });

      if (!response.ok) {
        throw new AstrologicalError(
          `Failed to fetch astrological data: ${response.statusText}`,
          'FETCH_ERROR',
          response.status
        );
      }

      const result = await response.json();
      
      if (!result.data) {
        throw new AstrologicalError(
          'No astrological data received from API',
          'API_ERROR'
        );
      }

      // Update cache
      this.cache.data = result.data;
      this.cache.lastUpdated = new Date();
      this.cache.isLoading = false;
      this.cache.error = null;

      // Save to localStorage
      this.saveCacheToStorage();

      console.log('[Astrology Service] Fresh data cached successfully');
      return { data: this.cache.data, error: null };

    } catch (error) {
      this.cache.isLoading = false;
      
      const astroError = error instanceof AstrologicalError 
        ? error 
        : new AstrologicalError(
            error instanceof Error ? error.message : 'Unknown error occurred',
            'FETCH_ERROR'
          );
      
      this.cache.error = astroError.message;
      
      console.error('[Astrology Service] Error fetching data:', astroError);
      
      // Return cached data if available, even if stale
      if (this.cache.data) {
        console.log('[Astrology Service] Returning stale cached data due to error');
        return { data: this.cache.data, error: astroError };
      }
      
      return { data: null, error: astroError };
    }
  }

  /**
   * Get simplified astrological context summary
   */
  async getAstrologicalContext(): Promise<AstroApiResult<AstrologicalContextSummary>> {
    const result = await this.getCurrentAstrologicalData();
    
    if (result.error && !result.data) {
      return { data: null, error: result.error };
    }

    if (!result.data) {
      return { 
        data: null, 
        error: new AstrologicalError('No astrological data available', 'CACHE_ERROR') 
      };
    }

    const data = result.data;
    const sun = data.planets.find(p => p.name === 'Sun');
    const moon = data.planets.find(p => p.name === 'Moon');
    
    // Get major aspects (tight orbs only)
    const majorAspects = data.aspects.filter(aspect => 
      aspect.orb <= 3 && 
      ['Conjunction', 'Opposition', 'Trine', 'Square'].includes(aspect.aspect)
    );

    // Identify significant transits (placeholder for future logic)
    const significantTransits = this.identifySignificantTransits(data);

    const summary: AstrologicalContextSummary = {
      sunSign: sun ? `${sun.sign} ${Math.floor(sun.degrees)}°` : 'Unknown',
      moonSign: moon ? `${moon.sign} ${Math.floor(moon.degrees)}°` : 'Unknown',
      majorAspects: majorAspects.slice(0, 3), // Top 3 aspects
      currentPhase: data.moonPhase.phase,
      planetaryHour: data.planetaryHour.currentRuler,
      significantTransits
    };

    return { data: summary, error: result.error };
  }

  /**
   * Check if cache is still valid (within 24 hours)
   */
  private isCacheValid(): boolean {
    if (!this.cache.data || !this.cache.lastUpdated) {
      return false;
    }

    const now = new Date().getTime();
    const cacheTime = this.cache.lastUpdated.getTime();
    const timeDiff = now - cacheTime;

    return timeDiff < this.cache.cacheExpiry;
  }

  /**
   * Identify significant transits (placeholder for future Nara agent logic)
   */
  private identifySignificantTransits(data: AstrologicalData): string[] {
    const transits: string[] = [];
    
    // Simple logic for now - can be enhanced by future Nara agent
    data.aspects.forEach(aspect => {
      if (aspect.orb <= 2 && aspect.exact) {
        transits.push(`${aspect.planet1} ${aspect.aspect} ${aspect.planet2}`);
      }
    });

    return transits.slice(0, 3); // Top 3 significant transits
  }

  /**
   * Save cache to localStorage
   */
  private saveCacheToStorage(): void {
    try {
      const cacheData = {
        data: this.cache.data,
        lastUpdated: this.cache.lastUpdated?.toISOString(),
        cacheExpiry: this.cache.cacheExpiry
      };
      localStorage.setItem('astrology_cache', JSON.stringify(cacheData));
    } catch (error) {
      console.warn('[Astrology Service] Failed to save cache to localStorage:', error);
    }
  }

  /**
   * Load cache from localStorage
   */
  private loadCacheFromStorage(): void {
    try {
      const cached = localStorage.getItem('astrology_cache');
      if (cached) {
        const cacheData = JSON.parse(cached);
        this.cache.data = cacheData.data;
        this.cache.lastUpdated = cacheData.lastUpdated ? new Date(cacheData.lastUpdated) : null;
        this.cache.cacheExpiry = cacheData.cacheExpiry || this.config.cacheExpiry;
        
        console.log('[Astrology Service] Loaded cache from localStorage');
      }
    } catch (error) {
      console.warn('[Astrology Service] Failed to load cache from localStorage:', error);
    }
  }

  /**
   * Force refresh cache
   */
  async refreshCache(): Promise<void> {
    await this.getCurrentAstrologicalData(true);
  }

  /**
   * Get cache status
   */
  getCacheStatus(): { isValid: boolean; lastUpdated: Date | null; isLoading: boolean } {
    return {
      isValid: this.isCacheValid(),
      lastUpdated: this.cache.lastUpdated,
      isLoading: this.cache.isLoading
    };
  }
}

// Export singleton instance
export const astrologicalService = new AstrologicalService();
export default astrologicalService;
