import mongoose from 'mongoose';

// Schema for active files with content, used for chat context
const ActiveFileSchema = new mongoose.Schema({
  filename: String,
  contentType: String,
  content: String, // Extracted text content
  gridFsId: { type: mongoose.Schema.Types.ObjectId, required: true }, // Link to GridFS file
  createdAt: { type: Date, default: Date.now }
});

// Create and export the model
const ActiveFile = mongoose.model('ActiveFile', ActiveFileSchema);

export default ActiveFile;
