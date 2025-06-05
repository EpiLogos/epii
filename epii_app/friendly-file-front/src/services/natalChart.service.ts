/**
 * Natal Chart Service - Epic 2, Story E2_F1_S3
 *
 * Service for generating and managing natal charts using user's birth data
 * from the Mahamaya Matrix. Integrates with the Astrologer API.
 */

export interface NatalChartData {
  chartType: 'natal';
  birthData: {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    latitude: number;
    longitude: number;
    timezone: string;
    city?: string;
    country?: string;
  };
  planets: Array<{
    name: string;
    sign: string;
    degrees: number;
    house: number | null;
    motion: 'direct' | 'retrograde';
  }>;
  houses: Array<{
    number: number;
    sign: string;
    degrees: number;
  }>;
  aspects: Array<{
    planet1: string;
    planet2: string;
    aspect: string;
    orb: number;
    applying: boolean;
  }>;
  ascendant: {
    sign: string;
    degrees: number;
  };
  midheaven: {
    sign: string;
    degrees: number;
  };
  generated: string;
  note?: string;
}

export interface NatalChartResponse {
  data: NatalChartData;
  message: string;
  completionStatus: {
    birthdateEncoding: boolean;
    astrologicalChart: boolean;
    jungianAssessment: boolean;
    geneKeysProfile: boolean;
    humanDesignProfile: boolean;
    archetypalQuintessence: boolean;
  };
}

export interface NatalChartError {
  error: string;
}

class NatalChartService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
  }

  /**
   * Generate natal chart for a user using their stored birth data
   */
  async generateNatalChart(userId: string): Promise<NatalChartResponse> {
    try {
      console.log('[Natal Chart Service] Generating natal chart for user:', userId);

      const response = await fetch(`${this.baseUrl}/api/bpmcp/astrology/natal-chart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId })
      });

      if (!response.ok) {
        const errorData: NatalChartError = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result: NatalChartResponse = await response.json();
      console.log('[Natal Chart Service] Natal chart generated successfully');

      return result;

    } catch (error) {
      console.error('[Natal Chart Service] Error generating natal chart:', error);
      throw error;
    }
  }

  /**
   * Get existing natal chart from user's Mahamaya Matrix
   */
  async getNatalChart(userId: string): Promise<NatalChartData | null> {
    try {
      console.log('[Natal Chart Service] Fetching existing natal chart for user:', userId);

      const response = await fetch(`${this.baseUrl}/api/mahamaya/matrix`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}` // Use accessToken not authToken
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const natalChart = result.matrix?.astrologicalChart;

      if (natalChart && natalChart.chartType === 'natal') {
        console.log('[Natal Chart Service] Existing natal chart found');
        return natalChart;
      }

      console.log('[Natal Chart Service] No natal chart found');
      return null;

    } catch (error) {
      console.error('[Natal Chart Service] Error fetching natal chart:', error);
      return null;
    }
  }

  /**
   * Check if user has completed birthdate encoding (required for natal chart)
   */
  async checkBirthdateCompletion(userId: string): Promise<boolean> {
    try {
      console.log('[Natal Chart Service] Checking birthdate completion for user:', userId);

      const response = await fetch(`${this.baseUrl}/api/mahamaya/matrix`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      if (!response.ok) {
        console.error('[Natal Chart Service] Matrix API error:', response.status, response.statusText);
        return false;
      }

      const result = await response.json();
      const isCompleted = result.matrix?.completionStatus?.birthdateEncoding || false;

      console.log('[Natal Chart Service] Birthdate completion status:', isCompleted);
      console.log('[Natal Chart Service] Full completion status:', result.matrix?.completionStatus);

      return isCompleted;

    } catch (error) {
      console.error('[Natal Chart Service] Error checking birthdate completion:', error);
      return false;
    }
  }

  /**
   * Format planet position for display
   */
  formatPlanetPosition(planet: NatalChartData['planets'][0]): string {
    if (planet.sign === 'TBD') {
      return 'Calculating...';
    }

    const degrees = Math.floor(planet.degrees);
    const minutes = Math.floor((planet.degrees - degrees) * 60);
    const retrograde = planet.motion === 'retrograde' ? ' ℞' : '';

    return `${planet.sign} ${degrees}°${minutes}'${retrograde}`;
  }

  /**
   * Format house position for display
   */
  formatHousePosition(house: NatalChartData['houses'][0]): string {
    if (house.sign === 'TBD') {
      return 'Calculating...';
    }

    const degrees = Math.floor(house.degrees);
    const minutes = Math.floor((house.degrees - degrees) * 60);

    return `${house.sign} ${degrees}°${minutes}'`;
  }

  /**
   * Get planet emoji/symbol
   */
  getPlanetSymbol(planetName: string): string {
    const symbols: Record<string, string> = {
      'Sun': '☉',
      'Moon': '☽',
      'Mercury': '☿',
      'Venus': '♀',
      'Mars': '♂',
      'Jupiter': '♃',
      'Saturn': '♄',
      'Uranus': '♅',
      'Neptune': '♆',
      'Pluto': '♇'
    };

    return symbols[planetName] || planetName;
  }

  /**
   * Get zodiac sign symbol
   */
  getSignSymbol(signName: string): string {
    const symbols: Record<string, string> = {
      'Ari': '♈',
      'Tau': '♉',
      'Gem': '♊',
      'Can': '♋',
      'Leo': '♌',
      'Vir': '♍',
      'Lib': '♎',
      'Sco': '♏',
      'Sag': '♐',
      'Cap': '♑',
      'Aqu': '♒',
      'Pis': '♓'
    };

    return symbols[signName] || signName;
  }
}

// Export singleton instance
export const natalChartService = new NatalChartService();
export default natalChartService;
