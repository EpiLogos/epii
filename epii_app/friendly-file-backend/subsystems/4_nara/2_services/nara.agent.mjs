/**
 * @fileoverview Logic for the Nara Agent (-1 / +4).
 * - Role -1: Analyze Context - Analyzes query context, performs Bimba/Vector retrieval.
 * - Role +4: Contextualize Response - Contextualizes the synthesized response, integrating personal and universal context.
 */

// Keep Mem0 import for tool functions
// Adjusted path for new location: ../services/
import mem0, { addDocumentToMem0 } from '../../../databases/shared/services/mem0.service.mjs';
// Remove direct callGemini import
// Adjusted path for new location: ../services/
// import { callGemini } from '../../../databases/shared/services/google-ai-agent.service.mjs';

// LangChain Imports
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, AIMessage, ToolMessage } from "@langchain/core/messages";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod"; // For defining tool schemas

// Define the universal user ID
const UNIVERSAL_USER_ID = 'epii_universal';

// --- Function Declarations for Gemini (Original - Keep for reference or remove later) ---
const functionDeclarations_Original = [
  {
    name: "searchPersonalContext",
    description: "Searches the user's personal memory context (past interactions, journal entries, dreams, etc.) in Mem0 based on a query.",
    parameters: {
      type: "object",
      properties: {
        searchQuery: {
          type: "string",
          description: "The query string to search for relevant personal memories.",
        },
        limit: {
           type: "number",
           description: "Maximum number of results to return.",
           default: 5
        }
      },
      required: ["searchQuery"],
    },
  },
  {
    name: "searchUniversalContext",
    description: "Searches the universal system context (core principles, metasymbol info, foundational concepts) in Mem0 based on a query.",
    parameters: {
      type: "object",
      properties: {
        searchQuery: {
          type: "string",
          description: "The query string to search for relevant universal context.",
        },
         limit: {
           type: "number",
           description: "Maximum number of results to return.",
           default: 3
        }
      },
      required: ["searchQuery"],
    },
  },
  // TODO: Add functions for graph queries later if needed
];
// --- End Function Declarations ---


// --- Zod Schemas for LangChain Tools ---
const searchPersonalContextSchema = z.object({
  searchQuery: z.string().describe("The query string to search for relevant personal memories."),
  limit: z.number().optional().describe("Maximum number of results to return."), // Removed .default(5)
});

const searchUniversalContextSchema = z.object({
  searchQuery: z.string().describe("The query string to search for relevant universal context."),
  limit: z.number().optional().describe("Maximum number of results to return."), // Removed .default(3)
});
// --- End Zod Schemas ---


// --- LangChain Tools wrapping Mem0 search ---
const searchPersonalContextTool = new DynamicStructuredTool({
  name: "searchPersonalContext",
  description: "Searches the user's personal memory context (past interactions, journal entries, dreams, etc.) in Mem0 based on a query.",
  schema: searchPersonalContextSchema,
  func: async ({ searchQuery, limit }, runManager, config) => {
    console.log(`Executing searchPersonalContext Tool: Query='${searchQuery}', Limit=${limit}, UserID=${config?.configurable?.userId}`);
    if (!mem0) {
        console.error("Mem0 OSS client not initialized in searchPersonalContextTool.");
        return "Error: Mem0 client not available.";
    }
    try {
      const userId = config?.configurable?.userId;
      if (!userId) {
          console.error("User ID not available in tool execution config for personal search.");
          return "Error: User ID not available in tool execution config.";
      }
      const searchResults = await mem0.search(searchQuery, { userId: userId, limit: limit });
      console.log(`searchPersonalContext Tool Raw Results:`, JSON.stringify(searchResults)); // Log raw results
      console.log(`searchPersonalContext Tool Results Count: ${searchResults?.results?.length || 0}`); // Access .results
      // Access the .results property before mapping
      return JSON.stringify(searchResults?.results?.map(r => ({ id: r.id, score: r.score, memory: r.memory.substring(0, 200) + '...' })) || []);
    } catch (error) {
      console.error("Error during searchPersonalContextTool execution:", error);
      return `Error executing personal search: ${error.message}`;
    }
  },
});

const searchUniversalContextTool = new DynamicStructuredTool({
  name: "searchUniversalContext",
  description: "Searches the universal system context (core principles, metasymbol info, foundational concepts) in Mem0 based on a query.",
  schema: searchUniversalContextSchema,
  func: async ({ searchQuery, limit }) => {
    console.log(`Executing searchUniversalContext Tool: Query='${searchQuery}', Limit=${limit}`);
    if (!mem0) {
        console.error("Mem0 OSS client not initialized in searchUniversalContextTool.");
        return "Error: Mem0 client not available.";
    }
    try {
      const searchResults = await mem0.search(searchQuery, { userId: UNIVERSAL_USER_ID, limit: limit });
      console.log(`searchUniversalContext Tool Raw Results:`, JSON.stringify(searchResults)); // Log raw results
      console.log(`searchUniversalContext Tool Results Count: ${searchResults?.results?.length || 0}`); // Access .results
      // Access the .results property before mapping
      return JSON.stringify(searchResults?.results?.map(r => ({ id: r.id, score: r.score, memory: r.memory.substring(0, 200) + '...' })) || []);
    } catch (error) {
      console.error("Error during searchUniversalContextTool execution:", error);
      return `Error executing universal search: ${error.message}`;
    }
  },
});

const tools = [searchPersonalContextTool, searchUniversalContextTool];
// --- End LangChain Tools ---


// --- LangChain Model Instantiation & Binding ---
// Ensure GOOGLE_API_KEY and GEMINI_MODEL_1 are set in .env
const activeModelVarName = process.env.ACTIVE_SYNTHESIS_MODEL || 'SYNTHESIS_LLM_MODEL_FREE';
const synthesisModelName = process.env[activeModelVarName] || 'gemini-2.5-pro';

const llm = new ChatGoogleGenerativeAI({
    model: synthesisModelName,
    apiKey: process.env.GOOGLE_API_KEY,
    // temperature: 0 // Optional: Set temperature if needed
});

// Bind tools to the model
const llmWithTools = llm.bindTools(tools);
// --- End LangChain Model ---


// Define Nara's Detailed System Prompt based on documentation
const NARA_SYSTEM_PROMPT = `You are Nara, the Contextual Application agent (#4) within the Epi-Logos meta-structure, a system modeling the 'cosmic mind'. Your core function is **Dia-Logos**: acting as a harmonic mediator and living interface between universal archetypal patterns and the user's particular reality and personal transformation journey.

**Core Responsibilities:**
1.  **Contextual Analysis (-1 Role):** Receive the query and current state. Analyze user context by retrieving relevant personal memories (using user_id) and universal principles (using '${UNIVERSAL_USER_ID}') from Mem0 (vector and potentially graph stores). Consider conversation history.
2.  **Personalized Synthesis (+4 Role):** Receive the synthesized response draft from Mahamaya (+3). Integrate this draft with the retrieved personal and universal context. Personalize the final response based on the user's unique profile (archetypal signature from birthday/natal chart - *future implementation*), their current state within the 12-fold concrescence cycle (*future implementation*), and real-time astrological modulations (*future implementation*).
3.  **Dia-Logical Engagement:** Facilitate a conversational exchange that offers personalized insights, guidance, practices, and symbolic associations relevant to the user's journey and query. Maintain a guiding, understanding, and contextually aware tone.
4.  **Multi-Input Processing:** Be prepared to receive and process both structured inputs (like Tarot readings - *future implementation*) and unstructured data (dreams, synchronicities, journal entries via \`addUnstructuredInput\`). Integrate this information into the user's context within Mem0.
5.  **QL Frame Awareness:** Understand that different Quaternary Logic (QL) frames (4-fold static, 6-fold integral, 12-fold double-covering) exist. While Paramasiva governs frame selection, adapt your interpretation and response style if the context strongly indicates a specific frame is active.

**Internal Structure Awareness (Nara Subsystem #4):**
- **#0 Mahamaya Ground:** Rooted in archetypal math. Personalization starts via Birthdate Encoding and astrological natal chart(*future implementation*).
- **#1 Decanic Magic:** Material cause, linking to natural correspondences, body-part/pranic region, decanic images (for active imagination), planetary associations etc.
- **#2 Tarot Systems:** Symbolic interface, dynamic activation. Receives the enriched Tarot Card associations from Mahamaya.
- **#3 Alchemical Systems:** Formal mediation, transformation principles. 
- **#4 Jungian Psychodynamics (Nested Contextual Arena):** This position grounds symbolic processes in psychological reality. It contains a nested 6-fold structure (4.0-4.5) which, in its current primary mapping, aligns with Jungian concepts and the MEF Layer #3 (Psychology):
    - **4.0 Archetypal Foundation (Ajnana):** Jung's archetypes, unconscious, psychoid number theory. Links to Paramasiva.
    - **4.1 Psychological Typology (Ontology):** Jung's types, functions, psychic reality. Links to MEF Ontology.
    - **4.2 Synchronicity & Expression (Epistemology):** Synchronicity, archetypal images, shadow. Links to MEF Epistemology.
    - **4.3 Alchemical Transformation (Psychology):** Individuation, alchemy, active imagination. Links to MEF Psychology.
    - **4.4 Self-Expression (Context):** Mandala, contextual flowering of the Self. Links to MEF Context.
    - **4.5 Transcendent Integration (Jnana):** Gnosis, Self-realization beyond psychology. Links to MEF Jnana & potential for #5 Epii.
    *Note: This Jungian mapping is one specific reflection corresponding to MEF Layer #3. Nara's #4 position potentially holds other nested reflections corresponding to other MEF layers, though these are not yet explicitly mapped.*
- **#5 Epii Integration:** Synthesis point, emergent intelligence connection, potential transcendence (links to 4.5). To be integrated at a later date with the epii agent and its Notion API integration.

Your goal is to provide responses that are not generic but deeply resonant and applicable to the specific user within the Epi-Logos framework, leveraging this multi-layered understanding of context and transformation.`;

/**
 * Nara Agent function compatible with LangGraph.js.
 * Determines action based on the current state's run_direction.
 *
 * @param {object} state - The current graph state. Should contain query, history, user_id, run_direction etc.
 * @param {object} config - LangGraph configuration object (optional).
 * @returns {Promise<object>} - A partial state object with updates.
 */
export async function naraAgentNode(state, config) {
  console.log("--- Nara Agent Node ---");
  const { query, run_direction, user_id, history } = state; // Destructure needed state parts

  if (!user_id) {
    console.error("Nara Agent Error: user_id is missing from state.");
    return { error: "User ID is required for Nara Agent." };
  }

  if (run_direction === 'analysis') {
    // Role -1: Analyze Context & Retrieve Information
    console.log(`Nara Agent (-1): Analyzing Context for query: "${query}" | User: ${user_id}`);
    // Role -1: Analyze Context (Simplified - Context retrieval moved to Synthesis via Function Calling)
    console.log(`Nara Agent (-1): Analyzing Context for query: "${query}" | User: ${user_id}`);
    const analysisLog = [...(state.analysis_log || []), `Nara (-1): Initial context analysis for user ${user_id}. Query: "${query}"`]; // Keep only the first declaration

    // No direct Mem0 calls here anymore. Context retrieval is initiated by Gemini in the synthesis phase.
    // We might do some initial query analysis/classification here later if needed.

    analysisLog.push("Nara (-1): Initial analysis complete. Passing state to Mahamaya (-2).");

    // Return partial state - nara_analysis_results will be populated during synthesis if needed
    return {
      ...state, // Pass existing state through
      analysis_log: analysisLog,
      nara_analysis_results: { // Initialize results object
          retrievedPersonalContext: null,
          retrievedUniversalContext: null,
      },
    };

  } else if (run_direction === 'synthesis') {
    // Role +4: Contextualize & Personalize Response using LangChain
    console.log(`Nara Agent (+4): Contextualizing Response for user ${user_id} using LangChain`);
    let currentAnalysisLog = [...(state.analysis_log || [])];
    let currentSynthesisLog = [...(state.synthesis_log || []), `Nara (+4): Contextualizing response for user ${user_id} via LangChain.`];
    const currentSynthesizedResponse = state.synthesized_response; // Get response from previous agent (+3 Mahamaya)

    // Convert history from simple objects to LangChain message objects
    const currentHistory = (state.history || []).map(msg => {
        if (msg.role === 'user') return new HumanMessage(msg.content);
        if (msg.role === 'assistant' || msg.role === 'model') return new AIMessage(msg.content); // Adjust if history contains tool calls/responses
        // Handle other roles if necessary, fallback to HumanMessage
        return new HumanMessage(`Unknown role (${msg.role}): ${msg.content}`);
    });

    try {
        // Construct the user prompt for Gemini, instructing it to use tools
        // Note: We don't need to manually inject context here, Gemini will use tools to get it.
        const userPrompt = `Synthesized Draft from Mahamaya (+3): "${currentSynthesizedResponse}"

**ACTION REQUIRED:** Before refining the draft above, you MUST first use the available search functions ('searchPersonalContext' for user ${user_id}, 'searchUniversalContext' for general system info) to gather the necessary context relevant to the draft's topic and the user's history. Once you have the search results, then refine, personalize, and contextualize the draft based *only* on the retrieved context and the conversation history. Do not answer directly from general knowledge before searching.

Refined & Personalized Response (after function calls):`;

        // Combine history and the new user prompt
        const messages = [...currentHistory, new HumanMessage({ content: userPrompt, system: NARA_SYSTEM_PROMPT })]; // Add system prompt here if needed or handle via model init

        console.log("Nara (+4): Invoking Gemini with tools via LangChain...");
        // Invoke the model, passing userId in config for the tool function
        let aiResponse = await llmWithTools.invoke(messages, { configurable: { userId: user_id } });
        currentSynthesisLog.push(`Nara (+4): Initial LangChain response received.`);

        // Check if the response contains tool calls
        if (aiResponse.tool_calls && aiResponse.tool_calls.length > 0) {
            currentSynthesisLog.push(`Nara (+4): LangChain detected ${aiResponse.tool_calls.length} tool call(s).`);
            console.log("Nara (+4): Handling tool calls via LangChain:", JSON.stringify(aiResponse.tool_calls));

            // Add the AI message with tool calls to history
            messages.push(aiResponse);

            // Execute tools and create ToolMessages
            for (const toolCall of aiResponse.tool_calls) {
                const tool = tools.find((t) => t.name === toolCall.name);
                let toolResultContent = `Error: Tool '${toolCall.name}' not found.`; // Default error

                if (tool) {
                    try {
                        // Pass userId via config again for personal search
                        toolResultContent = await tool.invoke(toolCall.args, { configurable: { userId: user_id } });
                        currentSynthesisLog.push(`Nara (+4): Executed tool '${toolCall.name}'. Result length: ${toolResultContent.length}`);
                    } catch (toolError) {
                        console.error(`Nara (+4): Error executing tool ${toolCall.name}:`, toolError);
                        currentSynthesisLog.push(`Nara (+4): Error executing tool '${toolCall.name}': ${toolError.message}`);
                        toolResultContent = `Error executing tool: ${toolError.message}`;
                    }
                } else {
                    console.error(`Nara (+4): Unknown tool requested: ${toolCall.name}`);
                    currentSynthesisLog.push(`Nara (+4): Unknown tool requested: ${toolCall.name}`);
                }
                // Add ToolMessage with result (or error) to history
                messages.push(new ToolMessage({
                    tool_call_id: toolCall.id,
                    content: toolResultContent, // Content is the stringified result or error message
                }));
            }

            // Invoke the model AGAIN with the tool results in the history
            console.log("Nara (+4): Re-invoking Gemini with tool results via LangChain...");
            aiResponse = await llmWithTools.invoke(messages, { configurable: { userId: user_id } }); // Pass config again
            currentSynthesisLog.push(`Nara (+4): Final LangChain response received after tool execution.`);
        }

        // Extract final text content
        const finalResponseText = aiResponse.content || "Sorry, I encountered an issue generating a response.";
        if (typeof finalResponseText !== 'string') {
             console.error("Nara (+4): Final LangChain response content is not a string:", finalResponseText);
             currentSynthesisLog.push("Nara (+4): Error - Final LangChain response content is not a string.");
             return { ...state, error: "Invalid final response format from LLM", synthesis_log: currentSynthesisLog };
        }
        currentSynthesisLog.push("Nara (+4): Final response extracted via LangChain.");

        // Update state
        return {
            ...state,
            synthesized_response: finalResponseText,
            synthesis_log: currentSynthesisLog,
            analysis_log: currentAnalysisLog, // Pass analysis log through
            // history: messages // Optional: Update state history with full LangChain messages
        };

    } catch (error) {
        console.error("Nara Agent (+4) LangChain Error:", error);
        const errorSynthesisLog = [...(state.synthesis_log || [])];
        errorSynthesisLog.push(`Nara (+4): Error during LangChain synthesis - ${error.message}`);
        return {
            ...state,
            synthesis_log: errorSynthesisLog,
            error: `Nara (+4) LangChain Synthesis Error: ${error.message}`
        };
    }
  } else {
    console.error("Nara Agent: Invalid run_direction in state:", run_direction);
    return { ...state, error: "Invalid run_direction for Nara Agent" };
  }
}

/**
 * Handles adding unstructured user data (dreams, synchronicities, etc.) to Mem0.
 * This might be called via a separate API endpoint or triggered by specific user input patterns.
 * @param {string} textInput - The unstructured text input.
 * @param {string} userId - The user's unique identifier.
 * @param {string} inputType - e.g., 'dream', 'synchronicity', 'journal'.
 * @param {object} [additionalMetadata={}] - Any other relevant metadata.
 * @returns {Promise<boolean>} - Success status.
 */
export async function addUnstructuredInput(textInput, userId, inputType, additionalMetadata = {}) {
    console.log(`Nara: Adding unstructured input for user ${userId}, type: ${inputType}`);
    if (!userId || !textInput || !inputType) {
        console.error("Missing required parameters for adding unstructured input.");
        return false;
    }
    const metadata = {
        ...additionalMetadata,
        inputType: inputType,
        timestamp: new Date().toISOString(),
    };
    // Use the chunking function from mem0.service
    return await addDocumentToMem0(textInput, metadata, userId);
}
