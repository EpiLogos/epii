/**
 * Decanic Routes for Epic 2, Story E2_F1_S1
 * 
 * API endpoints for accessing decanic data and Tarot card associations
 * from the #2-3 branch of the Bimba map.
 */

import express from 'express';
import decanicService from '../../2_services/decanic.service.mjs';

const router = express.Router();

/**
 * GET /api/nara/decanic/card/:cardName
 * Get decanic association for a specific Tarot card
 */
router.get('/card/:cardName', async (req, res) => {
  try {
    const { cardName } = req.params;
    const { reversed } = req.query; // Check if card is reversed
    
    console.log(`[Decanic API] Getting association for card: ${cardName}, reversed: ${reversed}`);
    
    const decanicData = await decanicService.getDecanicAssociation(cardName);
    
    if (!decanicData) {
      return res.status(404).json({
        success: false,
        message: `No decanic association found for card: ${cardName}`,
        data: null
      });
    }

    // Add appropriate aspect based on card orientation
    const responseData = {
      ...decanicData,
      activeAspect: reversed === 'true' ? decanicData.shadowAspect : decanicData.lightAspect,
      cardOrientation: reversed === 'true' ? 'reversed' : 'upright'
    };

    res.json({
      success: true,
      message: `Decanic association retrieved for ${cardName}`,
      data: responseData
    });
  } catch (error) {
    console.error('[Decanic API] Error getting card association:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while retrieving decanic association',
      error: error.message
    });
  }
});

/**
 * GET /api/nara/decanic/all
 * Get all decanic data
 */
router.get('/all', async (req, res) => {
  try {
    console.log('[Decanic API] Getting all decanic data');
    
    const decans = await decanicService.getAllDecans();
    
    res.json({
      success: true,
      message: `Retrieved ${decans.length} decans`,
      data: decans
    });
  } catch (error) {
    console.error('[Decanic API] Error getting all decans:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while retrieving decanic data',
      error: error.message
    });
  }
});

/**
 * GET /api/nara/decanic/decan/:decanName
 * Get specific decan by name
 */
router.get('/decan/:decanName', async (req, res) => {
  try {
    const { decanName } = req.params;
    
    console.log(`[Decanic API] Getting decan: ${decanName}`);
    
    const decan = await decanicService.getDecanByName(decanName);
    
    if (!decan) {
      return res.status(404).json({
        success: false,
        message: `Decan not found: ${decanName}`,
        data: null
      });
    }

    res.json({
      success: true,
      message: `Decan retrieved: ${decanName}`,
      data: decan
    });
  } catch (error) {
    console.error('[Decanic API] Error getting decan:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while retrieving decan',
      error: error.message
    });
  }
});

/**
 * GET /api/nara/decanic/sign/:zodiacSign
 * Get all decans for a specific zodiac sign
 */
router.get('/sign/:zodiacSign', async (req, res) => {
  try {
    const { zodiacSign } = req.params;
    
    console.log(`[Decanic API] Getting decans for sign: ${zodiacSign}`);
    
    const decans = await decanicService.getDecansBySign(zodiacSign);
    
    res.json({
      success: true,
      message: `Retrieved ${decans.length} decans for ${zodiacSign}`,
      data: decans
    });
  } catch (error) {
    console.error('[Decanic API] Error getting decans by sign:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while retrieving decans by sign',
      error: error.message
    });
  }
});

/**
 * POST /api/nara/decanic/refresh
 * Refresh decanic data cache
 */
router.post('/refresh', async (req, res) => {
  try {
    console.log('[Decanic API] Refreshing decanic data cache');
    
    await decanicService.refreshDecanicData();
    
    res.json({
      success: true,
      message: 'Decanic data cache refreshed successfully'
    });
  } catch (error) {
    console.error('[Decanic API] Error refreshing cache:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while refreshing cache',
      error: error.message
    });
  }
});

/**
 * GET /api/nara/decanic/mappings
 * Get all Tarot card to decan mappings
 */
router.get('/mappings', async (req, res) => {
  try {
    console.log('[Decanic API] Getting all Tarot card mappings');
    
    // Ensure data is loaded
    await decanicService.refreshDecanicData();
    
    // Get all mappings from the service
    const mappings = {};
    for (const [cardName, decanData] of decanicService.tarotDecanMappings) {
      mappings[cardName] = decanData;
    }
    
    res.json({
      success: true,
      message: `Retrieved ${Object.keys(mappings).length} Tarot card mappings`,
      data: mappings
    });
  } catch (error) {
    console.error('[Decanic API] Error getting mappings:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while retrieving mappings',
      error: error.message
    });
  }
});

export default router;
