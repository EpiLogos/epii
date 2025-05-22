import { queryBimbaGraphTool } from '../../agents/tools/graph.tools.mjs';

/**
 * QL Node +1: Define & Locate
 * Identifies concepts in the Bimba graph based on keywords.
 * @param {import("../ql_cycle.graph.mjs").SystemState} state The current graph state.
 * @returns {Promise<Partial<import("../ql_cycle.graph.mjs").SystemState>>} Updates to the state with identifiedConcepts.
 */
async function node_1_Define(state) {
  console.log("--- QL Node +1: Define ---");
  // console.log("Received state in Node 1:", JSON.stringify(state, null, 2)); // Keep commented unless debugging state passing
  const { initialKeywords } = state;
  console.log("Extracted initialKeywords:", initialKeywords);

  if (!initialKeywords || initialKeywords.length === 0) {
    console.log("No keywords found, skipping Bimba lookup.");
    return { identifiedConcepts: [] };
  }

  const identifiedConcepts = [];
  const conceptsFound = new Set(); // To avoid duplicates if keywords map to same concept

  // Refined Cypher query: Prioritize matching bimba_coordinate, fallback to name CONTAINS.
  // Target specific relevant labels based on bimba_schema.md.
  // Returns name, coordinate, and labels for context. Limits to 1 per keyword.
  const cypherQuery = `
    MATCH (c)
    WHERE (c:Subsystem OR c:ParamasivaComponent OR c:AnuttaraComponent OR c:ParashaktiComponent OR c:MahamayaComponent OR c:NaraComponent OR c:Lens OR c:Agent OR c:ParamasivaConcept OR c:MetasymbolComponent OR c:QLFrame OR c:OntologyLayer OR c:MEFLens OR c:MEFSubLens OR c:NaraNestedComponent OR c:ContextualArenaInstance OR c:LogicSubsystem OR c:QLComponent OR c:SpandaComponent OR c:SpandaNestedStage OR c:AnandaComponent)
      AND (c.bimbaCoordinate = $keyword OR toLower(c.name) CONTAINS toLower($keyword))
    RETURN c.name AS name, c.bimbaCoordinate AS bimba_coordinate, labels(c) as labels
    LIMIT 1
  `;

  for (const keyword of initialKeywords) {
    try {
      if (!queryBimbaGraphTool) throw new Error("queryBimbaGraphTool is not available.");

      const toolResultString = await queryBimbaGraphTool.invoke({
        query: cypherQuery,
        params: { keyword: keyword }
      });

      const results = JSON.parse(toolResultString); // Tool returns JSON string

      if (results && results.length > 0) {
        const concept = results[0]; // { name: '...', bimba_coordinate: '...', labels: [...] }
        // Ensure all expected properties exist before pushing
        if (concept.name && concept.bimba_coordinate && concept.labels && !conceptsFound.has(concept.name)) {
          identifiedConcepts.push({
            name: concept.name,
            bimba_coordinate: concept.bimba_coordinate,
            labels: concept.labels // Include labels
          });
          conceptsFound.add(concept.name);
          console.log(`Found Bimba concept: ${concept.name} (${concept.bimba_coordinate}) for keyword: ${keyword}`);
        }
      }
    } catch (error) {
      console.error(`Error querying Bimba for keyword "${keyword}":`, error);
      // Continue to next keyword even if one fails
    }
  }

  console.log("Identified Concepts:", identifiedConcepts);
  return { identifiedConcepts: identifiedConcepts };
}

export { node_1_Define };
