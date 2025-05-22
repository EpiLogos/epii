import { Memory } from 'mem0ai/oss'; // Use Memory class and /oss path
import dotenv from 'dotenv';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'; // Corrected import path

// Load environment variables from .env file
dotenv.config();

// Explicitly read the key after dotenv.config()
const openAiApiKeyFromEnv = process.env.OPENAI_API_KEY;
if (!openAiApiKeyFromEnv) {
  console.warn("WARN: OPENAI_API_KEY not found in environment variables!");
}

// Basic configuration for Mem0 Client
const config = {
  llm: { // Revert to OpenAI for internal Mem0 tasks
    provider: 'openai',
    config: {
      apiKey: openAiApiKeyFromEnv, // Use OpenAI key variable
      // model: 'gpt-4-turbo-preview' // Default or specify if needed
    }
  },
  embedder: { // Keep OpenAI Embedder
    provider: 'openai',
    config: {
       apiKey: openAiApiKeyFromEnv, // Use OpenAI key variable
       model: 'text-embedding-3-small' // Specify default model for clarity
    }
  },
  graphStore: {
    provider: 'neo4j',
    config: {
      url: process.env.NEO4J_URI, // Use 'url' instead of 'uri'
      username: process.env.NEO4J_USERNAME,
      password: process.env.NEO4J_PASSWORD,
    },
  },
  vectorStore: {
    provider: 'qdrant',
    config: {
      url: process.env.QDRANT_URL,
      apiKey: process.env.QDRANT_API_KEY,
      collectionName: 'memories', // Explicitly set collection name
      embeddingModelDims: 1536, // Add embedding dimensions
    },
  },
  enableGraph: false, // Disable Graph Memory feature for now
};

let mem0;
try {
  // Initialize Mem0 Client (using Memory class)
  mem0 = new Memory(config); // Use Memory class name
  console.log('Mem0 Client (Memory) initialized with config.'); // Updated log message

  // --- TEMPORARY: Test Search after Initialization ---
  if (mem0) {
    console.log("--- Running Test Search for 'Metasymbol' (epii_universal) ---");
    mem0.search("Metasymbol", { userId: 'epii_universal', limit: 1 })
      .then(results => {
        console.log("Test Search Results:", JSON.stringify(results));
        if (!results || results.length === 0) {
          console.warn("WARN: Test search found no results for Metasymbol under epii_universal.");
        }
      })
      .catch(err => {
        console.error("ERROR during test search:", err);
      });
    console.log("----------------------------------------------------------");
  }
  // --- END TEMPORARY ---

} catch (error) {
  console.error('Error initializing Mem0 (Memory) Client:', error); // Updated log message
  // Handle initialization error appropriately, maybe exit or provide a fallback
  mem0 = null; // Ensure mem0 is null or undefined if initialization fails
}


// Export the client instance (or null if failed) for use in other services/agents
export default mem0;

/**
 * Splits text content into chunks and adds each chunk to Mem0.
 * @param {string} content - The text content to add.
 * @param {object} [metadata={}] - Optional metadata to associate with the memory (will be added to each chunk).
 * @param {string} [userId='default_user'] - Optional user ID.
 * @returns {Promise<boolean>} - True if all chunks were added successfully, false otherwise.
 */
export async function addDocumentToMem0(content, metadata = {}, userId = 'default_user') {
  if (!mem0) {
    console.error('Mem0 client is not initialized. Cannot add document.');
    return false;
  }

  try {
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000, // Adjust chunk size as needed
      chunkOverlap: 100, // Adjust overlap as needed
    });

    const chunks = await splitter.splitText(content);
    console.log(`Splitting content into ${chunks.length} chunks for user: ${userId}`);

    let allSuccessful = true;
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      // Add chunk index and total chunks to metadata for context
      const chunkMetadata = {
        ...metadata,
        chunk_index: i + 1,
        total_chunks: chunks.length,
        // Optionally add original document identifier if available in metadata
        ...(metadata.source && { source_document: metadata.source }),
      };

      try {
        // Assuming mem0.add returns an object with an 'id' on success
        const result = await mem0.add(chunk, {
          userId: userId,
          metadata: chunkMetadata,
        });
        // Log the actual response for info, assume success if no error thrown
        console.log(`Chunk ${i + 1}/${chunks.length} processed by mem0.add. Response:`, JSON.stringify(result));
        // We might need a more robust success check later based on Mem0 behavior.
      } catch (chunkError) { // This catch belongs to the inner try
        console.error(`Error adding chunk ${i + 1}/${chunks.length} to Mem0 for user ${userId}:`, chunkError);
        allSuccessful = false;
        // Decide if you want to stop on first error or try adding all chunks
        // break; // Uncomment to stop on first error
      } // Closing brace for inner try...catch was missing here
    }
    return allSuccessful;

  } catch (error) { // This catch belongs to the outer try
    console.error(`Error processing document for Mem0 addition (user ${userId}):`, error);
    return false;
  } // Correct closing brace for the outer try...catch
}

// --- Initial Universal Context Seeding (Temporary for Setup/Testing) ---
async function seedInitialContext() {
  if (!mem0) {
    console.warn('Mem0 client not initialized, skipping initial context seeding.');
    return;
  }
  const universalUserId = 'epii_universal';
  const metasymbolDescription = 'The integrated symbolic representation of the Epi-Logos system, combining Flower of Life, Compound Eye, Snake, Pinecone, Flower Petals/Torus, and Double Torus elements. Functions as a living architecture and integrative operator.';
  
  // Check if this context already exists for the user to avoid duplicates (basic check)
  // A more robust check might involve searching for specific content or metadata
  try {
    const searchResults = await mem0.search(metasymbolDescription.substring(0, 50), { userId: universalUserId, limit: 1 });
    if (searchResults && searchResults.length > 0 && searchResults[0].memory.includes('integrated symbolic representation')) {
       console.log(`Initial universal context for user '${universalUserId}' seems to exist already. Skipping seeding.`);
       return;
    }
  } catch(searchError) {
      console.error(`Error checking for existing universal context for user '${universalUserId}':`, searchError);
      // Decide whether to proceed with seeding or not
  }

  console.log(`Attempting to seed initial universal context for user: ${universalUserId}`);
  await addDocumentToMem0(
    metasymbolDescription,
    { source: 'system_metasymbol', type: 'core_concept' },
    universalUserId
  );
}

// Call the seeding function - REMOVE or refactor this for production
// seedInitialContext(); // Removed automatic call
// --- End Temporary Seeding ---
