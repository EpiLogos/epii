/**
 * NatalChartDisplay Component - Epic 2, Story E2_F1_S3
 *
 * Displays natal chart data in the Identity Dynamics section.
 * Automatically generates chart from user's birth data if not already created.
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  RefreshCw,
  Calendar,
  MapPin,
  Clock,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { Button } from '../../../../shared/components/ui/button';
import natalChartService, { NatalChartData } from '../../1_services/natalChart.service';

interface NatalChartDisplayProps {
  userId: string;
  className?: string;
}

// Helper function to get planet symbols
const getPlanetSymbol = (planetName: string): string => {
  const symbols: { [key: string]: string } = {
    'Sun': '☉',
    'Moon': '☽',
    'Mercury': '☿',
    'Venus': '♀',
    'Mars': '♂',
    'Jupiter': '♃',
    'Saturn': '♄',
    'Uranus': '♅',
    'Neptune': '♆',
    'Pluto': '♇',
    'Ascendant': 'ASC',
    'Medium_Coeli': 'MC',
    'Chiron': '⚷',
    'Mean_Node': '☊'
  };
  return symbols[planetName] || '●';
};

const NatalChartDisplay: React.FC<NatalChartDisplayProps> = ({
  userId,
  className = ''
}) => {
  const [natalChart, setNatalChart] = useState<NatalChartData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasBirthData, setHasBirthData] = useState(false);

  // Load existing natal chart on mount
  useEffect(() => {
    const loadNatalChart = async () => {
      if (!userId) return;

      setIsLoading(true);
      setError(null);

      try {
        // Check if user has completed birthdate encoding
        const hasBirthdate = await natalChartService.checkBirthdateCompletion(userId);
        setHasBirthData(hasBirthdate);

        if (hasBirthdate) {
          // First try to get existing natal chart from saved data
          const existingChart = await natalChartService.getNatalChart(userId);
          if (existingChart) {
            console.log('[Natal Chart Display] Loading existing natal chart from saved data');
            setNatalChart(existingChart);
          } else {
            console.log('[Natal Chart Display] No existing natal chart found - user needs to generate one');
          }
        }

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load natal chart');
      } finally {
        setIsLoading(false);
      }
    };

    loadNatalChart();
  }, [userId]);

  const handleGenerateChart = async () => {
    if (!userId || !hasBirthData) return;

    setIsGenerating(true);
    setError(null);

    try {
      console.log('[Natal Chart Display] Generating new natal chart...');
      const result = await natalChartService.generateNatalChart(userId);
      setNatalChart(result.data);

      console.log('[Natal Chart Display] Natal chart generated and saved successfully');

      // Show success message briefly, then the chart will display
      setTimeout(() => {
        setIsGenerating(false);
      }, 1000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate natal chart');
      setIsGenerating(false);
    }
  };

  const handleRefresh = async () => {
    if (!userId) return;

    setIsGenerating(true);
    setError(null);
    setNatalChart(null);

    try {
      // Clear the existing natal chart from backend
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
      const accessToken = localStorage.getItem('accessToken');

      await fetch(`${backendUrl}/api/bpmcp/astrology/natal-chart/reset`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({ userId })
      });

      console.log('[Natal Chart Display] Existing chart cleared, generating new one...');

      // Generate new chart
      await handleGenerateChart();

    } catch (error) {
      console.error('[Natal Chart Display] Error refreshing chart:', error);
      setError('Failed to refresh natal chart');
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading) {
    return (
      <div className={`bg-epii-darker/30 border border-epii-neon/20 rounded-lg p-6 ${className}`}>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 text-epii-neon animate-spin mr-2" />
          <span className="text-gray-300">Loading natal chart...</span>
        </div>
      </div>
    );
  }

  if (!hasBirthData) {
    return (
      <div className={`bg-epii-darker/30 border border-epii-neon/20 rounded-lg p-6 ${className}`}>
        <div className="text-center py-8">
          <Calendar className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-300 mb-2">Natal Chart Unavailable</h3>
          <p className="text-gray-400 mb-4">
            Complete your birthdate encoding first to generate your natal chart.
          </p>
          <Button
            onClick={() => {
              // Simple page refresh to go back to birthdate encoding
              window.location.reload();
            }}
            variant="outline"
            className="border-epii-neon/30 text-epii-neon hover:bg-epii-neon/10"
          >
            Go to Birthdate Encoding
          </Button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-red-900/20 border border-red-500/30 rounded-lg p-6 ${className}`}>
        <div className="flex items-center gap-2 text-red-400 mb-4">
          <AlertCircle size={20} />
          <span className="font-medium">Error Loading Natal Chart</span>
        </div>
        <p className="text-red-300 mb-4">{error}</p>
        <Button
          onClick={handleRefresh}
          variant="outline"
          size="sm"
          className="border-red-500/30 text-red-400 hover:bg-red-500/10"
        >
          <RefreshCw size={14} className="mr-1" />
          Retry
        </Button>
      </div>
    );
  }

  if (!natalChart) {
    return (
      <div className={`bg-epii-darker/30 border border-epii-neon/20 rounded-lg p-6 ${className}`}>
        <div className="text-center py-8">
          <Star className="w-12 h-12 text-epii-neon mx-auto mb-4" />
          <h3 className="text-lg font-medium text-epii-neon mb-2">Generate Your Natal Chart</h3>
          <p className="text-gray-300 mb-6">
            Create your personalized astrological natal chart using your birth data.
          </p>
          <Button
            onClick={handleGenerateChart}
            disabled={isGenerating}
            className="bg-epii-neon text-epii-darker hover:bg-epii-neon/90"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating Chart...
              </>
            ) : (
              <>
                <Star className="w-4 h-4 mr-2" />
                Generate Natal Chart
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }

  // Debug: Log the natal chart data structure
  console.log('[Natal Chart Display] Chart data structure:', natalChart);

  return (
    <div className={`bg-epii-darker/30 border border-epii-neon/20 rounded-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-epii-neon/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-epii-neon" />
            <h3 className="text-lg font-medium text-epii-neon">Natal Chart</h3>
            <CheckCircle className="w-4 h-4 text-green-400" />
          </div>

          <Button
            onClick={handleRefresh}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-epii-neon"
            disabled={isGenerating}
          >
            <RefreshCw size={14} className={isGenerating ? 'animate-spin' : ''} />
          </Button>
        </div>
      </div>

      {/* Birth Data Summary */}
      <div className="p-4 bg-epii-darker/20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-gray-300">
              {natalChart.birthData.month}/{natalChart.birthData.day}/{natalChart.birthData.year}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-gray-300">
              {String(natalChart.birthData.hour).padStart(2, '0')}:
              {String(natalChart.birthData.minute).padStart(2, '0')}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="text-gray-300">
              {natalChart.birthData.city || 'Location'}, {natalChart.birthData.country || 'Country'}
            </span>
          </div>
        </div>
      </div>

      {/* Chart Data */}
      <div className="p-4">
        {natalChart.note && (
          <div className="mb-4 p-3 bg-yellow-900/20 border border-yellow-500/30 rounded text-yellow-300 text-sm">
            <AlertCircle className="w-4 h-4 inline mr-2" />
            {natalChart.note}
          </div>
        )}

        {/* Chart Data */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Natal Chart Data</h4>

          {/* Birth Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            <div className="p-3 bg-epii-darker/40 rounded">
              <div className="text-xs text-gray-400 mb-1">Birth Date</div>
              <div className="text-gray-300">
                {natalChart.birthData ?
                  `${natalChart.birthData.day}/${natalChart.birthData.month}/${natalChart.birthData.year}`
                  : 'Unknown'}
              </div>
            </div>
            <div className="p-3 bg-epii-darker/40 rounded">
              <div className="text-xs text-gray-400 mb-1">Birth Time</div>
              <div className="text-gray-300">
                {natalChart.birthData ?
                  `${String(natalChart.birthData.hour).padStart(2, '0')}:${String(natalChart.birthData.minute).padStart(2, '0')}`
                  : 'Unknown'}
              </div>
            </div>
            <div className="p-3 bg-epii-darker/40 rounded">
              <div className="text-xs text-gray-400 mb-1">Location</div>
              <div className="text-gray-300">
                {natalChart.birthData ?
                  `${natalChart.birthData.city}, ${natalChart.birthData.country}`
                  : 'Unknown'}
              </div>
            </div>
          </div>

          {/* Astrologer API Chart */}
          {natalChart.astrologerData && (
            <div className="space-y-4">
              {/* SVG Chart Display */}
              {natalChart.astrologerData.chart && (
                <div className="p-4 bg-epii-darker/30 rounded-lg border border-epii-neon/20">
                  <h5 className="text-sm font-semibold text-epii-neon mb-4">Your Natal Chart</h5>

                  {/* SVG Chart Container */}
                  <div className="flex justify-center bg-white rounded-lg p-6 shadow-inner">
                    <div
                      className="w-full max-w-2xl aspect-square flex items-center justify-center"
                      style={{
                        minHeight: '500px',
                        maxHeight: '700px',
                        overflow: 'visible'
                      }}
                    >
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{
                          transform: 'scale(1.15)',
                          transformOrigin: 'center center'
                        }}
                        dangerouslySetInnerHTML={{
                          __html: natalChart.astrologerData.chart?.replace(
                            '<svg',
                            '<svg style="width: 100%; height: 100%; max-width: 100%; max-height: 100%;"'
                          )
                        }}
                      />
                    </div>
                  </div>

                  <div className="mt-3 text-xs text-gray-500 text-center">
                    Generated using Astrologer API v4
                  </div>
                </div>
              )}

              {/* Planetary Positions in Zodiac Signs */}
              {natalChart.astrologerData.data && (
                <div className="p-4 bg-epii-darker/30 rounded-lg border border-epii-neon/20">
                  <h5 className="text-sm font-semibold text-epii-neon mb-3">Planetary Positions</h5>



                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Extract main planets from the chart data */}
                    {['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Ascendant'].map((planetName) => {
                      // Try different possible data structures from the API
                      let planetData = null;

                      // Check if data has planets array
                      if (natalChart.astrologerData.data.planets) {
                        planetData = natalChart.astrologerData.data.planets.find(p => p.name === planetName);
                      }

                      // Check if data has houses array (for Ascendant)
                      if (!planetData && natalChart.astrologerData.data.houses) {
                        planetData = natalChart.astrologerData.data.houses.find(h => h.name === planetName);
                      }

                      // Check if data has direct planet properties
                      if (!planetData && natalChart.astrologerData.data[planetName.toLowerCase()]) {
                        planetData = natalChart.astrologerData.data[planetName.toLowerCase()];
                      }

                      // Check if data has planet objects with different structure
                      if (!planetData) {
                        // Look through all properties for planet data
                        Object.keys(natalChart.astrologerData.data).forEach(key => {
                          const value = natalChart.astrologerData.data[key];
                          if (typeof value === 'object' && value !== null) {
                            if (value.name === planetName || key.toLowerCase().includes(planetName.toLowerCase())) {
                              planetData = value;
                            }
                          }
                        });
                      }

                      // Get full zodiac sign name
                      const getFullZodiacName = (shortName: string): string => {
                        const zodiacMap: { [key: string]: string } = {
                          'Ari': 'Aries',
                          'Tau': 'Taurus',
                          'Gem': 'Gemini',
                          'Can': 'Cancer',
                          'Leo': 'Leo',
                          'Vir': 'Virgo',
                          'Lib': 'Libra',
                          'Sco': 'Scorpio',
                          'Sag': 'Sagittarius',
                          'Cap': 'Capricorn',
                          'Aqu': 'Aquarius',
                          'Pis': 'Pisces'
                        };
                        return zodiacMap[shortName] || shortName;
                      };

                      const zodiacSign = planetData?.sign || planetData?.zodiac_sign || planetData?.element || 'Calculating...';
                      const degree = planetData?.position ? `${Math.floor(planetData.position)}°` :
                                    planetData?.degree ? `${Math.floor(planetData.degree)}°` :
                                    planetData?.longitude ? `${Math.floor(planetData.longitude)}°` : '';

                      return (
                        <div key={planetName} className="p-3 bg-epii-darker/40 rounded">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-epii-neon font-mono text-lg">
                                {getPlanetSymbol(planetName)}
                              </span>
                              <span className="text-gray-300 text-sm font-medium">{planetName}</span>
                            </div>
                            <div className="flex items-center gap-2 text-right">
                              <div className="text-gray-300 text-sm font-medium">
                                {getFullZodiacName(zodiacSign)}
                              </div>
                              {degree && (
                                <div className="text-gray-400 text-xs bg-epii-darker/60 px-2 py-1 rounded">
                                  {degree}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Nara Agent Integration - Future Enhancement */}
              <div className="p-4 bg-gradient-to-r from-purple-900/20 to-epii-neon/10 rounded-lg border border-purple-500/30">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                  <h5 className="text-sm font-semibold text-purple-300">Nara Agent Analysis</h5>
                  <span className="text-xs text-purple-400 bg-purple-900/30 px-2 py-1 rounded">Coming Soon</span>
                </div>

                <p className="text-gray-300 text-sm mb-3">
                  The Nara Agent will provide personalized insights about your natal chart, including:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2 text-gray-400">
                    <span className="w-1 h-1 bg-purple-400 rounded-full"></span>
                    Personality insights from planetary positions
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <span className="w-1 h-1 bg-purple-400 rounded-full"></span>
                    Life themes and archetypal patterns
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <span className="w-1 h-1 bg-purple-400 rounded-full"></span>
                    Strengths and growth opportunities
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <span className="w-1 h-1 bg-purple-400 rounded-full"></span>
                    Integration with your Mahamaya Matrix
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-purple-500/20">
                  <div className="text-xs text-purple-400">
                    This feature will be available in future Nara Mode updates, providing AI-powered astrological insights
                    tailored to your unique chart configuration.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Chart Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 bg-epii-darker/40 rounded">
            <div className="text-xs text-gray-400 mb-1">Chart Type</div>
            <div className="text-gray-300 capitalize">
              {natalChart.chartType || 'Natal Chart'}
            </div>
          </div>

          <div className="p-3 bg-epii-darker/40 rounded">
            <div className="text-xs text-gray-400 mb-1">Data Source</div>
            <div className="text-gray-300">
              {natalChart.astrologerData ? 'Astrologer API v4' : 'Placeholder Data'}
            </div>
          </div>
        </div>

        {/* Generated Date */}
        <div className="mt-4 pt-4 border-t border-epii-neon/10">
          <div className="text-xs text-gray-500">
            Generated: {new Date(natalChart.generated).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NatalChartDisplay;
