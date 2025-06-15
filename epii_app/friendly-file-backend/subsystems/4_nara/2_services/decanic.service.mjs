/**
 * Decanic Service for Epic 2, Story E2_F1_S1
 * 
 * Provides access to decanic data from the #2-3 branch of the Bimba map
 * for Tarot card to Hermetic decan associations and archetypal information.
 * 
 * Features:
 * - Tarot card to decan mapping
 * - Archetypal descriptions and keywords
 * - Body part associations for somatic integration
 * - Planetary ruler and Egyptian deity connections
 * - Caching for performance optimization
 */

import bpMCPService from '../../../databases/bpmcp/bpMCP.service.mjs';

class DecanicService {
  constructor() {
    this.decanCache = new Map();
    this.tarotDecanMappings = new Map();
    this.cacheExpiry = 30 * 60 * 1000; // 30 minutes
    this.lastCacheUpdate = null;
  }

  /**
   * Get decanic association for a specific Tarot card
   * @param {string} cardName - Name of the Tarot card (e.g., "5 of Cups", "The Fool")
   * @returns {Promise<Object>} Decanic association data
   */
  async getDecanicAssociation(cardName) {
    try {
      // Check cache first
      if (this.tarotDecanMappings.has(cardName) && this.isCacheValid()) {
        return this.tarotDecanMappings.get(cardName);
      }

      // If cache is stale or missing, refresh decanic data
      await this.refreshDecanicData();

      return this.tarotDecanMappings.get(cardName) || null;
    } catch (error) {
      console.error('Error getting decanic association:', error);
      return null;
    }
  }

  /**
   * Get all decanic nodes from the #2-3 branch
   * @returns {Promise<Array>} Array of decan nodes with full information
   */
  async getAllDecans() {
    try {
      // Check cache first
      if (this.decanCache.size > 0 && this.isCacheValid()) {
        return Array.from(this.decanCache.values());
      }

      // Query all decan nodes from #2-3 branch
      const result = await bpMCPService.queryBimbaGraph(
        `MATCH (n:Decan) 
         RETURN n 
         ORDER BY n.zodiacSign, n.degrees`,
        {}
      );

      if (result && result.processedRecords) {
        const decans = result.processedRecords.map(record => {
          const decan = record.n;
          return {
            id: decan.properties.name,
            name: decan.properties.name,
            zodiacSign: decan.properties.zodiacSign,
            degrees: decan.properties.degrees,
            traditionalRuler: decan.properties.traditionalRuler,
            tarotCard: decan.properties.tarotCard,
            bodyPart: decan.properties.bodyPart,
            egyptianDeity: decan.properties.egyptianDeity,
            iconography: decan.properties.iconography,
            description: decan.properties.description,
            bimbaCoordinate: decan.properties.bimbaCoordinate,
            // Add archetypal interpretation
            archetypeDescription: this.generateArchetypalDescription(decan.properties),
            keywords: this.generateKeywords(decan.properties),
            reflectivePrompt: this.generateReflectivePrompt(decan.properties)
          };
        });

        // Update cache
        this.updateCache(decans);
        return decans;
      }

      return [];
    } catch (error) {
      console.error('Error fetching decanic data:', error);
      return [];
    }
  }

  /**
   * Refresh decanic data and build Tarot card mappings
   */
  async refreshDecanicData() {
    try {
      const decans = await this.getAllDecans();
      
      // Build Tarot card to decan mappings
      this.tarotDecanMappings.clear();
      
      decans.forEach(decan => {
        if (decan.tarotCard) {
          this.tarotDecanMappings.set(decan.tarotCard, {
            cardName: decan.tarotCard,
            decanAssociation: `${decan.traditionalRuler} in ${decan.zodiacSign}`,
            decanName: decan.name,
            archetypeDescription: decan.archetypeDescription,
            keywords: decan.keywords,
            bodyPart: decan.bodyPart,
            egyptianDeity: decan.egyptianDeity,
            iconography: decan.iconography,
            reflectivePrompt: decan.reflectivePrompt,
            degrees: decan.degrees,
            zodiacSign: decan.zodiacSign,
            traditionalRuler: decan.traditionalRuler,
            // Add light/shadow aspects for upright/reversed interpretations
            lightAspect: this.generateLightAspect(decan),
            shadowAspect: this.generateShadowAspect(decan)
          });
        }
      });

      this.lastCacheUpdate = Date.now();
    } catch (error) {
      console.error('Error refreshing decanic data:', error);
    }
  }

  /**
   * Generate archetypal description based on decan properties
   */
  generateArchetypalDescription(decanProps) {
    const ruler = decanProps.traditionalRuler;
    const sign = decanProps.zodiacSign;
    const bodyPart = decanProps.bodyPart;

    // Create archetypal interpretation combining planetary ruler, sign, and body association
    const archetypeMap = {
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
   * Generate keywords based on decan properties
   */
  generateKeywords(decanProps) {
    const ruler = decanProps.traditionalRuler;
    const sign = decanProps.zodiacSign;

    const keywordMap = {
      'Mars': ['action', 'courage', 'initiative', 'passion', 'drive'],
      'Sun': ['vitality', 'creativity', 'self-expression', 'leadership', 'radiance'],
      'Venus': ['harmony', 'beauty', 'love', 'values', 'pleasure'],
      'Mercury': ['communication', 'learning', 'adaptability', 'wit', 'analysis'],
      'Moon': ['intuition', 'emotion', 'receptivity', 'cycles', 'nurturing'],
      'Jupiter': ['expansion', 'wisdom', 'optimism', 'philosophy', 'growth'],
      'Saturn': ['structure', 'discipline', 'responsibility', 'mastery', 'limitation']
    };

    const signKeywords = {
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
    ].slice(0, 5); // Limit to 5 keywords
  }

  /**
   * Generate reflective prompt for psychological integration
   */
  generateReflectivePrompt(decanProps) {
    const ruler = decanProps.traditionalRuler;
    const sign = decanProps.zodiacSign;
    const bodyPart = decanProps.bodyPart;

    const prompts = {
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

  /**
   * Generate light aspect for upright card interpretation
   */
  generateLightAspect(decan) {
    return {
      theme: 'Constructive Expression',
      description: `The harmonious manifestation of ${decan.traditionalRuler} in ${decan.zodiacSign}`,
      guidance: 'Embrace this energy as a gift for growth and positive action'
    };
  }

  /**
   * Generate shadow aspect for reversed card interpretation
   */
  generateShadowAspect(decan) {
    return {
      theme: 'Shadow Integration',
      description: `The challenging or unconscious expression of ${decan.traditionalRuler} in ${decan.zodiacSign}`,
      guidance: 'Examine where this energy might be blocked, excessive, or misdirected'
    };
  }

  /**
   * Check if cache is still valid
   */
  isCacheValid() {
    if (!this.lastCacheUpdate) return false;
    return (Date.now() - this.lastCacheUpdate) < this.cacheExpiry;
  }

  /**
   * Update cache with new decan data
   */
  updateCache(decans) {
    this.decanCache.clear();
    decans.forEach(decan => {
      this.decanCache.set(decan.id, decan);
    });
    this.lastCacheUpdate = Date.now();
  }

  /**
   * Get decan by name
   * @param {string} decanName - Name of the decan (e.g., "Aries Decan 1")
   * @returns {Promise<Object>} Decan data
   */
  async getDecanByName(decanName) {
    try {
      if (this.decanCache.has(decanName) && this.isCacheValid()) {
        return this.decanCache.get(decanName);
      }

      await this.refreshDecanicData();
      return this.decanCache.get(decanName) || null;
    } catch (error) {
      console.error('Error getting decan by name:', error);
      return null;
    }
  }

  /**
   * Search decans by zodiac sign
   * @param {string} zodiacSign - Zodiac sign (e.g., "Aries", "Taurus")
   * @returns {Promise<Array>} Array of decans for the sign
   */
  async getDecansBySign(zodiacSign) {
    try {
      const allDecans = await this.getAllDecans();
      return allDecans.filter(decan => decan.zodiacSign === zodiacSign);
    } catch (error) {
      console.error('Error getting decans by sign:', error);
      return [];
    }
  }
}

// Export singleton instance
const decanicService = new DecanicService();
export default decanicService;
