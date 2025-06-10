/**
 * Document Cache Utilities
 *
 * This module provides utilities for working with the document cache system.
 * It ensures that document updates are properly synchronized between the cache
 * and MongoDB, preventing redundant MongoDB calls.
 *
 * This module now also handles analysis results storage, replacing the separate
 * analysis cache to simplify the architecture.
 */

import bpMCPService from '../services/bpMCPService.mjs';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cache directory for persistent storage
const CACHE_DIR = path.join(__dirname, '../cache');

// In-memory document cache
const documentCache = new Map();

// In-memory analysis results cache (stored separately from documents for cleaner separation)
const analysisResultsCache = new Map();

// Ensure cache directory exists
async function ensureCacheDir() {
  try {
    await fs.mkdir(CACHE_DIR, { recursive: true });
  } catch (error) {
    console.warn('Failed to create cache directory:', error.message);
  }
}

/**
 * Get a document from the cache or fetch it from MongoDB
 * @param {string} documentId - The document ID
 * @param {string} collection - The MongoDB collection (default: 'Documents')
 * @returns {Promise<object>} - The document
 */
export async function getDocumentFromCache(documentId, collection = 'Documents') {
  if (!documentId) {
    throw new Error('Document ID is required');
  }

  // Check if document is in cache
  const cacheKey = `${collection}:${documentId}`;
  if (documentCache.has(cacheKey)) {
    console.log(`Document ${documentId} found in cache`);
    return documentCache.get(cacheKey);
  }

  // Fetch document from MongoDB
  console.log(`Document ${documentId} not in cache, fetching from MongoDB`);
  try {
    const result = await bpMCPService.getDocumentById(documentId, collection);

    // Extract document from result
    let document;
    if (Array.isArray(result) && result.length > 0) {
      document = result[0];
    } else if (result && typeof result === 'object') {
      document = result;
    } else {
      throw new Error(`Invalid document result for ${documentId}`);
    }

    // Store in cache
    documentCache.set(cacheKey, document);
    console.log(`Document ${documentId} stored in cache`);

    return document;
  } catch (error) {
    console.error(`Error fetching document ${documentId} from MongoDB:`, error);
    throw error;
  }
}

/**
 * Update a document in the cache and MongoDB
 * @param {string} documentId - The document ID
 * @param {object} updates - The updates to apply (flat object with dot notation)
 * @param {string} collection - The MongoDB collection (default: 'Documents')
 * @returns {Promise<object>} - The updated document
 */
export async function updateDocumentInCache(documentId, updates, collection = 'Documents') {
  if (!documentId) {
    throw new Error('Document ID is required');
  }

  if (!updates || typeof updates !== 'object') {
    throw new Error('Updates must be an object');
  }

  const cacheKey = `${collection}:${documentId}`;

  try {
    // Convert flat updates to MongoDB $set format
    const mongoUpdates = { $set: {} };
    for (const [key, value] of Object.entries(updates)) {
      mongoUpdates.$set[key] = value;
    }

    // Update document in MongoDB
    console.log(`Updating document ${documentId} in MongoDB with:`, mongoUpdates);
    await bpMCPService.updateDocument(documentId, mongoUpdates, collection);

    // Update document in cache if it exists
    if (documentCache.has(cacheKey)) {
      const cachedDocument = documentCache.get(cacheKey);

      // Apply updates to cached document
      for (const [key, value] of Object.entries(updates)) {
        // Handle dot notation (e.g., 'metadata.status')
        if (key.includes('.')) {
          const parts = key.split('.');
          let current = cachedDocument;

          // Navigate to the nested object
          for (let i = 0; i < parts.length - 1; i++) {
            const part = parts[i];
            if (!current[part]) {
              current[part] = {};
            }
            current = current[part];
          }

          // Set the value
          current[parts[parts.length - 1]] = value;
        } else {
          // Simple property
          cachedDocument[key] = value;
        }
      }

      console.log(`Updated document ${documentId} in cache`);
    } else {
      console.log(`Document ${documentId} not in cache, fetching updated version`);
      await getDocumentFromCache(documentId, collection);
    }

    // Return the updated document
    return documentCache.get(cacheKey);
  } catch (error) {
    console.error(`Error updating document ${documentId}:`, error);
    throw error;
  }
}

/**
 * Invalidate a document in the cache
 * @param {string} documentId - The document ID
 * @param {string} collection - The MongoDB collection (default: 'Documents')
 */
export function invalidateDocumentCache(documentId, collection = 'Documents') {
  if (!documentId) {
    return;
  }

  const cacheKey = `${collection}:${documentId}`;
  if (documentCache.has(cacheKey)) {
    documentCache.delete(cacheKey);
    console.log(`Document ${documentId} invalidated in cache`);
  }
}

/**
 * Clear the entire document cache
 */
export function clearDocumentCache() {
  documentCache.clear();
  console.log('Document cache cleared');
}

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

    const cacheEntry = {
      results: resultsToStore,
      timestamp: new Date()
    };

    // Store in memory cache
    analysisResultsCache.set(documentId, cacheEntry);

    // Store in persistent file cache
    try {
      await ensureCacheDir();
      const filePath = path.join(CACHE_DIR, `analysis_${documentId}.json`);
      await fs.writeFile(filePath, JSON.stringify(cacheEntry, null, 2), 'utf8');
      console.log(`💾 Stored analysis results in persistent cache: ${filePath}`);
    } catch (fileError) {
      console.warn(`⚠️ Failed to store persistent cache file: ${fileError.message}`);
      // Continue anyway - memory cache is still working
    }

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
    let cachedData = null;

    // Check if results are in memory cache
    if (analysisResultsCache.has(documentId)) {
      cachedData = analysisResultsCache.get(documentId);
      console.log(`Found analysis results in memory cache for document ${documentId} (cached at ${cachedData.timestamp})`);
    } else {
      // Check persistent file cache
      try {
        const filePath = path.join(CACHE_DIR, `analysis_${documentId}.json`);
        const fileContent = await fs.readFile(filePath, 'utf8');
        cachedData = JSON.parse(fileContent);

        // Restore to memory cache for faster future access
        analysisResultsCache.set(documentId, cachedData);

        console.log(`📁 Found analysis results in persistent cache for document ${documentId} (cached at ${cachedData.timestamp})`);
      } catch (fileError) {
        console.log(`No analysis results found in persistent cache for document ${documentId}: ${fileError.message}`);
      }
    }

    if (cachedData) {
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
    // Remove from memory cache
    if (analysisResultsCache.has(documentId)) {
      analysisResultsCache.delete(documentId);
      console.log(`Cleared analysis results from memory cache for document ${documentId}`);
    }

    // Remove from persistent file cache
    try {
      const filePath = path.join(CACHE_DIR, `analysis_${documentId}.json`);
      await fs.unlink(filePath);
      console.log(`🗑️ Removed persistent cache file: ${filePath}`);
    } catch (fileError) {
      console.log(`No persistent cache file to remove for document ${documentId}: ${fileError.message}`);
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

  return analysisResultsCache.has(documentId);
}

/**
 * Clear all caches
 */
export function clearAllCaches() {
  documentCache.clear();
  analysisResultsCache.clear();
  console.log('All caches cleared');
}

export default {
  // Document cache functions
  getDocumentFromCache,
  updateDocumentInCache,
  invalidateDocumentCache,
  clearDocumentCache,

  // Analysis results cache functions
  storeAnalysisResultsInCache,
  getAnalysisResultsFromCache,
  clearAnalysisResultsFromCache,
  hasAnalysisResultsInCache,

  // General cache functions
  clearAllCaches
};
