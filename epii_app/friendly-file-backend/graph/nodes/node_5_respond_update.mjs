import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { getDb } from "../../services/mongo.service.mjs"; // Corrected path

// Import Locally Defined Tool Instances (used for binding)
import { queryBimbaGraphTool } from '../../agents/tools/graph.tools.mjs';
import { searchPratibimbaContextTool } from '../../agents/tools/vector.tools.mjs';
import { getConversationHistoryTool, getUserContextTool } from '../../agents/tools/mongo.tools.mjs';

// Assume responseLlm is initialized elsewhere and passed or imported
// For standalone execution, we might need to initialize it here based on env vars
let responseLlm;
try {
    const activeModelVarName = process.env.ACTIVE_SYNTHESIS_MODEL || 'SYNTHESIS_LLM_MODEL_FREE';
    const responseModelName = process.env[activeModelVarName] || 'gemini-pro'; // Default to a known free model
    responseLlm = new ChatGoogleGenerativeAI({
        apiKey: process.env.GOOGLE_API_KEY,
        model: responseModelName,
        temperature: 0.7,
    });
    console.log("[Node 5] Response LLM initialized.");
} catch (e) {
    console.error("[Node 5] Failed to initialize Response LLM:", e);
    responseLlm = null;
}

// Define MCP Tools as DynamicStructuredTool for binding (schemas match B-P MCP)
const getNodeOverviewTool = new DynamicStructuredTool({
    name: "getNodeOverview",
    description: "Get properties and direct connections for a specific Bimba node.",
    schema: z.object({
        bimbaCoordinate: z.string().describe("The Bimba coordinate (e.g., '#5-2').")
    }),
    func: async () => "This is a placeholder function for an external tool description.", // Placeholder func
});

const getInspirationTool = new DynamicStructuredTool({
    name: "getInspiration",
    description: "Retrieve curated inspiration related to a topic, optionally filtered by Bimba coordinates.",
    schema: z.object({
        query: z.string().describe("The topic or area for which inspiration is sought."),
        coordinateFilter: z.array(z.string()).optional().describe("Optional array of Bimba coordinates (e.g., ['#5-2', '#5-3']) to filter inspiration sources."),
        limit: z.number().int().positive().optional().default(3).describe("Maximum number of inspiration items to return per source (Notion, Qdrant)."),
    }),
    func: async () => "This is a placeholder function for an external tool description.", // Placeholder func
});

// Notion Crystallization Tools (Re-enabled after MCP schema fix attempt)
const resolveBimbaCoordinateTool = new DynamicStructuredTool({
    name: "resolveBimbaCoordinate",
    description: "Finds the Notion Page ID linked to a given Bimba Coordinate in Neo4j. Use this *before* appendNotionBlock.",
    schema: z.object({
        bimbaCoordinate: z.string().regex(/^#[\w.-]+$/, "Must be a valid Bimba coordinate starting with #").describe("The Bimba coordinate (e.g., '#5-2').")
    }),
    func: async () => "This is a placeholder function for an external tool description.", // Placeholder func
});

// Corrected definition for appendNotionBlockTool
const appendNotionBlockTool = new DynamicStructuredTool({
    name: "appendNotionBlock",
    description: "Appends content blocks to a specific Notion page, identified by its ID.",
    // Using the updated schema definition from B-P MCP index.ts
    schema: z.object({
        notionPageId: z.string().describe("The ID of the target Notion page."),
        blocksToAppend: z.array(z.object({}).passthrough()).min(1).describe("An array of Notion block objects (JSON format) to append.")
    }),
    func: async () => "This is a placeholder function for an external tool description.", // Placeholder func
});


/**
 * QL Node +5: Respond & Crystallize
 * Generates the final response, logs interaction, and potentially prepares Notion update payload.
 * @param {import("../ql_cycle.graph.mjs").SystemState} state The current graph state.
 * @returns {Promise<Partial<import("../ql_cycle.graph.mjs").SystemState>>} Final state containing the llmResponse.
 */
async function node_5_Respond_Update(state) {
  console.log("--- QL Node +5: Respond/Update ---");
  const { finalPromptContext, userId, userQuery } = state; // Removed history as it's in finalPromptContext
  // console.log("Final Prompt Context:", finalPromptContext); // Keep commented unless debugging

  // --- 1. Generate Final Response ---
  let finalResponseContent = "Placeholder: Final LLM response generation failed.";
  let finalAiMessage = new AIMessage(finalResponseContent); // Use AIMessage
  let toolCalls = []; // To hold potential tool calls

  try {
      // Ensure responseLlm is initialized and available
      if (!responseLlm) {
          console.error("Response LLM is not initialized. Cannot generate final response.");
          throw new Error("Response LLM not initialized.");
      }

      // Define ALL tools to bind
      const toolsToBind = [
          // Locally Defined Tools
          queryBimbaGraphTool,
          searchPratibimbaContextTool,
          getConversationHistoryTool,
          getUserContextTool,
          // MCP Tools (as DynamicStructuredTool)
          getNodeOverviewTool,
          getInspirationTool,
          // Notion Tools (Re-enabled)
          resolveBimbaCoordinateTool,
          appendNotionBlockTool,
      ];

      // Bind tools
      const llmWithTools = responseLlm.bindTools(toolsToBind);

      // Construct prompt
      const finalPrompt = `
You are Epi-Logos, an AI embodying the 'Cosmic Mind'. Your goal is to provide insightful, contextually relevant responses and, when appropriate, prepare information for crystallization into the Notion knowledge base.

**Available Context:**
*   **Synthesized Information:** ${finalPromptContext?.synthesizedInfo || 'N/A'}
*   **User Profile:** ${JSON.stringify(finalPromptContext?.userProfile) || '{}'}
*   **User Preferences:** ${JSON.stringify(finalPromptContext?.userPreferences) || '{}'}
*   **Conversation History (Recent):**
    ${(finalPromptContext?.conversationHistory || []).map(msg => `${msg._getType()}: ${JSON.stringify(msg.content) || JSON.stringify(msg.tool_calls)}`).join('\n    ')}
*   **Current User Query:** ${userQuery}

**Your Tasks:**

1.  **Generate Final Response:** Based on all available context, generate a final, coherent response. Aim for holistic understanding, leveraging paradox, humor, and compassion. If the synthesized info seems incomplete for a full response, consider using memory tools (\`queryBimbaGraph\`, \`searchPratibimbaContext\`, \`getMongoContext\`, \`getNodeOverview\`, \`getInspiration\`) to fetch specific supplementary details *before* finalizing your response text.
2.  **Prepare Crystallization Payload (Epii Mode Only):** If the current mode is 'epii' (this information isn't directly available here, assume it might be based on prompt context or future state variable) AND you judge the synthesized information to be a significant insight worthy of crystallization, prepare a structured payload for the user to review. Structure the output as a tool call to a hypothetical 'proposeCrystallization' tool with arguments:
    *   \`targetBimbaCoordinate\`: (string) The most relevant Bimba coordinate (e.g., '#1-2').
    *   \`proposedBlocks\`: (array) An array of Notion block objects representing the content to save.
    *   Include a brief textual response indicating you are proposing the crystallization.
    *   *(Self-Correction: The LLM should now be able to call \`resolveBimbaCoordinate\` and \`appendNotionBlock\` if needed, but the primary mechanism is the 'proposeCrystallization' payload for user review via the canvas).*

**Tool schemas are bound separately. Use tools strategically for response refinement or crystallization proposal.**

**Final Response:**`;


      const messages = [new HumanMessage(finalPrompt)];
      // Invoke the LLM *with tools bound*
      console.log("Sending prompt to final response LLM...");
      const response = await llmWithTools.invoke(messages);
      finalResponseContent = response?.content || "LLM returned no content for final response.";

      // Check if the LLM decided to call tools (including the hypothetical proposeCrystallization)
      if (response?.tool_calls && response.tool_calls.length > 0) {
          console.log("LLM requested tool calls:", response.tool_calls);
          // Store tool calls to be processed by the LangGraph runner or controller
          toolCalls = response.tool_calls;
          // The final message might indicate it's performing an action or proposing crystallization
          finalAiMessage = new AIMessage({
              content: finalResponseContent || "Okay, processing request...", // Provide some content
              tool_calls: toolCalls // Pass tool calls in the AIMessage
          });

      } else {
           // No tool calls requested, just a standard response
           finalAiMessage = new AIMessage(finalResponseContent);
      }

      console.log("Final AI Message (content):", finalResponseContent.substring(0, 100) + '...'); // Log snippet
      if (toolCalls.length > 0) {
          console.log("Final AI Message (tool calls):", JSON.stringify(toolCalls));
      }


  } catch (error) {
      console.error("Error during final LLM response generation:", error);
      finalResponseContent = `Error generating final response: ${error.message}`;
      finalAiMessage = new AIMessage(finalResponseContent);
  }

  // --- Log Interaction to MongoDB ---
  try {
      const db = await getDb(); // Ensure DB connection is available
      if (!db) {
          console.warn("MongoDB connection not available. Skipping interaction logging.");
          // Decide if this should throw an error or just warn
      } else {
          const conversationsCollection = db.collection('Conversations');
          const userMessage = new HumanMessage(userQuery); // Convert user query string to HumanMessage
          const updateResult = await conversationsCollection.updateOne(
              { userId: userId }, // Simple find criteria for now
              { $push: { messages: { $each: [userMessage, finalAiMessage] } }, $set: { updatedAt: new Date() } },
              { upsert: true } // Create if doesn't exist
          );
          if (updateResult.acknowledged) {
              console.log(`Interaction logged to MongoDB for userId: ${userId}. Upserted: ${updateResult.upsertedCount > 0}, Modified: ${updateResult.modifiedCount > 0}`);
          } else {
              console.warn(`MongoDB update not acknowledged for userId: ${userId}.`);
          }
      }
  } catch (logError) {
      console.error("Error logging interaction to MongoDB:", logError);
  }

  // Return final response (which might include tool calls)
  // The controller calling this graph will extract the content/tool_calls from state.llmResponse.
  return {
      llmResponse: finalAiMessage
  };
}

export { node_5_Respond_Update };
