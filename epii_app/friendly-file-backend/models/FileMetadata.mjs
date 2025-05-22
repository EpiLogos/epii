import mongoose from 'mongoose';

// Define FileMetadata schema
const FileMetadataSchema = new mongoose.Schema({
  originalName: { type: String, required: true },
  fileName: { type: String, required: true },
  mimeType: { type: String, required: true },
  size: { type: Number, required: true },
  path: { type: String, required: true },
  uploadDate: { type: Date, default: Date.now },
  userId: { type: String, default: 'anonymous' },
  targetCoordinate: { type: String, default: null },
  textContent: { type: String, default: null },
  notionPageId: { type: String, default: null },
  analysisStatus: { type: String, enum: ['pending', 'processing', 'completed', 'failed'], default: 'pending' },
  analysisResults: { type: mongoose.Schema.Types.Mixed, default: null }
}, {
  timestamps: true
});

// Create and export the model
// The third argument 'file_metadata' specifies the collection name
const FileMetadata = mongoose.model('FileMetadata', FileMetadataSchema, 'file_metadata');

export default FileMetadata;
