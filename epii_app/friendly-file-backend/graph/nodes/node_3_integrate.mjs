import { HumanMessage } from "@langchain/core/messages";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

// Assume synthesisLlm is initialized elsewhere and passed or imported
// For standalone execution, we might need to initialize it here based on env vars
let synthesisLlm;
try {
    const activeModelVarName = process.env.ACTIVE_SYNTHESIS_MODEL || 'SYNTHESIS_LLM_MODEL_FREE';
    const synthesisModelName = process.env[activeModelVarName] || 'gemini-pro'; // Default to a known free model
    synthesisLlm = new ChatGoogleGenerativeAI({
        apiKey: process.env.GOOGLE_API_KEY,
        model: synthesisModelName,
        temperature: 0.5,
    });
    console.log("[Node 3] Synthesis LLM initialized.");
} catch (e) {
    console.error("[Node 3] Failed to initialize Synthesis LLM:", e);
    synthesisLlm = null;
}


/**
 * QL Node +3: Integrate & Mediate
 * Synthesizes an answer based on retrieved context using an LLM.
 * @param {import("../ql_cycle.graph.mjs").SystemState} state The current graph state.
 * @returns {Promise<Partial<import("../ql_cycle.graph.mjs").SystemState>>} Updates to the state with synthesizedInfo.
 */
async function node_3_Integrate(state) {
  console.log("--- QL Node +3: Integrate ---");
  // Receive raw context pieces from Node 2
  const { userQuery, lightragContext, bimbaContext, filteredSemanticContext } = state;
  // console.log("Raw Context Received - LightRAG:", lightragContext); // Keep commented unless debugging
  // console.log("Raw Context Received - Bimba:", bimbaContext);
  // console.log("Raw Context Received - Filtered Qdrant:", filteredSemanticContext);

  // --- Fuse/Structure Context for Prompt ---
  let contextForPrompt = "";
  let contextAvailable = false;

  if (lightragContext) {
      // Limit context size to avoid overly large prompts
      const contextSnippet = JSON.stringify(lightragContext, null, 2);
      contextForPrompt += `LightRAG Context:\n${contextSnippet.substring(0, 1500)}${contextSnippet.length > 1500 ? '...' : ''}\n\n`;
      contextAvailable = true;
  }
  if (bimbaContext) {
      const contextSnippet = JSON.stringify(bimbaContext, null, 2);
      contextForPrompt += `Bimba Structural Context:\n${contextSnippet.substring(0, 1500)}${contextSnippet.length > 1500 ? '...' : ''}\n\n`;
      contextAvailable = true;
  }
  if (filteredSemanticContext) {
       const contextSnippet = JSON.stringify(filteredSemanticContext, null, 2);
      contextForPrompt += `Coordinate-Filtered Semantic Context:\n${contextSnippet.substring(0, 1500)}${contextSnippet.length > 1500 ? '...' : ''}\n\n`;
      contextAvailable = true;
  }

  // Adjust logic if no context is available
  if (!contextAvailable) {
      console.log("No context received from Node 2, cannot synthesize.");
      return { synthesizedInfo: "Could not find relevant context to synthesize an answer." };
  }

  // --- Prepare Synthesis Prompt ---
  const contextString = `You are an AI assistant tasked with synthesizing information to answer a user's query.
Use the provided context, which includes results from LightRAG (document-derived entities/semantics), direct Bimba graph queries (foundational structure), and coordinate-filtered semantic search, to formulate a comprehensive answer. Prioritize accuracy and integrate information logically.

User Query: ${userQuery}

**Combined Context:**
${contextForPrompt}

Based *only* on the information provided above, synthesize a direct answer to the user query:`;

  // console.log("Synthesis Prompt Context Length:", contextString.length); // Monitor prompt size

  // --- Call LLM for Synthesis ---
  let synthesizedInfo = "Placeholder: LLM Synthesis Failed."; // Default error message
  try {
      // Ensure synthesisLlm is initialized and available
      if (!synthesisLlm) {
          console.error("Synthesis LLM is not initialized. Cannot synthesize.");
          throw new Error("Synthesis LLM not initialized.");
      }

      const messages = [new HumanMessage(contextString)];
      console.log("Sending prompt to synthesis LLM...");
      const response = await synthesisLlm.invoke(messages);
      const content = response?.content;

      // Improved handling for empty or invalid responses
      if (typeof content === 'string' && content.trim().length > 0) {
          synthesizedInfo = content.trim();
          console.log("Synthesized Info:", synthesizedInfo.substring(0, 100) + '...'); // Log snippet
      } else {
          const responseType = typeof content;
          const responseDetails = responseType === 'string' ? `(empty string)` : `(type: ${responseType})`;
          console.warn(`LLM synthesis returned invalid content ${responseDetails}. Response object:`, response);
          synthesizedInfo = "LLM synthesis failed to produce valid content."; // More informative placeholder
      }
  } catch (error) {
      console.error("Error during LLM synthesis:", error);
      synthesizedInfo = `Error during synthesis: ${error.message}`;
  }

  return { synthesizedInfo };
}

export { node_3_Integrate };
