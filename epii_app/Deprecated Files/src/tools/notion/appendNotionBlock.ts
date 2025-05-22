import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";
import { AppendNotionBlockSchema } from "./schemas.js";
import { zodToJsonSchema } from "../../utils/zodToJsonSchema.js";
import { Tool, ToolDependencies } from "../../types/index.js";
import { handleError } from "../../utils/error.js";

// Tool definition
export const appendNotionBlockTool: Tool = {
  name: "appendNotionBlock",
  description: "Appends content blocks to a specified Notion page.",
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
    
    console.log(`${logPrefix} Appending blocks to page: ${validatedArgs.notionPageId}`);
    
    // Clean up page ID (remove hyphens if present)
    const pageId = validatedArgs.notionPageId.replace(/-/g, '');
    
    // Convert blocks to Notion format
    const notionBlocks = validatedArgs.blocks.map(block => {
      const richText = [{ type: "text", text: { content: block.content } }];
      
      switch (block.type) {
        case "paragraph":
          return {
            type: "paragraph",
            paragraph: { rich_text: richText }
          };
        case "heading_1":
          return {
            type: "heading_1",
            heading_1: { rich_text: richText }
          };
        case "heading_2":
          return {
            type: "heading_2",
            heading_2: { rich_text: richText }
          };
        case "heading_3":
          return {
            type: "heading_3",
            heading_3: { rich_text: richText }
          };
        case "bulleted_list_item":
          return {
            type: "bulleted_list_item",
            bulleted_list_item: { rich_text: richText }
          };
        case "numbered_list_item":
          return {
            type: "numbered_list_item",
            numbered_list_item: { rich_text: richText }
          };
        case "to_do":
          return {
            type: "to_do",
            to_do: { rich_text: richText, checked: false }
          };
        case "toggle":
          return {
            type: "toggle",
            toggle: { rich_text: richText }
          };
        case "code":
          return {
            type: "code",
            code: { rich_text: richText, language: "plain text" }
          };
        case "quote":
          return {
            type: "quote",
            quote: { rich_text: richText }
          };
        case "divider":
          return {
            type: "divider",
            divider: {}
          };
        default:
          return {
            type: "paragraph",
            paragraph: { rich_text: richText }
          };
      }
    });
    
    // Append blocks to page
    try {
      const response = await notionClient.blocks.children.append({
        block_id: pageId,
        children: notionBlocks
      });
      
      console.log(`${logPrefix} Successfully appended ${notionBlocks.length} blocks to page ${validatedArgs.notionPageId}`);
      
      // Return results
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            pageId: validatedArgs.notionPageId,
            blocksAppended: notionBlocks.length,
            success: true
          }, null, 2)
        }]
      };
    } catch (notionError: any) {
      console.error(`${logPrefix} Error appending blocks to Notion page:`, notionError);
      throw new McpError(ErrorCode.InternalError, `Failed to append blocks to Notion page: ${notionError.message}`);
    }
  } catch (error: any) {
    throw handleError(error, "appendNotionBlock");
  }
}
