import mongoose from 'mongoose';

const userMemorySchema = new mongoose.Schema({
  // Using default MongoDB ObjectId for _id, but keeping memoryId in metadata for Qdrant link
  userId: {
    type: String,
    required: true,
    index: true,
  },
  content: {
    type: String,
    required: true,
  },
  embedding: {
    type: [Number], // Array of numbers for the vector
    required: true,
    // Note: Indexing embeddings directly in MongoDB is usually inefficient for similarity search.
    // Qdrant is used for that purpose. We store it here for completeness or potential future use.
  },
  metadata: {
    memoryId: { type: String, required: true, unique: true, index: true }, // Link to Qdrant point ID
    timestamp: { type: String, required: true }, // ISO String timestamp
    source: { type: String, required: true }, // e.g., 'natural_language_memorization', 'ingestion_pipeline'
    context: { type: String }, // Optional context provided by user or tool
    ql_tags: { type: [String], index: true }, // Optional QL tags
    // Add other relevant metadata fields as needed
  },
  createdAt: { // Redundant due to timestamps: true, but kept for clarity from previous model
    type: Date,
    default: Date.now,
  },
  updatedAt: { // Redundant due to timestamps: true
    type: Date,
    default: Date.now,
  }
}, { timestamps: true }); // Automatically manage createdAt and updatedAt

// Indexing for potential retrieval by user or metadata fields
userMemorySchema.index({ userId: 1, 'metadata.timestamp': -1 });
userMemorySchema.index({ userId: 1, 'metadata.ql_tags': 1 });

const UserMemory = mongoose.model('UserMemory', userMemorySchema);

export default UserMemory;
