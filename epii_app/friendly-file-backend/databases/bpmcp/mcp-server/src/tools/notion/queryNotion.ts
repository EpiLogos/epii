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

    // Prepare search parameters
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
    const searchResponse = await notionClient.search(searchParams);

    console.log(`${logPrefix} Found ${searchResponse.results.length} results`);

    // Process results
    const results = searchResponse.results.map(result => {
      const processedResult: any = {
        id: result.id,
        object: result.object,
        url: (result as any).url,
        created_time: (result as any).created_time,
        last_edited_time: (result as any).last_edited_time
      };

      // Extract title based on object type
      if (result.object === 'page' && (result as any).properties && (result as any).properties.title) {
        const titleProperty = (result as any).properties.title;
        if (titleProperty.title) {
          processedResult.title = titleProperty.title.map((part: any) => part.plain_text || '').join('');
        }
      } else if (result.object === 'database' && (result as any).title) {
        const titleParts = (result as any).title.map((part: any) => part.plain_text || '');
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
          filter: validatedArgs.filter,
          sort: validatedArgs.sort,
          totalResults: results.length,
          results: results
        }, null, 2)
      }]
    };
  } catch (error: any) {
    throw handleError(error, "queryNotion");
  }
}
