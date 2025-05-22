import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";
import { SearchWebSchema } from "./schemas.js";
import { zodToJsonSchema } from "../../utils/zodToJsonSchema.js";
import { Tool, ToolDependencies } from "../../types/index.js";
import { handleError } from "../../utils/error.js";
import axios from "axios";

// Tool definition
export const searchWebTool: Tool = {
  name: "searchWeb",
  description: "Search the web for information.",
  inputSchema: zodToJsonSchema(SearchWebSchema),
};

/**
 * Search the web for information
 * @param dependencies Tool dependencies
 * @param args Tool arguments
 * @returns Tool response
 */
export async function handleSearchWeb(dependencies: ToolDependencies, args: any) {
  try {
    // Validate arguments
    const validatedArgs = SearchWebSchema.parse(args);
    const logPrefix = `[searchWeb]`;
    
    console.log(`${logPrefix} Searching for: "${validatedArgs.query}"`);
    
    // In a real implementation, we would use a search API like Google, Bing, or DuckDuckGo
    // For now, we'll simulate a search response
    
    const searchResults = [
      {
        title: "Example Search Result 1",
        url: "https://example.com/result1",
        snippet: "This is an example search result snippet that would be returned by a search engine.",
        content: validatedArgs.includeContent ? "This is the full content of the page that would be fetched if includeContent is true." : null
      },
      {
        title: "Example Search Result 2",
        url: "https://example.com/result2",
        snippet: "Another example search result snippet with different content.",
        content: validatedArgs.includeContent ? "This is the full content of the second page that would be fetched if includeContent is true." : null
      },
      {
        title: "Example Search Result 3",
        url: "https://example.com/result3",
        snippet: "A third example search result with yet more different content.",
        content: validatedArgs.includeContent ? "This is the full content of the third page that would be fetched if includeContent is true." : null
      }
    ];
    
    // Limit results
    const limitedResults = searchResults.slice(0, validatedArgs.limit);
    
    // Return results
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          query: validatedArgs.query,
          totalResults: limitedResults.length,
          includeContent: validatedArgs.includeContent,
          results: limitedResults
        }, null, 2)
      }]
    };
  } catch (error: any) {
    throw handleError(error, "searchWeb");
  }
}
