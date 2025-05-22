import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";
import { CrystallizeToNotionSchema } from "./schemas.js";
import { zodToJsonSchema } from "../../utils/zodToJsonSchema.js";
import { Tool, ToolDependencies } from "../../types/index.js";
import { handleError } from "../../utils/error.js";

// Tool definition
export const crystallizeToNotionTool: Tool = {
  name: "crystallizeToNotion",
  description: "Crystallize content to a Notion page linked to a Bimba coordinate. Can create new pages, update properties, and establish relations with other Notion databases.",
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

    console.log(`${logPrefix} Crystallizing content to Bimba coordinate: "${validatedArgs.targetBimbaCoordinate}"`);

    // Create Neo4j session
    const session = neo4jDriver.session();

    try {
      // 1. Find the node with the target Bimba coordinate
      const findNodeQuery = `
        MATCH (n)
        WHERE n.bimbaCoordinate = $bimbaCoordinate
        RETURN n, n.notionPageId as notionPageId, n.name as nodeName, labels(n) as nodeLabels
      `;

      const findNodeResult = await session.run(findNodeQuery, {
        bimbaCoordinate: validatedArgs.targetBimbaCoordinate
      });

      if (findNodeResult.records.length === 0) {
        if (!validatedArgs.createIfNotExists) {
          throw new McpError(ErrorCode.MethodNotFound, `No node found with Bimba coordinate: ${validatedArgs.targetBimbaCoordinate}`);
        }

        // Create a new Neo4j node for this Bimba coordinate
        console.log(`${logPrefix} Creating new Neo4j node for Bimba coordinate: ${validatedArgs.targetBimbaCoordinate}`);

        const createNodeQuery = `
          CREATE (n:Node:BimbaNode {
            bimbaCoordinate: $bimbaCoordinate,
            name: $name,
            createdAt: datetime(),
            description: $description
          })
          RETURN n
        `;

        const createNodeResult = await session.run(createNodeQuery, {
          bimbaCoordinate: validatedArgs.targetBimbaCoordinate,
          name: validatedArgs.title || `Node ${validatedArgs.targetBimbaCoordinate}`,
          description: `Node for ${validatedArgs.targetBimbaCoordinate} created by crystallizeToNotion tool`
        });

        if (createNodeResult.records.length === 0) {
          throw new McpError(ErrorCode.InternalError, `Failed to create Neo4j node for Bimba coordinate: ${validatedArgs.targetBimbaCoordinate}`);
        }
      }

      // Extract node information
      const nodeName = findNodeResult.records.length > 0 ? findNodeResult.records[0].get('nodeName') : null;
      const nodeLabels = findNodeResult.records.length > 0 ? findNodeResult.records[0].get('nodeLabels') : [];

      // Check if the node has a Notion page ID
      let notionPageId = findNodeResult.records.length > 0 ? findNodeResult.records[0].get('notionPageId') : null;

      // If no Notion page ID and createIfNotExists is true, create a new Notion page
      if (!notionPageId && validatedArgs.createIfNotExists) {
        console.log(`${logPrefix} No Notion page found. Creating new page for Bimba coordinate: ${validatedArgs.targetBimbaCoordinate}`);

        // Get the Content Nodes database ID
        // This should be configured or retrieved from a mapping
        const contentNodesDbId = "1caa4797-123c-8027-a842-d4cd86b4b36a"; // From notion_workspace_map.md

        if (!contentNodesDbId) {
          throw new McpError(ErrorCode.InternalError, "Content Nodes database ID not configured");
        }

        // Prepare the page properties
        const pageProperties: any = {
          "Node Name": {
            title: [{
              text: {
                content: validatedArgs.title || nodeName || `Node ${validatedArgs.targetBimbaCoordinate}`
              }
            }]
          },
          "Bimba Coordinate": {
            rich_text: [{
              text: {
                content: validatedArgs.targetBimbaCoordinate
              }
            }]
          }
        };

        // Add node type if available
        if (nodeLabels && nodeLabels.length > 0) {
          pageProperties["Node Type"] = {
            select: {
              name: nodeLabels.filter((label: string) => label !== 'Node').join(', ') || 'Node'
            }
          };
        }

        // Add custom properties if provided
        if (validatedArgs.properties) {
          Object.entries(validatedArgs.properties).forEach(([key, value]) => {
            pageProperties[key] = formatPropertyValue(key, value);
          });
        }

        // Create the page
        try {
          const createPageResponse = await notionClient.pages.create({
            parent: { database_id: contentNodesDbId },
            properties: pageProperties
          });

          notionPageId = createPageResponse.id;
          console.log(`${logPrefix} Created new Notion page with ID: ${notionPageId}`);

          // Update the Neo4j node with the Notion page ID
          const updateNodeQuery = `
            MATCH (n)
            WHERE n.bimbaCoordinate = $bimbaCoordinate
            SET n.notionPageId = $notionPageId
            RETURN n
          `;

          await session.run(updateNodeQuery, {
            bimbaCoordinate: validatedArgs.targetBimbaCoordinate,
            notionPageId: notionPageId
          });

          console.log(`${logPrefix} Updated Neo4j node with Notion page ID: ${notionPageId}`);
        } catch (error) {
          console.error(`${logPrefix} Error creating Notion page:`, error);
          throw new McpError(ErrorCode.InternalError, `Failed to create Notion page: ${error instanceof Error ? error.message : String(error)}`);
        }
      } else if (!notionPageId) {
        throw new McpError(ErrorCode.MethodNotFound, `Node with Bimba coordinate ${validatedArgs.targetBimbaCoordinate} does not have a linked Notion page`);
      }

      console.log(`${logPrefix} Using Notion page ID: ${notionPageId}`);

      // 2. Convert content to Notion blocks based on format
      const contentToAppend = validatedArgs.contentToAppend;
      const notionBlocks = validatedArgs.contentFormat === "markdown"
        ? convertMarkdownToNotionBlocks(contentToAppend)
        : convertTextToNotionBlocks(contentToAppend);

      // 3. Append blocks to Notion page
      const response = await notionClient.blocks.children.append({
        block_id: notionPageId,
        children: notionBlocks as any
      });

      console.log(`${logPrefix} Successfully appended ${notionBlocks.length} blocks to Notion page: "${notionPageId}"`);

      // 4. Update page properties if provided
      if (validatedArgs.properties && Object.keys(validatedArgs.properties).length > 0) {
        console.log(`${logPrefix} Updating page properties`);

        const formattedProperties: any = {};

        Object.entries(validatedArgs.properties).forEach(([key, value]) => {
          formattedProperties[key] = formatPropertyValue(key, value);
        });

        await notionClient.pages.update({
          page_id: notionPageId,
          properties: formattedProperties
        });

        console.log(`${logPrefix} Successfully updated page properties`);
      }

      // 5. Establish relations if provided
      if (validatedArgs.relations && validatedArgs.relations.length > 0) {
        console.log(`${logPrefix} Establishing relations`);

        for (const relation of validatedArgs.relations) {
          try {
            // Format the relation property
            const relationProperty = {
              [relation.property]: {
                relation: relation.targetPages.map(page => ({ id: page.id }))
              }
            };

            // Update the page with the relation
            await notionClient.pages.update({
              page_id: notionPageId,
              properties: relationProperty
            });

            console.log(`${logPrefix} Established relation to ${relation.database} via property ${relation.property}`);
          } catch (error) {
            console.error(`${logPrefix} Error establishing relation:`, error);
            // Continue with other relations even if one fails
          }
        }
      }

      // Format the Notion URL correctly
      let notionUrl;
      if (notionPageId) {
        // Check if it's already a full URL
        if (notionPageId.startsWith('http')) {
          notionUrl = notionPageId;
        }
        // Check if it's a UUID with hyphens
        else if (notionPageId.includes('-')) {
          // Standard UUID format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
          // Notion URL format: https://www.notion.so/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
          const cleanId = notionPageId.replace(/-/g, '');
          notionUrl = `https://www.notion.so/${cleanId}`;
        }
        // Otherwise assume it's already a clean ID
        else {
          notionUrl = `https://www.notion.so/${notionPageId}`;
        }
      }

      // 6. Return results
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            success: true,
            bimbaCoordinate: validatedArgs.targetBimbaCoordinate,
            notionPageId: notionPageId,
            contentLength: contentToAppend.length,
            blocksAppended: notionBlocks.length,
            propertiesUpdated: validatedArgs.properties ? Object.keys(validatedArgs.properties).length : 0,
            relationsEstablished: validatedArgs.relations ? validatedArgs.relations.length : 0,
            url: notionUrl
          }, null, 2)
        }]
      };
    } finally {
      await session.close();
    }
  } catch (error: any) {
    throw handleError(error, "crystallizeToNotion");
  }
}

/**
 * Format property value based on property type
 * @param key Property key
 * @param value Property value
 * @returns Formatted property value for Notion API
 */
function formatPropertyValue(key: string, value: any): any {
  // Handle different property types based on the key or value type
  if (key === "Semantic Framework" || key === "Symbolic Anchors" || key === "Conceptual Framework" || key === "🗺️ Bimba Address") {
    // These are relation properties
    return {
      relation: Array.isArray(value)
        ? value.map(id => typeof id === 'object' ? id : { id: id.toString() })
        : [{ id: value.toString() }]
    };
  }

  if (key === "Logic Operators" || key === "Tags") {
    // These are multi-select properties
    return {
      multi_select: Array.isArray(value)
        ? value.map(name => typeof name === 'object' ? name : { name: name.toString() })
        : [{ name: value.toString() }]
    };
  }

  if (key === "Content Type" || key === "Visual Theme") {
    // These are select properties
    return {
      select: { name: value.toString() }
    };
  }

  if (key === "Status") {
    // This is a status property
    return {
      status: {
        name: value.status?.name || value.toString()
      }
    };
  }

  if (key === "Creation Date" || key === "Last Updated") {
    // These are date properties
    const dateValue = value instanceof Date ? value : new Date(value);
    return {
      date: { start: dateValue.toISOString() }
    };
  }

  if (key === "Content Body") {
    // This is a rich text property
    return {
      rich_text: [{ text: { content: value.toString() } }]
    };
  }

  if (key === "Epistemic Weight") {
    // This is a number property
    return {
      number: parseFloat(value)
    };
  }

  // Default to rich text for unknown property types
  return {
    rich_text: [{ text: { content: value.toString() } }]
  };
}

/**
 * Convert text content to Notion blocks
 * @param text Text content to convert
 * @returns Array of Notion blocks
 */
function convertTextToNotionBlocks(text: string): any[] {
  const lines = text.split('\n');
  const blocks: any[] = [];

  let currentListType: string | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line === '') {
      // Add a paragraph block for empty lines
      blocks.push({
        type: 'paragraph',
        paragraph: {
          rich_text: []
        }
      });
      continue;
    }

    // Check for headings
    if (line.startsWith('# ')) {
      blocks.push({
        type: 'heading_1',
        heading_1: {
          rich_text: [{
            type: 'text',
            text: {
              content: line.substring(2)
            }
          }]
        }
      });
      currentListType = null;
      continue;
    }

    if (line.startsWith('## ')) {
      blocks.push({
        type: 'heading_2',
        heading_2: {
          rich_text: [{
            type: 'text',
            text: {
              content: line.substring(3)
            }
          }]
        }
      });
      currentListType = null;
      continue;
    }

    if (line.startsWith('### ')) {
      blocks.push({
        type: 'heading_3',
        heading_3: {
          rich_text: [{
            type: 'text',
            text: {
              content: line.substring(4)
            }
          }]
        }
      });
      currentListType = null;
      continue;
    }

    // Check for bullet list
    if (line.startsWith('- ') || line.startsWith('* ')) {
      blocks.push({
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: [{
            type: 'text',
            text: {
              content: line.substring(2)
            }
          }]
        }
      });
      currentListType = 'bullet';
      continue;
    }

    // Check for numbered list
    const numberedListMatch = line.match(/^(\d+)\.\s(.+)$/);
    if (numberedListMatch) {
      blocks.push({
        type: 'numbered_list_item',
        numbered_list_item: {
          rich_text: [{
            type: 'text',
            text: {
              content: numberedListMatch[2]
            }
          }]
        }
      });
      currentListType = 'numbered';
      continue;
    }

    // Check for divider
    if (line === '---' || line === '***' || line === '___') {
      blocks.push({
        type: 'divider',
        divider: {}
      });
      currentListType = null;
      continue;
    }

    // Check for quote
    if (line.startsWith('> ')) {
      blocks.push({
        type: 'quote',
        quote: {
          rich_text: [{
            type: 'text',
            text: {
              content: line.substring(2)
            }
          }]
        }
      });
      currentListType = null;
      continue;
    }

    // Default to paragraph
    blocks.push({
      type: 'paragraph',
      paragraph: {
        rich_text: [{
          type: 'text',
          text: {
            content: line
          }
        }]
      }
    });
    currentListType = null;
  }

  return blocks;
}

/**
 * Convert markdown content to Notion blocks with more advanced formatting
 * @param markdown Markdown content to convert
 * @returns Array of Notion blocks
 */
function convertMarkdownToNotionBlocks(markdown: string): any[] {
  const lines = markdown.split('\n');
  const blocks: any[] = [];

  let currentListType: string | null = null;
  let codeBlockLanguage: string | null = null;
  let codeBlockContent: string[] = [];
  let inCodeBlock = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Handle code blocks
    if (line.startsWith('```')) {
      if (!inCodeBlock) {
        // Start of code block
        inCodeBlock = true;
        codeBlockLanguage = line.substring(3).trim() || 'plain text';
        codeBlockContent = [];
      } else {
        // End of code block
        inCodeBlock = false;
        blocks.push({
          type: 'code',
          code: {
            rich_text: [{
              type: 'text',
              text: {
                content: codeBlockContent.join('\n')
              }
            }],
            language: codeBlockLanguage?.toLowerCase() || 'plain text'
          }
        });
        codeBlockLanguage = null;
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockContent.push(line);
      continue;
    }

    // Handle empty lines
    if (line.trim() === '') {
      if (i > 0 && i < lines.length - 1) { // Skip first and last empty lines
        blocks.push({
          type: 'paragraph',
          paragraph: {
            rich_text: []
          }
        });
      }
      currentListType = null;
      continue;
    }

    // Handle headings
    if (line.startsWith('# ')) {
      blocks.push({
        type: 'heading_1',
        heading_1: {
          rich_text: [{
            type: 'text',
            text: {
              content: line.substring(2)
            }
          }]
        }
      });
      currentListType = null;
      continue;
    }

    if (line.startsWith('## ')) {
      blocks.push({
        type: 'heading_2',
        heading_2: {
          rich_text: [{
            type: 'text',
            text: {
              content: line.substring(3)
            }
          }]
        }
      });
      currentListType = null;
      continue;
    }

    if (line.startsWith('### ')) {
      blocks.push({
        type: 'heading_3',
        heading_3: {
          rich_text: [{
            type: 'text',
            text: {
              content: line.substring(4)
            }
          }]
        }
      });
      currentListType = null;
      continue;
    }

    // Handle bullet lists
    if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
      const content = line.trim().startsWith('- ') ? line.trim().substring(2) : line.trim().substring(2);
      blocks.push({
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: [{
            type: 'text',
            text: {
              content: content
            }
          }]
        }
      });
      currentListType = 'bullet';
      continue;
    }

    // Handle numbered lists
    const numberedListMatch = line.trim().match(/^(\d+)\.\s(.+)$/);
    if (numberedListMatch) {
      blocks.push({
        type: 'numbered_list_item',
        numbered_list_item: {
          rich_text: [{
            type: 'text',
            text: {
              content: numberedListMatch[2]
            }
          }]
        }
      });
      currentListType = 'numbered';
      continue;
    }

    // Handle dividers
    if (line.trim() === '---' || line.trim() === '***' || line.trim() === '___') {
      blocks.push({
        type: 'divider',
        divider: {}
      });
      currentListType = null;
      continue;
    }

    // Handle quotes
    if (line.trim().startsWith('> ')) {
      blocks.push({
        type: 'quote',
        quote: {
          rich_text: [{
            type: 'text',
            text: {
              content: line.trim().substring(2)
            }
          }]
        }
      });
      currentListType = null;
      continue;
    }

    // Handle to-do lists
    if (line.trim().match(/^\[[ x]\]\s/i)) {
      const checked = line.trim().match(/^\[x\]\s/i) !== null;
      const content = line.trim().replace(/^\[[ x]\]\s/i, '');
      blocks.push({
        type: 'to_do',
        to_do: {
          rich_text: [{
            type: 'text',
            text: {
              content: content
            }
          }],
          checked: checked
        }
      });
      continue;
    }

    // Default to paragraph
    blocks.push({
      type: 'paragraph',
      paragraph: {
        rich_text: [{
          type: 'text',
          text: {
            content: line
          }
        }]
      }
    });
    currentListType = null;
  }

  return blocks;
}
