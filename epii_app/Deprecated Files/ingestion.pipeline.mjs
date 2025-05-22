import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
// import { embedText } from "../services/google-ai-agent.service.mjs"; // No longer needed here
// import { qdrantClient, QDRANT_COLLECTION_NAME } from "../services/qdrant.service.mjs"; // Qdrant client interaction moved to Python server
// import { getDb } from "../services/mongo.service.mjs"; // Mongo interaction moved to Python server (potentially)
import { randomUUID } from 'crypto'; // Keep for potential use? Or remove if Python handles IDs
import { notionClient, NOTION_DATABASE_ID } from '../services/notion.service.mjs'; // For fetching coordinate map
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"; // For LLM tagging
import { HumanMessage } from "@langchain/core/messages";
import dotenv from 'dotenv';
import axios from 'axios'; // Import axios for calling Python server

dotenv.config({ path: './.env' }); // Ensure env vars are loaded

console.log("Starting Data Ingestion Pipeline...");

// Define vector size from environment variable (should match Qdrant collection setup)
const VECTOR_SIZE = parseInt(process.env.QDRANT_VECTOR_SIZE || '768', 10); // Default to 768 if not set

// --- LLM for Tagging ---
// Initialize a separate LLM instance or reuse one if appropriate
const taggingLlm = new ChatGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_API_KEY,
    model: process.env.TAGGING_LLM_MODEL || "gemini-1.5-flash",
    temperature: 0.125, // Lower temperature for more deterministic tagging
});

// --- Bimba Coordinate Map Cache ---
let bimbaCoordinateMapCache = null; // Simple cache
let cacheTimestamp = null;
const CACHE_DURATION_MS = 10 * 60 * 1000; // Cache for 10 minutes

// Specific Page ID where the Bimba Coordinate Map resides
const BIMBA_COORDINATE_MAP_PAGE_ID = "1caa4797-123c-8034-adb3-d422639bfa9d";
const BIMBA_MAP_HEADING_TEXT = "#Bimba Map"; // The heading text to look for

async function getBimbaCoordinateMap() {
    const now = Date.now();
    if (bimbaCoordinateMapCache && cacheTimestamp && (now - cacheTimestamp < CACHE_DURATION_MS)) {
        console.log("Using cached Bimba coordinate map.");
        return bimbaCoordinateMapCache;
    }

    console.log("Fetching Bimba coordinate map from Notion page:", BIMBA_COORDINATE_MAP_PAGE_ID);
    if (!notionClient) {
        console.error("Notion client not configured.");
        return null;
    }

    try {
        // Fetch all blocks from the specific page
        let allBlocks = [];
        let nextCursor = undefined;
        do {
            const response = await notionClient.blocks.children.list({
                block_id: BIMBA_COORDINATE_MAP_PAGE_ID,
                start_cursor: nextCursor,
            });
            allBlocks = allBlocks.concat(response.results);
            nextCursor = response.next_cursor;
        } while (nextCursor);

        // Find the index of the heading block
        const headingIndex = allBlocks.findIndex(block =>
            (block.type === 'heading_1' || block.type === 'heading_2' || block.type === 'heading_3') &&
            block[block.type]?.rich_text[0]?.plain_text?.trim() === BIMBA_MAP_HEADING_TEXT
        );

        if (headingIndex === -1) {
            console.error(`Heading "${BIMBA_MAP_HEADING_TEXT}" not found on page ${BIMBA_COORDINATE_MAP_PAGE_ID}.`);
            return null;
        }

        // Get the block immediately after the heading
        const mapBlock = allBlocks[headingIndex + 1];

        if (!mapBlock) {
            console.error(`No block found after the heading "${BIMBA_MAP_HEADING_TEXT}".`);
            return null;
        }

        // Extract and parse text content from the map block
        let rawMapText = "";
        if (mapBlock.type === 'paragraph' && mapBlock.paragraph?.rich_text.length > 0) {
            rawMapText = mapBlock.paragraph.rich_text.map(rt => rt.plain_text).join('');
        } else if (mapBlock.type === 'code' && mapBlock.code?.rich_text.length > 0) {
             rawMapText = mapBlock.code.rich_text.map(rt => rt.plain_text).join('');
        } else {
             console.warn(`Map block after heading is not a recognized text type (e.g., paragraph, code). Block type: ${mapBlock.type}. Attempting fallback text extraction.`);
             // Fallback: try to extract any plain text content
             try {
                 // This fallback might be fragile depending on Notion block structure
                 const plainTexts = [];
                 const extractText = (obj) => {
                     if (obj && typeof obj === 'object') {
                         if (obj.plain_text && typeof obj.plain_text === 'string') {
                             plainTexts.push(obj.plain_text);
                         }
                         Object.values(obj).forEach(extractText);
                     } else if (Array.isArray(obj)) {
                         obj.forEach(extractText);
                     }
                 };
                 extractText(mapBlock);
                 rawMapText = plainTexts.join('\n');
             } catch (_) {
                rawMapText = '';
             }
        }

        if (!rawMapText.trim()) {
             console.error("The block after the heading appears empty or could not be parsed for map content.");
             return null;
        }

        // Parse the raw text into a structured format or a formatted string for the prompt
        // Assuming format: "#Coord_ID: Node_Name; (Type) - Description" per line
        const coordinateMapLines = rawMapText.split('\n');
        const parsedMapEntries = [];
        // Regex to capture the coordinate ID and the rest of the line
        const coordinateLineRegex = /^(#[\w.-]+):(.*)$/;

        for (const line of coordinateMapLines) {
            const trimmedLine = line.trim();
            const match = trimmedLine.match(coordinateLineRegex);
            if (match) {
                 // Keep the line format "#Coord_ID: Rest of description" for the LLM prompt
                 parsedMapEntries.push(trimmedLine);
            } else if (trimmedLine.length > 0 && !trimmedLine.startsWith('//')) {
                // Log lines that don't match the expected format (ignoring comments)
                console.warn(`[Ingestion] Skipping non-coordinate line in Notion map: "${trimmedLine}"`);
            }
        }

        if (parsedMapEntries.length === 0) {
            console.error("No valid coordinate entries found in the Notion map block content. Ensure lines start with #Coord_ID:");
            return null;
        }

        // Store the parsed map as a formatted string for the LLM prompt
        bimbaCoordinateMapCache = parsedMapEntries.join('\n');
        cacheTimestamp = now;
        console.log("Successfully fetched and cached Bimba coordinate map.");
        return bimbaCoordinateMapCache;
    } catch (error) {
        console.error("Error fetching Bimba coordinate map from Notion:", error.body || error);
        return null;
    }
}

// --- Configuration ---
const SOURCE_DIRECTORY = process.env.INGESTION_SOURCE_DIR || './data_to_ingest'; // Define where source files are
const CHUNK_SIZE = 1000;
const CHUNK_OVERLAP = 150;
const MONGO_COLLECTION_NAME = 'IngestedData'; // This might become irrelevant if Python handles all storage

// --- Configuration for Python Server ---
const LIGHTRAG_INGEST_URL = `${process.env.LIGHTRAG_MCP_SERVER_URL || "http://localhost:8001"}/ingest`;

// --- 1. Load Documents ---
async function loadDocuments(directoryPath) {
  console.log(`Loading documents from: ${directoryPath}`);
  try {
    const loader = new DirectoryLoader(
      directoryPath,
      {
        ".txt": (path) => new TextLoader(path),
        ".md": (path) => new TextLoader(path),
        // Add other loaders as needed (e.g., JSONLoader, CSVLoader)
      },
      true // Recursive
    );
    const docs = await loader.load();
    console.log(`Loaded ${docs.length} documents.`);
    return docs;
  } catch (error) {
    console.error("Error loading documents:", error);
    return [];
  }
}

// --- 2. Chunk Documents ---
async function chunkDocuments(docs) {
  console.log("Chunking documents...");
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: CHUNK_SIZE,
    chunkOverlap: CHUNK_OVERLAP,
  });
  // Ensure docs is always an array for splitDocuments
  const chunks = await textSplitter.splitDocuments(Array.isArray(docs) ? docs : [docs]);
  console.log(`Split into ${chunks.length} chunks.`);
  return chunks;
}

// --- Chat Log Parsing & Chunking ---
async function parseAndChunkChatLog(doc) {
    console.log(`Parsing and chunking chat log: ${doc.metadata?.source}`);
    const content = doc.pageContent;
    const finalChunks = [];
    // Regex to find speaker labels at the start of a line, followed by content.
    // It captures the speaker label (group 1) and the subsequent text (group 2).
    // It looks ahead to stop before the next speaker label or the end of the string.
    const turnRegex = /^(user said:|chatgpt said:)\s*([\s\S]*?)(?=\n^(?:user said:|chatgpt said:)|$)/gim;
    let match;
    let lastIndex = 0;
    let turnIndex = 0;

    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: CHUNK_SIZE,
        chunkOverlap: CHUNK_OVERLAP,
        // Keep paragraph breaks for potentially better semantic chunking within turns
        // separators: ["\n\n", "\n", " ", ""],
    });

    // Iterate through matches
    while ((match = turnRegex.exec(content)) !== null) {
        // --- Handle text BEFORE the current speaker label ---
        const precedingText = content.substring(lastIndex, match.index).trim();
        if (precedingText) {
            console.warn(`[Ingestion] Found unparsed text before turn ${turnIndex}, chunking with speaker N/A: "${precedingText.substring(0, 50)}..."`);
            const fallbackChunks = await textSplitter.createDocuments([precedingText], [{ ...doc.metadata, speaker: 'N/A', turnIndex: turnIndex - 0.5 }]); // Pass metadata to splitter
            finalChunks.push(...fallbackChunks.map(fc => ({ pageContent: fc.pageContent, metadata: fc.metadata }))); // Adapt to expected format
        }

        // --- Process the current speaker's turn ---
        const speakerLabel = match[1].toLowerCase();
        const turnContent = match[2].trim();
        const speaker = speakerLabel.startsWith('user') ? 'user' : 'ai';

        if (turnContent) {
            // Chunk this turn's content
            const turnDocs = await textSplitter.createDocuments([turnContent], [{ ...doc.metadata, speaker: speaker, turnIndex: turnIndex }]);
            turnDocs.forEach((turnDoc, chunkIndex) => {
                 // Add chunk index within the turn for ordering
                 turnDoc.metadata.chunkInTurnIndex = chunkIndex;
                 finalChunks.push({ pageContent: turnDoc.pageContent, metadata: turnDoc.metadata });
            });
        } else {
            console.log(`[Ingestion] Skipping empty turn ${turnIndex} for speaker ${speaker}.`);
        }

        turnIndex++;
        lastIndex = turnRegex.lastIndex; // Update position for next search/substring
    }

     // --- Handle any text AFTER the last speaker label ---
     const remainingText = content.substring(lastIndex).trim();
     if (remainingText) {
         console.warn(`[Ingestion] Found unparsed text after last turn, chunking with speaker N/A: "${remainingText.substring(0, 50)}..."`);
         const fallbackChunks = await textSplitter.createDocuments([remainingText], [{ ...doc.metadata, speaker: 'N/A', turnIndex: turnIndex - 0.5 }]);
         finalChunks.push(...fallbackChunks.map(fc => ({ pageContent: fc.pageContent, metadata: fc.metadata })));
     }


    // --- Fallback if NO turns were parsed at all ---
    if (finalChunks.length === 0 && content.length > 0) {
        console.warn(`[Ingestion] Could not parse any turns in ${doc.metadata?.source}. Applying default chunking with speaker N/A.`);
        // Use chunkDocuments which handles metadata merging
        const fallbackChunks = await chunkDocuments([doc]); // Pass doc as array
        // Ensure speaker is set correctly in the fallback
         fallbackChunks.forEach(chunk => {
             chunk.metadata = chunk.metadata || {};
             chunk.metadata.speaker = 'N/A'; // Use N/A for fallback/non-chat sources
         });
        return fallbackChunks.map(c => ({ pageContent: c.pageContent, metadata: c.metadata })); // Adapt to expected format
    }


    console.log(`[Ingestion] Parsed ${turnIndex} turns, created ${finalChunks.length} chunks for chat log: ${doc.metadata?.source}`);
    return finalChunks; // Return array of objects { pageContent: string, metadata: object }
}


// --- 3. QL Tag (Coordinate Assignment) ---
async function assignBimbaCoordinates(chunkText, chunkMetadata, coordinateMap) {
  console.log(`Assigning Bimba coordinates for chunk (Source: ${chunkMetadata?.source || 'N/A'})...`);
  if (!coordinateMap) {
      console.warn("Coordinate map not available, assigning #AJNANA.");
      return ["#AJNANA"];
  }

  // Construct the prompt for the tagging LLM
  const promptLines = [
      "Analyze the following text chunk and determine the top 1-3 most relevant Bimba numerical coordinates from the provided map.",
      "Consider the user hints provided.",
      "If no relevant coordinate is found, return ONLY the JSON array [\"#AJNANA\"].", // Explicitly mention JSON array
      "Your response should contain ONLY the valid JSON array of strings and nothing else.", // More direct instruction
      "\n**Bimba Coordinate Map:**",
      coordinateMap, // The map fetched from Notion
      "\n**User Hint (if any):**",
      `- Source Type: ${chunkMetadata?.source_type || 'N/A'}`,
      `- Primary Coordinate Hint: ${chunkMetadata?.primary_bimba_coordinate || 'N/A'}`,
      `- Additional Tags: ${chunkMetadata?.additional_tags || 'N/A'}`,
      "\n**Text Chunk:**",
      "---",
      chunkText,
      "---",
      "\nRelevant Coordinates (JSON Array):"
  ];
  const prompt = promptLines.join('\n');

  try {
      // Ensure taggingLlm is initialized
      if (!taggingLlm) {
          throw new Error("Tagging LLM not initialized.");
      }

      console.log("Sending prompt to tagging LLM...");
      const response = await taggingLlm.invoke([new HumanMessage(prompt)]);
      const content = response?.content;

      if (typeof content !== 'string') {
          throw new Error("LLM response content is not a string.");
      }

      console.log("Raw LLM Tagging Response:", content);

      // --- Robust JSON Parsing ---
      let coordinates = ["#AJNANA"]; // Default
      try {
          // Clean the response: remove markdown fences and trim whitespace
          const cleanedContent = content.trim().replace(/^```json\s*|\s*```$/g, '').trim();

          // Attempt to parse the cleaned content as JSON
          const parsed = JSON.parse(cleanedContent);

          // Validate the parsed structure
          if (Array.isArray(parsed) && parsed.length > 0 && parsed.every(c => typeof c === 'string' && c.startsWith('#'))) {
              coordinates = parsed.slice(0, 3); // Limit to top 3
              // Check if only AJNANA was returned, keep it as the sole tag if so
              if (coordinates.length === 1 && coordinates[0] === "#AJNANA") {
                   console.log("LLM explicitly assigned #AJNANA.");
              } else {
                  // Filter out AJNANA if other valid coordinates were returned
                  coordinates = coordinates.filter(c => c !== "#AJNANA");
                  if (coordinates.length === 0) {
                      // If filtering removed everything, default back to AJNANA
                      console.warn("LLM returned only #AJNANA with other invalid items? Defaulting to #AJNANA.");
                      coordinates = ["#AJNANA"];
                  }
              }
          } else {
               console.warn("LLM response was not a valid coordinate array after cleaning. Assigning #AJNANA. Parsed:", parsed);
               coordinates = ["#AJNANA"]; // Ensure default if validation fails
          }
      } catch (parseError) {
          console.error("Failed to parse JSON from LLM response:", parseError);
          console.warn("Original LLM response was:", content); // Log original content on error
          console.warn("Assigning #AJNANA due to parsing error.");
          // coordinates remains ["#AJNANA"]
      }
      // --- End Robust JSON Parsing ---

      console.log(`Assigned coordinates: ${coordinates.join(', ')}`);
      return coordinates;
  } catch (error) {
      console.error("Error during LLM coordinate assignment:", error);
      console.warn("Assigning #AJNANA due to error.");
      return ["#AJNANA"]; // Default to #AJNANA on error
  }
}

// --- 4. Send Chunks to Python Server for Processing ---
async function processAndStoreChunksViaPython(chunks, coordinateMap) {
  console.log("Sending chunks to Python LightRAG server for processing...");
  let processedCount = 0;
  let errorCount = 0;

  // Process chunks sequentially for now to avoid overwhelming the Python server
  // TODO: Implement batching or parallel requests with rate limiting if needed
  for (const chunk of chunks) {
    try {
      const chunkContent = chunk.pageContent;
      const combinedMetadata = { ...chunk.metadata, ...(chunk.metadata?.uploadMetadata || {}) };
      const source = combinedMetadata?.source || 'unknown';

      // Assign Bimba Coordinates using the LLM
      const coordinates = await assignBimbaCoordinates(chunkContent, combinedMetadata, coordinateMap);

      // Prepare payload for the Python server
      const payload = {
        chunk_text: chunkContent,
        bimba_coordinates: coordinates,
        // Optionally pass other metadata if the Python endpoint needs it
        // e.g., source: source, full_doc_id: combinedMetadata?.full_doc_id
      };

      console.log(`Sending chunk from ${source} with coords ${coordinates.join(', ')} to ${LIGHTRAG_INGEST_URL}`);

      // Call the Python server's /ingest endpoint
      const response = await axios.post(LIGHTRAG_INGEST_URL, payload, {
          headers: { 'Content-Type': 'application/json' },
          timeout: 120000 // Increase timeout for potentially long processing (2 minutes)
      });

      if (response.data && response.data.status === 'success') {
        console.log(`Successfully processed chunk via Python server: ${response.data.message}`);
        processedCount++;
      } else {
        console.error(`Error response from Python server for chunk from ${source}:`, response.data?.message || 'Unknown error');
        errorCount++;
      }

    } catch (error) {
      console.error(`Error sending chunk to Python server:`, error.response?.data || error.message);
      errorCount++;
      // Decide if we should continue or stop on error
    }

    // Log progress periodically
    if ((processedCount + errorCount) % 20 === 0) {
      console.log(`Processed ${processedCount + errorCount}/${chunks.length} chunks (Errors: ${errorCount})...`);
    }
  }

  console.log(`Finished sending chunks to Python server. Processed: ${processedCount}, Errors: ${errorCount}`);
}


// --- Main Pipeline Execution ---
async function runIngestionPipeline(directoryPath = SOURCE_DIRECTORY, uploadMetadata = {}) {
    console.log("Running ingestion with metadata:", uploadMetadata);
    const sourceType = uploadMetadata?.source_type || 'unknown';

    // Fetch coordinate map once at the start
    const coordinateMap = await getBimbaCoordinateMap();
    if (!coordinateMap) {
        console.error("Cannot run ingestion pipeline without Bimba coordinate map.");
        return;
    }

    const documents = await loadDocuments(directoryPath);
    if (documents.length === 0) {
        console.log("No documents found to ingest.");
        return;
    }

    let allChunks = [];
    for (const doc of documents) {
        // Attach uploadMetadata to each document before processing
        doc.metadata = doc.metadata || {};
        doc.metadata = { ...doc.metadata, ...uploadMetadata }; // Merge upload metadata

        let chunksForDoc = [];
        if (sourceType === 'chatgpt_log') { // Check source_type from merged metadata
            chunksForDoc = await parseAndChunkChatLog(doc);
        } else {
            // Default chunking for other types
            chunksForDoc = await chunkDocuments([doc]); // chunkDocuments expects array
             // Ensure metadata is preserved/merged correctly by chunkDocuments/splitDocuments
             chunksForDoc.forEach(chunk => {
                 chunk.metadata = chunk.metadata || {}; // Ensure metadata exists on chunk
                 // Assign speaker based on source_type if not already assigned
                 chunk.metadata.speaker = chunk.metadata.speaker || (sourceType === 'user_notes' ? 'user' : 'N/A');
                 // Ensure uploadMetadata is carried over
                 chunk.metadata = { ...uploadMetadata, ...chunk.metadata };
             });
        }
        allChunks = allChunks.concat(chunksForDoc);
    }

    // Instead of embedAndStoreChunks, call the new function to send chunks to Python
    await processAndStoreChunksViaPython(allChunks, coordinateMap);

    console.log("Ingestion Pipeline Finished.");
}

// Example of how to run (e.g., from an API route):
// runIngestionPipeline('./path/to/uploaded/files', { source_type: 'chatgpt_log', primary_bimba_coordinate: '#4' });

// If running directly for testing:
// runIngestionPipeline().catch(console.error);

// Export necessary functions
export { runIngestionPipeline, getBimbaCoordinateMap, chunkDocuments }; // Removed embedAndStoreChunks
