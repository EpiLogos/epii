/**
 * Analysis Cache Utilities
 *
 * This module provides utilities for working with the analysis cache system.
 * It ensures a clear separation between MongoDB storage (permanent, minimal metadata)
 * and cache storage (temporary, complete analysis results).
 */

// In-memory analysis cache
const analysisCache = new Map();

/**
 * Store analysis results in the cache
 * @param {string} documentId - The document ID
 * @param {object} analysisResults - The complete analysis results
 * @returns {Promise<boolean>} - True if successful
 */
export async function storeAnalysisResultsInCache(documentId, analysisResults) {
  if (!documentId) {
    throw new Error('Document ID is required');
  }

  if (!analysisResults) {
    throw new Error('Analysis results are required');
  }

  try {
    // Ensure notionUpdatePayload is at the top level if it exists nested
    let resultsToStore = { ...analysisResults };

    // If notionUpdatePayload is nested inside fullAnalysisResults, extract it to the top level
    if (resultsToStore.fullAnalysisResults && resultsToStore.fullAnalysisResults.notionUpdatePayload) {
      resultsToStore.notionUpdatePayload = resultsToStore.fullAnalysisResults.notionUpdatePayload;
    }

    // If notionUpdatePayload is nested inside results, extract it to the top level
    if (resultsToStore.results && resultsToStore.results.notionUpdatePayload) {
      resultsToStore.notionUpdatePayload = resultsToStore.results.notionUpdatePayload;
    }

    // Log what we're storing
    console.log(`Storing analysis results in cache for document ${documentId} with structure:`,
      Object.keys(resultsToStore).join(', '));

    // Verify notionUpdatePayload is present at the top level
    if (resultsToStore.notionUpdatePayload) {
      console.log(`notionUpdatePayload is present at the top level with targetCoordinate: ${resultsToStore.notionUpdatePayload.targetCoordinate}`);
    } else {
      console.warn(`WARNING: notionUpdatePayload is NOT present at the top level in the cache for document ${documentId}`);
    }

    // Store in cache with timestamp
    analysisCache.set(documentId, {
      results: resultsToStore,
      timestamp: new Date()
    });

    console.log(`Successfully stored analysis results in cache for document ${documentId}`);
    return true;
  } catch (error) {
    console.error(`Error storing analysis results in cache for document ${documentId}:`, error);
    throw error;
  }
}

/**
 * Get analysis results from the cache
 * @param {string} documentId - The document ID
 * @returns {Promise<object|null>} - The analysis results or null if not found
 */
export async function getAnalysisResultsFromCache(documentId) {
  if (!documentId) {
    throw new Error('Document ID is required');
  }

  try {
    // Check if results are in cache
    if (analysisCache.has(documentId)) {
      const cachedData = analysisCache.get(documentId);
      console.log(`Found analysis results in cache for document ${documentId} (cached at ${cachedData.timestamp})`);

      // Ensure notionUpdatePayload is at the top level if it exists nested
      let results = { ...cachedData.results };

      // Log the structure of what we found
      console.log(`Cache structure for document ${documentId}:`, Object.keys(results).join(', '));

      // Verify notionUpdatePayload is present at the top level
      if (results.notionUpdatePayload) {
        console.log(`notionUpdatePayload is present at the top level with targetCoordinate: ${results.notionUpdatePayload.targetCoordinate}`);
      } else {
        console.warn(`WARNING: notionUpdatePayload is NOT present at the top level in the cache for document ${documentId}`);

        // Try to find it in nested structures
        if (results.fullAnalysisResults && results.fullAnalysisResults.notionUpdatePayload) {
          console.log(`Found notionUpdatePayload nested in fullAnalysisResults, extracting to top level`);
          results.notionUpdatePayload = results.fullAnalysisResults.notionUpdatePayload;
        } else if (results.results && results.results.notionUpdatePayload) {
          console.log(`Found notionUpdatePayload nested in results, extracting to top level`);
          results.notionUpdatePayload = results.results.notionUpdatePayload;
        }
      }

      return results;
    }

    console.log(`No analysis results found in cache for document ${documentId}`);
    return null;
  } catch (error) {
    console.error(`Error getting analysis results from cache for document ${documentId}:`, error);
    throw error;
  }
}

/**
 * Clear analysis results from the cache
 * @param {string} documentId - The document ID
 * @returns {Promise<boolean>} - True if successful
 */
export async function clearAnalysisResultsFromCache(documentId) {
  if (!documentId) {
    throw new Error('Document ID is required');
  }

  try {
    // Remove from cache
    if (analysisCache.has(documentId)) {
      analysisCache.delete(documentId);
      console.log(`Cleared analysis results from cache for document ${documentId}`);
    } else {
      console.log(`No analysis results found in cache for document ${documentId}, nothing to clear`);
    }

    return true;
  } catch (error) {
    console.error(`Error clearing analysis results from cache for document ${documentId}:`, error);
    throw error;
  }
}

/**
 * Check if analysis results exist in the cache
 * @param {string} documentId - The document ID
 * @returns {Promise<boolean>} - True if results exist in cache
 */
export async function hasAnalysisResultsInCache(documentId) {
  if (!documentId) {
    return false;
  }

  return analysisCache.has(documentId);
}

export default {
  storeAnalysisResultsInCache,
  getAnalysisResultsFromCache,
  clearAnalysisResultsFromCache,
  hasAnalysisResultsInCache
};
