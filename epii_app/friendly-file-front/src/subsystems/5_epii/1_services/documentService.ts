/**
 * Document Service for MongoDB operations
 * Bimba Coordinate: #5-1-1
 */

import documentCacheService, { CachedDocument } from './documentCacheService';

/**
 * Handles all MongoDB operations for documents
 * This service abstracts the API calls to the backend
 * Uses caching to reduce redundant API calls and improve performance
 */
const documentServiceImpl = {
  /**
   * Get all documents directly from MongoDB (no caching)
   * @param collection MongoDB collection name (default: 'Documents')
   * @returns Promise with all documents
   */
  getAllDocuments: async (collection: string = 'Documents') => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

    try {
      // Direct fetch with minimal options
      const response = await fetch(`${backendUrl}/api/bpmcp/call-tool`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolName: 'listDocuments',
          args: { query: {}, limit: 1000, collection }
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to get documents: ${response.statusText}`);
      }

      const result = await response.json();

      // Return documents directly
      if (Array.isArray(result)) {
        return result;
      } else if (result && result.documents && Array.isArray(result.documents)) {
        return result.documents;
      }

      // Return empty array if no documents found
      return [];
    } catch (error) {
      console.error(`Error retrieving documents from MongoDB collection ${collection}:`, error);
      return []; // Return empty array on error to prevent UI from breaking
    }
  },

  /**
   * Create a new document in MongoDB
   * @param document Document data
   * @returns Promise with the created document
   */
  createDocument: async (document: {
    name: string;
    content: string;
    targetCoordinate?: string | null;
    userId?: string;
    collection?: string;
  }) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
    const collectionName = document.collection || 'Documents';

    try {
      const response = await fetch(`${backendUrl}/api/bpmcp/call-tool`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          toolName: 'storeDocument',
          args: {
            document: {
              originalName: document.name,
              fileName: document.name,
              title: document.name, // Add title field to match the schema
              mimeType: 'text/plain',
              size: document.content.length,
              uploadDate: new Date().toISOString(),
              targetCoordinate: document.targetCoordinate || null,
              userId: document.userId || 'anonymous',
              textContent: document.content,
              analysisStatus: 'pending'
            },
            collection: collectionName
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create document: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Raw response from document creation:', result);

      // Extract MongoDB ID and document from different possible response formats
      let mongoId: string | undefined;
      let createdDoc: any = null;

      try {
        // Case 1: BPMCP format with content array containing JSON string
        if (result.content && Array.isArray(result.content)) {
          const contentItem = result.content.find(item => item.type === 'text' && item.text);
          if (contentItem && contentItem.text) {
            createdDoc = JSON.parse(contentItem.text);
            mongoId = createdDoc._id;
            console.log('Document created in MongoDB (parsed from content):', createdDoc);
          }
        }
        // Case 2: Direct document format
        else if (result._id) {
          createdDoc = result;
          mongoId = result._id;
          console.log('Document created in MongoDB (direct format):', createdDoc);
        }
        // Case 3: JSON string
        else if (typeof result === 'string') {
          createdDoc = JSON.parse(result);
          mongoId = createdDoc._id;
          console.log('Document created in MongoDB (parsed from string):', createdDoc);
        }

        // Verify we have content
        if (createdDoc && !createdDoc.textContent && document.content) {
          console.warn('Created document has no textContent, using provided content');
          createdDoc.textContent = document.content;
        }
      } catch (parseError) {
        console.warn('Error parsing MongoDB document response:', parseError);
      }

      // Return a merged object with the MongoDB ID and the original document
      // If we have a created document from MongoDB, use its content and other fields
      if (createdDoc) {
        return {
          id: mongoId,
          ...document,
          // Include the textContent from the created document if available
          ...(createdDoc.textContent && { textContent: createdDoc.textContent }),
          // Include other useful fields from the created document
          ...(createdDoc.fileName && { fileName: createdDoc.fileName }),
          ...(createdDoc.originalName && { originalName: createdDoc.originalName }),
          ...(createdDoc.targetCoordinate && { targetCoordinate: createdDoc.targetCoordinate })
        };
      } else {
        // Fallback to just the ID and original document
        return { id: mongoId, ...document };
      }
    } catch (error) {
      console.error('Error creating document in MongoDB:', error);
      throw error;
    }
  },

  /**
   * Update a document in MongoDB
   * @param documentId Document ID
   * @param updates Document updates
   * @param collection MongoDB collection name (default: 'Documents')
   * @returns Promise with the update result
   */
  updateDocument: async (documentId: string, updates: {
    content?: string;
    name?: string;
    targetCoordinate?: string;
    metadata?: {
      analysisStatus?: string;
      analysisResults?: any;
      crystallizationTimestamp?: string;
      crystallizedDocumentId?: string;
      [key: string]: any;
    };
  }, collection: string = 'Documents') => {
    // Skip MongoDB sync for temporary documents
    if (documentId.startsWith('temp-')) {
      console.warn('Skipping MongoDB sync for temporary document:', documentId);
      return { success: false, message: 'Temporary document not synced to MongoDB' };
    }

    // Clean the document ID to ensure it's in a format that MongoDB can handle
    const cleanedId = documentId.replace(/[^0-9a-f]/gi, '').padEnd(24, '0').substring(0, 24);
    console.log(`Original ID: ${documentId}, Cleaned ID: ${cleanedId}`);

    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

    try {
      // Get the current document to determine if coordinate is changing
      let oldCoordinate: string | null = null;
      try {
        const currentDoc = await documentServiceImpl.getDocument(documentId, collection);
        if (currentDoc) {
          oldCoordinate = currentDoc.targetCoordinate || currentDoc.bimbaCoordinate || null;
        }
      } catch (error) {
        console.warn(`Could not fetch current document for coordinate tracking: ${error}`);
      }

      // Build the update object
      const updateObj: any = { $set: {} };

      // Handle textContent field (preferred) or content field (backward compatibility)
      const documentContent = updates.textContent !== undefined ? updates.textContent : updates.content;

      if (documentContent !== undefined) {
        // Ensure content is not empty
        if (documentContent.length === 0) {
          console.warn('Attempting to save empty content, using placeholder');
          const placeholderContent = ' '; // Use a space as minimum content to prevent empty content

          // Set both textContent and content for backward compatibility
          updateObj.$set.textContent = placeholderContent;
          updateObj.$set.content = placeholderContent;
          updateObj.$set.size = placeholderContent.length;
        } else {
          // Set both textContent and content for backward compatibility
          updateObj.$set.textContent = documentContent;
          updateObj.$set.content = documentContent;
          updateObj.$set.size = documentContent.length;
        }

        // Add to versions array
        updateObj.$push = {
          versions: {
            timestamp: new Date().toISOString(),
            textContent: documentContent
          }
        };

        // Double-check content is not undefined or null before saving
        if (!updateObj.$set.textContent) {
          console.warn('Content is still empty after validation, using fallback');
          updateObj.$set.textContent = documentContent || ' ';
          updateObj.$set.content = documentContent || ' ';
        }

        // Log the content length being saved
        console.log(`documentService: Saving content with length ${documentContent.length}`);
      }

      if (updates.name !== undefined) {
        updateObj.$set.originalName = updates.name;
        updateObj.$set.fileName = updates.name;
      }

      if (updates.targetCoordinate !== undefined) {
        updateObj.$set.targetCoordinate = updates.targetCoordinate;
      }

      // Handle metadata updates
      if (updates.metadata) {
        // Process each metadata field
        Object.entries(updates.metadata).forEach(([key, value]) => {
          // Use dot notation for MongoDB nested fields
          updateObj.$set[`metadata.${key}`] = value;
        });

        // If we have analysis results, ensure they're properly structured
        if (updates.metadata.analysisResults) {
          console.log(`Updating document ${documentId} with analysis results`);
        }

        // If we have analysis status, update it at the root level too for backward compatibility
        if (updates.metadata.analysisStatus) {
          updateObj.$set.analysisStatus = updates.metadata.analysisStatus;
        }
      }

      // Always update lastModified
      updateObj.$set.lastModified = new Date().toISOString();

      // Add retry mechanism for MongoDB updates
      const maxRetries = 3;
      let retryCount = 0;
      let success = false;
      let lastError;
      let result;

      // Log the document ID and update object for debugging
      console.log(`Updating document in MongoDB: ${documentId}`);

      while (retryCount < maxRetries && !success) {
        try {
          const response = await fetch(`${backendUrl}/api/bpmcp/call-tool`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              toolName: 'updateDocument',
              args: {
                documentId: cleanedId,
                update: updateObj,
                collection: collection
              }
            }),
          });

          if (!response.ok) {
            throw new Error(`Failed to update document: ${response.statusText}`);
          }

          result = await response.json();

          // Handle different response formats
          let updatedDoc = null;

          // Case 1: Direct document object
          if (result && !Array.isArray(result) && typeof result === 'object') {
            updatedDoc = result;
          }
          // Case 2: BPMCP format with content array containing JSON string
          else if (result && result.content && Array.isArray(result.content)) {
            try {
              const contentItem = result.content.find(item => item.type === 'text' && item.text);
              if (contentItem && contentItem.text) {
                updatedDoc = JSON.parse(contentItem.text);
              }
            } catch (parseError) {
              console.error(`Error parsing BPMCP update response:`, parseError);
            }
          }

          console.log('Document updated in MongoDB:', updatedDoc ? 'Success' : 'Unknown result');

          // Consider the update successful
          success = true;

          // Log success
          console.log(`Document ${documentId} updated successfully in MongoDB`);

          // Invalidate cache for this document
          documentCacheService.invalidateDocument(documentId);
          documentCacheService.invalidateDocument(cleanedId);

          // If document has a coordinate, invalidate that coordinate's cache
          if (updates.targetCoordinate) {
            documentCacheService.invalidateCoordinate(updates.targetCoordinate, collection);

            // If coordinate changed, invalidate old coordinate's cache too
            if (oldCoordinate && oldCoordinate !== updates.targetCoordinate) {
              documentCacheService.invalidateCoordinate(oldCoordinate, collection);
            }
          } else if (oldCoordinate) {
            documentCacheService.invalidateCoordinate(oldCoordinate, collection);
          }

          // Invalidate the "all documents" cache for this collection
          // STANDARDIZED CACHE KEY FORMAT: Always use coord: prefix
          documentCacheService.invalidateCoordinate('all', collection);

          // Verify the update by retrieving the document
          try {
            console.log(`Verifying document ${documentId} after update...`);
            // Note: We can't verify from cache since we just updated MongoDB
            // This is a special case where we need to fetch directly from MongoDB
            // We'll implement this differently in the future
            const verifyResult = null; // Can't verify without MongoDB access

            if (verifyResult && verifyResult._id) {
              // This is the document itself
              const docContent = verifyResult.textContent || verifyResult.content || '';

              if (docContent) {
                console.log(`Verified document ${documentId} exists with content length: ${docContent.length}`);
                console.log(`Verified content preview: "${docContent.substring(0, 50)}..."`);

                // Cache the verified document
                documentCacheService.cacheDocument(verifyResult);
              } else {
                console.warn(`Verification found document ${documentId} but it has no content!`);
              }
            } else {
              console.warn(`Verification could not find document ${documentId} after update!`);
            }
          } catch (verifyError) {
            console.warn(`Error verifying document update: ${verifyError.message}`);
          }

          // Wait a moment to ensure the update is processed
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
          lastError = error;
          retryCount++;

          if (retryCount < maxRetries) {
            console.warn(`Retry ${retryCount}/${maxRetries} for document update ${documentId}:`, error);
            // Wait before retrying (exponential backoff)
            await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount - 1)));
          }
        }
      }

      if (!success) {
        console.error(`Failed to update document ${documentId} after ${maxRetries} retries:`, lastError);
        throw lastError || new Error('Failed to update document after multiple retries');
      }

      return { success: true, message: 'Document updated in MongoDB' };
    } catch (error) {
      console.error('Error updating document in MongoDB:', error);
      throw error;
    }
  },

  /**
   * Get documents by coordinate from cache ONLY
   * @param coordinate Bimba coordinate
   * @param collection MongoDB collection name (default: 'Documents')
   * @returns Promise with the documents
   */
  getDocumentsByCoordinate: async (coordinate: string, collection: string = 'Documents') => {
    console.log(`Getting documents for coordinate ${coordinate} from cache...`);

    // ONLY check cache - no fallback to MongoDB
    const cachedDocs = documentCacheService.getDocumentsByCoordinate(coordinate, collection);

    // Always return what's in the cache (empty array if nothing found)
    console.log(`Found ${cachedDocs.length} documents for coordinate ${coordinate} in cache`);
    return cachedDocs;
  },

  /**
   * Get a document from cache or MongoDB
   * @param documentId Document ID
   * @param collection MongoDB collection name (default: 'Documents')
   * @param fetchFromMongoDB Whether to fetch from MongoDB if not in cache (default: true)
   * @returns Promise with the document
   */
  getDocument: async (documentId: string, collection: string = 'Documents', fetchFromMongoDB: boolean = true) => {
    // Skip retrieval for temporary documents
    if (documentId.startsWith('temp-')) {
      console.warn('Skipping retrieval for temporary document:', documentId);
      return null;
    }

    // Clean the document ID to ensure it's in a format that MongoDB can handle
    const cleanedId = documentId.replace(/[^0-9a-f]/gi, '').padEnd(24, '0').substring(0, 24);
    console.log(`Original ID: ${documentId}, Cleaned ID: ${cleanedId}`);

    // First check cache
    const cachedDoc = documentCacheService.getDocumentById(documentId) ||
                      documentCacheService.getDocumentById(cleanedId);

    if (cachedDoc) {
      console.log(`Cache hit for document ${documentId}`);
      // Document is already standardized by the cache service
      return cachedDoc;
    }

    // If not in cache and fetchFromMongoDB is true, fetch from MongoDB
    if (fetchFromMongoDB) {
      console.log(`Document ${documentId} not found in cache, fetching from MongoDB...`);

      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

        // Use the bpMCP service to fetch the document
        const response = await fetch(`${backendUrl}/api/bpmcp/call-tool`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            toolName: 'getDocumentById',
            args: { documentId: cleanedId, collection }
          })
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch document: ${response.statusText}`);
        }

        const result = await response.json();

        // Parse the document from the result
        let document = null;

        if (typeof result === 'object' && result !== null) {
          // Direct object response
          document = result;
        } else if (typeof result === 'string') {
          // JSON string response
          try {
            document = JSON.parse(result);
          } catch (e) {
            console.error('Error parsing document JSON:', e);
          }
        } else if (result && result.content && Array.isArray(result.content)) {
          // BPMCP response format
          try {
            const contentText = result.content.find(item => item.type === 'text')?.text;
            if (contentText) {
              document = JSON.parse(contentText);
            }
          } catch (e) {
            console.error('Error parsing BPMCP response:', e);
          }
        }

        if (document) {
          console.log(`Successfully fetched document ${documentId} from MongoDB`);

          // Cache the document for future use
          documentCacheService.cacheDocument(document);

          return document;
        }
      } catch (error) {
        console.error(`Error fetching document ${documentId} from MongoDB:`, error);
      }
    }

    // If not in cache and MongoDB fetch failed or was skipped, return null
    console.log(`Document ${documentId} not found in cache or MongoDB`);
    return null;
  },

  /**
   * Delete a document from MongoDB
   * @param documentId Document ID
   * @param collection MongoDB collection name (default: 'Documents')
   * @returns Promise with the delete result
   */
  deleteDocument: async (documentId: string, collection: string = 'Documents') => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

    // Skip MongoDB deletion for temporary documents
    if (!documentId || documentId.startsWith('temp-')) {
      console.warn('Skipping MongoDB deletion for temporary or null document:', documentId);
      return { success: false, message: 'Temporary document not deleted from MongoDB' };
    }

    // Use the document ID as is - MongoDB IDs are already in a consistent format
    const cleanedId = documentId;

    // Invalidate the cache for this document immediately to prevent stale data
    documentCacheService.invalidateDocument(documentId);
    documentCacheService.invalidateDocument(cleanedId);

    // Add retry mechanism for MongoDB operations
    const maxRetries = 3;
    let retryCount = 0;
    let lastError;
    let documentDeleted = false;

    while (retryCount < maxRetries && !documentDeleted) {
      try {
        console.log(`Attempt ${retryCount + 1}/${maxRetries} to delete document ${documentId} from collection ${collection}`);

        const response = await fetch(`${backendUrl}/api/bpmcp/call-tool`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            toolName: 'deleteDocument',
            args: {
              documentId: cleanedId,
              collection: collection
            }
          }),
        });

        // Check if the response is ok
        if (!response.ok) {
          const errorText = await response.text();
          console.warn(`Server returned ${response.status} for document deletion:`, errorText);

          // If the error is 404, the document is already gone, which is a success
          if (response.status === 404 || errorText.includes('not found')) {
            console.log(`Document ${documentId} already deleted or not found`);
            documentDeleted = true;
            return { success: true, message: 'Document already deleted or not found' };
          }

          throw new Error(`Failed to delete document: ${response.statusText} - ${errorText}`);
        }

        // Parse the response
        let result;
        try {
          result = await response.json();
        } catch (parseError) {
          console.warn(`Failed to parse JSON response for document deletion:`, parseError);
          // If we can't parse the response but the status was OK, consider it a success
          if (response.ok) {
            documentDeleted = true;
            return { success: true, message: 'Document deleted from MongoDB (non-JSON response)' };
          }
          throw new Error(`Failed to parse deletion response: ${parseError.message}`);
        }

        console.log(`Document ${documentId} deleted from MongoDB:`, result);
        documentDeleted = true;

        // Return success
        return { success: true, message: 'Document deleted from MongoDB', result };
      } catch (error) {
        lastError = error;
        retryCount++;

        // Check if the error message indicates the document is already gone
        const errorMessage = error?.message || '';
        if (errorMessage.includes('not found') ||
            errorMessage.includes('Document not found') ||
            errorMessage.includes('Invalid document ID format')) {
          console.log(`Document ${documentId} already deleted or not found`);
          documentDeleted = true;
          return { success: true, message: 'Document already deleted or not found' };
        }

        if (retryCount < maxRetries) {
          console.warn(`Retry ${retryCount}/${maxRetries} for document deletion ${documentId}:`, error);
          // Wait before retrying (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount - 1)));
        }
      }
    }

    // If we got here and documentDeleted is true, return success
    if (documentDeleted) {
      return { success: true, message: 'Document deleted from MongoDB' };
    }

    console.error(`Failed to delete document ${documentId} after ${maxRetries} retries:`, lastError);

    // Even if all retries failed, the document might still be deleted
    // Let's check if we can still find the document
    try {
      const checkResponse = await fetch(`${backendUrl}/api/bpmcp/call-tool`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          toolName: 'getDocumentById',
          args: {
            documentId: cleanedId,
            collection: collection
          }
        }),
      });

      // If we get a 404 or an empty result, the document is gone
      if (!checkResponse.ok || (await checkResponse.json())?.length === 0) {
        console.log(`Document ${documentId} not found after deletion check - considering deletion successful`);
        return { success: true, message: 'Document confirmed deleted after verification' };
      }
    } catch (checkError) {
      console.warn(`Error checking document existence after failed deletion:`, checkError);
      // If we can't check, assume it might be deleted
    }

    // Return a failure object instead of throwing to allow the UI to continue functioning
    return { success: false, message: `Failed to delete document: ${lastError?.message || 'Unknown error'}` };
  },

  /**
   * Create a new document with specified type in MongoDB
   * @param document Document data
   * @param documentType Type of document ('bimba' or 'pratibimba')
   * @returns Promise with the created document
   */
  createDocumentWithType: async (document: {
    name: string;
    textContent?: string;
    content?: string;
    bimbaId?: string;
    sourceSelection?: any;
    crystallizationIntent?: string;
    bimbaCoordinate?: string;
  }, documentType: 'bimba' | 'pratibimba' = 'bimba') => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
    const collection = documentType === 'pratibimba' ? 'pratibimbaDocuments' : 'Documents';

    try {
      // Use textContent if provided, fall back to content for backward compatibility
      const documentContent = document.textContent !== undefined ? document.textContent : document.content;

      const documentData: any = {
        originalName: document.name,
        fileName: document.name,
        title: document.name, // Add title field to match the schema
        mimeType: 'text/plain',
        size: documentContent?.length || 0,
        uploadDate: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        targetCoordinate: document.bimbaCoordinate || null,
        userId: 'anonymous',
        textContent: documentContent, // Use textContent as the primary field
        content: documentContent, // Also set content for backward compatibility
        analysisStatus: documentType === 'pratibimba' ? 'completed' : 'pending',
        documentType: documentType
      };

      // Log the document data being sent
      console.log(`Creating ${documentType} document with targetCoordinate: ${documentData.targetCoordinate}`);

      // Add pratibimba-specific fields if this is a pratibimba document
      if (documentType === 'pratibimba') {
        documentData.bimbaId = document.bimbaId;
        documentData.sourceSelection = document.sourceSelection;
        documentData.crystallizationIntent = document.crystallizationIntent;
        documentData.crystallizationDate = new Date().toISOString();
      }

      const response = await fetch(`${backendUrl}/api/bpmcp/call-tool`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          toolName: 'storeDocument',
          args: {
            document: documentData,
            collection: collection
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create ${documentType} document: ${response.statusText}`);
      }

      const result = await response.json();
      console.log(`Raw response from ${documentType} document creation:`, result);

      // Extract MongoDB ID and document from different possible response formats
      let mongoId: string | undefined;
      let createdDoc: any = null;

      try {
        // Case 1: BPMCP format with content array containing JSON string
        if (result.content && Array.isArray(result.content)) {
          const contentItem = result.content.find(item => item.type === 'text' && item.text);
          if (contentItem && contentItem.text) {
            createdDoc = JSON.parse(contentItem.text);
            mongoId = createdDoc._id;
            console.log(`${documentType} document created in MongoDB (parsed from content):`, createdDoc);
          }
        }
        // Case 2: Direct document format
        else if (result._id) {
          createdDoc = result;
          mongoId = result._id;
          console.log(`${documentType} document created in MongoDB (direct format):`, createdDoc);
        }
        // Case 3: JSON string
        else if (typeof result === 'string') {
          createdDoc = JSON.parse(result);
          mongoId = createdDoc._id;
          console.log(`${documentType} document created in MongoDB (parsed from string):`, createdDoc);
        }
      } catch (parseError) {
        console.warn(`Error parsing MongoDB ${documentType} document response:`, parseError);
      }

      // Return a merged object with the MongoDB ID and the original document
      if (createdDoc) {
        return {
          id: mongoId,
          ...document,
          documentType,
          crystallizationDate: documentType === 'pratibimba' ? new Date().toISOString() : undefined
        };
      } else {
        // Fallback to just the ID and original document
        return {
          id: mongoId,
          ...document,
          documentType,
          crystallizationDate: documentType === 'pratibimba' ? new Date().toISOString() : undefined
        };
      }
    } catch (error) {
      console.error(`Error creating ${documentType} document in MongoDB:`, error);
      throw error;
    }
  },

  /**
   * Create a new Pratibimba (crystallization) document in MongoDB
   * @param document Pratibimba document data
   * @returns Promise with the created Pratibimba document
   */
  createPratibimbaDocument: async (document: {
    name: string;
    textContent?: string;
    content?: string;
    bimbaId: string;
    sourceSelection: any;
    crystallizationIntent: string;
    bimbaCoordinate?: string;
  }) => {
    // Use the unified createDocumentWithType function with documentType='pratibimba'
    return documentServiceImpl.createDocumentWithType(document, 'pratibimba');
  },

  /**
   * Get all Pratibimba documents from MongoDB
   * @returns Promise with all Pratibimba documents
   */
  getAllPratibimbaDocuments: async () => {
    // Use the unified getAllDocuments function with collection='pratibimbaDocuments'
    return documentServiceImpl.getAllDocuments('pratibimbaDocuments');
  },

  /**
   * Get Pratibimba documents for a specific Bimba document from cache ONLY
   * @param bimbaId The ID of the Bimba document
   * @returns Promise with the Pratibimba documents
   */
  getPratibimbaDocumentsForBimba: async (bimbaId: string) => {
    console.log(`Getting Pratibimba documents for Bimba ${bimbaId} from cache...`);

    // Get all pratibimba documents from cache
    const allPratibimbaDocuments = documentCacheService.getDocumentsByCoordinate('all', 'pratibimbaDocuments');

    // Filter by bimbaId
    const filteredDocuments = allPratibimbaDocuments.filter(doc => doc.bimbaId === bimbaId);

    console.log(`Found ${filteredDocuments.length} Pratibimba documents for Bimba ${bimbaId} in cache`);

    // Return the filtered documents
    return filteredDocuments.map(doc => ({
      ...doc,
      documentType: 'pratibimba'
    }));
  },

  /**
   * Update a Pratibimba document in MongoDB
   * @param pratibimbaId Pratibimba document ID
   * @param updates Document updates
   * @returns Promise with the update result
   */
  updatePratibimbaDocument: async (pratibimbaId: string, updates: {
    content?: string;
    name?: string;
    targetCoordinate?: string;
  }) => {
    // Use the unified updateDocument function with collection='pratibimbaDocuments'
    return documentServiceImpl.updateDocument(pratibimbaId, updates, 'pratibimbaDocuments');
  },

  /**
   * Get a Pratibimba document from MongoDB
   * @param pratibimbaId Pratibimba document ID
   * @returns Promise with the document
   */
  getPratibimbaDocument: async (pratibimbaId: string) => {
    // Use the unified getDocument function with collection='pratibimbaDocuments'
    const doc = await documentServiceImpl.getDocument(pratibimbaId, 'pratibimbaDocuments');
    if (doc) {
      return {
        ...doc,
        documentType: 'pratibimba'
      };
    }
    return null;
  },

  /**
   * Delete a Pratibimba document from MongoDB
   * @param pratibimbaId Pratibimba document ID
   * @returns Promise with the delete result
   */
  deletePratibimbaDocument: async (pratibimbaId: string) => {
    // Use the unified deleteDocument function with collection='pratibimbaDocuments'
    return documentServiceImpl.deleteDocument(pratibimbaId, 'pratibimbaDocuments');
  },


};

// Export both as default and named export for compatibility
export const documentService = documentServiceImpl;
export default documentService;
