import { z } from "zod";

// Notion tools schemas
export const QueryNotionSchema = z.object({
  query: z.string().describe("Text query to search for in Notion."),
  filter: z.object({
    property: z.string().describe("Property to filter by (e.g., 'object')."),
    value: z.string().describe("Value to filter by (e.g., 'page' or 'database').")
  }).optional().describe("Optional filter to apply to the search."),
  sort: z.object({
    direction: z.enum(["ascending", "descending"]).describe("Sort direction."),
    timestamp: z.string().describe("Timestamp to sort by (e.g., 'last_edited_time').")
  }).optional().describe("Optional sort to apply to the search."),
  limit: z.number().int().min(1).max(100).default(10).describe("Maximum number of results to return (default: 10).")
});

export const GetNotionPagePropertiesSchema = z.object({
  notionPageId: z.string().describe("The ID of the Notion page."),
  fetchFileFromProperty: z.string().optional().describe("Optional property to fetch file from.")
});

export const AppendNotionBlockSchema = z.object({
  notionPageId: z.string().describe("The ID of the Notion page to append blocks to."),
  blocks: z.array(z.object({
    type: z.enum(["paragraph", "heading_1", "heading_2", "heading_3", "bulleted_list_item", "numbered_list_item", "to_do", "toggle", "code", "quote", "divider"]).describe("Block type."),
    content: z.string().describe("Block content.")
  })).describe("Blocks to append to the page.")
});

export const CrystallizeToNotionSchema = z.object({
  targetBimbaCoordinate: z.string().regex(/^#[\w.-]+$/, "Must be a valid Bimba coordinate starting with #").describe("The Bimba coordinate of the target node whose Notion page should be updated."),
  contentToAppend: z.string().describe("The text content to convert into blocks and append."),
});
