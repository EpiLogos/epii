import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";
import { QueryNotionSchema } from "./schemas.js";
import { zodToJsonSchema } from "../../utils/zodToJsonSchema.js";
import { Tool, ToolDependencies } from "../../types/index.js";
import { handleError } from "../../utils/error.js";

// Tool definition
export const queryNotionTool: Tool = {
  name: "queryNotion",
  description: "Search for pages and databases in Notion.",
  inputSchema: zodToJsonSchema(QueryNotionSchema),
};

/**
 * Search for pages and databases in Notion
 * @param dependencies Tool dependencies
 * @param args Tool arguments
 * @returns Tool response
 */
export async function handleQueryNotion(dependencies: ToolDependencies, args: any) {
  try {
    // Validate arguments
    const validatedArgs = QueryNotionSchema.parse(args);
    const { notionClient } = dependencies.services;
    const logPrefix = `[queryNotion]`;
    
    console.log(`${logPrefix} Searching Notion for: "${validatedArgs.query}"`);
    
    // Build search parameters
    const searchParams: any = {
      query: validatedArgs.query,
      page_size: validatedArgs.limit
    };
    
    if (validatedArgs.filter) {
      searchParams.filter = {
        property: validatedArgs.filter.property,
        value: validatedArgs.filter.value
      };
    }
    
    if (validatedArgs.sort) {
      searchParams.sort = {
        direction: validatedArgs.sort.direction,
        timestamp: validatedArgs.sort.timestamp
      };
    }
    
    // Execute search
    try {
      const response = await notionClient.search(searchParams);
      
      console.log(`${logPrefix} Found ${response.results.length} results`);
      
      // Process results
      const results = response.results.map(result => {
        const processedResult: any = {
          id: result.id,
          url: result.url,
          created_time: result.created_time,
          last_edited_time: result.last_edited_time,
          object: result.object
        };
        
        // Add title if available
        if (result.object === 'page' && result.properties && result.properties.title) {
          const titleProperty = result.properties.title;
          if (titleProperty.title && Array.isArray(titleProperty.title)) {
            const titleParts = titleProperty.title.map((part: any) => part.plain_text || '');
            processedResult.title = titleParts.join('');
          }
        } else if (result.object === 'database' && result.title) {
          const titleParts = result.title.map((part: any) => part.plain_text || '');
          processedResult.title = titleParts.join('');
        }
        
        return processedResult;
      });
      
      // Return results
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            query: validatedArgs.query,
            totalResults: results.length,
            hasMore: response.has_more,
            nextCursor: response.next_cursor,
            results: results
          }, null, 2)
        }]
      };
    } catch (searchError: any) {
      console.error(`${logPrefix} Error searching Notion:`, searchError);
      throw new McpError(ErrorCode.InternalError, `Failed to search Notion: ${searchError.message}`);
    }
  } catch (error: any) {
    throw handleError(error, "queryNotion");
  }
}
