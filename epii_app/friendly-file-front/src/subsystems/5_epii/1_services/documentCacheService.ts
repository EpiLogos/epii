/**
 * Document Cache Service
 * Bimba Coordinate: #5-1-1-1
 *
 * Provides caching for document fetching to reduce redundant API calls
 * and improve performance.
 */

// Define the document types
export interface CachedDocument {
  // MongoDB uses _id as the primary identifier
  _id: string;
  // Legacy id field for backward compatibility
  id?: string;
  name?: string;
  fileName?: string;
  originalName?: string;
  lastModified?: Date | string;
  uploadDate?: Date | string;
  bimbaCoordinate?: string;
  targetCoordinate?: string;
  notionPageId?: string;
  documentType?: 'bimba' | 'pratibimba';
  bimbaId?: string;
  textContent?: string;
  content?: string;
  analysisStatus?: string;
  // Add any other fields that might be in the document
  [key: string]: any;
}

// Define the cache structure
interface DocumentCache {
  byId: Map<string, CachedDocument>;
  byCoordinate: Map<string, string[]>; // Maps coordinate to array of document IDs
  lastFetched: Map<string, number>; // Maps cache key to timestamp
}

// Cache TTL in milliseconds (5 minutes)
const CACHE_TTL = 5 * 60 * 1000;

// Initialize the cache
const cache: DocumentCache = {
  byId: new Map(),
  byCoordinate: new Map(),
  lastFetched: new Map()
};

/**
 * Document Cache Service
 * Provides methods for caching and retrieving documents
 */
export const documentCacheService = {
  /**
   * Get a document from the cache by ID
   * @param id Document ID (_id from MongoDB)
   * @returns The cached document or null if not found
   */
  getDocumentById: (id: string): CachedDocument | null => {
    if (!id) return null;

    // Check if the document is in the cache
    let cachedDoc = cache.byId.get(id);

    // If not found by id, try to clean the id (MongoDB format)
    if (!cachedDoc) {
      // Clean the ID to ensure consistent lookup
      const cleanedId = id.toString().replace(/[^0-9a-f]/gi, '').padEnd(24, '0').substring(0, 24);
      if (cleanedId !== id) {
        cachedDoc = cache.byId.get(cleanedId);
      }
    }

    if (cachedDoc) {
      // Check if the cache is still valid
      const lastFetched = cache.lastFetched.get(`doc:${id}`) || 0;
      if (Date.now() - lastFetched < CACHE_TTL) {
        // Ensure the document has both id and _id properties
        if (!cachedDoc.id && cachedDoc._id) {
          cachedDoc.id = cachedDoc._id;
        }
        if (!cachedDoc._id && cachedDoc.id) {
          cachedDoc._id = cachedDoc.id;
        }

        // Return the document directly
        return cachedDoc;
      } else {
        // Cache expired, invalidate it
        cache.byId.delete(id);
        cache.lastFetched.delete(`doc:${id}`);
      }
    }

    return null;
  },

  /**
   * Get documents from the cache by coordinate
   * @param coordinate Bimba coordinate
   * @param collection Optional collection name
   * @returns Array of cached documents or empty array if not found
   */
  getDocumentsByCoordinate: (coordinate: string, collection?: string): CachedDocument[] => {
    if (!coordinate) return [];

    // STANDARDIZED CACHE KEY FORMAT: Always use coord: prefix
    // Special case for 'all' coordinate
    const cacheKey = collection ? `coord:${coordinate}:${collection}` : `coord:${coordinate}`;

    // Check if the coordinate is in the cache
    const documentIds = cache.byCoordinate.get(cacheKey);

    if (documentIds && documentIds.length > 0) {
      // Check if the cache is still valid
      const lastFetched = cache.lastFetched.get(cacheKey) || 0;
      if (Date.now() - lastFetched < CACHE_TTL) {
        // Get all documents from the cache
        const documents = documentIds
          .map(id => cache.byId.get(id))
          .filter(Boolean) as CachedDocument[];

        // If we have all documents, return them directly
        if (documents.length === documentIds.length) {
          return documents;
        } else {
          // Some documents are missing, invalidate the cache
          cache.byCoordinate.delete(cacheKey);
          cache.lastFetched.delete(cacheKey);
        }
      } else {
        // Cache expired, invalidate it
        cache.byCoordinate.delete(cacheKey);
        cache.lastFetched.delete(cacheKey);
      }
    }

    // Return empty array if not found
    return [];
  },

  /**
   * Check if a document has content
   * @param document Document to check
   * @returns True if the document has content
   */
  hasContent: (document: CachedDocument): boolean => {
    if (!document) return false;
    return !!(document.content || document.textContent || document.text || document.rawContent || document.raw);
  },

  /**
   * Get the content of a document
   * @param document Document to get content from
   * @returns Document content or empty string if not found
   */
  getDocumentContent: (document: CachedDocument): string => {
    if (!document) return '';
    return document.content || document.textContent || document.text || document.rawContent || document.raw || '';
  },

  /**
   * Cache a document
   * @param document Document to cache
   */
  cacheDocument: (document: CachedDocument): void => {
    if (!document || !document._id) {
      return;
    }

    // Ensure document has _id property (copy from id if needed)
    if (!document._id && document.id) {
      document._id = document.id;
    }

    // Store the document in the cache
    cache.byId.set(document._id, document);
    cache.lastFetched.set(`doc:${document._id}`, Date.now());

    // If the document has a coordinate, add it to the coordinate cache
    const coordinate = document.targetCoordinate || document.bimbaCoordinate;
    if (coordinate) {
      const collection = document.documentType === 'pratibimba' ? 'pratibimbaDocuments' : 'Documents';
      const cacheKey = `coord:${coordinate}:${collection}`;

      // Get existing document IDs for this coordinate
      const existingIds = cache.byCoordinate.get(cacheKey) || [];

      // Add this document ID if not already present
      if (!existingIds.includes(document._id)) {
        existingIds.push(document._id);
        cache.byCoordinate.set(cacheKey, existingIds);
        cache.lastFetched.set(cacheKey, Date.now());
      }
    }
  },

  /**
   * Cache multiple documents
   * @param documents Documents to cache
   * @param coordinate Optional coordinate to associate with these documents
   * @param collection Optional collection name
   */
  cacheDocuments: (documents: CachedDocument[], coordinate?: string, collection?: string): void => {
    if (!documents || !Array.isArray(documents)) {
      console.warn('Attempted to cache invalid documents:', documents);
      return;
    }

    // Cache each document individually
    const documentIds: string[] = [];
    let documentsWithContent = 0;

    documents.forEach(doc => {
      if (!doc) {
        console.warn('Null document found in documents array');
        return;
      }

      // MongoDB documents use _id as the primary identifier
      if (!doc._id) {
        // If _id is missing but id exists, use id as _id
        if (doc.id) {
          doc._id = doc.id;
        } else {
          console.warn('Document without _id found in documents array:', doc);
          return;
        }
      }

      // Clean the ID to ensure consistent storage
      const cleanedId = doc._id.toString().replace(/[^0-9a-f]/gi, '').padEnd(24, '0').substring(0, 24);
      documentIds.push(cleanedId);

      // Check if document has content
      if (documentCacheService.hasContent(doc)) {
        documentsWithContent++;
      }

      // Cache the document
      documentCacheService.cacheDocument(doc);
    });

    // If a coordinate was provided, associate these documents with it
    if (coordinate && documentIds.length > 0) {
      const cacheKey = collection ? `coord:${coordinate}:${collection}` : `coord:${coordinate}`;
      cache.byCoordinate.set(cacheKey, documentIds);
      cache.lastFetched.set(cacheKey, Date.now());

      console.log(`Cached ${documentIds.length} documents for coordinate ${coordinate}${collection ? ` (${collection})` : ''}, ${documentsWithContent} with content`);
    }
  },

  /**
   * Invalidate the cache for a document
   * @param id Document ID (_id from MongoDB)
   */
  invalidateDocument: (id: string): void => {
    // Clean the ID to ensure consistent lookup
    const cleanedId = id.toString().replace(/[^0-9a-f]/gi, '').padEnd(24, '0').substring(0, 24);

    // Remove the document from the cache
    cache.byId.delete(cleanedId);
    cache.lastFetched.delete(`doc:${cleanedId}`);

    // Also remove with original ID if different
    if (cleanedId !== id) {
      cache.byId.delete(id);
    }

    console.log(`Invalidated cache for document ${id}`);
  },

  /**
   * Invalidate the cache for a coordinate
   * @param coordinate Bimba coordinate
   * @param collection Optional collection name
   */
  invalidateCoordinate: (coordinate: string, collection?: string): void => {
    // STANDARDIZED CACHE KEY FORMAT: Always use coord: prefix
    const cacheKey = collection ? `coord:${coordinate}:${collection}` : `coord:${coordinate}`;

    // Remove the coordinate from the cache
    cache.byCoordinate.delete(cacheKey);
    cache.lastFetched.delete(cacheKey);

    console.log(`Invalidated cache for coordinate ${coordinate}${collection ? ` (${collection})` : ''} with key ${cacheKey}`);
    console.log(`Remaining cache keys: ${Array.from(cache.byCoordinate.keys()).join(', ')}`);
  },

  /**
   * Clear the entire cache
   */
  clearCache: (): void => {
    cache.byId.clear();
    cache.byCoordinate.clear();
    cache.lastFetched.clear();
    console.log('Document cache cleared');
  },

  /**
   * Invalidate all coordinate caches
   */
  invalidateAll: (): void => {
    cache.byCoordinate.clear();
    cache.lastFetched.clear();
    console.log('All document coordinate caches invalidated');
  },

  /**
   * Update a document in the cache with analysis results
   * @param documentId Document ID
   * @param analysisResults Analysis results to add to the document
   * @returns The updated document or null if not found
   */
  updateDocumentWithAnalysisResults: (documentId: string, analysisResults: any): CachedDocument | null => {
    if (!documentId || !analysisResults) {
      console.warn('Cannot update document with analysis results: missing documentId or analysisResults');
      return null;
    }

    // Get the document from the cache
    const document = cache.byId.get(documentId);
    if (!document) {
      console.warn(`Document ${documentId} not found in cache, cannot update with analysis results`);
      return null;
    }

    console.log(`Updating document ${documentId} in cache with analysis results`);

    // Update the document with analysis results
    const updatedDocument = {
      ...document,
      analysisStatus: 'completed',
      metadata: {
        ...(document.metadata || {}),
        analysisStatus: 'completed',
        analysisCompletedAt: new Date().toISOString(),
        // Store the full analysis results in the cached document
        analysisResults: analysisResults
      }
    };

    // Update the document in the cache
    cache.byId.set(documentId, updatedDocument);
    cache.lastFetched.set(`doc:${documentId}`, Date.now());

    // Dispatch a custom event to notify components that the document has been updated
    const event = new CustomEvent('documentUpdated', {
      detail: {
        documentId,
        analysisResults
      }
    });
    window.dispatchEvent(event);

    console.log(`Successfully updated document ${documentId} in cache with analysis results`);
    return updatedDocument;
  },

  /**
   * Clear analysis results from a document in the cache
   * @param documentId Document ID
   * @returns The updated document or null if not found
   */
  clearAnalysisResults: (documentId: string): CachedDocument | null => {
    if (!documentId) {
      console.warn('Cannot clear analysis results: missing documentId');
      return null;
    }

    // Get the document from the cache
    const document = cache.byId.get(documentId);
    if (!document) {
      console.warn(`Document ${documentId} not found in cache, cannot clear analysis results`);
      return null;
    }

    console.log(`Clearing analysis results from document ${documentId} in cache`);

    // Create a new metadata object without analysisResults
    const { analysisResults, ...restMetadata } = document.metadata || {};

    // Update the document without analysis results
    const updatedDocument = {
      ...document,
      metadata: {
        ...restMetadata,
        analysisStatus: 'crystallized',
        crystallizationTimestamp: new Date().toISOString()
      }
    };

    // Update the document in the cache
    cache.byId.set(documentId, updatedDocument);
    cache.lastFetched.set(`doc:${documentId}`, Date.now());

    console.log(`Successfully cleared analysis results from document ${documentId} in cache`);
    return updatedDocument;
  },

  /**
   * Get all coordinates that have cached documents
   * @param collection Optional collection name to filter by
   * @returns Array of coordinates
   */
  getAllCoordinates: (collection?: string): string[] => {
    const coordinates: string[] = [];

    for (const key of cache.byCoordinate.keys()) {
      if (key.startsWith('coord:') && !key.includes(':all:')) {
        if (collection) {
          // Filter by collection
          if (key.endsWith(`:${collection}`)) {
            const coord = key.replace('coord:', '').replace(`:${collection}`, '');
            coordinates.push(coord);
          }
        } else {
          // Get all coordinates regardless of collection
          const parts = key.split(':');
          if (parts.length >= 2) {
            const coord = parts[1];
            if (!coordinates.includes(coord)) {
              coordinates.push(coord);
            }
          }
        }
      }
    }

    return coordinates;
  },

  /**
   * Cache all documents from both collections at once
   * @param bimbaDocuments All documents from the 'Documents' collection
   * @param pratibimbaDocuments All documents from the 'pratibimbaDocuments' collection
   */
  cacheAllDocuments: (bimbaDocuments: CachedDocument[], pratibimbaDocuments: CachedDocument[]): void => {
    // Clear the cache first
    cache.byId.clear();
    cache.byCoordinate.clear();
    cache.lastFetched.clear();

    const now = Date.now();

    // Set up collection caches
    cache.byCoordinate.set('coord:all:Documents', []);
    cache.byCoordinate.set('coord:all:pratibimbaDocuments', []);

    // Process bimba documents
    bimbaDocuments.forEach(doc => {
      if (!doc || !doc._id) return;

      // Store by ID
      cache.byId.set(doc._id, doc);

      // Add to collection cache
      cache.byCoordinate.get('coord:all:Documents')?.push(doc._id);

      // Add to coordinate cache if needed
      const coordinate = doc.targetCoordinate || doc.bimbaCoordinate;
      if (coordinate) {
        const key = `coord:${coordinate}:Documents`;
        if (!cache.byCoordinate.has(key)) {
          cache.byCoordinate.set(key, []);
        }
        cache.byCoordinate.get(key)?.push(doc._id);
      }
    });

    // Process pratibimba documents
    pratibimbaDocuments.forEach(doc => {
      if (!doc || !doc._id) return;

      // Store by ID
      cache.byId.set(doc._id, doc);

      // Add to collection cache
      cache.byCoordinate.get('coord:all:pratibimbaDocuments')?.push(doc._id);

      // Add to coordinate cache if needed
      const coordinate = doc.targetCoordinate || doc.bimbaCoordinate;
      if (coordinate) {
        const key = `coord:${coordinate}:pratibimbaDocuments`;
        if (!cache.byCoordinate.has(key)) {
          cache.byCoordinate.set(key, []);
        }
        cache.byCoordinate.get(key)?.push(doc._id);
      }
    });

    // Set all timestamps at once
    for (const key of cache.byCoordinate.keys()) {
      cache.lastFetched.set(key, now);
    }
    for (const id of cache.byId.keys()) {
      cache.lastFetched.set(`doc:${id}`, now);
    }
  }
};

export default documentCacheService;
