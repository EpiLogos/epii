import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";
import { AppendNotionBlockSchema } from "./schemas.js";
import { zodToJsonSchema } from "../../utils/zodToJsonSchema.js";
import { Tool, ToolDependencies } from "../../types/index.js";
import { handleError } from "../../utils/error.js";

// Tool definition
export const appendNotionBlockTool: Tool = {
  name: "appendNotionBlock",
  description: "Append blocks to a Notion page.",
  inputSchema: zodToJsonSchema(AppendNotionBlockSchema),
};

/**
 * Append blocks to a Notion page
 * @param dependencies Tool dependencies
 * @param args Tool arguments
 * @returns Tool response
 */
export async function handleAppendNotionBlock(dependencies: ToolDependencies, args: any) {
  try {
    // Validate arguments
    const validatedArgs = AppendNotionBlockSchema.parse(args);
    const { notionClient } = dependencies.services;
    const logPrefix = `[appendNotionBlock]`;

    console.log(`${logPrefix} Appending blocks to page: "${validatedArgs.pageId}"`);
    console.log(`${logPrefix} Number of blocks: ${validatedArgs.blocks.length}`);

    // Append blocks
    const response = await notionClient.blocks.children.append({
      block_id: validatedArgs.pageId,
      children: validatedArgs.blocks as any
    });

    console.log(`${logPrefix} Successfully appended blocks to page: "${validatedArgs.pageId}"`);

    // Return results
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          pageId: validatedArgs.pageId,
          blocksAppended: validatedArgs.blocks.length,
          response: {
            object: response.object,
            has_more: response.has_more,
            next_cursor: response.next_cursor,
            results_count: response.results ? response.results.length : 0
          }
        }, null, 2)
      }]
    };
  } catch (error: any) {
    throw handleError(error, "appendNotionBlock");
  }
}
