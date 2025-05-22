import mongoose from 'mongoose';

// Define a schema for individual messages (aligning with LangChain structure)
const messageSchema = new mongoose.Schema({
  type: { type: String, required: true, enum: ['human', 'ai', 'system', 'tool', 'function'] }, // LangChain message types
  content: { type: String }, // For human, ai, system messages
  // For tool/function calls/results:
  tool_call_id: { type: String },
  name: { type: String }, // Tool/function name
  args: { type: mongoose.Schema.Types.Mixed }, // Arguments for function call
  // Additional fields like 'tool_calls' for AIMessage might be needed depending on exact storage strategy
  // Storing the raw LangChain object might be simpler if complex structures are common
  // For simplicity now, focusing on basic text/tool call info
  timestamp: { type: Date, default: Date.now } // Add timestamp to messages
}, { _id: false }); // Don't create separate _id for subdocuments

const conversationSchema = new mongoose.Schema({
  conversationId: {
    type: String,
    required: true,
    unique: true,
    index: true,
    default: () => new mongoose.Types.ObjectId().toString() // Generate default ID
  },
  userId: {
    type: String,
    required: true,
    index: true,
  },
  messages: [messageSchema], // Array of messages
  currentState: { // To store context like active QL frame, etc.
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
}, { timestamps: true }); // Automatically manage createdAt and updatedAt

// Indexing for efficient history retrieval
conversationSchema.index({ userId: 1, updatedAt: -1 });

const Conversation = mongoose.model('Conversation', conversationSchema);

export default Conversation;
