import axios from 'axios';
import { queryBimbaGraphTool } from '../../agents/tools/graph.tools.mjs';
import { searchPratibimbaContextTool } from '../../agents/tools/vector.tools.mjs';
import { embedText } from '../../services/google-ai-agent.service.mjs';

// Load environment variables (assuming dotenv is configured in the main graph file or entry point)
const LIGHTRAG_MCP_SERVER_URL = process.env.LIGHTRAG_MCP_SERVER_URL || "http://localhost:8001";

// Helper function to parse Bimba coordinates
function parseBimbaCoordinates(inputText) {
    if (!inputText) return [];
    const regex = /#[\w.-]+/g; // Simple regex for coordinates like #5-2, #4.1.1 etc.
    const matches = inputText.match(regex);
    return matches || [];
}

// Helper function to select the display coordinate
function selectDisplayCoordinate(parsedCoords, identifiedConcepts) {
    // Simple heuristic: Prioritize explicitly parsed coordinates, fallback to first identified concept
    if (parsedCoords && parsedCoords.length > 0) {
        console.log(`[selectDisplayCoordinate] Prioritizing parsed coordinate: ${parsedCoords[0]}`);
        return parsedCoords[0];
    }
    if (identifiedConcepts && identifiedConcepts.length > 0 && identifiedConcepts[0].bimba_coordinate) {
        console.log(`[selectDisplayCoordinate] Falling back to first identified concept coordinate: ${identifiedConcepts[0].bimba_coordinate}`);
        return identifiedConcepts[0].bimba_coordinate;
    }
    console.log("[selectDisplayCoordinate] No suitable coordinate found for display.");
    return null;
}

/**
 * QL Node +2: Relate & Enrich (LightRAG Integration)
 * Retrieves context from LightRAG, direct Bimba query, and filtered Qdrant search.
 * @param {import("../ql_cycle.graph.mjs").SystemState} state The current graph state.
 * @returns {Promise<Partial<import("../ql_cycle.graph.mjs").SystemState>>} Updates to the state with retrieved contexts and displayCoordinate.
 */
async function node_2_Relate(state) {
  console.log("--- QL Node +2: Relate (LightRAG Integration) ---");
  const { identifiedConcepts, userQuery, history } = state; // Use history or userQuery for context
  const inputTextForCoordParsing = userQuery || history?.[history.length - 1]?.content || ""; // Get text to parse coords from
  console.log("Identified Concepts (Node 1):", identifiedConcepts);
  console.log("Input Text for Coord Parsing:", inputTextForCoordParsing);

  let lightragContext = null;
  let bimbaContext = null;
  let filteredSemanticContext = null;

  const parsedCoords = parseBimbaCoordinates(inputTextForCoordParsing);
  console.log("Parsed Bimba Coordinates:", parsedCoords);

  // --- 1. Call LightRAG Retrieve Tool (Python Server) ---
  try {
    console.log(`Calling LightRAG retrieve endpoint: ${LIGHTRAG_MCP_SERVER_URL}/retrieve`);
    const response = await axios.post(`${LIGHTRAG_MCP_SERVER_URL}/retrieve`, {
      query: userQuery // Pass the original user query
      // We don't pass coordinates here; LightRAG uses its own logic for 'mix' mode
    });
    if (response.data && response.data.status === 'success') {
      // Expecting the raw result from LightRAG's mix mode (likely a synthesized string or structured data)
      lightragContext = response.data.fused_context; // Using 'fused_context' key from Python response model
      console.log("Received context from LightRAG:", lightragContext ? lightragContext.substring(0, 100) + '...' : 'null'); // Log snippet
    } else {
      console.error("LightRAG retrieval failed:", response.data?.message || "Unknown error");
    }
  } catch (error) {
    console.error("Error calling LightRAG retrieve endpoint:", error.message);
    // Optionally set error state: return { error: `Failed to call LightRAG: ${error.message}` };
  }

  // --- 2. Call Bimba Graph Query Tool (Directly to Neo4j default DB) ---
  // Query based on parsed coordinates or identified concepts from Node 1
  const queryInput = parsedCoords.length > 0 ? parsedCoords[0] : identifiedConcepts?.[0]?.name; // Example: use first coord or concept
  if (queryInput && queryBimbaGraphTool) {
      try {
          console.log(`Querying Bimba graph for context related to: ${queryInput}`);
          // Example query: Get neighbors of a coordinate/concept
          const bimbaQuery = `
              MATCH (n) WHERE n.bimbaCoordinate = $input OR n.name = $input
              OPTIONAL MATCH (n)-[r]-(neighbor)
              RETURN n.name as nodeName, n.bimbaCoordinate as nodeCoord, type(r) as relType, neighbor.name as neighborName, neighbor.bimbaCoordinate as neighborCoord
              LIMIT 10
          `;
          const bimbaResultString = await queryBimbaGraphTool.invoke({
              query: bimbaQuery,
              params: { input: queryInput }
          });
          bimbaContext = JSON.parse(bimbaResultString);
          console.log("Received context from Bimba graph:", bimbaContext);
      } catch (error) {
          console.error("Error querying Bimba graph:", error);
      }
  } else {
      console.log("Skipping direct Bimba query (no input or tool unavailable).");
  }

  // --- 3. Call Coordinate-Filtered Qdrant Tool ---
  if (parsedCoords.length > 0 && searchPratibimbaContextTool) {
      try {
          console.log(`Querying Qdrant with coordinate filter: ${parsedCoords}`);
          // Use the updated searchPratibimbaContextTool with the bimba_coordinates parameter
          // Generate query vector for the filtered search
          const textToEmbedForFilter = userQuery || inputTextForCoordParsing;
          let queryVectorForFilter = null;
          if (textToEmbedForFilter && typeof embedText === 'function') {
              try {
                  queryVectorForFilter = await embedText(textToEmbedForFilter);
                  console.log("Generated query vector for filtered Qdrant search.");
              } catch (embedError) {
                  console.error("Failed to generate embedding for filtered Qdrant search:", embedError);
              }
          } else {
               console.warn("Cannot generate query vector for filtered Qdrant search (no text or embedText function unavailable).");
          }

          // Proceed only if vector generation was successful
          if (queryVectorForFilter) {
              const filteredResultString = await searchPratibimbaContextTool.invoke({
                  queryVector: queryVectorForFilter, // Pass the generated vector
                  bimba_coordinates: parsedCoords,
                  limit: 3 // Limit coordinate-specific results
              });
              filteredSemanticContext = JSON.parse(filteredResultString);
              console.log("Received coordinate-filtered context from Qdrant:", filteredSemanticContext);
          } else {
              console.warn("Skipping coordinate-filtered Qdrant search due to missing query vector.");
              filteredSemanticContext = null; // Ensure it's null if search skipped
          }
      } catch (error) {
          console.error("Error querying Qdrant with coordinate filter:", error);
          filteredSemanticContext = null; // Ensure it's null on error
      }
  } else {
       console.log("Skipping coordinate-filtered Qdrant query (no coords parsed or tool unavailable).");
       filteredSemanticContext = null; // Ensure it's null if skipped
  }


  // --- 4. Select Display Coordinate ---
  const displayCoordinate = selectDisplayCoordinate(parsedCoords, identifiedConcepts);

  // --- 5. Return Raw Contexts and Selected Coordinate ---
  // Node 3 will now handle the fusing/structuring
  return {
      lightragContext: lightragContext,
      bimbaContext: bimbaContext,
      filteredSemanticContext: filteredSemanticContext,
      displayCoordinate: displayCoordinate // Pass the selected coordinate
  };
}

export { node_2_Relate };
