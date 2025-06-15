/**
 * Cache utilities for the Epii Analysis Pipeline.
 * Provides caching mechanisms for graph data, Bimba map, MEF templates, LLM responses, and documents.
 */

// Graph Data and Bimba Map Cache
let graphDataCache = null;
let bimbaMapCache = null;
let lastGraphCacheUpdateTime = null;
const GRAPH_CACHE_EXPIRY_TIME = 60 * 60 * 1000; // 1 hour in milliseconds

// MEF Template Cache
let mefTemplateCache = {};
let mefTemplateCacheTime = {};
const MEF_CACHE_EXPIRY_TIME = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// LLM Response Cache
let llmResponseCache = {};
const LLM_CACHE_SIZE_LIMIT = 100; // Maximum number of cached responses
let llmCacheKeys = []; // To track cache entry order for LRU eviction

// Document Cache
let documentCache = new Map();
let documentCacheTime = new Map();
const DOCUMENT_CACHE_EXPIRY_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds

/**
 * Gets cached graph data or fetches it if not cached or expired
 *
 * @param {Function} fetchFunction - Function to fetch graph data if cache is invalid
 * @returns {Promise<object>} - The graph data
 */
export async function getCachedGraphData(fetchFunction) {
    const currentTime = Date.now();

    // Check if cache is valid
    if (
        graphDataCache &&
        lastGraphCacheUpdateTime &&
        (currentTime - lastGraphCacheUpdateTime < GRAPH_CACHE_EXPIRY_TIME)
    ) {
        console.log("Using cached graph data");
        return graphDataCache;
    }

    // Fetch fresh data
    console.log("Fetching fresh graph data");
    graphDataCache = await fetchFunction();
    lastGraphCacheUpdateTime = currentTime;

    return graphDataCache;
}

/**
 * Gets cached Bimba map or generates it if not cached or expired
 *
 * @param {Function} generateFunction - Function to generate Bimba map if cache is invalid
 * @param {object} graphData - The graph data to use for generation
 * @returns {Promise<object>} - The Bimba map
 */
export async function getCachedBimbaMap(generateFunction, graphData) {
    const currentTime = Date.now();

    // Check if cache is valid
    if (
        bimbaMapCache &&
        lastGraphCacheUpdateTime &&
        (currentTime - lastGraphCacheUpdateTime < GRAPH_CACHE_EXPIRY_TIME)
    ) {
        console.log("Using cached Bimba map");
        return bimbaMapCache;
    }

    // Generate fresh map
    console.log("Generating fresh Bimba map");
    bimbaMapCache = await generateFunction(graphData);
    lastGraphCacheUpdateTime = currentTime;

    return bimbaMapCache;
}

/**
 * Gets cached MEF template or fetches it if not cached or expired
 *
 * @param {string} coordinateKey - The coordinate key for the MEF template
 * @param {Function} fetchFunction - Function to fetch MEF template if cache is invalid
 * @param {object} params - Parameters for the fetch function
 * @returns {Promise<object>} - The MEF template
 */
export async function getCachedMEFTemplate(coordinateKey, fetchFunction, params) {
    const currentTime = Date.now();

    // Check if cache is valid
    if (
        mefTemplateCache[coordinateKey] &&
        mefTemplateCacheTime[coordinateKey] &&
        (currentTime - mefTemplateCacheTime[coordinateKey] < MEF_CACHE_EXPIRY_TIME)
    ) {
        console.log(`Using cached MEF template for ${coordinateKey}`);
        return mefTemplateCache[coordinateKey];
    }

    // Fetch fresh template
    console.log(`Fetching fresh MEF template for ${coordinateKey}`);
    mefTemplateCache[coordinateKey] = await fetchFunction(params);
    mefTemplateCacheTime[coordinateKey] = currentTime;

    return mefTemplateCache[coordinateKey];
}

/**
 * Gets cached LLM response or generates it if not cached
 * Uses a simple hash of the prompt as the cache key
 *
 * @param {string} prompt - The LLM prompt
 * @param {Function} llmFunction - Function to call LLM if cache miss
 * @param {object} options - Options for the LLM call
 * @returns {Promise<string>} - The LLM response
 */
export async function getCachedLLMResponse(prompt, llmFunction, options = {}) {
    // Only cache deterministic calls
    if (options.temperature && options.temperature > 0.1) {
        return llmFunction(prompt, options);
    }

    // Create a simple hash of the prompt for the cache key
    const cacheKey = createSimpleHash(prompt);

    // Check if response is cached
    if (llmResponseCache[cacheKey]) {
        console.log("Using cached LLM response");

        // Move this key to the end of the array (most recently used)
        const keyIndex = llmCacheKeys.indexOf(cacheKey);
        if (keyIndex > -1) {
            llmCacheKeys.splice(keyIndex, 1);
        }
        llmCacheKeys.push(cacheKey);

        return llmResponseCache[cacheKey];
    }

    // Get fresh response
    console.log("Getting fresh LLM response");
    const response = await llmFunction(prompt, options);

    // Cache the response
    llmResponseCache[cacheKey] = response;
    llmCacheKeys.push(cacheKey);

    // Evict least recently used entry if cache is full
    if (llmCacheKeys.length > LLM_CACHE_SIZE_LIMIT) {
        const oldestKey = llmCacheKeys.shift();
        delete llmResponseCache[oldestKey];
    }

    return response;
}

/**
 * Creates a simple hash of a string
 *
 * @param {string} str - The string to hash
 * @returns {string} - The hash
 */
function createSimpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString(16);
}

/**
 * Invalidates the graph data and Bimba map cache
 * This should be called when Bimba updates are made
 */
export function invalidateBimbaCache() {
    console.log("Invalidating graph data and Bimba map cache");
    graphDataCache = null;
    bimbaMapCache = null;
    lastGraphCacheUpdateTime = null;
}

/**
 * Invalidates the MEF template cache
 * This should be called when MEF structure is updated
 */
export function invalidateMEFCache() {
    console.log("Invalidating MEF template cache");
    mefTemplateCache = {};
    mefTemplateCacheTime = {};
}

/**
 * Clears the LLM response cache
 */
export function clearLLMCache() {
    console.log("Clearing LLM response cache");
    llmResponseCache = {};
    llmCacheKeys = [];
}

/**
 * Gets a document from the cache or fetches it if not cached or expired
 *
 * @param {string} documentId - The document ID
 * @param {Function} fetchFunction - Function to fetch the document if cache is invalid
 * @returns {Promise<object>} - The document
 */
export async function getCachedDocument(documentId, fetchFunction) {
    const currentTime = Date.now();

    // Check if cache is valid
    if (
        documentCache.has(documentId) &&
        documentCacheTime.has(documentId) &&
        (currentTime - documentCacheTime.get(documentId) < DOCUMENT_CACHE_EXPIRY_TIME)
    ) {
        console.log(`Using cached document for ID ${documentId}`);
        return documentCache.get(documentId);
    }

    // Fetch fresh document
    console.log(`Fetching fresh document for ID ${documentId}`);
    const document = await fetchFunction();

    if (document) {
        documentCache.set(documentId, document);
        documentCacheTime.set(documentId, currentTime);
    }

    return document;
}

/**
 * Caches a document
 *
 * @param {string} documentId - The document ID
 * @param {object} document - The document to cache
 */
export function cacheDocument(documentId, document) {
    if (!document) {
        console.warn(`Attempted to cache null/undefined document for ID ${documentId}`);
        return;
    }

    console.log(`Caching document for ID ${documentId}`);
    documentCache.set(documentId, document);
    documentCacheTime.set(documentId, Date.now());
}

/**
 * Clears the document cache
 */
export function clearDocumentCache() {
    console.log("Clearing document cache");
    documentCache.clear();
    documentCacheTime.clear();
}

/**
 * Clears all caches
 */
export function clearAllCaches() {
    console.log("Clearing all caches");
    invalidateBimbaCache();
    invalidateMEFCache();
    clearLLMCache();
    clearDocumentCache();
}
