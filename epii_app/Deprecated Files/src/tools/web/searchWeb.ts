import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";
import { SearchWebSchema } from "./schemas.js";
import { zodToJsonSchema } from "../../utils/zodToJsonSchema.js";
import { Tool, ToolDependencies } from "../../types/index.js";
import { handleError } from "../../utils/error.js";
import axios from "axios";

// Tool definition
export const searchWebTool: Tool = {
  name: "searchWeb",
  description: "Search the web for information on a given query.",
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
    
    // Get Brave API key from environment
    const braveApiKey = process.env.BRAVE_API_KEY;
    if (!braveApiKey) {
      throw new McpError(ErrorCode.InternalError, "Brave API key not found in environment variables");
    }
    
    // Build search parameters
    const searchParams = new URLSearchParams({
      q: validatedArgs.query,
      count: validatedArgs.limit.toString(),
      search_lang: 'en',
      safesearch: validatedArgs.safeSearch ? '1' : '0'
    });
    
    if (validatedArgs.country) {
      searchParams.append('country', validatedArgs.country);
    }
    
    if (validatedArgs.timeRange) {
      let tbs = '';
      switch (validatedArgs.timeRange) {
        case 'day':
          tbs = 'qdr:d';
          break;
        case 'week':
          tbs = 'qdr:w';
          break;
        case 'month':
          tbs = 'qdr:m';
          break;
        case 'year':
          tbs = 'qdr:y';
          break;
      }
      if (tbs) {
        searchParams.append('tbs', tbs);
      }
    }
    
    // Execute search
    try {
      const response = await axios.get(`https://api.search.brave.com/res/v1/web/search?${searchParams.toString()}`, {
        headers: {
          'Accept': 'application/json',
          'Accept-Encoding': 'gzip',
          'X-Subscription-Token': braveApiKey
        }
      });
      
      const searchResults = response.data;
      
      console.log(`${logPrefix} Found ${searchResults.web?.results?.length || 0} web results`);
      
      // Process results
      const results = searchResults.web?.results?.map((result: any) => {
        return {
          title: result.title,
          url: result.url,
          description: result.description,
          published: result.published_date,
          favicon: result.favicon_url
        };
      }) || [];
      
      // Return results
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            query: validatedArgs.query,
            totalResults: results.length,
            results: results
          }, null, 2)
        }]
      };
    } catch (searchError: any) {
      console.error(`${logPrefix} Error searching web:`, searchError);
      throw new McpError(ErrorCode.InternalError, `Failed to search web: ${searchError.message}`);
    }
  } catch (error: any) {
    throw handleError(error, "searchWeb");
  }
}
