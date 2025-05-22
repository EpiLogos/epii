import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { notionClient, NOTION_DATABASE_ID } from "../../services/notion.service.mjs";

// Define the Zod schema for the tool's input
// This needs to be flexible enough to handle various Notion property types
const proposeNotionUpdateSchema = z.object({
  title: z.string().describe("The title for the new Notion page/entry."),
  // Properties object structure depends heavily on the target Notion DB schema
  // Using passthrough() for flexibility, but specific properties are better for LLM guidance
  properties: z.object({}).passthrough().describe("An object representing the Notion database properties to set for the new page. Keys should match Notion property names."),
  // Content blocks structure: https://developers.notion.com/reference/block#block-object-keys
  contentBlocks: z.array(z.object({}).passthrough()).optional().describe("An array of Notion block objects representing the page content (e.g., paragraph, heading). See Notion API documentation for block structure.")
});

// Create the DynamicStructuredTool
const proposeNotionUpdateTool = new DynamicStructuredTool({
  name: "proposeNotionUpdate",
  description: `Proposes a new entry to the Crystallized Knowledge database in Notion (ID: ${NOTION_DATABASE_ID || 'Not Set'}). This creates a draft page for human review and verification. Provide the title, structured properties matching the database schema, and optionally content blocks.`,
  schema: proposeNotionUpdateSchema,
  func: async ({ title, properties, contentBlocks }) => {
    console.log(`Proposing Notion update: ${title}`);
    if (!notionClient) {
      return "Error: Notion client is not available. Check Notion service initialization and API key.";
    }
    if (!NOTION_DATABASE_ID) {
        return "Error: Notion Database ID (NOTION_CRYSTALLIZED_DB_ID) is not set. Cannot create page.";
    }

    // Basic validation/transformation for title property if needed
    // Notion expects title property specifically formatted
    const notionProperties = {
        ...properties, // Include other properties passed in
        // Assuming the title property in Notion is named 'Name' or 'Title'
        // Adjust this key based on the actual Notion DB schema
        'Name': { // Or 'Title', check your DB schema
            type: 'title',
            title: [{ type: 'text', text: { content: title } }]
        }
    };

    try {
      const response = await notionClient.pages.create({
        parent: { database_id: NOTION_DATABASE_ID },
        properties: notionProperties,
        ...(contentBlocks && { children: contentBlocks }), // Add content blocks if provided
      });

      console.log(`Successfully created Notion page proposal (ID: ${response.id})`);
      // Return confirmation to the LLM
      return JSON.stringify({ success: true, pageId: response.id, message: "Notion page proposal created successfully." });

    } catch (error) {
      console.error("Error creating Notion page via LangChain tool:", error.body || error);
      // Return a meaningful error message string to the LLM
      return `Error creating Notion page proposal: ${error.message || error.body}`;
    }
  },
});

export { proposeNotionUpdateTool };
