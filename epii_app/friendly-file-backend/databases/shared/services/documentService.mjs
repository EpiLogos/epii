/**
 * Document service for direct MongoDB access
 * This service provides methods for accessing documents directly from MongoDB
 * without going through the BPMCP WebSocket service
 */

import { MongoClient, ObjectId } from 'mongodb';


// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.MONGODB_DB_NAME || 'bpmcp';
const COLLECTION_NAME = 'Documents'; // Capitalized to match BPMCP service

class DocumentService {
  /**
   * Get a document by ID
   * @param {string} documentId - Document ID
   * @returns {Promise<object|null>} - Document data or null if not found
   */
  async getDocumentById(documentId) {
    console.log(`[DocumentService] Getting document by ID: ${documentId}`);

    const client = new MongoClient(MONGODB_URI);

    try {
      await client.connect();
      const db = client.db(DB_NAME);
      const collection = db.collection(COLLECTION_NAME);

      // Try multiple approaches to find the document
      let doc = null;

      // 1. Try with the ID as is
      try {
        doc = await collection.findOne({ _id: documentId });
        if (doc) {
          console.log(`[DocumentService] Found document with string ID: ${documentId}`);
        }
      } catch (error) {
        console.warn(`[DocumentService] Error finding document with string ID: ${error.message}`);
      }

      // 2. Try with ObjectId
      if (!doc) {
        try {
          doc = await collection.findOne({ _id: new ObjectId(documentId) });
          if (doc) {
            console.log(`[DocumentService] Found document with ObjectId: ${documentId}`);
          }
        } catch (objectIdError) {
          console.warn(`[DocumentService] Error finding document with ObjectId: ${objectIdError.message}`);
        }
      }

      // 3. Try with a string ID that might be an ObjectId string
      if (!doc) {
        try {
          doc = await collection.findOne({ "_id": { "$eq": documentId } });
          if (doc) {
            console.log(`[DocumentService] Found document with $eq operator: ${documentId}`);
          }
        } catch (error) {
          console.warn(`[DocumentService] Error finding document with $eq: ${error.message}`);
        }
      }

      // 4. Try searching by other fields if we have them
      if (!doc) {
        try {
          const recentDocs = await collection.find({}).sort({ uploadDate: -1 }).limit(5).toArray();
          console.log(`[DocumentService] Recent documents in MongoDB:`, recentDocs.map(d => ({
            _id: d._id.toString(),
            name: d.fileName || d.originalName,
            size: d.size
          })));
        } catch (error) {
          console.warn(`[DocumentService] Error listing recent documents: ${error.message}`);
        }
      }

      if (doc) {
        console.log(`[DocumentService] Retrieved document content: ${doc.textContent ? doc.textContent.substring(0, 50) + '...' : 'No content'}`);
        return doc;
      } else {
        console.warn(`[DocumentService] Document not found: ${documentId}`);
        return null;
      }
    } finally {
      await client.close();
    }
  }

  /**
   * Update a document
   * @param {string} documentId - Document ID
   * @param {object} update - MongoDB update operation
   * @param {boolean} handleVersioning - Whether to handle versioning (default: true)
   * @returns {Promise<object>} - Update result
   */
  async updateDocument(documentId, update, handleVersioning = true) {
    console.log(`[DocumentService] Updating document: ${documentId}`);

    const client = new MongoClient(MONGODB_URI);

    try {
      await client.connect();
      const db = client.db(DB_NAME);
      const collection = db.collection(COLLECTION_NAME);

      // Try to convert to ObjectId if possible
      let id;
      try {
        id = new ObjectId(documentId);
      } catch (error) {
        id = documentId;
      }

      // If we're handling versioning, get the current document first
      if (handleVersioning) {
        const currentDoc = await collection.findOne({ _id: id });

        if (currentDoc) {
          // Get the current version number
          const currentVersion = currentDoc.metadata?.versionControl?.versionNumber || 1;

          // If this is a content update, increment the version number
          if (update.$set && (update.$set.textContent || update.$set.content)) {
            // Ensure versionControl exists in the update
            if (!update.$set['metadata.versionControl']) {
              update.$set['metadata.versionControl'] = {};
            }

            // Increment version number
            update.$set['metadata.versionControl.versionNumber'] = currentVersion + 1;

            // Update timestamp
            update.$set['metadata.versionControl.lastUpdated'] = new Date();

            // Mark as latest for coordinate
            update.$set['metadata.versionControl.isLatestForCoordinate'] = true;

            console.log(`[DocumentService] Incrementing version number to ${currentVersion + 1}`);
          }
        }
      }

      const result = await collection.updateOne({ _id: id }, update);

      if (result.matchedCount === 0) {
        console.warn(`[DocumentService] No document matched for update: ${documentId}`);
      } else {
        console.log(`[DocumentService] Document updated successfully: ${documentId}`);

        // If we're handling versioning and this is a content update, check for other documents with the same coordinate
        if (handleVersioning && update.$set && (update.$set.textContent || update.$set.content) && update.$set['metadata.targetCoordinate']) {
          const targetCoordinate = update.$set['metadata.targetCoordinate'];

          // Find other documents with the same coordinate
          const otherDocs = await collection.find({
            _id: { $ne: id },
            'metadata.targetCoordinate': targetCoordinate,
            'metadata.versionControl.isDeprecated': { $ne: true }
          }).toArray();

          if (otherDocs.length > 0) {
            console.log(`[DocumentService] Found ${otherDocs.length} other documents with coordinate ${targetCoordinate}`);

            // Mark other documents as not latest for this coordinate
            for (const doc of otherDocs) {
              await collection.updateOne(
                { _id: doc._id },
                {
                  $set: {
                    'metadata.versionControl.isLatestForCoordinate': false
                  }
                }
              );
            }
          }
        }
      }

      return result;
    } finally {
      await client.close();
    }
  }

  /**
   * Deprecate a document
   * @param {string} documentId - Document ID to deprecate
   * @param {string} supersededById - ID of the document that supersedes this one
   * @returns {Promise<object>} - Update result
   */
  async deprecateDocument(documentId, supersededById) {
    console.log(`[DocumentService] Deprecating document: ${documentId}, superseded by: ${supersededById}`);

    const client = new MongoClient(MONGODB_URI);

    try {
      await client.connect();
      const db = client.db(DB_NAME);
      const collection = db.collection(COLLECTION_NAME);

      // Try to convert to ObjectId if possible
      let id, supersededId;
      try {
        id = new ObjectId(documentId);
      } catch (error) {
        id = documentId;
      }

      try {
        supersededId = new ObjectId(supersededById);
      } catch (error) {
        supersededId = supersededById;
      }

      // Get the superseding document to get its version number
      const supersedingDoc = await collection.findOne({ _id: supersededId });
      if (!supersedingDoc) {
        console.warn(`[DocumentService] Superseding document not found: ${supersededById}`);
        return { acknowledged: false, reason: 'Superseding document not found' };
      }

      const supersedingVersion = supersedingDoc.metadata?.versionControl?.versionNumber || 1;

      // Update the document to mark it as deprecated
      const result = await collection.updateOne(
        { _id: id },
        {
          $set: {
            'metadata.status': 'deprecated',
            'metadata.versionControl.isDeprecated': true,
            'metadata.versionControl.deprecationDate': new Date(),
            'metadata.versionControl.isLatestForCoordinate': false,
            'metadata.versionControl.supersededBy': {
              documentId: supersededById,
              versionNumber: supersedingVersion,
              createdAt: new Date()
            },
            'metadata.lightRagMetadata.ingestionStatus': 'deprecated'
          }
        }
      );

      if (result.matchedCount === 0) {
        console.warn(`[DocumentService] No document matched for deprecation: ${documentId}`);
      } else {
        console.log(`[DocumentService] Document deprecated successfully: ${documentId}`);
      }

      return result;
    } finally {
      await client.close();
    }
  }
}

// Export singleton instance
export default new DocumentService();
