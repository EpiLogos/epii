import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { getDb } from "../../../mongodb/mongo.service.mjs";
import { qdrantClient, QDRANT_COLLECTION_NAME } from "../../../lightrag/qdrant.service.mjs";
// Assuming an embedding function exists, e.g., in google-ai-agent.service.mjs
// We might need to refactor this later if embedding logic is elsewhere.
import { embedText } from "../../services/google-ai-agent.service.mjs"; // Placeholder import
import { randomUUID } from 'crypto'; // For generating unique memory IDs

// --- Get Conversation History Tool ---

const getConversationHistorySchema = z.object({
  userId: z.string().describe("The unique identifier for the user whose history is being requested."),
  // Simplified schema: Removed .int() and .optional()
  limit: z.number().describe("The maximum number of recent messages to return (e.g., 10)."),
  // conversationId: z.string().optional().describe("Optional ID to fetch history for a specific conversation.") // Future enhancement
});

const getConversationHistoryTool = new DynamicStructuredTool({
  name: "getConversationHistory",
  description: "Retrieves the recent conversation history for a specific user.",
  schema: getConversationHistorySchema,
  func: async ({ userId, limit = 10 }) => { // Handle default limit in function
    console.log(`Getting conversation history for user: ${userId}, limit: ${limit}`);
    try {
      const db = await getDb();
      if (!db) return "Error: MongoDB connection not available.";
      const conversationsCollection = db.collection('Conversations');
      // Find the most recent conversation for the user (or implement specific conversation ID logic later)
      // For now, let's assume we just get the latest messages across conversations for simplicity
      // A more robust approach would involve fetching messages from a specific conversationId
      const history = await conversationsCollection.find({ userId })
        .sort({ 'messages.timestamp': -1 }) // Assuming messages have timestamps
        .limit(1) // Get the most recent conversation doc
        .toArray();

      if (!history || history.length === 0 || !history[0].messages) {
        return JSON.stringify([]); // Return empty array if no history found
      }

      // Get the last 'limit' messages from the most recent conversation
      const recentMessages = history[0].messages.slice(-limit);
      return JSON.stringify(recentMessages);

    } catch (error) {
      console.error("Error fetching conversation history:", error);
      return `Error fetching conversation history: ${error.message}`;
    }
  },
});

// --- Get User Context Tool ---

const getUserContextSchema = z.object({
  userId: z.string().describe("The unique identifier for the user whose context is being requested."),
});

const getUserContextTool = new DynamicStructuredTool({
  name: "getUserContext",
  description: "Retrieves the profile information and preferences for a specific user.",
  schema: getUserContextSchema,
  func: async ({ userId }) => {
    console.log(`Getting user context for user: ${userId}`);
    try {
      const db = await getDb();
      if (!db) return "Error: MongoDB connection not available.";
      const usersCollection = db.collection('Users');
      const userContext = await usersCollection.findOne({ userId }); // Assuming userId is the unique key
      return JSON.stringify(userContext || {}); // Return empty object if not found
    } catch (error) {
      console.error("Error fetching user context:", error);
      return `Error fetching user context: ${error.message}`;
    }
  },
});

// --- Manage Memory Tool (Save, Update, Delete) ---

const manageMemorySchema = z.object({
  action: z.enum(['save', 'update', 'delete']).describe("The operation to perform: 'save' a new memory, 'update' an existing one, or 'delete' one."),
  userId: z.string().describe("The unique identifier for the user associated with the memory."),
  memoryId: z.string().optional().describe("The unique ID of the memory to update or delete. Required for 'update' and 'delete' actions."),
  memoryContent: z.string().optional().describe("The textual content of the memory. Required for 'save', optional for 'update' (if not provided, content isn't changed)."),
  memoryContext: z.string().optional().describe("Optional context or tags describing the memory. Used for 'save' and 'update'."),
  // qlTags: z.array(z.string()).optional().describe("Optional QL tags associated with this memory.") // Could be added later for save/update
});

const manageMemoryTool = new DynamicStructuredTool({
  name: "manageMemory",
  description: "Manages user memories. Allows saving new memories, updating existing ones, or deleting them. Embeds content for semantic search.",
  schema: manageMemorySchema,
  func: async ({ action, userId, memoryId, memoryContent, memoryContext }) => {
    console.log(`Managing memory: Action=${action}, UserID=${userId}, MemoryID=${memoryId || 'N/A'}`);
    const db = await getDb();
    if (!db) return "Error: MongoDB connection not available.";
    const userMemoryCollection = db.collection('UserMemory');

    switch (action) {
      case 'save':
        if (!memoryContent) return "Error: 'memoryContent' is required for the 'save' action.";
        if (!embedText) return "Error: Embedding function is not available.";
        if (!qdrantClient) return "Error: Qdrant client is not available.";

        try {
          const embedding = await embedText(memoryContent);
          const newMemoryId = randomUUID();
          const timestamp = new Date();
          const metadata = {
            userId,
            memoryId: newMemoryId,
            timestamp: timestamp.toISOString(),
            source: "natural_language_memorization",
            ...(memoryContext && { context: memoryContext }),
          };

          // Save to MongoDB
          await userMemoryCollection.insertOne({
            _id: newMemoryId, userId, content: memoryContent, embedding, metadata,
          });
          console.log(`Memory saved to MongoDB (ID: ${newMemoryId})`);

          // Save to Qdrant
          await qdrantClient.upsert(QDRANT_COLLECTION_NAME, {
            wait: true, points: [{ id: newMemoryId, vector: embedding, payload: metadata }],
          });
          console.log(`Memory vector saved to Qdrant (ID: ${newMemoryId})`);

          return JSON.stringify({ success: true, memoryId: newMemoryId, message: "Memory saved successfully." });
        } catch (error) {
          console.error("Error saving memory:", error);
          return `Error saving memory: ${error.message}`;
        }

      case 'update':
        if (!memoryId) return "Error: 'memoryId' is required for the 'update' action.";
        if (!embedText) return "Error: Embedding function is not available."; // Needed if content changes
        if (!qdrantClient) return "Error: Qdrant client is not available.";

        try {
          const existingMemory = await userMemoryCollection.findOne({ _id: memoryId, userId });
          if (!existingMemory) return `Error: Memory with ID ${memoryId} not found for user ${userId}.`;

          const updates = {};
          let newEmbedding = existingMemory.embedding;
          let contentChanged = false;

          if (memoryContent && memoryContent !== existingMemory.content) {
            updates.content = memoryContent;
            newEmbedding = await embedText(memoryContent);
            updates.embedding = newEmbedding;
            contentChanged = true;
            console.log(`Memory content updated, re-embedding (ID: ${memoryId})`);
          }
          if (memoryContext !== undefined) updates['metadata.context'] = memoryContext; // Update context within metadata
          updates['metadata.timestamp'] = new Date().toISOString(); // Update timestamp

          if (Object.keys(updates).length === 0 && !contentChanged) {
             return JSON.stringify({ success: true, memoryId: memoryId, message: "No updates provided." });
          }

          // Update MongoDB
          await userMemoryCollection.updateOne({ _id: memoryId, userId }, { $set: updates });
          console.log(`Memory updated in MongoDB (ID: ${memoryId})`);

          // Update Qdrant (Upsert handles create or update)
          const updatedMetadata = { ...existingMemory.metadata, ...updates }; // Merge metadata updates
          await qdrantClient.upsert(QDRANT_COLLECTION_NAME, {
            wait: true, points: [{ id: memoryId, vector: newEmbedding, payload: updatedMetadata }],
          });
           console.log(`Memory vector updated in Qdrant (ID: ${memoryId})`);

          return JSON.stringify({ success: true, memoryId: memoryId, message: "Memory updated successfully." });
        } catch (error) {
          console.error("Error updating memory:", error);
          return `Error updating memory: ${error.message}`;
        }

      case 'delete':
        if (!memoryId) return "Error: 'memoryId' is required for the 'delete' action.";
        if (!qdrantClient) return "Error: Qdrant client is not available.";

        try {
           // Verify ownership before deleting (optional but recommended)
           const existingMemory = await userMemoryCollection.findOne({ _id: memoryId, userId });
           if (!existingMemory) return `Error: Memory with ID ${memoryId} not found for user ${userId}.`;

          // Delete from MongoDB
          const mongoResult = await userMemoryCollection.deleteOne({ _id: memoryId, userId });
          if (mongoResult.deletedCount === 0) {
             console.warn(`Memory potentially already deleted from MongoDB or ownership mismatch (ID: ${memoryId})`);
             // Decide if this is an error or just a warning
          } else {
             console.log(`Memory deleted from MongoDB (ID: ${memoryId})`);
          }


          // Delete from Qdrant
          await qdrantClient.delete(QDRANT_COLLECTION_NAME, {
            wait: true, points: [memoryId],
          });
          console.log(`Memory vector deleted from Qdrant (ID: ${memoryId})`);

          return JSON.stringify({ success: true, memoryId: memoryId, message: "Memory deleted successfully." });
        } catch (error) {
          console.error("Error deleting memory:", error);
          return `Error deleting memory: ${error.message}`;
        }

      default:
        return `Error: Invalid action '${action}'. Must be 'save', 'update', or 'delete'.`;
    }
  },
});

export { getConversationHistoryTool, getUserContextTool, manageMemoryTool }; // Export renamed tool
