/**
 * Cache Transition Utilities
 * 
 * This module provides utilities for transitioning from the old analysis cache
 * to the document cache. It's a temporary module that should be removed once
 * the transition is complete.
 */

import { getAnalysisResultsFromCache as getAnalysisResultsFromOldCache } from './analysisCache.utils.mjs';
import { storeAnalysisResultsInCache } from './documentCache.utils.mjs';

/**
 * Migrate analysis results from the old cache to the document cache
 * @param {string} documentId - The document ID
 * @returns {Promise<boolean>} - True if successful, false if no results found
 */
export async function migrateAnalysisResults(documentId) {
  if (!documentId) {
    throw new Error('Document ID is required');
  }

  try {
    console.log(`Migrating analysis results for document ${documentId} from old cache to document cache...`);
    
    // Get results from old cache
    const oldCacheResults = await getAnalysisResultsFromOldCache(documentId);
    
    if (!oldCacheResults) {
      console.log(`No analysis results found in old cache for document ${documentId}`);
      return false;
    }
    
    // Store in document cache
    await storeAnalysisResultsInCache(documentId, oldCacheResults);
    
    console.log(`Successfully migrated analysis results for document ${documentId}`);
    return true;
  } catch (error) {
    console.error(`Error migrating analysis results for document ${documentId}:`, error);
    throw error;
  }
}

export default {
  migrateAnalysisResults
};
