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
  pageId: z.string().describe("ID of the Notion page to retrieve properties from."),
  includeContent: z.boolean().default(true).describe("Whether to include the page content."),
  includeFileContent: z.boolean().default(false).describe("Whether to include file content from file properties."),
  filePropertyName: z.string().optional().describe("Name of the file property to retrieve content from."),
});

export const AppendNotionBlockSchema = z.object({
  pageId: z.string().describe("ID of the Notion page to append blocks to."),
  blocks: z.array(z.record(z.any())).describe("Array of Notion block objects to append."),
});

export const CrystallizeToNotionSchema = z.object({
  targetBimbaCoordinate: z.string().refine(
    (val) => val === '#' || /^#[\w.-]+$/.test(val),
    { message: "Must be a valid Bimba coordinate starting with #" }
  ).describe("The Bimba coordinate of the target node whose Notion page should be updated."),
  contentToAppend: z.string().describe("The text content to convert into blocks and append."),
  title: z.string().optional().describe("Title for the page if it needs to be created."),
  properties: z.record(z.any()).optional().describe("Additional properties to set on the page."),
  createIfNotExists: z.boolean().default(true).describe("Whether to create the page if it doesn't exist."),
  contentFormat: z.enum(["markdown", "plain"]).default("markdown").describe("Format of the content to append."),
  relations: z.array(
    z.object({
      database: z.string().describe("The name or ID of the related database."),
      property: z.string().describe("The name of the relation property."),
      targetPages: z.array(
        z.object({
          id: z.string().describe("The ID of the target page."),
          title: z.string().optional().describe("The title of the target page (for creation if needed).")
        })
      ).describe("The target pages for the relation.")
    })
  ).optional().describe("Relations to establish with other Notion databases.")
});
