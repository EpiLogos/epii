import { getConversationHistoryTool, getUserContextTool } from '../../agents/tools/mongo.tools.mjs';

/**
 * QL Node +4: Contextualize
 * Retrieves user history and context from MongoDB to prepare for final response generation.
 * @param {import("../ql_cycle.graph.mjs").SystemState} state The current graph state.
 * @returns {Promise<Partial<import("../ql_cycle.graph.mjs").SystemState>>} Updates to the state with finalPromptContext.
 */
async function node_4_Contextualize(state) {
  console.log("--- QL Node +4: Contextualize ---");
  const { userId, synthesizedInfo, history } = state; // history is the input history from the controller
  console.log("Synthesized Info received:", synthesizedInfo ? synthesizedInfo.substring(0, 100) + '...' : 'null');

  let retrievedHistory = [];
  let userContext = {};

  // --- 1. Retrieve History ---
  try {
    // Check tool availability
    if (!getConversationHistoryTool) {
        console.warn("getConversationHistoryTool is not available. Skipping history retrieval.");
        // Allow proceeding without history
    } else {
        // Retrieve recent history (limit might be adjusted)
        const historyResultString = await getConversationHistoryTool.invoke({ userId: userId, limit: 10 });
        retrievedHistory = JSON.parse(historyResultString); // Assuming tool returns JSON array string
        console.log(`Retrieved ${retrievedHistory.length} recent messages for history.`);
        // Note: We might need to merge/reconcile this with the input `state.history` if needed later
    }
  } catch (error) {
    console.error("Error retrieving conversation history:", error);
    // Proceed without history or handle error
  }

  // --- 2. Retrieve User Context ---
  try {
    // Check tool availability
    if (!getUserContextTool) {
        console.warn("getUserContextTool is not available. Skipping user context retrieval.");
         // Allow proceeding without user context
    } else {
        const userContextString = await getUserContextTool.invoke({ userId: userId });
        userContext = JSON.parse(userContextString); // Assuming tool returns JSON object string
        console.log("Retrieved User Context:", userContext);
    }
  } catch (error) {
    console.error("Error retrieving user context:", error);
    // Proceed without user context or handle error
  }

  // --- 3. Format Final Prompt Context ---
  // Combine synthesized info, history, and user context for the final LLM call in Node 5
  // The exact format depends on how Node 5's prompt is structured
  const finalPromptContext = {
    synthesizedInfo: synthesizedInfo || "No information was synthesized.",
    // Use retrieved history, potentially merged/formatted
    conversationHistory: retrievedHistory, // Use the history retrieved from DB
    userProfile: userContext?.profileData || {},
    userPreferences: userContext?.preferences || {},
  };
  console.log("Prepared Final Prompt Context for Node 5.");

  return { finalPromptContext };
}

export { node_4_Contextualize };
