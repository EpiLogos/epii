import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { qdrantClient, QDRANT_COLLECTION_NAME } from "../../services/qdrant.service.mjs"; // Import the initialized client and collection name

// Define the Zod schema for the tool's input
const searchPratibimbaSchema = z.object({
  queryVector: z.array(z.number()).describe("The embedding vector representing the search query."),
  // Simplified schema: Removed .int() and .optional()
  limit: z.number().describe("The maximum number of results to return (e.g., 5)."), 
  // Simplified schema: Removed .optional()
  qlTags: z.array(z.string()).describe("List of QL tags to filter results (use empty array if none)."),
  // Simplified schema: Removed .optional()
  bimba_coordinates: z.array(z.string()).describe("List of Bimba coordinates to filter results (use empty array if none).")
});

// Create the DynamicStructuredTool
const searchPratibimbaContextTool = new DynamicStructuredTool({
  name: "searchPratibimbaContext",
  description: "Searches the Pratibimba semantic vector store (Qdrant) for contextually relevant information based on a query vector. Can be filtered by QL tags and/or Bimba coordinates.",
  schema: searchPratibimbaSchema,
  // Handle optional parameters and default limit within the function logic
  func: async ({ queryVector, limit, qlTags, bimba_coordinates }) => { 
    const effectiveLimit = limit ?? 5; // Default limit if not provided
    console.log(`Searching Pratibimba (Qdrant) with limit: ${effectiveLimit}`); // Log the action and limit
    if (!qdrantClient) {
      return "Error: QdrantClient instance is not available. Check Qdrant service initialization.";
    }

    // Construct the Qdrant filter based on provided tags/coordinates
    const filterConditions = {
        must: [],
        should: []
    };

    // Add Bimba coordinate filter (MUST match at least one) - Check if array exists and has elements
    if (Array.isArray(bimba_coordinates) && bimba_coordinates.length > 0) {
        // Qdrant requires a 'should' inside a 'must' to achieve "match at least one" logic for a specific field
        filterConditions.must.push({
            should: bimba_coordinates.map(coord => ({
                key: "bimba_coordinates", // Field name in Qdrant payload
                match: {
                    value: coord // Match exact coordinate string
                }
            }))
        });
        console.log("Applying Bimba Coordinate Filter (must match one of):", JSON.stringify(bimba_coordinates));
    }

    // Add QL tag filter (SHOULD match at least one) - Check if array exists and has elements
    if (Array.isArray(qlTags) && qlTags.length > 0) {
        filterConditions.should = qlTags.map(tag => ({
            key: "ql_tags", // Assuming metadata field is named 'ql_tags'
            match: {
                value: tag
            }
        }));
        console.log("Applying QL Tag Filter (should match one of):", JSON.stringify(qlTags));
    }

    // Construct the final filter object for Qdrant client
    let searchFilter = {};
    if (filterConditions.must.length > 0) {
        searchFilter.must = filterConditions.must;
    }
    if (filterConditions.should.length > 0) {
        searchFilter.should = filterConditions.should;
    }
    // If both must and should are empty, searchFilter remains {} (no filter)
    if (Object.keys(searchFilter).length === 0) {
        searchFilter = undefined; // Qdrant client expects undefined for no filter
    } else {
         console.log("Final Qdrant Filter:", JSON.stringify(searchFilter));
    }

    try {
      const searchResult = await qdrantClient.search(QDRANT_COLLECTION_NAME, {
        vector: queryVector,
        limit: effectiveLimit, // Use effective limit
        filter: searchFilter,
        with_payload: true, // Include metadata payload in results
        // score_threshold: 0.5 // Optional: set a minimum similarity score
      });

      // Convert the result to a JSON string for the LLM
      // Consider summarizing or extracting key info if results are too verbose
      return JSON.stringify(searchResult, null, 2); // Pretty print JSON
    } catch (error) {
      console.error("Error searching Qdrant via LangChain tool:", error);
      // Return a meaningful error message string to the LLM
      return `Error searching Qdrant: ${error.message}`;
    }
  },
});

export { searchPratibimbaContextTool };
