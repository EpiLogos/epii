import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables relative to the project root (.env in friendly-file-backend)
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai"; // Import embeddings class


// Ensure .env is loaded correctly relative to this service file

// Check if API key is loaded (Using the renamed variable from .env)
const apiKey = process.env.GOOGLE_API_KEY;
if (!apiKey) {
  console.error("Error: GOOGLE_API_KEY not found in environment variables.");
  process.exit(1); // Exit if API key is missing
}

// Initialize GoogleGenAI for chat models
const genAI = new GoogleGenAI({ apiKey: apiKey });
const chatModelName = process.env.SYNTHESIS_LLM_MODEL || "gemini-2.5-pro-exp-03-25"; // Use synthesis model

// Initialize GoogleGenerativeAIEmbeddings for embedding models
// Read model name from .env, default to text-embedding-004 if not set
const embeddingModelName = process.env.GEMINI_EMBEDDING_MODEL || "text-embedding-004";
let embeddings;
try {
    // Ensure apiKey is passed correctly
    embeddings = new GoogleGenerativeAIEmbeddings({
        apiKey: apiKey, // Use the loaded GOOGLE_API_KEY
        model: embeddingModelName,
    });
    console.log(`Google Embeddings model (${embeddingModelName}) initialized successfully.`);
} catch (error) {
    console.error("Failed to initialize Google Embeddings:", error);
    embeddings = null;
}


// --- Chat Generation Function ---
async function callGemini(structuredInput, functionDeclarations = null, enableGoogleSearch = false) {
  // structuredInput should contain { systemPrompt, history: [], userQuery }
  if (!structuredInput || !structuredInput.userQuery) {
    throw new Error("User query is required within structuredInput.");
  }

  // Construct the 'contents' array for the Gemini API
  // Incorporate history and the latest user query
  const contents = [];

  // Add history (assuming history is an array of { role: 'user'/'model', parts: [{ text: '...' }] })
  if (structuredInput.history && Array.isArray(structuredInput.history)) {
    contents.push(...structuredInput.history);
  }

  // Add the latest user query
  contents.push({ role: "user", parts: [{ text: structuredInput.userQuery }] }); // Add the user query directly

  try {
      // Prepare the request payload, including systemInstruction in config
      const generationConfig = {
          // Add other config params like temperature later if needed
          ...(structuredInput.systemPrompt && { systemInstruction: structuredInput.systemPrompt })
      };

      // Construct the tools array based on inputs
      const tools = [];
      if (functionDeclarations) {
        tools.push({ functionDeclarations: functionDeclarations });
      }
      if (enableGoogleSearch) {
        tools.push({ googleSearch: {} }); // Enable native Google Search
      }

      // Use the correct chat model name variable
      const requestPayload = {
        model: chatModelName,
        contents: contents,
        generationConfig: generationConfig, // Pass generation config
        ...(tools.length > 0 && { tools: tools }) // Add tools array if not empty
      };

      // Generate content using genAI.models.generateContent
      const result = await genAI.models.generateContent(requestPayload);

      // --- DETAILED LOGGING ---
      console.log("--- Full Gemini API Response ---");
      console.dir(result, { depth: null });
      console.log("-----------------------------");
      // --- END LOGGING ---

      // Check the response structure carefully
      if (!result || !result.candidates || result.candidates.length === 0 || !result.candidates[0].content) {
          console.error('Unexpected AI response structure (missing candidates or content):', JSON.stringify(result, null, 2));
          throw new Error("Invalid response structure from AI service.");
      }

      const responsePart = result.candidates[0].content.parts[0];

      // Check if the response contains a function call
      if (responsePart.functionCall) {
          console.log("Gemini requested function call:", responsePart.functionCall);
          // Return the function call object for the agent to handle
          return { functionCall: responsePart.functionCall };
      }
      // Check if the response contains text
      else if (responsePart.text) {
          const aiResponse = responsePart.text;
          // console.log("AI Text Response:", aiResponse);
          return { text: aiResponse }; // Return text response
      }
      // Handle cases where the response part is neither text nor function call
      else {
          console.error('Unexpected AI response part structure:', JSON.stringify(responsePart, null, 2));
          throw new Error("AI response part is neither text nor function call.");
      }

    } catch (error) {
      console.error("Error generating content with @google/genai:", error);
      throw new Error("Failed to generate AI response."); // Re-throw or handle error appropriately
    }
}

// --- Embedding Function ---
async function embedText(text) {
    if (!embeddings) {
        throw new Error("Google Embeddings client not initialized.");
    }
    if (typeof text !== 'string' || text.length === 0) {
        console.warn("EmbedText called with invalid input:", text);
        // Return a zero vector or handle appropriately
        // For now, throw an error
        throw new Error("Invalid input provided for embedding.");
    }
    try {
        // Use embedQuery for single text embedding
        const vector = await embeddings.embedQuery(text);
        // --- Add detailed logging ---
        console.log(`[embedText] Raw vector output type: ${typeof vector}`);
        console.log(`[embedText] Raw vector output isArray: ${Array.isArray(vector)}`);
        if (typeof vector === 'object' && vector !== null) {
             console.log(`[embedText] Raw vector output keys: ${Object.keys(vector)}`);
             // Attempt to log length if it's array-like or has a length property
             try { console.log(`[embedText] Raw vector output length: ${vector.length}`); } catch { /* ignore */ }
        }
        // console.log("[embedText] Raw vector output sample:", vector?.slice ? vector.slice(0, 5) : vector); // Log sample if possible
        // --- End detailed logging ---
        return vector;
    } catch (error) {
        console.error("Error generating embedding:", error);
        throw new Error("Failed to generate embedding.");
    }
}

export { callGemini, embedText, embeddings }; // Export the new function and the embeddings instance
