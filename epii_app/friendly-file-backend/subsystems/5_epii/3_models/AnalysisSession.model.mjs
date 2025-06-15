/**
 * MongoDB model for Epii analysis sessions
 */

import mongoose from 'mongoose';

// Define the analysis results schema
const analysisResultsSchema = new mongoose.Schema({
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
}, { _id: false });

// Define the analysis session schema
const analysisSessionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  userId: {
    type: String,
    required: true,
    index: true
  },
  documentId: {
    type: String,
    required: true,
    index: true
  },
  targetCoordinate: {
    type: String,
    required: true,
    index: true
  },
  status: {
    type: String,
    enum: ['pending', 'analyzing', 'complete', 'error'],
    default: 'pending'
  },
  results: {
    type: analysisResultsSchema,
    default: null
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date,
    default: null
  }
}, { timestamps: true });

// Create indexes for efficient querying
analysisSessionSchema.index({ userId: 1, startedAt: -1 });
analysisSessionSchema.index({ documentId: 1, startedAt: -1 });

const AnalysisSession = mongoose.model('AnalysisSession', analysisSessionSchema);

export default AnalysisSession;
