import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";
import { GetNotionPagePropertiesSchema } from "./schemas.js";
import { zodToJsonSchema } from "../../utils/zodToJsonSchema.js";
import { Tool, ToolDependencies } from "../../types/index.js";
import { handleError } from "../../utils/error.js";
import axios from "axios";

// Tool definition
export const getNotionPagePropertiesTool: Tool = {
  name: "getNotionPageProperties",
  description: "Retrieves specific properties (title, content body text, visual encapsulation URL, page URL) for a given Notion page ID. Optionally fetches file content from a specified property.",
  inputSchema: zodToJsonSchema(GetNotionPagePropertiesSchema),
};

/**
 * Get properties of a Notion page
 * @param dependencies Tool dependencies
 * @param args Tool arguments
 * @returns Tool response
 */
export async function handleGetNotionPageProperties(dependencies: ToolDependencies, args: any) {
  try {
    // Validate arguments
    const validatedArgs = GetNotionPagePropertiesSchema.parse(args);
    const { notionClient } = dependencies.services;
    const logPrefix = `[getNotionPageProperties]`;
    
    console.log(`${logPrefix} Retrieving properties for page: ${validatedArgs.notionPageId}`);
    
    // Clean up page ID (remove hyphens if present)
    const pageId = validatedArgs.notionPageId.replace(/-/g, '');
    
    // Retrieve page
    try {
      const page = await notionClient.pages.retrieve({ page_id: pageId });
      
      // Extract properties
      const properties: any = {};
      
      // Process each property
      for (const [key, value] of Object.entries(page.properties)) {
        const property = value as any;
        
        switch (property.type) {
          case 'title':
            properties[key] = property.title.map((part: any) => part.plain_text || '').join('');
            break;
          case 'rich_text':
            properties[key] = property.rich_text.map((part: any) => part.plain_text || '').join('');
            break;
          case 'number':
            properties[key] = property.number;
            break;
          case 'select':
            properties[key] = property.select?.name || null;
            break;
          case 'multi_select':
            properties[key] = property.multi_select.map((option: any) => option.name);
            break;
          case 'date':
            properties[key] = property.date;
            break;
          case 'checkbox':
            properties[key] = property.checkbox;
            break;
          case 'url':
            properties[key] = property.url;
            break;
          case 'email':
            properties[key] = property.email;
            break;
          case 'phone_number':
            properties[key] = property.phone_number;
            break;
          case 'files':
            properties[key] = property.files.map((file: any) => ({
              name: file.name,
              type: file.type,
              url: file.type === 'external' ? file.external.url : file.file.url
            }));
            break;
          default:
            properties[key] = 'Unsupported property type: ' + property.type;
        }
      }
      
      // Fetch file content if requested
      let fileContent = null;
      if (validatedArgs.fetchFileFromProperty && properties[validatedArgs.fetchFileFromProperty]) {
        const files = properties[validatedArgs.fetchFileFromProperty];
        if (Array.isArray(files) && files.length > 0) {
          const fileUrl = files[0].url;
          try {
            const response = await axios.get(fileUrl);
            fileContent = response.data;
            console.log(`${logPrefix} Successfully fetched file content from ${fileUrl}`);
          } catch (fileError: any) {
            console.error(`${logPrefix} Error fetching file content:`, fileError);
            fileContent = `Error fetching file: ${fileError.message}`;
          }
        }
      }
      
      // Fetch page content (blocks)
      const blocks = await notionClient.blocks.children.list({
        block_id: pageId,
        page_size: 100
      });
      
      // Process blocks to extract text content
      const extractTextFromBlocks = (blocks: any[]): string => {
        let text = '';
        
        for (const block of blocks) {
          if (block.type === 'paragraph') {
            text += block.paragraph.rich_text.map((part: any) => part.plain_text || '').join('') + '\n\n';
          } else if (block.type === 'heading_1') {
            text += '# ' + block.heading_1.rich_text.map((part: any) => part.plain_text || '').join('') + '\n\n';
          } else if (block.type === 'heading_2') {
            text += '## ' + block.heading_2.rich_text.map((part: any) => part.plain_text || '').join('') + '\n\n';
          } else if (block.type === 'heading_3') {
            text += '### ' + block.heading_3.rich_text.map((part: any) => part.plain_text || '').join('') + '\n\n';
          } else if (block.type === 'bulleted_list_item') {
            text += '• ' + block.bulleted_list_item.rich_text.map((part: any) => part.plain_text || '').join('') + '\n';
          } else if (block.type === 'numbered_list_item') {
            text += '1. ' + block.numbered_list_item.rich_text.map((part: any) => part.plain_text || '').join('') + '\n';
          } else if (block.type === 'to_do') {
            const checkbox = block.to_do.checked ? '[x]' : '[ ]';
            text += checkbox + ' ' + block.to_do.rich_text.map((part: any) => part.plain_text || '').join('') + '\n';
          } else if (block.type === 'toggle') {
            text += '▶ ' + block.toggle.rich_text.map((part: any) => part.plain_text || '').join('') + '\n';
          } else if (block.type === 'code') {
            text += '```' + (block.code.language || '') + '\n';
            text += block.code.rich_text.map((part: any) => part.plain_text || '').join('') + '\n';
            text += '```\n\n';
          } else if (block.type === 'quote') {
            text += '> ' + block.quote.rich_text.map((part: any) => part.plain_text || '').join('') + '\n\n';
          } else if (block.type === 'divider') {
            text += '---\n\n';
          }
        }
        
        return text;
      };
      
      const pageContent = extractTextFromBlocks(blocks.results);
      
      // Return results
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            id: page.id,
            url: page.url,
            created_time: page.created_time,
            last_edited_time: page.last_edited_time,
            properties: properties,
            content: pageContent,
            fileContent: fileContent
          }, null, 2)
        }]
      };
    } catch (notionError: any) {
      console.error(`${logPrefix} Error retrieving Notion page:`, notionError);
      throw new McpError(ErrorCode.InternalError, `Failed to retrieve Notion page: ${notionError.message}`);
    }
  } catch (error: any) {
    throw handleError(error, "getNotionPageProperties");
  }
}
