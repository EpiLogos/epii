import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";
import { CrystallizeToNotionSchema } from "./schemas.js";
import { zodToJsonSchema } from "../../utils/zodToJsonSchema.js";
import { Tool, ToolDependencies } from "../../types/index.js";
import { handleError } from "../../utils/error.js";

// Tool definition
export const crystallizeToNotionTool: Tool = {
  name: "crystallizeToNotion",
  description: "Appends text content (as blocks) to the Notion page linked to a target Bimba Coordinate.",
  inputSchema: zodToJsonSchema(CrystallizeToNotionSchema),
};

/**
 * Crystallize content to a Notion page linked to a Bimba coordinate
 * @param dependencies Tool dependencies
 * @param args Tool arguments
 * @returns Tool response
 */
export async function handleCrystallizeToNotion(dependencies: ToolDependencies, args: any) {
  try {
    // Validate arguments
    const validatedArgs = CrystallizeToNotionSchema.parse(args);
    const { neo4jDriver } = dependencies.db;
    const { notionClient } = dependencies.services;
    const logPrefix = `[crystallizeToNotion]`;
    
    console.log(`${logPrefix} Processing for Bimba coordinate: ${validatedArgs.targetBimbaCoordinate}`);
    
    // 1. Find the Neo4j node with the given Bimba coordinate
    const session = neo4jDriver.session();
    
    try {
      // Query for the node with the given Bimba coordinate
      const nodeQuery = `
        MATCH (n)
        WHERE n.bimbaCoordinate = $coordinate
        RETURN n
      `;
      
      const nodeResult = await session.run(nodeQuery, {
        coordinate: validatedArgs.targetBimbaCoordinate
      });
      
      if (nodeResult.records.length === 0) {
        throw new McpError(ErrorCode.NotFound, `No node found with Bimba coordinate: ${validatedArgs.targetBimbaCoordinate}`);
      }
      
      const node = nodeResult.records[0].get('n');
      
      // 2. Check if the node has a notionPageId property
      if (!node.properties.notionPageId) {
        throw new McpError(ErrorCode.NotFound, `Node with Bimba coordinate ${validatedArgs.targetBimbaCoordinate} does not have a linked Notion page`);
      }
      
      const notionPageId = node.properties.notionPageId;
      console.log(`${logPrefix} Found Notion page ID: ${notionPageId}`);
      
      // 3. Parse the content to append into blocks
      const contentLines = validatedArgs.contentToAppend.split('\n');
      const blocks = [];
      
      let currentBlock = { type: 'paragraph', content: '' };
      
      for (const line of contentLines) {
        // Check for headings
        if (line.startsWith('# ')) {
          if (currentBlock.content) {
            blocks.push({ ...currentBlock });
            currentBlock = { type: 'paragraph', content: '' };
          }
          blocks.push({ type: 'heading_1', content: line.substring(2) });
        } else if (line.startsWith('## ')) {
          if (currentBlock.content) {
            blocks.push({ ...currentBlock });
            currentBlock = { type: 'paragraph', content: '' };
          }
          blocks.push({ type: 'heading_2', content: line.substring(3) });
        } else if (line.startsWith('### ')) {
          if (currentBlock.content) {
            blocks.push({ ...currentBlock });
            currentBlock = { type: 'paragraph', content: '' };
          }
          blocks.push({ type: 'heading_3', content: line.substring(4) });
        } else if (line.startsWith('- ') || line.startsWith('* ')) {
          if (currentBlock.content) {
            blocks.push({ ...currentBlock });
            currentBlock = { type: 'paragraph', content: '' };
          }
          blocks.push({ type: 'bulleted_list_item', content: line.substring(2) });
        } else if (line.match(/^\d+\. /)) {
          if (currentBlock.content) {
            blocks.push({ ...currentBlock });
            currentBlock = { type: 'paragraph', content: '' };
          }
          blocks.push({ type: 'numbered_list_item', content: line.substring(line.indexOf('. ') + 2) });
        } else if (line === '---') {
          if (currentBlock.content) {
            blocks.push({ ...currentBlock });
            currentBlock = { type: 'paragraph', content: '' };
          }
          blocks.push({ type: 'divider', content: '' });
        } else if (line.startsWith('> ')) {
          if (currentBlock.content) {
            blocks.push({ ...currentBlock });
            currentBlock = { type: 'paragraph', content: '' };
          }
          blocks.push({ type: 'quote', content: line.substring(2) });
        } else if (line.trim() === '') {
          if (currentBlock.content) {
            blocks.push({ ...currentBlock });
            currentBlock = { type: 'paragraph', content: '' };
          }
        } else {
          if (currentBlock.content) {
            currentBlock.content += '\n' + line;
          } else {
            currentBlock.content = line;
          }
        }
      }
      
      // Add the last block if it has content
      if (currentBlock.content) {
        blocks.push(currentBlock);
      }
      
      // 4. Append the blocks to the Notion page
      const notionBlocks = blocks.map(block => {
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
          case "divider":
            return {
              type: "divider",
              divider: {}
            };
          case "quote":
            return {
              type: "quote",
              quote: { rich_text: richText }
            };
          default:
            return {
              type: "paragraph",
              paragraph: { rich_text: richText }
            };
        }
      });
      
      try {
        const response = await notionClient.blocks.children.append({
          block_id: notionPageId,
          children: notionBlocks
        });
        
        console.log(`${logPrefix} Successfully appended ${notionBlocks.length} blocks to Notion page ${notionPageId}`);
        
        // Return results
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              bimbaCoordinate: validatedArgs.targetBimbaCoordinate,
              notionPageId: notionPageId,
              blocksAppended: notionBlocks.length,
              success: true
            }, null, 2)
          }]
        };
      } catch (notionError: any) {
        console.error(`${logPrefix} Error appending blocks to Notion page:`, notionError);
        throw new McpError(ErrorCode.InternalError, `Failed to append blocks to Notion page: ${notionError.message}`);
      }
    } finally {
      await session.close();
    }
  } catch (error: any) {
    throw handleError(error, "crystallizeToNotion");
  }
}
