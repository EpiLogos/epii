/**
 * MongoDB model for Epii documents
 *
 * This model supports both raw documents (bimba) and crystallization documents (pratibimba)
 */

import mongoose from 'mongoose';

// Define the document metadata schema
const documentMetadataSchema = new mongoose.Schema({
  // Original document reference (for crystallization documents)
  originalDocumentId: {
    type: String,
    index: true
  },
  originalTitle: String,

  // Crystallization references (for original documents)
  crystallizations: [{
    crystallizationId: String,
    title: String,
    targetCoordinate: String,
    createdAt: Date
  }],

  // Analysis information
  analysisStatus: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  analysisResults: {
    extractedMappings: [{
      mappingType: String,
      mappingValue: String,
      reasoning: String
    }],
    identifiedVariations: [{
      variationType: String,
      status: String,
      variationText: String
    }],
    overallSummary: String,
    notionUpdatePayload: mongoose.Schema.Types.Mixed
  },

  // Notion integration
  notionReference: {
    updated: {
      type: Boolean,
      default: false
    },
    updateDate: Date,
    notionPageId: String,
    status: {
      type: String,
      enum: ['draft', 'synced', 'failed'],
      default: 'draft'
    }
  },

  // Bimba coordinates
  relatedCoordinates: [String],

  // Crystallization specific fields
  crystallizationDate: Date,
  crystallizationIntent: String,
  sourceSelection: {
    start: Number,
    end: Number,
    text: String
  },

  // Notion update payload (structured data for crystallization)
  notionUpdatePayload: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },

  // Status information
  status: {
    type: String,
    enum: ['draft', 'analyzed', 'ready_for_notion', 'sent_to_notion', 'deprecated'],
    default: 'draft'
  },

  // Version control metadata
  versionControl: {
    versionNumber: {
      type: Number,
      default: 1
    },
    previousVersions: [{
      documentId: String,
      versionNumber: Number,
      createdAt: Date
    }],
    supersededBy: {
      documentId: String,
      versionNumber: Number,
      createdAt: Date
    },
    isDeprecated: {
      type: Boolean,
      default: false
    },
    deprecationDate: Date,
    isLatestForCoordinate: {
      type: Boolean,
      default: true
    }
  },

  // LightRAG integration metadata
  lightRagMetadata: {
    ingestionDate: Date,
    chunkIds: [String],
    ingestionStatus: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'deprecated', 'skipped'],
      default: 'pending'
    },
    targetCoordinate: String,
    contentHash: String, // SHA256 hash of content + targetCoordinate for duplicate detection
    totalChunks: Number,
    processedCount: Number,
    errorCount: Number
  }
}, { _id: false });

// Define the document schema
const documentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  textContent: {
    type: String,
    required: true
  },
  // DEPRECATED: content field is kept for backward compatibility only - DO NOT USE
  // Use textContent instead. This field will be removed in future versions.
  content: {
    type: String,
    required: false,
    deprecated: true
  },
  userId: {
    type: String,
    required: true,
    index: true
  },
  documentType: {
    type: String,
    enum: ['bimba', 'pratibimba'],
    required: true,
    index: true
  },
  originalName: String,
  fileName: String,
  mimeType: {
    type: String,
    default: 'text/plain'
  },
  size: Number,
  uploadDate: {
    type: Date,
    default: Date.now
  },
  lastModified: {
    type: Date,
    default: Date.now
  },
  // Top-level target coordinate for efficient querying and caching
  targetCoordinate: {
    type: String,
    index: true,
    default: null
  },
  metadata: {
    type: documentMetadataSchema,
    default: {}
  }
}, { timestamps: true });

// Create indexes for efficient querying
documentSchema.index({ userId: 1, documentType: 1, createdAt: -1 });

const Document = mongoose.model('Document', documentSchema);

export default Document;
