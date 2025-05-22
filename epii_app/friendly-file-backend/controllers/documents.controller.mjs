import bpMCPService from '../services/bpMCPService.mjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { extractTextFromFile } from '../services/file.service.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADS_DIR = path.join(__dirname, '../uploads/');

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

/**
 * List all documents
 */
export const listDocuments = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const documents = await bpMCPService.listAllDocuments(limit);
    res.status(200).json({ documents });
  } catch (error) {
    console.error('Error listing documents:', error);
    res.status(500).json({ message: 'Failed to list documents', error: error.message });
  }
};

/**
 * List documents by Bimba coordinate
 */
export const listDocumentsByCoordinate = async (req, res) => {
  try {
    const { coordinate } = req.params;

    // Find documents with the specified targetCoordinate
    const documents = await bpMCPService.listDocumentsByCoordinate(coordinate);

    res.status(200).json({ documents });
  } catch (error) {
    console.error(`Error listing documents for coordinate ${req.params.coordinate}:`, error);
    res.status(500).json({ message: 'Failed to list documents by coordinate', error: error.message });
  }
};

/**
 * Upload a document with optional Bimba coordinate
 */
export const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { originalname, filename, mimetype, size, path: filePath } = req.file;
    const { targetCoordinate, userId } = req.body;

    // Extract text content from the file
    const textContent = await extractTextFromFile(filePath, mimetype);

    // Create document object
    const document = {
      originalName: originalname,
      fileName: filename,
      title: originalname, // Explicitly set title field to match the schema
      mimeType: mimetype,
      size,
      path: filePath,
      uploadDate: new Date(),
      targetCoordinate: targetCoordinate || null,
      userId: userId || 'anonymous',
      textContent: textContent || null,
      analysisStatus: 'pending'
    };

    // Store document using BPMCP service
    const result = await bpMCPService.storeDocument(document);

    res.status(201).json({
      message: 'Document uploaded successfully',
      document: {
        id: result._id || result.id,
        originalName: document.originalName,
        fileName: document.fileName,
        mimeType: document.mimeType,
        size: document.size,
        uploadDate: document.uploadDate,
        targetCoordinate: document.targetCoordinate,
        contentLength: textContent ? textContent.length : 0,
        analysisStatus: document.analysisStatus
      }
    });
  } catch (error) {
    console.error('Error uploading document:', error);
    res.status(500).json({ message: 'Failed to upload document', error: error.message });
  }
};

/**
 * Get a document by ID
 */
export const getDocument = async (req, res) => {
  try {
    const { id } = req.params;

    console.log(`API: Getting document by ID: ${id}`);

    // Find document by ID
    try {
      const result = await bpMCPService.callTool('getDocumentById', {
        documentId: id
      });

      // Process the result
      let document = null;

      // Case 1: Array of documents (standard format)
      if (Array.isArray(result) && result.length > 0) {
        document = result[0];
      }
      // Case 2: Direct document object
      else if (result && typeof result === 'object' && result._id) {
        document = result;
      }
      // Case 3: BPMCP format with content array containing JSON string
      else if (result && result.content && Array.isArray(result.content)) {
        try {
          const contentItem = result.content.find(item => item.type === 'text' && item.text);
          if (contentItem && contentItem.text) {
            const parsedDoc = JSON.parse(contentItem.text);
            if (Array.isArray(parsedDoc) && parsedDoc.length > 0) {
              document = parsedDoc[0];
            } else if (parsedDoc && typeof parsedDoc === 'object') {
              document = parsedDoc;
            }
          }
        } catch (parseError) {
          console.error(`API: Error parsing BPMCP response: ${parseError.message}`);
        }
      }

      if (!document) {
        console.warn(`API: Document not found: ${id}`);
        return res.status(404).json({ message: 'Document not found' });
      }

      // Get content length from any available content property
      const contentLength =
        document.content?.length ||
        document.textContent?.length ||
        document.text?.length ||
        document.rawContent?.length ||
        document.raw?.length ||
        0;

      console.log(`API: Document found: ${id}, content length: ${contentLength}`);
      res.status(200).json({ document });
    } catch (error) {
      console.error(`API: Error getting document: ${error.message}`);
      res.status(500).json({ message: 'Failed to get document', error: error.message });
    }
  } catch (error) {
    console.error(`Error getting document ${req.params.id}:`, error);
    res.status(500).json({ message: 'Failed to get document', error: error.message });
  }
};

/**
 * Update a document's Bimba coordinate
 */
export const updateDocumentCoordinate = async (req, res) => {
  try {
    const { id } = req.params;
    const { targetCoordinate } = req.body;

    // Update document coordinate using BPMCP service
    const result = await bpMCPService.callTool('updateDocument', {
      documentId: id,
      update: {
        $set: {
          targetCoordinate: targetCoordinate,
          lastModified: new Date()
        }
      }
    });

    // Parse the result from the BPMCP service
    let parsedResult;
    try {
      // The result is returned as a string in the content field
      const resultText = result.content[0].text;
      parsedResult = JSON.parse(resultText);
    } catch (parseError) {
      console.error('Error parsing BPMCP result:', parseError);
      return res.status(500).json({ message: 'Failed to parse BPMCP result', error: parseError.message });
    }

    if (!parsedResult || parsedResult.error) {
      return res.status(404).json({ message: 'Document not found', error: parsedResult?.error });
    }

    res.status(200).json({
      message: 'Document coordinate updated successfully',
      document: parsedResult
    });
  } catch (error) {
    console.error(`Error updating document coordinate for ${req.params.id}:`, error);
    res.status(500).json({ message: 'Failed to update document coordinate', error: error.message });
  }
};

/**
 * Delete a document
 */
export const deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;

    // Get document to check if it exists and get the file path
    const documents = await bpMCPService.getDocumentById(id);

    if (!documents || documents.length === 0) {
      return res.status(404).json({ message: 'Document not found' });
    }

    const document = documents[0];

    // Delete the file from disk if it exists
    if (document.path && fs.existsSync(document.path)) {
      fs.unlinkSync(document.path);
    }

    // Delete the document from the database
    await bpMCPService.deleteDocument(id);

    res.status(200).json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error(`Error deleting document ${req.params.id}:`, error);
    res.status(500).json({ message: 'Failed to delete document', error: error.message });
  }
};

/**
 * Start document analysis
 */
export const startDocumentAnalysis = async (req, res) => {
  try {
    const { id } = req.params;
    const { targetCoordinate, graphData } = req.body;

    // Get document to check if it exists
    const documents = await bpMCPService.getDocumentById(id);

    if (!documents || documents.length === 0) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Start analysis with graphData if provided
    const result = await bpMCPService.startDocumentAnalysis(
      id,
      targetCoordinate,
      graphData || { nodes: [], edges: [] }
    );

    // Get updated document
    const updatedDocuments = await bpMCPService.getDocumentById(id);

    res.status(200).json({
      message: 'Document analysis started',
      document: updatedDocuments[0]
    });
  } catch (error) {
    console.error(`Error starting document analysis ${req.params.id}:`, error);
    res.status(500).json({ message: 'Failed to start document analysis', error: error.message });
  }
};

/**
 * Update a document's content
 */
export const updateDocumentContent = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }

    // Create a new version with the updated content - only use textContent
    const update = {
      $set: {
        textContent: content,
        lastModified: new Date()
      },
      $push: {
        versions: {
          timestamp: new Date(),
          textContent: content // Use textContent consistently, not content
        }
      }
    };

    // Update document using BPMCP service
    const result = await bpMCPService.callTool('updateDocument', {
      documentId: id,
      update: update
    });

    // Parse the result from the BPMCP service
    let parsedResult;
    try {
      // The result is returned as a string in the content field
      const resultText = result.content[0].text;
      parsedResult = JSON.parse(resultText);
    } catch (parseError) {
      console.error('Error parsing BPMCP result:', parseError);
      return res.status(500).json({ message: 'Failed to parse BPMCP result', error: parseError.message });
    }

    if (!parsedResult || parsedResult.error) {
      return res.status(404).json({ message: 'Document not found', error: parsedResult?.error });
    }

    res.status(200).json({
      message: 'Document content updated successfully',
      document: parsedResult
    });
  } catch (error) {
    console.error(`Error updating document content for ${req.params.id}:`, error);
    res.status(500).json({ message: 'Failed to update document content', error: error.message });
  }
};
