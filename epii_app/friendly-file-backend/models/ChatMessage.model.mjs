/**
 * MongoDB model for Epii chat messages
 */

import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema({
  messageId: {
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
  analysisSessionId: {
    type: String,
    required: true,
    index: true
  },
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Create indexes for efficient querying
chatMessageSchema.index({ analysisSessionId: 1, timestamp: 1 });
chatMessageSchema.index({ userId: 1, timestamp: -1 });

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

export default ChatMessage;
