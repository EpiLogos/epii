import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";
import { GetNotionPagePropertiesSchema } from "./schemas.js";
import { zodToJsonSchema } from "../../utils/zodToJsonSchema.js";
import { Tool, ToolDependencies } from "../../types/index.js";
import { handleError } from "../../utils/error.js";

// Tool definition
export const getNotionPagePropertiesTool: Tool = {
  name: "getNotionPageProperties",
  description: "Retrieve properties and content from a Notion page.",
  inputSchema: zodToJsonSchema(GetNotionPagePropertiesSchema),
};

/**
 * Retrieve properties and content from a Notion page
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

    console.log(`${logPrefix} Retrieving page properties for: "${validatedArgs.pageId}"`);

    // Get page
    const page = await notionClient.pages.retrieve({ page_id: validatedArgs.pageId }) as any;

    // Process page properties
    const properties: Record<string, any> = {};

    if (page.properties) {
      for (const [key, value] of Object.entries(page.properties as Record<string, any>)) {
        // Process different property types
        switch (value.type) {
          case 'title':
            properties[key] = {
              type: 'title',
              value: value.title.map((part: any) => part.plain_text).join('')
            };
            break;
          case 'rich_text':
            properties[key] = {
              type: 'rich_text',
              value: value.rich_text.map((part: any) => part.plain_text).join('')
            };
            break;
          case 'number':
            properties[key] = {
              type: 'number',
              value: value.number
            };
            break;
          case 'select':
            properties[key] = {
              type: 'select',
              value: value.select ? value.select.name : null
            };
            break;
          case 'multi_select':
            properties[key] = {
              type: 'multi_select',
              value: value.multi_select.map((option: any) => option.name)
            };
            break;
          case 'date':
            properties[key] = {
              type: 'date',
              value: value.date
            };
            break;
          case 'people':
            properties[key] = {
              type: 'people',
              value: value.people.map((person: any) => ({
                id: person.id,
                name: person.name
              }))
            };
            break;
          case 'files':
            properties[key] = {
              type: 'files',
              value: value.files.map((file: any) => ({
                name: file.name,
                type: file.type,
                url: file.type === 'external' ? file.external.url : file.file.url
              }))
            };
            break;
          case 'checkbox':
            properties[key] = {
              type: 'checkbox',
              value: value.checkbox
            };
            break;
          case 'url':
            properties[key] = {
              type: 'url',
              value: value.url
            };
            break;
          case 'email':
            properties[key] = {
              type: 'email',
              value: value.email
            };
            break;
          case 'phone_number':
            properties[key] = {
              type: 'phone_number',
              value: value.phone_number
            };
            break;
          case 'formula':
            properties[key] = {
              type: 'formula',
              value: value.formula.type === 'string' ? value.formula.string :
                    value.formula.type === 'number' ? value.formula.number :
                    value.formula.type === 'boolean' ? value.formula.boolean :
                    value.formula.type === 'date' ? value.formula.date : null
            };
            break;
          default:
            properties[key] = {
              type: value.type,
              value: null
            };
        }
      }
    }

    // Get page content if requested
    let content = null;
    if (validatedArgs.includeContent) {
      const blocks = await notionClient.blocks.children.list({
        block_id: validatedArgs.pageId,
        page_size: 100
      });

      content = blocks.results;
    }

    // Get file content if requested
    let fileContent = null;
    if (validatedArgs.includeFileContent && validatedArgs.filePropertyName) {
      if (properties[validatedArgs.filePropertyName] &&
          properties[validatedArgs.filePropertyName].type === 'files' &&
          properties[validatedArgs.filePropertyName].value.length > 0) {

        const fileUrl = properties[validatedArgs.filePropertyName].value[0].url;

        // In a real implementation, we would fetch the file content here
        // For now, just return the URL
        fileContent = {
          url: fileUrl,
          message: "File content fetching not implemented in this version"
        };
      }
    }

    // Return results
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          id: page.id,
          url: (page as any).url,
          created_time: (page as any).created_time,
          last_edited_time: (page as any).last_edited_time,
          properties: properties,
          content: content,
          fileContent: fileContent
        }, null, 2)
      }]
    };
  } catch (error: any) {
    throw handleError(error, "getNotionPageProperties");
  }
}
