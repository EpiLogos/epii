/**
 * QL Node +0: Intake & Grounding
 * Extracts initial keywords from the user query.
 * @param {import("../ql_cycle.graph.mjs").SystemState} state The current graph state.
 * @returns {Promise<Partial<import("../ql_cycle.graph.mjs").SystemState>>} Updates to the state with initialKeywords.
 */
async function node_0_Intake(state) {
  console.log("--- QL Node +0: Intake ---");
  const { userQuery } = state;
  console.log("Input Query:", userQuery);

  // Placeholder Keyword Extraction: Simple split and filter common words
  // TODO: Replace with more robust NLP or LLM-based keyword extraction if needed
  const commonWords = new Set(['a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'being', 'been', 'what', 'who', 'when', 'where', 'why', 'how', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 'its', 'our', 'their', 'in', 'on', 'at', 'to', 'for', 'with', 'about', 'of', 'and', 'or', 'but']);
  const keywords = userQuery
    ? userQuery
        .toLowerCase()
        .replace(/[^\w\s]/g, '') // Remove punctuation
        .split(/\s+/)
        .filter(word => word.length > 2 && !commonWords.has(word))
    : []; // Handle null or undefined userQuery

  console.log("Extracted Keywords:", keywords);
  return { initialKeywords: keywords };
}

export { node_0_Intake };
