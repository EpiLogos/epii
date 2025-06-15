/**
 * Routes for calling BPMCP tools
 * Bimba Coordinate: #5-3-4.5-1
 */

import express from 'express';
import bpmcpService from '../../bpmcp/bpMCP.service.mjs';

const router = express.Router();

/**
 * @route POST /api/bpmcp/call-tool
 * @desc Call a BPMCP tool
 * @access Public
 */
router.post('/call-tool', async (req, res) => {
  try {
    const { toolName, args } = req.body;

    if (!toolName) {
      return res.status(400).json({ error: 'Tool name is required' });
    }

    console.log(`Calling BPMCP tool '${toolName}' with args:`, args);

    // Add special handling for listDocuments tool to support pagination and timeouts
    if (toolName === 'listDocuments') {
      // Set a shorter timeout for this specific tool to avoid long-running requests
      const timeoutMs = 30000; // 30 seconds

      // Create a promise that rejects after the timeout
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timed out')), timeoutMs);
      });

      // Create the actual request promise
      const requestPromise = bpmcpService.callTool(toolName, args);

      try {
        // Race the two promises
        const result = await Promise.race([requestPromise, timeoutPromise]);

        // If we got here, the request completed before the timeout
        return res.status(200).json(result);
      } catch (error) {
        if (error.message === 'Request timed out') {
          console.error(`Timeout exceeded for listDocuments tool`);
          // Return an empty array instead of an error for timeouts
          return res.status(200).json([]);
        }
        throw error;
      }
    } else {
      // For all other tools, use the normal flow
      const result = await bpmcpService.callTool(toolName, args);

      // Parse BPMCP tool result format and return the actual data
      let processedResult = result;

      // Check if result has the BPMCP tool format: { content: [{ type: "text", text: "..." }] }
      if (result && result.content && Array.isArray(result.content) && result.content[0] && result.content[0].text) {
        try {
          // Parse the JSON from the BPMCP tool format
          processedResult = JSON.parse(result.content[0].text);
          console.log(`Successfully parsed BPMCP tool result format for ${toolName}`);
        } catch (parseError) {
          console.error(`Error parsing BPMCP tool result for ${toolName}:`, parseError);
          // Return the original result if parsing fails
          processedResult = result;
        }
      }

      return res.status(200).json(processedResult);
    }
  } catch (error) {
    console.error(`Error calling BPMCP tool:`, error);
    return res.status(500).json({ error: error.message });
  }
});

/**
 * @route GET /api/bpmcp/list-tools
 * @desc List available BPMCP tools
 * @access Public
 */
router.get('/list-tools', async (req, res) => {
  try {
    const result = await bpmcpService.callTool('listTools', {});
    return res.status(200).json(result);
  } catch (error) {
    console.error(`Error listing BPMCP tools:`, error);
    return res.status(500).json({ error: error.message });
  }
});

/**
 * @route POST /api/bpmcp/resolveBimbaCoordinate
 * @desc Resolve a Bimba coordinate to its associated Notion page URL
 * @access Public
 */
router.post('/resolveBimbaCoordinate', async (req, res) => {
  try {
    const { targetCoordinate } = req.body;

    if (!targetCoordinate) {
      return res.status(400).json({ error: 'targetCoordinate is required' });
    }

    console.log(`Resolving Bimba coordinate: ${targetCoordinate}`);

    const result = await bpmcpService.callTool('resolveBimbaCoordinate', { targetCoordinate });
    return res.status(200).json(result);
  } catch (error) {
    console.error(`Error resolving Bimba coordinate:`, error);
    return res.status(500).json({ error: error.message });
  }
});

/**
 * @route POST /api/bpmcp/astrology/current
 * @desc Get current astrological data using Astrologer API (Epic 2, Story E2_F1_S2)
 * @access Public
 */
router.post('/astrology/current', async (req, res) => {
  try {
    const { toolName, args } = req.body;
    const location = args?.location || { latitude: 40.7128, longitude: -74.0060, timezone: 'America/New_York' };

    console.log('[BPMCP Astrology] Fetching real-time astrological data...');

    // Get current date/time
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const hour = now.getHours();
    const minute = now.getMinutes();

    // For current time, use the /now endpoint
    let apiUrl = 'https://astrologer.p.rapidapi.com/api/v4/now';
    let requestOptions = {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-RapidAPI-Key': '0d370422cfmshdd3c0bb460e5fe8p166442jsnfd7726d54eb8',
        'X-RapidAPI-Host': 'astrologer.p.rapidapi.com'
      }
    };

    // If specific time/location provided, use different endpoint (if available)
    // For now, we'll use the current time endpoint and note this limitation
    const astroResponse = await fetch(apiUrl, requestOptions);

    if (!astroResponse.ok) {
      throw new Error(`Astrologer API error: ${astroResponse.statusText}`);
    }

    const astroData = await astroResponse.json();

    if (!astroData.data) {
      throw new Error('No astrological data received from API');
    }

    const data = astroData.data;

    // Extract planets from the API response
    const planetNames = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];
    const planets = planetNames.map(planetName => {
      const planetData = data[planetName];
      if (planetData) {
        return {
          name: planetData.name,
          sign: planetData.sign,
          degrees: planetData.position,
          motion: planetData.retrograde ? 'retrograde' : 'direct',
          house: planetData.house || null
        };
      }
      return null;
    }).filter(Boolean);

    // Extract houses
    const houseNames = ['first_house', 'second_house', 'third_house', 'fourth_house', 'fifth_house', 'sixth_house',
                       'seventh_house', 'eighth_house', 'ninth_house', 'tenth_house', 'eleventh_house', 'twelfth_house'];
    const houses = houseNames.map(houseName => data[houseName]?.position || 0);

    // Extract moon phase
    const moonPhase = {
      phase: data.lunar_phase?.moon_phase_name || 'Unknown',
      illumination: Math.round((data.lunar_phase?.degrees_between_s_m || 0) / 360 * 100),
      nextPhase: 'Next Phase',
      nextPhaseDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };

    // Calculate planetary hour (simplified)
    const planetaryHour = calculatePlanetaryHour(now, location.latitude);

    // For now, we'll create a simplified aspects array (the API might have aspects in a different format)
    const aspects = [];

    const astrologicalData = {
      timestamp: now.toISOString(),
      location: {
        latitude: data.lat || location.latitude,
        longitude: data.lng || location.longitude,
        timezone: data.tz_str || location.timezone
      },
      planets,
      aspects,
      moonPhase,
      planetaryHour,
      houses,
      ascendant: data.ascendant?.position || 0,
      midheaven: data.medium_coeli?.position || 0
    };

    console.log('[BPMCP Astrology] Real-time astrological data fetched successfully');
    return res.status(200).json({ data: astrologicalData });

  } catch (error) {
    console.error(`Error getting astrological data:`, error);

    // Fallback to basic data if API fails
    const fallbackData = {
      timestamp: new Date().toISOString(),
      location: location || { latitude: 40.7128, longitude: -74.0060, timezone: 'America/New_York' },
      planets: [
        { name: 'Sun', sign: 'Unknown', degrees: 0, motion: 'direct' },
        { name: 'Moon', sign: 'Unknown', degrees: 0, motion: 'direct' }
      ],
      aspects: [],
      moonPhase: { phase: 'Unknown', illumination: 0, nextPhase: 'Unknown', nextPhaseDate: new Date().toISOString() },
      planetaryHour: { currentRuler: 'Unknown', startTime: new Date().toISOString(), endTime: new Date().toISOString(), nextRuler: 'Unknown', nextStartTime: new Date().toISOString() },
      houses: [],
      ascendant: 0,
      midheaven: 0,
      error: 'API temporarily unavailable'
    };

    return res.status(200).json({ data: fallbackData });
  }
});

// Helper function to calculate moon phase
function calculateMoonPhase(date) {
  // Simplified moon phase calculation
  const lunarMonth = 29.53058867; // Average lunar month in days
  const knownNewMoon = new Date('2000-01-06T18:14:00Z'); // Known new moon
  const daysSinceKnownNewMoon = (date - knownNewMoon) / (1000 * 60 * 60 * 24);
  const lunarAge = daysSinceKnownNewMoon % lunarMonth;
  const illumination = Math.abs(Math.cos((lunarAge / lunarMonth) * 2 * Math.PI)) * 100;

  let phase;
  if (lunarAge < 1.84566) phase = 'New Moon';
  else if (lunarAge < 5.53699) phase = 'Waxing Crescent';
  else if (lunarAge < 9.22831) phase = 'First Quarter';
  else if (lunarAge < 12.91963) phase = 'Waxing Gibbous';
  else if (lunarAge < 16.61096) phase = 'Full Moon';
  else if (lunarAge < 20.30228) phase = 'Waning Gibbous';
  else if (lunarAge < 23.99361) phase = 'Last Quarter';
  else phase = 'Waning Crescent';

  const nextPhaseDate = new Date(date.getTime() + (lunarMonth - lunarAge) * 24 * 60 * 60 * 1000);

  return {
    phase,
    illumination: Math.round(illumination),
    nextPhase: 'Next Phase',
    nextPhaseDate: nextPhaseDate.toISOString()
  };
}

// Helper function to calculate planetary hour
function calculatePlanetaryHour(date, latitude) {
  const planets = ['Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon'];
  const dayOfWeek = date.getDay(); // 0 = Sunday
  const hour = date.getHours();

  // Simplified planetary hour calculation
  const planetIndex = (dayOfWeek * 24 + hour) % 7;
  const currentRuler = planets[planetIndex];
  const nextRuler = planets[(planetIndex + 1) % 7];

  const currentHourStart = new Date(date);
  currentHourStart.setMinutes(0, 0, 0);

  const currentHourEnd = new Date(currentHourStart);
  currentHourEnd.setHours(currentHourEnd.getHours() + 1);

  return {
    currentRuler,
    startTime: currentHourStart.toISOString(),
    endTime: currentHourEnd.toISOString(),
    nextRuler,
    nextStartTime: currentHourEnd.toISOString()
  };
}

/**
 * @route POST /api/bpmcp/astrology/natal-chart
 * @desc Generate natal chart using user's birth data from Mahamaya Matrix (Epic 2, Story E2_F1_S3)
 * @access Public
 */
router.post('/astrology/natal-chart', async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    console.log('[BPMCP Astrology] Generating natal chart for user:', userId);

    // Import User model and mahamaya service (which has encryption functions)
    const { default: User } = await import('../models/User.model.mjs');
    const mahamayaService = await import('../subsystems/4_nara/2_services/mahamaya-matrix.service.mjs');

    // Get user's birth data from Mahamaya Matrix
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const birthdateEncoding = user.mahamayaMatrix?.birthdateEncoding;
    if (!birthdateEncoding) {
      return res.status(400).json({ error: 'Birth data not found. Please complete birthdate encoding first.' });
    }

    // Check if natal chart already exists
    if (user.mahamayaMatrix?.astrologicalChart && user.mahamayaMatrix?.completionStatus?.astrologicalChart) {
      console.log('[BPMCP Astrology] Natal chart already exists, returning saved data');
      console.log('[BPMCP Astrology] Existing chart type:', user.mahamayaMatrix.astrologicalChart.chartType);
      return res.status(200).json({
        data: user.mahamayaMatrix.astrologicalChart,
        message: 'Natal chart loaded from saved data',
        completionStatus: user.mahamayaMatrix.completionStatus,
        fromCache: true
      });
    }

    console.log('[BPMCP Astrology] No existing natal chart found, generating new one...');
    console.log('[BPMCP Astrology] Current completion status:', user.mahamayaMatrix?.completionStatus);

    // Get decrypted birth data using mahamaya service
    const birthdateData = await mahamayaService.default.getBirthdateEncoding(userId);
    if (!birthdateData) {
      return res.status(400).json({ error: 'Failed to decrypt birth data' });
    }

    const birthDate = birthdateData.birthDate;
    const birthTime = birthdateData.birthTime;
    const birthLocation = birthdateData.birthLocation;

    console.log('[BPMCP Astrology] Raw birth data:', { birthDate, birthTime, birthLocation });

    // Handle missing birth time
    const timeToUse = birthTime || '12:00';

    // Parse birth date and time
    const birthDateTime = new Date(`${birthDate}T${timeToUse}`);
    const year = birthDateTime.getFullYear();
    const month = birthDateTime.getMonth() + 1;
    const day = birthDateTime.getDate();
    const hour = birthDateTime.getHours();
    const minute = birthDateTime.getMinutes();

    console.log('[BPMCP Astrology] Parsed birth data:', { year, month, day, hour, minute, location: birthLocation });

    // Map country names to ISO codes for Astrologer API
    const countryToISOCode = {
      'United Kingdom': 'GB',
      'England': 'GB',
      'Scotland': 'GB',
      'Wales': 'GB',
      'United States': 'US',
      'USA': 'US',
      'America': 'US',
      'France': 'FR',
      'Germany': 'DE',
      'Italy': 'IT',
      'Spain': 'ES',
      'Canada': 'CA',
      'Australia': 'AU',
      'Japan': 'JP',
      'China': 'CN',
      'India': 'IN',
      'Brazil': 'BR',
      'Russia': 'RU',
      'Unknown': 'GB' // Default to GB
    };

    const nationCode = countryToISOCode[birthLocation?.country] || 'GB';

    // Prepare data for Astrologer API v4
    const astrologerPayload = {
      subject: {
        year,
        month,
        day,
        hour,
        minute,
        longitude: birthLocation?.longitude || 0,
        latitude: birthLocation?.latitude || 51.4825766, // Default to London
        city: birthLocation?.city || 'Unknown',
        nation: nationCode,
        timezone: birthLocation?.timezone || 'UTC',
        name: user.name || 'User',
        zodiac_type: 'Tropic'
      }
    };

    console.log('[BPMCP Astrology] Calling Astrologer API with payload:', astrologerPayload);

    // Call the real Astrologer API
    const astrologerResponse = await fetch('https://astrologer.p.rapidapi.com/api/v4/birth-chart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Host': 'astrologer.p.rapidapi.com',
        'X-RapidAPI-Key': '0d370422cfmshdd3c0bb460e5fe8p166442jsnfd7726d54eb8'
      },
      body: JSON.stringify(astrologerPayload)
    });

    if (!astrologerResponse.ok) {
      console.error('[BPMCP Astrology] Astrologer API error:', astrologerResponse.status, astrologerResponse.statusText);
      throw new Error(`Astrologer API error: ${astrologerResponse.status}`);
    }

    const astrologerData = await astrologerResponse.json();
    console.log('[BPMCP Astrology] Astrologer API response received');

    // Structure the natal chart data
    const natalChart = {
      chartType: 'natal',
      birthData: {
        year,
        month,
        day,
        hour,
        minute,
        latitude: astrologerPayload.subject.latitude,
        longitude: astrologerPayload.subject.longitude,
        timezone: astrologerPayload.subject.timezone,
        city: astrologerPayload.subject.city,
        country: astrologerPayload.subject.nation
      },
      astrologerData: astrologerData, // Store the full API response
      generated: new Date().toISOString(),
      note: 'Natal chart generated using Astrologer API v4'
    };

    // Store natal chart in user's Mahamaya Matrix
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

    // Save the natal chart data
    user.mahamayaMatrix.astrologicalChart = natalChart;
    user.mahamayaMatrix.completionStatus.astrologicalChart = true;
    user.mahamayaMatrix.metadata.lastSyncedAt = new Date();

    // Mark as modified for Mixed type and save
    user.markModified('mahamayaMatrix.astrologicalChart');
    user.markModified('mahamayaMatrix.completionStatus');
    user.markModified('mahamayaMatrix.metadata');
    await user.save();

    console.log('[BPMCP Astrology] Natal chart stored in Mahamaya Matrix successfully');
    console.log('[BPMCP Astrology] Completion status updated:', user.mahamayaMatrix.completionStatus);

    return res.status(200).json({
      data: natalChart,
      message: 'Natal chart generated and stored successfully',
      completionStatus: user.mahamayaMatrix.completionStatus,
      saved: true
    });

  } catch (error) {
    console.error(`Error generating natal chart:`, error);
    return res.status(500).json({ error: error.message });
  }
});

/**
 * @route DELETE /api/bpmcp/astrology/natal-chart/reset
 * @desc Reset/clear existing natal chart for user
 * @access Public
 */
router.delete('/astrology/natal-chart/reset', async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    console.log('[BPMCP Astrology] Resetting natal chart for user:', userId);

    // Import User model
    const { default: User } = await import('../models/User.model.mjs');

    // Get user
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Clear natal chart data and completion status
    if (user.mahamayaMatrix) {
      user.mahamayaMatrix.astrologicalChart = null;
      user.mahamayaMatrix.completionStatus.astrologicalChart = false;
      user.mahamayaMatrix.metadata.lastSyncedAt = new Date();

      // Mark as modified and save
      user.markModified('mahamayaMatrix.astrologicalChart');
      user.markModified('mahamayaMatrix.completionStatus');
      user.markModified('mahamayaMatrix.metadata');
      await user.save();
    }

    console.log('[BPMCP Astrology] Natal chart reset successfully');
    return res.status(200).json({
      success: true,
      message: 'Natal chart reset successfully'
    });

  } catch (error) {
    console.error(`Error resetting natal chart:`, error);
    return res.status(500).json({ error: error.message });
  }
});

export default router;
