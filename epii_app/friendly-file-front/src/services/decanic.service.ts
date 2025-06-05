/**
 * Decanic Service - Epic 2, Story E2_F1_S1
 *
 * Direct service for accessing decanic data from BPMCP #2-3 branch.
 * Implements proper caching and direct lookup from all decan nodes.
 */

import {
  DecanicAssociation,
  Decan,
  DecanicError,
  ApiResult
} from '../types/decanic.types';

interface DecanData {
  name: string;
  tarotCard: string;
  traditionalRuler: string;
  zodiacSign: string;
  bodyPart: string;
  egyptianDeity: string;
  iconography: string;
  degrees: string;
  // Extensible for future tarot systems
  [key: string]: any;
}

class DecanicService {
  private baseUrl: string;
  private decanCache: Map<string, DecanData> = new Map(); // Card name -> Decan data
  private allDecansCache: DecanData[] = [];
  private cacheInitialized = false;
  private cacheExpiry = 60 * 60 * 1000; // 1 hour
  private lastCacheUpdate = 0;

  constructor() {
    this.baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
  }

  /**
   * Call BPMCP service directly
   */
  private async callBPMCP(toolName: string, args: any): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api/bpmcp/call-tool`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          toolName,
          args
        })
      });

      if (!response.ok) {
        throw new Error(`BPMCP call failed: ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('BPMCP call failed:', error);
      throw error;
    }
  }

  /**
   * Initialize cache by loading all decan data from #2-3 branch
   * Extensible to handle multiple tarot systems and additional properties
   */
  private async initializeCache(): Promise<void> {
    const now = Date.now();

    // Check if cache is still valid
    if (this.cacheInitialized && (now - this.lastCacheUpdate) < this.cacheExpiry) {
      return;
    }

    console.log('[Decanic Service] Initializing cache from #2-3 branch...');

    try {
      // Query all decan nodes with extensible property selection
      // This query will automatically include any new properties added to Decan nodes
      const result = await this.callBPMCP('queryBimbaGraph', {
        query: `MATCH (n:Decan)
                RETURN n.name, n.tarotCard, n.traditionalRuler, n.zodiacSign,
                       n.bodyPart, n.egyptianDeity, n.iconography, n.degrees,
                       properties(n) as allProperties
                ORDER BY n.name`
      });

      if (result && result.processedRecords) {
        this.allDecansCache = [];
        this.decanCache.clear();

        result.processedRecords.forEach((record: any) => {
          // Start with core properties
          const decanData: DecanData = {
            name: record['n.name'] || '',
            tarotCard: record['n.tarotCard'] || '',
            traditionalRuler: record['n.traditionalRuler'] || '',
            zodiacSign: record['n.zodiacSign'] || '',
            bodyPart: record['n.bodyPart'] || '',
            egyptianDeity: record['n.egyptianDeity'] || '',
            iconography: record['n.iconography'] || '',
            degrees: record['n.degrees'] || ''
          };

          // Add any additional properties from the node (extensible for future tarot systems)
          if (record.allProperties) {
            Object.keys(record.allProperties).forEach(key => {
              if (!decanData.hasOwnProperty(key)) {
                decanData[key] = record.allProperties[key];
              }
            });
          }

          this.allDecansCache.push(decanData);

          // Index by tarot card name for quick lookup
          if (decanData.tarotCard) {
            this.decanCache.set(decanData.tarotCard.toLowerCase(), decanData);
          }

          // Index by any additional tarot card properties (for future systems)
          Object.keys(decanData).forEach(key => {
            if (key.toLowerCase().includes('tarot') && key !== 'tarotCard' && decanData[key]) {
              this.decanCache.set(decanData[key].toLowerCase(), decanData);
            }
          });
        });

        this.cacheInitialized = true;
        this.lastCacheUpdate = now;

        console.log(`[Decanic Service] Cache initialized with ${this.allDecansCache.length} decans`);
        console.log(`[Decanic Service] Card lookup cache has ${this.decanCache.size} entries`);

        // Log any additional properties found (for debugging future extensions)
        const additionalProps = new Set<string>();
        this.allDecansCache.forEach(decan => {
          Object.keys(decan).forEach(key => {
            if (!['name', 'tarotCard', 'traditionalRuler', 'zodiacSign', 'bodyPart', 'egyptianDeity', 'iconography', 'degrees'].includes(key)) {
              additionalProps.add(key);
            }
          });
        });

        if (additionalProps.size > 0) {
          console.log(`[Decanic Service] Additional properties found: ${Array.from(additionalProps).join(', ')}`);
        }
      } else {
        throw new Error('No decan data returned from query');
      }
    } catch (error) {
      console.error('[Decanic Service] Failed to initialize cache:', error);
      throw error;
    }
  }

  /**
   * Get decanic association for a Tarot card
   */
  async getDecanicAssociation(
    cardName: string,
    reversed: boolean = false
  ): Promise<ApiResult<DecanicAssociation>> {
    try {
      // Ensure cache is initialized
      await this.initializeCache();

      // Normalize card name for lookup
      const normalizedCardName = cardName.toLowerCase().trim();

      // Direct lookup from cache
      const decanData = this.decanCache.get(normalizedCardName);

      if (!decanData) {
        return {
          data: null,
          error: new DecanicError(`No decanic association found for "${cardName}"`, 'NOT_FOUND')
        };
      }

      // Create DecanicAssociation from cached data
      const association: DecanicAssociation = {
        cardName,
        decanAssociation: `${decanData.traditionalRuler} in ${decanData.zodiacSign}`,
        decanName: decanData.name,
        archetypeDescription: this.generateArchetypalDescription(decanData),
        keywords: this.generateKeywords(decanData),
        bodyPart: decanData.bodyPart,
        egyptianDeity: decanData.egyptianDeity,
        iconography: decanData.iconography,
        reflectivePrompt: this.generateReflectivePrompt(decanData),
        degrees: decanData.degrees,
        zodiacSign: decanData.zodiacSign,
        traditionalRuler: decanData.traditionalRuler,
        lightAspect: {
          theme: 'Constructive Expression',
          description: `The harmonious manifestation of ${decanData.traditionalRuler} energy in ${decanData.zodiacSign}`,
          guidance: `Embrace this ${decanData.traditionalRuler} energy as a gift for growth and positive action`
        },
        shadowAspect: {
          theme: 'Shadow Integration',
          description: `The challenging expression of ${decanData.traditionalRuler} energy in ${decanData.zodiacSign}`,
          guidance: `Examine where this ${decanData.traditionalRuler} energy might be blocked or misdirected`
        },
        activeAspect: undefined, // Will be set below
        cardOrientation: reversed ? 'reversed' : 'upright'
      };

      // Set active aspect based on orientation
      association.activeAspect = reversed ? association.shadowAspect : association.lightAspect;

      return { data: association, error: null };

    } catch (error) {
      return {
        data: null,
        error: new DecanicError(
          error instanceof Error ? error.message : 'Failed to get decanic association',
          'CACHE_ERROR'
        )
      };
    }
  }

  /**
   * Get all available decans (for debugging/testing)
   */
  async getAllDecans(): Promise<ApiResult<DecanData[]>> {
    try {
      await this.initializeCache();
      return { data: [...this.allDecansCache], error: null };
    } catch (error) {
      return {
        data: null,
        error: new DecanicError(
          error instanceof Error ? error.message : 'Failed to get all decans',
          'CACHE_ERROR'
        )
      };
    }
  }

  /**
   * Get available card names (for debugging/testing)
   */
  async getAvailableCards(): Promise<string[]> {
    try {
      // Prevent infinite loops by checking if we're already initializing
      if (this.cacheInitialized) {
        return Array.from(this.decanCache.keys());
      }

      await this.initializeCache();
      return Array.from(this.decanCache.keys());
    } catch (error) {
      console.error('Failed to get available cards:', error);
      return [];
    }
  }

  /**
   * Force cache refresh
   */
  async refreshCache(): Promise<void> {
    this.cacheInitialized = false;
    this.lastCacheUpdate = 0;
    await this.initializeCache();
  }

  /**
   * Generate archetypal description
   */
  private generateArchetypalDescription(decanData: DecanData): string {
    const ruler = decanData.traditionalRuler;
    const sign = decanData.zodiacSign;
    const bodyPart = decanData.bodyPart;

    const archetypeMap: Record<string, string> = {
      'Mars': 'Dynamic Action and Assertive Will',
      'Sun': 'Radiant Self-Expression and Creative Power',
      'Venus': 'Harmonious Relating and Aesthetic Appreciation',
      'Mercury': 'Communicative Intelligence and Adaptive Learning',
      'Moon': 'Intuitive Receptivity and Emotional Wisdom',
      'Jupiter': 'Expansive Vision and Philosophical Understanding',
      'Saturn': 'Structured Discipline and Mature Responsibility'
    };

    const rulerArchetype = archetypeMap[ruler] || 'Archetypal Influence';
    return `Archetype of ${rulerArchetype} through ${sign} - embodied in ${bodyPart}`;
  }

  /**
   * Generate keywords
   */
  private generateKeywords(decanData: DecanData): string[] {
    const ruler = decanData.traditionalRuler;
    const sign = decanData.zodiacSign;

    const keywordMap: Record<string, string[]> = {
      'Mars': ['action', 'courage', 'initiative', 'passion', 'drive'],
      'Sun': ['vitality', 'creativity', 'self-expression', 'leadership', 'radiance'],
      'Venus': ['harmony', 'beauty', 'love', 'values', 'pleasure'],
      'Mercury': ['communication', 'learning', 'adaptability', 'wit', 'analysis'],
      'Moon': ['intuition', 'emotion', 'receptivity', 'cycles', 'nurturing'],
      'Jupiter': ['expansion', 'wisdom', 'optimism', 'philosophy', 'growth'],
      'Saturn': ['structure', 'discipline', 'responsibility', 'mastery', 'limitation']
    };

    const signKeywords: Record<string, string[]> = {
      'Aries': ['pioneering', 'bold', 'impulsive'],
      'Taurus': ['stable', 'sensual', 'persistent'],
      'Gemini': ['versatile', 'curious', 'communicative'],
      'Cancer': ['nurturing', 'protective', 'emotional'],
      'Leo': ['creative', 'dramatic', 'generous'],
      'Virgo': ['analytical', 'practical', 'perfectionist'],
      'Libra': ['balanced', 'diplomatic', 'aesthetic'],
      'Scorpio': ['intense', 'transformative', 'mysterious'],
      'Sagittarius': ['adventurous', 'philosophical', 'optimistic'],
      'Capricorn': ['ambitious', 'disciplined', 'practical'],
      'Aquarius': ['innovative', 'humanitarian', 'independent'],
      'Pisces': ['compassionate', 'intuitive', 'spiritual']
    };

    return [
      ...(keywordMap[ruler] || []),
      ...(signKeywords[sign] || [])
    ].slice(0, 5);
  }

  /**
   * Generate reflective prompt
   */
  private generateReflectivePrompt(decanData: DecanData): string {
    const ruler = decanData.traditionalRuler;
    const bodyPart = decanData.bodyPart;

    const prompts: Record<string, string> = {
      'Mars': `How might you channel assertive energy constructively in your current situation?`,
      'Sun': `What aspects of your authentic self are seeking creative expression?`,
      'Venus': `Where in your life are you being called to create more harmony and beauty?`,
      'Mercury': `What important communication or learning is trying to emerge?`,
      'Moon': `What emotional wisdom is your intuition offering you right now?`,
      'Jupiter': `How might you expand your perspective or embrace greater possibilities?`,
      'Saturn': `What structures or disciplines would serve your long-term growth?`
    };

    const basePrompt = prompts[ruler] || 'What archetypal energy is seeking expression through you?';
    return `${basePrompt} Notice any sensations in your ${bodyPart?.toLowerCase()} as you reflect.`;
  }
}

// Export singleton instance
export const decanicService = new DecanicService();
export default decanicService;
